import json
from playwright.sync_api import sync_playwright
errors=[]
with sync_playwright() as pw:
    b=pw.chromium.launch(); page=b.new_context(viewport={'width':400,'height':800}).new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto('file:///tmp/claude-0/-home-claude/a51cbb54-1725-54b4-9fd7-f1f3d84c5f1d/scratchpad/sx/app/sintaxis.html')
    page.wait_for_timeout(300)
    for u in ['rep','coo','pia','pis','pro','adv','all']:
        for seed in (1,2,3):
            page.evaluate("([u,s])=>window.__sx.startRound(u,s)",[u,seed])
            n=page.evaluate("()=>window.__sx.state().Q.qs.length")
            kinds=page.evaluate("()=>window.__sx.state().Q.qs.map(q=>q.kind)")
            for i in range(n):
                x=page.evaluate("()=>{const q=window.__sx.state().Q;return {k:q.qs[q.i].k,ans:q.qs[q.i].ans}}")
                if x['k']=='opt': page.click('.opt[data-ok="1"]')
                else: page.click(f'.sent .w[data-i="{x["ans"]}"]')
                page.click('[data-act="rnext"]')
            r=page.evaluate("()=>{const q=window.__sx.state().Q;return [q.done,q.good,q.qs.length]}")
            print(u,seed,n,r,sorted(set(kinds)))
            assert r[0] and r[1]==r[2]==8 or (u in('rep',) and r[1]==r[2]), r
    page.screenshot(path='shots/round.png')
    print('errors',errors)
    b.close()
