export interface Message {
  type: "GetOrderInfo" | "SetOrderInfo" | "Connect" | "Connected",
  userId: number
}