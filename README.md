# Student Quiz Game

An interactive image-based quiz where the player guesses which student is shown. Built with vanilla JavaScript, HTML and CSS – no frameworks needed. This project has been a fun experiment in core JavaScript techniques and game logic.

---

<p float="left" align="center">
  <img src="https://github.com/user-attachments/assets/5caeb634-3cfa-428c-be88-5d8e0d33fdf1" alt="quiz-1" width="325"/>
  <img src="https://github.com/user-attachments/assets/6131737a-4789-472d-a790-671b78454c1e" alt="quiz-2" width="300"/>
</p>

---

## What I Practiced in This Project

### Higher-order array functions
Used built-in JavaScript array methods to write cleaner, more declarative code:
- `map()` – to dynamically render answer buttons
- `filter()` and `find()` – to control which students are shown and avoid duplicates
- `forEach()` – for button behavior and event handling

### Game State Management
The game is powered by a central `state` object, keeping track of:
- Remaining and already guessed students
- The correct answer for the current round
- Player score and round number
- Game length (8, 16, or full mode)

### Object Cloning
Used `structuredClone()` to deep copy the initial state and reset the game cleanly between rounds.

### Player Feedback
- Clear visual feedback (green/red buttons)
- Real-time score updates
- End-of-game screen with personalized message and high score tracking

---

## Technologies Used

- HTML5 + CSS3 (with Bootstrap for layout)
- Vanilla JavaScript
- Event handling and DOM manipulation
- Responsive design

---

## Potential Improvements

Ideas for future development:

- **Accessibility**: Add keyboard navigation and screen reader support
- **Animations**: Smooth transitions when showing new images
- **UX Enhancements**: Countdown mode, timer challenges
- **Sound effects**: Audio feedback for right/wrong answers
- **Persistent high score**: Save using `localStorage`

---

## Final Thoughts

This project was a hands-on way to explore key JavaScript concepts while building something fun and visually engaging. I'm happy with the result and excited to keep iterating on it!
