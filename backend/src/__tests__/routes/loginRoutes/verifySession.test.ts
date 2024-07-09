import app from "../../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from "../../../models/user";
import "dotenv/config"

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
    await User.create(userInput)
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

const userInput = {
    name: "testuser",
    email: "testuser@gmail.com",
    password: bcrypt.hashSync("testpass", 10)
}

describe("Verifying session", () => {
    it("Sends 200 OK if token is found", async () => {
        try {
            const token = jwt.sign(userInput, process.env.JSONTOKEN!)
            await supertest(app)
            .get("/api/login/")
            .set("Authorization", `Bearer ${token}`)
            .expect(200)
            .then(async (response) => {
                expect(response.body.message).toBe("Session verified successfully")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 404 if token is not found", async () => {
        try {
            await supertest(app)
            .get("/api/login/")
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("No authorization token found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
})