



IF OBJECT_ID('Compras.CompraNoHabitual_Get')IS NOT NULL
	DROP PROCEDURE Compras.CompraNoHabitual_Get
GO 

--Autor: Emilio Senguana 
--Date: 14-03-2023

CREATE PROCEDURE Compras.CompraNoHabitual_Get @idRol INT, @json VARCHAR(700)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @typeList INT = 0;
	DECLARE @idEntidad INT;
	DECLARE @idUsuarioRol INT 
	DECLARE @params VARCHAR(400) = ''
	
	DECLARE @codEstab VARCHAR(100)
	DECLARE @byProveedor INT
	DECLARE @checkBoxDate BIT
	DECLARE @typeDate VARCHAR(5)
	DECLARE @dateStart DATETIME
	DECLARE @dateEnd DATETIME
	DECLARE @checkBoxEstado BIT
	DECLARE @byEstado INT	

	SELECT
		@codEstab     = codEstab,
		@typeList     = typeList, 
		@byProveedor  = byProveedor, 
		@checkBoxDate = checkBoxDate, 
		@typeDate     = typeDate, 
		@dateStart    = dateStart, 
		@dateEnd      = dateEnd, 
		@checkBoxEstado = checkBoxEstado, 
		@byEstado     = byEstado
	
	FROM OPENJSON(@json) WITH(		
								typeList INT '$.typeList',		
								codEstab VARCHAR(100) '$.codEstab',
								byProveedor INT '$.byProveedor',

								checkBoxDate BIT '$.checkBoxDate',
								typeDate VARCHAR(5) '$.typeDate',
								dateStart DATETIME '$.dateStart',
								dateEnd DATETIME '$.dateEnd',

								checkBoxEstado BIT '$.checkBoxEstado',
								byEstado INT '$.byEstado'		
							)

	
	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol


	IF @typeList = 2
	BEGIN
		
		--Establecimiento 
		SELECT ea.codEstab_Asig, ea.predeterminado, e.*
		FROM Config.Estab_Asig         ea WITH (NOLOCK) 
		INNER JOIN Sri.Establecimiento e WITH (NOLOCK)  ON ea.codEstab = e.codEstab
		WHERE idUsuarioRol = @idRol
		ORDER BY ea.predeterminado DESC


		--Punto Emisión
		SELECT  pa.idPtoEmi_asig, ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado, pa.estado
		FROM Config.PtoEmi_Asig      pa  WITH (NOLOCK) 
		INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
		INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
 		WHERE ea.idUsuarioRol = @idRol

		--Configuracion Decimal 
		SELECT nroPrecio, nroCantidad, nroIva, nroDescuentoDetalle, nroTotalDetalle, nroTotalSubTotal, nroDescuento, nroIce
		FROM Config.CantidadDecimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTransaccion = 'C'

		--Tipo Iva
		SELECT idTipoIva, descripcion, tarifa = porcentaje, codigoPorcentaje = CAST(codigoPorcentaje AS VARCHAR)
		FROM dbo.TipoIva WITH (NOLOCK) 
		WHERE estado = 1

		-- Tiempo Crédito 
		SELECT idTiempoCredito, descripcion, diasCredito, numeroCuota 
		FROM TiempoCredito WITH (NOLOCK) 
		WHERE idEntidad = @idEntidad AND gestion = 0 AND estado = 1
		RETURN 
	END 


	IF @typeList = 3
		BEGIN 
			SELECT * FROM Bodega WHERE codEstab = @codEstab
			RETURN 
		END
		




END 
