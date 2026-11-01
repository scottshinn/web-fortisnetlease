#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readJSON,writeJSON,inside,records,search,verifyRoot,validate,withLock,saveRecord,hash} from './core.mjs';
import {captureSite} from './capture.mjs';
import {extractDesign,tokensCSS} from './design.mjs';
import {auditCapture,auditMarkdown} from './audit.mjs';
import {comparePNGs} from './visual.mjs';
const help=`Website rolodex toolkit 1.1.0 (Node 20+)

capture --url URL --rolodex DIR [--channel chrome|msedge] [--wait-for CSS] [--settle-ms 500] [--check-links 0..50]
search --rolodex DIR [--q TEXT] [--industry TAG] [--style TAG] [--technology TAG] [--components TAG] [--seo QUALITY]
curate --rolodex DIR --site ID --file CURATION.json
extract --rolodex DIR --site ID [--capture ID] --output DESIGN.json
attach-design --rolodex DIR --site ID --file DESIGN.json
css --file REVIEWED-DESIGN.json --output tokens.css
audit --file CAPTURE-DATA.json [--output REPORT.json] [--fail-on error|warning]
visual-diff --before PNG --after PNG --output DIFF.png [--threshold 0.02]
validate --rolodex DIR | validate --file FILE.json --schema site|capture|design-system|curation|architecture
index --rolodex DIR [--output INDEX.md]

Quality values: unknown, high-risk, needs-review, no-major-automated-findings.
Filters combine with AND, tags match case-insensitively. Query scans metadata and design notes.
No background crawl. Capture visits one URL at three widths. Link checking is opt-in and bounded.
Exit: 0 completed; 1 runtime/validation/arguments error; 2 requested audit gate or visual review threshold failed.
`;
function args(argv){const [command,...rest]=argv,options={};for(let i=0;i<rest.length;i++){const k=rest[i];if(!k.startsWith('--')||!rest[i+1]||rest[i+1].startsWith('--'))throw Error(`Expected --option value at ${k}`);if(k.slice(2) in options)throw Error(`Duplicate option ${k}`);options[k.slice(2)]=rest[++i];}return {command,options};}
function requireKeys(o,...keys){for(const k of keys)if(!o[k])throw Error(`Missing --${k}`);}
function integer(value,fallback,min,max){const n=value===undefined?fallback:Number(value);if(!Number.isInteger(n)||n<min||n>max)throw Error(`Expected integer ${min}..${max}`);return n;}
export async function main(argv) {
  if(!argv.length||['help','--help','-h'].includes(argv[0])){console.log(help);return 0;}
  const {command,options:o}=args(argv);let result;
  const allowed={capture:['url','rolodex','channel','wait-for','settle-ms','check-links'],search:['rolodex','q','industry','style','technology','components','seo'],curate:['rolodex','site','file'],extract:['rolodex','site','capture','output'],'attach-design':['rolodex','site','file'],css:['file','output'],audit:['file','output','fail-on'],'visual-diff':['before','after','output','threshold'],validate:['rolodex','file','schema'],index:['rolodex','output']};
  if(!allowed[command])throw Error(`Unknown command ${command}`);
  for(const k of Object.keys(o))if(!allowed[command].includes(k))throw Error(`Unknown option --${k}`);
  if(command==='capture'){
    requireKeys(o,'url','rolodex');result=await captureSite({url:o.url,rolodex:o.rolodex,channel:o.channel,waitFor:o['wait-for'],settleMs:integer(o['settle-ms'],500,0,5000),checkLinks:integer(o['check-links'],0,0,50)});
  }else if(command==='search'){
    requireKeys(o,'rolodex');result=await search(o.rolodex,o);
  }else if(command==='curate'){
    requireKeys(o,'rolodex','site','file');const patch=await readJSON(o.file);await validate(patch,'curation');
    await withLock(o.rolodex,async()=>{const r=await readJSON(inside(o.rolodex,`records/${o.site}.json`));if(patch.classification)for(const [key,tags] of Object.entries(patch.classification))r.classification[key]=[...new Set([...r.classification[key],...tags].map(s=>s.trim().toLowerCase()))].sort();if(patch.design_notes)for(const note of patch.design_notes)if(!r.design_notes.some(n=>JSON.stringify(n)===JSON.stringify(note)))r.design_notes.push(note);await saveRecord(o.rolodex,r);result=r;});
  }else if(command==='extract'){
    requireKeys(o,'rolodex','site','output');result=await extractDesign(o.rolodex,o.site,o.capture);await writeJSON(o.output,result);result={output:o.output,status:result.status};
  }else if(command==='attach-design'){
    requireKeys(o,'rolodex','site','file');const design=await readJSON(o.file);await validate(design,'design-system');
    await withLock(o.rolodex,async()=>{const r=await readJSON(inside(o.rolodex,`records/${o.site}.json`));const rel=`design-systems/${design.id}-${hash(JSON.stringify(design)).slice(0,10)}.json`;await writeJSON(inside(o.rolodex,rel),design);if(!r.design_systems.some(d=>d.path===rel))r.design_systems.push({id:design.id,path:rel,status:design.status});await saveRecord(o.rolodex,r);result={path:rel,status:design.status};});
  }else if(command==='css'){
    requireKeys(o,'file','output');const d=await readJSON(o.file);await validate(d,'design-system');await fs.mkdir(path.dirname(o.output),{recursive:true});await fs.writeFile(o.output,tokensCSS(d));result={output:o.output};
  }else if(command==='audit'){
    requireKeys(o,'file');if(o['fail-on']&&!['error','warning'].includes(o['fail-on']))throw Error('Use --fail-on error or warning');const report=auditCapture(await readJSON(o.file));if(o.output){await writeJSON(o.output,report);await fs.writeFile(o.output.replace(/\.json$/,'')+'.md',auditMarkdown(report));}result=report;
    console.log(JSON.stringify(result,null,2));return (o['fail-on']==='error'&&report.summary.errors)||(o['fail-on']==='warning'&&(report.summary.errors||report.summary.warnings))?2:0;
  }else if(command==='visual-diff'){
    requireKeys(o,'before','after','output');const threshold=o.threshold===undefined?.02:Number(o.threshold);if(!Number.isFinite(threshold)||threshold<0||threshold>1)throw Error('Threshold must be between 0 and 1');await fs.mkdir(path.dirname(o.output),{recursive:true});result=await comparePNGs(o.before,o.after,o.output,threshold);console.log(JSON.stringify(result,null,2));return result.status==='within-threshold'?0:2;
  }else if(command==='validate'){
    if(o.rolodex){result=await verifyRoot(o.rolodex);}else{requireKeys(o,'file','schema');if(!['site','capture','design-system','curation','architecture'].includes(o.schema))throw Error('Unknown schema');await validate(await readJSON(o.file),o.schema);result={valid:true,file:o.file};}
  }else if(command==='index'){
    requireKeys(o,'rolodex');const list=await records(o.rolodex);const escape=s=>String(s).replace(/\|/g,'\\|').replace(/[\r\n]/g,' ');const out=o.output||path.join(o.rolodex,'INDEX.md');
    await fs.mkdir(path.dirname(out),{recursive:true});await fs.writeFile(out,'# Design rolodex\n\nGenerated from JSON records; edit records through curation, not this index.\n\n| Site | Industry | Style | Technology | Components | SEO review |\n|---|---|---|---|---|---|\n'+list.map(r=>'| '+[r.origin,...['industry','style','technology','components'].map(k=>r.classification[k].join(', ')),r.seo_quality].map(escape).join(' | ')+' |').join('\n')+'\n');result={output:out,records:list.length};
  }
  console.log(JSON.stringify(result,null,2));return 0;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))main(process.argv.slice(2)).then(code=>{process.exitCode=code;}).catch(e=>{console.error(e.message);process.exitCode=1;});
