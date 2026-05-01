from PIL import Image

def fix_checkerboard(image_path, output_path):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        r, g, b, a = item
        # Check if the pixel is light and relatively neutral (grey/white)
        # We use > 190 to catch standard grey checkerboards.
        if r > 190 and g > 190 and b > 190 and max(r,g,b) - min(r,g,b) < 20:
            # Replace with completely transparent
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")
    print(f"Fixed image saved to {output_path}")

fix_checkerboard("public/logo_new.png", "public/logo_fixed.png")
