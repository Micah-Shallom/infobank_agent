import {
  ErrorCodeInternalError,
  ErrorCodeInvalidParams,
  JSONRPCResponse,
  SendTaskRequest,
  TextPart,
} from "../../../schema";
import { ParseOperation } from "../models";
import { handleRetrieveOperation } from "../retrieve";
import { handleStoreOperation } from "../store";
import { createMessage, parseText } from "./utility";

export async function handleTaskSend(
  rpcRequest: SendTaskRequest,
): Promise<JSONRPCResponse> {
  const message = rpcRequest.params.message;
  const sessionId = rpcRequest.params.sessionId;
  const id = rpcRequest.params.id;
  const param = rpcRequest.params;

  if (!param || !id || !message) {
    return {
      jsonrpc: "2.0",
      id: rpcRequest.id,
      error: {
        code: ErrorCodeInvalidParams,
        message: "Missing required parameters: id or message",
      },
    };
  }

  if (!message.parts || !Array.isArray(message.parts)) {
    return {
      jsonrpc: "2.0",
      id: rpcRequest.id,
      error: {
        code: ErrorCodeInvalidParams,
        message: "Message must contain parts array",
      },
    };
  }

  const textPart = message.parts.find(
    (part): part is TextPart => part.type === "text",
  );

  try {
    let parseResponse = textPart ? parseText(textPart.text) : null;
    if (parseResponse && parseResponse.error) {
      const resp = {
        id,
        sessionId,
        status: {
          state: "failed",
          message: {
            role: "agent",
            parts: [{ text: parseResponse.error }],
          },
        },
      };
      return {
        jsonrpc: "2.0",
        id: rpcRequest.id,
        result: resp,
      };
    }

    const text = (parseResponse as any).text;
    const operation = (parseResponse as any).operation;
    let resultMessage: any;

    if (operation === ParseOperation.STORE) {
      handleStoreOperation(text);
      console.log("Store operation with text:", text);
    } else if (operation === ParseOperation.RETRIEVE) {
      handleRetrieveOperation(text);
      console.log("Retrieve operation with text:", text);
    } else {
      console.log("Default operation with text:", text);
      resultMessage = createMessage("agent", text);
    }

    const resultData = {
      id,
      sessionId,
      status: {
        state: "completed",
        message: resultMessage,
      },
    };

    return {
      jsonrpc: "2.0",
      id: rpcRequest.id,
      result: resultData,
    };
  } catch (error) {
    return {
      jsonrpc: "2.0",
      id: rpcRequest.id,
      error: {
        code: ErrorCodeInternalError,
        message: "Internal error",
        data: error,
      },
    };
  }
}

export async function handleGetTask(rpcRequest: any): Promise<JSONRPCResponse> {
  const taskDetails = {
    /* ... task details ... */
  };

  return {
    jsonrpc: "2.0",
    id: rpcRequest.id,
    result: taskDetails,
  };
}
