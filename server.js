const { time } = require('console')
const exp = require('constants')
const { Router } = require('express')
const express = require('express')
const fs = require('fs')
const app = express()

let productos = []
let carritos = []

//Configuracion PUG
app.set('views', './views')
app.set('view engine', 'pug')


app.use('/api/productos', routeCliente)
app.use('/api/productos', routeProducto)
app.use('/api/carrito', routeCarrito)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
})
server.on('error', error => console.log(`Error en el servidor ${error}`))