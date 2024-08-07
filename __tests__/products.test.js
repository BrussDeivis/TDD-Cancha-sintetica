const request = require('supertest')

const { app } = require('../server')
const { connect, getUri, closeDb } = require('../db')
const { Builder } = require('../builder/product-builder.js')

beforeAll(async () => {
  const uri = await getUri()
  await connect({ uri })
})

afterAll(async () => {
  await closeDb()
})

describe('POST /products', () => {
  test('should store a new product', async () => {
    const product = Builder.product()
  
    const response = await request(app)
      .post('/products')
      .send(product)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
  
    const { _id, ...productStored } = response.body
  
    expect(productStored).toEqual(product)
    expect(_id).toBeTruthy()
  })
})
