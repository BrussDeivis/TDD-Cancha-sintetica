const request = require('supertest')

const { app } = require('../server')
const { Builder } = require('../builder/cancha_builder')


let reservas = [];


    //valores límite reserva hora
    describe('Calendario de la Cancha', () => {
        test.each([
            ["5:59 am", 'Partición no valida', 404],
            ["6:00 am", 'Reserva reprogramada correctamente', 200],
            ["11:00 pm", 'Reserva reprogramada correctamente', 200],
            ["11:01 pm", 'Partición no valida', 404],
            ["4:59 am", 'Partición no valida', 404],
        ])('debe verificar la participación para la hora %s y devolver el mensaje %s', async (hora, expectedMessage, expectedStatus) => {
            const reservaCancha = Builder.reserva({ hora: "5:00 am" });
        
         
            const response1 = await request(app)
                .post('/calendario/cancha/15/reservarCancha')
                .send(reservaCancha)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
        
            const reservaId = response1.body._id;
        
            
            const response2 = await request(app)
                .put(`/calendario/cancha/${reservaId}/reservarCanchaParticion`)
                .send({ hora })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(expectedStatus);
        
            if (expectedStatus === 404) {
                expect(response2.body).toEqual({
                    error: 'Partición no valida'
                });
            } else {
                expect(response2.body).toEqual({
                    message: 'Partición Valida' 
                });
            }
        });


        test('debe cancelar una reserva con más de 24 horas de antelación sin penalizaciones (48 horas)', async () => {
            const reserva = Builder.reserva({ fecha: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString() }); 
            const response1 = await request(app)
                .post('/calendario/cancha/15/reservarCancha')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
    
            const reservaId = response1.body._id;
    
   
            const response2 = await request(app)
                .delete(`/calendario/cancha/${reservaId}/cancelarReserva`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
    
            expect(response2.body).toEqual({
                message: 'Reserva cancelada correctamente'
            });
        });
    
        test('debe rechazar la cancelación de una reserva con menos de 24 horas de antelación (20 horas)', async () => {
            const reserva = Builder.reserva({ fecha: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString() }); 
            const response1 = await request(app)
                .post('/calendario/cancha/15/reservarCancha')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
    
            const reservaId = response1.body._id;
    
            const response2 = await request(app)
                .delete(`/calendario/cancha/${reservaId}/cancelarReserva`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response2.body).toEqual({
                error: 'La cancelación debe hacerse con al menos 24 horas de antelación'
            });
        });

        test('debe rechazar la cancelación de una reserva con menos de 24 horas de antelación (20 horas)', async () => {
            const reserva = Builder.reserva({ fecha: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString() }); 
            const response1 = await request(app)
                .post('/calendario/cancha/15/reservarCancha')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
    
            const reservaId = 11;
    
            const response2 = await request(app)
                .delete(`/calendario/cancha/${reservaId}/cancelarReserva`)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404);
    
            expect(response2.body).toEqual({
                error: 'Reserva no encontrada'
            });
        });



        test('debe modificar una reserva si la nueva hora está disponible', async () => {
            const reserva = Builder.reserva({ hora: "17:00" }); // Reserva a las 5:00 PM
    
            // Crear una reserva inicial
            const response1 = await request(app)
                .post('/calendario/cancha/15/reservarCancha')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
    
            const reservaId = response1.body._id;
    
            // Modificar la reserva a las 6:00 PM
            const response2 = await request(app)
                .put(`/calendario/cancha/${reservaId}/modificarReserva`)
                .send({ nuevaHora: "18:00" }) // Nueva hora a las 6:00 PM
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
    
            expect(response2.body).toEqual({
                message: 'Reserva modificada correctamente',
                reserva: expect.objectContaining({
                    _id: reservaId,
                    hora: "18:00"
                })
            });
        });
    
        test('debe rechazar la modificación de una reserva si la nueva hora no está disponible', async () => {
           
            const reserva2 = Builder.reserva({ hora: "18:00" }); // Segunda reserva a las 6:00 PM
    
            // Crear una segunda reserva
            const response1 = await request(app)
                .post('/calendario/cancha/15/reservarCancha')
                .send(reserva2)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
    
            const reservaId = response1.body._id;
    
            // Intentar modificar la primera reserva a las 6:00 PM
            const response2 = await request(app)
                .put(`/calendario/cancha/${reservaId}/modificarReserva`)
                .send({ nuevaHora: "18:00" }) // Nueva hora a las 6:00 PM
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response2.body).toEqual({
                error: 'La pista no está disponible para la nueva hora solicitada'
            });
        });





        test('debe permitir la reserva en el límite superior del 30 de noviembre', async () => {
            const reserva = Builder.reserva({ fecha: "2024-11-30" }); // Fecha en el límite superior
    
            const response = await request(app)
                .post('/calendario/cancha/reservarCancha')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
    
            expect(response.body).toEqual({
                message: 'Reserva creada correctamente',
                reserva: expect.objectContaining({
                    fecha: "2024-11-30"
                })
            });
        });
    
        test('debe rechazar la reserva fuera del límite el 1 de diciembre', async () => {
            const reserva = Builder.reserva({ fecha: "2024-12-01" }); // Fecha fuera del límite
    
            const response = await request(app)
                .post('/calendario/cancha/reservarCancha')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toEqual({
                error: 'Fecha fuera del rango permitido'
            });
        });
    });


    describe('Ingreso de Cantidad de Jugadores', () => {
        test('debe permitir la reserva con el número exacto de jugadores en el límite', async () => {
            const reserva = Builder.reserva({ cantidadJugadores: 4 }); // Número exacto de jugadores en el límite
    
            const response = await request(app)
                .post('/calendario/cancha/reservarCanchaLimiteCantidad')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201);
    
            expect(response.body).toEqual({
                message: 'Reserva creada correctamente',
                reserva: expect.objectContaining({
                    cantidadJugadores: 4
                })
            });
        });
    
        test('debe rechazar la reserva con menos del número mínimo de jugadores', async () => {
            const reserva = Builder.reserva({ cantidadJugadores: 3 }); // Número de jugadores fuera del límite
    
            const response = await request(app)
                .post('/calendario/cancha/reservarCanchaLimiteCantidad')
                .send(reserva)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toEqual({
                error: 'Cantidad de jugadores insuficiente'
            });
        });
    });



    describe('Realización de Pago', () => {
        test('debe permitir el pago total y confirmar reserva si todas las condiciones se cumplen', async () => {
            const response = await request(app)
                .post('/calendario/cancha/1/CumplenCondiciones')
                .send({
                    usuarioLogueado: true,
                    canchaSeleccionada: true,
                    metodoPagoSeleccionado: true,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200);
    
            expect(response.body).toEqual({
                message: 'Pago realizado y reserva confirmada'
            });
        });
    
        test('debe solicitar inicio de sesión si el usuario no está logueado', async () => {
            const response = await request(app)
                .post('/calendario/cancha/1/CumplenCondiciones')
                .send({
                    usuarioLogueado: false,
                    canchaSeleccionada: true,
                    metodoPagoSeleccionado: true,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(401);
    
            expect(response.body).toEqual({
                error: 'Debe iniciar sesión para continuar'
            });
        });
    
        test('debe solicitar selección de cancha si no hay cancha seleccionada', async () => {
            const response = await request(app)
                .post('/calendario/cancha/1/CumplenCondiciones')
                .send({
                    usuarioLogueado: true,
                    canchaSeleccionada: false,
                    metodoPagoSeleccionado: true,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toEqual({
                error: 'Debe seleccionar una cancha antes de proceder al pago'
            });
        });
    

        test('debe solicitar selección de método de pago si no hay método de pago seleccionado', async () => {
            const response = await request(app)
                .post('/calendario/cancha/1/CumplenCondiciones')
                .send({
                    usuarioLogueado: true,
                    canchaSeleccionada: true,
                    metodoPagoSeleccionado: false,
                })
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400);
    
            expect(response.body).toEqual({
                error: 'Debe seleccionar un método de pago'
            });
        });
    });