const express = require('express')
const fs = require('fs')
const app = express()

class Producto{
    constructor(nombre, precio, urlFoto){
        this.id = id;
        this.timestamp = timestamp;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.urlFoto = urlFoto;
    }

    //Recibe un objeto, lo guarda en el archivo, devuelve el id asignado
    save(nombre,descripcion,codigo,urlFoto,precio){
        fs.readFile('productos.txt', 'utf-8', (error, contenido) => {
            if (error){
                console.log(error);
            } else {
                let objetos = JSON.parse(contenido);
                let id = 1;
                objetos.map(objeto => {
                    if(objeto.id != null){
                        id++
                    }                    
                });
                let stock = 1;
                objetos.map(objeto => {
                    if(objeto.stock != null){
                        stock++
                    }                    
                });
                let timestamp = new Date.now();
                let producto = new Producto(id, timestamp, nombre, descripcion, codigo, urlFoto, precio, stock);
                objetos.push(producto);
                fs.promises.writeFile('productos.txt', JSON.stringify(objetos, ',', 2))
                    .then(() => console.log(`Objeto guardado, su id es ${id}`))
                    .catch( error => console.log(error))
                }          
            });
    }

    //Recibe un id y devuelve el objeto con ese id, o todos los productos si no se especifica.
    getById(id){
        fs.readFile('productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let objetos = [JSON.parse(contenido)]
                let objetoBuscado = objetos.find(objeto => objeto.id === id)
                console.log(objetoBuscado);
            }
        })
    }

    //Devuelve un array con los objetos presentes en el archivo
    getAll(){
        fs.readFile('productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let objetos = JSON.parse(contenido)
                console.log(`Estos son los productos disponibles: ${objetos}`);
            }
        })
    }

    //Elimina del archivo el objeto con el id buscado
    deleteById(id){
        fs.readFile('Entregas/AntuñaContalVictor_ManejoDeArchivos/productos.txt', 'utf-8', (error, contenido) => {
            if (error) {
                console.log(error);
            } else {
                let objetos = [JSON.parse(contenido)]
                let objetoAEliminar = objetos.find(objeto => objeto.id === id)
                objetos.splice(objetoAEliminar - 1);
                fs.promises.writeFile('Entregas/AntuñaContalVictor_ManejoDeArchivos/productos.txt', JSON.stringify(objetos, ',', 2))
                    .then(() => console.log(`Objeto eliminado`))
                    .catch( error => console.log(error))
                }     
            }
        )
    }

    //Elimina todos los objetos presentes en el archivo
    deleteAll(){
        fs.truncate('Entregas/AntuñaContalVictor_ManejoDeArchivos/productos.txt', 0 , (error) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Archivo borrado exitosamente');
        }
    })
    } 
}

let productos = []

//Configuracion PUG
app.use(express.urlencoded({extended: true}))
app.set('views', './views')
app.set('view engine', 'pug')


app.post('/productos', (req, res) => {
    productos.push(req.body)
    console.log(productos);
    res.redirect('/productos')
})

app.get('/productos', (req, res) => {
    res.render('tabla', {productos})
})

app.get('/', (req, res) => {
    res.render('formulario', {productos})
})

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`El servidor esta escuchando en el puerto: ${server.address().port}`)
})
server.on('error', error => console.log(`Error en el servidor ${error}`))