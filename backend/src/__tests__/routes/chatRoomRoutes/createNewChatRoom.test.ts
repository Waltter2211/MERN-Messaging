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

const notFoundUserInput = {
    name: "testuser22",
    email: "testuser22@gmail.com",
    password: "testpass22"
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

describe("Creating new chatroom", () => {
    it("Sends 200 OK if chatroom is successfully created", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUser2 = await User.findOne({ email: userInput2.email })
            const userObj = { user: foundUser2!.email }
            const token = jwt.sign(userInput, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .post(`/api/chatRooms/${foundUser!.email}`)
            .send(userObj)
            .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Successfully added user to contacts")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 404 if authorization token is not found", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUser2 = await User.findOne({ email: userInput2.email })
            const userObj = { user: foundUser2!.email }
            const response = await supertest(app)
            .post(`/api/chatRooms/${foundUser!.email}`)
            .send(userObj)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe("No authorization token found")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 401 if user doesn't match session", async () => {
        try {
            const foundUser2 = await User.findOne({ email: userInput2.email })
            const userObj = { user: foundUser2!.email }
            const token = jwt.sign(userInput, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .post(`/api/chatRooms/${foundUser2!.email}`)
            .send(userObj)
            .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(401)
            expect(response.body.message).toBe("No user matches this session")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 404 if user is not found", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const userObj = { user: notFoundUserInput!.email }
            const token = jwt.sign(userInput, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .post(`/api/chatRooms/${foundUser!.email}`)
            .send(userObj)
            .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe("User not found")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 401 if trying to create chatroom with yourself", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const userObj = { user: foundUser!.email }
            const token = jwt.sign(userInput, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .post(`/api/chatRooms/${foundUser!.email}`)
            .send(userObj)
            .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(401)
            expect(response.body.message).toBe("Cannot create room with yourself")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 401 if room already exists", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUser3 = await User.findOne({ email: userInput3.email })
            const chatRoomObj = {
                users: [foundUser!._id, foundUser3!._id],
                messages: []
            }
            await ChatRoom.create(chatRoomObj)
            const userObj = { user: foundUser3!.email }
            const token = jwt.sign(userInput, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .post(`/api/chatRooms/${foundUser!.email}`)
            .send(userObj)
            .set("Authorization", `Bearer ${token}`)
            expect(response.status).toBe(401)
            expect(response.body.message).toBe("Room already exists")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
})