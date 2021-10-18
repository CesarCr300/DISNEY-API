const request = require('supertest')
const app = require('../src/app')
const { connectionDB } = require('../src/db')
beforeAll(async() => {
    process.env.NODE_ENV = 'test'
    await connectionDB()
})

describe('/auth/register', () => {
    test('correct', async() => {
        const response = await request(app).get("/auth/register").send({ email: "user@example.com", password: "password" })
        expect(response.body).toHaveProperty("token")
        expect(response.status).toBe(201)
    })
    test('with an invalid email', async() => {
        const response = await request(app).get("/auth/register").send({ email: "userexample.com", password: "password" })
        expect(response.body).toHaveProperty("err")
        expect(response.body.err).toBe('Validation error: Debe ingresar un email válido')
        expect(response.status).toBe(400)
    })
    test('with a repited email', async() => {
        const response = await request(app).get("/auth/register").send({ email: "user@example.com", password: "password" })
        expect(response.body).toHaveProperty("err")
        expect(response.body.err).toBe('El email ya esta siendo usado')
        expect(response.status).toBe(400)
    })
})

describe('/auth/login', () => {
    test('with a email registered', async() => {
        const response = await request(app).get("/auth/login").send({ email: "user@example.com", password: "password" })
        expect(response.body).toHaveProperty("token")
        expect(response.status).toBe(200)
    })
    test('with an email not registered', async() => {
        const response = await request(app).get("/auth/login").send({ email: "user1@example.com", password: "password" })
        expect(response.body).toHaveProperty("err")
        expect(response.body.err).toBe('Email o contraseña invalidos')
        expect(response.status).toBe(404)
    })
    test('with a wrong password', async() => {
        const response = await request(app).get("/auth/login").send({ email: "user@example.com", password: "wrongPassword" })
        expect(response.body).toHaveProperty("err")
        expect(response.body.err).toBe('Email o contraseña invalidos')
        expect(response.status).toBe(404)
    })
})