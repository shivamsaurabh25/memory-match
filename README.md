# 🧠 Memory Matching Game

A fun and fully responsive memory game built using **React** and **Tailwind CSS**. Match all the emoji cards as fast as you can while keeping your turn count low! Perfect for brain training and having fun with custom themes and difficulty levels.

---

## 🚀 Features

- 🎨 **Multiple Emoji Themes**: Choose from Food, Animals, and Fruits.
- 🎮 **Difficulty Levels**: Easy, Medium, Hard, and Expert.
- ⏱️ **Timer**: Tracks how long you take to finish the game.
- 🔁 **Turn Counter**: Shows the number of turns taken.
- 🏆 **Best Time Storage**: Saves your best time using `localStorage`.
- 🎉 **Win Animation**: Confetti blast when you win!
- 🔊 **Sound Effects**: Win sound (toggleable).
- 🌓 **Dark Mode Toggle**: Seamless dark/light mode support.
- ⏸️ **Pause/Resume**: Temporarily pause the game.
- 💾 **Auto-Save Game**: Saves progress using `localStorage`.
- 🔄 **New Game Button**: Restart anytime with a click.

---

## 🛠️ Tech Stack

- **React**
- **Tailwind CSS**
- **canvas-confetti** (for win animation)

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/shivamsaurabh25/memory-match.git
cd memory-match
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## 🗂️ File Structure

```
🗂️memory-match/
├── 🗂️ public/
│   └── 🗂️ sounds/
│       └── win.mp3
├── 🗂️ src/
│   ├── 🗂️ components/
│   │   └── Card.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🔊 Add Sound File

Make sure you have a `win.mp3` sound file located at:

```
public/sounds/win.mp3
```

You can use a free win sound effect from:
- [freesound.org](https://freesound.org)
- [zapsplat.com](https://www.zapsplat.com)

## ✨ Customization

- 🎭 Add new themes by updating the `themes` object in `App.jsx`.
- 🎲 Adjust difficulty by modifying the `levels` object.
- 🔉 Replace or add sound effects in the `/public/sounds` folder.

## 👥 Contributing

Feel free to fork this repo and improve the game with new features like:
- Multiplayer support
- Score sharing
- Leaderboards

Pull requests are welcome! 🙌

## 📄 License

This project is open-source and available under the **MIT License**.

---