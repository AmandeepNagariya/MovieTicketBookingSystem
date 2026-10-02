import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {

  return (
    <div className="d-flex" style={{ height: "100vh", overflow: "visible" }}>

      <Sidebar />

      <div style={{ flex: 1 }}>

        <Navbar />

        <div className="p-3">
          {children}
        </div>

      </div>

    </div>
  );
}