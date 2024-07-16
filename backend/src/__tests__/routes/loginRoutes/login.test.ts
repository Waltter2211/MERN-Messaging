import app from "../../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'
import { User } from "../../../models/user";

const userInput = {
    name: "testuser",
    email: "testuser@gmail.com",
    password: bcrypt.hashSync("testpass", 10)
}

const alreadyLoggedInUserInput = {
    name: "testuser2",
    email: "testuser2@gmail.com",
    password: bcrypt.hashSync("testpass2", 10),
    isOnline: true
}

const loginInput = {
    email: "testuser@gmail.com",
    password: "testpass"
}

const alreadyLoggedInLoginInput = {
    email: "testuser2@gmail.com",
    password: "testpass2",
}

const badLoginInput = {
    email: "te@gmail.com",
    password: "testpass"
}

const badLoginInputPass = {
    email: "testuser@gmail.com",
    password: "wrongpass"
}

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
    await User.create(userInput)
    await User.create(alreadyLoggedInUserInput)
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

describe("Logging in as user", () => {
    it("Sends 200 OK if login is successful", async () => {
        try {
            await supertest(app)
            .post("/api/login/")
            .send(loginInput)
            .expect(200)
            .then(async (response) => {
                expect(response.body.message).toBe("Login successful")

                const loggedInUser = await User.findOne({ email: loginInput.email })
                expect(loggedInUser!.isOnline).toBeTruthy()
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 404 if user is not found with email", async () => {
        try {
            await supertest(app)
            .post("/api/login/")
            .send(badLoginInput)
            .expect(404)
            .then(async (response) => {
                expect(response.body.message).toBe("No user with that email found")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 401 if password is wrong", async () => {
        try {
            await supertest(app)
            .post("/api/login/")
            .send(badLoginInputPass)
            .expect(401)
            .then(async (response) => {
                expect(response.body.message).toBe("Wrong password")
            })
        } catch (error) {
            console.log(error)
        } 
    })
    it("Sends 401 if user is already logged in", async () => {
        try {
            await supertest(app)
            .post("/api/login/")
            .send(alreadyLoggedInLoginInput)
            .expect(401)
            .then(async (response) => {
                expect(response.body.message).toBe("User already logged in")
            })
        } catch (error) {
            console.log(error)
        } 
    })
})