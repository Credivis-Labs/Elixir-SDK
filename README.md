# Elixir-SDK

TypeScript SDK for **Elixir** — auth entry assembly, client-side simulation, and contract
bindings. Shared by `Elixir-Frontend` and `Elixir-Backend`.

> **Status: scaffold.** Interfaces and constraints are documented; implementation is
> blocked on a spike (below).

## Why this repo exists

Auth entry assembly is consumed by both the frontend and the backend. Without a shared,
versioned package, that logic gets hand-maintained in two places and drifts immediately.

## Layout

```
src/
  types/intent.ts   chain-agnostic intent representation
  auth/             auth entry assembly, partial signature merge  ← the hard part
  simulate/         client-side simulation + rendering            ← security-critical
  classic/          G-account multisig path (Elixir Classic)
```

## Two things here are load-bearing

**1. Simulation is a security boundary, not a UX nicety.** If the frontend receives an
invocation from the Elixir API and renders it, a compromised API can display one thing while
the user signs another. So: simulate locally against an RPC *the user chooses*, render from
the simulation result, and expose a hash the user can verify on a hardware wallet screen.
**The backend is never trusted for what is signed.** For comparable products, the most
damaging real-world incidents have been signing-UI attacks, not contract bugs.

**2. The intent type is the interchain hedge.** Store `Intent` as the canonical form in the
DB — not raw Soroban XDR. Encoding is derived per-chain. This is cheap now and avoids a
rewrite later; everything else about interchain is a v2 conversation.

## Auth entry constraints

These have bitten other implementations:

- Auth entries commit to a nonce **and** an expiration ledger. Slow signature collection means
  every signature goes stale and signers must re-sign. Surface the countdown in the UI.
- Resubmitting at a higher fee must **not** silently change the signed payload.
- Entries commit to a network passphrase. Verify explicitly that testnet signatures cannot
  replay on mainnet in this assembly path.

## Blocked on

*Can we simulate a 2-of-3 C-account invocation with CAP-71 delegation end-to-end on the
current SDK?* Stellar's docs still list full client support for contract accounts — notably
simulation — as under development. Implementation should not start before that answer exists.

## Develop

```bash
pnpm install
pnpm typecheck
pnpm test
```

Pinned to `@stellar/stellar-sdk` ^16.2.0.

## License

AGPL-3.0-or-later.
