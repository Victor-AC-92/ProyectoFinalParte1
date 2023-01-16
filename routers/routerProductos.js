const express = require('express')
const fs = require('fs')
const routeProducto = express.Router()
routeProducto.use(express.json())
routeProducto.use(express.urlencoded({extended: true}))

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
    save(productoNuevo){
        fs.readFile('./arrays/productos.txt', 'utf-8', (error, contenido) => {
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
                let prodStockPrevio = productos.findLast(({nombre}) => nombre == productoNuevo.nombre)
                if(prodStockPrevio != undefined){
                    prodStockPrevio.stock++
                    fs.promises.writeFile('./arrays/productos.txt', JSON.stringify(productos, ',', 2))
                    .then(() => console.log(`Producto guardado, su id es ${prodStockPrevio.id}`))
                    .catch( error => console.log(error))
                    return
                }else{
                    stock = 1
                }                
                
                let productoPush = {id, timestamp, ...productoNuevo, stock}
                productos.push(productoPush)
                fs.promises.writeFile('./arrays/productos.txt', JSON.stringify(productos, ',', 2))
                    .then(() => console.log(`Producto guardado, su id es ${id}`))
                    .catch( error => console.log(error))
                }          
            });
    }

    //Recibe un id y devuelve el producto con ese id, o todos los productos si no se especifica.
    getById(idProducto){
        fs.readFile('./arrays/productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let productos = JSON.parse(contenido)
                let productoBuscado = productos.find(({id}) => id == idProducto)
                console.log(productoBuscado);
                return productoBuscado              
            }
        })
    }

    //Devuelve un array con los productos presentes en el archivo
    getAll(){
        fs.readFile('./arrays/productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let productos = contenido
                console.log(`Estos son los productos disponibles: ${productos}`);
            }
        })
    }

    update(idProducto, nuevoProducto){
        fs.readFile('./arrays/productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let productos = JSON.parse(contenido)
                let prodParaActualizar = productos.find(({id}) => id == idProducto)
                let prodActualizado = {...prodParaActualizar, ...nuevoProducto}
                productos.splice(productos.indexOf(prodParaActualizar), 1)
                productos.push(prodActualizado)
                fs.promises.writeFile('./arrays/productos.txt', JSON.stringify(productos, ',', 2))
                    .then(() => console.log(`Producto actualizado`))
                    .catch( error => console.log(error))
            }
        })
    }

    //Elimina del archivo el producto con el id buscado
    deleteById(idProducto){
        fs.readFile('./arrays/productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let productos = JSON.parse(contenido)
                let productoAEliminar = productos.find(({id}) => id == idProducto)
                productos.splice(productos.indexOf(productoAEliminar));
                fs.promises.writeFile('./arrays/productos.txt', JSON.stringify(productos, ',', 2))
                    .then(() => console.log(`Producto eliminado`))
                    .catch( error => console.log(error))
                }     
            }
        )
    }

    //Elimina todos los productos presentes en el archivo
    deleteAll(){
        fs.truncate('./arrays/productos.txt', 0 , (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Archivo borrado exitosamente');
        }
    })
    } 
};

let productos = [];
const producto = new Producto();

routeProducto.get('/:id?', (req, res) => {
    let idProducto = parseInt(req.params.id)
    console.log(idProducto);
    if(isNaN(idProducto)){
        producto.getAll()
    } else {
        producto.getById(idProducto)
    }
});

routeProducto.post('/', (req, res) => {
    let productoNuevo = req.body
    producto.save(productoNuevo)
    res.send(`El producto "${req.body.nombre}" ha sido agregado al listado.`)
});

routeProducto.put('/:id', (req, res) =>{
    let idProducto = parseInt(req.params.id)
    let nuevoProducto = req.body
    producto.update(idProducto, nuevoProducto)
    res.send(`El producto ${idProducto} ha sido actualizado a ${nuevoProducto.nombre}`)
});

routeProducto.delete('/:id', (req, res) => {
    let idProducto = parseInt(req.params.id)
    res.send(`El producto ${req.params.id} ha sido eliminado.`)
    producto.deleteById(idProducto)    
});

module.exports = routeProducto;