const express = require('express')
const fs = require('fs')
routeCarrito = require('express').Router()
routeCarrito.use(express.json())
routeCarrito.use(express.urlencoded({extended: true}))
class Carrito{
    constructor(id, productosC){
        this.id = id;
        this.productosC = [];
    }

    create(){
        fs.readFile('carrito.txt', 'utf-8', (error, contenido) => {
            if (error){
                console.log(error);
            } else {
                let carritos = JSON.parse(contenido)
                let id = 1
                carritos.map(carro => {
                    if(carro.id != null){
                        id++
                    }                    
                })
                let timestampCarrito = new Date.now()
                let carritoNuevo = new Carrito(id, timestampCarrito, productosC)
                carritos.push(carritoNuevo)
                fs.promises.writeFile('carritos.txt', JSON.stringify(carritos, ',', 2))
                    .then(() => console.log(`Carrito guardado, su id es ${id}`))
                    .catch( error => console.log(error))
                }          
            });
    }

    delete(id){
        fs.readFile('carrito.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);                
            } else {
                let carritos = JSON.parse(contenido)
                let carroAEncontrar = carritos.find(carro => carro.id === id)
                carritos.splice(carroAEncontrar - 1)
                fs.promises.writeFile('carritos.txt', JSON.stringify(carritos, ',', 2))
                    .then(() => console.log(`Carrito eliminado`))
                    .catch( error => console.log(error))
                }
            }
        )
    }

    getProducts(id){
        fs.readFile('carrito.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);                
            } else {
                let carritos = JSON.parse(contenido)
                let carroAEncontrar = carritos.find(carro => carro.id === id)
                let productosCarrito = carroAEncontrar.productosC
                console.log(productosCarrito);
                }
            }
        )
    }
}

const carrito = new Carrito()

routeCarrito.post('/', (req, res) =>{
    carrito.create()
})

routeCarrito.delete('/:id', (req, res) => {

})

routeCarrito.get('/:id/productos', (req, res) => {

})

routeCarrito.post('/:id/productos', (req, res) => {

})

routeCarrito.delete('/:id/productos/:id_prod', (req, res) => {

})

module.exports = routeCarrito