import { Outlet } from "react-router-dom";
import { Footer, Header, RightSidebar, Sidebar } from "./shared";

export default function RootLayout() {
  return (
    <div id="main-wrapper">
      <Header />
      <Sidebar />

      <div className="page-wrapper">
        <div className="container-fluid">
          <Outlet />
          <RightSidebar />
        </div>
      </div>

      <Footer />
    </div>
  );
}
