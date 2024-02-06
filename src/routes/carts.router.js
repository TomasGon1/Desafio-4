const express = require("express");
const router = express.Router();

const CartManager = require("../controllers/CartManager.js");
const cartManager = new CartManager("./src/models/carts.json");

//Creo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.json(newCart);
  } catch (error) {
    console.error("Error al crear carrito", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Listado de productos
router.get("/:cid", async (req, res) => {
  const cartId = parseInt(req.params.cid);

  try {
    const cart = await cartManager.getCartById(cartId);
    res.json(cart.products);
  } catch (error) {
    console.error("Error al obtener carrito", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Agregar productos al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  const cartId = parseInt(req.params.cid);
  const productId = req.params.pid;
  const quantity = 1;

  try {
    const updateCart = await cartManager.addProductToCart(
      cartId,
      productId,
      quantity
    );
    res.json(updateCart.products);
  } catch (error) {
    console.error("Error al agregar producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
