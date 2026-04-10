import { convertToModelMessages, streamText, UIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { rickSystemPrompt } from "@/lib/rick-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    system: rickSystemPrompt,
    messages: await convertToModelMessages(messages),
    temperature: 0.7,
    maxOutputTokens: 500,
  });

  return result.toUIMessageStreamResponse();
}
