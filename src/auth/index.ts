/**
 * Auth entry assembly — the hard part of the SDK.
 *
 * On Stellar, signatures are portable objects rather than transaction-envelope
 * bound. Signers sign a detached auth entry; a relayer submits once. This is what
 * removes the need for on-chain voting (docs/ARCHITECTURE.md §0).
 *
 * Correctness constraints, all of which have bitten other implementations:
 *
 *  - Auth entries commit to a nonce AND an expiration ledger. If collection takes
 *    too long, every signature goes stale and signers must re-sign. Surface the
 *    countdown in the UI. docs/GAPS.md A3.
 *  - Resubmitting at a higher fee must NOT silently change the signed payload.
 *  - Entries commit to a network passphrase. Verify explicitly that testnet
 *    signatures cannot replay on mainnet in this assembly path. docs/GAPS.md B1.
 *
 * BLOCKED on spike: can we simulate a 2-of-3 C-account invocation with CAP-71
 * delegation end-to-end on the current SDK? docs/GAPS.md §F3. Implementation
 * should not start before that answer is known.
 */

export interface PartialSignature {
  signer: string;
  signature: string;
  /** Ledger sequence after which this signature is worthless. */
  expiresAtLedger: number;
}

export {};
