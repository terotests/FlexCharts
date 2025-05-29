import { build } from "esbuild";
import { readFileSync } from "fs";
import { join } from "path";

const pkg = JSON.parse(readFileSync("./package.json", "utf8"));

// Custom CSS plugin to handle CSS imports
const cssPlugin = {
  name: "css",
  setup(build) {
    build.onResolve({ filter: /\.css$/ }, (args) => {
      return { path: args.path, namespace: "css" };
    });

    build.onLoad({ filter: /.*/, namespace: "css" }, (args) => {
      return {
        contents: "",
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
};

// Build for ESM (import/export)
build({
  ...shared,
  format: "esm",
  outfile: pkg.module,
}).catch(() => process.exit(1));

// Build for CommonJS (require/exports)
build({
  ...shared,
  format: "cjs",
  outfile: pkg.main,
}).catch(() => process.exit(1));

console.log("✅ Build completed successfully!");
