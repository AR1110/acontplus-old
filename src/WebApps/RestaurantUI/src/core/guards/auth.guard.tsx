// import { AppStore } from "@/redux/store";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PublicRoutes } from "../models";
import RootLayout from "@/layouts/RootLayout";
const AuthGuard = () => {
  //const userState = useSelector((store: AppStore) => store.user);
  const userState = localStorage.getItem("ACCESS_TOKEN") ? true : false;


  return userState ? (
    <RootLayout />
  ) : (
    <Navigate replace to={PublicRoutes.LOGIN}></Navigate>
  );
};

export default AuthGuard;
