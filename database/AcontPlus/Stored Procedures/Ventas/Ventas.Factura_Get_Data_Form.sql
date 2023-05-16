
USE [AcontPlus]
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
IF OBJECT_ID(N'Ventas.Factura_Get_Data_Form', N'P') IS NOT NULL
DROP PROCEDURE Ventas.Factura_Get_Data_Form 
GO
CREATE PROCEDURE Ventas.Factura_Get_Data_Form @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @idPolitica INT 	
	DECLARE @jsonConfigDecimal AS VARCHAR(MAX)
	DECLARE @jsonConfigVentas AS VARCHAR(MAX)
	
	DECLARE @configVentas AS TABLE (
		idCliente        INT NULL
	   ,idArticulo       INT NULL
	   ,searchCode       BIT NOT NULL
	   ,printerAutomatic BIT NOT NULL
	   ,payAutomatic     BIT NOT NULL
	)

	DECLARE @configDecimal AS TABLE (
		nroPrecio INT NOT NULL
	   ,nroCantidad INT NOT NULL
	   ,nroIva INT NOT NULL
	   ,nroDescuentoDetalle INT NOT NULL
	   ,nroTotalDetalle INT NOT NULL
	   ,nroTotalSubTotal INT NOT NULL
	   ,nroDescuento INT NOT NULL
	   ,nroIce INT NOT NULL
	   ,importeTotal INT NOT NULL
	)

	SELECT @idEntidad = idEntidad, @idPolitica = idRol FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol	

	SELECT TOP 1 @jsonConfigVentas = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CV'

	SELECT TOP 1 @jsonConfigDecimal = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD'

	INSERT INTO @configVentas (idCliente,idArticulo,searchCode,printerAutomatic,payAutomatic)
						SELECT idCliente,idArticulo,searchCode,printerAutomatic,payAutomatic
						FROM OPENJSON(@jsonConfigVentas)
						WITH (idCliente        INT '$.idCliente'
							 ,idArticulo       INT '$.idArticulo'
							 ,searchCode       BIT '$.searchCode'
							 ,printerAutomatic BIT '$.printerAutomatic'
							 ,payAutomatic     BIT '$.payAutomatic') as dt
	
	INSERT INTO @configDecimal(nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle ,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce,importeTotal)
						SELECT nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle ,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce,importeTotal
						FROM OPENJSON(@jsonConfigDecimal)
						WITH (codTransaccion      VARCHAR(5) '$.codTransaccion'
							 ,nroPrecio                  INT '$.nroPrecio'
							 ,nroCantidad                INT '$.nroCantidad'
							 ,nroIva                     INT '$.nroIva'
							 ,nroDescuentoDetalle        INT '$.nroDescuentoDetalle'
							 ,nroTotalDetalle            INT '$.nroTotalDetalle'
							 ,nroTotalSubTotal           INT '$.nroTotalSubTotal'
							 ,nroDescuento               INT '$.nroDescuento'
							 ,nroIce                     INT '$.nroIce'
							 ,importeTotal               INT '$.importeTotal') as dt
					   WHERE dt.codTransaccion = 'V'

	SELECT 
		es.codEstab_Asig
	   ,es.codEstab
	   ,es.predeterminado
	   ,sr.nombreComercial
	   ,sr.estab
	   ,sr.actividad
	FROM Config.Estab_Asig es WITH (NOLOCK) 
	INNER JOIN Sri.Establecimiento sr WITH (NOLOCK) ON sr.codEstab = es.codEstab
	WHERE es.idUsuarioRol = @idRol ORDER BY es.predeterminado DESC

	SELECT 
		nroPrecio
	   ,nroCantidad
	   ,nroIva
	   ,nroDescuentoDetalle
	   ,nroTotalDetalle
	   ,nroTotalSubTotal
	   ,nroDescuento
	   ,nroIce
	   ,importeTotal
	FROM @configDecimal

	SELECT 
		porcentajeIva
	   ,porcentajeDescuento
	   ,descuento
	   ,totalDescuento
	   ,ice 
	FROM dbo.ConfigVentaDetalle WITH (NOLOCK)
	WHERE idEntidad = @idEntidad

	SELECT 
		idTipoIva
	   ,descripcion
	   ,tarifa = porcentaje
	   ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
	FROM dbo.TipoIva WITH (NOLOCK) 
	WHERE estado = 1

	SELECT 
		idTarifa
	   ,descripcion
	   ,predeterminada
	   ,codigo 
	FROM Tarifa WITH (NOLOCK) 
	WHERE idEntidad = @idEntidad AND estado = 1

	SELECT 
		idTiempoCredito
	   ,descripcion
	   ,diasCredito
	   ,numeroCuota 
	FROM TiempoCredito WITH (NOLOCK) 
	WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

	SELECT 
		a.idArticulo
	   ,a.codigo
	   ,a.descripcion
	FROM @configVentas gs 
	INNER JOIN Articulo a WITH (NOLOCK) ON a.idArticulo = gs.idArticulo

	SELECT 
		cl.idCliente
	   ,cl.numeroIdentificacion
	   ,cl.nombreComercial
	   ,cl.nombreFiscal
	   ,cl.direccion
	   ,cl.correo
	FROM @configVentas gs
	INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = gs.idCliente


	SELECT 
	 searchCode,
	 printerAutomatic,
	 payAutomatic
	FROM @configVentas gs

	--Permisos 
	SELECT 
	 jsonPermission
	FROM Config.UserPermission WHERE idUsuarioRol = @idRol AND codModule='V'

	SELECT a.leer, a.crear, a.editar FROM Acceso a
	INNER JOIN SubMenu sm WITH(NOLOCK) ON sm.idSubMenu = a.idSubMenu
	WHERE sm.codTemp ='ART' AND a.idPolitica = @idPolitica

END
GO
