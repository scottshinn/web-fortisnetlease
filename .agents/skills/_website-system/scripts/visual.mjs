import fs from 'node:fs/promises';
import {require} from './core.mjs';
export async function comparePNGs(before,after,out,threshold=0.02) {
  const {PNG}=require('pngjs');
  const a=PNG.sync.read(await fs.readFile(before)),b=PNG.sync.read(await fs.readFile(after));
  if(a.width!==b.width||a.height!==b.height)return {status:'dimension-mismatch',before:{width:a.width,height:a.height},after:{width:b.width,height:b.height},ratio:null,note:'Different image dimensions require visual review; images were not resized.'};
  let changed=0;const diff=new PNG({width:a.width,height:a.height});
  for(let i=0;i<a.data.length;i+=4){const delta=Math.max(...[0,1,2,3].map(c=>Math.abs(a.data[i+c]-b.data[i+c])));const hit=delta>16;if(hit)changed++;diff.data[i]=hit?235:Math.round(b.data[i]*.3);diff.data[i+1]=hit?30:Math.round(b.data[i+1]*.3);diff.data[i+2]=hit?90:Math.round(b.data[i+2]*.3);diff.data[i+3]=255;}
  await fs.writeFile(out,PNG.sync.write(diff));
  const ratio=changed/(a.width*a.height);
  return {status:ratio>threshold?'review':'within-threshold',changed_pixels:changed,total_pixels:a.width*a.height,ratio,threshold,diff:out,note:'Simple RGBA difference with 16/255 channel tolerance, no anti-alias suppression. A diff is evidence, not design or accessibility approval.'};
}
