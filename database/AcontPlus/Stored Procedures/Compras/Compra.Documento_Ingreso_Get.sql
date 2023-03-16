USE [AcontPlus]
GO 

-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 03/16/2023
-- Description:	SP para listar las compras que no tiene documento validado por el sri.
-- =============================================
IF OBJECT_ID(N'Compra.Documento_Ingreso_Get', N'P') IS NOT NULL
DROP PROCEDURE Compra.Documento_Ingreso_Get
GO
CREATE PROCEDURE Compra.Documento_Ingreso_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @typeList INT = 0
	DECLARE @idEntidad INT
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

	
	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol


	IF @typeList = 2
	BEGIN
		
		--Establecimiento 
		SELECT ea.codEstab_Asig, ea.predeterminado, e.*
		FROM Config.Estab_Asig         ea WITH (NOLOCK) 
		INNER JOIN Sri.Establecimiento e WITH (NOLOCK)  ON ea.codEstab = e.codEstab
		WHERE idUsuarioRol = @idUsuarioRol
		ORDER BY ea.predeterminado DESC


		--Punto Emisión
		SELECT  pa.idPtoEmi_asig, ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado, pa.estado
		FROM Config.PtoEmi_Asig      pa  WITH (NOLOCK) 
		INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
		INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
 		WHERE ea.idUsuarioRol = @idUsuarioRol

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
END
GO
