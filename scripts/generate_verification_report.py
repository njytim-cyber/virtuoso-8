"""
Sheet Music Visual Verification Report Generator
Creates an HTML report with all 42 images for manual visual verification.
"""

from PIL import Image
import os
import base64
from io import BytesIO

# Directory with cropped images
CROPPED_DIR = "public/sheet-music/cropped"
OUTPUT_HTML = "public/sheet-music-verification.html"

# Question information from questions.js
QUESTIONS = [
    ("I-1", "Ab Major Scale"),
    ("I-2", "G# Minor Melodic Scale"),
    ("I-3", "G# Minor Harmonic Scale"),
    ("I-4", "C Major Scale"),
    ("I-5", "C Minor Melodic Scale"),
    ("I-6", "C Minor Harmonic Scale"),
    ("I-7", "Db Major Scale"),
    ("I-8", "C# Minor Melodic Scale"),
    ("I-9", "C# Minor Harmonic Scale"),
    ("I-10", "Eb Major Scale"),
    ("I-11", "Eb Minor Melodic Scale"),
    ("I-12", "Eb Minor Harmonic Scale"),
    ("I-13", "E Major Scale"),
    ("I-14", "E Minor Melodic Scale"),
    ("I-15", "E Minor Harmonic Scale"),
    ("II-1", "Ab Major Arpeggio"),
    ("II-2", "G# Minor Arpeggio"),
    ("II-3", "C Major Arpeggio"),
    ("II-4", "C Minor Arpeggio"),
    ("II-5", "Db Major Arpeggio"),
    ("II-6", "C# Minor Arpeggio"),
    ("II-7", "Eb Major Arpeggio"),
    ("II-8", "Eb Minor Arpeggio"),
    ("II-9", "E Major Arpeggio"),
    ("II-10", "E Minor Arpeggio"),
    ("III-1", "Dom 7th in Db"),
    ("III-2", "Dom 7th in F"),
    ("III-3", "Dom 7th in Ab"),
    ("III-4", "Dom 7th in A"),
    ("IV-1", "Dim 7th on C"),
    ("IV-2", "Dim 7th on Eb"),
    ("IV-3", "Dim 7th on E"),
    ("IV-4", "Dim 7th on Ab"),
    ("V-1", "Chromatic on C"),
    ("V-2", "Chromatic on Eb"),
    ("V-3", "Chromatic on E"),
    ("V-4", "Chromatic on Ab"),
    ("VI-1", "Double Stop 3rds in Bb"),
    ("VI-5", "Double Stop Octaves in D"),
    ("VI-6", "Double Stop Octaves in Gm Melodic"),
    ("VI-7", "Double Stop Octaves in Gm Harmonic"),
    ("VI-8", "Double Stop 6ths in Eb"),
]


def generate_report():
    """Generate an HTML report for visual verification."""
    
    html = """<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sheet Music Verification Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #1a1a2e;
            color: white;
        }
        h1 {
            text-align: center;
            color: #818cf8;
        }
        .instructions {
            background: #2d2d44;
            padding: 15px;
            border-radius: 10px;
            margin-bottom: 20px;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
            gap: 20px;
        }
        .card {
            background: #2d2d44;
            border-radius: 10px;
            overflow: hidden;
            border: 2px solid transparent;
        }
        .card.error {
            border-color: #ef4444;
        }
        .card-header {
            padding: 15px;
            background: #3d3d5c;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .question-id {
            font-weight: bold;
            color: #818cf8;
            font-size: 1.2em;
        }
        .expected-title {
            color: #a5b4fc;
        }
        .card-body {
            padding: 10px;
        }
        .card-body img {
            width: 100%;
            height: auto;
            background: white;
            border-radius: 5px;
        }
        .status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 5px;
            display: flex;
            gap: 10px;
        }
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        }
        .btn-correct {
            background: #22c55e;
            color: white;
        }
        .btn-wrong {
            background: #ef4444;
            color: white;
        }
        .btn:hover {
            opacity: 0.9;
        }
        .file-missing {
            background: #ef4444;
            padding: 20px;
            text-align: center;
            color: white;
        }
        .summary {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #3d3d5c;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .summary-count {
            font-size: 1.5em;
            font-weight: bold;
        }
        .correct { color: #22c55e; }
        .wrong { color: #ef4444; }
    </style>
</head>
<body>
    <h1>🎻 Sheet Music Verification Report</h1>
    
    <div class="instructions">
        <h3>Instructions:</h3>
        <p>For each card below, verify that the sheet music image matches the expected scale/arpeggio title.</p>
        <p>Look for the scale name written on the sheet music (usually at the start of the first line).</p>
        <p>Click ✓ Correct or ✗ Wrong to mark each one.</p>
    </div>
    
    <div class="grid">
"""
    
    for qid, expected_title in QUESTIONS:
        filename = f"{qid.lower().replace('-', '_')}.jpg"
        filepath = os.path.join(CROPPED_DIR, filename)
        
        if os.path.exists(filepath):
            # Use correct path from public root
            img_src = f"/sheet-music/cropped/{filename}"
            img_html = f'<img src="{img_src}" alt="{expected_title}">'
        else:
            img_html = f'<div class="file-missing">FILE NOT FOUND: {filename}</div>'
        
        html += f"""
        <div class="card" id="card-{qid}" data-qid="{qid}">
            <div class="card-header">
                <span class="question-id">{qid}</span>
                <span class="expected-title">Expected: {expected_title}</span>
            </div>
            <div class="card-body">
                {img_html}
                <div class="status">
                    <button class="btn btn-correct" onclick="markCorrect('{qid}')">✓ Correct</button>
                    <button class="btn btn-wrong" onclick="markWrong('{qid}')">✗ Wrong</button>
                </div>
            </div>
        </div>
"""
    
    html += """
    </div>
    
    <div class="summary">
        <div>Verified: <span id="verified-count" class="summary-count">0</span> / 42</div>
        <div><span class="correct">✓</span> <span id="correct-count">0</span> | <span class="wrong">✗</span> <span id="wrong-count">0</span></div>
    </div>
    
    <script>
        const results = {};
        
        function updateSummary() {
            const correct = Object.values(results).filter(r => r === 'correct').length;
            const wrong = Object.values(results).filter(r => r === 'wrong').length;
            document.getElementById('verified-count').textContent = Object.keys(results).length;
            document.getElementById('correct-count').textContent = correct;
            document.getElementById('wrong-count').textContent = wrong;
        }
        
        function markCorrect(qid) {
            results[qid] = 'correct';
            const card = document.getElementById('card-' + qid);
            card.style.borderColor = '#22c55e';
            updateSummary();
        }
        
        function markWrong(qid) {
            results[qid] = 'wrong';
            const card = document.getElementById('card-' + qid);
            card.style.borderColor = '#ef4444';
            updateSummary();
            alert('Please note: ' + qid + ' is marked as WRONG. The page mapping needs to be corrected.');
        }
    </script>
</body>
</html>
"""
    
    with open(OUTPUT_HTML, 'w', encoding='utf-8') as f:
        f.write(html)
    
    print(f"Generated verification report: {OUTPUT_HTML}")
    print(f"Open in browser: http://localhost:5173/sheet-music-verification.html")


if __name__ == "__main__":
    generate_report()
