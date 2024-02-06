const fs = require("fs").promises;

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
  }

  static id = 0;

  async addProduct({
    title,
    description,
    price,
    img,
    code,
    stock,
    category,
    thumbnails,
  }) {
    try {
      const arrayProducts = await this.readProduct();

      if (!title || !description || !price || !code || !stock || !category) {
        console.log("Todos los campos son obligatorios");
        return;
      }

      if (arrayProducts.some((item) => item.code === code)) {
        console.log("El código debe ser único");
        return;
      }

      const newProduct = {
        title,
        description,
        price,
        img,
        code,
        stock,
        category,
        status: true,
        thumbnails: thumbnails || [],
      };

      if (arrayProducts.length > 0) {
        ProductManager.ultId = arrayProducts.reduce(
          (maxId, product) => Math.max(maxId, product.id),
          0
        );
      }

      newProduct.id = ++ProductManager.ultId;

      arrayProducts.push(newProduct);
      await this.saveProduct(arrayProducts);
    } catch (error) {
      console.log("Error al agregar producto", error);
      throw error;
    }
  }
  async getProducts() {
    try {
      const arrayProducts = await this.readProduct();
      return arrayProducts;
    } catch (error) {
      console.log("Error al leer el archivo", error);
      throw error;
    }
  }

  async getProductsById(id) {
    try {
      const arrayProducts = await this.readProduct();
      const search = arrayProducts.find((item) => item.id === id);

      if (!search) {
        console.log("Producto no encontrado");
        return null;
      } else {
        console.log("Producto encontrado");
        return search;
      }
    } catch (error) {
      console.log("Error al encontrar el producto", error);
      throw error;
    }
  }

  async readProduct() {
    try {
      const response = await fs.readFile(this.path, "utf-8");
      const arrayProducts = JSON.parse(response);
      return arrayProducts;
    } catch (error) {
      console.log("Error al leer", error);
      throw error;
    }
  }

  async saveProduct(arrayProducts) {
    try {
      await fs.writeFile(this.path, JSON.stringify(arrayProducts, null, 2));
    } catch (error) {
      console.log("Error al guardar", error);
      throw error;
    }
  }

  async updateProducts(id, updateP) {
    try {
      const arrayProducts = await this.readProduct();

      const index = arrayProducts.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProducts[index] = { ...arrayProducts[index], ...updateP };
        await this.saveProduct(arrayProducts);
        console.log("Producto actualizado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al actualizar el producto", error);
      throw error;
    }
  }

  async deleteProductsById(id) {
    try {
      const arrayProducts = await this.readProduct();

      const index = arrayProducts.findIndex((item) => item.id === id);

      if (index !== -1) {
        arrayProducts.splice(index, 1);
        await this.saveProduct(arrayProducts);
        console.log("Producto eliminado");
      } else {
        console.log("No se encontró el producto");
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
