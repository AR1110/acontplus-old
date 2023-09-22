CREATE OR ALTER FUNCTION ufnGetPromotionDay(@days NVARCHAR(MAX), @today VARCHAR(15))
RETURNS @dayFilter TABLE (
	[day]		VARCHAR(15),
	startHour	VARCHAR(5),
	endHour		VARCHAR(5)
)
AS
BEGIN
	INSERT INTO @dayFilter([day], startHour, endHour)
	
    SELECT TRIM(LOWER(descripcion)), horaInicio, horaFin
	FROM OPENJSON(@days) 
	WITH(
		descripcion VARCHAR(15)	'$.descripcion'
		,horaInicio VARCHAR(5)	'$.horaInicio'
		,horaFin	VARCHAR(5)	'$.horaFin'
        ,checked    BIT         '$.checked'
	)
    WHERE checked = 1
    AND LOWER(TRIM(descripcion)) = @today   

	RETURN;
END