# Manufacturer Logos

This directory contains logo images for car manufacturers displayed in the live timing board.

## Logo Files

Place manufacturer logo files in this directory. The live timing board alternates between displaying the car CLASS and the manufacturer logo in the CLASS column.

### Premium/European Manufacturers
- `aston-martin.png` - Aston Martin
- `audi.png` - Audi
- `bmw.png` - BMW
- `ferrari.png` - Ferrari
- `lamborghini.png` - Lamborghini
- `mclaren.png` - McLaren
- `mercedes-benz.png` - Mercedes-Benz
- `porsche.png` - Porsche
- `alfa-romeo.png` - Alfa Romeo
- `lotus.png` - Lotus
- `volkswagen.png` - Volkswagen
- `volvo.png` - Volvo
- `mini.png` - MINI

### Japanese Manufacturers
- `acura.png` - Acura
- `honda.png` - Honda
- `lexus.png` - Lexus
- `mazda.png` - Mazda
- `nissan.png` - Nissan
- `subaru.png` - Subaru
- `toyota.png` - Toyota

### American Manufacturers
- `chevrolet.png` - Chevrolet
- `dodge.png` - Dodge
- `ford.png` - Ford
- `cadillac.png` - Cadillac

### Racing/Specialty Manufacturers
- `ligier.png` - Ligier
- `ginetta.png` - Ginetta
- `nascar.png` - NASCAR

### Other Manufacturers
- `hyundai.png` - Hyundai

## Image Specifications

- **Format**: PNG with transparent background (strongly preferred)
- **Size**: 64×64 pixels (square) recommended
  - Alternative: 200px width with proportional height
- **Aspect Ratio**: Preserve original manufacturer logo aspect ratios
- **File Size**: Optimize for web (< 50KB per image recommended)
- **Background**: Transparent PNG for best results

## File Naming Convention

- Use **lowercase** filenames
- Use **hyphens** for multi-word names (e.g., `mercedes-benz.png`, `aston-martin.png`)
- Match the manufacturer name **exactly** as stored in the car profile database
- Example: If database has "BMW", filename should be `bmw.png`

## Usage

These logos are displayed in the live timing board's CLASS column, alternating every 4 seconds between:
1. **CLASS text** (e.g., "GTO", "GTU") - colored text badge
2. **Manufacturer logo** - PNG image from this directory

## Fallback Behavior

If a manufacturer logo file doesn't exist:
- The CLASS text continues to display
- No error is shown to the user
- Logs a warning in the browser console

## Managing Manufacturers

Manufacturers can be managed through the Admin Panel:
- Navigate to Admin Panel → Manufacturers tab
- Add, edit, or remove manufacturer names
- Changes sync to car profile dropdowns automatically
