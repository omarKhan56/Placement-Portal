const request = require("supertest");
const app = require("../../app");

// Mock email sender
jest.mock("../../config/nodemailer", () => {
    return jest.fn().mockResolvedValue(true);
});

describe("Register API", () => {

    test("should register a new student", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "student@test.com",
                password: "Password@123",
                role: "student",
                fullName: "Omar Ali",
                studentId: "123456",
                department: "Computer Science",
                semester: 7
            });



        expect(res.statusCode).toBe(201);

        expect(res.body.success).toBe(true);

        expect(res.body.token).toBeDefined();

        expect(res.body.user.email).toBe("student@test.com");

        expect(res.body.user.role).toBe("student");

    });

    test("should reject duplicate email", async () => {

        await request(app)
            .post("/api/auth/register")
            .send({
                email: "student@test.com",
                password: "Password@123",
                role: "student",
                fullName: "Omar Ali",
                studentId: "123456",
                department: "Computer Science",
                semester: 7
            });

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "student@test.com",   // Duplicate email
                password: "Password@123",
                role: "student",
                fullName: "Ali Khan",
                studentId: "654321",         // Different Student ID
                department: "Computer Science",
                semester: 7
            });



        expect(res.statusCode).toBe(400);

        expect(res.body.success).toBe(false);

        expect(res.body.message).toContain("User already exists");

    });

});