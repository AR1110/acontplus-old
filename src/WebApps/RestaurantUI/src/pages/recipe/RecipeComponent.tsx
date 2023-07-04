import { Recipe } from "@/core/models";
import { recipeService } from "@/core/services";
import { Breadcrumbs } from "@/layouts/shared";
import { useEffect, useState } from "react";
import { RecipeDialog } from "./components";

interface RecipeState {
  recipes: Array<Recipe>;
  dialogOpen: boolean;
}

export default function RecipeComponent() {
  const [recipes, setRecipes] = useState<RecipeState["recipes"]>([]);
  const [dialogOpen, setDialogOpen] =
    useState<RecipeState["dialogOpen"]>(false);

  const getRecipes = () => {
    recipeService.getRecipes().then((response) => {
      console.log(response);
      setRecipes(response.payload as Recipe[]);
    });
  };
  useEffect(() => {
    getRecipes();
  }, []);

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
  };
  // const handleClose = () => {
  //   setOpen(false);
  // };

  return (
    <>
      <Breadcrumbs
        title="Recetas"
        textButton="Añadir"
        handleClick={handleOpenDialog}
      />
      <RecipeDialog open={dialogOpen} onClose={handleCloseDialog} />
    </>
  );
}
