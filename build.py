import re

with open('raw.html', 'r', encoding='utf-8') as f:
    html = f.read()

html = html.replace('<head>', '<head>\n<base href="https://rainymood.com/">')

block1 = r'<br /><p>Also available on<br />\n+\n+<a href="https://open.spotify.com.*?</p>'
html = re.sub(block1, '<br /><p>Created By<br>Ramishka Madhushan</p>', html, flags=re.DOTALL)

block2 = r'<p>Also available on<br />\n+\n+<a href="https://open.spotify.com.*?</p>'
html = re.sub(block2, '<p>Created By<br>Ramishka Madhushan</p>', html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("done")
