const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager("./src/models/products.json");

//Lista de productos
router.get("/", async (req, res) => {
  try {
    const limit = req.query.limit;
    const products = await productManager.getProducts();

    if (limit) {
      res.json(products.slice(0, limit));
    } else {
      res.json(products);
    }
  } catch (error) {
    console.log("Error al obtener los productos", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Traer producto por id
router.get("/:pid", async (req, res) => {
  let id = req.params.pid;

  try {
    const product = await productManager.getProductsById(parseInt(id));

    if (!product) {
      res.json({ error: "Producto no encontrado" });
    } else {
      res.json(product);
    }
  } catch (error) {
    console.log("Error al obtener el producto", error);
    res.status(500).json({ error: "Error del servidor" });
  }
});

//Agregar nuevo producto
router.post("/", async (req, res) => {
  const newPorduct = req.body;

  try {
    await productManager.addProduct(newPorduct);
    res.status(201).json({ message: "Producto agregado con exito" });
  } catch (error) {
    console.error("Error al agregar el producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Actualizar por id
router.put("/:pid", async (req, res) => {
  const id = req.params.pid;
  const updateProduct = req.body;

  try {
    await productManager.updateProducts(parseInt(id), updateProduct);
    res.json({ message: "Prodcuto actualizado" });
  } catch (error) {
    console.error("Error al actualizar producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Eliminar producto
router.delete("/:pid", async (req, res) => {
  const id = req.params.pid;

  try {
    await productManager.deleteProductsById(parseInt(id));
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al elimiar producto", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;
