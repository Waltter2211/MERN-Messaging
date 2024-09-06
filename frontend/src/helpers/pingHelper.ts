import { DefaultEventsMap } from "@socket.io/component-emitter";

export const pingHelperFunc = (arr:{_id:string}[], arg:Socket<DefaultEventsMap, DefaultEventsMap>) => {
    arr.forEach((roomObj: { _id: string }) => {
        arg.emit('message', roomObj._id)
    });
}