# khalilppt

Fullscreen Arabic thesis presentation — Khalil · أثر القصة الرقمية في تعلّمية قواعد اللغة.

## Run

```bash
yarn dev
# or: npm run dev
```

Open http://localhost:5173

**Hidden editor:** http://localhost:5173/edit — edit slide text, drop images, auto-saves to localStorage, export/import JSON.

## Structure

| Path | Role |
|------|------|
| `src/pages/DeckEditor.jsx` | Hidden `/edit` — slide editor |
| `src/engine/deckStore.js` | localStorage + JSON export |
| `src/KhalilSlideShow.jsx` | Presenter shell (keyboard, nav, progress) — **start here** |
| `src/components/ManuscriptDeck.jsx` | Slide renderer (manuscript layout) |
| `src/data/khalil-full-deck.js` | All 39 slides content |
| `src/engine/khalilManuscriptBuild.js` | Builds page objects from deck data |
| `src/data/source.js` | Author / school metadata |

## Controls

- **← →** or **Space** — next / previous slide
- **Home / End** — first / last slide
- Click dots to jump

## Customize

Edit `src/data/khalil-full-deck.js` for slide text, or set `USE_MANUSCRIPT_RENDERER = false` in `KhalilSlideShow.jsx` for the lightweight built-in card UI.
