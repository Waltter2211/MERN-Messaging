import { io } from "socket.io-client";

const URL = `${import.meta.env.VITE_BACKEND_URL}`;
const socket = io(URL, { autoConnect: true });

/* socket.on("users", (users) => {
    console.log(users)
}) */

/* socket.on('message', (message) => {
    console.log(message)
}) */

export default socket;