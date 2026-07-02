import { useEffect, useState } from "react";
import "./../styles/Components/header.css";
import axios from "axios";
import { Bell, ChevronDown, Settings, LogOut, User } from "lucide-react";

function Header() {
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [time, setTime] = useState("");
  const [notifications, setNotifications] = useState([]);

  // Clock
  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleString("en-PH", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  // Fetch Notifications
  useEffect(() => {
    const fetchNotifications = () => {
      axios
        .get("http://localhost:8080/api/notifications")
        .then((response) => {
          setNotifications(response.data);
        })
        .catch((error) => {
          console.error("Failed to fetch notifications:", error);
        });
    };

    fetchNotifications();

    // Refresh every 10 seconds
    const interval = setInterval(fetchNotifications, 10000);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1 className="store-title">📦 Store Inventory System</h1>
        <span className="date">{time}</span>
      </div>

      <div className="header-right">
        {/* Notifications */}
        <div className="notification-wrapper">
          <div
            className="notification-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowMenu(false);
            }}
          >
            <Bell size={20} />

            {notifications.length > 0 && (
              <div className="notification-badge">{notifications.length}</div>
            )}
          </div>

          {showNotifications && (
            <div className="notification-dropdown">
              <h4>Notifications</h4>

              {notifications.length === 0 ? (
                <div className="notification-item">✅ No new notifications</div>
              ) : (
                notifications.map((notification, index) => (
                  <div key={index} className="notification-item">
                    {notification}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Menu */}
        <div
          className="user-menu"
          onClick={() => {
            setShowMenu(!showMenu);
            setShowNotifications(false);
          }}
        >
          <div className="user-avatar">JD</div>

          <span className="user-name">Jivonz</span>

          <ChevronDown size={18} />

          {showMenu && (
            <div className="dropdown">
              <button>
                <User size={18} />
                Profile
              </button>

              <button>
                <Settings size={18} />
                Settings
              </button>

              <button className="logout-btn" onClick={logout}>
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
