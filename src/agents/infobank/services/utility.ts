interface ParseResult {
  text: string;
  operation: "store" | "retrieve" | "none";
  error?: string;
}

type ParseResponse = ParseResult | { error: string };

export function parseText(text: string): ParseResponse {
  const hasStore = /\/infobank_store\b/.test(text);
  const hasRetrieve = /\/infobank_retrieve\b/.test(text);

  if (hasStore && hasRetrieve) {
    return { error: "2 slash commands are not allowed" };
  }

  if (hasStore) {
    const cleanText = text.replace(/\/infobank_store\s*/, "").trim();
    return {
      text: cleanText,
      operation: "store",
    };
  }

  if (hasRetrieve) {
    const cleanText = text.replace(/\/infobank_retrieve\s*/, "").trim();
    return {
      text: cleanText,
      operation: "retrieve",
    };
  }

  return {
    text: text,
    operation: "none",
  };
}

export const createMessage = (role: "user" | "agent", text: string): any => {
  return {
    role,
    parts: [{ type: "text", text }],
    metadata: null,
  };
};
