# Teacher Social Story Builder

A classroom tool for creating personalized social stories in English, Tagalog, and Ilokano.

## Run locally

1. Install Node.js 20 or newer.
2. Open a terminal in the `server` folder.
3. Run `npm ci`.
4. Copy `.env.example` to `.env`.
5. Add your Azure Speech key and region to `.env`.
6. Run `npm start`.
7. Open `http://localhost:3000`.

The website still runs when Azure Speech is not configured. Read-aloud and MP3 features will show a clear configuration message.

## Current features

- Reading-level options
- Common behavior, support, and goal choices
- English, Tagalog, and Ilokano story generation
- Optional student photo or character
- Original AAC-style picture cards with English, Tagalog, and Ilokano labels
- Read-aloud and MP3 export through Azure Speech
- PDF, print, copy, and local save
- Generator identity watermark

## Important deployment note

The current teacher password is checked in browser JavaScript. It should not be treated as secure access control because anyone can inspect a public frontend. Before storing sensitive student information, replace it with server-side authentication and review the hosting platform's privacy requirements.

The built-in picture cards are original visual supports created for this project. They are not official PECS®, Picture Communication Symbols, or SymbolStix artwork.
