

const originalConsoleError = console.error;

console.error = (msg, ...args) => {

  if (msg.includes('Cannot find dismountable object')) {
    return;
  }
  if (msg.includes('THREE.BufferGeometry:')) {
    return;
  }
  if (msg.includes('is using incorrect casing. Use PascalCase for React components')) {
    return;
  }
  


  if (msg.includes('is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.')) {
    return;
  }

  if (msg.includes('React does not recognize the `') && msg.includes(' prop on a DOM element.')) {
    return;
  }

  originalConsoleError(msg, ...args);
};

global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};
