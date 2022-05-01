import { io } from 'socket.io-client'

const sock = io("https://urban-eatary-backend.herokuapp.com");

sock.on('connection', () => {
  console.log("socket connection established")
  console.log("connected")
})
export default sock;