# Spanish Catch Phrase 🎯

A fun Spanish word guessing game built with Next.js and Tailwind CSS.

## How to Play

1. **Setup**: Add players (minimum 2 players)
2. **Start**: Click "Comenzar" to begin the game
3. **Play**: The current player has 60 seconds to get others to guess as many Spanish words as possible
4. **Next Word**: Click "Siguiente Palabra" or press Spacebar when a word is guessed correctly
5. **Skip**: Click "Saltar Palabra" if a word is too difficult (doesn't count as guessed)
6. **Pass Turn**: Click "Pasar Turno" link in upper right to pass to the next player
7. **Pause**: Click "Pausar" link in upper right if you need a break (no time limit)
8. **Score**: Points are automatically added based on words guessed in each turn

## Features

- ⏱️ 60-second timer per turn
- ⏸️ Pause functionality (no time limit)
- ⌨️ Spacebar shortcut for next word
- 📝 950+ Spanish words across multiple difficulty levels
- 👥 Add/remove players dynamically
- 💾 Player names saved in browser
- 🎨 Clean, modern UI with Tailwind CSS
- 📊 Score tracking
- ✏️ Editable player names
- 🔄 No word repeats during a game session

## Getting Started

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Deploy to GitHub Pages

This app is configured for GitHub Pages deployment:

1. Push your code to a GitHub repository
2. Go to Settings → Pages in your repository
3. Select "GitHub Actions" as the source
4. The workflow will automatically build and deploy on every push to `main`

The app will be available at: `https://[your-username].github.io/[repository-name]/`

## Tech Stack

- **Next.js 14** - React framework with static export
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Hooks** - State management
- **localStorage** - Browser storage for player names and game history

## Word Categories

The game includes 950+ Spanish words from various categories:
- Animales (Animals)
- Comida (Food)
- Deportes (Sports)
- Profesiones (Professions)
- Transporte (Transportation)
- Cuerpo (Body)
- Colores (Colors)
- Naturaleza (Nature)
- Casa (House)
- Ropa (Clothing)
- Personajes y Ficción (Characters & Fiction)
- Conceptos Abstractos (Abstract Concepts)
- And many more!

Enjoy playing! 🎉

