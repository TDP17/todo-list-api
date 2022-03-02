import request from "supertest";
import app from "../index.js";

describe("GET /", () => {
    it("Responds with Hello", (done) => {
        request(app).get("/").expect("Hello", done);
    })
});