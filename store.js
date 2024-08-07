const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
  name: String,
  description: String,
  price: String,
})

const Product = mongoose.model('products', productSchema)

module.exports.store = async ({ name, description, price }) => {
  const product = new Product({
    name,
    description,
    price,
  })
  await product.save()
  return product
}



const canchaSchema = mongoose.Schema({
  canchaID : String,
  nombreEncuentro :String,
  perfilReservador : String,
  cantidadHoras : String,
  hora : String,
  montoAPagar : String, // Puedes calcular esto en función de la cantidadHoras y costo por hora
  dni : String,
  numeroCelular : String,
  estado : String,
})

const Cancha = mongoose.model('products', canchaSchema)

module.exports.store = async ({canchaID, nombreEncuentro,perfilReservador,cantidadHoras,montoAPagar,dni,numeroCelular, estado, hora }) => {
  const cancha = new Cancha({
    canchaID,
    nombreEncuentro,
    perfilReservador,
    cantidadHoras,
    hora,
    montoAPagar,
    dni,
    numeroCelular,
    estado,
  })
  await cancha.save()
  return cancha
}
