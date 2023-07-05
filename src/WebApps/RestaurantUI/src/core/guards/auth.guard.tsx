import { AppStore } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { PublicRoutes } from "../models";
import RootLayout from "@/layouts/RootLayout";
const AuthGuard = () => {
  const userState = useSelector((store: AppStore) => store.user);
  console.log(userState);
  // const userState = localStorage.getItem("user") ? true : false;

  return userState.username ? (
    <RootLayout />
  ) : (
    <Navigate replace to={PublicRoutes.LOGIN}></Navigate>
  );
};

export default AuthGuard;
