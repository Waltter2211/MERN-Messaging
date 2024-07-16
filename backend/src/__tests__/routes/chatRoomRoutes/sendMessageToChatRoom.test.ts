import app from "../../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import { User } from "../../../models/user";
import { ChatRoom } from "../../../models/chatRoom";
import "dotenv/config"

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

const userInput3 = {
    name: "testuser3",
    email: "testuser3@gmail.com",
    password: "testpass3"
}

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
    await User.create(userInput)
    await User.create(userInput2)
    await User.create(userInput3)
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

describe("Sending message to chatroom", () => {
    it("Sends 200 OK if message is sent successfully", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUser2 = await User.findOne({ email: userInput2.email })
            const chatRoomObj = {
                users: [foundUser!._id, foundUser2!._id],
                messages: []
            }
            await ChatRoom.create(chatRoomObj)
            const foundChatRoom = await ChatRoom.findOne({ users: foundUser!._id })
            const userTokenObj = {
                id: foundUser!._id,
                email: foundUser!.email
            }
            const token = jwt.sign(userTokenObj, process.env.JSONTOKEN!)
            const messageObj = {
                sender: foundUser!.name,
                messageBody: "test message",
                timestamps: new Date().toLocaleTimeString()
            }
            await supertest(app)
            .put(`/api/chatRooms/${foundChatRoom!._id}/${foundUser!._id}`)
            .send(messageObj)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then(async (response) => {
                expect(response.body.message).toBe("Message sent successfully")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 404 if authorization token is not found", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUser2 = await User.findOne({ email: userInput2.email })
            const chatRoomObj = {
                users: [foundUser!._id, foundUser2!._id],
                messages: []
            }
            await ChatRoom.create(chatRoomObj)
            const foundChatRoom = await ChatRoom.findOne({ users: foundUser!._id })
            const messageObj = {
                sender: foundUser!.name,
                messageBody: "test message",
                timestamps: new Date().toLocaleTimeString()
            }
            await supertest(app)
            .put(`/api/chatRooms/${foundChatRoom!._id}/${foundUser!._id}`)
            .send(messageObj)
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("No authorization token found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 401 if user doesn't match session", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUser2 = await User.findOne({ email: userInput2.email })
            const chatRoomObj = {
                users: [foundUser!._id, foundUser2!._id],
                messages: []
            }
            await ChatRoom.create(chatRoomObj)
            const foundChatRoom = await ChatRoom.findOne({ users: foundUser!._id })
            const messageObj = {
                sender: foundUser!.name,
                messageBody: "test message",
                timestamps: new Date().toLocaleTimeString()
            }
            const userTokenObj = {
                id: foundUser!._id,
                email: foundUser!.email
            }
            const token = jwt.sign(userTokenObj, process.env.JSONTOKEN!)
            await supertest(app)
            .put(`/api/chatRooms/${foundChatRoom!._id}/${foundUser2!._id}`)
            .send(messageObj)
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .then(async (response) => {
                expect(response.body.message).toBe("No user matches this session")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 404 if chatroom is not found", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const userTokenObj = {
                id: foundUser!._id,
                email: foundUser!.email
            }
            const token = jwt.sign(userTokenObj, process.env.JSONTOKEN!)
            const messageObj = {
                sender: foundUser!.name,
                messageBody: "test message",
                timestamps: new Date().toLocaleTimeString()
            }
            const notFoundChatRoomId = new mongoose.Types.ObjectId()
            await supertest(app)
            .put(`/api/chatRooms/${notFoundChatRoomId}/${foundUser!._id}`)
            .send(messageObj)
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("No chatroom found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 401 if user is not authorized to send messages", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUser2 = await User.findOne({ email: userInput2.email })
            const foundUser3 = await User.findOne({ email: userInput3.email })
            const chatRoomObj = {
                users: [foundUser!._id, foundUser2!._id],
                messages: []
            }
            await ChatRoom.create(chatRoomObj)
            const foundChatRoom = await ChatRoom.findOne({ users: foundUser!._id })
            const userTokenObj = {
                id: foundUser3!._id,
                email: foundUser3!.email
            }
            const token = jwt.sign(userTokenObj, process.env.JSONTOKEN!)
            const messageObj = {
                sender: foundUser!.name,
                messageBody: "test message",
                timestamps: new Date().toLocaleTimeString()
            }
            await supertest(app)
            .put(`/api/chatRooms/${foundChatRoom!._id}/${foundUser3!._id}`)
            .send(messageObj)
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .then(async (response) => {
                expect(response.body.message).toBe("User not authorized to send messages")
            })
        } catch (error) {
            console.log(error)
        } 
    })
})