import { NextResponse } from "next/server";

/*
  VESTIGIAL - THIS FILE SHOULD BE DELETED.

  It used to build a per-request nonce CSP. That policy has moved to
  next.config.ts as a static header (see the long note there for why: the nonce
  was forcing every route to server-render on demand, costing the whole site
  static prerendering).

  Nothing is left for middleware to do. It is kept only as an inert pass-through
  because the delete could not be performed automatically, and leaving the old
  nonce-emitting version in place would actively break the site - it would send
  a second, conflicting Content-Security-Policy whose script-src requires a
  nonce that the now-static pages no longer carry, blocking React hydration.

  Delete this file. `matcher` below is deliberately scoped to a path that does
  not exist so the middleware never actually runs in the meantime.
*/
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: ["/__vestigial_middleware_never_matches"],
};
