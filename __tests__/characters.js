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
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(4)
        expect(response.body[0]).toHaveProperty("Imagen")
        expect(response.body[0]).toHaveProperty("Nombre")
    })
    test('with queries by name', async() => {
        const response = await request(app).get('/characters?name=P').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0].Imagen).toBe(null)
        expect(response.body[0].Nombre).toBe("Phineas")
    })
    test('with queries by movies/series', async() => {
        const response = await request(app).get('/characters?movies=1').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(2)
        expect(response.body[0].Imagen).toBe(null)
        expect(response.body[0].Nombre).toBe("Phineas")
    })
    test('with queries by name and movies/series', async() => {
        const response = await request(app).get('/characters?name=P&movies=1').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0].Imagen).toBe(null)
        expect(response.body[0].Nombre).toBe("Phineas")
    })
})