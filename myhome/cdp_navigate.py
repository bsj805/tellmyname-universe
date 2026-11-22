import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

with sync_playwright() as p:
    browser = p.chromium.connect_over_cdp("http://127.0.0.1:9222")
    contexts = browser.contexts
    context = contexts[0] if contexts else browser.new_context()
    pages = context.pages
    page = pages[0] if pages else context.new_page()
    
    print("Connected to Chrome via CDP!")
    page.goto("https://gemini.google.com/app")
    print("Navigated to https://gemini.google.com/app")
