import { useEffect, useState } from "react";
import axios from "axios";
import "./../styles/transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);

  const loadTransactions = () => {
    axios.get("http://localhost:8080/api/stock").then((res) => {
      setTransactions(res.data);
    });
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  return (
    <div className="transactions">
      <h2>Transactions</h2>

      <div className="transaction-table">
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
                <td colSpan="4" className="empty-transactions">
                  No transactions yet
                </td>
              </tr>
            ) : (
              transactions.map((t) => (
                <tr key={t.id}>
                  <td>{t.product?.name || "Deleted product"}</td>

                  <td>
                    <span
                      className={
                        t.type === "IN" ? "badge badge-in" : "badge badge-out"
                      }
                    >
                      {t.type === "IN" ? "Stock In" : "Stock Out"}
                    </span>
                  </td>

                  <td>{t.quantity}</td>

                  <td>{t.createdAt?.replace("T", " ")}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
