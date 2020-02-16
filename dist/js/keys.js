// Control keys: (wasd), (hjkl), arrow, spacebar and enter keys.
const keys = {
  up: [38, 75, 87],
  down: [40, 74, 83],
  left: [37, 65, 72],
  right: [39, 68, 76],
  start_stop: [32]
};

export const inverseDirection = {
  'up': 'down',
  'left': 'right',
  'right': 'left',
  'down': 'up'
};

export function getControlKey(value) {
  for (let key in keys) {
    if (keys[key] instanceof Array && keys[key].indexOf(value) >= 0) {
      return key;
    }
  }
  return null;
}
