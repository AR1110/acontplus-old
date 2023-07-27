import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { SnackbarUtilities as tS } from "@/core/utils";
import { AuthService as AuthSvc } from "@/core/services/auth.service";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/redux/slices/user.slice";
import { DataLogin, PrivateRoutes } from "@/core/models";

type Data = {
  username: string;
  password: string;
};

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //Variables
  const [data, setData] = useState<Data>({ username: "", password: "" });
  const [isViewPass, setIsViewPass] = useState(false);
  const [typeInputPass, setTypeInputPass] = useState("password");
  const [iconViewPass, setIconViewPass] = useState("fas fa-eye");

  const handleChange = function ($event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = $event.target;
    setData({
      ...data,
      [name]: value.trim(),
    });
  };

  const showPasswordInput = function (): void {
    const prevStateIsView = !isViewPass;
    setIsViewPass(prevStateIsView);

    if (prevStateIsView) {
      setTypeInputPass("text");
      setIconViewPass("fas fa-eye-slash");
    } else {
      setTypeInputPass("password");
      setIconViewPass("fas fa-eye");
    }
  };

  const login = function ($event: React.FormEvent<HTMLFormElement>) {
    const regex = /^(?!.*\S)/;
    $event.preventDefault();

    if (regex.test(data.username)) {
      tS.warning("¡Ingrese el usuario!");
      return;
    }
    if (regex.test(data.password)) {
      tS.warning("¡Ingrese la contraseña!");
      return;
    }
    AuthSvc.login(data.username, data.password).then((response) => {
      console.log(response);
      console.log(tS);
      if (response.code === "0") {
        // tS.warning(response.message);
        return;
      }
      if (response.code === "1") {
        // tS.success(response.message);

        const userData = response.payload as DataLogin;

        const jwtToken = userData.userData[0]?.jwtToken;

        AuthSvc.setPersistent("ACCESS_TOKEN", jwtToken!);
        AuthSvc.setPersistent("USER", JSON.stringify(userData));
        dispatch(setCredentials(userData));
        navigate(`/${PrivateRoutes.ADMIN}`, { replace: true });
      }
    });
  };

  return (
    <section id="wrapper" className="login-register login-sidebar">
      <div className="login-box card">
        <div className="card-body">
          <form
            className="form-horizontal form-material text-center"
            id="loginform"
            onSubmit={login}
          >
            <a href="#" className="db">
              <img src="assets/images/logo-icon.png" alt="Home" />
              <br />
              <img src="assets/images/logo-text.png" alt="Home" />
            </a>
            <div className="form-group m-t-40">
              <div className="col-xs-12">
                <input
                  type="text"
                  className="form-control"
                  value={data.username}
                  onChange={handleChange}
                  name="username"
                  placeholder="Usuario"
                />
              </div>
            </div>
            <div className="form-group">
              <div className="col-xs-12">
                <div className="input-group">
                  <input
                    type={typeInputPass}
                    className="form-control"
                    name="password"
                    value={data.password}
                    onChange={handleChange}
                    placeholder="Contraseña"
                  />
                  <div className="input-group-btn">
                    <button
                      type="button"
                      className="btn btn-info"
                      onClick={showPasswordInput}
                    >
                      <i className={`${iconViewPass} text-white`}></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group text-center m-t-20">
              <div className="col-xs-12">
                <button
                  type="submit"
                  className="btn btn-info btn-lg w-100 btn-rounded text-white"
                >
                  Ingresar <i className="fa fa-sign-in-alt"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
