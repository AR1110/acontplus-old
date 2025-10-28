USE Acontplus
GO
--- Author: Ignacio 
--- Date: 2023-08-15
--- Description: View for list
CREATE OR ALTER VIEW Restaurant.v_Floor  WITH SCHEMABINDING
AS

SELECT id				= rf.Id
		,code			= rf.Code
		,description	= rf.Description
		,capacity		= rf.Capacity
		,createdAt		= rf.CreatedAt
		,updatedAt		= rf.UpdatedAt
		,rf.IsActive
		,rf.IsDeleted
		,codEstab		= rf.CodEstab
		,rf.CreatedByUserId
FROM Restaurant.[Floor] rf



