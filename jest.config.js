module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  //setting up jest env
  //r3f using three j s??
  
  transformIgnorePatterns: [
    '/node_modules/(?!@react-three/(fiber|cannon)/)',
  ],
  //does NOT ingore the fiber or cannon files
  
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  //reads the modules from src folder

  moduleDirectories: [
    'node_modules',
    'src'
  ],
  //to make sure it finds cannon cause module not found despite npm install @react-three cannon
  
  moduleNameMapper: {
    // Maps '@react-three/cannon' to the 'dist/index.js' file inside the node_module folder cause it threw cant find module erors
    //try by downloading cannon from github directly and wrapping it later. 
    '^@react-three/cannon$': '<rootDir>/node_modules/@react-three/cannon/dist/index.js',
  },
};