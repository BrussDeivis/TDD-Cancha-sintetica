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
  const reservaExistente = reservas.find(r => r.nombreEncuentro === nombreEncuentro && r.hora === hora);
  
    return res.status(400).json({
      mensaje: 'Cancha ya reservada en esa hora',
      nombreEncuentro: reservaExistente.nombreEncuentro,
      perfilReservador: reservaExistente.perfilReservador,
      hora: reservaExistente.hora,

  });
});



//reservar cancha
router.post('/calendario/cancha/:id/reservarCancha', (req, res) => {
  const { id } = req.params;
  const {nombreEncuentro,perfilReservador,cantidadHoras,montoAPagar,dni,numeroCelular, estado, hora, fecha, cantidadJugadores} = req.body;
  
  const nuevaReserva = {
    canchaID: 15,
    nombreEncuentro,
    perfilReservador, 
    dni,
    numeroCelular,
    cantidadHoras,
    hora,
    montoAPagar,
    estado,
    fecha,
    cantidadJugadores,
    _id: `reserva-${reservas.length + 1}`
  };

  reservas.push(nuevaReserva);
  res.status(201).json(nuevaReserva);
});








function parseTime(timeStr) {
  const [time, modifier] = timeStr.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (modifier === 'pm' && hours < 12) {
      hours += 12;
  }
  if (modifier === 'am' && hours === 12) {
      hours = 0;
  }

  return hours * 60 + minutes;
}

router.put('/calendario/cancha/:id/reservarCanchaParticion', (req, res) => {
  const { id } = req.params;
  const { hora } = req.body;

  const nuevaHora = parseTime(hora);

  // Definir los límites de las participaciones válidas
  const inicioHoraValida = parseTime("6:00 am");
  const finHoraValida = parseTime("11:00 pm");

  // Verificar si la hora está fuera del rango válido
  if (nuevaHora < inicioHoraValida || nuevaHora > finHoraValida) {
      return res.status(404).json({ error: 'Partición no valida' });
  }

  /*const reserva = reservas.find(r => r._id === id && parseTime(r.hora) <= nuevaHora);

  if (reserva) {
      return res.status(404).json({ error: 'Partición no valida' });
  }*/

  res.status(200).json({ message: 'Partición Valida' });
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


router.put('/calendario/cancha/:id/ReporgramarReserva', (req, res) => {
  const { id } = req.params;
  const { nuevaHora, nuevaCanchaID, accion } = req.body; // accion puede ser 'reprogramar' o 'cancelar'
  
  const reserva = reservas.find(r => r._id === id)
  
  if (!reserva) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  
    // Validar que la nueva hora y cancha no estén ocupadas
    const conflicto = reservas.find(r => r.cantidadHoras === nuevaHora && r.canchaID === nuevaCanchaID);
    
    if (conflicto) {
      return res.status(400).json({ error: 'La cancha ya está reservada en esa hora' });
    }
    
    // Actualizar reserva con nueva hora y/o cancha
    reserva.cantidadHoras = nuevaHora 
    reserva.canchaID = nuevaCanchaID 
    
    // Calcular costo adicional (ejemplo simple)
    reserva.montoAPagar = 20; // Puedes cambiar la lógica de costo adicional según sea necesario
    
  
  
  res.status(200).json(reserva);
});



router.put('/calendario/cancha/:id/cancelarReserva', (req, res) => {
  const { id } = req.params;
  const {accion } = req.body; // accion puede ser 'reprogramar' o 'cancelar'
  const reserva = reservas.find(r => r._id === id)
  if (!reserva) {
    return res.status(404).json({ error: 'Reserva no encontrada' });
  }
  
    // Eliminar la reserva del array
    reserva.estado = "cancelado";
 
  res.status(200).json(reserva);
});



function diferenciaHoras(fecha1, fecha2) {
  const diffMs = fecha2 - fecha1;
  return diffMs / (1000 * 60 * 60);
}

router.delete('/calendario/cancha/:id/cancelarReserva', (req, res) => {
  const { id } = req.params;
  const reserva = reservas.find(r => r._id === id);

  if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  const ahora = new Date();
  const fechaReserva = new Date(reserva.fecha);

  const horasDeAntelacion = diferenciaHoras(ahora, fechaReserva);

  if (horasDeAntelacion < 24) {
      return res.status(400).json({ error: 'La cancelación debe hacerse con al menos 24 horas de antelación' });
  }

  reservas.splice(reservas.indexOf(reserva), 1);

  res.status(200).json({ message: 'Reserva cancelada correctamente' });
});



function verificarDisponibilidad(hora) {
  return !reservas.some(reserva => reserva.hora === hora);
}

router.put('/calendario/cancha/:id/modificarReserva', (req, res) => {
  const { id } = req.params;
  const { nuevaHora } = req.body;
  const reserva = reservas.find(r => r._id === id);

  if (!reserva) {
      return res.status(404).json({ error: 'Reserva no encontrada' });
  }

  if (!verificarDisponibilidad(nuevaHora)) {
      return res.status(400).json({ error: 'La pista no está disponible para la nueva hora solicitada' });
  }

  // Modificar la reserva
  reserva.hora = nuevaHora;

  res.status(200).json({ message: 'Reserva modificada correctamente', reserva });
});







const LIMITE_FECHA = new Date('2024-11-30'); // Ajusta el año según sea necesario

// Función para verificar si la fecha está dentro del rango permitido
function verificarFecha(fecha) {
    const fechaReserva = new Date(fecha);
    return fechaReserva <= LIMITE_FECHA;
}

router.post('/calendario/cancha/reservarCancha', (req, res) => {
    const { fecha } = req.body;

    if (!verificarFecha(fecha)) {
        return res.status(400).json({ error: 'Fecha fuera del rango permitido' });
    }

    // Procesar la reserva (aquí iría tu lógica para agregar la reserva a la base de datos)
    const nuevaReserva = { ...req.body, _id: reservas.length + 1 };
    reservas.push(nuevaReserva);

    res.status(201).json({ message: 'Reserva creada correctamente', reserva: nuevaReserva });
});





const MIN_JUGADORES = 4;
// Función para verificar si la cantidad de jugadores es suficiente
function verificarCantidadJugadores(cantidad) {
    return cantidad >= MIN_JUGADORES;
}

router.post('/calendario/cancha/reservarCanchaLimiteCantidad', (req, res) => {
    const { cantidadJugadores } = req.body;

    if (!verificarCantidadJugadores(cantidadJugadores)) {
        return res.status(400).json({ error: 'Cantidad de jugadores insuficiente' });
    }

    // Procesar la reserva (aquí iría tu lógica para agregar la reserva a la base de datos)
    const nuevaReserva = { ...req.body, _id: reservas.length + 1 };
    reservas.push(nuevaReserva);

    res.status(201).json({ message: 'Reserva creada correctamente', reserva: nuevaReserva });
});



router.post('/calendario/cancha/1/CumplenCondiciones', (req, res) => {
  const { id } = req.params;
  const { usuarioLogueado, canchaSeleccionada, metodoPagoSeleccionado } = req.body;

  if (!usuarioLogueado) {
      return res.status(401).json({ error: 'Debe iniciar sesión para continuar' });
  }

  if (!canchaSeleccionada) {
      return res.status(400).json({ error: 'Debe seleccionar una cancha antes de proceder al pago' });
  }

  if (!metodoPagoSeleccionado) {
      return res.status(400).json({ error: 'Debe seleccionar un método de pago' });
  }

  // Aquí se realiza el proceso de pago y confirmación de la reserva
  res.status(200).json({ message: 'Pago realizado y reserva confirmada' });
});


module.exports.router = router

