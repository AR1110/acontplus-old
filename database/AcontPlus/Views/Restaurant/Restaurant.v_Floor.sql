USE Acontplus
GO
--- Author: Ignacio 
--- Date: 2023-08-15
--- Description: View for list
CREATE OR ALTER VIEW Restaurant.v_Floor
AS

SELECT id				= rf.Id
		,code			= rf.Code
		,description	= rf.Description
		,capacity		= rf.Capacity
		,createdAt		= rf.CreatedAt
		,updatedAt		= rf.UpdatedAt
		,enabled		= rf.Enabled
		,deleted		= rf.Deleted
		,codEstab		= rf.CodEstab
		,userId			= rf.UserId
FROM Restaurant.[Floor] rf



