import app from "../../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { User } from "../../../models/user";
import jwt from "jsonwebtoken"
import "dotenv/config"

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
    await User.create(userInput)
    await User.findOneAndUpdate({ email: userInput.email, isOnline: true })
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

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
            await supertest(app)
            .put(`/api/users/${foundUser!.email}`)
            .set("Authorization", `Bearer ${token}`)
            .send(foundUser!)
            .expect(200)
            .then(async (response) => {
                expect(response.body.message).toBe("Successfully logged out")
                expect(response.body.isOnline).not.toBeTruthy()
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends error 404 if user is not found", async () => {
        try {
            const token = jwt.sign(notFoundUserInput, process.env.JSONTOKEN!)
            await supertest(app)
            .put(`/api/users/${notFoundUserInput.email}`)
            .set("Authorization", `Bearer ${token}`)
            .send(notFoundUserInput)
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("User not found")
            })
        } catch (error) {
            console.log(error)
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
            await supertest(app)
            .put(`/api/users/${notFoundUserInput.email}`)
            .set("Authorization", `Bearer ${token}`)
            .send(userInput)
            .expect(401)
            .then(async (response) => {
                expect(response.body.message).toBe("No valid session token found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 404 if user session token is not found", async () => {
        try {
            await supertest(app)
            .put(`/api/users/${userInput.email}`)
            .send(userInput)
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("No authorization token found")
            })
        } catch (error) {
            console.log(error)
        }
    })
})