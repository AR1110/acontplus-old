import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Badge, Paper } from "@mui/material";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { saleStore } from "@/stores/saleStore";
import { SyntheticEvent, useState } from "react";
import ItemDialog from "./ItemDialog";

interface CBNProps {
  isMobile: boolean;
}

export default function CustomBottomNavigation({ isMobile }: CBNProps) {
  const [value, setValue] = useState("recents");
  const [open, setOpen] = useState(false);
  const totalItems = saleStore((state) => state.totalItems);
  const handleChange = (event: SyntheticEvent, newValue: string) => {
    console.log(event);
    setValue(newValue);
    if (newValue === "ITEMS") {
      setOpen(true);
    }
  };
  const handleDialogClose = () => {
    setOpen(false);
  };
  if (!isMobile) return <></>;

  return (
    <Paper
      sx={{ position: "fixed", bottom: 0, left: 0, right: 0, mt: 2 }}
      elevation={5}
    >
      <BottomNavigation value={value} onChange={handleChange}>
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
        />
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
      <ItemDialog open={open} handleClose={handleDialogClose} />
    </Paper>
  );
}
