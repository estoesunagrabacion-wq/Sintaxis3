import os
from playwright.sync_api import sync_playwright
errors=[]
U='file://'+os.path.abspath('sintaxis.html')
with sync_playwright() as pw:
    b=pw.chromium.launch(); page=b.new_context(viewport={'width':400,'height':900}).new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(U);page.wait_for_timeout(300)
    # práctica enfocada en cada habilidad: genera preguntas?
    cnt=page.evaluate("""()=>{const o={};for(let s=1;s<=28;s++){try{window.__sx.startRound('all',null,false,{focus:s});o[s]=window.__sx.state().Q.qs.length}catch(e){o[s]='ERR '+e.message}}return o}""")
    print(cnt)
    page.evaluate("()=>window.__sx.startRound('all',null,false,{focus:4})");page.wait_for_timeout(100)
    # fallar dos veces seguidas
    for _ in range(2):
        page.locator('.opt:not(.bad)[data-ok="0"]').first.click(); page.wait_for_timeout(50)
        page.locator('.opt:not(.bad)[data-ok="1"]').first.click(); page.wait_for_timeout(50)
        if page.locator('[data-act="rnext"]').count(): page.click('[data-act="rnext"]')
        page.wait_for_timeout(50)
    print('note', page.locator('.tnote').count())
    print(page.evaluate("()=>JSON.stringify(window.__sx.state().store.sk)"))
    page.screenshot(path='sk_note.png')
    if page.locator('.tnote button').count():
        page.locator('.tnote button').first.click();page.wait_for_timeout(300)
        print('h4 flash', page.locator('.teo h4.flash').count())
        page.screenshot(path='sk_theory.png')
    page.evaluate("()=>{document.querySelector('.hd .btn')&&document.querySelector('.hd .btn').click()}")
    page.evaluate("()=>window.__sx.state()")
    errs=page.evaluate("()=>JSON.stringify(window.__sx.state().store.fe)");print(errs)
    page.evaluate("()=>{const s=window.__sx.state().store;s.sk[4]={a:6,c:1,r:[0,0,1,0,0,0],t:Date.now(),w:1};}")
    page.evaluate("()=>window.__sx.setTab('inicio')");page.wait_for_timeout(100)
    print('suggest bubble', page.locator('[data-act="focus"]').count())
    page.screenshot(path='sk_home.png')
    page.click('.tbtn:has-text("Progreso")');page.wait_for_timeout(200)
    print('map rows', page.locator('.skr').count(), 'ta has Habilidades', 'Habilidades' in page.input_value('textarea.cp'))
    page.screenshot(path='sk_prog.png')
print('errors',errors)
