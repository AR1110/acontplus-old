export const groupRoomTableUtil = function (tables: any) {

  const groupedItemsArray = Object.values(tables.reduce((acc: any, item: any) => {
    const key = `${item.floor}-${item.roomDescription}`;
    if (!acc[key]) {
      acc[key] = {
        name: key,
        floorName: item.floor,
        roomName: item.roomDescription,
        tables: []
      };
    }
    acc[key].tables.push(item);
    return acc;
  }, {} as any));
  return groupedItemsArray
}
