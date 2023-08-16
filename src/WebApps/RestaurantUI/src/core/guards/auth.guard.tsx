// import { AppStore } from "@/redux/store";
// import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { PrivateRoutes, PublicRoutes } from "../models";
import { getToken } from "../services";

interface Props {
  privateValidation: boolean;
}

const AuthGuard = ({ privateValidation }: Props) => {
  console.log(privateValidation)
  //const userState = useSelector((store: AppStore) => store.user);
  const userState = getToken() ? true : false;
 
  return userState ?  <Outlet /> : 
    <Navigate replace to={PublicRoutes.LOGIN}></Navigate>
  
};

export default AuthGuard;
