const { time } = require('console')
const exp = require('constants')
const { Router } = require('express')
const express = require('express')
const fs = require('fs')
const app = express()
const routeProducto = express.Router()
const routeCarrito = express.Router()
const routeCliente = express.Router()


routeCliente.use(express.json())
routeCliente.use(express.urlencoded({extended: true}))
routeProducto.use(express.json())
routeProducto.use(express.urlencoded({extended: true}))
routeCarrito.use(express.json())
routeCarrito.use(express.urlencoded({extended: true}))

class Producto{
    constructor(id, timestamp, nombre, descripcion, codigo, urlFoto, precio, stock){
        this.id = id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = Number;
        this.urlFoto = urlFoto;
        this.codigo = codigo;
        this.stock = stock;
    }

    //Recibe un producto, lo guarda en el archivo, devuelve el id asignado
    save(nombre,descripcion,codigo,urlFoto,precio){
        fs.readFile('productos.txt', 'utf-8', (error, contenido) => {
            if (error){
                console.log(error);
            } else {
                let productos = JSON.parse(contenido)
                let id = 1
                productos.map(producto => {
                    if(producto.id != null){
                        id++
                    }                    
                })
                let timestamp = new Date().toLocaleString()
                let stock = 1
                productos.map(producto => {
                    if(producto.stock != null){
                        stock++
                    }                    
                })
                let productoPush = {id, timestamp, nombre, descripcion, codigo, urlFoto, precio, stock}
                productos.push(productoPush)
                fs.promises.writeFile('productos.txt', JSON.stringify(productos, ',', 2))
                    .then(() => console.log(`Producto guardado, su id es ${id}`))
                    .catch( error => console.log(error))
                }          
            });
    }

    //Recibe un id y devuelve el producto con ese id, o todos los productos si no se especifica.
    getById(id){
        fs.readFile('productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                if (id!=null) {
                    let productos = JSON.parse(contenido)
                    let productoBuscado = productos.find(producto => producto.id === id)
                    console.log(productoBuscado);
                } else {
                    console.log(JSON.parse(contenido));
                }
            }
        })
    }

    //Devuelve un array con los productos presentes en el archivo
    getAll(){
        fs.readFile('productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let productos = JSON.parse(contenido)
                console.log(`Estos son los productos disponibles: ${productos}`);
            }
        })
    }

    //Elimina del archivo el producto con el id buscado
    deleteById(id){
        fs.readFile('productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let productos = JSON.parse(contenido)
                let productoAEliminar = productos.find(producto => producto.id === id)
                productos.splice(productoAEliminar - 1);
                fs.promises.writeFile('productos.txt', JSON.stringify(productos, ',', 2))
                    .then(() => console.log(`Producto eliminado`))
                    .catch( error => console.log(error))
                }     
            }
        )
    }

    //Elimina todos los productos presentes en el archivo
    deleteAll(){
        fs.truncate('productos.txt', 0 , (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Archivo borrado exitosamente');
        }
    })
    } 
}

class Carrito{
    constructor(){
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

let productos = []
let carritos = []

let producto = new Producto()
let carrito = new Carrito()
//Configuracion PUG

app.set('views', './views')
app.set('view engine', 'pug')

routeCliente.get('/:id?', (req, res) => {
    let idProducto = parseInt(req.params.id)
    producto.getById(idProducto)
    res.send(`Producto/s encontrado/s: ${producto.getById(idProducto)}`)
})

routeProducto.post('/', (req, res) => {
    producto.save(req.body);
    res.send(`El producto "${req.body.nombre}" ha sido agregado al listado.`)
})

routeProducto.put('/:id', (req, res) =>{
    let idProducto = parseInt(req.params.id)
    let nuevoProducto = req.body
    let indiceProducto = productos.findIndex(producto => producto.id == idProducto)
    productos.splice(indiceProducto, 1)
    producto.save(nuevoProducto)
    nuevoProducto.id = idProducto
    
    res.send(`El producto ${idProducto} ha sido actualizado a ${nuevoProducto.nombre}`)
})

routeProducto.delete('/:id', (req, res) => {
    producto.deleteById(parseInt(req.params.id))
        
    res.json(productos)

    res.send(`El producto ${producto.id} ha sido eliminado.`)
})

routeCarrito.post('/', (req,res) =>{
    
})

app.use('/api/productos', routeCliente)
app.use('/api/productos', routeProducto)
app.use('/api/carrito', routeCarrito)

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
})
server.on('error', error => console.log(`Error en el servidor ${error}`))