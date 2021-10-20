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

describe('GET /characters', function() {
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
describe('POST /characters', function() {
    test('without a token', async() => {
        const response = await request(app).post('/characters')
        expect(response.status).toBe(400)
        expect(response.body.err).toBe('Necesitas un token')
    })
    test('without a title', async() => {
        const response = await request(app).post('/characters').set("access-token", token)
        expect(response.status).toBe(400)
        expect(response.body.err).toBe('notNull Violation: El nombre no puede ser nulo')
    })
    test("with a title", async() => {
        const response = await request(app).post('/characters').set("access-token", token).send({ name: "Clifford" })
        expect(response.body.name).toBe('Clifford')
        expect(response.status).toBe(201)
    })
    test("with a movie", async() => {
        const response = await request(app).post('/characters').set("access-token", token).send({ name: "Isabella", movies: [1] })

        const isabella = await request(app).get('/characters/6').set('access-token', token)

        expect(isabella.body.videos.length).toBe(1)
        expect(isabella.body.videos[0].title).toBe('Phineas y Ferb')
        expect(response.body.name).toBe('Isabella')
        expect(response.status).toBe(201)
    })
})

describe('GET /characters/characterId', function() {
    test('with a incorrect id', async() => {
        const response = await request(app).get('/characters/f').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body).toBe(null)
    })
    test('with a correct id', async() => {
        const response = await request(app).get('/characters/1').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body.Edad).toBe(15)
        expect(response.body.Nombre).toBe("Phineas")
        expect(response.body.videos.length).toBe(1)
        expect(response.body.videos[0].title).toBe("Phineas y Ferb")
    })
})

describe('PATCH /character/characterId', function() {
    test('without a token', async() => {
        const response = await request(app).patch('/characters/1')
        expect(response.status).toBe(400)
        expect(response.body.err).toBe('Necesitas un token')
    })
    test('with a incorrect id', async() => {
        const response = await request(app).patch('/characters/f').set('access-token', token)
        expect(response.status).toBe(400)
        expect(response.body.err).toBe("Ingrese un characterId válido")
    })
    test('with a valid id', async() => {
        const response = await request(app).patch('/characters/1').set('access-token', token).set('access-token', token).send({
            name: "Phineas 2",
            age: 18,
            history: "He is the main character",
            weight: 80,
            videos: [1]
        })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Personaje actualizado')

        const phineas2 = await request(app).get('/characters/1').set('access-token', token)
        expect(phineas2.body.Nombre).toBe('Phineas 2')
        expect(phineas2.body.Edad).toBe(18)
        expect(phineas2.body.Peso).toBe(80)
    })
})

describe('DELETE /character/characterId', function() {
    test('without a token', async() => {
        const response = await request(app).delete('/characters/1')
        expect(response.status).toBe(400)
        expect(response.body.err).toBe('Necesitas un token')
    })
    test('with a incorrect id', async() => {
        const response = await request(app).delete('/characters/f').set('access-token', token)
        expect(response.status).toBe(400)
        expect(response.body.err).toBe("Ingrese un characterId válido")
    })
    test('with a valid id', async() => {
        const response = await request(app).delete('/characters/1').set('access-token', token).set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Personaje eliminado')

        const phineas = await request(app).get('/characters/1').set('access-token', token)
        expect(phineas.body).toBe(null)
        expect(phineas.status).toBe(200)
    })
})