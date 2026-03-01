import { Web3Wallet } from '@utxos/sdk';

type WalletAddresses = {
  cardanoAddress: string | null;
  bitcoinAddress: string | null;
  sparkAddress: string | null;
};

type EnableOptions = {
  projectId: string;
  networkId: number;
};

/**
 * Attempt to enable the Web3Wallet and return addresses for supported chains.
 */
export async function connectWallet(): Promise<WalletAddresses> {
  try {
    const projectId = import.meta.env.VITE_UTXOS_PROJECT_ID as string | undefined;
    if (!projectId) {
      throw new Error('VITE_UTXOS_PROJECT_ID is not defined in environment');
    }

    const networkId = 0; // TESTNET
    const options: EnableOptions = { projectId, networkId };

    // Call enable on the SDK. The exact shape of the returned object varies by SDK version
    // so we defensively check for a few common patterns below.
    const enabled: any = await Web3Wallet.enable(options as any);

    let cardanoAddress: string | null = null;
    let bitcoinAddress: string | null = null;
    let sparkAddress: string | null = null;

    // Common pattern: enabled.cardano/bitcoin/spark with getAddress() method
    if (enabled?.cardano?.getAddress) {
      try {
        cardanoAddress = await enabled.cardano.getAddress();
      } catch (e) {
        console.error('Failed to read cardano address via cardano.getAddress()', e);
      }
    }

    if (enabled?.bitcoin?.getAddress) {
      try {
        bitcoinAddress = await enabled.bitcoin.getAddress();
      } catch (e) {
        console.error('Failed to read bitcoin address via bitcoin.getAddress()', e);
      }
    }

    if (enabled?.spark?.getAddress) {
      try {
        sparkAddress = await enabled.spark.getAddress();
      } catch (e) {
        console.error('Failed to read spark address via spark.getAddress()', e);
      }
    }

    // Alternate pattern: direct address fields
    if (!cardanoAddress) {
      if (typeof enabled?.cardanoAddress === 'string') cardanoAddress = enabled.cardanoAddress;
      else if (typeof enabled?.getCardanoAddress === 'function') {
        try {
          cardanoAddress = await enabled.getCardanoAddress();
        } catch (e) {
          console.error('Failed to read cardano address via getCardanoAddress()', e);
        }
      }
    }

    if (!bitcoinAddress) {
      if (typeof enabled?.bitcoinAddress === 'string') bitcoinAddress = enabled.bitcoinAddress;
      else if (typeof enabled?.getBitcoinAddress === 'function') {
        try {
          bitcoinAddress = await enabled.getBitcoinAddress();
        } catch (e) {
          console.error('Failed to read bitcoin address via getBitcoinAddress()', e);
        }
      }
    }

    if (!sparkAddress) {
      if (typeof enabled?.sparkAddress === 'string') sparkAddress = enabled.sparkAddress;
      else if (typeof enabled?.getSparkAddress === 'function') {
        try {
          sparkAddress = await enabled.getSparkAddress();
        } catch (e) {
          console.error('Failed to read spark address via getSparkAddress()', e);
        }
      }
    }

    return { cardanoAddress, bitcoinAddress, sparkAddress };
  } catch (err: any) {
    console.error('connectWallet error:', err);
    const message = err?.message ? `Failed to connect wallet: ${err.message}` : 'Failed to connect wallet';
    throw new Error(message);
  }
}

export default connectWallet;
