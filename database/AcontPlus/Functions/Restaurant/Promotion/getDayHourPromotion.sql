CREATE OR ALTER FUNCTION ufnGetPromotionDay(@days NVARCHAR(MAX), @today INT)
RETURNS @dayFilter TABLE (
	diaSemana   INT,
	startHour	VARCHAR(5),
	endHour		VARCHAR(5)
)
AS
BEGIN
	INSERT INTO @dayFilter(diaSemana, startHour, endHour)
	
    SELECT diaSemana, horaInicio, horaFin
	FROM OPENJSON(@days) 
	WITH(
		 diaSemana  INT	        '$.diaSemana'
		,horaInicio VARCHAR(5)	'$.horaInicio'
		,horaFin	VARCHAR(5)	'$.horaFin'
        ,checked    BIT         '$.checked'
	)
    WHERE checked = 1
    AND diaSemana = @today  

	RETURN;
END