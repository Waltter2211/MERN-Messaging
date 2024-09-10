import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: true });

/* socket.on("users", (users) => {
    console.log(users)
}) */

/* socket.on('message', (message) => {
    console.log(message)
}) */

export default socket;