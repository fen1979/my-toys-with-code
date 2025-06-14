/* code version 1.27 */

// Cyclic trajectory for robot simulation (without gamepad)
// Each step: { axes: [Axis 0-7], buttons: [{pressed}, ...], duration: ms }
// Total duration: ~11 seconds per cycle

const cyclicTrajectory = [
    // Move forward half screen (Axis 0 = 1, Y forward)
    {axes: [1, 0, 0, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 2000},
    // Stop
    {axes: [0, 0, 0, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    // Extend manipulator 1 (Axis 2 = 1, Y down)
    {axes: [0, 0, 1, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 1000},
    // Grip twice (Axis 4: -1=open, 1=closed)
    {axes: [0, 0, 1, 0, 1, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    {axes: [0, 0, 1, 0, -1, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    {axes: [0, 0, 1, 0, 1, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    {axes: [0, 0, 1, 0, -1, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    // Drill twice (Axis 5: -1=retracted, 1=extended)
    {axes: [0, 0, 1, 0, 0, 1, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    {axes: [0, 0, 1, 0, 0, -1, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    {axes: [0, 0, 1, 0, 0, 1, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    {axes: [0, 0, 1, 0, 0, -1, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500},
    // Retract manipulator 1 (Axis 2 = -1, Y up)
    {axes: [0, 0, -1, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 1000},
    // Move camera arm (Axis 6 = 1, Y down; Axis 7 = 1, X right)
    {axes: [0, 0, 0, 0, 0, 0, 1, 1], buttons: [{pressed: true}, {pressed: true}], duration: 1000},
    // Rotate camera back
    {axes: [0, 0, 0, 0, 0, 0, -1, -1], buttons: [{pressed: false}, {pressed: false}], duration: 1000},
    // Turn 180° smoothly (Axis 1 = -0.5 for left turn)
    {axes: [0, -0.5, 0, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 1000},
    {axes: [0, -1, 0, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 1000},
    // Move forward slightly
    {axes: [0.5, 0, 0, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 1000},
    // Stop and repeat
    {axes: [0, 0, 0, 0, 0, 0, 0, 0], buttons: [{pressed: false}, {pressed: false}], duration: 500}
];