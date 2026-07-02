import { useState } from "react";
import axios from "axios";
import "./../styles/pos.css";

function POS() {
  const [barcode, setBarcode] = useState("");
  const [cart, setCart] = useState([]);

  const formatCurrency = (value) => `PHP ${Number(value).toFixed(2)}`;

  const searchProduct = () => {
    const scannedBarcode = barcode.trim();

    if (!scannedBarcode) {
      alert("Scan barcode first");
      return;
    }

    axios
      .get(
        `http://localhost:8080/api/products/barcode/${encodeURIComponent(scannedBarcode)}`,
      )
      .then((res) => {
        const product = res.data;

        if (Number(product.quantity) <= 0) {
          alert("Product is out of stock");
          setBarcode("");
          return;
        }

        setCart((currentCart) => {
          const existing = currentCart.find((item) => item.id === product.id);

          if (!existing) {
            return [
              ...currentCart,
              {
                ...product,
                cartQty: 1,
              },
            ];
          }

          if (existing.cartQty >= Number(product.quantity)) {
            alert("Cart quantity cannot exceed available stock");
            return currentCart;
          }

          return currentCart.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  cartQty: item.cartQty + 1,
                }
              : item,
          );
        });

        setBarcode("");
      })
      .catch(() => {
        alert("Product not found");
      });
  };

  const changeQty = (id, value) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              cartQty: Math.min(
                Number(item.quantity),
                Math.max(1, item.cartQty + value),
              ),
            }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.cartQty,

    0,
  );

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }

    try {
      for (const item of cart) {
        await axios.post(
          `http://localhost:8080/api/stock/${item.id}/out?quantity=${item.cartQty}`,
        );
      }

      alert("Purchase completed");

      setCart([]);
    } catch {
      alert("Checkout failed. Check stock.");
    }
  };

  return (
    <div className="pos">
      <h2>POS / Sales</h2>

      <div className="scanner">
        <input
          placeholder="Scan barcode..."
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
        />

        <button onClick={searchProduct}>Add</button>
      </div>

      <div className="cart">
        <h3>Shopping Cart</h3>

        <table>
          <thead>
            <tr>
              <th>Product</th>

              <th>Qty</th>

              <th>Price</th>

              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {cart.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty">
                  Cart is empty
                </td>
              </tr>
            ) : (
              cart.map((item) => (
                <tr key={item.id}>
                  <td>
                    {item.name}
                    <span className="stock-hint">Stock: {item.quantity}</span>
                  </td>

                  <td>
                    <div className="qty-control">
                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.id, -1)}
                      >
                        -
                      </button>

                      <span>{item.cartQty}</span>

                      <button
                        className="qty-btn"
                        onClick={() => changeQty(item.id, 1)}
                        disabled={item.cartQty >= Number(item.quantity)}
                      >
                        +
                      </button>
                    </div>
                  </td>

                  <td>{formatCurrency(item.price * item.cartQty)}</td>

                  <td>
                    <button
                      className="remove"
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="cart-footer">
          <h2>Total: {formatCurrency(total)}</h2>

          <button className="checkout" onClick={checkout}>
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}

export default POS;
