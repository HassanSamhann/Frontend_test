# Wyze Security System - Bundle Builder

A responsive web-based interactive Bundle Builder application built using **React**, **TypeScript**, and **Vite** with styling powered by **Tailwind CSS**. It allows users to build and customize their security system by selecting different product variants, adjusting quantities, and seeing real-time updates of the summary and total pricing.

---

## Getting Started

Follow these steps to run the project locally on your machine.

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (recommended version: 18.x or 20.x).

### Installation

1. Clone or download this repository to your local machine.
2. Open your terminal/command prompt and navigate to the project directory:
   ```bash
   cd Frontend_test
   ```
3. Install the project dependencies:
   ```bash
   npm install
   ```

### Running the Application

To start the development server, run:
```bash
npm start
```
*Note: You can also use `npm run dev` to start the server.*

Once started, open your browser and navigate to:
 **[http://localhost:5173](http://localhost:5173)**

---

##  Additional NPM Scripts

- **`npm run build`**: Compiles and bundles the application for production inside the `dist` directory.
- **`npm run preview`**: Starts a local web server to preview the built production files from the `dist` folder.
- **`npm run lint`**: Runs ESLint to check for code quality and syntax issues.
- **`npm run type-check`**: Runs the TypeScript compiler to verify type safety.

---

##  Coding Decisions, Trade-offs & Challenges

Here is a summary of the technical decisions and design challenges encountered during development:

- **Wyze Cam Pan v3 Total Price Mismatch**:
  We observed a discrepancy in the Figma design regarding the total price calculation for the *Wyze Cam Pan v3* bundle. This mismatch was initially confusing, requiring us to perform manual calculations and trace the codebase logic to ensure correct math was implemented programmatically.
  
- **Frame 1735 & Frame 1736 Toggle Switch**:
  An extra toggle switch was added to the project interface to show both *Frame 1735* and *Frame 1736*. Since both frames occupy the exact same physical space in the layout designs, adding this toggle allowed the user to easily switch and visualize either frame without layout overlap or rendering conflicts.

- **Layout and Responsive Design**:
  - The default layout is configured to be **Side-by-Side** (the desktop-optimized layout).
  - Designed with responsive styling in mind. The product card structures adjust dynamic width constraints (from fixed sizing down to relative sizing like `flex-1 min-w-0`) to prevent text and variant selector chips from overflowing on narrow viewport resolutions like mobile screens down to 320px.
  - Correct alignment is ensured with flexible layouts using flexbox/grid alignments like `justify-center` to center elements smoothly on standard resolutions.

---
