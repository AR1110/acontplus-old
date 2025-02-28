
import {floorProvider, floorUseCaseProvider} from "@restaurant/providers/floor.provider";
import {tableProvider, tableUseCaseProvider} from "@restaurant/providers/table.provider";
import {roomProvider, roomUseCaseProvider} from "@restaurant/providers/room.provider";

export const restaurantProvider = [
   //Start Floor
  floorUseCaseProvider,
  floorProvider,
  //End Floor

  //start table
  tableUseCaseProvider,
  tableProvider,
  //end table

  //start table
  roomUseCaseProvider,
  roomProvider
  //end table
]
