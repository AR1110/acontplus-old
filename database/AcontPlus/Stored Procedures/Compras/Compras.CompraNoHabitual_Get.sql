



IF OBJECT_ID('Compras.CompraNoHabitual_Get')IS NOT NULL
	DROP PROCEDURE Compras.CompraNoHabitual_Get
GO 

--Autor: Emilio Senguana 
--Date: 14-03-2023

CREATE PROCEDURE Compras.CompraNoHabitual_Get @json VARCHAR(700)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @typeList INT = 0;
	DECLARE @idEntidad INT;
	DECLARE @idUsuarioRol INT 
	DECLARE @params VARCHAR(400) = ''

	DECLARE @paramsTable AS TABLE(
								typeList INT, 
								idUsuarioRol INT, 
								byProveedor INT, 
								checkBoxDate BIT ,
								typeDate VARCHAR(5),
								dateStart DATETIME,
								dateEnd DATETIME,
								checkBoxEstado BIT,
								byEstado INT
							   )

	INSERT INTO @paramsTable (typeList, idUsuarioRol, byProveedor, checkBoxDate, typeDate, dateStart, dateEnd, checkBoxEstado, byEstado)	
	SELECT 	* FROM OPENJSON(@json) WITH(
										typeList INT '$.typeList',
										idUsuarioRol INT '$.idUsuarioRol',
										byProveedor INT '$.byProveedor',

										checkBoxDate BIT '$.checkBoxDate',
										typeDate VARCHAR(5) '$.typeDate',
										dateStart DATETIME '$.dateStart',
										dateEnd DATETIME '$.dateEnd',

										checkBoxEstado BIT '$.checkBoxEstado',
										byEstado INT '$.byEstado'		
										)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = (SELECT TOP 1 idUsuarioRol FROM @paramsTable)

	IF EXISTS(SELECT TOP 1 typeList FROM @paramsTable WHERE typeList = 1)
	BEGIN
		
		--Establecimiento 
		SELECT ea.codEstab_Asig, ea.predeterminado, e.*
		FROM Config.Estab_Asig         ea WITH (NOLOCK) 
		INNER JOIN Sri.Establecimiento e WITH (NOLOCK)  ON ea.codEstab = e.codEstab
		WHERE idUsuarioRol = (SELECT TOP 1 idUsuarioRol FROM @paramsTable)
		ORDER BY ea.predeterminado DESC


		--Punto Emisión
		SELECT pa.idPtoEmi_asig, ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado, pa.estado
		FROM Config.PtoEmi_Asig      pa  WITH (NOLOCK) 
		INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
		INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
 		WHERE ea.idUsuarioRol = (SELECT TOP 1 idUsuarioRol FROM @paramsTable)	

		SELECT nroPrecio, nroCantidad, nroIva, nroDescuentoDetalle, nroTotalDetalle, nroTotalSubTotal, nroDescuento, nroIce
		FROM Config.CantidadDecimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTransaccion = 'C'

		SELECT idTipoIva, descripcion, tarifa = porcentaje, codigoPorcentaje = CAST(codigoPorcentaje AS VARCHAR)
		FROM dbo.TipoIva WITH (NOLOCK) 
		WHERE estado = 1

		SELECT idTiempoCredito, descripcion, diasCredito, numeroCuota 
		FROM TiempoCredito WITH (NOLOCK) 
		WHERE idEntidad = @idEntidad AND gestion = 0 AND estado = 1
		RETURN 
	END 




END 
