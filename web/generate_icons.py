from PIL import Image, ImageDraw, ImageFont
import os

def make_icon(size, filename):
    img = Image.new("RGBA", (size, size), (15, 23, 42, 255)) # Dark slate base
    draw = ImageDraw.Draw(img)
    
    # Rounded rectangle background
    corner_radius = size // 5
    margin = size // 16
    draw.rounded_rectangle(
        [margin, margin, size - margin, size - margin],
        radius=corner_radius,
        fill=(30, 58, 138, 255), # Navy
        outline=(59, 130, 246, 255), # Blue border
        width=max(2, size // 64)
    )
    
    # Draw an inner glow / accent
    draw.rounded_rectangle(
        [margin + size//12, margin + size//12, size - margin - size//12, size - margin - size//12],
        radius=corner_radius // 2,
        fill=(14, 116, 144, 180), # Cyan-teal glow
        outline=(96, 165, 250, 200),
        width=max(1, size // 96)
    )

    # Draw text "AX" and "ROI"
    try:
        font = ImageFont.truetype("arial.ttf", size=size // 4)
        sub_font = ImageFont.truetype("arial.ttf", size=size // 8)
    except:
        font = ImageFont.load_default()
        sub_font = ImageFont.load_default()

    draw.text((size // 2, size // 2 - size // 10), "AX", fill=(255, 255, 255, 255), font=font, anchor="mm")
    draw.text((size // 2, size // 2 + size // 6), "ROI HUB", fill=(254, 240, 138, 255), font=sub_font, anchor="mm")

    img.save(filename, "PNG")
    print(f"Generated {filename}")

make_icon(192, "web/icon-192.png")
make_icon(512, "web/icon-512.png")
