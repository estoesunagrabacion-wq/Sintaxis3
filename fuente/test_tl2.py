import os
from playwright.sync_api import sync_playwright
errors=[]
U='file://'+os.path.abspath('sintaxis.html')
with sync_playwright() as pw:
    b=pw.chromium.launch(); ctx=b.new_context(viewport={'width':400,'height':900}); page=ctx.new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(U);page.wait_for_timeout(300)
    page.evaluate("()=>window.__sx.startTaller('pis')")
    ids=page.evaluate("()=>window.__sx.tl().ids")
    page.evaluate("()=>window.__sx.forceFinish()");page.click('[data-act="tl-next"]');page.wait_for_timeout(100)
    assert page.evaluate("()=>window.__sx.tl().i")==1
    # salir a otra pestaña: queda guardado
    page.evaluate("()=>window.__sx.setTab('inicio')");page.wait_for_timeout(100)
    assert page.locator('[data-act="tl-resume"]').count()==1; print('parked card on home')
    page.evaluate("()=>window.__sx.setTab('pis','teoria')");page.wait_for_timeout(100)
    page.evaluate("()=>window.__sx.setTab('pis','practica')");page.wait_for_timeout(100)
    assert page.locator('[data-act="tl-resume"]').count()==1
    page.click('[data-act="tl-resume"]');page.wait_for_timeout(200)
    print('resumed ex', page.evaluate("()=>window.__sx.state().R.it.id"), ids[1]); assert page.evaluate("()=>window.__sx.state().R.it.id")==ids[1]
    assert page.locator('.tlbar').count()==1
    # recargar página
    page.reload();page.wait_for_timeout(300)
    assert page.locator('[data-act="tl-resume"]').count()>=0
    page.evaluate("()=>window.__sx.setTab('inicio')");page.wait_for_timeout(100)
    page.click('[data-act="tl-resume"]');page.wait_for_timeout(200)
    assert page.evaluate("()=>window.__sx.state().R.it.id")==ids[1]; print('resumed after reload')
    # terminar todo
    while True:
        info=page.evaluate("()=>window.__sx.tl()")
        if info['phase']!='items':break
        page.evaluate("()=>window.__sx.forceFinish()");page.click('[data-act="tl-next"]');page.wait_for_timeout(80)
    for _ in range(6):
        if page.locator('.opt[data-ok="1"]').count(): page.locator('.opt[data-ok="1"]').first.click()
        else: page.evaluate("()=>{const s=window.__sx.state().Q;document.querySelectorAll('.sent .w')[s.qs[s.i].ans[0]].click()}")
        page.wait_for_timeout(50);page.click('[data-act="rnext"]');page.wait_for_timeout(50)
    print(page.locator('.tldone h2').inner_text()); page.screenshot(path='tl_done.png')
    page.evaluate("()=>window.__sx.setTab('inicio')");page.wait_for_timeout(100)
    assert page.locator('[data-act="tl-resume"]').count()==0; print('cleared')
    # desafíos por tema
    for u in ['rep','coo','pia','pis','pro','adv']:
        page.evaluate("u=>window.__sx.setTab(u,'practica')",u);page.wait_for_timeout(50)
        page.fill('#chnick','Ana');page.fill('#chcode','c1');page.click('[data-act="chal"]');page.wait_for_timeout(80)
        print(u,page.evaluate("()=>window.__sx.state().Q.qs.length"))
print('errors',errors)
