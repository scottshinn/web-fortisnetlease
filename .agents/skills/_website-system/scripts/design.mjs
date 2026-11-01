import {stamp,readJSON,inside,validate} from './core.mjs';
import path from 'node:path';
export async function extractDesign(root,site,captureID) {
  const record=await readJSON(inside(root,`records/${site}.json`));
  const ref=captureID?record.captures.find(c=>c.id===captureID):record.captures.at(-1);
  if(!ref)throw Error('No matching capture');
  const captureDir=path.posix.dirname(ref.path);
  const data=await readJSON(inside(root,`${captureDir}/capture-data.json`));
  const tokens={color:{},typography:{},spacing:{},shape:{},layout:{},motion:{}};
  const mapping={color:['color','background-color'],typography:['font-family','font-size','font-weight','line-height','letter-spacing'],spacing:['padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-bottom','gap'],shape:['border-radius','box-shadow'],layout:['max-width','grid-template-columns'],motion:['transition-duration']};
  // Measured candidates are deliberately not named "primary", "accent", etc.
  // Only a reviewed design decision may assign a semantic role.
  for(const [category,properties] of Object.entries(mapping))for(const property of properties){
    const values=new Map();
    for(const view of data.views)for(const sample of view.dom.visual.samples){const value=sample.styles[property];if(!value||['none','normal','0px','rgba(0, 0, 0, 0)'].includes(value))continue;const found=values.get(value)??[];if(found.length<5)found.push({source:`${captureDir}/${view.name}.extract.json`,selector:sample.selector,viewport:view.name});values.set(value,found);}
    [...values].sort((a,b)=>b[1].length-a[1].length).slice(0,5).forEach(([value,evidence],i)=>{tokens[category][`${property}-${i+1}`]={value,evidence,confidence:'high',note:'Computed value from bounded samples; role and frequency across the whole site are unverified.'};});
  }
  const patterns=data.views[0].dom.visual.sections.map((s,i)=>({name:`section-candidate-${i+1}`,purpose:s.heading||s.tag,selector:s.selector,evidence:[{source:`${captureDir}/desktop.png`,selector:s.selector,viewport:'desktop'}],anatomy:[`Observed ${s.tag} with ${s.children} immediate children; display: ${s.layout}`],responsive:[],accessibility:[],use_when:'',avoid_when:''}));
  const design={schema_version:1,id:`${site}-${ref.id.slice(0,10)}-${ref.id.slice(-8)}`,status:'draft-measured',sources:[ref.path],tokens,patterns,design_notes:[],decisions:[],limitations:['Computed CSS is a sample, not the original authoring tokens.','Semantic roles, responsive rules and component suitability require screenshot and DOM review.','Motion was reduced during capture; inspect live interaction before prescribing motion.','Fonts may be fallbacks; verify font requests and licensing.'],created_at:stamp()};
  await validate(design,'design-system');return design;
}
export function tokensCSS(design) {
  // Export only reviewed choices, never claim candidates form a finished system.
  if(design.status!=='reviewed')throw Error('Review and name token roles before exporting CSS.');
  const lines=[];
  for(const [category,values] of Object.entries(design.tokens))for(const [key,t] of Object.entries(values)){
    if(!/^[a-z][a-z0-9-]*$/.test(key)||/[;{}]|<\//.test(t.value))throw Error('Unsafe CSS token name/value; edit the reviewed design JSON.');
    lines.push(`  --${category}-${key}: ${t.value};`);
  }
  return ':root {\n'+lines.join('\n')+'\n}\n';
}
