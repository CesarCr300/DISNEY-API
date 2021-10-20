const request = require('supertest')
const app = require('../src/app')
const { connectionDB } = require('../src/db')

let token

beforeAll(async() => {
    try {
        process.env.NODE_ENV = 'test'
        await connectionDB()
        const userCreated = await request(app).get('/auth/register').send({ email: "user@example.com", password: "password" })
        token = userCreated.body.token
    } catch (error) {
        console.err
    }
})

describe('GET /movies', function() {
    test('without a token', async() => {
        const response = await request(app).get('/movies')

        expect(response.body.err).toBe('Necesitas un token')
        expect(response.status).toBe(400)
    })
    test('with an invalid token', async() => {
        const response = await request(app).get('/movies').set('access-token', 'token')
        expect(response.body.err).toBe('jwt malformed')
        expect(response.status).toBe(400)
    })
    test('with a valid token', async() => {
        const response = await request(app).get('/movies').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(2)
        expect(response.body[0]).toHaveProperty("Título")
        expect(response.body[0]).toHaveProperty("Fecha de creación")
    })
    test('with queries by title', async() => {
        const response = await request(app).get('/movies?name=P').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body.length).toBe(1)
        expect(response.body[0]).toHaveProperty("Imagen")
        expect(response.body[0]).toHaveProperty("Título")
        expect(response.body[0]).toHaveProperty("Fecha de creación")
    })
    test('with queries by gender', async() => {
        const response = await request(app).get('/movies?genre=3').set('access-token', token)
        expect(response.body.length).toBe(2)
        expect(response.body[0]).toHaveProperty("Fecha de creación")
        expect(response.body[0]).toHaveProperty("Imagen")
        expect(response.body[0]).toHaveProperty("Título")
    })
    test('with queries by gender and name', async() => {
        const response = await request(app).get('/movies?genre=3&name=Phineas').set('access-token', token)
        expect(response.body.length).toBe(1)
        expect(response.body[0]).toHaveProperty("Fecha de creación")
        expect(response.body[0]).toHaveProperty("Imagen")
        expect(response.body[0]).toHaveProperty("Título")
    })
})

describe('GET /movies/movieId', function() {
    test('without a token', async() => {
        const response = await request(app).get('/movies/1')

        expect(response.body.err).toBe('Necesitas un token')
        expect(response.status).toBe(400)
    })
    test('with an invalid token', async() => {
        const response = await request(app).get('/movies/1').set('access-token', 'token')
        expect(response.body.err).toBe('jwt malformed')
        expect(response.status).toBe(400)
    })
    test('with an invalid id', async() => {
        const response = await request(app).get('/movies/f').set('access-token', token)
        expect(response.body).toBe(null)
        expect(response.status).toBe(200)
    })
    test('with a valid token and valid id', async() => {
        const response = await request(app).get('/movies/1').set('access-token', token)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('id')
        expect(response.body.title).toBe("Phineas y Ferb")
        expect(response.body.characters.length).toBe(2)
    })
})

describe('POST /movies', function() {
    test('without a token', async() => {
        const response = await request(app).post('/movies')
        expect(response.body.err).toBe('Necesitas un token')
        expect(response.status).toBe(400)
    })
    test('with an invalid token', async() => {
        const response = await request(app).post('/movies').set('access-token', 'token')
        expect(response.body.err).toBe('jwt malformed')
        expect(response.status).toBe(400)
    })
    test('without a title and without creationDate', async() => {
        const response = await request(app).post('/movies').set('access-token', token)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('err')
    })
    test('with title and creationDate and token', async() => {
        const response = await request(app).post('/movies').set('access-token', token).send({ title: "Los malvados de nunca jamas", creationDate: "12/30/2003" })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('title')
    })
    test('with a character and gender', async() => {
        const response = await request(app).post('/movies').set('access-token', token).send({ title: "Las aventuras de Phineas y Ferb en el espacio", creationDate: "12/30/2004", genders: [3, 5], characters: [1, 2] })
        expect(response.status).toBe(201)

        const movieResponse = await request(app).get('/movies/4?genre=3').set('access-token', token)
        expect(movieResponse.status).toBe(200)
        expect(movieResponse.body.characters.length).toBe(2)
    })
})

describe('PATCH /movies/movieId', function() {
    test('without a token', async() => {
        const response = await request(app).patch('/movies/1')

        expect(response.body.err).toBe('Necesitas un token')
        expect(response.status).toBe(400)
    })
    test('with an invalid token', async() => {
        const response = await request(app).patch('/movies/1').set('access-token', 'token')
        expect(response.body.err).toBe('jwt malformed')
        expect(response.status).toBe(400)
    })
    test('with an invalid id', async() => {
        const response = await request(app).patch('/movies/f').set('access-token', token)
        expect(response.status).toBe(404)
        expect(response.body.err).toBe('Ingrese un movieId válido')
    })
    test('with a valid id', async() => {
        const response = await request(app).patch('/movies/4').set('access-token', token).send({ title: 'Las aventuras renovadas de Phineas y ferb en el espacio', creationDate: '10/19/2021', calification: 5 })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Movie/Serie updated')
        const movieFounded = await request(app).get('/movies/4').set('access-token', token)
        expect(movieFounded.body.title).toBe('Las aventuras renovadas de Phineas y ferb en el espacio')
        expect(movieFounded.body.calification).toBe(5)
        expect(movieFounded.body.characters.length).toBe(2)
    })
    test('with a valid id, changing characters and gender', async() => {
        const response = await request(app).patch('/movies/4').set('access-token', token).send({ title: 'Las aventuras renovadas de Phineas y ferb en el espacio con Micky Mouse', creationDate: '10/19/2021', calification: 5, genders: [1], characters: [1, 2, 3] })
        expect(response.status).toBe(200)
        expect(response.body.message).toBe('Movie/Serie updated')
        const movieFounded = await request(app).get('/movies?genre=1').set('access-token', token)
        console.log(movieFounded.body)
            // expect(movieFounded.body[0].title).toBe('Las aventuras renovadas de Phineas y ferb en el espacio con Micky Mouse')
            // expect(movieFounded.body[0].calification).toBe(5)
            // expect(movieFounded.body[0].characters.length).toBe(2)
    })
})