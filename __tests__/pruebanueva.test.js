const request = require('supertest')

const { app } = require('../server')
const { Builder } = require('../builder/product-builder')
const { store } = require('../services/product-services')

jest.mock('../services/product-services.js')

beforeEach(() => {
  store.mockReset()
})

describe('POST /products', () => {
  test('should store a new product', async () => {
    // code...
  })

  test('should execute store function', async () => {
    const product = Builder.product()

      await request(app)
      .post('/products/services')
      .send(product)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)

      expect(store).toHaveBeenCalledWith(product)
  })
})
