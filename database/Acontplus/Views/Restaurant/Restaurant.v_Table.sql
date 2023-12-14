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
    ,rt.Assigned
    ,rr.FloorId
    ,f.[Description] as 'Floor'
    ,f.CodEstab
    ,e.ruc
FROM Restaurant.[Table] rt WITH (NOLOCK)
INNER JOIN Restaurant.Room rr WITH (NOLOCK) ON rr.Id = rt.RoomId
INNER JOIN Restaurant.[Floor] f WITH (NOLOCK) ON rr.FloorId = f.Id
INNER JOIN Sri.Establecimiento e WITH (NOLOCK) ON f.CodEstab = e.codEstab