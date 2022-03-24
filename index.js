const express = require('express')
const mongoose = require('mongoose')
const { Server } = require('socket.io')
const path = require('path');
const http = require('http')
const { engine } = require('express-handlebars');
const productsRouter = require("./routes/products")
const cartRouter = require('./routes/cart');
const authMiddleware = require('./middlewares/getAuth')
const { HOSTNAME, SCHEMA, DATABASE, DBPORT} = require('./config')


const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT | 8080
const io = new Server(server)

// Connect to LOCAL :  `${SCHEMA}://${HOSTNAME}:${DBPORT}/${DATABASE}`
// Connect to CLOUD : "mongodb+srv://<your username>:<you pass>@<your hosting>"/<your database>?retryWrites=true&w=majority"
mongoose.connect(`${SCHEMA}://${HOSTNAME}:${DBPORT}/${DATABASE}`).then(() => {
  console.log('connected to mongo')
}).catch((e) => console.log('error on mongo', e))

const user ={}

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.engine('handlebars', engine({
  layoutsDir: path.join(__dirname, './views'),
  defaultLayout: 'index'
}));

app.set('view engine', 'handlebars')
app.use("/static", express.static(path.join(__dirname, 'public')))

app.use("/api/productos", authMiddleware, productsRouter);
app.use("/api/carrito", authMiddleware, cartRouter);

app.get("/", (req, res) => {
  res.render(path.join(__dirname, './views/index.handlebars'))
});

app.use(function(req,res){
  res.status(404).send({error:-2, descripcion:'la ruta solicitada o el metodo no se encuentra implementado'})
})
  
io.on("connection", (socket) => {
  console.log(`Nuevo usuario conectado: ${socket.id}`)

  io.sockets.emit('index', null)

  socket.on('reload', ()=> {
    io.sockets.emit('refresh')
  })

  socket.on('new-User', (email) => {
    user.email = email
    user.id = socket.id
    user.admin = false
    io.sockets.emit('user', user)
  })
 
  socket.on('select-btns', () =>{
    socket.emit('selected-btns', null)
  })


})

server.listen(PORT, () => console.log(`listening on port: ${PORT}`))