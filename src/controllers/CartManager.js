const fs = require("fs").promises;

class CartManager {
  constructor(path) {
    this.carts = [];
    this.path = path;
    this.ultId = 0;
    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
      if (this.carts.length > 0) {
        this.ultId = Math.max(...this.carts.map((cart) => cart.id));
      }
    } catch (error) {
      console.error("Error al cargar el carrito", error);
      await saveCarts();
    }
  }

  async saveCarts() {
    await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    const newCart = {
      id: ++this.ultId,
      products: [],
    };

    this.carts.push(newCart);
    await this.saveCarts();
    return newCart;
  }

  async getCartById(cartId) {
    try {
      const cart = this.carts.find((c) => c.id === cartId);

      if (!cart) {
        throw new Error(`No existe el carrito ${cartId}`);
      }
      return cart;
    } catch (error) {
      console.error("Error al obtener el carrito", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const productE = cart.products.find((p) => p.product === productId);

    if (productE) {
      productE.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await this.saveCarts();
    return cart;
  }
}

module.exports = CartManager;
