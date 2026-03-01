// esbuild inject shim to provide `Buffer` identifier to optimized deps
import { Buffer as _Buffer } from 'buffer';
export { _Buffer as Buffer };
