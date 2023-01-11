const express = require('express')
const fs = require('fs')
const routeCarrito = express.Router()
routeCarrito.use(express.json())
routeCarrito.use(express.urlencoded({extended: true}))
class Carrito{
    constructor(id, productosC){
        this.id = id;
        this.productosC = [];
    }

    create(){
        fs.readFile('./arrays/carrito.txt', 'utf-8', (error, contenido) => {
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
        fs.readFile('./arrays/carrito.txt', 'utf-8', (error, contenido) => {
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
        fs.readFile('./arrays/carrito.txt', 'utf-8', (error, contenido) => {
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

    deleteProduct(idCarrito, idProductoAEliminar){
        fs.readFile('./arrays/carrito.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);                
            } else {
                let carritos = JSON.parse(contenido)
                let carroAEncontrar = carritos.find(carro => carro.id === id)
                let productosCarrito = carroAEncontrar.productosC
                let prodAEliminar = productosCarrito.find(producto => producto.id === idProductoAEliminar)
                productosCarrito.splice(prodAEliminar - 1)
                fs.promises.writeFile('carritos.txt', JSON.stringify(carritos, ',', 2))
                    .then(() => console.log(`Producto eliminado del carrito ${idCarrito}`))
                    .catch( error => console.log(error))
                console.log(productosCarrito);
                }
            }
        )
    }
}

let carritos = []
const carrito = new Carrito()

routeCarrito.post('/', (req, res) =>{
    carrito.create()
})

routeCarrito.delete('/:id', (req, res) => {
    let idCarrito = req.params.id
    carrito.delete(idCarrito)
})

routeCarrito.get('/:id/productos', (req, res) => {
    let idCarrito = req.params.id
    carrito.getProducts(idCarrito)
})

routeCarrito.post('/:id/productos/:id_prod', (req, res) => {
    let idCarrito = req.params.id
    let idProductoBuscado = req.params.id_prod
    fs.readFile('./arrays/productos.txt', 'utf-8', (error, contenido) => {
        if (error) {
            console.log(error);
        } else {
            let productosArray = JSON.parse(contenido)
            let productoBuscado = productosArray.find(producto => producto.id === idProductoBuscado)
            return productoBuscado
        }
    })

    carrito.getProducts(idCarrito)
    productosCarrito.push(productoBuscado)
    fs.promises.writeFile('carritos.txt', JSON.stringify(carritos, ',', 2))
                    .then(() => console.log(`Producto eliminado del carrito ${idCarrito}`))
                    .catch( error => console.log(error))
                console.log(productosCarrito);
})

routeCarrito.delete('/:id/productos/:id_prod', (req, res) => {
    let idCarrito = req.params.id
    let idProductoAEliminar = req.params.id_prod
    carrito.deleteProduct(idCarrito, idProductoAEliminar)    
})

module.exports = routeCarrito;