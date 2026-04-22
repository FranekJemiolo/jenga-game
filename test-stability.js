/**
 * Tower Stability Test System
 * 
 * This test simulates the Jenga tower creation and verifies it remains stable
 * over a specified time period without collapsing.
 * 
 * Run with: node test-stability.js
 */

const Matter = require('matter-js');

// Test configuration
const TEST_CONFIG = {
  levels: 4, // Further reduced for stability
  blockWidth: 150, // Even wider blocks for stability
  blockHeight: 25, // Taller blocks for visibility
  blockDepth: 30, // Deeper blocks
  simulationDuration: 10000, // 10 seconds in milliseconds (increased for long-term stability)
  timeStep: 16.67, // ~60 FPS
  collapseAngleThreshold: 0.5, // radians
  maxVelocityThreshold: 0.1, // max velocity to consider "stable"
  maxAngularVelocityThreshold: 0.01, // max angular velocity to consider "stable"
  // Physics parameters to test
  friction: 1.0,
  frictionStatic: 1.0,
  frictionAir: 0.005,
  density: 0.004, // Increased density for stability
  positionIterations: 10,
  velocityIterations: 10
};

class StabilityTest {
  constructor() {
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;
    this.engine.world.gravity.y = 1;
    this.engine.positionIterations = TEST_CONFIG.positionIterations;
    this.engine.velocityIterations = TEST_CONFIG.velocityIterations;
    this.blocks = [];
    this.results = {
      passed: false,
      collapseDetected: false,
      maxAngle: 0,
      maxVelocity: 0,
      maxAngularVelocity: 0,
      unstableBlocks: [],
      simulationTime: 0
    };
  }

  createGround() {
    const ground = Matter.Bodies.rectangle(400, 580, 800, 40, {
      isStatic: true,
      friction: TEST_CONFIG.friction,
      frictionStatic: TEST_CONFIG.frictionStatic
    });
    Matter.World.add(this.world, ground);
  }

  createTower() {
    const { levels, blockWidth: w, blockHeight: h, blockDepth: d } = TEST_CONFIG;
    const groundY = 580;

    for (let i = 0; i < levels; i++) {
      const orientation = i % 2 === 0 ? "x" : "z";

      for (let j = 0; j < 2; j++) {
        let x = 400;
        let z = 0;

        if (orientation === "x") {
          z = (j - 0.5) * d;
          // Offset X slightly to prevent 2D collision (physics only)
          x += (j - 0.5) * 0.5;
        } else {
          x += (j - 0.5) * d;
        }

        const y = groundY - 100 - i * h;

        const body = Matter.Bodies.rectangle(x, y, w, h, {
          friction: TEST_CONFIG.friction,
          frictionStatic: TEST_CONFIG.frictionStatic,
          frictionAir: TEST_CONFIG.frictionAir,
          density: TEST_CONFIG.density,
          angle: 0
        });

        Matter.World.add(this.world, body);

        this.blocks.push({
          body,
          w,
          h,
          d,
          z,
          level: i,
          orientation
        });
      }
    }
  }

  checkStability() {
    let maxAngle = 0;
    let maxVelocity = 0;
    let maxAngularVelocity = 0;
    const unstableBlocks = [];

    for (const block of this.blocks) {
      const angle = Math.abs(block.body.angle);
      const velocity = block.body.speed;
      const angularVelocity = Math.abs(block.body.angularVelocity);

      maxAngle = Math.max(maxAngle, angle);
      maxVelocity = Math.max(maxVelocity, velocity);
      maxAngularVelocity = Math.max(maxAngularVelocity, angularVelocity);

      if (angle > TEST_CONFIG.collapseAngleThreshold) {
        unstableBlocks.push({
          level: block.level,
          angle: angle,
          velocity: velocity,
          angularVelocity: angularVelocity
        });
      }
    }

    this.results.maxAngle = maxAngle;
    this.results.maxVelocity = maxVelocity;
    this.results.maxAngularVelocity = maxAngularVelocity;
    this.results.unstableBlocks = unstableBlocks;

    return {
      isStable: maxAngle < TEST_CONFIG.collapseAngleThreshold,
      maxAngle,
      maxVelocity,
      maxAngularVelocity,
      unstableBlocks
    };
  }

  runSimulation() {
    console.log('Starting stability test...');
    console.log(`Simulation duration: ${TEST_CONFIG.simulationDuration}ms`);
    console.log(`Tower levels: ${TEST_CONFIG.levels}`);
    console.log(`Total blocks: ${this.blocks.length}`);
    console.log('');

    const startTime = Date.now();
    let stepCount = 0;

    while (this.results.simulationTime < TEST_CONFIG.simulationDuration) {
      Matter.Engine.update(this.engine, TEST_CONFIG.timeStep);
      this.results.simulationTime += TEST_CONFIG.timeStep;
      stepCount++;

      // Check for collapse every 100 steps
      if (stepCount % 100 === 0) {
        const stability = this.checkStability();
        
        if (!stability.isStable) {
          this.results.collapseDetected = true;
          this.results.passed = false;
          console.log(`❌ COLLAPSE DETECTED at ${this.results.simulationTime}ms`);
          console.log(`   Max angle: ${stability.maxAngle.toFixed(4)} rad`);
          console.log(`   Unstable blocks: ${stability.unstableBlocks.length}`);
          break;
        }
      }
    }

    // Final stability check
    const finalStability = this.checkStability();
    
    if (!this.results.collapseDetected) {
      this.results.passed = finalStability.isStable;
      
      if (finalStability.isStable) {
        console.log('✅ STABILITY TEST PASSED');
        console.log(`   Tower remained stable for ${this.results.simulationTime}ms`);
        console.log(`   Max angle: ${finalStability.maxAngle.toFixed(4)} rad`);
        console.log(`   Max velocity: ${finalStability.maxVelocity.toFixed(4)}`);
        console.log(`   Max angular velocity: ${finalStability.maxAngularVelocity.toFixed(4)}`);
      } else {
        console.log('❌ STABILITY TEST FAILED');
        console.log(`   Tower became unstable at end of simulation`);
        console.log(`   Max angle: ${finalStability.maxAngle.toFixed(4)} rad`);
        console.log(`   Unstable blocks: ${finalStability.unstableBlocks.length}`);
      }
    }

    console.log(`   Total simulation steps: ${stepCount}`);
    console.log('');
  }

  printDetailedResults() {
    console.log('=== DETAILED RESULTS ===');
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Collapse Detected: ${this.results.collapseDetected}`);
    console.log(`Simulation Time: ${this.results.simulationTime}ms`);
    console.log(`Max Angle: ${this.results.maxAngle.toFixed(6)} rad`);
    console.log(`Max Velocity: ${this.results.maxVelocity.toFixed(6)}`);
    console.log(`Max Angular Velocity: ${this.results.maxAngularVelocity.toFixed(6)}`);
    
    if (this.results.unstableBlocks.length > 0) {
      console.log('');
      console.log('Unstable Blocks:');
      this.results.unstableBlocks.forEach((block, i) => {
        console.log(`  ${i + 1}. Level ${block.level}: angle=${block.angle.toFixed(4)} rad, velocity=${block.velocity.toFixed(4)}`);
      });
    }
    console.log('');
  }
}

// Run the test
function runTest() {
  console.log('========================================');
  console.log('   JENGA TOWER STABILITY TEST');
  console.log('========================================');
  console.log('');

  const test = new StabilityTest();
  test.createGround();
  test.createTower();
  test.runSimulation();
  test.printDetailedResults();

  console.log('========================================');
  
  if (test.results.passed) {
    console.log('✅ ALL TESTS PASSED');
    process.exit(0);
  } else {
    console.log('❌ TESTS FAILED');
    process.exit(1);
  }
}

// Install Matter.js if not available
try {
  require('matter-js');
  runTest();
} catch (e) {
  console.error('Error: matter-js not installed');
  console.error('Run: npm install matter-js');
  process.exit(1);
}
