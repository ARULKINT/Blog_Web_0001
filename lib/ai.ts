import OpenAI from "openai";

let _client: OpenAI | null = null;

export function getOpenAI() {
  if (!_client) {
    const key = process.env.OPENAI_API_KEY;
    if (!key) throw new Error("OPENAI_API_KEY not set");
    _client = new OpenAI({ apiKey: key });
  }
  return _client;
}

export function isAIConfigured() {
  return Boolean(process.env.OPENAI_API_KEY);
}

/** Cosine similarity between two vectors */
export function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Generate an embedding for a piece of text */
export async function embedText(text: string): Promise<number[]> {
  const ai = getOpenAI();
  const res = await ai.embeddings.create({
    model: "text-embedding-3-small",
    input: text.slice(0, 8000), // token limit safety
  });
  return res.data[0].embedding;
}
