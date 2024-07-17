import app from "../../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { User } from "../../../models/user";
import { ChatRoom } from "../../../models/chatRoom";

const userInput = {
    name: "testuser",
    email: "testuser@gmail.com",
    password: "testpass"
}

const userInput2 = {
    name: "testuser2",
    email: "testuser2@gmail.com",
    password: "testpass2"
}

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
    await User.create(userInput)
    await User.create(userInput2)
    const chatRoomUser = await User.findOne({ email: userInput.email })
    const chatRoomUser2 = await User.findOne({ email: userInput2.email })
    await ChatRoom.create({users: [chatRoomUser?._id, chatRoomUser2?._id], messages: []})
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

describe("Finding chatroom", () => {
    it("Sends 200 OK if chatroom is found", async () => {
        try {
            const foundChatRoom = await ChatRoom.findOne({})
            const response = await supertest(app)
            .get(`/api/chatRooms/${foundChatRoom!._id}`)
            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Chatroom found")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 404 if chatroom is not found", async () => {
        try {
            const notFoundChatRoomId = new mongoose.Types.ObjectId()
            const response = await supertest(app)
            .get(`/api/chatRooms/${notFoundChatRoomId}`)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe("No chatrooms found with provided id")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
})