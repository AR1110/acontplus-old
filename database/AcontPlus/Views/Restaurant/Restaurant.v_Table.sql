GO
USE Acontplus
GO
CREATE OR ALTER VIEW Restaurant.v_Table
AS

SELECT Id = rt.Id
		,numberTable	 = rt.NumberTable
		,description	 = rt.Description
		,capacity		 = rt.Capacity
		,createdAt		 = rt.CreatedAt
		,updatedAt		 = rt.UpdatedAt
		,enabled		 = rt.Enabled
		,deleted		 = rt.Deleted
		,userId			 = rt.UserId
		,roomId			 = rt.RoomId	
		,roomDescription = rr.Description
FROM Restaurant.[Table] rt
INNER JOIN Restaurant.Room rr ON rr.Id = rt.RoomId