import { useEffect, useState } from "react";
import api from "../api/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [barcode, setBarcode] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [stockProductId, setStockProductId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");

  const loadProducts = () => {
    api.get("/products").then((res) => {
      setProducts(res.data);
    });
  };
  const saveProduct = () => {
    const product = {
      barcode,
      name,
      price: Number(price),
      quantity: Number(quantity),
    };

    if (editingId) {
      api
        .put(`/products/${editingId}`, product)
        .then(() => {
          loadProducts();
          resetForm();

          alert("Product updated successfully");
        })
        .catch((error) => {
          console.log(error.response?.data);

          if (error.response?.data?.message) {
            alert(error.response.data.message);
          } else if (typeof error.response?.data === "string") {
            alert(error.response.data);
          } else {
            alert("Product already exists");
          }

          console.error(error);
        });
    } else {
      api
        .post("/products", product)
        .then(() => {
          loadProducts();
          resetForm();

          alert("Product added successfully");
        })
        .catch((error) => {
          console.log("FULL ERROR:", error);
          console.log("SERVER RESPONSE:", error.response?.data);

          if (error.response?.data?.message) {
            alert(error.response.data.message);
          } else if (typeof error.response?.data === "string") {
            alert(error.response.data);
          } else {
            alert("Barcode or Product Name already exists");
          }

          console.error(error);
        });
    }
  };

  const deleteProduct = (id) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) {
      return;
    }

    api
      .delete(`/products/${id}`)
      .then(() => {
        loadProducts();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const editProduct = (product) => {
    setEditingId(product.id);

    setBarcode(product.barcode);
    setName(product.name);
    setPrice(product.price);
    setQuantity(product.quantity);
  };

  const resetForm = () => {
    setEditingId(null);

    setBarcode("");
    setName("");
    setPrice("");
    setQuantity("");
  };

  const searchProduct = () => {
    api
      .get(`/products/barcode/${searchBarcode}`)
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch(() => {
        alert("Product not found");

        setSearchResult(null);
      });
  };

  const stockIn = () => {
    api
      .post(`/stock/${stockProductId}/in`, null, {
        params: {
          quantity: Number(stockQuantity),
        },
      })
      .then(() => {
        alert("Stock added successfully");

        loadProducts();

        setStockQuantity("");
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message || "Stock In failed");
        } else {
          alert("Something went wrong");
        }

        console.error(error);
      });
  };

  const stockOut = () => {
    api
      .post(`/stock/${stockProductId}/out`, null, {
        params: {
          quantity: Number(stockQuantity),
        },
      })
      .then(() => {
        alert("Stock removed successfully");

        loadProducts();

        setStockQuantity("");
      })
      .catch((error) => {
        if (error.response) {
          alert(error.response.data.message || "Not enough stock");
        } else {
          alert("Something went wrong");
        }

        console.error(error);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Products</h1>
        <p>Manage your inventory items.</p>
      </div>

      <div className="top-grid">
        {/* Search Card */}

        <div className="card">
          <h2>Search Product</h2>

          <div className="search-box">
            <input
              placeholder="Enter barcode..."
              value={searchBarcode}
              onChange={(e) => setSearchBarcode(e.target.value)}
            />

            <button onClick={searchProduct}>Search</button>
          </div>

          {searchResult && (
            <div className="search-result">
              <p>
                <strong>Barcode:</strong> {searchResult.barcode}
              </p>

              <p>
                <strong>Name:</strong> {searchResult.name}
              </p>

              <p>
                <strong>Price:</strong> ₱{searchResult.price}
              </p>

              <p>
                <strong>Stock:</strong> {searchResult.quantity}
              </p>
            </div>
          )}
        </div>

        {/* Stock Card */}

        <div className="card">
          <h2>Stock Movement</h2>

          <select
            value={stockProductId}
            onChange={(e) => setStockProductId(e.target.value)}
          >
            <option>Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Quantity"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
          />

          <div className="stock-buttons">
            <button className="success-btn" onClick={stockIn}>
              Stock In
            </button>

            <button className="danger-btn" onClick={stockOut}>
              Stock Out
            </button>
          </div>
        </div>
      </div>

      {/* Product Table */}

      <div className="card">
        <div className="table-header">
          <h2>Product List</h2>

          <span>{products.length} Products</span>
        </div>

        {/* Your existing table here */}
      </div>

      <div className="card">
        <div className="form-header">
          <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

          <p>Fill in the product information below.</p>
        </div>

        <div className="product-form">
          <div className="form-group">
            <label>Barcode</label>

            <input
              placeholder="Enter barcode"
              value={barcode}
              onChange={(e) => setBarcode(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Product Name</label>

            <input
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Price</label>

            <input
              type="number"
              placeholder="0.00"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Quantity</label>

            <input
              type="number"
              placeholder="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button className="save-btn" onClick={saveProduct}>
            {editingId ? "Update Product" : "Save Product"}
          </button>

          {editingId && (
            <button className="cancel-btn" onClick={resetForm}>
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="table-header">
          <h2>Product List</h2>
          <span>{products.length} Products</span>
        </div>

        <table className="product-table">
          <thead>
            <tr>
              <th>Barcode</th>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.barcode}</td>

                <td>
                  <div className="product-info">
                    <div className="product-avatar">📦</div>

                    <div>
                      <strong>{product.name}</strong>
                    </div>
                  </div>
                </td>

                <td>₱{product.price.toLocaleString()}</td>

                <td>
                  <span
                    className={
                      product.quantity <= 10
                        ? "stock-badge low"
                        : product.quantity <= 30
                          ? "stock-badge medium"
                          : "stock-badge good"
                    }
                  >
                    {product.quantity}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => editProduct(product)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteProduct(product.id)}
                    >
                      Delete
                    </button>
                  </div>
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
