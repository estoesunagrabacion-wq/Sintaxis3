import os
from playwright.sync_api import sync_playwright
errors=[]
U='file://'+os.path.abspath('sintaxis.html')
with sync_playwright() as pw:
    b=pw.chromium.launch(); page=b.new_context(viewport={'width':400,'height':900}).new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(U);page.wait_for_timeout(300)
    print('game card', page.locator('.card.game').count())
    page.screenshot(path='g_home0.png',full_page=False)
    # focused practice on skill 4: answer all right -> firme -> figurita
    page.evaluate("()=>window.__sx.startRound('all',null,false,{focus:4})");page.wait_for_timeout(100)
    seen=set()
    for i in range(6):
        if page.locator('[data-act="g-ok"]').count():
            seen.add(page.locator('.gbanner .gt').inner_text()); 
            if 'Figurita' in page.locator('.gbanner .gt').inner_text(): page.screenshot(path='g_fig.png')
            page.click('[data-act="g-ok"]');page.wait_for_timeout(50)
        if page.locator('.opt[data-ok="1"]').count(): page.locator('.opt[data-ok="1"]').first.click()
        else: page.evaluate("()=>{const s=window.__sx.state().Q;document.querySelectorAll('.sent .w')[s.qs[s.i].ans[0]].click()}")
        page.wait_for_timeout(50);page.click('[data-act="rnext"]');page.wait_for_timeout(50)
    while page.locator('[data-act="g-ok"]').count():
        seen.add(page.locator('.gbanner .gt').inner_text());page.click('[data-act="g-ok"]');page.wait_for_timeout(50)
    print('banners',seen)
    g=page.evaluate("()=>window.__sx.state().store.g");print('g',g)
    # forzar xp alto para rango
    page.evaluate("()=>{window.__sx.state().store.g.xp=95}")
    page.evaluate("()=>window.__sx.startTaller('pis')");page.evaluate("()=>window.__sx.forceFinish()");page.wait_for_timeout(100)
    print('rank banner', page.locator('.gbanner .gr').all_inner_texts())
    page.screenshot(path='g_rank.png')
    page.evaluate("()=>window.__sx.setTab('inicio')");page.wait_for_timeout(100)
    page.screenshot(path='g_home.png')
    page.click('[data-act="album"]');page.wait_for_timeout(200)
    print('figus', page.locator('.figu').count(), 'got', page.locator('.figu:not(.locked)').count())
    page.screenshot(path='g_album.png')
print('errors',errors)
