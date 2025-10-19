import { io } from "socket.io-client";
import { API_BASE } from "./config";

// Create a lazy socket proxy. Many components import the socket module at
// module-evaluation time (App imports many route components), which used to
// call `io()` immediately and open a connection even when the user was on the
// homepage. That caused CORS errors in dev because the backend only allows the
// deployed origin. This proxy delays creating the real socket until the app
// actually uses it (for example when joining an interview room).

let realSocket = null;
function ensureSocket() {
  if (realSocket) return realSocket;
  // Initialize the real socket when first needed
  realSocket = io(API_BASE);
  realSocket.on("connect", () => {
    console.log("[SOCKET] connected", realSocket.id);
  });
  realSocket.on("connect_error", (err) => {
    console.warn(
      "[SOCKET] connect_error:",
      err && err.message ? err.message : err
    );
  });
  return realSocket;
}

// Proxy object that exposes the common socket.io client interface we use.
// Methods call ensureSocket() so the real connection is only created on first use.
const socketProxy = {
  on: (...args) => ensureSocket().on(...args),
  once: (...args) => ensureSocket().once(...args),
  off: (...args) => ensureSocket().off(...args),
  emit: (...args) => ensureSocket().emit(...args),
  disconnect: () => (realSocket ? realSocket.disconnect() : undefined),
  // allow reading id as a property (will initialize socket)
  get id() {
    return (ensureSocket() && realSocket.id) || null;
  },
};

export default socketProxy;
