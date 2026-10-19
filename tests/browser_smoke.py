"""Optional visual integration smoke test (requires Playwright + Chromium).
Run: xvfb-run -a python tests/browser_smoke.py
Avoids outbound network, emulates local static hosting via intercepted resources.
"""
from pathlib import Path
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
import mimetypes
root=Path(__file__).resolve().parents[1]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=False,executable_path='/usr/bin/chromium',args=['--no-sandbox','--enable-webgl','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist','--disable-gpu-sandbox'])
    page=browser.new_page(viewport={'width':1460,'height':980},device_scale_factor=1)
    errors=[]
    page.on('console', lambda m: print('CONSOLE',m.type,m.text[:700]) if m.type in ('error','warning') else None)
    page.on('pageerror',lambda e:errors.append(str(e)))
    def fulfill(route):
        path=urlsplit(route.request.url).path.lstrip('/')
        local=root/path
        if route.request.url.startswith('https://pixel-game.test/') and local.is_file():
            route.fulfill(status=200,body=local.read_bytes(),content_type=mimetypes.guess_type(str(local))[0] or 'application/octet-stream',headers={'Access-Control-Allow-Origin':'*'})
        else:route.abort()
    page.route('**/*',fulfill)
    # set_content has opaque about:blank origin in this restricted browser environment.
    page.evaluate('''(() => {const m=new Map();Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return m.has(k)?m.get(k):null},setItem(k,v){m.set(k,String(v))},removeItem(k){m.delete(k)},clear(){m.clear()}}})})()''')
    html=(root/'index.html').read_text().replace('<head>','<head><base href="https://pixel-game.test/">',1)
    page.set_content(html,wait_until='domcontentloaded')
    page.wait_for_timeout(2200)
    assert page.locator('#playBtn').is_visible()
    page.screenshot(path=str(root/'preview-menu-v2.png'),full_page=True)
    page.locator('#playBtn').click()
    page.get_by_role('button', name='PULAR TUTORIAL').click()
    page.wait_for_timeout(2800)
    gpu=page.evaluate('''() => ({available:!!gpu,ready:!!gpu?.ready,frame:gpu?.frame||0,offline:gpu?.offline,frames:Object.keys(gpu?.frames||{}).length,texture:gpu?.gl?.getParameter(gpu.gl.MAX_TEXTURE_SIZE)})''')
    print('RENDER:',gpu)
    assert gpu['available'] and gpu['ready'] and gpu['frame']>20 and gpu['frames']>=90, 'WebGL2 atlas not initialized'
    assert page.locator('#renderBadge').inner_text()=='✦ WEBGL2 • GPU'
    page.screenshot(path=str(root/'preview-game-v2.png'),full_page=True)
    page.locator('#solutionBtn').click()
    page.locator('#modalActions .btn.primary').click()
    page.locator('#runBtn').click()
    page.wait_for_timeout(2000)
    assert 'Missão cumprida' in page.locator('#gameStatus').inner_text()
    assert page.locator('#headStars').inner_text()=='★★★'
    page.locator('#modalActions .btn.primary').click()
    page.wait_for_timeout(850)
    assert '02 —' in page.locator('#levelTitle').inner_text()
    assert not errors,'Browser JS exceptions: '+repr(errors)
    print('PASS: menu / atlas / WebGL2 / win / level unlock / no JS errors')
    browser.close()
