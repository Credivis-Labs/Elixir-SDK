/**
 * Client-side simulation and rendering.
 *
 * SECURITY-CRITICAL, not a UX nicety. If the frontend receives an invocation from
 * the Elixir API and renders it, a compromised API can display one thing while the
 * user signs another.
 *
 * Therefore: simulate locally against an RPC the USER chooses, render from the
 * simulation result, and expose a hash the user can verify on a hardware wallet.
 * The backend must never be trusted for WHAT is signed. docs/GAPS.md B1/B2.
 */

export {};
