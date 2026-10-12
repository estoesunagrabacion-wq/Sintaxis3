import re, json, sys
SRC = 'datos.txt'
TOK = re.compile(r'\s+|[\wáéíóúüñÁÉÍÓÚÜÑ]+|[^\s\w]')
SPLIT = re.compile(r'(\[\[|\s*::[^\]]*\]\]|\{\{.*?\}\})')
ALIAS = {'CCC':'CCCn','CCau':'CCCa'}
def attrs(s):
    d = {}
    for part in s.split(';'):
        part = part.strip()
        if not part: continue
        k, v = part.split('=', 1)
        d[k.strip()] = v.strip()
    return d
def norm(v):
    return '/'.join(ALIAS.get(x, x) for x in v.split('/'))

def parse_sentence(line, warn):
    toks = []; props = []; prons = []
    stack = []; pending = []
    space = False
    def add_text(txt):
        nonlocal space
        for m in TOK.finditer(txt):
            t = m.group(0)
            if t.isspace(): space = True; continue
            w = 1 if re.match(r'[\wáéíóúüñÁÉÍÓÚÜÑ]', t) else 0
            toks.append({'t': t, 'w': w, 's': 1 if space else 0}); space = False
        return
    for part in SPLIT.split(line):
        if part == '' : continue
        if part == '[[':
            fr = {'start': len(toks), 'nexo': None, 'sp': space}
            if pending: fr['nexo'] = pending.pop(0)
            stack.append(fr)
        elif part.lstrip().startswith('::') and part.endswith(']]'):
            fr = stack.pop()
            a = attrs(part.strip()[2:-2])
            s, e = fr['start'], len(toks) - 1
            while s <= e and not toks[s]['w']: s += 1
            while e >= s and not toks[e]['w']: e -= 1
            p = {'s': s, 'e': e}
            for k, v in a.items():
                p[k] = norm(v) if k in ('f', 'nf', 'fn') else v
            if fr['nexo']: p['nexo'] = fr['nexo']
            p['_start'] = fr['start']
            props.append(p)
        elif part.startswith('{{'):
            inner = part[2:-2]
            word, at = inner.split('|', 1)
            a = attrs(at)
            before = len(toks)
            if space is False and False: pass
            add_text((' ' if False else '') + word)
            # first token of the marker keeps its leading space flag
            s, e = before, len(toks) - 1
            if 'p' in a:
                prons.append({'s': s, 'e': e, 'p': a['p']})
            else:
                n = {'s': s, 'e': e}
                for k, v in a.items():
                    n[k] = norm(v) if k == 'nf' else v
                if a.get('for') == 'next':
                    pending.append(n); n.pop('for')
                else:
                    if not stack: warn('nexo fuera de proposición: ' + word)
                    else: stack[-1]['nexo'] = n
        else:
            add_text(part)
    if stack: warn('corchetes sin cerrar')
    # antecedents
    for p in props:
        n = p.get('nexo')
        if n and 'a' in n:
            w = n['a'].lower(); idx = None
            for i in range(n['s'] - 1, -1, -1):
                if toks[i]['w'] and toks[i]['t'].lower() == w: idx = i; break
            if idx is None: warn('antecedente no hallado: ' + n['a'])
            n['a'] = idx
        p.pop('_start', None)
    props.sort(key=lambda p: (p['s'], -p['e']))
    for i, p in enumerate(props): p['i'] = i
    return toks, props, prons

def main():
    items = []; unit = None; cur = None; warns = []
    def warn(m): warns.append((cur['id'] if cur else '?', m))
    for raw in open(SRC, encoding='utf8'):
        line = raw.rstrip('\n')
        if not line.strip(): continue
        if line.startswith('#unit'):
            unit = line.split()[1]; continue
        if line.startswith('@'):
            mode, rest = line[1:].split(' ', 1)
            id_, label = [x.strip() for x in rest.split('|', 1)]
            cur = {'id': id_, 'u': unit, 'm': mode, 'l': label}
            items.append(cur); continue
        if line.startswith('N:'):
            cur['n'] = line[2:].strip(); continue
        if cur['m'] == 'choice':
            if line.startswith('Q:'): cur['q'] = line[2:].strip(); cur['o'] = []
            elif line[0] in '+-' and line[1] == ' ': cur['o'].append({'t': line[2:].strip(), 'ok': 1 if line[0] == '+' else 0})
            elif line.startswith('E:'): cur['e'] = line[2:].strip()
            continue
        toks, props, prons = parse_sentence(line, warn)
        cur['k'] = toks
        if cur['m'] == 'func':
            cur['spans'] = [{'s': p['s'], 'e': p['e'], 'fn': p['fn']} for p in props]
        else:
            cur['props'] = props
            if prons: cur['prons'] = prons
            if cur['m'] == 'pron': cur['prons'] = prons
    # validation
    for it in items:
        if it['m'] == 'choice':
            assert sum(o['ok'] for o in it['o']) == 1, it['id']
            continue
        if it['m'] == 'props':
            for p in it['props']:
                t = p.get('t'); n = p.get('nexo')
                if t is None: warns.append((it['id'], 'prop sin tipo'))
                if t == 'coord':
                    if n and 'ct' not in n: warns.append((it['id'], 'coord nexo sin ct'))
                if t == 'PIA':
                    if not n or 'nf' not in n or n.get('a') is None: warns.append((it['id'], 'PIA incompleta'))
                    if p.get('sub') not in ('esp', 'exp'): warns.append((it['id'], 'PIA sin sub'))
                if t == 'PIS':
                    if 'f' not in p: warns.append((it['id'], 'PIS sin f'))
                    if p.get('sub') == 'dd': pass
                    elif not n: warns.append((it['id'], 'PIS sin nexo'))
                    elif n['c'] in ('rel', 'int') and 'nf' not in n: warns.append((it['id'], 'PIS rel sin nf'))
                if t == 'PIAdv':
                    if p.get('sub') not in ('loc','temp','mod','cuant','caus','cons','conc','cond'): warns.append((it['id'], 'PIAdv sub'))
                    if not n: warns.append((it['id'], 'PIAdv sin nexo'))
                    elif n['c'] == 'rel' and 'nf' not in n: warns.append((it['id'], 'PIAdv rel sin nf'))
        if it['m'] == 'pron' and not it.get('prons'): warns.append((it['id'], 'sin pronombres'))
    json.dump(items, open('items.json', 'w', encoding='utf8'), ensure_ascii=False, separators=(',', ':'))
    from collections import Counter
    print(len(items), Counter(i['u'] for i in items))
    for w in warns: print('WARN', w)
main()
