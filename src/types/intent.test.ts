import { describe, expect, it } from "vitest";
import type { EncodedIntent, Intent } from "./intent.js";

/**
 * These assert the interchain hedge (docs/GAPS.md §C1): an Intent must be
 * expressible for a non-Stellar chain without changing the type. If a future
 * edit makes Intent Stellar-specific, this stops compiling — which is the point.
 */
describe("Intent", () => {
  it("represents a Stellar invocation", () => {
    const intent: Intent = {
      chain: { kind: "stellar", network: "testnet" },
      target: "CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC",
      method: "transfer",
      args: [
        { name: "to", type: "address", value: "GABC" },
        { name: "amount", type: "i128", value: 1_000_000n },
      ],
    };
    expect(intent.chain.kind).toBe("stellar");
    expect(intent.args).toHaveLength(2);
  });

  it("represents a non-Stellar invocation without type changes", () => {
    const intent: Intent = {
      chain: { kind: "evm", chainId: 1 },
      target: "0x0000000000000000000000000000000000000000",
      method: "execTransaction",
      args: [],
      value: 0n,
    };
    expect(intent.chain).toEqual({ kind: "evm", chainId: 1 });
  });

  it("keeps the signature payload distinct from the encoded payload", () => {
    // A signer verifies signaturePayload against a hardware wallet screen; it is
    // deliberately not the same field the relayer submits. docs/GAPS.md B1.
    const encoded: EncodedIntent = {
      intent: {
        chain: { kind: "stellar", network: "public" },
        target: "CDLZ",
        method: "transfer",
        args: [],
      },
      payload: "AAAAA...",
      signaturePayload: "e3b0c44298fc1c14",
    };
    expect(encoded.signaturePayload).not.toBe(encoded.payload);
  });
});
