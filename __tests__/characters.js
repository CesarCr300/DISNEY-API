const request = require('supertest')
const app = require('../src/app')
const { connectionDB } = require('../src/db')

let token

beforeAll(async() => {
    process.env.NODE_ENV = 'test'
    await connectionDB()
    const userCreated = await request(app).get('/auth/register').send({ email: "user@example.com", password: "password" })
    token = userCreated.body.token
})

describe('/characters', function() {
    test('without a token', async() => {
        const response = await request(app).get('/characters')
        expect(response.status).toBe(400)
        expect(response.body.err).toBe('Necesitas un token')
    })
    test('with an invalid token', async() => {
        const response = await request(app).get('/characters').set('access-token', 'hi')
        expect(response.status).toBe(400)
        expect(response.body.err).toBe('jwt malformed')
    })
    test('with a correct token', async() => {
        const response = await request(app).get('/characters').set('access-token', token)
        console.log(response.body)
    })
})