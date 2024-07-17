import app from "../../../app";
import supertest from "supertest";
import mongoose from "mongoose";
import { User } from "../../../models/user";

const userInput = {
    name: "testuser",
    email: "testuser@gmail.com",
    password: "testpass"
}

const badUserInput = {
    name: "te",
    email: "testuser@gmail.com",
    password: "testpass"
}

beforeEach(async () => {
	await mongoose.connect("mongodb://localhost:27017/acmedb")
})

afterEach(async () => {
	await mongoose.connection.db.dropDatabase()
	await mongoose.connection.close()
})

describe("Creating new user", () => {
    it("Sends 200 OK if user credentials are valid", async () => {
        try {
            const response = await supertest(app)
            .post("/api/users/")
            .send(userInput)
            expect(response.status).toBe(200)
            expect(response.body.message).toBe("User successfully created")
            expect(response.body.userObj.name).toBe("testuser")
            expect(response.body.userObj.email).toBe("testuser@gmail.com")

            const user = await User.findOne({ email: response.body.userObj.email })
            expect(user).toBeTruthy()
            expect(user?.name).toBe(userInput.name)
            expect(user?.email).toBe(userInput.email)
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 401 if user credentials are already in use", async () => {
        try {
            await User.create(userInput)
            const response = await supertest(app)
            .post("/api/users/")
            .send(userInput)
            expect(response.status).toBe(401)
            expect(response.body.message).toBe("User with that name or email has already been registered")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
    it("Sends 401 if user validation is invalid", async () => {
        try {
            const response = await supertest(app)
            .post("/api/users/")
            .send(badUserInput)
            expect(response.status).toBe(401)
            expect(response.body.error).toBe("users validation failed: name: Path `name` (`te`) is shorter than the minimum allowed length (3).")
        } catch (error) {
            console.log(error)
            throw Error
        } 
    })
})