import { HandlerContext } from "https://raw.githubusercontent.com/lucacasonato/fresh/main/server.ts";

export function handler(_ctx: HandlerContext): Response {
  const stream = new ReadableStream({
    start: (controller) => {
      controller.enqueue("data: Start!\n\n");
      controller.enqueue("data: Welcome to Deno Deploy Chat!\n\n");
    },
    cancel() {
    },
  });

  return new Response(stream.pipeThrough(new TextEncoderStream()), {
    headers: { "content-type": "text/event-stream" },
  });
}