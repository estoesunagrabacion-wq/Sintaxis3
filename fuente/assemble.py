import json,re
items=open('items.json',encoding='utf8').read()
css=open('app.css',encoding='utf8').read()
js=open('app.js',encoding='utf8').read().replace('__ITEMS__',items)
teo=open('teoria.js',encoding='utf8').read()
html=f'''<title>Sintaxis de tercer año</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&family=Caveat:wght@700&family=Literata:opsz,wght@7..72,400;7..72,600;7..72,700&display=swap">
<style>
{css}
</style>
<div id="app"></div>
<script>
{teo}
{js}
</script>
'''
open('sintaxis_body.html','w',encoding='utf8').write(html)
# archivo independiente (con esqueleto)
full='<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">'+html.replace('<div id="app"></div>','</head><body><div id="app"></div>',1)+'</body></html>'
full=full.replace('<title>Sintaxis de tercer año</title>','<title>Sintaxis de tercer año</title>',1)
open('sintaxis.html','w',encoding='utf8').write(full)
print(len(html), len(full))
