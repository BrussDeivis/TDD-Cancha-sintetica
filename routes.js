const express = require('express')
const { store } = require('./services/product-services.js')
const router = express.Router()
let reservas = [];


router.post('/products/services', async (req, res) => {
  const { name, description, price } = req.body

  const _id = 'abc'

  await store({ name, description, price })

  res.status(201).json({
    name,
    description,
    price,
    _id,
  })
})

router.post('/products', (req, res) => {
  const { name, description, price } = req.body

  const _id = 'abc'

  res.status(201).json({
    name,
    description,
    price,
    _id,
  })
})



router.get('/api/calendario/cancha/1/semana-actual', (req, res) => {
  const semana = '2024-W29';  // Ejemplo de datos de la semana actual
  const reservas = [
    {
      canchaID : 1,
      nombreEncuentro: 'Partido de prueba',
      perfilReservador: 'Usuario de prueba',
      hora: '10:00',
      _id: 'abc',
    }
  ];  // Datos ficticios para la semana actual

  res.status(200).json(reservas);
})

/*
//cuando se quiere reservar una cancha
router.post('/calendario/cancha/3/reservar', (req, res) => {
  const { id } = req.params;
  const { nombreEncuentro, perfilReservador, hora } = req.body;

  const nuevaReserva = {
    canchaID: "11",
    nombreEncuentro,
    perfilReservador,
    hora,
    _id: 'abc',
  };

  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
});
*/

//Para cuando se quiere servar la misma cancha
router.post('/api/calendario/cancha/:id/reservar', (req, res) => {
  const { id } = req.params;
  const { nombreEncuentro, perfilReservador, hora } = req.body;

  // Verificar si la cancha ya está reservada en esa hora
  const reservaExistente = reservas.find(r => r.canchaID === id && r.hora === hora);
  if (reservaExistente) {
    return res.status(400).json({
      mensaje: 'Cancha ya reservada en esa hora',
      nombreEncuentro: reservaExistente.nombreEncuentro,
      perfilReservador: reservaExistente.perfilReservador,
      hora: reservaExistente.hora,
    });
  }

  const nuevaReserva = {
    canchaID: id,
    nombreEncuentro,
    perfilReservador,
    hora,
    _id: `reserva-${reservas.length + 1}`
  };

  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
});


//reservar cancha
router.post('/calendario/cancha/15/reservar', (req, res) => {
  const { id } = req.params;
  const {nombreEncuentro,perfilReservador,cantidadHoras,montoAPagar,dni,numeroCelular} = req.body;
  
  const nuevaReserva = {
    canchaID: 15,
    nombreEncuentro,
    perfilReservador, 
    dni,
    numeroCelular,
    cantidadHoras,
    montoAPagar,
    _id: 'abcd',
  };

  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
});




const canchas = [
  { id: 11, foto: 'foto1.jpg', foro: 100, costo: 50, estado: 'Disponible' },
  { id: 21, foto: 'foto2.jpg', foro: 150, costo: 70, estado: 'Ocupado' },
];

router.get('/canchas', (req, res) => {
  res.json(canchas);
});

router.get('/cancha/:id', (req, res) => {
  const canchaId = parseInt(req.params.id, 10);
  const cancha = canchas.find(c => c.id === canchaId);

  if (cancha) {
    res.json(cancha);
  } else {
    res.status(404).json({ error: 'Cancha no encontrada' });
  }
});


module.exports.router = router

