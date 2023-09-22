CREATE OR ALTER FUNCTION ufnGetDayHourPromotion (@days NVARCHAR(MAX))
RETURNS @dayFilter TABLE (
	[day]		VARCHAR(15),
	startHour	VARCHAR(5),
	endHour		VARCHAR(5)
)
AS
BEGIN	
	INSERT INTO @dayFilter([day], startHour, endHour)
	
    SELECT LOWER(descripcion), horaInicio, horaFin
	FROM OPENJSON(@days) 
	WITH(
		descripcion VARCHAR(15)	'$.descripcion'
		,horaInicio VARCHAR(5)	'$.horaInicio'
		,horaFin	VARCHAR(5)	'$.horaFin'
        ,checked    BIT         '$.checked'
	)
    WHERE checked = 1

	RETURN;
END