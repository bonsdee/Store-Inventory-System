import { useEffect, useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Boxes, TriangleAlert } from "lucide-react";
import api from "../api/axios";
import { stockIn, stockOut } from "../api/stockApi";
import "./../styles/stock.css";

function Stock() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");

  const selectedProduct = useMemo(
    () =>
      products.find((product) => String(product.id) === selectedProductId) ||
      null,
    [products, selectedProductId],
  );

  const lowStockProducts = products.filter(
    (product) => product.quantity > 0 && product.quantity <= 10,
  );

  const outOfStockProducts = products.filter(
    (product) => Number(product.quantity) === 0,
  );

  const totalStock = products.reduce(
    (sum, product) => sum + (Number(product.quantity) || 0),
    0,
  );

  const fetchStockData = async () => {
    try {
      const [productsResponse, transactionsResponse] = await Promise.all([
        api.get("/products"),
        api.get("/stock"),
      ]);

      setProducts(productsResponse.data);
      setTransactions(transactionsResponse.data);
      setError("");
    } catch {
      setError("Unable to load stock data.");
    }
  };

  useEffect(() => {
    let isMounted = true;

    Promise.all([api.get("/products"), api.get("/stock")])
      .then(([productsResponse, transactionsResponse]) => {
        if (!isMounted) {
          return;
        }

        setProducts(productsResponse.data);
        setTransactions(transactionsResponse.data);
        setError("");
      })
      .catch(() => {
        if (isMounted) {
          setError("Unable to load stock data.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const validateStockAction = (type) => {
    if (!selectedProduct) {
      alert("Select a product first.");
      return false;
    }

    if (quantity === "" || Number(quantity) <= 0) {
      alert("Quantity must be greater than 0.");
      return false;
    }

    if (type === "OUT" && Number(quantity) > Number(selectedProduct.quantity)) {
      alert("Stock out quantity cannot exceed available stock.");
      return false;
    }

    return true;
  };

  const handleStockIn = async () => {
    if (!validateStockAction("IN")) {
      return;
    }

    try {
      await stockIn(selectedProduct.id, Number(quantity));
      await fetchStockData();
      setQuantity("");
      alert("Stock added successfully.");
    } catch {
      alert("Unable to add stock.");
    }
  };

  const handleStockOut = async () => {
    if (!validateStockAction("OUT")) {
      return;
    }

    try {
      await stockOut(selectedProduct.id, Number(quantity));
      await fetchStockData();
      setQuantity("");
      alert("Stock removed successfully.");
    } catch (requestError) {
      alert(requestError.response?.data?.message || "Unable to remove stock.");
    }
  };

  const getStatus = (quantityValue) => {
    const currentQuantity = Number(quantityValue);

    if (currentQuantity === 0) {
      return "Out of Stock";
    }

    if (currentQuantity <= 10) {
      return "Low Stock";
    }

    return "In Stock";
  };

  return (
    <div className="stock">
      <h2>Stock</h2>

      {error && <div className="stock-error">{error}</div>}

      <div className="stock-cards">
        <div className="stock-card">
          <Boxes size={22} />
          <span>Total Stock</span>
          <strong>{totalStock}</strong>
        </div>

        <div className="stock-card warning">
          <TriangleAlert size={22} />
          <span>Low Stock</span>
          <strong>{lowStockProducts.length}</strong>
        </div>

        <div className="stock-card danger">
          <TriangleAlert size={22} />
          <span>Out of Stock</span>
          <strong>{outOfStockProducts.length}</strong>
        </div>
      </div>

      <div className="stock-workspace">
        <div className="stock-panel">
          <h3>Adjust Stock</h3>

          <select
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
          >
            <option value="">Select Product</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name} - {product.quantity} available
              </option>
            ))}
          </select>

          <input
            min="1"
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />

          <div className="stock-actions">
            <button className="stock-in" onClick={handleStockIn}>
              <ArrowDownToLine size={18} />
              Stock In
            </button>

            <button className="stock-out" onClick={handleStockOut}>
              <ArrowUpFromLine size={18} />
              Stock Out
            </button>
          </div>
        </div>

        <div className="stock-panel product-focus">
          <h3>Selected Product</h3>

          {selectedProduct ? (
            <>
              <strong>{selectedProduct.name}</strong>
              <span>Barcode: {selectedProduct.barcode}</span>
              <span>Available: {selectedProduct.quantity}</span>
              <span className={`stock-status ${getStatus(selectedProduct.quantity).toLowerCase().replaceAll(" ", "-")}`}>
                {getStatus(selectedProduct.quantity)}
              </span>
            </>
          ) : (
            <p>Select a product to view stock details.</p>
          )}
        </div>
      </div>

      <div className="stock-table">
        <h3>Inventory Levels</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Barcode</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="4" className="stock-empty">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const status = getStatus(product.quantity);

                return (
                  <tr key={product.id}>
                    <td>{product.name}</td>
                    <td>{product.barcode}</td>
                    <td>{product.quantity}</td>
                    <td>
                      <span className={`stock-status ${status.toLowerCase().replaceAll(" ", "-")}`}>
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="stock-table">
        <h3>Recent Stock Movement</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="4" className="stock-empty">
                  No stock movement yet
                </td>
              </tr>
            ) : (
              transactions.slice(-6).reverse().map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.product?.name || "Deleted product"}</td>
                  <td>
                    <span
                      className={
                        transaction.type === "IN"
                          ? "movement movement-in"
                          : "movement movement-out"
                      }
                    >
                      {transaction.type === "IN" ? "Stock In" : "Stock Out"}
                    </span>
                  </td>
                  <td>{transaction.quantity}</td>
                  <td>{transaction.createdAt?.replace("T", " ")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Stock;
