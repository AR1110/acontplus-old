import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      <aside className="left-sidebar">
        <div className="scroll-sidebar">
          <nav className="sidebar-nav">
            <ul id="sidebarnav">
              <li>
                <Link
                  to="Dashboard"
                  className="waves-effect waves-dark"
                  aria-expanded="false"
                >
                  <i className="ti-home"></i>
                  <span className="hide-menu">Inicio</span>
                </Link>
              </li>
              <li>
                <Link
                  to="Table"
                  className="waves-effect waves-dark"
                  aria-expanded="false"
                >
                  <i className="mdi mdi-table"></i>
                  <span className="hide-menu">Mesas</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
