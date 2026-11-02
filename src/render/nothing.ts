import { svg, txt, esc, fit, wrap, textWidth, mix, icon } from "./kit";
import { projectList, projectView, socials, buttons } from "./blocks";
import { palette } from "./palette";
import type { Config, Data, Icons } from "./types";

export function nothingCards(c: Config, d: Data, icons: Icons, avatar: string | null, dark: boolean) {
  const p = palette(c.seed, c.scheme, dark);
  const a = { typography: "matrix", radius: 19, speed: 1, entrance: true, dots: true, glyph: true, ...c.appearance };
  const radius = Math.max(0, Math.min(32, Number(a.radius) || 0));
  const speed = Math.max(.25, Math.min(3, Number(a.speed) || 1));
  const out: Record<string, string> = {};
  const css = `.typewriter{transform-box:fill-box;animation:typing ${2/speed}s steps(28) both}@keyframes typing{from{clip-path:inset(0 100% 0 0)}to{clip-path:inset(0 0 0 0)}}text{font-family:Mono,monospace}.display{font-family:${a.typography === "essential" ? "Editorial" : "Matrix"},monospace;font-weight:400!important}.caption{font-family:Matrix,monospace;letter-spacing:1px}.enter{animation:reveal ${.65 / speed}s ease both;animation-delay:var(--delay,0s)}.dot{animation:dot ${5 / speed}s ease-in-out infinite;animation-delay:var(--delay,0s)}.glyph{animation:glyph ${6 / speed}s ease-in-out infinite}.scan{transform-origin:left;animation:scan ${6 / speed}s ease-in-out infinite}@keyframes reveal{from{opacity:.1;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}@keyframes dot{0%,60%,100%{opacity:1}80%{opacity:.25}}@keyframes glyph{0%,65%,100%{opacity:1}80%{opacity:.3}}@keyframes scan{0%,100%{transform:scaleX(.25)}50%{transform:scaleX(1)}}${!a.entrance ? '.enter{animation:none}' : ''}${!a.dots ? '.dot{animation:none}' : ''}${!a.glyph ? '.glyph,.scan{animation:none}' : ''}`;
  const rect = (x:number,y:number,w:number,h:number,fill=p.surfaceContainer,r=radius) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}"/>`;
  const label = (x:number,y:number,s:string) => txt(x,y,s.toUpperCase(),14,p.onSurfaceVariant,{cls:"caption"});
  const display = (x:number,y:number,s:string,size=30,fill=p.onSurface) => txt(x,y,s,size,fill,{cls:"display"});
  const enter = (s:string,n=0) => `<g class="enter" style="--delay:${n*.08}s">${s}</g>`;
  const emit = (key:string,h:number,body:string,w=840,title=key) => {out[key]=svg(w,h,rect(0,0,w,h)+body,title,c.motion,css)};
  const lines=(s:string,x:number,y:number,width:number,size=16,max=3)=>wrap(s,size,width,400,max).map((line,n)=>txt(x,y+n*(size+9),line,size,p.onSurfaceVariant)).join("");
  const glyph = (x:number,y:number) => Array.from({length:12},(_,n)=>{const t=n*Math.PI/6;return `<circle class="glyph" cx="${x+Math.cos(t)*28}" cy="${y+Math.sin(t)*28}" r="3" fill="${n===2?p.primary:p.onSurface}"/>`}).join("");
  const name=c.hero.name||c.login;
  const nameSize=Math.min(47,560/Math.max(1,textWidth(name,1)));
  let head=label(28,34,`PROFILE ( ${fit(c.login,14,600)} )`)+glyph(773,68);
  if(avatar) head+=`<defs><clipPath id="avatar"><circle cx="71" cy="116" r="39"/></clipPath></defs><image href="${esc(avatar)}" x="32" y="77" width="78" height="78" clip-path="url(#avatar)"/>`;
  else head+=glyph(71,116);
  head+=enter(txt(138,91,c.hero.greeting,16,p.onSurfaceVariant)+display(135,147,fit(name,nameSize,630),nameSize));
  const subtitle=lines(c.hero.subtitle,32,199,760,17,2);
  head+=c.hero.typing && c.motion && a.entrance ? `<g class="typewriter">${subtitle}</g>` : enter(subtitle,2);
  let chipX=32;
  c.hero.chips.forEach(item=>{const s=fit(item.label,13,220),w=textWidth(s,13)+28;if(chipX+w>806)return;head+=rect(chipX,254,w,30,p.surfaceContainerHighest,15)+txt(chipX+14,274,s,13,p.onSurfaceVariant);chipX+=w+10});
  if(c.hero.typing) head+=`<rect class="glyph" x="32" y="228" width="8" height="3" fill="${p.primary}"/>`;
  head+=`<g transform="translate(32 305)"><rect class="scan" width="776" height="2" fill="${p.primary}"/></g>`;
  emit("hero",322,head,840,name);
  emit("about",100+c.about.items.length*43,label(28,34,c.about.title)+c.about.items.map((item,n)=>enter(icon(icons,item.icon,30,58+n*43,20,p.primary)+txt(66,75+n*43,fit(item.label,16,735),16,p.onSurface),n)).join(""));
  let stackY=68,sb=label(28,34,c.stack.title);
  for(const group of c.stack.groups){sb+=label(28,stackY,group.title);stackY+=18;let x=28;for(const item of group.items){const s=fit(item.label,14,250),width=textWidth(s,14)+60;if(x+width>812){x=28;stackY+=48}sb+=enter(rect(x,stackY,width,36,p.surfaceContainerHighest,18)+icon(icons,item.icon,x+12,stackY+9,18,p.onSurface)+txt(x+38,stackY+24,s,14,p.onSurface));x+=width+10}stackY+=68}emit("stack",stackY,sb);
  projectList(c,d).forEach((repo,n)=>{const v=projectView(c,repo,n),key=repo.name.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"x";emit(`project-${key}`,232,label(24,32,`PROJECT ( ${String(n+1).padStart(2,"0")} )`)+icon(icons,v.icon,365,18,21,p.primary)+enter(display(24,88,fit(v.title,27,360),27),n)+enter(lines(v.text,24,125,360,15,2),n+1)+txt(24,207,fit(repo.language||"CODE",12,220),12,p.onSurfaceVariant)+txt(384,207,`★ ${repo.stars}`,13,p.onSurface,{anchor:"end"}),412,repo.name)});
  const metrics:[string,number][]=[[c.stats.repos,d.repos],[c.stats.stars,d.stars],[c.stats.contributions,d.contributions],[c.stats.followers,d.followers]];
  let stat=label(28,34,c.stats.title);
  metrics.forEach(([l,v],n)=>{const x=28+n*199;stat+=enter(rect(x,59,187,105,p.surfaceContainerHighest)+display(x+18,112,fit(String(v),34,155),34,n===1?p.primary:p.onSurface)+txt(x+18,144,fit(l,12,155),12,p.onSurfaceVariant),n)});
  stat+=label(28,203,c.stats.calendar);
  const days=d.days.flat(),columns=Math.max(7,Math.ceil(days.length/3)),pitch=Math.min(34,776/columns),peak=Math.max(1,...days.map(v=>v?.c||0));
  days.forEach((day,n)=>{const x=35+(n%columns)*pitch,y=230+Math.floor(n/columns)*24,color=day?.c?mix(p.onSurface,p.primary,Math.min(1,day.c/peak)):p.outlineVariant;stat+=`<circle class="${day?.c?'dot':''}" style="--delay:${(n%columns)*.08}s" cx="${x}" cy="${y}" r="${Math.min(6,pitch*.22)}" fill="${color}"><title>${day?`${day.day}: ${day.c}`:'—'}</title></circle>`});
  let sy=320;
  if(c.stats.showLanguages){stat+=label(28,sy,c.stats.languages);sy+=25;const total=d.languages.reduce((sum,[,v])=>sum+v,0)||1;let x=28;d.languages.forEach(([,v],n)=>{const w=776*v/total;stat+=rect(x,sy,Math.max(0,w-3),7,n%2?p.onSurface:p.primary,3);x+=w});sy+=36;let lx=28;d.languages.forEach(([name,v])=>{const s=`${name} ${Math.round(v/total*100)}%`,width=textWidth(s,12)+24;if(lx+width>812){lx=28;sy+=24}stat+=txt(lx,sy,s,12,p.onSurfaceVariant);lx+=width});sy+=24}emit("stats",sy+12,stat);
  emit("streak",198,label(28,34,c.streak.title)+[[d.streak.current,c.streak.current],[d.streak.longest,c.streak.longest]].map(([value,l],n)=>enter(rect(28+n*398,59,386,111,p.surfaceContainerHighest)+display(52+n*398,119,String(value),44,n===0?p.primary:p.onSurface)+txt(52+n*398,148,fit(String(l),14,330),14,p.onSurfaceVariant),n)).join(""));
  emit("wave",32,Array.from({length:70},(_,n)=>`<circle class="dot" style="--delay:${n*.05}s" cx="${8+n*12}" cy="16" r="2" fill="${n%11===0?p.primary:p.onSurfaceVariant}"/>`).join(""));
  // Preserve link grouping, brand colors, outlined links and card options.
  Object.assign(out, socials({ c, d, p, i: icons }), buttons({ c, d, p, i: icons }));
  for (const key of Object.keys(out).filter(key => /^(social|button)-/.test(key))) {
    out[key] = out[key].replace('</style>', `${!a.entrance ? '.pop,.up,.fade,.grow{animation:none!important}' : ''}.spin,.spin-r,.bob{animation:none}</style>`);
  }
  out.credit=svg(320,32,txt(160,21,"PROFILE ( NOTHING INSPIRED )",12,p.onSurfaceVariant,{anchor:"middle",cls:"caption"}),"Nothing Profile",false,css);
  return out;
}
