import "../styles/sidebar.css";
import {
  LayoutDashboard,
  Package,
  ArrowLeftRight,
  ClipboardList,
  BarChart3,
  Settings,
  ShoppingCart,
} from "lucide-react";

function Sidebar({ page, setPage }) {
  const menus = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "POS",icon: ShoppingCart,},
    { name: "Products", icon: Package },
    { name: "Stock", icon: ArrowLeftRight },
    { name: "Transactions", icon: ClipboardList },
    { name: "Reports", icon: BarChart3 },
    { name: "Settings", icon: Settings },
    
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>MENU</h3>
      </div>

      <div className="sidebar-menu">
        {menus.map((menu) => {
          const Icon = menu.icon;

          return (
            <button
              key={menu.name}
              className={page === menu.name ? "active" : ""}
              onClick={() => setPage(menu.name)}
            >
              <Icon size={20} />
              <span>{menu.name}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;
