# convert D:\AM\GitHub\SmartMate-AI\extension\icons\icon.svg to D:\AM\GitHub\SmartMate-AI\extension\icons\icon.png
import fitz
from svglib import svglib
from reportlab.graphics import renderPDF

import os
import shutil

def convert_svg_to_png(svg_path, png_path):
    # Convert SVG to PDF
    drawing = svglib.svg2rlg(svg_path)
    renderPDF.drawToFile(drawing, "temp.pdf")

    # Open the PDF file
    pdf_document = fitz.open("temp.pdf")

    # Select the first page
    page = pdf_document[0]

    # Render the page to an image
    pix = page.get_pixmap()

    # Save the image as PNG
    pix.save(png_path)

    # Clean up temporary files
    pdf_document.close()
    os.remove("temp.pdf")
    print(f"Converted {svg_path} to {png_path}")

def main():
    svg_path = r"D:\AM\GitHub\SmartMate-AI\extension\icons\icon.svg"
    png_path = r"D:\AM\GitHub\SmartMate-AI\extension\icons\icon.png"

    # Check if the SVG file exists
    if not os.path.exists(svg_path):
        print(f"SVG file not found: {svg_path}")
        return

    # Convert SVG to PNG
    convert_svg_to_png(svg_path, png_path)

    # Check if the PNG file was created successfully
    if os.path.exists(png_path):
        print(f"PNG file created successfully: {png_path}")
    else:
        print(f"Failed to create PNG file: {png_path}")
main()