import { io } from 'socket.io-client'
import { API_BASE } from './config'
const sock = io(API_BASE);

sock.on('connection', () => {
  console.log("socket connection established")
})
export default sock;