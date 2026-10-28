# Usage: python3 build.py  -> inlines engine.js into index.template.html and writes index.html
s=open('index.template.html',encoding='utf-8').read();e=open('engine.js',encoding='utf-8').read()
assert '/*ENGINE*/' in s;open('index.html','w',encoding='utf-8').write(s.replace('/*ENGINE*/',e));print('index.html built')
