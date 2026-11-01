import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
export const require = createRequire(import.meta.url);
export const support = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const hash = x => crypto.createHash('sha256').update(x).digest('hex');
export const stamp = () => new Date().toISOString();
export const readJSON = async p => JSON.parse(await fs.readFile(p, 'utf8'));
export async function writeJSON(p, value) {
  await fs.mkdir(path.dirname(p), {recursive:true});
  const tmp = `${p}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2) + '\n');
  await fs.rename(tmp, p);
}
export function normalizeURL(value) {
  const u = new URL(value);
  if (!['https:', 'http:'].includes(u.protocol) || u.username || u.password) throw Error('Use an HTTP(S) URL without embedded credentials.');
  u.hash = '';
  return u.href;
}
export function siteID(url) {
  const u = new URL(normalizeURL(url));
  return u.hostname.replace(/[^a-z0-9-]/gi, '-').toLowerCase() + '-' + hash(u.origin).slice(0, 10);
}
export function inside(root, relative) {
  if (typeof relative !== 'string' || !relative || relative.includes('\\') || path.isAbsolute(relative)) throw Error('Expected a portable relative path.');
  const result = path.resolve(root, relative);
  if (!result.startsWith(path.resolve(root) + path.sep)) throw Error('Path escapes the data root.');
  return result;
}
// Validator for the explicit JSON Schema subset used by this package. Unknown
// schema keywords are errors so a future schema cannot silently lose validation.
export function validateSchema(value, schema, root = schema, at = '$') {
  const supported = new Set(['$schema','$id','$defs','$ref','title','description','type','const','enum','anyOf','required','properties','additionalProperties','items','minItems','minLength','pattern','minimum','maximum']);
  for (const key of Object.keys(schema)) if (!supported.has(key)) throw Error(`Unsupported schema keyword ${key}`);
  if (schema.$ref) {
    if (!schema.$ref.startsWith('#/')) throw Error('Only local schema references are supported.');
    const target = schema.$ref.slice(2).split('/').reduce((s,k)=>s?.[k],root);
    if (!target) throw Error('Missing schema reference');
    return validateSchema(value,target,root,at);
  }
  if (schema.anyOf) {
    const matches = schema.anyOf.some(s=>{try{validateSchema(value,s,root,at);return true;}catch{return false;}});
    if (!matches) throw Error(`${at}: no allowed schema matched`);
  }
  const type = Array.isArray(value)?'array':value===null?'null':typeof value;
  if (schema.type && !(Array.isArray(schema.type)?schema.type:[schema.type]).some(t=>t===type || t==='integer'&&Number.isInteger(value))) throw Error(`${at}: expected ${schema.type}, got ${type}`);
  if ('const' in schema && JSON.stringify(value)!==JSON.stringify(schema.const)) throw Error(`${at}: wrong constant`);
  if (schema.enum && !schema.enum.includes(value)) throw Error(`${at}: unsupported value ${value}`);
  if (type==='string') {
    if (value.length<(schema.minLength??0)) throw Error(`${at}: string too short`);
    if (schema.pattern&&!new RegExp(schema.pattern).test(value)) throw Error(`${at}: invalid string format`);
  }
  if (type==='number' && (value<(schema.minimum??-Infinity)||value>(schema.maximum??Infinity))) throw Error(`${at}: out of bounds`);
  if (type==='array') {
    if (value.length<(schema.minItems??0)) throw Error(`${at}: insufficient items`);
    if(schema.items)value.forEach((v,i)=>validateSchema(v,schema.items,root,`${at}[${i}]`));
  }
  if(type==='object') {
    for(const k of schema.required??[])if(!(k in value))throw Error(`${at}: missing ${k}`);
    for(const [k,v] of Object.entries(value)) {
      if(schema.properties&&Object.hasOwn(schema.properties,k))validateSchema(v,schema.properties[k],root,`${at}.${k}`);
      else if(schema.additionalProperties===false)throw Error(`${at}: unknown field ${k}`);
      else if(schema.additionalProperties&&typeof schema.additionalProperties==='object')validateSchema(v,schema.additionalProperties,root,`${at}.${k}`);
    }
  }
  return true;
}
export async function validate(value, name) {
  return validateSchema(value, await readJSON(path.join(support,'schemas',`${name}.schema.json`)));
}
export async function withLock(root, fn) {
  await fs.mkdir(root,{recursive:true});
  const lock = path.join(root,'.write-lock');
  let handle;
  try { handle=await fs.open(lock,'wx'); }
  catch(e){if(e.code==='EEXIST')throw Error('Rolodex is locked. Finish the other writer; remove a stale .write-lock only after confirming no writer is running.');throw e;}
  try {await handle.writeFile(JSON.stringify({pid:process.pid,started_at:stamp()}));return await fn();}
  finally {await handle.close();await fs.unlink(lock);}
}
export async function records(root) {
  let names; try {names=await fs.readdir(path.join(root,'records'));} catch(e){if(e.code==='ENOENT')return [];throw e;}
  return Promise.all(names.filter(x=>x.endsWith('.json')).sort().map(x=>readJSON(path.join(root,'records',x))));
}
export async function saveRecord(root,record) {
  await validate(record,'site');
  const p=inside(root,`records/${record.id}.json`);
  try {const old=await fs.readFile(p,'utf8');await fs.mkdir(path.join(root,'history',record.id),{recursive:true});await fs.writeFile(path.join(root,'history',record.id,`${stamp().replace(/[:.]/g,'-')}-${crypto.randomUUID().slice(0,8)}.json`),old);}
  catch(e){if(e.code!=='ENOENT')throw e;}
  record.updated_at=stamp();
  await writeJSON(p,record);
}
export function newRecord(url) {
  return {schema_version:1,id:siteID(url),origin:new URL(url).origin,created_at:stamp(),updated_at:stamp(),classification:{industry:[],style:[],technology:[],components:[]},design_notes:[],captures:[],design_systems:[],seo_quality:'unknown'};
}
export async function search(root,filters={}) {
  const all=await records(root);
  return all.filter(r=>{
    for(const k of ['industry','style','technology','components'])if(filters[k]&&!r.classification[k].some(x=>x.toLowerCase()===filters[k].toLowerCase()))return false;
    if(filters.seo&&r.seo_quality!==filters.seo)return false;
    return !filters.q||JSON.stringify(r).toLowerCase().includes(filters.q.toLowerCase());
  });
}
export async function verifyRoot(root) {
  await fs.access(path.join(root,'records'));
  const all=await records(root);let files=0;
  for(const r of all) {
    await validate(r,'site');
    if(r.id!==siteID(r.origin))throw Error(`Identity mismatch ${r.id}`);
    for(const capture of r.captures) {
      const meta=await readJSON(inside(root,capture.path));
      await validate(meta,'capture');
      if(meta.site_id!==r.id||meta.id!==capture.id||meta.final_url!==capture.url)throw Error(`Capture identity mismatch ${capture.id}`);
      if(!meta.artifacts.some(a=>a.path==='capture-data.json'))throw Error('Capture data missing from manifest');
      for(const a of meta.artifacts) {
        const p=inside(path.dirname(inside(root,capture.path)),a.path);
        const stat=await fs.lstat(p);
        if(stat.isSymbolicLink())throw Error('Evidence symlinks are not portable');
        const bytes=await fs.readFile(p);
        if(hash(bytes)!==a.sha256)throw Error(`Evidence hash mismatch: ${a.path}`);
        files++;
      }
    }
    for(const d of r.design_systems)await validate(await readJSON(inside(root,d.path)),'design-system');
  }
  return {records:all.length,verified_artifacts:files};
}
