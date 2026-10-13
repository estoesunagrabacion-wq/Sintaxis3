import json, sys
from playwright.sync_api import sync_playwright
items=[i for i in json.load(open('items.json',encoding='utf8')) if not i.get('r')]
ADV_FN={'loc':'CCL','temp':'CCT','mod':'CCM','cuant':'CCCn','caus':'CCCa','cons':'CCons','conc':'MNO','cond':'MNO'}
PATHS={'OD':[['N0','no'],['N0b','OD']],'OI':[['N0','no'],['N0b','OI']],'REF_OD':[['N0','si'],['N1','si'],['N1f','OD']],'REF_OI':[['N0','si'],['N1','si'],['N1f','OI']],'REC_OD':[['N0','si'],['N1','no'],['N2','si'],['N2f','OD']],'REC_OI':[['N0','si'],['N1','no'],['N2','si'],['N2f','OI']],'SCR':[['N0','si'],['N1','no'],['N2','no'],['N3','si']],'PAS':[['N0','si'],['N1','no'],['N2','no'],['N3','no'],['N4','si']],'IMP':[['N0','si'],['N1','no'],['N2','no'],['N3','no'],['N4','no']]}
def keyfor(k,p):
    n=p.get('nexo') or {}
    if k=='type': return p['t']
    if k=='ctype': return n.get('ct') or 'yux'
    if k=='nclass': return n.get('c')
    if k=='nfunc': return n.get('nf')
    if k=='esp': return p.get('sub')
    if k=='pcls': return 'dd' if p.get('sub')=='dd' else n.get('c')
    if k=='adv': return p.get('sub')
    if k=='pfunc': return ADV_FN.get(p.get('sub')) if p['t']=='PIAdv' else p.get('f')
errors=[]
def tok(page,i): page.click(f'.sent .w[data-i="{i}"]')
def solve(page,it):
    page.evaluate("id=>window.__sx.start(id)",it['id'])
    m=it['m']
    if m=='choice':
        page.click('.opt[data-ok="1"]')
        page.click('[data-act="finish"]')
    elif m=='func':
        for s in it['spans']:
            tok(page,s['s']); tok(page,s['e']); page.click(f'.opt[data-v="{s["fn"].split("/")[0]}"]')
        page.click('[data-act="check"]')
    elif m in('props','pron'):
        if m=='props':
            for p in it['props']:
                tok(page,p['s']); tok(page,p['e'])
            page.click('[data-act="check"]')
            for _ in range(len(it['props'])):
                # resolver proposición activa
                while True:
                    st=page.evaluate("()=>{const R=window.__sx.state().R;if(!R||R.stage!=='props')return null;const ps=R.ps[R.pi];return ps&&!ps.done?{pi:R.pi,k:ps.steps[ps.si].k}:{pi:R.pi,k:null}}")
                    if st is None or st['k'] is None: break
                    p=it['props'][st['pi']]; k=st['k']
                    if k=='nexo':
                        for i in range(p['nexo']['s'],p['nexo']['e']+1): tok(page,i)
                        page.click('[data-act="confirm"]')
                    elif k=='ante': tok(page,p['nexo']['a'])
                    else:
                        key=keyfor(k,p).split('/')[0]
                        page.click(f'.pc.active .opt[data-v="{key}"]')
                    page.wait_for_timeout(5)
                if page.evaluate("()=>{const R=window.__sx.state().R;return !R||R.stage!=='props'}"): break
        if it.get('prons'):
            for pn in it['prons']:
                for node,v in PATHS[pn['p'].split('/')[0]]:
                    page.click(f'.card .opt[data-v="{v}"]')
    done=page.evaluate("id=>{const s=window.__sx.state();return {st:s.store.p[id],stage:s.R&&s.R.stage,errs:s.R&&s.R.errs}}",it['id'])
    return done
with sync_playwright() as pw:
    b=pw.chromium.launch(executable_path='/opt/pw-browsers/chromium' if False else None)
    ctx=b.new_context(viewport={'width':400,'height':800})
    page=ctx.new_page()
    page.on('pageerror',lambda e:errors.append(('pageerror',str(e))))
    page.on('console',lambda m:errors.append(('console',m.text)) if m.type=='error' else None)
    page.goto('file:///tmp/claude-0/-home-claude/a51cbb54-1725-54b4-9fd7-f1f3d84c5f1d/scratchpad/sx/app/sintaxis.html')
    page.wait_for_timeout(300)
    bad=[]
    for it in [i for i in items if not i.get('r')]:
        try:
            r=solve(page,it)
            if not(r['st'] and r['st']['p']==1): bad.append((it['id'],r))
        except Exception as e:
            bad.append((it['id'],'EXC '+str(e)[:200]))
    print('items',len(items),'bad',len(bad))
    for x in bad: print(x)
    print('errors',errors[:5])
    b.close()
