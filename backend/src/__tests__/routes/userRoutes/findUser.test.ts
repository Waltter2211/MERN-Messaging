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
    name: "testuser23",
    email: "testuser23@gmail.com",
    password: "testpass23"
}

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
    await User.create(userInput)
})

afterEach(async () => {
    await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

describe("Finding single user", () => {
    it("Sends 200 OK if user is found", async () => {
        const foundUser = await User.findOne({ email: userInput.email })
        const foundUserObj = {
            id: foundUser?._id,
            name: foundUser?.name,
            email: foundUser?.email
        }
        const token = jwt.sign(foundUserObj, process.env.JSONTOKEN!)
        try {
            await supertest(app)
            .get(`/api/users/${userInput.email}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then(async (response) => {
                expect(response.body.message).toBe("User found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 404 if session token is not found", async () => {
        try {
            await supertest(app)
            .get(`/api/users/${userInput.email}`)
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("No authorization token found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 401 if session token is invalid", async () => {
        try {
            const token = jwt.sign(userInput, process.env.JSONTOKEN!)
            await supertest(app)
            .get(`/api/users/${notFoundUserInput.email}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(401)
            .then(async (response) => {
                expect(response.body.message).toBe("No email matches this session")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 404 if user is not found", async () => {
        try {
            const token = jwt.sign(notFoundUserInput, process.env.JSONTOKEN!)
            await supertest(app)
            .get(`/api/users/${notFoundUserInput.email}`)
            .set("Authorization", `Bearer ${token}`)
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("No user found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
})