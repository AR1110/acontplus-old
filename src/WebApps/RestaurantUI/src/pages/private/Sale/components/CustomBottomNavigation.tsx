import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Badge, Paper } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useSaleStore } from "@/stores/saleStore";
import { SyntheticEvent, useState } from "react";
import ItemDialog from "./ItemDialog";
import { useNavigate } from "react-router-dom";
import { PrivateRoutes } from "@/core/models";
import { useMobileDetect } from "@/hooks";

 function CustomBottomNavigation() {
  const {isMobile} = useMobileDetect();
  const [value, setValue] = useState("recents"); 
  const navigate = useNavigate();
  const totalItems = useSaleStore((state) => state.totalItems);

  const navigation = useSaleStore(state=>state.navigation);

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    console.log(event);
    setValue(newValue);
    if (newValue === "ITEMS") {
      navigation.openDialogCustom();
    }
    if (newValue === "ORDER") {      
      handleGoToOrder();
    }
  }; 

  const handleGoToOrder = () => {
    navigate(`/${PrivateRoutes.PRIVATE}/${PrivateRoutes.ORDER}`, { replace: true })
}

  if (!isMobile) return <></>;
  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, mt: 2 }}
      elevation={5}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Ordenes"
          value="ORDER"
          icon={<RestoreIcon />}
        />
        {/* <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        /> */}
        <BottomNavigationAction
          label="Items"
          value="ITEMS"
          icon={
            <Badge badgeContent={totalItems} color="secondary">
              <AddShoppingCartIcon />
            </Badge>
          }
        />
      </BottomNavigation> 
    </Paper>
  );
}

export default CustomBottomNavigation