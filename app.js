const express = require('express')

const { router } = require('./routes')

const app = express()

app.use(express.json())

app.use(router)

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });
  
module.exports.app = app
