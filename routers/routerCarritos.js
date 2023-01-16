const express = require('express')
const fs = require('fs')
const routeCarrito = express.Router()
routeCarrito.use(express.json())
routeCarrito.use(express.urlencoded({extended: true}))

class Carrito{
    constructor(id, timestampCarrito){
        this.id = id;
        this.timestampCarrito = timestampCarrito;
        this.productosC = [];
    }

    create(){
        fs.readFile('./arrays/carritos.txt', 'utf-8', (error, contenido) => {
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
                let timestampCarrito = new Date().toLocaleString()
                let carritoNuevo = new Carrito(id, timestampCarrito)
                carritos.push(carritoNuevo)
                fs.promises.writeFile('./arrays/carritos.txt', JSON.stringify(carritos, ',', 2))
                    .then(() => console.log(`Carrito creado, su id es ${id}`))
                    .catch( error => console.log(error))
                }          
            });
    }

    delete(idCarrito){
        fs.readFile('./arrays/carritos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);                
            } else {
                let carritos = JSON.parse(contenido)
                let carroAEncontrar = carritos.find(({id}) => id == idCarrito)
                carritos.splice(carritos.indexOf(carroAEncontrar))
                fs.promises.writeFile('./arrays/carritos.txt', JSON.stringify(carritos, ',', 2))
                    .then(() => console.log(`Carrito eliminado`))
                    .catch( error => console.log(error))
                }
            }
        )
    }

    getProducts(idCarrito){
        fs.readFile('./arrays/carritos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);                
            } else {
                let carritos = JSON.parse(contenido)
                let carroAEncontrar = carritos.find(({id}) => id == idCarrito)
                let productosCarrito = carroAEncontrar.productosC
                return productosCarrito
                }
            }
        )
    }

    deleteProduct(idCarrito, idProductoAEliminar){
        fs.readFile('./arrays/carritos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);                
            } else {
                let carritos = JSON.parse(contenido)
                let carroAEncontrar = carritos.find(({id}) => id == idCarrito)
                let productosCarrito = carroAEncontrar.productosC
                let prodAEliminar = productosCarrito.find(({id}) => id == idProductoAEliminar)
                productosCarrito.splice(productosCarrito.indexOf(prodAEliminar), 1)
                fs.promises.writeFile('./arrays/carritos.txt', JSON.stringify(carritos, ',', 2))
                    .then(() => console.log(`Producto eliminado del carrito ${idCarrito}`))
                    .catch( error => console.log(error))
                }
            }
        )
    }
}

let carritos = []
const carrito = new Carrito()

routeCarrito.post('/', (req, res) =>{
    carrito.create()
    res.send('Carrito creado')
})

routeCarrito.delete('/:id', (req, res) => {
    let idCarrito = req.params.id
    carrito.delete(idCarrito)
    res.send(`Carrito ${idCarrito} eliminado`)
})

routeCarrito.get('/:id/productos', (req, res) => {
    let idCarrito = req.params.id
    res.send(carrito.getProducts(idCarrito))
})

routeCarrito.post('/:id/productos/:id_prod', (req, res) => {
    let idCarrito = req.params.id
    let idProductoBuscado = req.params.id_prod
    
    fs.readFile('./arrays/productos.txt', 'utf-8', (error, contenido) => {
        if (error) {
            console.log(error);
        } else {
            let productosArray = JSON.parse(contenido)
            let productoBuscado = productosArray.find(({id}) => id == idProductoBuscado)
            fs.readFile('./arrays/carritos.txt', 'utf-8', (error, data) =>{
                if (error) {
                    (console.log(error))
                } else {
                    let carritos = JSON.parse(data)
                    let carritoDestino = carritos.find(({id}) => id == idCarrito)
                    let productosCarrito = carritoDestino.productosC
                    productosCarrito.push(JSON.stringify(productoBuscado))
                    console.log(carritos);
                    fs.promises.writeFile('./arrays/carritos.txt', JSON.stringify(carritos, ',', 2))
                        .then(() => console.log(`${productoBuscado.nombre} agregado al carrito ${idCarrito}`))
                        .catch( error => console.log(error))
                }
            })
        }
    }) 
})

routeCarrito.delete('/:id/productos/:id_prod', (req, res) => {
    let idCarrito = req.params.id
    let idProductoAEliminar = req.params.id_prod
    carrito.deleteProduct(idCarrito, idProductoAEliminar)    
})

module.exports = routeCarrito;