import { createRequestHandler } from "react-router";

declare module "react-router" {
  export interface AppLoadContext {
    cloudflare: {
      env: Env;
      ctx: ExecutionContext;
    };
  }
}

const requestHandler = createRequestHandler(
  () => import("virtual:react-router/server-build"),
  import.meta.env.MODE
);

export default {
  async fetch(request, env, ctx) {
    try {
      return await requestHandler(request, {
        cloudflare: { env, ctx },
      });
    } catch (err: any) {
      const message = err?.stack || err?.message || String(err)
      console.error('SSR error:', message)
      return new Response(message, { status: 500, headers: { 'content-type': 'text/plain; charset=utf-8' } })
    }
  },
} satisfies ExportedHandler<Env>;
