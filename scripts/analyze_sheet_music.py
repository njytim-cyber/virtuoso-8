"""
Sheet Music Analysis Script
Uses OCR to identify which scales are on which pages.
Run this first to generate correct mapping, then use crop_sheet_music.py
"""

from PIL import Image
import pytesseract
import os
import re

# Set Tesseract path for Windows
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

SOURCE_DIR = "sheet-music"

def analyze_page(filename):
    """Analyze a page and extract text to identify scales."""
    filepath = os.path.join(SOURCE_DIR, filename)
    
    if not os.path.exists(filepath):
        print(f"  ERROR: {filepath} not found")
        return
    
    img = Image.open(filepath)
    
    # Auto-rotate based on EXIF
    try:
        exif = img._getexif()
        if exif:
            orientation = exif.get(274)
            if orientation == 3:
                img = img.rotate(180, expand=True)
            elif orientation == 6:
                img = img.rotate(270, expand=True)
            elif orientation == 8:
                img = img.rotate(90, expand=True)
    except:
        pass
    
    print(f"\n{'='*60}")
    print(f"Analyzing: {filename}")
    print(f"Size: {img.size}")
    print(f"{'='*60}")
    
    # Get dimensions
    width, height = img.size
    
    # Extract text from the left margin where scale names appear
    # Try multiple regions
    regions = [
        ("Full page", img),
        ("Left 20%", img.crop((0, 0, int(width * 0.2), height))),
        ("Top third left", img.crop((0, 0, int(width * 0.3), int(height * 0.33)))),
        ("Middle third left", img.crop((0, int(height * 0.33), int(width * 0.3), int(height * 0.66)))),
        ("Bottom third left", img.crop((0, int(height * 0.66), int(width * 0.3), height))),
    ]
    
    for region_name, region_img in regions:
        try:
            # Convert to grayscale for better OCR
            if region_img.mode != 'L':
                gray = region_img.convert('L')
            else:
                gray = region_img
            
            text = pytesseract.image_to_string(gray, config='--psm 6')
            
            # Look for scale identifiers
            scale_patterns = [
                r'[Aa]b\s*[Mm]ajor', r'[Gg]#?\s*[Mm]inor', r'[Gg]b?\s*[Mm]inor',
                r'[Cc]\s*[Mm]ajor', r'[Cc]\s*[Mm]inor', 
                r'[Dd]b?\s*[Mm]ajor', r'[Cc]#?\s*[Mm]inor',
                r'[Ee]b?\s*[Mm]ajor', r'[Ee]b?\s*[Mm]inor',
                r'[Ee]\s*[Mm]ajor', r'[Ee]\s*[Mm]inor',
                r'[Mm]elodic', r'[Hh]armonic',
                r'[Oo]ctaves?', r'3rds?', r'6ths?',
                r'[Dd]ominant', r'[Dd]iminished', r'[Cc]hromatic',
            ]
            
            found = []
            for pattern in scale_patterns:
                matches = re.findall(pattern, text, re.IGNORECASE)
                found.extend(matches)
            
            if found:
                print(f"\n{region_name}:")
                print(f"  Found patterns: {', '.join(found)}")
                
                # Print relevant lines
                lines = text.split('\n')
                for line in lines:
                    line = line.strip()
                    if any(re.search(p, line, re.IGNORECASE) for p in scale_patterns):
                        print(f"  Line: {line}")
        except Exception as e:
            print(f"  {region_name}: Error - {e}")


def main():
    print("Sheet Music Analysis - Identifying Scales via OCR")
    print("=" * 60)
    
    # Get all JPG files sorted by name
    files = sorted([f for f in os.listdir(SOURCE_DIR) if f.lower().endswith('.jpg')])
    
    print(f"Found {len(files)} images to analyze")
    
    for i, filename in enumerate(files, 1):
        print(f"\n[{i}/{len(files)}]")
        analyze_page(filename)
    
    print("\n" + "=" * 60)
    print("Analysis complete!")
    print("Use this information to update the PAGES mapping in crop_sheet_music.py")


if __name__ == "__main__":
    main()
