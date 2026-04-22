# Jenga Game - Remaining Challenges & Implementation Plan

## Current State
The game currently uses a pseudo-3D isometric projection system with depth sorting. This needs to be redesigned to use flat 2D views similar to the hidden-face-game architecture.

## Target Architecture
**Flat 2D Views System (like hidden-face-game):**
- Multiple flat 2D views (front, side, top, isometric)
- Camera rotation to switch between views
- Blocks slide out in 2D plane
- Technical drawing style (orthographic views)
- Clear visual distinction between views

## Implementation Challenges

### 1. View System Redesign
**Challenge:** Replace pseudo-3D projection with flat 2D view system

**Current Implementation:**
- Isometric-style camera with angle/tilt/zoom
- Depth-based sorting for rendering
- 3D coordinate projection to 2D screen space

**Required Changes:**
- Implement view camera system with discrete view modes:
  - Front view (X-Y plane)
  - Side view (Z-Y plane)
  - Top view (X-Z plane)
  - Isometric view (current style as optional)
- Each view renders blocks as flat 2D rectangles
- No depth sorting needed for flat views
- View switching with keyboard/UI controls

**Technical Approach:**
```javascript
class ViewCamera {
  constructor() {
    this.currentView = 'front'; // front, side, top, isometric
    this.rotation = 0; // 0, 90, 180, 270 degrees
  }

  project(x, y, z) {
    switch(this.currentView) {
      case 'front': return { x: x, y: y };
      case 'side': return { x: z, y: y };
      case 'top': return { x: x, y: z };
      case 'isometric': return this.isometricProject(x, y, z);
    }
  }
}
```

### 2. Physics System Adaptation
**Challenge:** Adapt Matter.js physics for 2D sliding mechanics

**Current Implementation:**
- 2D physics in X-Y plane
- Z coordinate is fake (only for projection)
- Dragging uses screen coordinates directly

**Required Changes:**
- Physics needs to work in the current view's plane
- When in front view: physics in X-Y plane (current)
- When in side view: physics in Z-Y plane (need to map)
- When in top view: physics in X-Z plane (need to map)
- Dragging must respect current view's coordinate system

**Technical Approach:**
```javascript
class PhysicsAdapter {
  getPhysicsCoordinates(screenX, screenY, view) {
    switch(view) {
      case 'front': return { x: screenX, y: screenY };
      case 'side': return { x: this.block.z, y: screenY }; // Map Z to physics X
      case 'top': return { x: screenX, y: this.block.z }; // Map Z to physics Y
    }
  }
}
```

**Major Complexity:**
- Matter.js only supports 2D physics (X-Y plane)
- Need to transform coordinates between view space and physics space
- May need to rotate physics bodies when switching views
- Or maintain multiple physics representations

### 3. Rendering System Overhaul
**Challenge:** Render blocks as flat 2D rectangles in each view

**Current Implementation:**
- 3D corner calculation (8 corners per block)
- 3-face rendering (top, side, front)
- Depth sorting for painter's algorithm

**Required Changes:**
- Simple rectangle rendering for flat views
- Single face per block (no 3D faces)
- Color coding to indicate block depth/orientation
- Optional: outline/stroke to show block boundaries
- View-specific visual hints (e.g., depth lines in side view)

**Technical Approach:**
```javascript
drawBlock(block, view) {
  const pos = this.project(block.body.position.x, block.body.position.y, block.z);
  const { w, h } = block;

  if (view === 'isometric') {
    // Use current 3D rendering
    this.drawBlock3D(block);
  } else {
    // Flat 2D rendering
    this.graphics.fillStyle(this.getBlockColor(block, view), 1);
    this.graphics.fillRect(pos.x - w/2, pos.y - h/2, w, h);
    this.graphics.lineStyle(2, 0x000000, 0.5);
    this.graphics.strokeRect(pos.x - w/2, pos.y - h/2, w, h);
  }
}
```

### 4. Picking System Redesign
**Challenge:** Block selection must work in flat 2D views

**Current Implementation:**
- Point-in-quad test on projected 3D faces
- Front-to-back depth sorting for picking
- Only tests top face

**Required Changes:**
- Simple point-in-rectangle test for flat views
- No depth sorting needed (blocks don't overlap in flat views)
- View-specific picking logic
- Handle edge cases: blocks behind other blocks in same view

**Technical Approach:**
```javascript
pickBlock(pointer, view) {
  for (const block of this.blocks) {
    const pos = this.project(block.body.position.x, block.body.position.y, block.z);
    const { w, h } = block;

    if (this.pointInRect(pointer.x, pointer.y, pos.x - w/2, pos.y - h/2, w, h)) {
      return block;
    }
  }
  return null;
}
```

### 5. Sliding Mechanics Implementation
**Challenge:** Implement proper sliding mechanics (not just dragging)

**Current Implementation:**
- Elastic constraint dragging
- Can pull in any direction
- No axis constraints

**Required Changes:**
- Constrain dragging to block's primary axis
- Front view: blocks oriented along Z can slide in Z
- Side view: blocks oriented along X can slide in X
- Visual feedback showing allowed slide direction
- Prevent diagonal pulling
- Add "snap" or resistance when trying to pull wrong direction

**Technical Approach:**
```javascript
setupInput() {
  this.input.on("pointerdown", (p) => {
    const block = this.pickBlock(p);
    if (!block) return;

    // Determine slide axis based on view and block orientation
    const slideAxis = this.getSlideAxis(block, this.currentView);
    
    this.dragConstraint = Matter.Constraint.create({
      pointA: { x: p.x, y: p.y },
      bodyB: block.body,
      stiffness: 0.002,
      damping: 0.1
    });

    // Add axis constraint
    this.axisConstraint = this.createAxisConstraint(block, slideAxis);
  });
}
```

### 6. View Switching UI
**Challenge:** Add intuitive view switching controls

**Required Implementation:**
- Keyboard shortcuts (1: front, 2: side, 3: top, 4: isometric)
- On-screen buttons for mobile
- Smooth transitions between views
- Visual indicator of current view
- Optional: animated camera rotation

**Technical Approach:**
```javascript
setupViewControls() {
  // Keyboard
  this.input.keyboard.on('keydown-ONE', () => this.switchView('front'));
  this.input.keyboard.on('keydown-TWO', () => this.switchView('side'));
  this.input.keyboard.on('keydown-THREE', () => this.switchView('top'));
  this.input.keyboard.on('keydown-FOUR', () => this.switchView('isometric'));

  // UI buttons
  this.createViewButtons();
}

switchView(newView) {
  this.currentView = newView;
  this.updatePhysicsForView(newView);
  this.renderBlocks();
}
```

### 7. Physics-View Synchronization
**Challenge:** Keep physics simulation consistent across view switches

**Major Complexity:**
- Matter.js only simulates in 2D (X-Y plane)
- Different views need different physics planes
- Options:
  1. **Single physics engine, coordinate mapping** (complex)
  2. **Multiple physics engines, one per view** (memory heavy)
  3. **Rotate physics bodies when switching views** (state sync issues)
  4. **Custom physics implementation** (most work, most control)

**Recommended Approach:**
- Use single physics engine in X-Y plane
- Map coordinates when switching views
- Rotate bodies 90 degrees when switching between front/side/top
- Maintain mapping between visual coordinates and physics coordinates

**Technical Approach:**
```javascript
switchView(newView) {
  const oldView = this.currentView;
  this.currentView = newView;

  // Rotate physics bodies if needed
  if (this.requiresRotation(oldView, newView)) {
    this.rotatePhysicsBodies(oldView, newView);
  }
}

rotatePhysicsBodies(from, to) {
  for (const block of this.blocks) {
    const angle = this.getRotationAngle(from, to);
    Matter.Body.rotate(block.body, angle);
    // Swap dimensions if needed
    this.swapBlockDimensions(block, from, to);
  }
}
```

### 8. Visual Feedback & Polish
**Challenge:** Add visual cues for gameplay clarity

**Required Features:**
- Highlight hovered block
- Show slide direction with arrow
- Color code blocks by depth level
- View indicator in UI
- Smooth animations for view transitions
- Block selection outline

**Technical Approach:**
```javascript
renderBlocks() {
  this.graphics.clear();

  for (const b of this.blocks) {
    this.drawBlock(b);
    
    if (b === this.hoveredBlock) {
      this.drawHighlight(b);
    }
    
    if (b === this.selectedBlock) {
      this.drawSlideDirection(b);
    }
  }
}
```

### 9. Edge Cases & Stability
**Challenge:** Handle edge cases in new system

**Edge Cases to Handle:**
- Switching views while dragging
- Blocks at edge of screen in different views
- Physics instability after view rotation
- Multiple blocks in same position in different views
- Tower collapse detection in different views
- Restart after view switch

**Testing Required:**
- Rapid view switching
- Dragging across view boundaries
- Tower stability after multiple view switches
- Collision detection in different views

### 10. Performance Optimization
**Challenge:** Ensure smooth performance with new system

**Optimization Points:**
- Cache view projections
- Minimize physics body rotations
- Efficient view switching (no full rebuild)
- Optimize rendering for flat views (simpler than 3D)
- Handle 30 blocks efficiently

## Implementation Order

### Phase 1: Foundation (High Priority)
1. Implement ViewCamera class with discrete view modes
2. Update rendering to support flat 2D views
3. Add view switching UI (keyboard + buttons)
4. Test view switching without physics

### Phase 2: Physics Integration (High Priority)
5. Implement coordinate mapping between views and physics
6. Add physics body rotation for view switches
7. Test physics stability across view switches
8. Update picking for flat views

### Phase 3: Gameplay Mechanics (Medium Priority)
9. Implement axis-constrained sliding
10. Add slide direction visual feedback
11. Implement block highlighting
12. Test gameplay in all views

### Phase 4: Polish & Edge Cases (Medium Priority)
13. Add smooth view transitions
14. Handle edge cases (dragging during switch, etc.)
15. Add color coding for depth
16. Performance optimization

### Phase 5: Testing & Validation (High Priority)
17. Cross-browser testing
18. Mobile touch testing
19. Performance profiling
20. Gameplay balance tuning

## Technical Risks

### High Risk
- **Physics synchronization**: Complex coordinate mapping may introduce bugs
- **View rotation**: Rotating physics bodies may cause instability
- **State consistency**: Keeping game state consistent across views

### Medium Risk
- **Performance**: Multiple view calculations may impact FPS
- **UX**: View switching may be confusing without good UI
- **Mobile**: Touch controls for view switching may be awkward

### Low Risk
- **Rendering**: Flat views are simpler than current 3D
- **Picking**: Point-in-rect is simpler than point-in-quad
- **Deployment**: No changes to CI/CD needed

## Alternative Approaches Considered

### Option 1: Multiple Physics Engines
- Create separate Matter.js engine for each view
- Pros: Clean separation, no coordinate mapping
- Cons: Memory heavy, state sync complex
- **Decision: Rejected** (too complex)

### Option 2: Custom Physics Implementation
- Write custom 2D physics for Jenga
- Pros: Full control, no Matter.js limitations
- Cons: Lots of work, lose Matter.js stability
- **Decision: Rejected** (too much work)

### Option 3: Keep Current Pseudo-3D
- Add view switching to current system
- Pros: Less work, physics already works
- Cons: Not flat 2D as requested
- **Decision: Rejected** (doesn't meet requirements)

### Option 4: Single Physics + Coordinate Mapping (Selected)
- Use single Matter.js engine
- Map coordinates between views
- Rotate bodies when switching views
- Pros: Manageable complexity, keeps Matter.js
- Cons: Complex coordinate mapping
- **Decision: Selected** (best balance)

## Success Criteria

### Functional
- [ ] All 4 views render correctly
- [ ] View switching works smoothly
- [ ] Physics works in all views
- [ ] Sliding constrained to correct axis
- [ ] Tower collapse detection works in all views

### UX
- [ ] View switching is intuitive
- [ ] Visual feedback is clear
- [ ] Gameplay feels natural in all views
- [ ] Mobile controls work well

### Technical
- [ ] No physics instability
- [ ] Stable 60 FPS
- [ ] No memory leaks
- [ ] Cross-browser compatible

## Estimated Effort

- **Phase 1 (Foundation)**: 4-6 hours
- **Phase 2 (Physics Integration)**: 6-8 hours
- **Phase 3 (Gameplay Mechanics)**: 4-6 hours
- **Phase 4 (Polish & Edge Cases)**: 3-4 hours
- **Phase 5 (Testing & Validation)**: 2-3 hours

**Total Estimated**: 19-27 hours

## Next Steps

1. Review and approve this plan
2. Start with Phase 1: Foundation
3. Implement ViewCamera class
4. Test view switching
5. Proceed to Phase 2: Physics Integration
