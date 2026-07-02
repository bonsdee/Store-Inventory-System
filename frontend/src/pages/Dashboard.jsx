import { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/dashboard.css";

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      axios.get("http://localhost:8080/api/products"),
      axios.get("http://localhost:8080/api/stock"),
    ])
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
          setError("Unable to load dashboard data.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const totalProducts = products.length;

  const availableStock = products.reduce(
    (sum, p) => sum + (Number(p.quantity) || 0),
    0,
  );

  const lowStock = products.filter(
    (p) => p.quantity > 0 && p.quantity <= 10,
  ).length;

  const outOfStock = products.filter((p) => p.quantity === 0).length;

  return (
    <div className="dashboard">
      <h1 className="page-title">Dashboard</h1>

      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-cards">
        <div className="dashboard-card card-blue">
          <h4>Total Products</h4>

          <h2>{totalProducts}</h2>
        </div>

        <div className="dashboard-card card-green">
          <h4>Available Stock</h4>

          <h2>{availableStock}</h2>
        </div>

        <div className="dashboard-card card-orange">
          <h4>Low Stock</h4>

          <h2>{lowStock}</h2>
        </div>

        <div className="dashboard-card card-red">
          <h4>Out of Stock</h4>

          <h2>{outOfStock}</h2>
        </div>
      </div>
      <div className="dashboard-section">
        <h3>Low Stock Products</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>

              <th>Stock</th>

              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products.filter(
              (product) => product.quantity > 0 && product.quantity <= 10,
            ).length === 0 ? (
              <tr>
                <td colSpan="3" className="no-stock">
                  No low stock products
                </td>
              </tr>
            ) : (
              products
                .filter(
                  (product) => product.quantity > 0 && product.quantity <= 10,
                )
                .map((product) => (
                  <tr key={product.id}>
                    <td>{product.name}</td>

                    <td>{product.quantity}</td>

                    <td>
                      <span className="low-stock-badge">Low Stock</span>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>


      <br />

      <div className="dashboard-section">
        <h3>Recent Transactions</h3>

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
                <td colSpan="4" className="empty-row">
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.slice(-5).reverse().map((transaction) => (
                <tr key={transaction.id}>
                  <td>{transaction.product?.name || "Deleted product"}</td>

                  <td>
                    {transaction.type === "IN" ? "Stock In" : "Stock Out"}
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

export default Dashboard;
