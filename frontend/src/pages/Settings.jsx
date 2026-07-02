import { useState } from "react";
import "./../styles/settings.css";

function Settings() {
  const [store, setStore] = useState({
    name: "My Store",
    address: "Cebu City",
    contact: "09123456789",
  });

  const [account, setAccount] = useState({
    username: "admin",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleStoreChange = (e) => {
    setStore({
      ...store,
      [e.target.name]: e.target.value,
    });
  };

  const handleAccountChange = (e) => {
    setAccount({
      ...account,
      [e.target.name]: e.target.value,
    });
  };

  const saveStore = () => {
    alert("Store information saved successfully!");
  };

  const changePassword = () => {
    if (account.newPassword !== account.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    alert("Password changed successfully!");

    setAccount({
      ...account,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="settings">
      <h2>Settings</h2>

      <div className="settings-grid">
        {/* Store Information */}
        <div className="settings-card">
          <h3>Store Information</h3>

          <label>Store Name</label>
          <input
            type="text"
            name="name"
            value={store.name}
            onChange={handleStoreChange}
          />

          <label>Address</label>
          <input
            type="text"
            name="address"
            value={store.address}
            onChange={handleStoreChange}
          />

          <label>Contact Number</label>
          <input
            type="text"
            name="contact"
            value={store.contact}
            onChange={handleStoreChange}
          />

          <button onClick={saveStore}>Save</button>
        </div>

        {/* Account */}
        <div className="settings-card">
          <h3>Account</h3>

          <label>Username</label>
          <input type="text" value={account.username} disabled />

          <label>Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={account.currentPassword}
            onChange={handleAccountChange}
          />

          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            value={account.newPassword}
            onChange={handleAccountChange}
          />

          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={account.confirmPassword}
            onChange={handleAccountChange}
          />

          <button onClick={changePassword}>Change Password</button>
        </div>

        {/* About */}
        <div className="settings-card full-width">
          <h3>About System</h3>

          <p>
            <strong>Application:</strong> Inventory Barcode System
          </p>
          <p>
            <strong>Version:</strong> 1.0.0
          </p>
          <p>
            <strong>Developer:</strong> Jivonz Dy
          </p>
          <p>
            Barcode-based inventory management system with Product Management,
            Stock In/Out, POS, and Transaction History.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
