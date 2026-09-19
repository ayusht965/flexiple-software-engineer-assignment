
interface OpenRouterResponse {
    choices?: Array<{
        message?: {
            content?: string;
        };
    }>;
}

const API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = process.env.OPENROUTER_MODEL || "openrouter/free";

if (!API_KEY) {
    console.warn("OPENROUTER_API_KEY is not configured.");
}

export async function generateJson<T>(
    prompt: string,
    schema: { parse: (value: unknown) => T }
): Promise<T> {
    if (!API_KEY) {
        throw new Error("OPENROUTER_API_KEY is not configured.");
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 60_000);

    try {
        const response = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                    "HTTP-Referer": "http://localhost:5173",
                    "X-Title": "Flexiple Sourcing Refinement Loop",
                },
                signal: controller.signal,
                body: JSON.stringify({
                    model: MODEL,
                    messages: [
                        {
                            role: "user",
                            content: prompt,
                        },
                    ],
                    temperature: 0.1,
                    response_format: {
                        type: "json_object",
                    },
                }),
            }
        );

        if (!response.ok) {
            const body = await response.text();

            if (response.status === 429) {
                throw new Error(
                    "The AI provider is temporarily rate-limited. Please try again shortly."
                );
            }

            if (response.status >= 500) {
                throw new Error(
                    "The AI provider is temporarily unavailable. Please retry in a moment."
                );
            }

            throw new Error(
                `AI provider request failed (${response.status}): ${body.slice(
                    0,
                    300
                )}`
            );
        }

        const data =
            (await response.json()) as OpenRouterResponse;

        const text = data.choices?.[0]?.message?.content;

        if (!text) {
            throw new Error(
                "The AI provider returned an empty response."
            );
        }

        let parsed: unknown;

        try {
            parsed = JSON.parse(text);
        } catch {
            // Some models wrap otherwise-valid JSON in markdown fences.
            const cleaned = text
                .trim()
                .replace(/^```json\s*/i, "")
                .replace(/^```\s*/i, "")
                .replace(/\s*```$/i, "")
                .trim();

            try {
                parsed = JSON.parse(cleaned);
            } catch {
                console.error("Raw AI response:", text);

                throw new Error(
                    "The AI provider returned malformed JSON. Please retry."
                );
            }
        }

        return schema.parse(parsed);
    } catch (error) {
        console.error("AI request error:", error);
        if (
            error instanceof Error &&
            error.name === "AbortError"
        ) {
            throw new Error(
                "The AI request timed out after 60 seconds. Please try again."
            );
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}