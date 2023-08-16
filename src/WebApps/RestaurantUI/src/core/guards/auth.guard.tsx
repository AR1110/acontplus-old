// import { AppStore } from "@/redux/store";
// import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../models";

interface Props {
  privateValidation: boolean;
}

const AuthGuard = ({ privateValidation }: Props) => {
  //const userState = useSelector((store: AppStore) => store.user);
  const userState = localStorage.getItem("ACCESS_TOKEN") ? true : false;

  return userState ? (
    privateValidation ? (
      <Outlet />
    ) : (
      <Navigate replace to={PrivateRoutes.PRIVATE}></Navigate>
    )
  ) : (
    <Navigate replace to={PublicRoutes.LOGIN}></Navigate>
  );
};

export default AuthGuard;
