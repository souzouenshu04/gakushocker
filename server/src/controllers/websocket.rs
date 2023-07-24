use crate::database::RepositoryProvider;
use crate::entities::order::Order;
use axum::extract::ws::{Message, WebSocket};
use axum::extract::{State, WebSocketUpgrade};
use axum::response::Response;
use futures_util::{sink::SinkExt, stream::StreamExt};
use serde::{Deserialize, Serialize};
use std::fmt::{Display, Formatter};
use tokio::sync::broadcast;
use crate::usecases::order::find_recent_order_by_user_id;

#[derive(Clone)]
pub struct BroadcastState {
    pub tx: broadcast::Sender<String>,
    pub repo: RepositoryProvider,
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Clone)]
pub enum GakushockerMessageType {
    GetOrderInfo,
    SetOrderInfo,
    Connect,
    Connected,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct GakushockerMessage {
    r#type: GakushockerMessageType,
    user_id: i32,
}

impl Display for GakushockerMessage {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        write!(
            f,
            "{{ \"type\": \"{:?}\", \"userId\": {} }}",
            self.r#type, self.user_id
        )
    }
}

pub async fn websocket_handler(
    ws: WebSocketUpgrade,
    State(state): State<BroadcastState>,
) -> Response {
    ws.on_upgrade(|socket| websocket(socket, state))
}

pub async fn websocket(socket: WebSocket, state: BroadcastState) {
    let (mut sender, mut receiver) = socket.split();
    while let Some(Ok(msg)) = receiver.next().await {
        if let Message::Text(msg) = msg {
            let received: GakushockerMessage = serde_json::from_str(&msg).unwrap();
            if received.r#type == GakushockerMessageType::Connect {
                println!("{}", format!("{}", received.clone()));
                sender
                    .send(Message::from(format!(
                        "{}",
                        GakushockerMessage {
                            r#type: GakushockerMessageType::Connected,
                            user_id: received.user_id
                        }
                    )))
                    .await
                    .unwrap();
            }
            break;
        }
    }

    let mut rx = state.tx.subscribe();

    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    let tx = state.tx.clone();
    let repo = state.repo;
    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(msg))) = receiver.next().await {
            let received: GakushockerMessage = serde_json::from_str(&msg).unwrap();
            if received.r#type == GakushockerMessageType::GetOrderInfo {
                let users_order = find_recent_order_by_user_id(&repo, received.user_id).await.unwrap();
                let _ = tx.send(serde_json::to_string(&users_order).unwrap());
            } else {
                let _ = tx.send(format!("{}", msg));
            }
        }
    });

    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    }
}
