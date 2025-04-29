import { Request } from "express";
import { AgentCard } from "../../../schema";

const getBaseURL = (req: Request): string => {
  const protocol = req.get("x-forwarded-proto") || req.protocol;
  const host = req.get("x-forwarded-host") || req.get("host");
  return `${protocol}://${host}`;
};

export const getAgentCard = (req: Request): AgentCard => {
  const base_url = getBaseURL(req);

  return {
    name: "InfoBank Agent",
    description:
      "An agent for storing and retrieving information using natural language and slash commands.",
    url: base_url,
    provider: {
      organization: "Telex",
      url: `${base_url}/provider-info`,
    },
    version: "1.0.0",
    documentationUrl: `${base_url}/docs`,
    capabilities: {
      streaming: false,
      pushNotifications: false,
      stateTransitionHistory: true,
    },
    authentication: {
      schemes: ["Bearer"],
    },
    defaultInputModes: ["text/plain"],
    defaultOutputModes: ["text/plain", "application/json"],
    skills: [
      {
        id: "store_text_data",
        name: "store",
        description:
          "Store textual data in the database. The input should be the text you want to store.",
        tags: ["storage", "memory", "data persistence", "text"],
        examples: [
          "Remember that the meeting is at 3 PM.",
          "Store the note: pick up groceries.",
        ],
        inputModes: ["text/plain"],
        outputModes: ["application/json"],
      },
      {
        id: "retrieve_stored_data",
        name: "retrieve",
        description:
          "Retrieve stored data using natural language query. The input should be your query.",
        tags: ["retrieval", "search", "memory", "information access"],
        examples: [
          "What time is the meeting?",
          "Find my note about groceries.",
        ],
        inputModes: ["text/plain"],
        outputModes: ["application/json", "text/plain"],
      },
    ],
  };
};
