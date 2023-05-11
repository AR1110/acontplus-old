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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Compra.Factura_Get_Data_Form', N'P') IS NOT NULL
DROP PROCEDURE Compra.Factura_Get_Data_Form
GO
CREATE PROCEDURE Compra.Factura_Get_Data_Form @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @jsonConfigDecimal AS VARCHAR(MAX)
	DECLARE @configDecimal AS TABLE (
		nroPrecio INT NOT NULL
	   ,nroCantidad INT NOT NULL
	   ,nroIva INT NOT NULL
	   ,nroDescuentoDetalle INT NOT NULL
	   ,nroTotalDetalle INT NOT NULL
	   ,nroTotalSubTotal INT NOT NULL
	   ,nroDescuento INT NOT NULL
	   ,nroIce INT NOT NULL
	)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	SELECT TOP 1 @jsonConfigDecimal = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD'

	INSERT INTO @configDecimal(nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle ,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce)
						SELECT nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle ,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce
						FROM OPENJSON(@jsonConfigDecimal)
						WITH (codTransaccion      VARCHAR(5) '$.codTransaccion'
							 ,nroPrecio                  INT '$.nroPrecio'
							 ,nroCantidad                INT '$.nroCantidad'
							 ,nroIva                     INT '$.nroIva'
							 ,nroDescuentoDetalle        INT '$.nroDescuentoDetalle'
							 ,nroTotalDetalle            INT '$.nroTotalDetalle'
							 ,nroTotalSubTotal           INT '$.nroTotalSubTotal'
							 ,nroDescuento               INT '$.nroDescuento'
							 ,nroIce                     INT '$.nroIce') as dt
					   WHERE dt.codTransaccion = 'C'

	SELECT 
		es.codEstab_Asig
	   ,es.codEstab
	   ,es.predeterminado
	   ,sr.nombreComercial
	   ,sr.estab
	   ,sr.actividad
	FROM Config.Estab_Asig es WITH (NOLOCK) 
	INNER JOIN Sri.Establecimiento sr WITH (NOLOCK) ON sr.codEstab = es.codEstab
	WHERE es.idUsuarioRol = @idRol 
	ORDER BY es.predeterminado DESC

	SELECT 
		nroPrecio
	   ,nroCantidad
	   ,nroIva
	   ,nroDescuentoDetalle
	   ,nroTotalDetalle
	   ,nroTotalSubTotal
	   ,nroDescuento
	   ,nroIce
	FROM @configDecimal

	SELECT 
		idTipoIva
	   ,descripcion
	   ,tarifa = porcentaje
	   ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
	FROM dbo.TipoIva WITH (NOLOCK) 
	WHERE estado = 1

	SELECT 
		idTiempoCredito
	   ,descripcion
	   ,diasCredito
	   ,numeroCuota 
	FROM TiempoCredito WITH (NOLOCK) 
	WHERE idEntidad = @idEntidad AND gestion = 0 AND estado = 1

	SELECT 
		 idCategoriaCompra
		,descripcion
	FROM dbo.CategoriaCompra 
	WHERE idEntidad = @idEntidad AND estado = 1
	ORDER BY idCategoriaCompra DESC

	SELECT idSustentoTributario, descripcion = codigo + ' - ' + descripcion FROM SustentoTributario WHERE estado = 1

	SELECT * FROM SustentoTributario

END
GO
