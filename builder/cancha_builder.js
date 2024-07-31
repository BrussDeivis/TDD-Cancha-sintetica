// builders/product-builder.js
module.exports.Builder = {
    futbol: ({ canchaID = 11,nombreEncuentro = 'FIIS VS FIA', perfilReservador = 'Henry e iberson', hora = 100 } = {}) => ({
        canchaID,
        nombreEncuentro,
        perfilReservador,
        hora,
    }),

  reserva: ({
    canchaID = 15,
    nombreEncuentro = 'FIIS VS FIA',
    perfilReservador = 'Henry e Iberson',
    cantidadHoras = 2,
    montoAPagar = 50, // Puedes calcular esto en función de la cantidadHoras y costo por hora
    dni = '12345678',
    numeroCelular = '555-1234',
    estado = 'reservado',
  } = {}) => ({
    canchaID,
    nombreEncuentro,
    perfilReservador,
    cantidadHoras,
    montoAPagar,
    dni,
    numeroCelular,
    estado,
  }),
  }
  
