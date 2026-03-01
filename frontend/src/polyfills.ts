// This module adds browser-compatible polyfills for globals commonly expected by
// Node.js libraries (especially web3/SDK packages).

// `buffer` and `process` are provided by npm packages which themselves include
// browser shims. Importing them here and attaching to `globalThis` ensures that
// both runtime code and Vite's optimizer see the globals available.

import { Buffer } from "buffer";
import process from "process";

// assign only if not already defined to avoid overwriting any existing polyfill
if (!(globalThis as any).Buffer) {
  (globalThis as any).Buffer = Buffer;
}

if (!(globalThis as any).process) {
  (globalThis as any).process = process;
}

// no exports; this file is imported solely for side effects
