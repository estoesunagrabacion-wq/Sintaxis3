/* --- ronda rápida: preguntas generadas con los análisis del banco --- */
let Q=null;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function shuf(arr,rnd){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function sentTxt(it){return txt(it,0,it.k.length-1);}
const TYPE_OF={pis:'PIS',pia:'PIA',adv:'PIAdv',coo:'coord'};
const NEXO_RE=/^(que|qué|si|como|cómo|cuando|cuándo|donde|dónde|adonde|quien|quién|quienes|quiénes|cual|cuales|cuyo|cuya|cuyos|cuyas|aunque|porque|pues|mientras|pero|y|o|ni|sino|cuanto|apenas)$/i;
const SE_G={OD:['OI','REF_OD','REC_OD'],OI:['OD','REF_OI','REC_OI'],REF_OD:['REF_OI','REC_OD','OD'],REF_OI:['REF_OD','REC_OI','OI'],REC_OD:['REC_OI','REF_OD','OD'],REC_OI:['REC_OD','REF_OI','OI'],SCR:['REF_OD','PAS','IMP'],PAS:['IMP','SCR','OI'],IMP:['PAS','SCR','OD']};
const FN_CORE=['Suj','OD','OI','PSO','PSNO','CAg'],FN_CIRC=['CCL','CCT','CCM','CCCn','CCCa','CCI','CCCo'];
function sample(arr,n,rnd){return shuf(arr,rnd).slice(0,n);}
function nexoLike(it){return it.k.filter(t=>t.w&&NEXO_RE.test(t.t)).length>=2;}
function propCt(p){return p.nexo&&p.nexo.ct?p.nexo.ct:(p.ct==='yux'?'yux':null);}
function genCands(u){
  const pool=ALL.filter(i=>i.r&&(u==='all'||i.u===u));
  const C={tipo:[],vf:[],nexo:[],ante:[],esp:[],nfun:[],pf:[],pcls:[],advs:[],ctype:[],cuenta:[],comp:[],se:[],fn:[]};
  pool.forEach(it=>{
    (it.props||[]).forEach(p=>{
      if(u!=='all'&&p.t!==TYPE_OF[u])return;
      const n=p.nexo;
      if(u==='all')C.tipo.push({it,p});
      if(n&&nexoLike(it))C.nexo.push({it,p});
      if(p.t==='PIA'){C.esp.push({it,p});C.vf.push({it,p});if(n&&n.a!=null&&it.k[n.a])C.ante.push({it,p});if(n&&n.nf)C.nfun.push({it,p});}
      if(p.t==='PIS'){C.pf.push({it,p});C.vf.push({it,p});C.pcls.push({it,p});if(n&&(n.c==='rel'||n.c==='int')&&n.nf)C.nfun.push({it,p});}
      if(p.t==='PIAdv'){C.advs.push({it,p});C.vf.push({it,p});}
      if(p.t==='coord'&&propCt(p)){C.ctype.push({it,p});C.vf.push({it,p});}
    });
    if(it.u==='coo'&&it.props&&it.props.length>=2&&(u==='coo'||u==='all'))C.cuenta.push({it});
    if(it.u==='coo'&&(u==='coo'||u==='all')&&(it.m==='simple'||(it.props||[]).length>=2))C.comp.push({it});
    (it.prons||[]).forEach(pn=>{if(String(pn.p).indexOf('/')<0)C.se.push({it,pn});});
    if(it.m==='func')(it.spans||[]).forEach(sp=>{if(String(sp.fn).indexOf('/')<0)C.fn.push({it,sp});});
  });
  return C;
}
function optsFrom(goods,pool,label,rnd,total){
  const dis=sample(pool.filter(x=>!goods.includes(x)),Math.max(0,(total||4)-goods.length),rnd);
  return shuf(goods.concat(dis),rnd).map(v=>({t:label(v),ok:goods.includes(v)}));
}
function buildQ(kind,c,rnd){
  const it=c.it,S=sentTxt(it),p=c.p,n=p&&p.nexo,P=p?'«'+txt(it,p.s,p.e)+'»':'';
  const E=p?resumen(p,it).join(' '):'';
  const optQ=(q,opts,e)=>({k:'opt',it,kind,sent:S,q,opts,e});
  if(kind==='tipo')return optQ('¿Qué tipo de proposición es '+P+'?',shuf(TYPES,rnd).map(t=>({t:t.t,ok:t.v===p.t})),E);
  if(kind==='esp')return optQ('¿Es especificativa o explicativa? '+P,shuf([{t:'Especificativa',ok:p.sub==='esp'},{t:'Explicativa',ok:p.sub==='exp'}],rnd),E);
  if(kind==='nfun'){const g=alts(n.nf);return optQ('¿Qué función cumple el nexo «'+txt(it,n.s,n.e)+'» dentro de '+P+'?',optsFrom(g,['Suj','OD','PSO','CCL','CCT','CCM','CCCn','CCCa','CCCo','Term','MD'].filter(x=>!g.includes(x)),v=>FN[v]||(v==='MD'?'Modificador directo':v==='Term'?'Término de la preposición':v),rnd),E);}
  if(kind==='pf'){const g=alts(p.f);return optQ('¿Qué función cumple '+P+' en la oración?',optsFrom(g,PF_PIS,v=>FN[v]||(v==='Apos'?'Aposición':v==='Term'?'Término de la preposición':v),rnd),E);}
  if(kind==='pcls'){const v=p.sub==='dd'?'dd':n.c;return optQ('Clasificá '+P+' según su nexo.',shuf(PCLS,rnd).map(o=>({t:o.t,ok:o.v===v})),E);}
  if(kind==='advs'){const o=ADV.map(x=>x.v);return optQ('¿Qué clase de proposición adverbial es '+P+'?',optsFrom([p.sub],o,v=>ADV.find(x=>x.v===v).t,rnd),E);}
  if(kind==='ctype'){const v=propCt(p);return optQ('¿Cómo está unida '+P+' con la proposición anterior?',optsFrom([v],CT.map(x=>x.v),x=>CT.find(y=>y.v===x).t,rnd),E);}
  if(kind==='cuenta'){const m=it.props.length;const os=[m-1,m,m+1,m+2].filter(x=>x>=1).slice(0,4);return optQ('¿Cuántas proposiciones coordinadas tiene la oración?',shuf(os,rnd).map(x=>({t:String(x),ok:x===m})),'Son '+m+': '+it.props.map(q=>'«'+txt(it,q.s,q.e)+'»').join('; ')+'.');}
  if(kind==='comp'){const simple=it.m==='simple';
    const e=simple?(it.n||'Un solo sujeto para los dos verbos: oración simple bimembre con predicado compuesto.'):('Cada verbo tiene su propio sujeto: son '+it.props.length+' proposiciones coordinadas.'+(it.n?' '+it.n:''));
    return optQ('¿Cómo se clasifica esta oración?',shuf([{t:'Oración compuesta por coordinación',ok:!simple},{t:'Oración simple bimembre con predicado compuesto',ok:simple},{t:'Oración compuesta por subordinación',ok:false}],rnd),e);}
  if(kind==='vf'){
    const truth=rnd()<0.5;let claim,real;
    if(p.t==='PIA'){const w=truth?p.sub:(p.sub==='esp'?'exp':'esp');claim=P+' es una proposición adjetiva '+(w==='esp'?'especificativa':'explicativa')+'.';}
    else if(p.t==='PIS'){const g=alts(p.f)[0];const w=truth?g:sample(PF_PIS.filter(x=>!alts(p.f).includes(x)),1,rnd)[0];claim=P+' cumple la función de '+fnName(w).toLowerCase()+'.';}
    else if(p.t==='PIAdv'){const w=truth?p.sub:sample(ADV.map(x=>x.v).filter(x=>x!==p.sub),1,rnd)[0];claim=P+' es una proposición adverbial '+ADV_L[w]+'.';}
    else{const v=propCt(p);const w=truth?v:sample(CT.map(x=>x.v).filter(x=>x!==v),1,rnd)[0];claim=P+' está unida con la anterior por coordinación '+CT_L[w]+'.';}
    return optQ('¿Verdadero o falso? '+claim,[{t:'Verdadero',ok:truth},{t:'Falso',ok:!truth}],(truth?'Es verdadero. ':'Es falso. ')+E);}
  if(kind==='nexo'){const a=[];for(let i=n.s;i<=n.e;i++)a.push(i);return {k:'tap',it,kind,mark:[],q:'Tocá el nexo que introduce '+P+'.',ans:a,e:E};}
  if(kind==='ante'){return {k:'tap',it,kind,mark:[n.s],q:'Tocá el antecedente de «'+txt(it,n.s,n.e)+'» (resaltado).',ans:[n.a],e:'«'+txt(it,n.s,n.e)+'» reemplaza a «'+it.k[n.a].t+'», que es su antecedente.'};}
  if(kind==='se'){const pn=c.pn,g=alts(pn.p)[0];return optQ('¿Qué es «'+txt(it,pn.s,pn.e)+'» en esta oración?',shuf([g].concat(SE_G[g]),rnd).map(v=>({t:LEAF[v],ok:v===g})),LEAF[g]+'.'+(it.n?' '+it.n:''));}
  if(kind==='fn'){const sp=c.sp,g=alts(sp.fn)[0];const grp=FN_CORE.includes(g)?FN_CORE:FN_CIRC;const other=FN_CORE.includes(g)?FN_CIRC:FN_CORE;
    const ds=sample(grp.filter(x=>x!==g),2,rnd).concat(sample(other,1,rnd));
    return optQ('¿Qué función cumple «'+txt(it,sp.s,sp.e)+'»?',shuf([g].concat(ds),rnd).map(v=>({t:FN[v],ok:v===g})),FN_HINT[g]||'');}
}
function genRound(u,seed,n){
  const rnd=mulberry(seed),C=genCands(u);
  const kinds=shuf(Object.keys(C).filter(k=>C[k].length),rnd);
  Object.keys(C).forEach(k=>C[k]=shuf(C[k],rnd));
  const qs=[];
  [true,false].forEach(strict=>{
    let alive=kinds.slice(),i=0,guard=0;
    while(qs.length<n&&alive.length&&guard++<400){
      const k=alive[i%alive.length];
      const idx=C[k].findIndex(x=>!qs.some(q=>q.it===x.it&&(strict||q.kind===k)));
      if(idx<0){alive.splice(alive.indexOf(k),1);continue;}
      const c=C[k].splice(idx,1)[0];qs.push(buildQ(k,c,rnd));i++;
    }
  });
  return shuf(qs,rnd);
}
function startRound(u,seed){
  const s=seed||Math.floor(Math.random()*1e9)+1;
  const qs=genRound(u,s,8);
  if(!qs.length)return;
  Q={u,seed:s,qs,i:0,errs:0,good:0,wrongs:[],tapWrong:[],solved:false,reveal:false,miss:false,done:false};
  R=null;
  if(u!=='all'){store.tab=u;store.view='practica';}else store.tab='inicio';
  save();render();window.scrollTo(0,0);
}
function roundCard(){
  const card=h('div',{class:'card','data-ex':'round'});
  const title=Q.u==='all'?'Ronda mixta':'Ronda rápida';
  card.append(h('div',{class:'exhead'},h('h3',{},title),h('div',{class:'row'},h('button',{class:'tbtn','data-act':'leave',onclick:()=>{Q=null;render();window.scrollTo(0,0);}},'Salir'))));
  const b=h('div',{});card.append(b);
  if(Q.done){
    const best=(store.q||{})[Q.u]||0;
    b.append(h('div',{class:'res'},h('div',{class:'big'},Q.good===Q.qs.length?'★':'✓'),h('h3',{},Q.good+' de '+Q.qs.length+' a la primera'),h('p',{class:'muted',style:'margin:4px 0 0'},'Mejor resultado en esta ronda: '+best+' de '+Q.qs.length+'.')));
    b.append(h('div',{class:'row',style:'margin-top:14px'},h('button',{class:'btn','data-act':'again',onclick:()=>startRound(Q.u)},'Otra ronda'),h('button',{class:'btn alt',onclick:()=>{Q=null;render();window.scrollTo(0,0);}},'Volver')));
    return card;
  }
  const x=Q.qs[Q.i];
  b.append(h('div',{class:'pen',style:'color:var(--muted)'},'Pregunta '+(Q.i+1)+' de '+Q.qs.length));
  b.append(h('p',{class:'q',style:'font-size:1.2rem'},x.q));
  const closed=Q.solved||Q.reveal;
  if(x.k==='opt'){
    b.append(h('div',{class:'callout',style:'margin:6px 0 10px'},x.sent));
    const grid=h('div',{class:'opts col1'});
    x.opts.forEach((o,k)=>{const wr=Q.wrongs.includes(k);const good=closed&&o.ok;
      grid.append(h('button',{class:'opt'+(wr?' bad':'')+(good?' good':''),'data-ok':o.ok?'1':'0',disabled:wr||closed,onclick:()=>roundAnswer(o.ok,k)},o.t));});
    b.append(grid);
  } else {
    const el=sentEl(x.it,[],i=>{const c=[];if(x.mark.includes(i))c.push('nxok');if(Q.tapWrong.includes(i))c.push('wrong');if(closed&&x.ans.includes(i))c.push('ok');return c;},closed?null:(i=>roundAnswer(x.ans.includes(i),i)));
    b.append(el);
  }
  if(Q.msg&&!closed)b.append(Q.msg);
  if(closed){b.append(fb(Q.solved?'ok':'info',Q.solved?'Correcto':'La respuesta correcta es la marcada',Q.qs[Q.i].e));
    b.append(h('div',{class:'row',style:'margin-top:10px'},h('button',{class:'btn','data-act':'rnext',onclick:roundNext},Q.i+1<Q.qs.length?'Siguiente':'Ver resultado')));}
  return card;
}
function roundAnswer(ok,k){
  const x=Q.qs[Q.i];
  if(ok){Q.solved=true;Q.msg=null;if(!Q.miss)Q.good++;}
  else{Q.miss=true;Q.errs++;if(x.k==='opt')Q.wrongs.push(k);else Q.tapWrong.push(k);
    if(Q.wrongs.length+Q.tapWrong.length>=2){Q.reveal=true;Q.msg=null;}
    else Q.msg=fb('bad','No es esa','Releé la consigna y probá otra vez.');}
  rerenderRound();
}
function roundNext(){
  if(Q.i+1<Q.qs.length){Q.i++;Q.wrongs=[];Q.tapWrong=[];Q.solved=false;Q.reveal=false;Q.miss=false;Q.msg=null;}
  else{Q.done=true;store.q=store.q||{};if((store.q[Q.u]||0)<Q.good)store.q[Q.u]=Q.good;save();}
  rerenderRound();
  window.scrollTo(0,0);
}
function rerenderRound(){const old=q('[data-ex]');const y=window.scrollY;if(old){old.replaceWith(roundCard());window.scrollTo(0,y);}else render();}
