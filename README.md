# Logic Gate Adder Exhibit Demo

A small local web app that demonstrates decimal addition through a ripple-carry adder visualization.

## What it does

- Lets you enter two decimal numbers (0-15).
- Shows live binary representation of each input.
- On **GO**, zooms from a chip overview into a gate-level view.
- Animates energized wires/gates as each full-adder stage computes.
- Updates final decimal and binary tickers, then allows replay.

## Run locally

### Option 1: Open directly

Open `index.html` in your browser.

### Option 2 (recommended): local HTTP server

```bash
cd /workspace/LogicGates
python3 -m http.server 8000
```

Then open:

`http://localhost:8000`

## Files

- `index.html` - Layout and SVG circuit.
- `styles.css` - Retro booth/tube styling + animation states.
- `app.js` - Binary conversion, full-adder logic, and timeline playback.

## Notes

- Uses a fixed 4-bit adder with a 5th carry-out output bit.
- Click **Reset** to return to the chip overview and clear highlights.
