/*
  Centralized server error capture. Next.js calls onRequestError for every
  uncaught server-side error (RSC, route handlers, server actions). Today it
  logs structured context; this is the single wire-point to forward to Sentry /
  another tracker once a DSN exists — add the SDK call here and nothing else in
  the app needs to change (docs/DEEP-AUDIT M-7).
*/
export async function onRequestError(
  error: unknown,
  request: { path: string; method: string },
  context: { routerKind: string; routePath: string; renderSource?: string }
) {
  console.error("[onRequestError]", {
    message: error instanceof Error ? error.message : String(error),
    stack: error instanceof Error ? error.stack : undefined,
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    renderSource: context.renderSource,
  });

  // e.g. Sentry.captureException(error, { extra: { request, context } });
}
