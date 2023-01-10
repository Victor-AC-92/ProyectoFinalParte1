const routeProducto = require('express').Router()
const routeCliente = require('express').Router()
routeCliente.use(express.json())
routeCliente.use(express.urlencoded({extended: true}))
routeProducto.use(express.json())
routeProducto.use(express.urlencoded({extended: true}))
const producto = new Producto()

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

module.exports = routeProducto
module.exports = routeCliente