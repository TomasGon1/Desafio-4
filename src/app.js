const express = require("express");
const app = express();
const PUERTO = 8080;
const routerP = require("./routes/products.router.js");
const routerC = require("./routes/carts.router.js");
const exphbs = require("express-handlebars");
const socket = require("socket.io");
const routerV = require("./routes/views.router.js");

//Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./src/public"));

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

//Uso de rutas
app.use("/api/products", routerP);
app.use("/api/carts", routerC);
app.use("/", routerV);

const httpServer = app.listen(PUERTO, () => {
  console.log(`Escuchando en el puerto: ${PUERTO}`);
});

//Array products
const ProductManager = require("./controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

//Servidor
const io = socket(httpServer);

io.on("connection", async (socket) => {
  console.log("Cliente conectado");

  socket.emit("products", await productManager.getProducts());

  socket.on("deleteProduct", async (id) => {
    await productManager.deleteProductsById(id);

    io.sockets.emit("products", await productManager.getProducts());
  });

  socket.on("addProduct", async (product) => {
    await productManager.addProduct(product);

    io.sockets.emit("products", await productManager.getProducts());
  });
});
