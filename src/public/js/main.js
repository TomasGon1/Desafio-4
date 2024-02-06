const socket = io();

socket.on("products", (data) => {
  renderProduct(data);
});

//Render
const renderProduct = (products) => {
  const productConteiner = document.getElementById("product-conteiner");
  productConteiner.innerHTML = "";

  products.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card-conteiner");

    card.innerHTML = `
                    <div class="card">
                    <p>Id: ${item.id}</p>
                    <p>Producto: ${item.title}</p>
                    <p>Precio: $${item.price}</p>
                    <button> Eliminar </button>
                    </div>
                    `;

    productConteiner.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      deleteProduct(item.id);
    });
  });
};

const deleteProduct = (id) => {
  socket.emit("deleteProduct", id);
};

//Agrego productos desde el formulario
document.getElementById("btn-send").addEventListener("click", () => {
  addProduct();
});

const addProduct = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    img: document.getElementById("img").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value,
  };

  socket.emit("addProduct", product);
};
