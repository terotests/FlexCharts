import { build } from "esbuild";
import {
  readFileSync,
  writeFileSync,
  copyFileSync,
  mkdirSync,
  existsSync,
} from "fs";
import { join, dirname } from "path";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

// Ensure dist_lib directory exists
if (!existsSync("dist_lib")) {
  mkdirSync("dist_lib", { recursive: true });
}

// Ensure dist_lib/types directory exists
if (!existsSync("dist_lib/types")) {
  mkdirSync("dist_lib/types", { recursive: true });
}

// Copy CSS files to dist_lib folder
console.log("📋 Copying CSS files...");
try {
  copyFileSync(
    "src/lib/components/TimeLineChart.css",
    "dist_lib/TimeLineChart.css"
  );
  console.log("✅ Copied TimeLineChart.css to dist_lib/");
} catch (error) {
  console.error("❌ Failed to copy CSS files:", error);
  process.exit(1);
}

// Create clean package.json for distribution (without devDependencies)
console.log("📋 Creating distribution package.json...");
try {
  // Create a clean package.json for NPM publishing
  const distPackage = {
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,
    type: pkg.type,
    main: "index.cjs",
    module: "index.js",
    types: "types/index.d.ts",
    exports: {
      ".": {
        types: "./types/index.d.ts",
        import: "./index.js",
        require: "./index.cjs",
      },
      "./css": "./TimeLineChart.css",
      "./TimeLineChart.css": "./TimeLineChart.css",
    },
    files: [
      "index.js",
      "index.cjs",
      "index.js.map",
      "index.cjs.map",
      "types/",
      "TimeLineChart.css",
      "README.md",
    ],
    sideEffects: false,
    peerDependencies: pkg.peerDependencies,
    keywords: pkg.keywords,
    author: pkg.author,
    license: pkg.license,
    repository: pkg.repository,
    bugs: pkg.bugs,
    homepage: pkg.homepage,
    publishConfig: {
      access: "public",
    },
  };
  writeFileSync("dist_lib/package.json", JSON.stringify(distPackage, null, 2));
  console.log("✅ Created clean distribution package.json");
  // Create NPM-specific README
  const npmReadme = `# FlexCharts

A flexible chart library for React applications focused on time-based visualizations with advanced customization capabilities.

## Installation

\`\`\`bash
npm install @terotests/flex-charts
# or
yarn add @terotests/flex-charts
# or
pnpm add @terotests/flex-charts
\`\`\`

## Important: CSS Import

**FlexCharts requires CSS to be imported for proper styling.** You have two options:

### Option 1: Import CSS in your main app file (Recommended)

\`\`\`javascript
// In your main index.js, App.js, or entry point
import '@terotests/flex-charts/TimeLineChart.css';
\`\`\`

### Option 2: CSS is automatically imported when you import components

The CSS is automatically imported when you import any FlexCharts components, but you may need to configure your bundler to handle CSS imports from node_modules.

## Quick Start

\`\`\`tsx
import React from 'react';
import { TimeLineChart, type TimeLineBarData } from '@terotests/flex-charts';

const timelineBars: TimeLineBarData[] = [
  {
    id: 1,
    start: "01/2020",
    end: "12/2022",
    label: "Project Alpha",
    backgroundColor: "#3b82f6",
    textColor: "white",
  },
  {
    id: 2,
    start: "06/2021",
    end: "03/2024",
    label: "Project Beta",
    backgroundColor: "#ef4444",
    textColor: "white",
  },
];

function App() {
  return (
    <TimeLineChart
      startDate="2020"
      endDate="2025"
      interval="Y"
      width="800px"
      labelFontSize="12px"
      bars={timelineBars}
      renderTitle={(time) => \`'\${time.value.toString().slice(2, 4)}\`}
    />
  );
}

export default App;
\`\`\`

## Features

- 📊 **Timeline Charts** - Interactive timeline visualizations for project management and data analysis
- 📐 **Flexible Layout System** - Adaptive wireframe structure with proper data positioning
- 🔄 **Smooth Scrolling** - Horizontal and vertical scrolling with touch support
- 📏 **Configurable Axes** - Customizable x and y axis with support for various data types
- 🎨 **Theming & Customization** - Light/dark mode and custom rendering overrides
- 🚀 **Performance Optimization** - Virtualization for large datasets and view optimization
- 📱 **Responsive Design** - Adapt to different screen sizes and orientations
- 🎯 **Full TypeScript Support** - Complete type definitions for enhanced developer experience

## Documentation

For complete documentation, examples, and API reference, visit:
[https://github.com/terotests/FlexCharts](https://github.com/terotests/FlexCharts)

## Demo

[View the live demo](https://terotests.github.io/FlexCharts/)

## License

MIT License. See [LICENSE](https://github.com/terotests/FlexCharts/blob/main/LICENSE) for details.
`;

  writeFileSync("dist_lib/README.md", npmReadme);
  console.log("✅ Created NPM-specific README");
} catch (error) {
  console.warn("⚠️  Failed to copy metadata files:", error);
}

// Enhanced CSS plugin that properly handles CSS imports
const cssPlugin = {
  name: "css-handler",
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      // Return the path but mark it as external or handle it differently
      return { path: args.path, namespace: "css-file" };
    });

    build.onLoad({ filter: /.*/, namespace: "css-file" }, (args) => {
      // For CSS files, return empty JS content since we copy CSS separately
      // This prevents esbuild from trying to bundle CSS as JS
      return {
        contents: `// CSS file: ${args.path} - handled separately`,
        loader: "js",
      };
    });
  },
};

// Shared build configuration
const shared = {
  entryPoints: ["src/lib/index.ts"],
  bundle: true,
  external: Object.keys(pkg.peerDependencies || {}),
  minify: true,
  sourcemap: true,
  target: ["es2019", "node16"],
  plugins: [cssPlugin],
  logLevel: "info",
};

console.log("🚀 Starting esbuild...");

// Build for ESM (import/export)
console.log("📦 Building ESM bundle...");
await build({
  ...shared,
  format: "esm",
  outfile: "dist_lib/index.js",
}).catch((error) => {
  console.error("❌ ESM build failed:", error);
  process.exit(1);
});

// Build for CommonJS (require/exports)
console.log("📦 Building CommonJS bundle...");
await build({
  ...shared,
  format: "cjs",
  outfile: "dist_lib/index.cjs",
}).catch((error) => {
  console.error("❌ CommonJS build failed:", error);
  process.exit(1);
});

console.log("✅ Build completed successfully!");
console.log("📁 Build output:");
console.log("  - dist_lib/index.js (ESM)");
console.log("  - dist_lib/index.cjs (CommonJS)");
console.log("  - dist_lib/types/ (TypeScript definitions)");
console.log("  - dist_lib/TimeLineChart.css (Component styles)");
console.log("  - dist_lib/package.json (Clean package.json for NPM)");
console.log("  - dist_lib/README.md (NPM-specific README)");
