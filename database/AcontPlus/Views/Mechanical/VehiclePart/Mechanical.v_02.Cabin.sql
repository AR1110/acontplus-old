USE [Acontplus]
GO
USE AcontPlus
GO
CREATE OR ALTER VIEW Mechanical.v_Cabin WITH SCHEMABINDING AS (
	SELECT it.Id
		  ,JSON_VALUE(dj.[value],'$.part') as Part
		  ,IIF(JSON_VALUE(dj.[value],'$.status') =  1,'X','') as Good
		  ,IIF(JSON_VALUE(dj.[value],'$.status') =  2,'X','') as Regular
		  ,IIF(JSON_VALUE(dj.[value],'$.status') =  3,'X','') as Bad
		  ,JSON_VALUE(dj.[value],'$.obs') as Obs
	FROM Mechanical.Inspection it WITH (NOLOCK)
	CROSS APPLY OPENJSON(it.Cabin) dj
 )
