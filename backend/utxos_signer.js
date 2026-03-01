#!/usr/bin/env node
// Minimal signer script scaffold. Reads JSON from stdin and writes JSON to stdout.
// For hackathon speed this returns a mock "signature". Replace the mock
// implementation with real calls to @utxos/sdk on the backend when ready.

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

(async () => {
  try {
    const raw = await readStdin();
    const payload = raw ? JSON.parse(raw) : {};

    // TODO: Replace the mock signing below with real SDK calls. Example (pseudocode):
    // import { Web3Wallet } from '@utxos/sdk'
    // const signer = await Web3Wallet.createServerSigner({ apiKey: process.env.UTXOS_API_KEY });
    // const signed = await signer.signTransaction(payload.txHex);

    // Mock signature: base64 of payload for demonstration
    const signature = Buffer.from(JSON.stringify(payload)).toString("base64");

    const out = { signature };
    process.stdout.write(JSON.stringify(out));
    process.exit(0);
  } catch (err) {
    console.error("Signer error:", err?.message || err);
    process.exit(2);
  }
})();
