// Global variables
/* code version 1.27 */

let gamepadIndex = null;
let gamepadId = '';
const updateInterval = 700; // 300ms for smoother updates
let lastUpdate = 0;
let trajectoryIndex = 0;
let trajectoryTime = 0;

// Cache DOM elements
const DOM = {
    connectButton: document.getElementById('connectButton'),
    status: document.getElementById('status'),
    robotBody: document.getElementById('robot-body'),
    manipulator1: document.getElementById('manipulator-1'),
    gripperTop: document.getElementById('gripper-top'),
    gripperBottom: document.getElementById('gripper-bottom'),
    drill: document.getElementById('drill'),
    manipulator2: document.getElementById('manipulator-2'),
    camera: document.getElementById('camera')
};

// Simulated gamepad data
const simulatedGamepad = {
    id: 'Simulated Gamepad (Not Connected)',
    buttons: Array(16).fill(0).map(() => ({pressed: false})),
    axes: Array(8).fill(0),
    timestamp: 0,
    connected: false
};

// Initialize UI
resetUI();

// Request gamepad connection
function requestGamepad() {
    if (gamepadIndex !== null) {
        gamepadIndex = null;
        gamepadId = '';
        resetUI();
        return;
    }
    window.addEventListener('gamepadconnected', handleGamepadConnected, {once: true});
    window.addEventListener('gamepaddisconnected', handleGamepadDisconnected);
}

// Reset UI to simulated state
function resetUI() {
    DOM.connectButton.textContent = 'Connect...';
    DOM.status.textContent = 'No gamepad connected (Simulated)';
    trajectoryIndex = 0;
    trajectoryTime = 0;
    // Reset initial positions
    DOM.robotBody.style.left = '50vw';
    DOM.robotBody.style.top = '50vh';
    DOM.robotBody.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    DOM.manipulator1.style.left = '6vw';
    DOM.manipulator1.style.top = '1vw';
    DOM.gripperTop.style.transform = 'rotate(0deg)';
    DOM.gripperBottom.style.transform = 'rotate(0deg)';
    DOM.drill.style.height = '2vw';
    DOM.manipulator2.style.left = '-2vw';
    DOM.manipulator2.style.top = '6vw';
    DOM.camera.style.transform = 'translateY(0vw) rotate(0deg)';
    updateUI(simulatedGamepad, false);
}

// Handle gamepad connection event
function handleGamepadConnected(e) {
    gamepadIndex = e.gamepad.index;
    gamepadId = e.gamepad.id;
    DOM.connectButton.textContent = 'Disconnect';
    DOM.status.textContent = 'Gamepad connected';
    // Reset robot to top-left corner
    DOM.robotBody.style.left = '0vw';
    DOM.robotBody.style.top = '0vh';
    DOM.robotBody.style.transform = 'translate(-50%, -50%) rotate(0deg)';
    DOM.manipulator1.style.left = '6vw';
    DOM.manipulator1.style.top = '1vw';
    DOM.gripperTop.style.transform = 'rotate(0deg)';
    DOM.gripperBottom.style.transform = 'rotate(0deg)';
    DOM.drill.style.height = '2vw';
    DOM.manipulator2.style.left = '-2vw';
    DOM.manipulator2.style.top = '6vw';
    DOM.camera.style.transform = 'translateY(0vw) rotate(0deg)';
    updateLoop();
}

// Handle gamepad disconnection event
function handleGamepadDisconnected() {
    gamepadIndex = null;
    gamepadId = '';
    resetUI();
}

// Update UI with gamepad data (real or simulated)
function updateUI(gamepad, isReal) {
    // Use cyclic trajectory if no gamepad
    if (!isReal) {
        const step = cyclicTrajectory[trajectoryIndex];
        gamepad.axes = step.axes;
        gamepad.buttons = step.buttons;
        trajectoryTime += updateInterval;
        if (trajectoryTime >= step.duration) {
            trajectoryTime = 0;
            trajectoryIndex = (trajectoryIndex + 1) % cyclicTrajectory.length;
        }
    }

    // Update robot body position and rotation (Axis 0: Y, Axis 1: X)
    const robotX = isReal ? (gamepad.axes[1] || 0) * 40 : 50 + (gamepad.axes[1] || 0) * 40; // 0–80vw if real, 50±40vw if simulated
    const robotY = isReal ? (gamepad.axes[0] || 0) * 30 : 50 + (gamepad.axes[0] || 0) * 30; // 0–60vh if real, 50±30vh if simulated
    const dx = gamepad.axes[1] || 0; // X movement (Axis 1)
    const dy = gamepad.axes[0] || 0; // Y movement (Axis 0)
    // Adjust angle so drill (top side) faces forward (0° = up, add 90° to align with forward)
    const angle = dx === 0 && dy === 0 ? 0 : Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    DOM.robotBody.style.left = `${robotX}vw`;
    DOM.robotBody.style.top = `${robotY}vh`;
    DOM.robotBody.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    // Update manipulator 1 position (Axis 2: Y, Axis 3: X)
    const armX = 6 + (gamepad.axes[3] || 0) * 2; // 6vw ± 2vw
    const armY = 1 + (gamepad.axes[2] || 0) * 2; // 1vw ± 2vw
    DOM.manipulator1.style.left = `${armX}vw`;
    DOM.manipulator1.style.top = `${armY}vw`;

    // Update gripper (Axis 4: -1=open, 1=closed)
    const gripperAngle = ((gamepad.axes[4] || 0) + 1) / 2 * 30; // 0–30 degrees
    DOM.gripperTop.style.transform = `rotate(-${gripperAngle}deg)`;
    DOM.gripperBottom.style.transform = `rotate(${gripperAngle}deg)`;

    // Update drill (Axis 5: -1=retracted, 1=extended)
    const drillLength = 2 + (gamepad.axes[5] || 0) * 2; // 2–4vw
    console.log(drillLength)
    DOM.drill.style.top = `-${drillLength}vw`;

    // Update manipulator 2 position (Axis 6: Y, Axis 7: X)
    const cameraArmX = -2 + (gamepad.axes[7] || 0) * 2; // -2vw ± 2vw
    const cameraArmY = 6 + (gamepad.axes[6] || 0) * 2; // 6vw ± 2vw
    DOM.manipulator2.style.left = `${cameraArmX}vw`;
    DOM.manipulator2.style.top = `${cameraArmY}vw`;

    // Update camera (Button 0: Z, Button 1: rotation)
    const cameraZ = gamepad.buttons[0]?.pressed ? 1 : 0; // Forward/back (1vw)
    const cameraRotate = gamepad.buttons[1]?.pressed ? 45 : 0; // Left/right
    DOM.camera.style.transform = `translateY(${cameraZ}vw) rotate(${cameraRotate}deg)`;
}

// Main update loop for real or simulated data
function updateLoop(timestamp) {
    // Throttle updates
    if (timestamp - lastUpdate < updateInterval) {
        requestAnimationFrame(updateLoop);
        return;
    }
    lastUpdate = timestamp;

    if (gamepadIndex !== null) {
        // Real gamepad data
        const gamepad = navigator.getGamepads()[gamepadIndex];
        if (gamepad) {
            updateUI(gamepad, true);
        }
    } else {
        // Simulated data
        updateUI(simulatedGamepad, false);
    }

    // Continue updating
    requestAnimationFrame(updateLoop);
}

// Start the loop
updateLoop(0);