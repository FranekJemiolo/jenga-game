# 2D Jenga Game

A physics-based Jenga game built with Phaser 3 and Matter.js, featuring pseudo-3D rendering and turn-based gameplay.

## 🎮 Features

- **Physics-based tower**: Realistic block physics using Matter.js
- **Pseudo-3D rendering**: Custom projection system for depth perception
- **Turn-based gameplay**: 2-player local multiplayer
- **Mouse/touch interaction**: Drag blocks to remove them from the tower
- **Win detection**: Game ends when the tower collapses
- **Instant restart**: Quick game reset via button

## 🛠️ Tech Stack

- **Phaser 3.60.0**: Game engine for rendering and input handling
- **Matter.js 0.19.0**: 2D physics engine
- **Vanilla JavaScript**: No build tools required
- **GitHub Pages**: Hosting and deployment

## 🚀 How to Play

1. **Click and drag** a block to pull it from the tower
2. **Release** to complete your turn
3. **Alternate turns** with another player
4. **Avoid collapsing** the tower - the player who causes the collapse loses!
5. **Click Restart** to play again

## 🎯 Game Mechanics

- **Tower structure**: 10 levels, 3 blocks per level (30 total blocks)
- **Alternating orientation**: Blocks alternate between X and Z axis orientation
- **Collapse detection**: Tower collapses when any block rotates beyond 0.5 radians
- **Physics tuning**: Custom friction, density, and air resistance for realistic feel

## 📐 Architecture

### Core Systems

1. **Physics Engine (Matter.js)**
   - Simulates block interactions and gravity
   - Constraint-based dragging system
   - Custom physics parameters for Jenga-like behavior

2. **Rendering (Phaser 3)**
   - Custom pseudo-3D projection
   - Depth-sorted rendering for correct visual layering
   - Quad-based face drawing for 3D block appearance

3. **Projection System**
   - Isometric-style camera with angle and tilt
   - Converts 3D coordinates (x, y, z) to 2D screen space
   - Depth calculation for proper sorting

4. **Input Handling**
   - Point-in-quad picking for block selection
   - Front-to-back picking for correct selection
   - Screen-to-world coordinate conversion for dragging

## 🌐 Live Demo

[https://franekjemiolo.github.io/jenga-game/](https://franekjemiolo.github.io/jenga-game/)

## 📦 Installation & Local Development

No installation required - the game runs entirely in the browser.

To run locally:
1. Clone the repository
2. Open `docs/index.html` in a web browser
3. Or use a local server:
   ```bash
   python -m http.server 8000
   # Then visit http://localhost:8000/docs/
   ```

## 🔄 Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages:

- **Trigger**: Push to `main` branch
- **Build**: No build step required (static HTML)
- **Deploy**: Automatically deploys `docs/` folder to GitHub Pages
- **Workflow**: `.github/workflows/deploy.yml`

## 🧪 Testing Checklist

### Core Functionality
- [x] Blocks can be selected reliably
- [x] Dragging feels elastic and natural
- [x] Turns alternate correctly
- [x] Collapse condition triggers correctly
- [x] Winner is correctly assigned

### Cross-Device
- [x] Desktop (Chrome, Firefox, Safari)
- [x] Touch drag works on mobile
- [x] No accidental scroll/zoom on mobile

### Performance
- [x] Stable 60 FPS with full tower
- [x] No memory leaks
- [x] Smooth graphics rendering

## 🔮 Future Enhancements

Potential improvements for future versions:
- Axis-constrained dragging (real Jenga rule)
- Camera orbit controls
- Center of mass stability visualization
- Hover highlighting
- Sound effects
- Multiplayer online mode
- Block textures and improved visuals

## 📄 License

MIT License - feel free to use and modify as needed.

## 🤝 Contributing

This is a personal project, but suggestions and improvements are welcome!

---

Built with ❤️ using Phaser 3 and Matter.js
