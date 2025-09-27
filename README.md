# Computational Physics Project: Basic Physics with UI Controls

## 🚀 Overview

This project implements a basic 3D physics simulation using **React Three Fiber (R3F)** and the **@react-three/cannon** physics engine. The core functionality is the implementation of a User Interface (UI) that gives the user granular control over the simulation.

The user can **selectively enable or disable rigid body dynamics (gravity)** on individual meshes in the scene, and then control the entire simulation lifecycle with **START** and **RESTART** buttons. This setup allows for quick testing and analysis of different physics configurations.

---

## 🛠️ Technology Stack

| Category | Tool / Library | Purpose |
| :--- | :--- | :--- |
| **3D Rendering** | `react`, `@react-three/fiber` (R3F) | Core application and rendering engine. |
| **Physics Engine** | `@react-three/cannon` | Rigid body dynamics and collision detection. |
| **Testing** | `jest`, `@testing-library/react` | Unit and integration testing for UI and logic. |
| **Development** | `react-scripts`, TypeScript | Local environment and type safety. |

---

## ⚙️ Local Setup and Deployment

Follow these steps to get a local copy of the project running on your machine.

### Prerequisites

You will need **Node.js** and **npm** (which comes with Node.js) installed.

```bash


### 1. Download/Clone
git clone https://github.com/TheStormBreaks/fabrik-assignment-computational-physics.git
cd fabrik-assignment-computational-physics


### 2. Install Dependencies
npm install

3. Run the Application
npm start

4. Run Tests
npm test
# or
npx jest

