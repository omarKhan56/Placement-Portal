const request = require("supertest");
const app = require("../../app");

// Mock email sender
jest.mock("../../config/nodemailer", () => {
    return jest.fn().mockResolvedValue(true);
});

describe("Login API", () => {

    beforeEach(async () => {

        const registerRes = await request(app)
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

        // Helpful while debugging
  

    });

    test("should login successfully", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "student@test.com",
                password: "Password@123"
            });



        expect(res.statusCode).toBe(200);

        expect(res.body.success).toBe(true);

        expect(res.body.token).toBeDefined();

    });

    test("should reject wrong password", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "student@test.com",
                password: "WrongPassword"
            });

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

    });

    test("should reject unknown email", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "unknown@test.com",
                password: "Password@123"
            });

        expect(res.statusCode).toBe(401);

        expect(res.body.success).toBe(false);

    });

});