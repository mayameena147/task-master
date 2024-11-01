const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

// Mock Data
const userData = { email: "test@example.com", password: "password123", username: "Test User" };
let authToken, userId, taskId;

// Set up before and after hooks for database connection
beforeAll(async () => {
    await mongoose.connect(process.env.MOONGOOSE_CONNECTION_STRING + process.env.DB_NAME, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("User Account and Task Management", () => {
    // 1. Create a new account
    it("should create a new user account", async () => {
        const res = await request(app).post("/users/register").send(userData);
        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User registered successfully");
    });

    // 2. Log in
    it("should log in the user and return a token", async () => {
        const res = await request(app).post("/users/login").send(userData);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("token");
        authToken = res.body.token;
    });

    // 3. View and update profile
    it("should get and update user profile", async () => {
        const getRes = await request(app).get(`/users/profile`).set("Authorization", `Bearer ${authToken}`);
        expect(getRes.statusCode).toBe(200);
        userId = getRes.body.user._id;

        const updateRes = await request(app).put(`/users/profile`).set("Authorization", `Bearer ${authToken}`).send({ email: "test@example.com", password: "password123", username: "Updated User" });
        expect(updateRes.statusCode).toBe(200);
        expect(updateRes.body.user.username).toBe("Updated User");
    });

    // 4. Create a new task
    it("should create a new task", async () => {
        const taskData = { title: "Test Task", description: "Task description", dueDate: "2024-12-31" };
        const res = await request(app).post("/tasks").set("Authorization", `Bearer ${authToken}`).send(taskData);
        expect(res.statusCode).toBe(201);
        taskId = res.body.task._id;
    });

    // 5. View all assigned tasks
    it("should get all tasks assigned to the user", async () => {
        const res = await request(app).get("/tasks").set("Authorization", `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.tasks)).toBe(true);
    });

    // 6. Mark a task as completed
    it("should mark a task as completed", async () => {
        const res = await request(app).put(`/tasks/${taskId}/complete`).set("Authorization", `Bearer ${authToken}`);
        expect(res.statusCode).toBe(201);
        expect(res.body.task.status).toBe("completed");
    });

    // 7. Assign a task to another user
    it("should assign a task to another user", async () => {
        const res = await request(app).put(`/tasks/${taskId}/${userId}`).set("Authorization", `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.task.assignedUser).toBe(userId);
    });

    // 8. Filter tasks by status
    it("should filter tasks by status", async () => {
        const res = await request(app).get("/tasks?status=completed").set("Authorization", `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.tasks.every(task => task.status === "completed")).toBe(true);
    });

    // 9. Search tasks by title or description
    it("should search for tasks by title or description", async () => {
        const res = await request(app).get("/tasks?Ysearch=Test").set("Authorization", `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.tasks.some(task => task.title.includes("Test") || task.description.includes("Test"))).toBe(true);
    });

    // 10. Add comments and attachments to tasks
    it("should add a comment and an attachment to a task", async () => {
        const commentData = { content: "This is a test comment." };
        const res = await request(app).post(`/tasks/${taskId}/comment`).set("Authorization", `Bearer ${authToken}`).send(commentData);
        expect(res.statusCode).toBe(201);
        expect(res.body.task.comments.length).toBeGreaterThan(0);

        const attachmanetData = { url: "path/to/file.png" };
        const attachmentRes = await request(app)
            .post(`/tasks/${taskId}/attachment`)
            .set("Authorization", `Bearer ${authToken}`)
            .send(attachmanetData);
        expect(attachmentRes.statusCode).toBe(201);
    });

    // 11. Create a new team/project and invite members
    it("should create a new team and invite members", async () => {
        const teamData = { name: "Test Team", members: [userId] };
        const res = await request(app).post("/teams/create").set("Authorization", `Bearer ${authToken}`).send(teamData);
        expect(res.statusCode).toBe(201);
        //expect(res.body.team.members.includes(userId)).toBe(true);
        const teamId = res.body.team._id;
        const res2 = await request(app).post(`/teams/invite`).set("Authorization", `Bearer ${authToken}`).send({teamId: teamId, memberId: userId});
        expect(res2.statusCode).toBe(400);
    });

    // 12. Log out
    it("should log out the user", async () => {
        const res = await request(app).post("/users/logout").set("Authorization", `Bearer ${authToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Logged out successfully");
    });
});
