const request = require('supertest')

const { app } = require('../server')
const { Builder } = require('../builder/cancha_builder')


let reservas = [];

// aqui colocaremos las pruebas...
describe('Calendario de la Cancha', () => {

    test('debe mostrar todas las reservas hechas en la semana actual', async () => {
    const response = await request(app)
    .get('/api/calendario/cancha/1/semana-actual')
    .set('Accept', 'application/json')
    .expect('Content-Type', /json/)
    .expect(200);

    expect(response.body).toEqual(expect.any(Array));
    })
    

    test('debe reservar una cancha', async () => {
      const reservaCancha = Builder.reserva();
      const response = await request(app)
        .post('/calendario/cancha/15/reservarCancha')
        .send(reservaCancha)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    
      expect(response.body).toEqual({
        canchaID: reservaCancha.canchaID,
        nombreEncuentro: reservaCancha.nombreEncuentro,
        perfilReservador: reservaCancha.perfilReservador,
        dni: reservaCancha.dni,
        numeroCelular: reservaCancha.numeroCelular,
        cantidadHoras: reservaCancha.cantidadHoras,
        montoAPagar: reservaCancha.montoAPagar,
        estado : reservaCancha.estado,
        _id: expect.any(String),
      });
    });

    test('Cuando se quiere reservar la misma cancha', async () => {
      const reservaCancha = Builder.futbol();
    // Realizar la primera reserva
      const response1 = await request(app)
      .post('/api/calendario/cancha/8/reservar')
      .send(reservaCancha)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);
      expect(response1.body).toEqual({
        canchaID: '8',
        nombreEncuentro: reservaCancha.nombreEncuentro,
        perfilReservador: reservaCancha.perfilReservador,
        hora: reservaCancha.hora,
      _id: expect.any(String),
      })

    // Intentar reservar la misma cancha y hora nuevamente
       const response2 = await request(app)
      .post('/api/calendario/cancha/8/reservar')
      .send(reservaCancha)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

      expect(response2.body).toEqual({
      mensaje: 'Cancha ya reservada en esa hora',
      nombreEncuentro: reservaCancha.nombreEncuentro,
      perfilReservador: reservaCancha.perfilReservador,
      hora: reservaCancha.hora,
    });
    });


    test('debe reprogramar una reserva', async () => {
      const reservaCancha = Builder.reserva();
    
      // Crear una reserva inicial
      const response1 = await request(app)
        .post('/calendario/cancha/15/reservarCancha')
        .send(reservaCancha)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    
      const reservaId = response1.body._id;
    
      // Reprogramar la reserva
      const response2 = await request(app)
        .put(`/calendario/cancha/${reservaId}/ReporgramarReserva`)
        .send({ nuevaHora: 200, nuevaCanchaID: 9, accion: 'reprogramar' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    
      expect(response2.body).toEqual({
        ...response1.body,
        canchaID: 9,
        cantidadHoras: 200,
        montoAPagar: 20,
     // Verifica el costo adicional si es necesario
      });
    });


    test('debe cancelar una reserva', async () => {
      const reservaCancha = Builder.reserva();
    
      // Crear una reserva inicial
      const response1 = await request(app)
        .post('/calendario/cancha/16/reservarCancha')
        .send(reservaCancha)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201);
    
      const reservaId = response1.body._id;
    
      // Cancelar la reserva
      const response2 = await request(app)
        .put(`/calendario/cancha/${reservaId}/cancelarReserva`)
        .send({ accion: 'cancelar' })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200);
    
      expect(response2.body).toEqual({
        ...response1.body,
        estado : "cancelado",
      });
      
    });

  })
  

  describe('Listado de Canchas', () => {
    test('debe mostrar el listado de canchas con sus detalles', async () => {
      const response = await request(app)
        .get('/canchas')
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(response.body).toEqual([
        { id: 11, foto: 'foto1.jpg', foro: 100, costo: 50, estado: 'Disponible' },
        { id: 21, foto: 'foto2.jpg', foro: 150, costo: 70, estado: 'Ocupado' }
      ]);
    });
  

    test('debe mostrar los detalles de una cancha específica', async () => {
      const response = await request(app)
        .get('/cancha/11')
        .expect('Content-Type', /json/)
        .expect(200);
  
      expect(response.body).toEqual({
        id: 11, foto: 'foto1.jpg', foro: 100, costo: 50, estado: 'Disponible'
      });
    });
  
    test('debe retornar un 404 si la cancha no existe', async () => {
      const response = await request(app)
        .get('/cancha/999')
        .expect(404);
  
        expect(response.body).toEqual({ error: 'Cancha no encontrada' });
    });



  });