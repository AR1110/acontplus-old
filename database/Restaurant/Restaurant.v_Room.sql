USE Acontplus
GO
--- Author: Ignacio 
--- Date: 2023-08-15
--- Description: View for list
CREATE OR ALTER VIEW Restaurant.v_Room  WITH SCHEMABINDING
AS

  SELECT id					= rr.Id
		,code				= rr.Code
		,description		= rr.Description
		,capacity			= rr.Capacity
		,createdAt			= rr.CreatedAt
		,updatedAt			= rr.UpdatedAt
			,enabled		= rr.IsActive
		,deleted		= rr.IsDeleted
		,userId				= rr.UserId
		,floorId			= rr.FloorId
		,floorDescription	= rf.Description
        ,rf.codEstab
FROM Restaurant.Room rr
INNER JOIN Restaurant.[Floor] rf ON rf.Id = rr.FloorId