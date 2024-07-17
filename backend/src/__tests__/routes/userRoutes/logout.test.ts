import app from "../../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { User } from "../../../models/user";
import jwt from "jsonwebtoken"
import "dotenv/config"

const userInput = {
    name: "testuser",
    email: "testuser@gmail.com",
    password: "testpass"
}

const notFoundUserInput = {
    id: new mongoose.Types.ObjectId(),
    name: "testuser11",
    email: "testuser11@gmail.com",
    password: "testpass11"
}

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
    await User.create(userInput)
    await User.findOneAndUpdate({ email: userInput.email, isOnline: true })
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

describe("Logging user out", () => {
    it("Logs user out if user is found and logged in", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            foundUser!.isOnline = false
            const foundUserObj = {
                id: foundUser?._id,
                name: foundUser?.name,
                email: foundUser?.email
            }
            const token = jwt.sign(foundUserObj, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .put(`/api/users/${foundUser?.email}`)
            .set("Authorization", `Bearer ${token}`)
            .send(foundUser!)
            expect(response.status).toBe(200)
            expect(response.body.message).toBe("Successfully logged out")
            expect(response.body.isOnline).not.toBeTruthy()
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends error 404 if user is not found", async () => {
        try {
            const token = jwt.sign(notFoundUserInput, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .put(`/api/users/${notFoundUserInput.email}`)
            .set("Authorization", `Bearer ${token}`)
            .send(notFoundUserInput)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe("User not found")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 401 if user session token is invalid", async () => {
        try {
            const foundUser = await User.findOne({ email: userInput.email })
            const foundUserObj = {
                id: foundUser?._id,
                name: foundUser?.name,
                email: foundUser?.email
            }
            const token = jwt.sign(foundUserObj, process.env.JSONTOKEN!)
            const response = await supertest(app)
            .put(`/api/users/${notFoundUserInput.email}`)
            .set("Authorization", `Bearer ${token}`)
            .send(userInput)
            expect(response.status).toBe(401)
            expect(response.body.message).toBe("No valid session token found")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 404 if user session token is not found", async () => {
        try {
            const response = await supertest(app)
            .put(`/api/users/${userInput.email}`)
            .send(userInput)
            expect(response.status).toBe(404)
            expect(response.body.message).toBe("No authorization token found")
        } catch (error) {
            console.log(error)
            throw Error
        }
    })
})