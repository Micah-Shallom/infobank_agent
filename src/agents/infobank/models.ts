export enum RPCMethod {
  TASK_SEND = "tasks/send",
  TASK_GET = "tasks/get",
  TASK_CANCEL = "tasks/cancel",
  TASK_PUSH = "tasks/push",
  TASK_RESUBSCRIBE = "tasks/resubscribe",
  TASK_PUSH_GET = "tasks/push/get",
  TASK_PUSH_UPDATE = "tasks/push/update",
  TASK_PUSH_DELETE = "tasks/push/delete",
}

export enum ParseOperation {
  STORE = "store",
  RETRIEVE = "retrieve",
}
