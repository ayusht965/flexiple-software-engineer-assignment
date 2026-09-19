import { searchSpecSchema } from "../schemas";

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

if (!API_KEY) {
    console.warn("GEMINI_API_KEY is not configured.");
}

interface GeminiResponse {
    candidates?: Array<{
        content?: {
            parts?: Array<{
                text?: string;
            }>;
        };
    }>;
}

export async function generateJson<T>(
    prompt: string,
    schema: { parse: (value: unknown) => T }
): Promise<T> {
    if (!API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured.");
    }

    const controller = new AbortController();

    const timeout = setTimeout(() => {
        controller.abort();
    }, 30_000);

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                body: JSON.stringify({
                    contents: [
                        {
                            role: "user",
                            parts: [
                                {
                                    text: prompt,
                                },
                            ],
                        },
                    ],
                    generationConfig: {
                        temperature: 0.1,
                        responseMimeType: "application/json",
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

            if (response.status === 503) {
                throw new Error(
                    "The AI provider is temporarily unavailable. Please retry in a moment."
                );
            }

            if (response.status >= 500) {
                throw new Error(
                    "The AI provider is temporarily unavailable. Please retry in a moment."
                );
            }

            throw new Error(
                `AI provider request failed (${response.status}): ${body.slice(0, 300)}`
            );
        }

        const data = (await response.json()) as GeminiResponse;

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            throw new Error("The AI provider returned an empty response.");
        }

        let parsed: unknown;

        try {
            parsed = JSON.parse(text);
        } catch {
            throw new Error("The AI provider returned malformed JSON.");
        }

        return schema.parse(parsed);
    } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error("The AI request timed out after 30 seconds.");
        }

        throw error;
    } finally {
        clearTimeout(timeout);
    }
}