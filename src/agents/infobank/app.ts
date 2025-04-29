import express, { Request, Response, Router, RequestHandler } from "express";
import { connectDB } from "./db";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import { getAgentCard } from "./services/agentCard";
import { handleTaskSend, handleGetTask } from "./services/task";
import {
  JSONRPCRequest,
  JSONRPCResponse,
  ErrorCodeMethodNotFound,
  ErrorCodeInternalError,
  SendTaskRequest,
  GetTaskRequest,
} from "../../schema";
import { RPCMethod } from "./models";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Hello, Express with TypeScript!");
});

app.post("/", async (req: Request, res: Response) => {
  const rpcRequest = req.body as JSONRPCRequest;
  console.log(JSON.stringify(rpcRequest));

  try {
    switch (rpcRequest.method) {
      case RPCMethod.TASK_SEND:
        const sendTaskRequest = {
          id: rpcRequest.id,
          method: rpcRequest.method,
          params: rpcRequest.params,
        } as SendTaskRequest;

        const sendResponse = await handleTaskSend(sendTaskRequest);
        res.send(sendResponse);
        return

      case RPCMethod.TASK_GET:
        const getTaskRequest = {
          id: rpcRequest.id,
          method: rpcRequest.method,
          params: rpcRequest.params,
        } as GetTaskRequest;
        const getResponse = await handleGetTask(getTaskRequest);
        res.send(getResponse);
        return
      default:
        res.status(400).send({
          jsonrpc: "2.0",
          id: rpcRequest.id,
          error: {
            code: ErrorCodeMethodNotFound,
            message: "Method not found",
          },
        }) as JSONRPCResponse;
        return
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({
      jsonrpc: "2.0",
      id: rpcRequest.id,
      error: {
        code: ErrorCodeInternalError,
        message: "Internal error",
      },
    });
  }
});

app.get("/.well-known/agent.json", (req: Request, res: Response) => {
  const agentCard = getAgentCard(req);
  res.json(agentCard);
});

connectDB()
  .then((client: MongoClient) => {
    client.db("info_bank");
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database: ", err);
  });
