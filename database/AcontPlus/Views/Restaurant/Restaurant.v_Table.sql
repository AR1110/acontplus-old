GO
USE Acontplus
GO
CREATE OR ALTER VIEW Restaurant.v_Table WITH SCHEMABINDING
AS

SELECT  rt.Id
    ,rt.NumberTable
    ,rt.[Description]
    ,rt.capacity
    ,rt.CreatedAt
    ,rt.UpdatedAt
    ,rt.[Enabled]
    ,rt.[Deleted]
    ,rt.[UserId]
    ,rt.RoomId	
    ,roomDescription = rr.[Description]
FROM Restaurant.[Table] rt
INNER JOIN Restaurant.Room rr ON rr.Id = rt.RoomId