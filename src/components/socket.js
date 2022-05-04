import { io } from 'socket.io-client'
require('dotenv').config()
const sock = io(process.env.REACT_APP_BASE_URL);

sock.on('connection', () => {
  console.log("socket connection established")
  console.log("connected")
})
export default sock;