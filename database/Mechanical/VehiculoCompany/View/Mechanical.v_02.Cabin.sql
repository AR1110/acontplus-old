USE [Acontplus]
GO
CREATE OR ALTER VIEW Mechanical.v_Cabin WITH SCHEMABINDING AS (
	SELECT it.Id
		  ,JSON_VALUE(dj.[value],'$.description')             as Part
		  ,IIF(JSON_VALUE(dj.[value],'$.status') =  1,'X','') as Good
		  ,IIF(JSON_VALUE(dj.[value],'$.status') =  2,'X','') as Regular
		  ,IIF(JSON_VALUE(dj.[value],'$.status') =  3,'X','') as Bad
		  ,JSON_VALUE(dj.[value],'$.obs')                     as Obs
          ,JSON_VALUE(dj.[value],'$.status')                  as [Status]
	FROM Mechanical.Inspection it WITH (NOLOCK)
	CROSS APPLY OPENJSON(it.Cabin) dj
 )
