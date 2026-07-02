import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  Download,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios";
import "./../styles/reports.css";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function Reports() {
  const [products, setProducts] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [rangeDays, setRangeDays] = useState("30");
  const [movementType, setMovementType] = useState("ALL");
  const [error, setError] = useState("");
  const [reportTime] = useState(() => Date.now());

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
          setError("Unable to load report data.");
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredTransactions = useMemo(() => {
    const rangeStart = new Date(reportTime - Number(rangeDays) * MS_PER_DAY);

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.createdAt);
      const matchesRange = transactionDate >= rangeStart;
      const matchesType =
        movementType === "ALL" || transaction.type === movementType;

      return matchesRange && matchesType;
    });
  }, [movementType, rangeDays, reportTime, transactions]);

  const inventoryValue = products.reduce(
    (sum, product) =>
      sum + Number(product.price || 0) * Number(product.quantity || 0),
    0,
  );

  const totalStockIn = filteredTransactions
    .filter((transaction) => transaction.type === "IN")
    .reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0);

  const totalStockOut = filteredTransactions
    .filter((transaction) => transaction.type === "OUT")
    .reduce((sum, transaction) => sum + Number(transaction.quantity || 0), 0);

  const lowStockCount = products.filter(
    (product) => product.quantity > 0 && product.quantity <= 10,
  ).length;

  const outOfStockCount = products.filter(
    (product) => Number(product.quantity) === 0,
  ).length;

  const formatCurrency = (value) => `PHP ${Number(value).toFixed(2)}`;

  const movementByDay = useMemo(() => {
    const dayMap = new Map();

    filteredTransactions.forEach((transaction) => {
      const day = transaction.createdAt?.slice(0, 10) || "Unknown";
      const current = dayMap.get(day) || { day, stockIn: 0, stockOut: 0 };

      if (transaction.type === "IN") {
        current.stockIn += Number(transaction.quantity || 0);
      } else {
        current.stockOut += Number(transaction.quantity || 0);
      }

      dayMap.set(day, current);
    });

    return Array.from(dayMap.values()).sort((a, b) =>
      a.day.localeCompare(b.day),
    );
  }, [filteredTransactions]);

  const topMovedProducts = useMemo(() => {
    const productMap = new Map();

    filteredTransactions.forEach((transaction) => {
      const productName = transaction.product?.name || "Deleted product";
      const current = productMap.get(productName) || {
        name: productName,
        stockIn: 0,
        stockOut: 0,
        total: 0,
      };

      const quantity = Number(transaction.quantity || 0);

      if (transaction.type === "IN") {
        current.stockIn += quantity;
      } else {
        current.stockOut += quantity;
      }

      current.total += quantity;
      productMap.set(productName, current);
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredTransactions]);

  const stockHealthData = [
    {
      name: "In Stock",
      value: products.filter((product) => Number(product.quantity) > 10).length,
      color: "#16a34a",
    },
    { name: "Low Stock", value: lowStockCount, color: "#f97316" },
    { name: "Out", value: outOfStockCount, color: "#dc2626" },
  ];

  const exportReport = () => {
    const rows = [
      ["Product", "Type", "Quantity", "Date"],
      ...filteredTransactions.map((transaction) => [
        transaction.product?.name || "Deleted product",
        transaction.type === "IN" ? "Stock In" : "Stock Out",
        transaction.quantity,
        transaction.createdAt?.replace("T", " "),
      ]),
    ];

    const csv = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "inventory-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="reports">
      <div className="reports-header">
        <h2>Reports</h2>

        <div className="report-controls">
          <select
            value={rangeDays}
            onChange={(event) => setRangeDays(event.target.value)}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 12 months</option>
          </select>

          <select
            value={movementType}
            onChange={(event) => setMovementType(event.target.value)}
          >
            <option value="ALL">All movement</option>
            <option value="IN">Stock in only</option>
            <option value="OUT">Stock out only</option>
          </select>

          <button onClick={exportReport}>
            <Download size={17} />
            Export CSV
          </button>
        </div>
      </div>

      {error && <div className="reports-error">{error}</div>}

      <div className="report-stats">
        <div className="report-stat">
          <Boxes size={22} />
          <span>Inventory Value</span>
          <strong>{formatCurrency(inventoryValue)}</strong>
        </div>

        <div className="report-stat success">
          <TrendingUp size={22} />
          <span>Stock In</span>
          <strong>{totalStockIn}</strong>
        </div>

        <div className="report-stat danger">
          <TrendingDown size={22} />
          <span>Stock Out</span>
          <strong>{totalStockOut}</strong>
        </div>

        <div className="report-stat warning">
          <AlertTriangle size={22} />
          <span>Needs Attention</span>
          <strong>{lowStockCount + outOfStockCount}</strong>
        </div>
      </div>

      <div className="report-grid">
        <div className="report-panel chart-panel">
          <h3>Stock Movement Trend</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={movementByDay}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line
                dataKey="stockIn"
                name="Stock In"
                stroke="#16a34a"
                strokeWidth={3}
              />
              <Line
                dataKey="stockOut"
                name="Stock Out"
                stroke="#dc2626"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="report-panel chart-panel">
          <h3>Inventory Health</h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockHealthData}
                dataKey="value"
                nameKey="name"
                outerRadius={105}
                label
              >
                {stockHealthData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="report-panel chart-panel">
        <h3>Top Moving Products</h3>

        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={topMovedProducts}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="stockIn" name="Stock In" fill="#16a34a" />
            <Bar dataKey="stockOut" name="Stock Out" fill="#dc2626" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="report-panel">
        <div className="table-title">
          <h3>Low Stock Watchlist</h3>
          <BarChart3 size={20} />
        </div>

        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Barcode</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {products
              .filter((product) => Number(product.quantity) <= 10)
              .map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.barcode}</td>
                  <td>{product.quantity}</td>
                  <td>{formatCurrency(product.price)}</td>
                  <td>
                    <span
                      className={
                        Number(product.quantity) === 0
                          ? "report-badge danger"
                          : "report-badge warning"
                      }
                    >
                      {Number(product.quantity) === 0
                        ? "Out of Stock"
                        : "Low Stock"}
                    </span>
                  </td>
                </tr>
              ))}

            {products.filter((product) => Number(product.quantity) <= 10)
              .length === 0 && (
              <tr>
                <td colSpan="5" className="empty-report">
                  No low stock products
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reports;
