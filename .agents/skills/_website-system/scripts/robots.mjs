// Static robots interpretation for common RFC 9309 rules. It is a research
// aid, not a remote-crawl authorization engine. Unsupported directives remain
// visible in the saved source and must be reviewed for the relevant agent.
export function parseRobots(text) {
  const groups=[];const sitemaps=[];const other=[];let group=null;let seenRule=false;
  for(const raw of text.split(/\r?\n/)) {
    const line=raw.replace(/#.*/,'').trim();if(!line)continue;
    const m=line.match(/^([^:]+):\s*(.*)$/);if(!m){other.push({raw});continue;}
    const key=m[1].trim().toLowerCase(),value=m[2].trim();
    if(key==='user-agent') {
      if(!group||seenRule){group={agents:[],rules:[]};groups.push(group);seenRule=false;}
      group.agents.push(value.toLowerCase());
    } else if(key==='sitemap')sitemaps.push(value);
    else if(['allow','disallow'].includes(key)&&group){group.rules.push({directive:key,path:value});seenRule=true;}
    else other.push({directive:key,value});
  }
  return {groups,sitemaps,other};
}
export function robotsDecision(parsed,url,agent) {
  const token=agent.toLowerCase();
  const specific=parsed.groups.filter(g=>g.agents.some(a=>a!=='*'&&token.includes(a)));
  const longest=specific.length?Math.max(...specific.flatMap(g=>g.agents.filter(a=>token.includes(a)).map(a=>a.length))):0;
  const selected=specific.length?specific.filter(g=>g.agents.some(a=>a.length===longest&&token.includes(a))):parsed.groups.filter(g=>g.agents.includes('*'));
  const u=new URL(url);const target=u.pathname+u.search;
  if(/[^\x20-\x7e]|%[0-9a-f]{2}/i.test(target)||selected.some(g=>g.rules.some(r=>/[^\x20-\x7e]|%[0-9a-f]{2}/i.test(r.path))))return {agent,decision:'unknown',reason:'Encoded/non-ASCII paths need a crawler-specific interpretation.'};
  const matching=selected.flatMap(g=>g.rules).filter(r=>{
    if(!r.path)return false;
    let p=r.path;const end=p.endsWith('$');if(end)p=p.slice(0,-1);
    const pattern=p.split('*').map(x=>x.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('.*');
    return new RegExp('^'+pattern+(end?'$':'')).test(target);
  }).sort((a,b)=>b.path.replace(/[*$]/g,'').length-a.path.replace(/[*$]/g,'').length || (a.directive==='allow'?-1:1));
  return {agent,decision:matching[0]?.directive==='disallow'?'disallow':'allow',matched_rule:matching[0]??null};
}
