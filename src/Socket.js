import io from "socket.io-client";
import { SOCKET, Event, sendNotfication } from "./Helper";

/**
 * Socket URL
 */

// const ws = SOCKET;
// http://34.78.45.194:8081/
// use this to connect with the development server
const ws =
  process.env.NODE_ENV !== "production" ? "http://34.78.45.194:8081" : SOCKET;

console.log("ws--- ", ws);
/**
 * Initialize Socket Connection
 */

const socket = io.connect(ws, {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

/*
 * Auto Login By Reload
 * TODO
 */
socket.on("connect", () => {
  Event.emit("connect");
});

/*
 * Disconnect Server
 */
socket.on("disconnect", () => {
  Event.emit("disconnect");
  sendNotfication(
    "Connection Lost, Trying to connect...",
    "danger",
    "top-center"
  );
});

export default socket;
