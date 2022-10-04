import { getTransactions, writeTransactions } from "./blockchain-helpers.js";
import { getKnownPeerAddresses } from "./network-helpers.js";

import WebSocket, { WebSocketServer } from "ws";
import dotenv from "dotenv";
dotenv.config();

const knownPeers = getKnownPeerAddresses();
const MY_PORT = process.env.PORT;
const MY_ADDRESS = `ws://localhost:${MY_PORT}`;
const transactions = getTransactions();

let openedSockets = [];
let connectedAddresses = [];
let attemptingToConnectAddresses = [];

const openConnections = (addressArray) => {
  addressArray.forEach((peer) => {
    if (
      !peer.includes(MY_PORT) &&
      !attemptingToConnectAddresses.includes(peer) &&
      !connectedAddresses.includes(peer)
    ) {
      const ws = new WebSocket(peer);
      attemptingToConnectAddresses.push(peer);

      ws.on("open", () => {
        if (ws.readyState === 1) {
          attemptingToConnectAddresses = attemptingToConnectAddresses.filter(
            (p) => p !== peer
          );
          connectedAddresses.push(peer);
          openedSockets.push(ws);
          console.log(MY_ADDRESS + " connected to " + peer);
          ws.send(
            JSON.stringify({
              type: "HANDSHAKE",
              data: [...connectedAddresses, MY_ADDRESS],
            }),
            (err) => {
              if (err) {
                console.log(err);
              }
            }
          );
        }
      });

      ws.on("error", (err) => {
        connectedAddresses = connectedAddresses.filter(
          (address) => peer !== address
        );
        openedSockets = openedSockets.filter((socket) => ws !== socket);
        attemptingToConnectAddresses = attemptingToConnectAddresses.filter(
          (p) => p !== peer
        );
      });

      ws.on("close", () => {
        console.log("connection closed to ", peer);
        connectedAddresses = connectedAddresses.filter(
          (address) => peer !== address
        );
        openedSockets = openedSockets.filter((socket) => ws !== socket);
        attemptingToConnectAddresses = attemptingToConnectAddresses.filter(
          (p) => p !== peer
        );
      });
    }
  });
};

const wss = new WebSocketServer({ port: MY_PORT }, () => {
  console.log("WebsocketServer started at PORT " + MY_PORT);
  openConnections(knownPeers);
});

wss.on("connection", (socket) => {
  socket.on("message", (data, isBinary) => {
    const dataObject = JSON.parse(data);
    if (dataObject.hasOwnProperty("type")) {
      if (dataObject.type === "HANDSHAKE") {
        openConnections(dataObject.data);
      } else if (dataObject.type === "TRANSACTION") {
        const alreadyIncluded = transactions.some(
          (t) => t.hash === dataObject.data.hash
        );

        if (!alreadyIncluded) {
          transactions.push(dataObject.data);
          writeTransactions(transactions);
          for (const s of openedSockets) {
            s.send(data.toString());
          }
        }
      }
    }
  });
});
