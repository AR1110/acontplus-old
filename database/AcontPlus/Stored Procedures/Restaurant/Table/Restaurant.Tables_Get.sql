USE ACONTPLUS
GO
--AUTOR: IVAN PAZ
--DATE: 2023-07-17
--DESCRIPTION: SP FOR GET TABLES
CREATE OR ALTER PROCEDURE Restaurant.Tables_Get @userRoleId INT,
												@json NVARCHAR(MAX)												
AS
BEGIN	
	DECLARE @codEstab VARCHAR(15)

	SELECT @codEstab = codEstab 
	FROM OPENJSON(@json)WITH (codEstab VARCHAR(15) '$.codEstab')

	print @codestab
	SELECT t.*
		,r.[Description] as 'table'
		,f.[Description] as 'floor'
	FROM Restaurant.[Table] t
		INNER JOIN Restaurant.Room r WITH(NOLOCK) ON t.RoomId = r.Id
		INNER JOIN Restaurant.[Floor] f WITH(NOLOCK) ON r.FloorId = f.Id 
	WHERE f.codEstab = @codEstab
	AND t.Deleted IS NULL
END