
import {floorProvider, userLoginUseCaseProvider} from "@restaurant/providers/floor.provider";

export const restaurantProvider = [
   //Start Floor
  userLoginUseCaseProvider,
  floorProvider
  //End Floor
]
