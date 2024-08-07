const request = require('supertest')

const { app } = require('../server')
const { connect, getUri, closeDb } = require('../db')
const { Builder } = require('../builder/cancha_builder')

beforeAll(async () => {
  const uri = await getUri()
  await connect({ uri })
})

afterAll(async () => {
  await closeDb()
})

let reservas = [];

// aqui colocaremos las pruebas...
describe('ReservaCancha', () => {

    test('debe reservar una cancha', async () => {
      const reservaCancha = Builder.reserva();
      const response = await request(app)
        .post('/calendario/cancha/15/reservarCancha')
        .send(reservaCancha)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    
      const { _id, ...canchaStore } = response.body
  
      expect(canchaStore).toEqual(reservaCancha)
      expect(_id).toBeTruthy()
    });
});