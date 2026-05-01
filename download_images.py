import requests
import re
import os
import urllib.parse

products = {
    "anua_oil.jpg": "Anua Heartleaf Pore Control Cleansing Oil 200ml",
    "anua_toner.jpg": "Anua Heartleaf 77 Soothing Toner 250ml",
    "skin1004_ampoule.jpg": "Skin1004 Madagascar Centella Asiatica Ampoule 55ml",
    "skin1004_sun.jpg": "Skin1004 Madagascar Centella Hyalu-Cica Water-fit Sun Serum",
    "haru_toner.jpg": "Haru Haru wonder Black Rice Hyaluronic Toner",
    "haru_cleanser.jpg": "Haru Haru Wonder Moisture 5.5 Soft Cleansing Gel"
}

os.makedirs("public/images", exist_ok=True)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

for filename, query in products.items():
    print(f"Searching for {query}...")
    url = f"https://www.bing.com/images/search?q={urllib.parse.quote(query)}"
    response = requests.get(url, headers=headers)
    
    match = re.search(r'murl&quot;:&quot;(https?://[^&"\'\s]+\.(?:jpg|png|jpeg))&quot;', response.text)
    if match:
        img_url = match.group(1)
        print(f"Downloading from {img_url}")
        try:
            img_data = requests.get(img_url, headers=headers, timeout=10).content
            with open(f"public/images/{filename}", 'wb') as f:
                f.write(img_data)
        except Exception as e:
            print(f"Failed to download: {e}")
    else:
        print("No image found.")
