(function(){
'use strict';
const ALL = __ITEMS__;
const ITEMS = ALL.filter(i=>!i.r);
const BYID = {}; ITEMS.forEach(i=>BYID[i.id]=i);

/* ---------- vocabulario ---------- */
const FN = {Suj:'Sujeto',NV:'Núcleo verbal',OD:'Objeto directo',OI:'Objeto indirecto',PSO:'Predicativo subjetivo obligatorio',PSNO:'Predicativo subjetivo no obligatorio',CAg:'Complemento agente',CCL:'Circunstancial de lugar',CCT:'Circunstancial de tiempo',CCM:'Circunstancial de modo',CCCn:'Circunstancial de cantidad',CCCa:'Circunstancial de causa',CCI:'Circunstancial de instrumento',CCCo:'Circunstancial de compañía',SCR:'Signo de cuasirreflejo',MD:'Modificador directo',Term:'Término',Apos:'Aposición',CCons:'Complemento consecutivo',MNO:'Modificador del núcleo oracional'};
const FN_HINT = {
 Suj:'Concuerda con el verbo: si cambiás su número, cambia el verbo.',
 NV:'Es el verbo conjugado (con sus auxiliares, si los tiene).',
 OD:'Se puede reemplazar por lo, la, los, las; en voz pasiva pasa a ser sujeto.',
 OI:'Se puede reemplazar por le o les.',
 PSO:'Va con ser, estar o parecer y concuerda con el sujeto.',
 PSNO:'Modifica al verbo y al sujeto (concuerda con él), pero el verbo no es copulativo.',
 CAg:'Aparece en voz pasiva, con «por»; en voz activa pasa a ser el sujeto.',
 CCL:'Responde a ¿dónde?',CCT:'Responde a ¿cuándo?',CCM:'Responde a ¿cómo?',CCCn:'Responde a ¿cuánto?',CCCa:'Responde a ¿por qué?',CCI:'Responde a ¿con qué?',CCCo:'Responde a ¿con quién?',
 SCR:'Es el «se» (o me, te, nos) que coincide con el sujeto pero no es reflejo ni recíproco.'
};
const FN_PALETTE = ['Suj','NV','OD','OI','PSO','PSNO','CAg','CCL','CCT','CCM','CCCn','CCCa','CCI','CCCo','SCR'];
const NF_OPTS = ['Suj','OD','OI','PSO','CCL','CCT','CCM','CCCn','CCCa','CCCo','MD','Term'];
const PF_PIS = ['Suj','OD','PSO','Apos','Term'];
const PF_ADV = ['CCL','CCT','CCM','CCCn','CCCa','CCons','MNO'];
const ADV_FN = {loc:'CCL',temp:'CCT',mod:'CCM',cuant:'CCCn',caus:'CCCa',cons:'CCons',conc:'MNO',cond:'MNO'};
const TYPES=[{v:'coord',t:'Coordinada'},{v:'PIA',t:'Incluida adjetiva'},{v:'PIS',t:'Incluida sustantiva'},{v:'PIAdv',t:'Incluida adverbial'}];
const TYPE_L={coord:'coordinada',PIA:'incluida adjetiva',PIS:'incluida sustantiva',PIAdv:'incluida adverbial'};
const CT=[{v:'cop',t:'Copulativa'},{v:'dis',t:'Disyuntiva'},{v:'adv',t:'Adversativa'},{v:'exp',t:'Explicativa'},{v:'yux',t:'Yuxtapuesta'}];
const CT_L={cop:'copulativa',dis:'disyuntiva',adv:'adversativa',exp:'explicativa',yux:'yuxtapuesta'};
const NCLASS=[{v:'rel',t:'Relacionante',d:'cumple una función dentro de la proposición'},{v:'sub',t:'Subordinante',d:'sólo marca la subordinación'}];
const PCLS=[{v:'sub',t:'Con nexo subordinante',d:'que, si'},{v:'rel',t:'Con nexo relacionante',d:'el que, lo que, quien, donde…'},{v:'dd',t:'Sin nexo: discurso directo',d:'entre comillas'},{v:'int',t:'Sin nexo: interrogativa o exclamativa indirecta',d:'qué, quién, dónde… con tilde'}];
const ADV=[{v:'loc',t:'Locativa',g:'Con función circunstancial'},{v:'temp',t:'Temporal',g:'Con función circunstancial'},{v:'mod',t:'Modal',g:'Con función circunstancial'},{v:'cuant',t:'Cuantitativa',g:'Con función circunstancial'},{v:'caus',t:'Causal',g:'Con función circunstancial'},{v:'cons',t:'Consecutiva',g:'Sin función circunstancial'},{v:'conc',t:'Concesiva',g:'Sin función circunstancial'},{v:'cond',t:'Condicional',g:'Sin función circunstancial'}];
const ADV_L={loc:'locativa',temp:'temporal',mod:'modal',cuant:'cuantitativa',caus:'causal',cons:'consecutiva',conc:'concesiva',cond:'condicional'};
const PI_COLORS=['var(--p0)','var(--p1)','var(--p2)','var(--p3)'];

const UNITS=[
 {id:'rep',name:'Repaso',sub:'Modificadores del verbo',desc:'Sujeto, OD, OI, predicativos, complemento agente y circunstanciales.',cu:'Cuadernillo 1'},
 {id:'coo',name:'Coordinadas',sub:'Proposiciones coordinadas',desc:'Qué es una proposición y cómo se unen las coordinadas.',cu:'Cuadernillo 1'},
 {id:'pia',name:'Adjetivas',sub:'Proposiciones incluidas adjetivas',desc:'Relacionantes, antecedente, especificativas y explicativas.',cu:'Cuadernillo 1'},
 {id:'pis',name:'Sustantivas',sub:'Proposiciones incluidas sustantivas',desc:'Con nexo y sin nexo, discurso indirecto, queísmo y dequeísmo.',cu:'Cuadernillo 2'},
 {id:'pro',name:'Pronombres',sub:'Pronombres personales como modificadores del verbo',desc:'OD, OI, reflejos, recíprocos, cuasirreflejos, pasiva con se y se impersonal.',cu:'Cuadernillo 2'},
 {id:'adv',name:'Adverbiales',sub:'Proposiciones incluidas adverbiales',desc:'Circunstanciales, consecutivas, concesivas y condicionales.',cu:'Cuadernillo 3'}
];
const GROUPS={
 rep:[[/^rep-1/,'Ejercicio 1: analizar las oraciones']],
 coo:[[/^coo-1/,'Ejercicio 1: analizar las oraciones']],
 pia:[[/^pia-1/,'Ejercicio 1: analizar las oraciones'],[/^pia-2/,'Ejercicio 2: detectar y corregir errores'],[/^pia-3/,'Ejercicio 3: explicativa o especificativa']],
 pis:[[/^pis-1/,'Ejercicio 1: reconocer y clasificar'],[/^pis-2/,'Ejercicio 2: analizar'],[/^pis-3/,'Ejercicio 3: combinados con adjetivas'],[/^pis-4/,'Ejercicio 4: queísmo y dequeísmo'],[/^pis-5/,'Ejercicio 5: de adjetiva a sustantiva']],
 pro:[[/^pro-\d/,'Ejercicio a: pronombres'],[/^pro-b/,'Ejercicio b: combinados con proposiciones']],
 adv:[[/^adv-a/,'Ejercicio a: analizar'],[/^adv-b/,'Ejercicio b: condiciones real, posible e imposible'],[/^adv-d/,'Ejercicio d: combinados'],[/^adv-e/,'Distinguir: ¿adjetiva, adverbial o sustantiva?'],[/^adv-f/,'Ejercicio f: más análisis']]
};
function unitItems(u){return ITEMS.filter(i=>i.u===u);}

/* ---------- árbol de pronombres ---------- */
const YN=[{v:'si',t:'Sí'},{v:'no',t:'No'}];
const TREE={
 N0:{q:'¿El pronombre coincide con el sujeto en persona y número?',o:[{v:'si',t:'Sí, coincide'},{v:'no',t:'No coincide'}],nx:{si:'N1',no:'N0b'}},
 N0b:{q:'Reemplazalo por «le/les» o por «lo/la/los/las». ¿Cuál queda bien?',o:[{v:'OI',t:'le / les',d:'objeto indirecto'},{v:'OD',t:'lo / la / los / las',d:'objeto directo'}],code:{OI:'OI',OD:'OD'}},
 N1:{q:'¿Admite «a sí mismo», «a mí mismo», «a vos mismo»…?',o:YN,nx:{si:'N1f',no:'N2'}},
 N1f:{q:'Es un reflejo puro. ¿Qué función cumple?',o:[{v:'OD',t:'Objeto directo'},{v:'OI',t:'Objeto indirecto'}],code:{OD:'REF_OD',OI:'REF_OI'}},
 N2:{q:'¿Admite «entre ellos», «mutuamente», «uno al otro»? (sólo en plural)',o:YN,nx:{si:'N2f',no:'N3'}},
 N2f:{q:'Es un recíproco. ¿Qué función cumple?',o:[{v:'OD',t:'Objeto directo'},{v:'OI',t:'Objeto indirecto'}],code:{OD:'REC_OD',OI:'REC_OI'}},
 N3:{q:'¿El verbo se puede conjugar en todas las personas? (yo me caigo, vos te caés, él se cae…)',o:[{v:'si',t:'Sí, en todas'},{v:'no',t:'No, sólo en tercera'}],nx:{no:'N4'},code:{si:'SCR'}},
 N4:{q:'¿La oración admite sujeto? ¿El verbo concuerda con lo que sigue?',o:[{v:'si',t:'Sí, lo que sigue es el sujeto'},{v:'no',t:'No, lo que sigue es un objeto o no hay sujeto'}],code:{si:'PAS',no:'IMP'}}
};
const PATHS={
 OD:[['N0','no'],['N0b','OD']],OI:[['N0','no'],['N0b','OI']],
 REF_OD:[['N0','si'],['N1','si'],['N1f','OD']],REF_OI:[['N0','si'],['N1','si'],['N1f','OI']],
 REC_OD:[['N0','si'],['N1','no'],['N2','si'],['N2f','OD']],REC_OI:[['N0','si'],['N1','no'],['N2','si'],['N2f','OI']],
 SCR:[['N0','si'],['N1','no'],['N2','no'],['N3','si']],
 PAS:[['N0','si'],['N1','no'],['N2','no'],['N3','no'],['N4','si']],
 IMP:[['N0','si'],['N1','no'],['N2','no'],['N3','no'],['N4','no']]
};
const LEAF={OD:'Objeto directo',OI:'Objeto indirecto',REF_OD:'Reflejo puro, objeto directo',REF_OI:'Reflejo puro, objeto indirecto',REC_OD:'Recíproco, objeto directo',REC_OI:'Recíproco, objeto indirecto',SCR:'Signo de cuasirreflejo (SCR)',PAS:'Marca de pasiva con se',IMP:'Marca de se impersonal'};
const TREE_HINT={
 N0:(c)=>PATHS[c][0][1]==='si'?'Compará la persona del pronombre con la del verbo («me compré»: yo / me). Tené en cuenta que el «se» de la pasiva, de la impersonal y de los cuasirreflejos es de tercera persona, como el verbo.':'Acá el pronombre no remite a la misma persona que el verbo (por ejemplo «te vimos»: nosotros / vos). Si no coinciden, el pronombre es un objeto.',
 N0b:()=>'Probá las dos opciones: la que suena bien (aunque cambie un poco el sentido) te dice si es OI u OD. Si hay un «lo» al lado, el «se» reemplaza a un «le».',
 N1:()=>'Probá agregar «a sí mismo», «a mí mismo», «a vos mismo», «a ellos mismos»… Si funciona, es un reflejo puro.',
 N1f:()=>'Fijate si la oración ya tiene otro objeto directo: si lo tiene («se secó las lágrimas»), el pronombre es OI. Si no («se peina»), es OD.',
 N2:()=>'Los recíprocos sólo van en plural y admiten «entre ellos», «mutuamente», «uno al otro».',
 N2f:()=>'Fijate si la oración ya tiene otro objeto directo: si lo tiene («se dieron la mano»), el pronombre es OI. Si no («se saludaron»), es OD.',
 N3:()=>'Probá conjugar: «yo me caigo, vos te caés, él se cae». Si el verbo con su pronombre funciona en todas las personas, es un cuasirreflejo común. La pasiva y la impersonal sólo existen en tercera.',
 N4:()=>'En la pasiva el verbo concuerda con lo que sigue («se abrió una puerta / se abrieron las puertas»). En la impersonal no varía, porque lo que sigue es un OD («se come pescado / se come pastas»).'
};

/* ---------- almacenamiento ---------- */
const KEY='sx3-v1';
let store={p:{},q:{},tab:'inicio',view:'teoria',cur:null};
function load(){try{const j=localStorage.getItem(KEY);if(j){const o=JSON.parse(j);if(o&&typeof o==='object')store=Object.assign(store,o);}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(store));}catch(e){}}
function stat(id){return store.p[id]||null;}
function unitDone(u){const l=unitItems(u);return [l.filter(i=>stat(i.id)).length,l.length];}

/* ---------- utilidades DOM ---------- */
function h(tag,props){
  const el=document.createElement(tag);
  props=props||{};
  for(const k in props){
    const v=props[k]; if(v==null||v===false) continue;
    if(k==='class') el.className=v;
    else if(k==='html') el.innerHTML=v;
    else if(k.startsWith('on')) el[k]=v;
    else if(k==='style') el.setAttribute('style',v);
    else el.setAttribute(k,v===true?'':v);
  }
  for(let i=2;i<arguments.length;i++) add(el,arguments[i]);
  return el;
}
function add(el,c){ if(c==null||c===false) return; if(Array.isArray(c)) c.forEach(x=>add(el,x)); else el.append(c.nodeType?c:document.createTextNode(c)); }
function q(s,el){return (el||document).querySelector(s);}
function txt(it,s,e){let r='';for(let i=s;i<=e;i++){const t=it.k[i];if(i>s&&t.s)r+=' ';r+=t.t;}return r;}
function hash(s){let x=0;for(let i=0;i<s.length;i++)x=(x*31+s.charCodeAt(i))|0;return Math.abs(x);}
function seeded(arr,seed){const a=arr.slice();let s=seed||1;for(let i=a.length-1;i>0;i--){s=(s*1103515245+12345)&0x7fffffff;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
const alts=v=>String(v).split('/');
const fnName=c=>FN[alts(c)[0]]||c;

/* ---------- oración con corchetes ---------- */
function sentEl(it,spans,cls,onTap){
  const el=h('div',{class:'sent'+(onTap?' tap':''),'aria-label':'Oración'});
  it.k.forEach((t,i)=>{
    if(t.s){const sp0=h('span',{class:'sp '+((i>0&&cls&&cls(i).includes('in')&&cls(i-1).includes('in'))?'in':'')},' ');el.append(sp0);}
    spans.filter(sp=>sp.s===i).sort((a,b)=>b.e-a.e).forEach(sp=>el.append(h('span',{class:'br',style:'--pc:'+PI_COLORS[sp.c%4],'aria-hidden':'true'},sp.g==='c'?'[':'(',h('sub',{},sp.n))));
    const w=h('span',{class:'w '+((cls&&cls(i))||[]).join(' '),'data-i':i},t.t);
    if(onTap&&t.w){w.tabIndex=0;w.setAttribute('role','button');w.onclick=()=>onTap(i);w.onkeydown=ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();onTap(i);}};}
    el.append(w);
    spans.filter(sp=>sp.e===i).sort((a,b)=>a.s-b.s).forEach(sp=>el.append(h('span',{class:'br',style:'--pc:'+PI_COLORS[sp.c%4],'aria-hidden':'true'},sp.g==='c'?']':')')));
  });
  return el;
}

/* ---------- estado de la app ---------- */
let R=null;           // ejercicio en curso
let overlay=null;
const app=q('#app');

function setTab(tab,view){store.tab=tab;if(view)store.view=view;save();try{history.replaceState(null,'','#'+tab);}catch(e){}R=null;Q=null;render();window.scrollTo(0,0);}

function render(){
  app.innerHTML='';app.dataset.u=store.tab;
  app.append(renderTop(),h('main',{id:'main'},renderMain()));
  const t=q('#tree-slot');if(t)renderTreeTheory(t);
}
function renderTop(){
  const frag=document.createDocumentFragment();
  const top=h('div',{class:'top'});
  frag.append(h('div',{class:'bar'},
    h('div',{class:'brand'},'Sintaxis',h('small',{},'3.º año')),
    h('div',{class:'tools'},
      h('button',{class:'tbtn',onclick:()=>openSheet(curUnit()||'pis')},'Teoría'),
      h('button',{class:'tbtn',onclick:()=>openSheet('abrev')},'Abrev.'),
      h('button',{class:'tbtn',onclick:()=>openSheet('prog')},'Progreso'))));
  const tabs=h('div',{class:'tabs',role:'tablist'});
  const all=[{id:'inicio',name:'Inicio'}].concat(UNITS);
  all.forEach(u=>{
    const b=h('button',{class:'tab',role:'tab','aria-selected':store.tab===u.id?'true':'false','data-tab':u.id,onclick:()=>setTab(u.id,store.tab===u.id?store.view:(store.view||'teoria'))},u.name,u.id==='inicio'?null:h('span',{class:'n'},unitDone(u.id).join('/')));
    tabs.append(b);
  });
  top.append(tabs);frag.append(top);
  setTimeout(()=>{const s=q('.tab[aria-selected="true"]',tabs);if(s&&s.scrollIntoView)try{s.scrollIntoView({inline:'center',block:'nearest'});}catch(e){}},0);
  return frag;
}
function curUnit(){return store.tab==='inicio'?null:store.tab;}
function ctx(){
  const u=UNITS.find(x=>x.id===store.tab);const l=unitItems(u.id);const n=l.indexOf(R.it)+1;
  const parts=[u.name,n+' de '+l.length];
  if(R.stage==='props'&&!R.done)parts.push('Proposición '+(R.pi+1));
  return h('div',{class:'ctx'},parts.join(' · '));
}
function renderMain(){
  if(store.tab==='inicio')return Q?h('div',{},roundCard()):renderHome();
  const u=UNITS.find(x=>x.id===store.tab);
  const wrap=h('div',{});
  if(!(store.view==='practica'&&R&&!Q))wrap.append(h('h2',{class:'uh'},u.sub),h('p',{class:'muted uc'},u.cu+' · '+u.desc));
  if(!(store.view==='practica'&&R&&!Q))wrap.append(h('div',{class:'sub',role:'group'},
    h('button',{class:'seg','aria-pressed':store.view==='teoria'?'true':'false',onclick:()=>{store.view='teoria';save();R=null;render();}},'Teoría'),
    h('button',{class:'seg','aria-pressed':store.view==='practica'?'true':'false',onclick:()=>{store.view='practica';save();render();}},'Práctica ('+unitDone(u.id).join('/')+')')));
  if(store.view==='teoria'){
    const teo=h('div',{class:'card teo',html:TEORIA[u.id]});accordion(teo);wrap.append(teo);
    const next=h('div',{class:'row',style:'margin-top:14px'},h('button',{class:'btn',onclick:()=>{store.view='practica';save();render();window.scrollTo(0,0);}},'Pasar a la práctica'));
    wrap.append(next);
  } else wrap.append(Q?roundCard():R?renderEx():renderList(u));
  return wrap;
}

function accordion(el){
  const hs=[...el.querySelectorAll(':scope > h4')];
  if(hs.length<2)return;
  hs.forEach((hd,k)=>{
    const d=h('details',{class:'tsec'});
    const s=h('summary',{},hd.textContent);d.append(s);
    let n=hd.nextSibling;const move=[];
    while(n&&!(n.nodeType===1&&n.tagName==='H4')){move.push(n);n=n.nextSibling;}
    hd.replaceWith(d);move.forEach(m=>d.append(m));
    if(k===0&&!d.querySelector('#tree-slot'))d.open=true;
  });
}
/* ---------- inicio ---------- */
function renderHome(){
  const w=h('div',{});
  const tot=ITEMS.length,done=ITEMS.filter(i=>stat(i.id)).length;
  w.append(h('div',{class:'hero'},h('h2',{},'Aprender sintaxis, oración por oración'),
    h('p',{style:'max-width:56ch;font-family:Literata,Georgia,serif;font-size:1.05rem;margin:0'},'Un apoyo para estudiar en casa lo que se ve en clase. Sigue los tres cuadernillos: cada pestaña es un tema, con su teoría y ejercicios que se corrigen al instante.')));
  w.append(h('div',{class:'demo','aria-label':'Ejemplo de análisis'},
    h('div',{class:'s',html:'El hombre <span class="pia">(<span class="nx">que</span> la contrató)</span> era un alto jefe.'}),
    h('div',{class:'note pen'},'↑ incluida adjetiva: «que» reemplaza a «hombre»'),
    h('div',{class:'note pen'},'Vos marcás, tocás y respondés; la app corrige.')));
  const cont=store.cur&&BYID[store.cur];
  const row=h('div',{class:'row',style:'margin:4px 0 14px'});
  if(cont)row.append(h('button',{class:'btn',onclick:()=>{store.tab=cont.u;store.view='practica';startItem(cont.id);}},'Seguir donde quedé: '+UNITS.find(x=>x.id===cont.u).name+' '+cont.l.replace('Ej. ','')));
  else row.append(h('button',{class:'btn',onclick:()=>setTab('rep','teoria')},'Empezar por el repaso'));
  row.append(h('button',{class:'btn alt','data-act':'round-all',onclick:()=>startRound('all')},'Ronda mixta'));
  w.append(row);
  const idx=h('div',{class:'card sheetp'},h('h3',{},'Índice'));
  const ul=h('ul',{class:'indice'});
  UNITS.forEach(u=>{const d=unitDone(u.id);ul.append(h('li',{},h('button',{class:'irow','data-tab':u.id,style:'--tc:var(--u-'+u.id+')',onclick:()=>setTab(u.id,'teoria')},
    h('div',{class:'l1'},h('span',{class:'nm'},u.name),h('span',{class:'dots2'}),h('span',{class:'cnt'},d[0]+'/'+d[1])),
    h('p',{},u.cu+'. '+u.desc),h('div',{class:'meter'},h('i',{style:'width:'+Math.round(100*d[0]/d[1])+'%'})))));});
  idx.append(ul);w.append(idx);
  w.append(h('div',{class:'callout',style:'margin-top:16px'},h('b',{},'Prototipo en prueba. '),'Las claves son un borrador a revisar por el profesor; cuando un análisis admite más de una lectura, se marca como «discutible». Tu avance ('+done+' de '+tot+') se guarda en este dispositivo.'));
  return w;
}

/* ---------- lista de práctica ---------- */
function renderList(u){
  const w=h('div',{});
  const list=unitItems(u.id);
  const next=list.find(i=>!stat(i.id));
  const bq=(store.q||{})[u.id];
  const acts=h('div',{class:'acts'});
  if(next)acts.append(h('button',{class:'btn',onclick:()=>startItem(next.id)},'Seguir con '+next.l.replace('Ej. ','Ej. ')));
  else acts.append(h('div',{class:'muted'},'¡Completaste todos los ejercicios!'));
  acts.append(h('button',{class:'btn alt','data-act':'round',onclick:()=>startRound(u.id)},'Ronda rápida'+(bq!=null?' (mejor '+bq+'/8)':'')));
  w.append(acts);
  const groups=(GROUPS[u.id]||[]).map(([re,title])=>[title,list.filter(i=>re.test(i.id))]).filter(g=>g[1].length);
  const openIdx=Math.max(0,groups.findIndex(g=>next&&g[1].includes(next)));
  groups.forEach(([title,g],gi)=>{
    const chips=h('div',{class:'chips'});
    g.forEach(i=>{const s=stat(i.id);const lab=i.l.replace('Ej. ','').replace('(posible)','pos.').replace('(imposible)','imp.');
      chips.append(h('button',{class:'chip'+(s?' done':'')+(s&&s.p?' star':'')+(store.cur===i.id?' cur':''),'data-id':i.id,'aria-label':'Ejercicio '+lab+(s?(s.p?', hecho sin errores':', hecho'):''),onclick:()=>startItem(i.id)},lab));});
    const nd=g.filter(i=>stat(i.id)).length;
    const d=h('details',{class:'grp'});if(groups.length<=2||gi===openIdx)d.open=true;
    d.append(h('summary',{},h('span',{class:'gt'},title),h('span',{class:'gc'+(nd===g.length?' full':'')},nd+'/'+g.length)),chips);
    w.append(d);
  });
  w.append(h('p',{class:'muted',style:'margin-top:18px;font-size:.9rem'},'★ hecho sin errores. Construir o completar oraciones se hace en clase.'));
  return w;
}

/* ---------- ejercicios ---------- */
function startItem(id){
  const it=BYID[id];store.cur=id;store.tab=it.u;store.view='practica';save();
  Q=null;R={it,errs:0,helped:false,checks:0,msg:null,done:false};
  if(it.m==='props'){R.stage='mark';R.marks=[];R.first=null;R.pi=0;R.ps=it.props.map(()=>null);R.badMsgs=[];}
  else if(it.m==='pron'){R.stage='pron';initPron();}
  else if(it.m==='func'){R.stage='func';R.marks=[];R.first=null;R.pending=null;}
  else if(it.m==='choice'){R.stage='choice';R.opts=seeded(it.o,hash(it.id));R.wrongs=[];R.reveal=false;R.solved=false;}
  render();window.scrollTo(0,0);
}
function renderEx(){
  const it=R.it;const card=h('div',{class:'card','data-ex':it.id});
  card.append(h('div',{class:'exhead'},h('div',{},h('h3',{},it.l),ctx()),h('div',{class:'row'},
    h('button',{class:'tbtn',onclick:()=>{R=null;render();}},'← Lista'),
    h('button',{class:'tbtn',onclick:()=>startItem(it.id)},'Reiniciar'))));
  const body=h('div',{});
  card.append(body);
  if(R.done)renderResult(body);
  else if(R.stage==='choice')renderChoice(body);
  else if(R.stage==='func')renderFunc(body);
  else if(R.stage==='mark')renderMark(body);
  else if(R.stage==='props')renderProps(body);
  else if(R.stage==='pron')renderPron(body);
  return card;
}
function rerender(){const old=q('[data-ex]');if(!old){render();return;}const y=window.scrollY;const nu=renderEx();old.replaceWith(nu);window.scrollTo(0,y);}
function fb(kind,title,text){return h('div',{class:'fb '+kind,role:'status'},title?h('b',{class:'t'},title):null,text);}

/* --- marcado de proposiciones --- */
function renderMark(b){
  const it=R.it,n=it.props.length;
  b.append(h('p',{class:'q'},'Marcá las proposiciones'));
  b.append(h('p',{class:'help'},'Tocá la primera y la última palabra de cada proposición (incluidas y coordinadas). Hay '+n+' para marcar. Si una proposición tiene una sola palabra, tocala dos veces.'));
  const spans=R.marks.map((m,k)=>({s:m.s,e:m.e,c:k,n:k+1,g:'i'}));
  b.append(sentEl(it,spans,i=>R.first===i?['sel']:[],onTapMark));
  const ml=h('div',{class:'marks'});
  R.marks.forEach((m,k)=>ml.append(h('span',{class:'mk '+(m.ok?'ok':''),style:'--pc:'+PI_COLORS[k%4]},h('em',{},(k+1)+'. '+txt(it,m.s,m.e)),m.ok?null:h('button',{'aria-label':'Quitar marca',onclick:()=>{R.marks.splice(k,1);R.msg=null;rerender();}},'×'))));
  b.append(ml);
  if(R.first!=null)b.append(h('p',{class:'help'},'Empieza en «'+it.k[R.first].t+'». Tocá la palabra donde termina.'));
  if(R.msg)b.append(R.msg);
  const row=h('div',{class:'row'},h('button',{class:'btn','data-act':'check',disabled:!R.marks.length||R.marks.some(m=>!m.ok)&&false?null:null,onclick:checkMarks},'Comprobar'));
  if(R.checks>=3)row.append(h('button',{class:'btn alt',onclick:revealMarks},'Mostrame las proposiciones'));
  b.append(row);
}
function onTapMark(i){
  if(R.first==null){R.first=i;}
  else{const s=Math.min(R.first,i),e=Math.max(R.first,i);R.first=null;
    if(!R.marks.some(m=>m.s===s&&m.e===e))R.marks.push({s,e,ok:false});}
  R.msg=null;rerender();
}
function checkMarks(){
  const it=R.it;R.checks++;
  const keys=it.props;const okMarks=[];const bad=[];
  R.marks.forEach(m=>{const k=keys.find(p=>p.s===m.s&&p.e===m.e);if(k)m.ok=true;else bad.push(m);});
  const matched=keys.filter(p=>R.marks.some(m=>m.ok&&m.s===p.s&&m.e===p.e));
  const missing=keys.length-matched.length;
  if(!bad.length&&!missing){
    // ordenar marcas por posición para numerar
    R.marks.sort((a,b)=>a.s-b.s||b.e-a.e);
    R.stage='props';R.pi=0;R.msg=null;R.ps=keys.map(()=>null);activate(0);rerender();return;
  }
  R.errs+=bad.length+ (bad.length?0:1);
  const parts=[];
  bad.forEach(m=>{
    const near=keys.filter(p=>!(p.e<m.s||p.s>m.e)).sort((a,b)=>Math.abs(a.s-m.s)+Math.abs(a.e-m.e)-Math.abs(b.s-m.s)-Math.abs(b.e-m.e))[0];
    let t='«'+txt(it,m.s,m.e)+'» no coincide con ninguna proposición.';
    if(near){ if(near.s===m.s)t+=' Empieza bien, pero termina en otro lado.'; else if(near.e===m.e)t+=' Termina bien, pero empieza en otro lado.'; else t+=' Se superpone con una proposición, pero los límites no son esos.'; }
    else t+=' Fijate que cada proposición tiene su propio verbo.';
    parts.push(h('div',{},t));
  });
  if(missing)parts.push(h('div',{},missing===1?'Te falta marcar 1 proposición.':'Te faltan marcar '+missing+' proposiciones.'));
  parts.push(h('div',{class:'muted'},'Pista: cada proposición tiene un verbo; el nexo forma parte de la proposición que introduce (en las coordinadas, el nexo queda afuera). Las marcas incorrectas se quitaron.'));
  R.marks=R.marks.filter(m=>m.ok);
  R.msg=fb('bad','Todavía no',parts);
  rerender();
}
function revealMarks(){
  R.helped=true;R.errs++;
  R.marks=R.it.props.map(p=>({s:p.s,e:p.e,ok:true}));R.marks.sort((a,b)=>a.s-b.s||b.e-a.e);
  R.stage='props';R.pi=0;R.ps=R.it.props.map(()=>null);R.msg=null;activate(0);rerender();
}

/* --- preguntas por proposición --- */
function buildSteps(p){
  const n=p.nexo,S=[{k:'type'}];
  if(p.t==='coord'){ if(n)S.push({k:'nexo'},{k:'ctype'}); else if(p.ct==='yux')S.push({k:'ctype'}); }
  else if(p.t==='PIA')S.push({k:'nexo'},{k:'nclass'},{k:'ante'},{k:'nfunc'},{k:'esp'});
  else if(p.t==='PIS'){S.push({k:'pcls'}); if(p.sub!=='dd'){S.push({k:'nexo'}); if(n.c!=='sub')S.push({k:'nfunc'});} S.push({k:'pfunc'});}
  else if(p.t==='PIAdv'){S.push({k:'adv'},{k:'nexo'},{k:'nclass'}); if(n.c==='rel')S.push({k:'nfunc'}); S.push({k:'pfunc'});}
  return S;
}
function activate(i){
  R.pi=i;const p=R.it.props[i];
  if(!R.ps[i])R.ps[i]={steps:buildSteps(p),si:0,w:{},sum:[],done:false,reveal:false,sel:[],msg:null,typed:false};
}
function pstate(i){return R.ps[i];}
function keyFor(k,p){
  switch(k){
    case 'type':return p.t;
    case 'ctype':return p.nexo?p.nexo.ct:'yux';
    case 'nclass':return p.nexo.c;
    case 'nfunc':return p.nexo.nf;
    case 'esp':return p.sub;
    case 'pcls':return p.sub==='dd'?'dd':p.nexo.c;
    case 'adv':return p.sub;
    case 'pfunc':return p.t==='PIAdv'?ADV_FN[p.sub]:p.f;
  }
}
function nexoText(it,p){return txt(it,p.nexo.s,p.nexo.e);}
function labelOf(k,p,v){
  switch(k){
    case 'type':return TYPES.find(o=>o.v===v).t;
    case 'ctype':return CT.find(o=>o.v===v).t;
    case 'nclass':return NCLASS.find(o=>o.v===v).t;
    case 'pcls':return PCLS.find(o=>o.v===v).t;
    case 'adv':return ADV.find(o=>o.v===v).t;
    case 'esp':return v==='esp'?'Especificativa':'Explicativa';
    default:return fnName(v);
  }
}
function sumLine(k,p){
  const it=R.it,key=keyFor(k,p);
  switch(k){
    case 'type':return 'Es una proposición '+TYPE_L[p.t]+'.';
    case 'ctype':return 'Coordinación '+CT_L[key]+'.';
    case 'nexo':return (p.t==='PIS'&&p.nexo.c==='int'?'Pronombre interrogativo: «':'Nexo: «')+nexoText(it,p)+'».';
    case 'nclass':return 'Nexo '+(key==='rel'?'relacionante':'subordinante')+'.';
    case 'ante':return 'Antecedente: «'+it.k[p.nexo.a].t+'».';
    case 'nfunc':return '«'+nexoText(it,p)+'» es '+fnName(key).toLowerCase()+' dentro de la proposición.';
    case 'esp':return 'Es '+(key==='esp'?'especificativa':'explicativa')+'.';
    case 'pcls':return PCLS.find(o=>o.v===key).t+'.';
    case 'adv':return 'Adverbial '+ADV_L[key]+'.';
    case 'pfunc':return 'En la oración funciona como '+fnName(key).toLowerCase()+(p.ft?' ('+p.ft+')':'')+'.';
  }
}
function hintFor(k,p){
  switch(k){
    case 'type':return {coord:'Las coordinadas están al mismo nivel que otra proposición y se unen con un nexo o con un signo de puntuación; no cumplen función dentro de otra.',PIA:'Modifica a un sustantivo (el antecedente) y empieza con un relacionante como que, quien, donde, cuyo.',PIS:'Cumple función de sustantivo: se puede reemplazar por «esto» o «eso».',PIAdv:'Cumple función de adverbio: se puede reemplazar por un adverbio (allí, entonces, así, mucho) o modifica al núcleo oracional.'}[p.t];
    case 'ctype':return {cop:'Las dos ideas se suman (y, e, ni).',dis:'Las ideas se excluyen: si se da una, no se da la otra (o, u).',adv:'Hay oposición entre las dos ideas (pero, sino, sin embargo…).',exp:'La segunda proposición explica el sentido de la primera (es decir, o sea, esto es).',yux:'No hay nexo: las proposiciones se unen sólo con signos de puntuación.'}[keyFor(k,p)];
    case 'nclass':return 'El relacionante cumple una función dentro de la proposición (por eso tiene antecedente o equivale a un sustantivo o adverbio). El subordinante sólo marca la subordinación y se tacha al bajar la proposición.';
    case 'nfunc':return p.t==='PIA'?'Reemplazá el nexo por el antecedente y bajá la proposición: ¿qué función cumple?':p.t==='PIAdv'?'Los relacionantes de lugar, tiempo, modo y cantidad funcionan como circunstanciales dentro de la proposición.':'Bajá la proposición y preguntate qué función cumple ese nexo dentro de ella.';
    case 'esp':return 'Si va entre pausas (comas) y se puede quitar sin cambiar el sentido, es explicativa. Si recorta o identifica al antecedente, es especificativa.';
    case 'pcls':return 'Subordinante: «que» o «si», sin función. Relacionante: el que, lo que, quien, donde… Discurso directo: va entre comillas. Interrogativa indirecta: empieza con qué, quién, dónde, cómo… con tilde.';
    case 'adv':return 'Fijate en el nexo y el significado: lugar, tiempo, modo, cantidad, causa, consecuencia (tan… que), objeción (aunque), condición (si).';
    case 'pfunc':return p.t==='PIS'?'Reemplazá la proposición por «esto» o «eso» y fijate qué función cumple en la oración.':'Las temporales, locativas, modales, cuantitativas y causales son circunstanciales; la consecutiva es complemento consecutivo; la concesiva y la condicional modifican al núcleo oracional.';
    case 'nexo':return 'El nexo es la palabra (o las palabras) que introduce la proposición. Puede tener más de una («por qué», «como si», «después que»).';
    case 'ante':return 'El antecedente es el sustantivo al que modifica la proposición. Está antes del nexo.';
  }
  return '';
}
function stepOptions(st,p){
  switch(st.k){
    case 'type':return TYPES;
    case 'ctype':return CT;
    case 'nclass':return NCLASS;
    case 'pcls':return PCLS;
    case 'adv':return ADV;
    case 'esp':return [{v:'esp',t:'Especificativa',d:'recorta al antecedente'},{v:'exp',t:'Explicativa',d:'agrega un rasgo; va entre pausas'}];
    case 'nfunc':return NF_OPTS.map(c=>({v:c,t:FN[c]}));
    case 'pfunc':return (p.t==='PIAdv'?PF_ADV:PF_PIS).map(c=>({v:c,t:FN[c]}));
  }
}
function questionFor(st,p){
  const it=R.it;
  switch(st.k){
    case 'type':return '¿Qué tipo de proposición es?';
    case 'ctype':return p.nexo?'¿Qué clase de coordinación expresa «'+nexoText(it,p)+'»?':'Estas dos proposiciones están unidas por signos de puntuación. ¿Qué clase de coordinación es?';
    case 'nexo':return p.t==='PIS'&&p.nexo.c==='int'?'Tocá el pronombre interrogativo o exclamativo.':'Tocá el nexo que introduce la proposición. Si tiene más de una palabra, tocalas todas y confirmá.';
    case 'nclass':return '¿Qué clase de nexo es «'+nexoText(it,p)+'»?';
    case 'ante':return 'Tocá el antecedente de «'+nexoText(it,p)+'».';
    case 'nfunc':{let t='¿Qué función cumple «'+nexoText(it,p)+'» dentro de la proposición?';return t;}
    case 'esp':return '¿Es especificativa o explicativa?';
    case 'pcls':return '¿Cómo empieza esta proposición sustantiva?';
    case 'adv':return '¿Qué clase de adverbial es?';
    case 'pfunc':return p.t==='PIAdv'?'¿Qué función cumple la proposición en la oración?':'¿Qué función cumple esta proposición sustantiva en la oración?';
  }
}
function bajada(p){
  const it=R.it,n=p.nexo;if(!n||n.a==null)return null;
  const last=it.k[n.e].t.toLowerCase();
  if(!['que','quien','quienes','cual','cuales'].includes(last))return null;
  const prefix=n.e>n.s?txt(it,n.s,n.e-1)+' ':'';
  return '… '+prefix+it.k[n.a].t+' '+txt(it,n.e+1,p.e);
}
function tokCls(i){
  const cls=[];const p=R.it.props[R.pi];const ps=R.ps&&R.ps[R.pi];
  R.it.props.forEach((q2,k)=>{ if(R.ps[k]&&R.ps[k].done&&q2.nexo&&i>=q2.nexo.s&&i<=q2.nexo.e)cls.push('nxok'); if(R.ps[k]&&R.ps[k].anteOk&&q2.nexo&&q2.nexo.a===i)cls.push('ante'); });
  if(R.stage==='props'&&p&&i>=p.s&&i<=p.e&&ps&&!ps.done)cls.push('in');
  if(ps&&!ps.done){
    const st=ps.steps[ps.si];
    if(st&&st.k==='nexo'&&ps.sel.includes(i))cls.push('nx');
    if(p.nexo&&ps.nexoOk&&i>=p.nexo.s&&i<=p.nexo.e)cls.push('nxok');
    if(ps.anteOk&&p.nexo&&p.nexo.a===i)cls.push('ante');
  }
  if(R.stage==='pron'&&R.pr&&R.pr.cur){const pr=R.it.prons[R.pr.i];if(pr&&i>=pr.s&&i<=pr.e)cls.push('pron');}
  if(R.stage==='pron'&&R.pr&&!R.pr.cur){}
  return cls;
}
function renderProps(b){
  const it=R.it;
  const spans=it.props.map((p,k)=>({s:p.s,e:p.e,c:k,n:k+1,g:(R.ps[k]&&R.ps[k].typed&&p.t!=='coord')?'i':(R.ps[k]&&R.ps[k].typed?'c':'i')}));
  // corchete cuadrado sólo para coordinadas ya tipificadas
  spans.forEach((sp,k)=>{sp.g=(R.ps[k]&&R.ps[k].typed&&it.props[k].t==='coord')?'c':'i';});
  const ps0=R.ps[R.pi];const st0=ps0&&!ps0.done?ps0.steps[ps0.si]:null;
  const tapOn=st0&&(st0.k==='nexo'||st0.k==='ante')&&!ps0.reveal;
  const se=sentEl(it,spans,tokCls,tapOn?onTapStep:null);se.style.setProperty('--pc',PI_COLORS[R.pi%4]);b.append(se);
  const wrap=h('div',{class:'pcards'});
  it.props.forEach((p,k)=>{
    const ps=R.ps[k];const act=k===R.pi;
    const card=h('div',{class:'pc'+(act&&!(ps&&ps.done)?' active':'')+(ps&&ps.done?' done':''),style:'--pc:'+PI_COLORS[k%4],'data-p':k});
    card.append(h('div',{class:'ph'},h('b',{},'Proposición '+(k+1)),(!act&&!(ps&&ps.done))?null:null,h('span',{class:'muted',style:'flex-basis:100%;order:3;font-size:.9rem'},'«'+txt(it,p.s,p.e)+'»'),
      (!act&&!(ps&&ps.done))?h('button',{class:'tbtn',onclick:()=>{activate(k);R.pi=k;rerender();}},'Analizar'):null));
    if(ps&&ps.sum.length)card.append(h('ul',{class:'sum'},ps.sum.map(s=>h('li',{},s))));
    if(act&&ps&&!ps.done)card.append(stepUI(p,ps));
    wrap.append(card);
  });
  b.append(wrap);
}
function stepUI(p,ps){
  const it=R.it,st=ps.steps[ps.si];const box=h('div',{});
  box.append(h('div',{class:'dots','aria-hidden':'true'},ps.steps.map((s,i)=>h('i',{class:i<=ps.si?'on':''}))));
  box.append(h('p',{class:'q'},questionFor(st,p)));
  if(st.k==='nfunc'){const bj=bajada(p);if(bj)box.append(h('p',{class:'help'},'Probá bajar la proposición con el antecedente en lugar del nexo: «'+bj+'».'));}
  if(ps.reveal){
    const key=keyFor(st.k,p);
    let ans;
    if(st.k==='nexo')ans='«'+nexoText(it,p)+'»';else if(st.k==='ante')ans='«'+it.k[p.nexo.a].t+'»';else ans=labelOf(st.k,p,alts(key)[0]);
    box.append(fb('info','La respuesta es: '+ans,hintFor(st.k,p)));
    box.append(h('div',{class:'row',style:'margin-top:10px'},h('button',{class:'btn','data-act':'next',onclick:()=>{ps.sum.push(sumLine(st.k,p));if(st.k==='nexo')ps.nexoOk=true;if(st.k==='ante')ps.anteOk=true;advance(p,ps);}},'Entendido, seguir')));
    return box;
  }
  if(st.k==='nexo'){
    box.append(h('p',{class:'help'},ps.sel.length?'Seleccionado: «'+ps.sel.slice().sort((a,b)=>a-b).map(i=>it.k[i].t).join(' ')+'»':'Tocá las palabras en la oración de arriba.'));
    box.append(h('div',{class:'row',style:'margin-top:6px'},h('button',{class:'btn','data-act':'confirm',disabled:!ps.sel.length,onclick:()=>confirmNexo(p,ps)},'Es este nexo'),ps.sel.length?h('button',{class:'btn alt',onclick:()=>{ps.sel=[];rerender();}},'Borrar selección'):null));
  } else if(st.k==='ante'){
    box.append(h('p',{class:'help'},'Tocá la palabra en la oración de arriba.'));
  } else {
    const opts=stepOptions(st,p);
    const grid=h('div',{class:'opts'+(st.k==='pcls'||st.k==='esp'||st.k==='nclass'?' col1':'')});
    let lastG=null;
    opts.forEach(o=>{
      if(o.g&&o.g!==lastG){grid.append(h('div',{class:'grpl'},o.g));lastG=o.g;}
      const wrongs=ps.w[st.k]||[];
      grid.append(h('button',{class:'opt'+(wrongs.includes(o.v)?' bad':''),'data-v':o.v,disabled:wrongs.includes(o.v),onclick:()=>pick(p,ps,st,o.v)},o.t,o.d?h('small',{},o.d):null));
    });
    box.append(grid);
  }
  if(ps.msg)box.append(ps.msg);
  return box;
}
function onTapStep(i){
  const p=R.it.props[R.pi],ps=R.ps[R.pi],st=ps.steps[ps.si];
  if(!R.it.k[i].w)return;
  if(st.k==='nexo'){const j=ps.sel.indexOf(i);if(j>=0)ps.sel.splice(j,1);else ps.sel.push(i);ps.msg=null;rerender();}
  else if(st.k==='ante'){
    if(i===p.nexo.a){ps.anteOk=true;ps.sum.push(sumLine('ante',p));advance(p,ps);}
    else miss(p,ps,'ante','«'+R.it.k[i].t+'» no es el antecedente. '+hintFor('ante',p));
  }
}
function confirmNexo(p,ps){
  const n=p.nexo;const want=[];for(let i=n.s;i<=n.e;i++)want.push(i);
  const got=ps.sel.slice().sort((a,b)=>a-b);
  if(want.length===got.length&&want.every((x,i)=>x===got[i])){ps.nexoOk=true;ps.sum.push(sumLine('nexo',p));ps.sel=[];advance(p,ps);}
  else{ps.sel=[];miss(p,ps,'nexo','Esa selección no es el nexo. '+hintFor('nexo',p));}
}
function miss(p,ps,k,text){
  R.errs++;ps.w[k]=(ps.w[k]||[]).concat(['x']);
  if(ps.w[k].length>=3){ps.reveal=true;ps.msg=null;}
  else ps.msg=fb('bad','No es así',text);
  rerender();
}
function pick(p,ps,st,v){
  const key=keyFor(st.k,p);
  if(alts(key).includes(v)){
    ps.sum.push(sumLine(st.k,p));
    if(st.k==='type')ps.typed=true;
    advance(p,ps);
  } else {
    R.errs++;ps.w[st.k]=(ps.w[st.k]||[]).concat([v]);
    if(ps.w[st.k].length>=3){ps.reveal=true;ps.msg=null;}
    else ps.msg=fb('bad','No es '+labelOf(st.k,p,v).toLowerCase(),hintFor(st.k,p));
    rerender();
  }
}
function advance(p,ps){
  if(ps.reveal){R.helped=true;}
  ps.reveal=false;ps.msg=null;ps.si++;
  if(ps.steps[ps.si-1].k==='type')ps.typed=true;
  if(ps.si>=ps.steps.length){
    ps.done=true;
    const nxt=R.it.props.findIndex((q2,k)=>!(R.ps[k]&&R.ps[k].done));
    if(nxt>=0){activate(nxt);}
    else{ if(R.it.prons&&R.it.prons.length){R.stage='pron';initPron();}else finish(); }
  }
  rerender();
}

/* --- pronombres --- */
function initPron(){R.pr={i:0,node:'N0',w:{},msg:null,reveal:false,cur:true,sum:[]};}
function renderPron(b){
  const it=R.it,pr=R.pr,list=it.prons;
  const spans=it.props.map((p,k)=>({s:p.s,e:p.e,c:k,n:k+1,g:p.t==='coord'?'c':'i'}));
  b.append(sentEl(it,spans,tokCls,null));
  if(it.m==='pron')b.append(h('p',{class:'help'},'Analizá cada pronombre destacado. Respondé las preguntas del árbol de decisión.'));
  else b.append(h('p',{class:'help'},'Ahora, los pronombres destacados.'));
  if(pr.sum.length)b.append(h('ul',{class:'sum'},pr.sum.map(s=>h('li',{},s))));
  const code=alts(list[pr.i].p);
  const nd=TREE[pr.node];
  const box=h('div',{class:'card',style:'margin-top:10px;background:var(--surface2);box-shadow:none'});
  box.append(h('div',{class:'muted',style:'font-size:.85rem'},'Pronombre '+(pr.i+1)+' de '+list.length+': «'+txt(it,list[pr.i].s,list[pr.i].e)+'»'));
  box.append(h('p',{class:'q'},nd.q));
  if(pr.reveal){
    const right=nd.o.find(o=>okAt(pr.node,o.v,code));
    box.append(fb('info','La respuesta es: '+right.t,TREE_HINT[pr.node](code[0])));
    box.append(h('div',{class:'row',style:'margin-top:10px'},h('button',{class:'btn','data-act':'next',onclick:()=>{R.helped=true;pr.reveal=false;treeGo(right.v,code);}},'Entendido, seguir')));
  } else {
    const grid=h('div',{class:'opts'});
    nd.o.forEach(o=>{const wr=(pr.w[pr.node]||[]).includes(o.v);grid.append(h('button',{class:'opt'+(wr?' bad':''),'data-v':o.v,disabled:wr,onclick:()=>treePick(o.v,code)},o.t,o.d?h('small',{},o.d):null));});
    box.append(grid);
    if(pr.msg)box.append(pr.msg);
  }
  b.append(box);
}
function okAt(node,v,codes){return codes.some(c=>PATHS[c].some(([n,x])=>n===node&&x===v));}
function treePick(v,code){
  const pr=R.pr;
  if(okAt(pr.node,v,code)){treeGo(v,code);}
  else{R.errs++;pr.w[pr.node]=(pr.w[pr.node]||[]).concat([v]);
    if(pr.w[pr.node].length>=2&&TREE[pr.node].o.length>2||pr.w[pr.node].length>=3){pr.reveal=true;pr.msg=null;}
    else if(TREE[pr.node].o.length===2&&pr.w[pr.node].length>=1){pr.reveal=false;pr.msg=fb('bad','Probá con la otra opción',TREE_HINT[pr.node](code[0]));}
    rerender();}
}
function treeGo(v,code){
  const pr=R.pr,nd=TREE[pr.node];
  if(nd.code&&nd.code[v]){
    const leaf=nd.code[v];
    const it=R.it,pn=it.prons[pr.i];
    pr.sum.push('«'+txt(it,pn.s,pn.e)+'»: '+LEAF[leaf]+'.');
    pr.i++;pr.node='N0';pr.w={};pr.msg=null;
    if(pr.i>=it.prons.length){pr.cur=false;finish();return;}
    rerender();return;
  }
  pr.node=nd.nx[v];pr.msg=null;rerender();
}

/* --- analisis de funciones (repaso) --- */
function renderFunc(b){
  const it=R.it;
  b.append(h('p',{class:'q'},'Analizá la oración'));
  b.append(h('p',{class:'help'},'Tocá la primera y la última palabra de cada constituyente y elegí su función. Marcá el verbo (núcleo verbal) y todos sus modificadores. Hay '+it.spans.length+' para marcar.'));
  const spans=R.marks.map((m,k)=>({s:m.s,e:m.e,c:k,n:k+1,g:'c'}));
  if(R.pending)spans.push({s:R.pending.s,e:R.pending.e,c:R.marks.length,n:'?',g:'c'});
  b.append(sentEl(it,spans,i=>R.first===i?['sel']:[],onTapFunc));
  const ml=h('div',{class:'marks'});
  R.marks.forEach((m,k)=>ml.append(h('span',{class:'mk '+(m.ok?'ok':''),style:'--pc:'+PI_COLORS[k%4]},h('em',{},(k+1)+'. '+txt(it,m.s,m.e)+' → '),h('b',{class:'mono'},m.fn),m.ok?null:h('button',{'aria-label':'Quitar',onclick:()=>{R.marks.splice(k,1);R.msg=null;rerender();}},'×'))));
  b.append(ml);
  if(R.pending){
    b.append(h('p',{class:'q'},'¿Qué función cumple «'+txt(it,R.pending.s,R.pending.e)+'»?'));
    const grid=h('div',{class:'opts'});
    FN_PALETTE.forEach(c=>grid.append(h('button',{class:'opt','data-v':c,onclick:()=>{R.marks.push({s:R.pending.s,e:R.pending.e,fn:c,ok:false});R.pending=null;R.msg=null;rerender();}},FN[c],h('small',{},c))));
    b.append(grid,h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'btn alt',onclick:()=>{R.pending=null;rerender();}},'Cancelar')));
  } else if(R.first!=null)b.append(h('p',{class:'help'},'Empieza en «'+it.k[R.first].t+'». Tocá donde termina.'));
  if(R.msg)b.append(R.msg);
  const row=h('div',{class:'row'},h('button',{class:'btn','data-act':'check',disabled:!R.marks.length||!!R.pending,onclick:checkFunc},'Comprobar'));
  if(R.checks>=3)row.append(h('button',{class:'btn alt',onclick:()=>{R.helped=true;R.errs++;R.marks=R.it.spans.map(s=>({s:s.s,e:s.e,fn:alts(s.fn)[0],ok:true}));R.marks.sort((a,b)=>a.s-b.s);finish();}},'Mostrame la respuesta'));
  b.append(row);
}
function onTapFunc(i){
  if(R.pending)return;
  if(R.first==null)R.first=i;
  else{const s=Math.min(R.first,i),e=Math.max(R.first,i);R.first=null;
    if(R.marks.some(m=>m.s===s&&m.e===e)){R.msg=fb('info','','Ese tramo ya está marcado.');}
    else R.pending={s,e};}
  R.msg=R.pending?null:R.msg;rerender();
}
function checkFunc(){
  const it=R.it;R.checks++;const parts=[];let wrong=0;
  R.marks.forEach(m=>{ if(m.ok)return;
    const k=it.spans.find(s=>s.s===m.s&&s.e===m.e);
    if(k&&alts(k.fn).includes(m.fn)){m.ok=true;}
    else if(k){wrong++;m.bad='fn';parts.push(h('div',{},'«'+txt(it,m.s,m.e)+'»: la extensión está bien, pero no es '+FN[m.fn].toLowerCase()+'. '+(FN_HINT[alts(k.fn)[0]]||'')));}
    else{wrong++;m.bad='span';parts.push(h('div',{},'«'+txt(it,m.s,m.e)+'» no coincide con ningún constituyente de la oración. Revisá dónde empieza y dónde termina.'));}
  });
  const okc=R.marks.filter(m=>m.ok).length;const missing=it.spans.length-okc-wrong;
  if(!wrong&&!missing){R.marks.sort((a,b)=>a.s-b.s);finish();return;}
  R.errs+=wrong||1;
  if(missing>0)parts.push(h('div',{},missing===1?'Te falta marcar 1 constituyente.':'Te faltan marcar '+missing+' constituyentes.'));
  parts.push(h('div',{class:'muted'},'Las marcas incorrectas se quitaron; las correctas quedaron en verde.'));
  R.marks=R.marks.filter(m=>m.ok);
  R.msg=fb('bad','Todavía no',parts);rerender();
}

/* --- opción múltiple --- */
function renderChoice(b){
  const it=R.it;
  b.append(h('p',{class:'q',style:'font-size:1.2rem'},it.q));
  const grid=h('div',{class:'opts col1'});
  R.opts.forEach((o,k)=>{
    const wr=R.wrongs.includes(k);
    const good=(R.reveal||R.solved)&&o.ok;
    grid.append(h('button',{class:'opt'+(wr?' bad':'')+(good?' good':''),'data-ok':o.ok?'1':'0',disabled:wr||R.solved||R.reveal,onclick:()=>choose(k)},o.t));
  });
  b.append(grid);
  if(R.msg)b.append(R.msg);
  if(R.reveal||R.solved){b.append(fb(R.solved?'ok':'info',R.solved?'Correcto':'La respuesta correcta es la marcada',it.e));
    b.append(h('div',{class:'row',style:'margin-top:10px'},h('button',{class:'btn','data-act':'finish',onclick:finish},'Seguir')));}
}
function choose(k){
  if(R.opts[k].ok){R.solved=true;R.msg=null;}
  else{R.errs++;R.wrongs.push(k);
    if(R.wrongs.length>=2){R.reveal=true;R.helped=true;R.msg=null;}
    else R.msg=fb('bad','No es esa','Releé la consigna y probá con otra.');}
  rerender();
}

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
  const C={tipo:[],vf:[],nexo:[],ante:[],esp:[],nfun:[],pf:[],pcls:[],advs:[],ctype:[],cuenta:[],se:[],fn:[]};
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

/* --- fin del ejercicio --- */
function finish(){
  R.done=true;R.stage='done';
  const perfect=R.errs===0&&!R.helped;
  const prev=store.p[R.it.id];
  store.p[R.it.id]={d:1,p:perfect?1:(prev&&prev.p?1:0),e:R.errs};
  save();
  rerender();
  const t=q('.tabs');if(t){const n=q('.tab[aria-selected="true"] .n',t);if(n)n.textContent=unitDone(R.it.u).join('/');}
}
function renderResult(b){
  const it=R.it,perfect=R.errs===0&&!R.helped;
  b.append(h('div',{class:'res'},h('div',{class:'big'},perfect?'★':'✓'),h('h3',{},perfect?'¡Sin errores!':'Ejercicio completo'),h('p',{class:'muted',style:'margin:4px 0 0'},perfect?'Lo resolviste bien a la primera.':(R.errs?R.errs+(R.errs===1?' respuesta para repasar.':' respuestas para repasar.'):'Completado con ayuda.')+' Podés repetirlo cuando quieras.')));
  if(it.m==='props'||it.m==='func'||it.m==='pron'){
    b.append(sentEl(it,(it.props||[]).map((p,k)=>({s:p.s,e:p.e,c:k,n:k+1,g:p.t==='coord'?'c':'i'})),i=>{const c=[];(it.prons||[]).forEach(pn=>{if(i>=pn.s&&i<=pn.e)c.push('pron');});(it.props||[]).forEach(p=>{if(p.nexo&&i>=p.nexo.s&&i<=p.nexo.e)c.push('nxok');});return c;},null));
    if(it.props&&it.props.length){b.append(h('div',{class:'pcards'},it.props.map((p,k)=>h('div',{class:'pc',style:'--pc:'+PI_COLORS[k%4]},h('b',{style:'color:var(--pc)'},'Proposición '+(k+1)+': '),'«'+txt(it,p.s,p.e)+'»',h('ul',{class:'sum'},resumen(p).map(s=>h('li',{},s)))))));}
    if(it.m==='func'){b.append(h('div',{class:'marks'},it.spans.map(s=>h('span',{class:'mk ok'},h('em',{},txt(it,s.s,s.e)+' → '),h('b',{class:'mono'},alts(s.fn)[0])))));}
    if(it.prons&&it.m==='props'&&it.prons.length)b.append(h('ul',{class:'sum'},it.prons.map(pn=>h('li',{},'«'+txt(it,pn.s,pn.e)+'»: '+LEAF[alts(pn.p)[0]]+'.'))));
  }
  if(it.n){const disc=/^Discutible/.test(it.n);b.append(h('div',{class:'fb info',style:'margin-top:12px'},h('b',{class:'t'},disc?'Análisis discutible':'Nota'),disc?it.n.replace(/^Discutible:?\s*/,''):it.n));}
  const list=unitItems(it.u),idx=list.indexOf(it);
  const nxt=list.slice(idx+1).find(i=>!stat(i.id))||list.find(i=>!stat(i.id));
  const row=h('div',{class:'row',style:'margin-top:14px'});
  if(nxt&&nxt!==it)row.append(h('button',{class:'btn','data-act':'next-ex',onclick:()=>startItem(nxt.id)},'Siguiente ejercicio'));
  row.append(h('button',{class:'btn alt',onclick:()=>{R=null;render();window.scrollTo(0,0);}},'Volver a la lista'),h('button',{class:'btn alt',onclick:()=>startItem(it.id)},'Repetir'));
  b.append(row);
}
function resumen(p,it0){
  const it=it0||R.it,L=[];const n=p.nexo;
  L.push('Es una proposición '+TYPE_L[p.t]+(p.t==='PIA'?(p.sub==='esp'?' especificativa':' explicativa'):p.t==='PIAdv'?' '+ADV_L[p.sub]:p.t==='coord'&&(n||p.ct==='yux')?' '+CT_L[n?n.ct:'yux']:'')+'.');
  if(n){L.push((p.t==='PIS'&&n.c==='int'?'Pronombre interrogativo: «':'Nexo: «')+txt(it,n.s,n.e)+'»'+(n.c==='rel'?' (relacionante':n.c==='sub'?' (subordinante':n.c==='int'?' (':n.c==='conj'?' (conjunción':' (')+(n.nf?(n.c==='rel'||n.c==='int'?(n.c==='int'?'':', ')+fnName(n.nf).toLowerCase()+' dentro de la proposición':''):'')+')'+(n.a!=null?'. Antecedente: «'+it.k[n.a].t+'».':'.'));}
  if(p.t==='PIS'){L.push(p.sub==='dd'?'Discurso directo (sin nexo).':'');}
  if(p.t==='PIS')L.push('Función en la oración: '+fnName(p.f).toLowerCase()+(p.ft?' ('+p.ft+')':'')+'.');
  if(p.t==='PIAdv')L.push('Función en la oración: '+fnName(ADV_FN[p.sub]).toLowerCase()+'.');
  return L.filter(Boolean);
}

/* ---------- teoría: árbol ---------- */
function renderTreeTheory(el){
  el.innerHTML='';
  const nums={N0:1,N0b:'1a',N1:2,N1f:'2a',N2:3,N2f:'3a',N3:4,N4:5};
  const tree=h('div',{class:'tree'});
  Object.keys(TREE).forEach(id=>{
    const nd=TREE[id];const box=h('div',{class:'tn'},h('b',{},nums[id]+'. '+nd.q));
    const br=h('div',{class:'br2'});
    nd.o.forEach(o=>{
      let res;
      if(nd.code&&nd.code[o.v])res=h('div',{class:'lf'},h('strong',{},o.t+(o.d?' ('+o.d+')':'')),LEAF[nd.code[o.v]]);
      else res=h('div',{class:'lf',style:'background:var(--surface2)'},h('strong',{},o.t),'ir a la pregunta '+nums[nd.nx[o.v]]);
      br.append(res);
    });
    box.append(br);tree.append(box);
  });
  el.append(tree);
}

/* ---------- ventana auxiliar ---------- */
function openSheet(which){
  closeSheet();
  const ov=h('div',{class:'ov',role:'dialog','aria-modal':'true',onclick:e=>{if(e.target===ov)closeSheet();}});
  const sh=h('div',{class:'sheet'});
  ov.append(sh);overlay=ov;
  const body=h('div',{});
  const draw=(w)=>{
    body.innerHTML='';
    sh.querySelectorAll('.stabs button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.w===w?'true':'false'));
    if(w==='abrev'){
      body.append(h('h3',{},'Abrev.'),h('p',{class:'muted'},'Las que usan los cuadernillos y la app. Faltan algunas del análisis interno (n/s, ct, cn…), pendientes de revisión del profesor.'));
      body.append(h('div',{class:'tbl'},h('table',{},ABREV.map(r=>h('tr',{},h('td',{class:'mono'},r[0]),h('td',{},r[1]))))));
    } else if(w==='prog'){
      const tot=ITEMS.length,done=ITEMS.filter(i=>stat(i.id)).length,star=ITEMS.filter(i=>stat(i.id)&&stat(i.id).p).length;
      let t='Sintaxis, tercer año — progreso\n'+done+' de '+tot+' ejercicios hechos ('+star+' sin errores)\n';
      UNITS.forEach(u=>{const d=unitDone(u.id);t+=u.name+': '+d[0]+'/'+d[1]+'\n';});
      body.append(h('h3',{},'Progreso'),h('p',{class:'muted'},'Se guarda sólo en este dispositivo. Si querés mostrárselo al profesor, copiá este resumen.'));
      const ta=h('textarea',{class:'cp',readonly:true},t);body.append(ta);
      const msg=h('span',{class:'muted',role:'status'},'');
      body.append(h('div',{class:'row',style:'margin-top:8px'},h('button',{class:'btn',onclick:()=>{
        const done=()=>{msg.textContent='Copiado.';};
        try{navigator.clipboard.writeText(t).then(done,()=>{ta.select();msg.textContent='Seleccionado: copialo con el menú.';});}catch(e){ta.select();msg.textContent='Seleccionado: copialo con el menú.';}
      }},'Copiar resumen'),msg));
      const rs=h('div',{class:'row',style:'margin-top:16px'});
      const btn=h('button',{class:'btn alt',onclick:()=>{
        if(!btn.dataset.sure){btn.dataset.sure='1';btn.textContent='Tocá de nuevo para borrar todo mi avance';return;}
        store.p={};store.cur=null;save();R=null;closeSheet();render();
      }},'Borrar mi avance');
      rs.append(btn);body.append(rs);
    } else {
      const u=UNITS.find(x=>x.id===w);
      body.append(h('h3',{},u.sub),h('div',{class:'teo',html:TEORIA[w]}));
      const t=q('#tree-slot',body);if(t)renderTreeTheory(t);
    }
  };
  const tabs=h('div',{class:'stabs'});
  UNITS.concat([{id:'abrev',name:'Abreviaturas'}]).forEach(u=>tabs.append(h('button',{class:'seg','data-w':u.id,onclick:()=>draw(u.id)},u.name)));
  sh.append(h('div',{class:'hd'},h('b',{},which==='prog'?'Mi progreso':'Consultar'),h('button',{class:'btn alt',onclick:closeSheet,'aria-label':'Cerrar'},'Cerrar')));
  if(which!=='prog')sh.append(tabs);
  sh.append(body);
  document.body.append(ov);
  document.addEventListener('keydown',escClose);
  draw(which);
}
function escClose(e){if(e.key==='Escape')closeSheet();}
function closeSheet(){if(overlay){overlay.remove();overlay=null;document.removeEventListener('keydown',escClose);}}

/* ---------- arranque ---------- */
load();
try{const hsh=(location.hash||'').replace('#','');if(hsh==='inicio'||UNITS.some(u=>u.id===hsh)){store.tab=hsh;}}catch(e){}
if(store.tab!=='inicio'&&!UNITS.some(u=>u.id===store.tab))store.tab='inicio';
window.__sx={ITEMS,start:startItem,state:()=>({R,Q,store}),setTab,startRound};
render();
})();
