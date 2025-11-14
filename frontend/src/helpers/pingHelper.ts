import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";


export const pingHelperFunc = (arr:{_id:string}[], arg:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    arr.forEach((roomObj: { _id: string }) => {
        console.log(roomObj)
        arg.emit('message', roomObj._id)
    });
}