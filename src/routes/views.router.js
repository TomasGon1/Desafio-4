const express = require("express");
const router = express.Router();
const ProductsManagers = require("../controllers/ProductManager.js");
const productManagers = new ProductsManagers("./src/models/products.json");

router.get("/", async (req, res) => {
  try {
    const products = await productManagers.getProducts();

    res.render("home", { products: products });
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error interno del server" });
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    res.render("realtimeproducts");
  } catch (error) {
    console.log("Error al obtener los productos en tiempo real", error);
    res.status(500).json({ error: "Error interno del server" });
  }
});

module.exports = router;
