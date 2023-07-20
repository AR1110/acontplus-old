// import { AppStore } from "@/redux/store";
// import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { PublicRoutes } from "../models";
const AuthGuard = () => {
  //const userState = useSelector((store: AppStore) => store.user);
  const userState = localStorage.getItem("ACCESS_TOKEN") ? true : false;

  return userState ? (
    <Outlet />
  ) : (
    <Navigate replace to={PublicRoutes.LOGIN}></Navigate>
  );
};

export default AuthGuard;
