import os
import sys
import webbrowser
import subprocess
from http.server import HTTPServer, SimpleHTTPRequestHandler
import socket

def find_free_port(starting_port=8080):
    port = starting_port
    while port < 9000:
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(('127.0.0.1', port)) != 0:
                return port
            port += 1
    return 8080

def main():
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    os.chdir(root_dir)

    port = find_free_port(8080)
    server_address = ('127.0.0.1', port)
    
    url = f"http://127.0.0.1:{port}/web/index.html"
    print("=" * 70)
    print("  AX PORTFOLIO MANAGER & AI ROI SIMULATOR")
    print(f"  로컬 웹 & PWA 앱 서버 실행 중: {url}")
    print("=" * 70)

    # Try launching Edge or Chrome in native standalone App Mode (--app)
    app_launched = False
    edge_paths = [
        r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
        r"C:\Program Files\Microsoft\Edge\Application\msedge.exe"
    ]
    chrome_paths = [
        r"C:\Program Files\Google\Chrome\Application\chrome.exe",
        r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe")
    ]

    browser_bin = None
    for p in edge_paths + chrome_paths:
        if os.path.exists(p):
            browser_bin = p
            break

    if browser_bin:
        try:
            print(f"[*] Standalone App 모드로 실행합니다: {browser_bin}")
            subprocess.Popen([browser_bin, f"--app={url}"])
            app_launched = True
        except Exception as e:
            print(f"[!] App mode launch fallback: {e}")

    if not app_launched:
        webbrowser.open(url)

    httpd = HTTPServer(server_address, SimpleHTTPRequestHandler)
    print("\n[서버 대기 중] 종료하려면 Ctrl+C 를 누르세요.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 정상 종료했습니다.")

if __name__ == "__main__":
    main()
