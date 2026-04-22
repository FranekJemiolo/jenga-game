# Jenga Game Implementation Checklist

## Project Setup
- [x] Create project directory structure (`docs/` folder)
- [x] Initialize git repository
- [x] Create GitHub repository via CLI (FranekJemiolo/jenga-game)
- [x] Link local repo to GitHub remote

## Core Implementation
- [x] Implement single-file Jenga game (`docs/index.html`)
  - [x] Phaser 3 scene setup
  - [x] Matter.js physics engine integration
  - [x] Pseudo-3D projection system
  - [x] Tower creation (10 levels, 3 blocks per level)
  - [x] Depth sorting for rendering
  - [x] Block picking (point-in-quad)
  - [x] Dragging with Matter.js constraints
  - [x] Turn-based gameplay (2 players)
  - [x] Collapse detection (angle-based)
  - [x] Win condition assignment
  - [x] Restart functionality

## Documentation
- [x] Create README.md with project documentation
  - [x] Features overview
  - [x] Tech stack details
  - [x] How to play instructions
  - [x] Game mechanics explanation
  - [x] Architecture documentation
  - [x] Live demo link
  - [x] Local development instructions
  - [x] Deployment details

## CI/CD & Deployment
- [x] Create GitHub Actions workflow (`.github/workflows/deploy.yml`)
  - [x] Trigger on push to main branch
  - [x] Use peaceiris/actions-gh-pages@v4
  - [x] Configure contents: write permissions
  - [x] Set publish_dir to ./docs
- [x] Enable GitHub Pages via API
  - [x] Set build_type to legacy
  - [x] Configure source to gh-pages branch
- [x] Commit and push initial code
- [x] Verify CI/CD workflow runs successfully
- [x] Verify site is live (HTTP 200 response)

## Post-Deployment Verification

### Core Functionality Testing
- [x] Game loads without refresh
- [ ] Blocks can be selected reliably (no mis-click frustration)
- [ ] Dragging feels elastic, not rigid
- [ ] You can fully remove a block without glitches
- [ ] Turns alternate correctly
- [ ] Collapse condition always triggers (no immortal towers)
- [ ] Winner is correctly assigned
- [ ] Restart button works correctly

### Physics Feel Testing
- [ ] Tower wobbles slightly at rest (not frozen)
- [ ] Slow pull → stable
- [ ] Fast pull → destabilizes tower
- [ ] Collapse feels progressive, not instant explosion

### Rendering Testing
- [ ] Depth sorting is correct (no visual overlap bugs)
- [ ] Faces always render in correct order
- [ ] No flickering during movement
- [ ] Pseudo-3D projection looks correct

### Cross-Browser Testing
- [ ] Chrome (primary) - test game loads and plays
- [ ] Firefox - test event handling differences
- [ ] Safari - test canvas quirks

### Cross-Device Testing
- [ ] Touch drag works smoothly on mobile
- [ ] No accidental scroll / zoom on mobile
- [ ] Performance stable on mobile (no stutter)
- [ ] Touch events feel correct (no offset)

### Performance Testing
- [ ] Stable 60 FPS with full tower
- [ ] No memory leaks (especially constraints)
- [ ] Graphics.clear() not causing spikes
- [ ] No array recreation every frame (sorting/picking)

### Restart / State Reset Testing
- [ ] No ghost bodies remain after restart
- [ ] Input listeners don't duplicate
- [ ] UI resets correctly

### UX & Polish Testing
- [x] Current player clearly visible
- [x] Win message obvious
- [x] Restart always accessible
- [x] Cursor feedback (optional but recommended)

### Post-Deployment Verification
- [x] Game loads without refresh at live URL
- [ ] Input works immediately
- [x] No missing assets (CDN scripts loaded)
- [ ] Open DevTools → no console errors
- [ ] No warnings from Matter or Phaser
- [ ] No lag spikes after multiple plays
- [ ] Mobile still responsive

### Edge Cases Testing
- [ ] Dragging multiple times quickly
- [ ] Releasing outside canvas
- [ ] Clicking empty space
- [ ] Very fast drag → constraint instability
- [ ] Blocks partially outside view

## Dependencies Check
- [x] Phaser 3.60.0 (CDN)
- [x] Matter.js 0.19.0 (CDN)
- [ ] Verify CDN versions are locked
- [ ] Document version upgrade risks

## Security & Best Practices
- [x] Add .gitignore file
- [x] No hardcoded secrets
- [x] HTTPS enforced on GitHub Pages
- [ ] Consider local bundling for production (future)

## Final Checklist
- [ ] Game behaves predictably (skill-based, not random)
- [ ] Works on both desktop and mobile
- [ ] Can be restarted repeatedly without bugs
- [ ] Survives deployment without breaking
- [ ] README is comprehensive and accurate
- [ ] CI/CD pipeline is working
- [ ] Live site is accessible and functional

## Future Enhancements (Optional)
- [ ] Axis-constrained dragging (real Jenga rule)
- [ ] Camera orbit controls
- [ ] Center of mass stability visualization
- [ ] Hover highlighting
- [ ] Sound effects
- [ ] Improved block textures
- [ ] Local bundling (Vite) for production
