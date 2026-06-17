import os
from PIL import Image, ImageDraw, ImageFont

def generate_sheet():
    images_dir = 'public/images'
    files = [f for f in os.listdir(images_dir) if f.lower().endswith('.png') and f != 'contact_sheet.png']
    files.sort()
    
    cols = 5
    rows = (len(files) + cols - 1) // cols
    
    cell_width = 250
    cell_height = 250
    
    sheet_width = cols * cell_width
    sheet_height = rows * cell_height
    
    sheet = Image.new('RGB', (sheet_width, sheet_height), 'white')
    draw = ImageDraw.Draw(sheet)
    
    for idx, f in enumerate(files):
        path = os.path.join(images_dir, f)
        try:
            img = Image.open(path)
            # Resize image to fit cell
            img.thumbnail((cell_width - 20, cell_height - 60))
            
            c = idx % cols
            r = idx // cols
            
            x_offset = c * cell_width + (cell_width - img.width) // 2
            y_offset = r * cell_height + (cell_height - 60 - img.height) // 2
            
            # Paste image
            if img.mode in ('RGBA', 'LA'):
                sheet.paste(img, (x_offset, y_offset), img)
            else:
                sheet.paste(img, (x_offset, y_offset))
                
            # Draw label text
            text_x = c * cell_width + 10
            text_y = (r + 1) * cell_height - 50
            
            # Simple text wrapping
            text = f
            if len(text) > 30:
                text = text[:27] + "..."
                
            draw.text((text_x, text_y), text, fill='black')
            draw.text((text_x, text_y + 15), f"Size: {img.width}x{img.height}", fill='gray')
            draw.rectangle([c * cell_width, r * cell_height, (c + 1) * cell_width, (r + 1) * cell_height], outline='lightgray')
        except Exception as e:
            print(f"Error loading {f}: {e}")
            
    sheet.save('public/images/contact_sheet.png')
    print("Saved public/images/contact_sheet.png successfully!")

if __name__ == '__main__':
    generate_sheet()
