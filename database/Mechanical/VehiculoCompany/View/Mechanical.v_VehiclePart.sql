USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_VehiclePart WITH SCHEMABINDING AS (
	SELECT vp.Id
          ,vp.[Description] as Part
		  ,vp.Code as CodePart
          ,vp.[Enabled]
          ,vp.Deleted
		  ,tp.[Description] as TypePart
          ,tp.Code as CodeTypePart
	FROM Mechanical.VehiclePart           vp WITH (NOLOCK)
	INNER JOIN Mechanical.VehiclePartType tp WITH (NOLOCK) ON tp.Id = vp.VehiclePartTypeId
 )