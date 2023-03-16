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

	
	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	IF @typeList = 1 
		BEGIN
			SELECT 
				 serieComprobante = es.estab+'-'+pt.ptoEmi+'-'+Helper.F_Auto_Sequential(di.secuencial)
				,fechaEmision     = FORMAT(di.fechaEmision,'yyyy-MM-dd')
				,nombreFiscal     = pr.nombreFiscal
				,importeTotal     = di.importeTotal
				,usuario          = us.nombreUsuario
			FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = di.idEstablecimiento
			INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision    = di.idPuntoEmision
			INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor       = di.idProveedor
			INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = di.idUsuario
			WHERE di.idEntidad = @idEntidad
		END 

	IF @typeList = 2
		BEGIN
		
			--=================================Establecimiento====================================================== 
			SELECT ea.codEstab, ea.predeterminado, es.nombreComercial,es.estab
			FROM Config.Estab_Asig         ea WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON ea.codEstab = es.codEstab
			WHERE idUsuarioRol = @idUsuarioRol
			ORDER BY ea.predeterminado DESC


			--================================Punto Emisión==========================================================
			SELECT ea.codEstab,pa.predeterminado,pe.ptoEmi
			FROM Config.PtoEmi_Asig       pa WITH (NOLOCK) 
			INNER JOIN Config.Estab_Asig  ea WITH (NOLOCK) ON ea.codEstab_Asig  = pa.codEstab_Asig
			INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON pa.idPuntoEmision = pe.idPuntoEmision
 			WHERE ea.idUsuarioRol = @idUsuarioRol

			--================================Bodegas=================================================================
			SELECT ea.codEstab,ab.predeterminado,bo.descripcion
			FROM Config.Bodeg_Asig        ab WITH (NOLOCK) 
			INNER JOIN Config.Estab_Asig  ea WITH (NOLOCK) ON ea.codEstab_Asig = ab.codEstab_Asig
			INNER JOIN dbo.Bodega         bo WITH (NOLOCK) ON bo.idBodega      = ab.idBodega
 			WHERE ea.idUsuarioRol = @idUsuarioRol


			--==============================Configuracion Decimal============================================================== 
			SELECT nroPrecio, nroCantidad, nroIva, nroDescuentoDetalle, nroTotalDetalle, nroTotalSubTotal, nroDescuento, nroIce
			FROM Config.CantidadDecimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTransaccion = 'C'


			--=============================Impuestos===========================================================================
			SELECT codigo = codImpuesto, codigoPorcentaje = codigo, descripcion = 'Iva '+descripcion,tarifa = porcentaje 
			FROM sri.TarifaImpuesto WHERE estado = 1 AND codImpuesto = 2

			--============================Impuestos por tipo de Actividad======================================================
			SELECT ea.codEstab,codigoPorcentaje = ae.codTarifaImpuesto,tarifa = ae.porcentaje
			FROM Config.Estab_Asig            ea WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON ea.codEstab = es.codEstab
			INNER JOIN Sri.ActividadEconomica ae WITH (NOLOCK) ON ae.codigo   = es.actividad
			WHERE idUsuarioRol = @idUsuarioRol
	END 
END
GO
