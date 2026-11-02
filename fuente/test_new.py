import os
from playwright.sync_api import sync_playwright
errors=[]
U='file://'+os.path.abspath('sintaxis.html')
with sync_playwright() as pw:
    b=pw.chromium.launch(); page=b.new_context(viewport={'width':400,'height':900}).new_page()
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(U);page.wait_for_timeout(300)
    # --- deshacer en cada tipo de ejercicio
    ids={}
    for it in page.evaluate("()=>window.__sx.ITEMS.map(i=>[i.id,i.m])"): ids.setdefault(it[1],it[0])
    print(ids)
    for m,id_ in ids.items():
        page.evaluate("id=>window.__sx.start(id)",id_)
        before=page.evaluate("()=>JSON.stringify(window.__sx.state().R,(k,v)=>k==='msg'||k==='it'?undefined:v)")
        # un par de toques / elecciones
        if m=='choice': page.click('.opt[data-ok="0"]')
        elif m=='func': page.click('[data-sj="ninguno"]')
        elif m=='pron': page.locator('.opt').first.click()
        else:
            page.locator('.sent .w').nth(0).click()
        assert page.locator('[data-undo]').is_enabled(),m
        page.click('[data-undo]')
        after=page.evaluate("()=>JSON.stringify(window.__sx.state().R,(k,v)=>k==='msg'||k==='it'?undefined:v)")
        assert before==after,(m,before[:200],after[:200])
        assert page.locator('[data-undo]').is_disabled(),m
    # --- desafío
    page.evaluate("()=>{window.__sx.setTab('inicio')}");page.wait_for_timeout(100)
    page.fill('#chnick','Ana');page.fill('#chcode','prueba1')
    page.click('[data-act="chal"]');page.wait_for_timeout(100)
    n=page.evaluate("()=>window.__sx.state().Q.qs.length");print('chal n',n)
    qs1=page.evaluate("()=>window.__sx.state().Q.qs.map(q=>q.q)")
    for i in range(n):
        x=page.evaluate("()=>{const q=window.__sx.state().Q;return {k:q.qs[q.i].k,ans:q.qs[q.i].ans}}")
        if i==2:  # fallo + deshacer
            if x['k']=='opt': page.click('.opt[data-ok="0"]')
            else: page.click('.sent .w >> nth=0')
            page.click('[data-undo]')
        if x['k']=='opt': page.click('.opt[data-ok="1"]')
        else: page.click(f'.sent .w[data-i="{x["ans"][0]}"]')
        page.click('[data-act="rnext"]')
    r=page.evaluate("()=>{const q=window.__sx.state().Q;return [q.done,q.good,q.pts,q.undos]}");print(r)
    assert r[0] and r[1]==12 and r[3]==1,r
    code=page.locator('textarea.cp').input_value();print(code)
    # mismo código => mismas preguntas
    page.click('text=Volver')
    page.fill('#chnick','Leo');page.fill('#chcode','prueba1');page.click('[data-act="chal"]')
    qs2=page.evaluate("()=>window.__sx.state().Q.qs.map(q=>q.q)")
    assert qs1==qs2
    # tabla
    page.evaluate("()=>window.__sx.setTab('inicio')")
    page.evaluate("()=>{}")
    b2=page.context.new_page();b2.goto(U);b2.wait_for_timeout(300)
    b2.click('text=Tabla del curso')
    b2.fill('.ov textarea',code+'\nLeo | prueba1 | 999 | ZZZ\nbasura')
    b2.click('.ov >> text=Ordenar');print(b2.locator('.ov table').inner_text())
    # tutorial
    b2.keyboard.press('Escape')
    b2.click('[aria-label="Cómo se usa"]')
    for _ in range(7): b2.click('.ov >> text=Siguiente') if b2.locator('.ov >> text=Siguiente').count() else None
    b2.screenshot(path='t_tuto_end.png')
    print('errors',errors)
    b.close()
