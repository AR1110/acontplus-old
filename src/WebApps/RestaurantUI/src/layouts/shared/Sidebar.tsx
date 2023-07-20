export default function Sidebar() {
  return (
    <>
      <aside className="left-sidebar">
        <div className="scroll-sidebar">
          <nav className="sidebar-nav">
            <ul id="sidebarnav">
              <li>
                <a
                  className="waves-effect waves-dark"
                  href="#"
                  aria-expanded="false"
                >
                  <i className="ti-home"></i>
                  <span className="hide-menu">Inicio</span>
                </a>
              </li>
              <li>
                <a
                  className="waves-effect waves-dark"
                  href="#"
                  aria-expanded="false"
                >
                  <i className="ti-home"></i>
                  <span className="hide-menu">Inicio</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
    </>
  );
}
