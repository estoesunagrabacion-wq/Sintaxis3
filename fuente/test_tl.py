import os
from playwright.sync_api import sync_playwright
errors=[]
U='file://'+os.path.abspath('sintaxis.html')
with sync_playwright() as pw:
    b=pw.chromium.launch(); page=b.new_context(viewport={'width':400,'height':900}).new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(U);page.wait_for_timeout(300)
    for u in ['pis','pia','adv','coo','pro','rep','all']:
        page.evaluate("u=>{window.__sx.startTaller?0:0}",u)
        ids=page.evaluate("u=>{window.__sx.startTaller(u);return window.__sx.state().R.it.id}",u)
        info=page.evaluate("()=>window.__sx.tl()")
        print(u,info)
    page.evaluate("()=>window.__sx.startTaller('pis')");page.wait_for_timeout(100)
    page.screenshot(path='tl1.png')
    # recorrer: resolver cada ejercicio con "revelar"? usamos avance forzado
    n=0
    while True:
        info=page.evaluate("()=>window.__sx.tl()")
        if not info or info['phase']!='items':break
        page.evaluate("()=>window.__sx.forceFinish()");page.wait_for_timeout(100)
        assert page.locator('[data-act="tl-next"]').count()==1
        page.click('[data-act="tl-next"]');page.wait_for_timeout(100);n+=1
    print('items',n, page.locator('h3').first.inner_text())
    # ronda final: contestar todo bien
    for _ in range(6):
        if page.locator('.opt[data-ok="1"]').count(): page.locator('.opt[data-ok="1"]').first.click()
        else:
            page.evaluate("()=>{const q=window.__sx.state().Q.qs[window.__sx.state().Q.i];document.querySelectorAll('.sent .w')[q.ans[0]].click()}")
        page.wait_for_timeout(60);page.click('[data-act="rnext"]');page.wait_for_timeout(60)
    page.screenshot(path='tl2.png')
    print(page.locator('.fb.info').all_inner_texts()[-1:])
print('errors',errors)
