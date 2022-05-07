import { io } from 'socket.io-client'
require('dotenv').config()
const url = process.env.REACT_APP_BASE_URL === undefined ? "http://localhost:3001" : process.env.REACT_APP_BASE_URL;
const sock = io(url);

sock.on('connection', () => {
  console.log("socket connection established")
})
export default sock;