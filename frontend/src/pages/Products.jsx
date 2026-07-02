import { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [searchedProduct, setSearchedProduct] = useState(null);

  const [newProduct, setNewProduct] = useState({
    barcode: "",
    name: "",
    price: "",
    quantity: "",
  });

  const formatCurrency = (value) => `PHP ${Number(value).toFixed(2)}`;

  const getErrorMessage = (error, fallback) =>
    error.response?.data?.message || fallback;

  const isValidProduct = (product) => {
    if (!product.barcode.trim()) {
      alert("Barcode is required.");
      return false;
    }

    if (!product.name.trim()) {
      alert("Product name is required.");
      return false;
    }

    if (product.price === "") {
      alert("Price is required.");
      return false;
    }

    if (Number(product.price) <= 0) {
      alert("Price must be greater than 0.");
      return false;
    }

    if (product.quantity === "") {
      alert("Quantity is required.");
      return false;
    }

    if (Number(product.quantity) <= 0) {
      alert("Quantity must be greater than 0.");
      return false;
    }

    return true;
  };

  const fetchProducts = () => {
    axios
      .get("http://localhost:8080/api/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch(() => {
        alert("Unable to connect to the server.");
      });
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (editingProduct) {
      setEditingProduct({
        ...editingProduct,
        [name]: value,
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value,
      });
    }
  };

  const saveProduct = () => {
    if (!isValidProduct(newProduct)) {
      return;
    }

    axios
      .post("http://localhost:8080/api/products", {
        ...newProduct,
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
      })
      .then(() => {
        fetchProducts();

        setNewProduct({
          barcode: "",
          name: "",
          price: "",
          quantity: "",
        });

        alert("Product added.");
      })
      .catch((error) => {
        alert(getErrorMessage(error, "Failed to add product."));
      });
  };

  const editProduct = (product) => {
    setEditingProduct({
      ...product,
      price: product.price,
      quantity: product.quantity,
    });
  };

  const updateProduct = () => {
    if (!isValidProduct(editingProduct)) {
      return;
    }

    axios
      .put(`http://localhost:8080/api/products/${editingProduct.id}`, {
        ...editingProduct,
        price: Number(editingProduct.price),
        quantity: Number(editingProduct.quantity),
      })
      .then(() => {
        fetchProducts();

        setEditingProduct(null);

        alert("Product updated successfully.");
      })
      .catch((error) => {
        alert(getErrorMessage(error, "Failed to update product."));
      });
  };

  const deleteProduct = (id) => {
    if (!window.confirm("Delete this product?")) {
      return;
    }

    axios
      .delete(`http://localhost:8080/api/products/${id}`)
      .then(() => {
        fetchProducts();

        alert("Product deleted.");
      })
      .catch((error) => {
        alert(getErrorMessage(error, "Delete failed."));
      });
  };

  const handleSearchBarcode = () => {
    if (!searchBarcode.trim()) {
      alert("Enter barcode");
      return;
    }

    axios
      .get(
        `http://localhost:8080/api/products/barcode/${encodeURIComponent(searchBarcode.trim())}`,
      )
      .then((response) => {
        setSearchedProduct(response.data);
      })
      .catch(() => {
        setSearchedProduct(null);

        alert("Product not found");
      });
  };

  return (
    <div className="products">
      <h2>Products</h2>

      <div className="barcode-search">
        <input
          type="text"
          placeholder="Search barcode..."
          value={searchBarcode}
          onChange={(e) => setSearchBarcode(e.target.value)}
        />

        <button onClick={handleSearchBarcode}>Search</button>
      </div>

      {searchedProduct && (
        <div className="search-result">
          <h3>Product Found</h3>

          <p>Barcode: {searchedProduct.barcode}</p>

          <p>Name: {searchedProduct.name}</p>

          <p>Price: {formatCurrency(searchedProduct.price)}</p>

          <p>Stock: {searchedProduct.quantity}</p>
        </div>
      )}

      <div className="product-form">
        <input
          type="text"
          name="barcode"
          placeholder="Barcode"
          value={editingProduct ? editingProduct.barcode : newProduct.barcode}
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={editingProduct ? editingProduct.name : newProduct.name}
          onChange={handleChange}
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          min="0.01"
          step="0.01"
          value={editingProduct ? editingProduct.price : newProduct.price}
          onChange={handleChange}
        />

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          min="1"
          disabled={Boolean(editingProduct)}
          title={
            editingProduct
              ? "Use the Stock page to change product quantity"
              : "Initial product quantity"
          }
          value={editingProduct ? editingProduct.quantity : newProduct.quantity}
          onChange={handleChange}
        />

        <button onClick={editingProduct ? updateProduct : saveProduct}>
          {editingProduct ? "Update Product" : "Add Product"}
        </button>

        {editingProduct && (
          <button
            className="cancel-edit"
            type="button"
            onClick={() => setEditingProduct(null)}
          >
            Cancel
          </button>
        )}
      </div>

      <div className="product-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Barcode</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>

                <td>{product.barcode}</td>

                <td>{product.name}</td>

                <td>{formatCurrency(product.price)}</td>

                <td>{product.quantity}</td>

                <td>
                  <button onClick={() => editProduct(product)}>Edit</button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteProduct(product.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Products;
