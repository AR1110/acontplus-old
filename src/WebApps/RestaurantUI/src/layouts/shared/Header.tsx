import { PublicRoutes } from "@/core/models";
import { logOut } from "@/redux/slices/user.slice";
import { AppStore } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userState = useSelector((store: AppStore) => store.user);
  const logout = () => {
    dispatch(logOut());
    navigate(`/${PublicRoutes.LOGIN}`, { replace: true });
  };
  return (
    <>
      <header className="header-app topbar">
        <nav className="navbar top-navbar navbar-expand-md navbar-dark">
          <div className="navbar-header">
            <a className="navbar-brand" href="/">
              <b>
                <img
                  src="../assets/images/logo-icon.png"
                  alt="homepage"
                  className="dark-logo"
                />
                <img
                  src="../assets/images/logo-light-icon.png"
                  alt="homepage"
                  className="light-logo"
                />
              </b>
              <span>
                <img
                  src="../assets/images/logo-text.png"
                  alt="homepage"
                  className="dark-logo"
                />
                <img
                  src="../assets/images/logo-light-text.png"
                  className="light-logo"
                  alt="homepage"
                />
              </span>{" "}
            </a>
          </div>
          <div className="navbar-collapse">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a
                  className="nav-link nav-toggler d-block d-md-none waves-effect waves-dark"
                  href="#"
                >
                  <i className="ti-menu"></i>
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link sidebartoggler d-none d-lg-block d-md-block waves-effect waves-dark"
                  href="#"
                >
                  <i className="icon-menu"></i>
                </a>
              </li>

              <li className="nav-item">
                <form className="app-search d-none d-md-block d-lg-block">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search & enter"
                  />
                </form>
              </li>
            </ul>

            <ul className="navbar-nav my-lg-0">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle waves-effect waves-dark"
                  href=""
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {" "}
                  <i className="ti-email"></i>
                  <div className="notify">
                    {" "}
                    <span className="heartbit"></span>{" "}
                    <span className="point"></span>{" "}
                  </div>
                </a>
                <div className="dropdown-menu dropdown-menu-end mailbox animated bounceInDown">
                  <ul>
                    <li>
                      <div className="drop-title">Notifications</div>
                    </li>
                    <li>
                      <div className="message-center">
                        <a href="#">
                          <div className="btn btn-danger btn-circle text-white">
                            <i className="fa fa-link"></i>
                          </div>
                          <div className="mail-contnet">
                            <h5>Luanch Admin</h5>{" "}
                            <span className="mail-desc">
                              Just see the my new admin!
                            </span>{" "}
                            <span className="time">9:30 AM</span>{" "}
                          </div>
                        </a>

                        <a href="#">
                          <div className="btn btn-success btn-circle text-white">
                            <i className="ti-calendar"></i>
                          </div>
                          <div className="mail-contnet">
                            <h5>Event today</h5>{" "}
                            <span className="mail-desc">
                              Just a reminder that you have event
                            </span>{" "}
                            <span className="time">9:10 AM</span>{" "}
                          </div>
                        </a>

                        <a href="#">
                          <div className="btn btn-info btn-circle text-white">
                            <i className="ti-settings"></i>
                          </div>
                          <div className="mail-contnet">
                            <h5>Settings</h5>{" "}
                            <span className="mail-desc">
                              You can customize this template as you want
                            </span>{" "}
                            <span className="time">9:08 AM</span>{" "}
                          </div>
                        </a>

                        <a href="#">
                          <div className="btn btn-primary btn-circle">
                            <i className="ti-user"></i>
                          </div>
                          <div className="mail-contnet">
                            <h5>Pavan kumar</h5>{" "}
                            <span className="mail-desc">
                              Just see the my admin!
                            </span>{" "}
                            <span className="time">9:02 AM</span>{" "}
                          </div>
                        </a>
                      </div>
                    </li>
                    <li>
                      <a className="nav-link text-center link" href="#;">
                        {" "}
                        <strong>Check all notifications</strong>{" "}
                        <i className="fa fa-angle-right"></i>{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle waves-effect waves-dark"
                  href=""
                  id="2"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  {" "}
                  <i className="icon-note"></i>
                  <div className="notify">
                    {" "}
                    <span className="heartbit"></span>{" "}
                    <span className="point"></span>{" "}
                  </div>
                </a>
                <div
                  className="dropdown-menu mailbox dropdown-menu-end animated bounceInDown"
                  aria-labelledby="2"
                >
                  <ul>
                    <li>
                      <div className="drop-title">You have 4 new messages</div>
                    </li>
                    <li>
                      <a className="nav-link text-center link" href="#;">
                        {" "}
                        <strong>See all e-Mails</strong>{" "}
                        <i className="fa fa-angle-right"></i>{" "}
                      </a>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="nav-item dropdown u-pro">
                <a
                  className="nav-link dropdown-toggle waves-effect waves-dark profile-pic"
                  href=""
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <i className="ti-user"></i>{" "}
                  <span className="hidden-md-down">
                    {userState.userName} &nbsp;
                    <i className="fa fa-angle-down"></i>
                  </span>{" "}
                </a>
                <div className="dropdown-menu dropdown-menu-end animated flipInY">
                  <a href="#" className="dropdown-item">
                    <i className="ti-user"></i> My Profile
                  </a>

                  <a href="#" className="dropdown-item">
                    <i className="ti-wallet"></i> My Balance
                  </a>

                  <a href="#" className="dropdown-item">
                    <i className="ti-email"></i> Inbox
                  </a>

                  <div className="dropdown-divider"></div>

                  <a href="#" className="dropdown-item">
                    <i className="ti-settings"></i> Account Setting
                  </a>

                  <div className="dropdown-divider"></div>

                  <a
                    href="#"
                    onClick={() => logout()}
                    className="dropdown-item"
                  >
                    <i className="fa fa-power-off"></i> Logout
                  </a>
                </div>
              </li>
              <li className="nav-item right-side-toggle">
                {" "}
                <a className="nav-link  waves-effect waves-light" href="#">
                  <i className="ti-settings"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
}
