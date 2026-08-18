/**
 * Chain-agnostic intent representation.
 *
 * Store THIS as the canonical form in the DB, not raw Soroban XDR. The encoding
 * is derived per-chain. This is the one cheap decision that keeps interchain
 * (docs/GAPS.md §C) from becoming a rewrite — everything else about interchain
 * is a v2 conversation.
 */

export type ChainId =
  | { kind: "stellar"; network: "public" | "testnet" }
  | { kind: "evm"; chainId: number };

/** What the user meant, independent of how any chain encodes it. */
export interface Intent {
  chain: ChainId;
  /** Contract or account being called. */
  target: string;
  /** Method name. On Stellar, the Soroban fn symbol. */
  method: string;
  /** Decoded, human-renderable arguments. */
  args: readonly IntentArg[];
  /** Native value transferred, in stroops (Stellar) or wei (EVM). */
  value?: bigint;
}

export interface IntentArg {
  name: string;
  type: string;
  /** Decoded value for display. Never render raw XDR to a signer. */
  value: unknown;
}

/** A chain-specific encoding of an Intent, plus the hash a signer commits to. */
export interface EncodedIntent {
  intent: Intent;
  /** Base64 XDR on Stellar. */
  payload: string;
  /**
   * Hash the signer actually signs. MUST be displayable so a user can compare it
   * against a hardware wallet screen — the backend is never trusted for WHAT is
   * signed. See docs/GAPS.md B1.
   */
  signaturePayload: string;
}
