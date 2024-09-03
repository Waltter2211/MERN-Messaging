import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

/* socket.on("users", (users) => {
    console.log(users)
}) */

/* socket.on('message', (message) => {
    console.log(message)
}) */

export default socket;