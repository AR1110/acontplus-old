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
				 di.idDocumentoIngreso
				,serieComprobante = es.estab+'-'+pt.ptoEmi+'-'+Helper.F_Auto_Sequential(di.secuencial)
				,fechaEmision     = FORMAT(di.fechaEmision,'yyyy-MM-dd')
				,nombreFiscal     = pr.nombreFiscal
				,importeTotal     = di.importeTotal
				,estado           = IIF(di.estado = 0, 'Anulado','Activo')
				,usuario          = us.nombreUsuario
				,colorRow         = IIF(di.estado = 0, 'rojo','')
			FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = di.idEstablecimiento
			INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision    = di.idPuntoEmision
			INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor       = di.idProveedor
			INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = di.idUsuario
			WHERE di.idEntidad =  @idEntidad
			ORDER BY di.idDocumentoIngreso DESC
		END 

	IF @typeList = 2
		BEGIN

			--=================================Establecimiento====================================================== 
			SELECT es.idEstablecimiento,ea.codEstab, ea.predeterminado, es.nombreComercial,es.estab
			FROM Config.Estab_Asig         ea WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON ea.codEstab = es.codEstab
			WHERE idUsuarioRol = @idUsuarioRol
			ORDER BY ea.predeterminado DESC


			--================================Punto Emisión==========================================================
			SELECT pe.idPuntoEmision,ea.codEstab,pa.predeterminado,ptoEmi = es.estab+'-'+pe.ptoEmi,puntoEmi= pe.ptoEmi 
			FROM Config.PtoEmi_Asig        pa WITH (NOLOCK) 
			INNER JOIN Config.Estab_Asig   ea WITH (NOLOCK) ON ea.codEstab_Asig  = pa.codEstab_Asig
			INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pa.idPuntoEmision = pe.idPuntoEmision
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = ea.codEstab
 			WHERE ea.idUsuarioRol = @idUsuarioRol

			--================================Bodegas=================================================================
			SELECT bo.idBodega,ea.codEstab,ab.predeterminado,bo.descripcion
			FROM Config.Bodeg_Asig        ab WITH (NOLOCK) 
			INNER JOIN Config.Estab_Asig  ea WITH (NOLOCK) ON ea.codEstab_Asig = ab.codEstab_Asig
			INNER JOIN dbo.Bodega         bo WITH (NOLOCK) ON bo.idBodega      = ab.idBodega
 			WHERE ea.idUsuarioRol = @idUsuarioRol


			--==============================Configuracion Decimal============================================================== 
			SELECT nroPrecio, nroCantidad, nroIva, nroDescuentoDetalle, nroTotalDetalle, nroTotalSubTotal, nroDescuento, nroIce
			FROM Config.CantidadDecimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTransaccion = 'C'


			--=============================Impuestos===========================================================================
			SELECT codImpuesto = codImpuesto, codigoPorcentaje = codigo, descripcion = 'Iva '+descripcion,tarifa = porcentaje 
			FROM sri.TarifaImpuesto WHERE estado = 1 AND codImpuesto = 2

			--============================Impuestos por tipo de Actividad======================================================
			SELECT ea.codEstab,codigoPorcentaje = ae.codTarifaImpuesto,tarifa = ae.porcentaje
			FROM Config.Estab_Asig            ea WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON ea.codEstab = es.codEstab
			INNER JOIN Sri.ActividadEconomica ae WITH (NOLOCK) ON ae.codigo   = es.actividad
			WHERE idUsuarioRol = @idUsuarioRol

			--===============================Inventario========================================================================
			SELECT TOP 1 inventory =  llevaInventario FROM Config.GestionSistema WITH (NOLOCK) WHERE idEntidad = @idEntidad
	END 

	IF @typeList = 3
		BEGIN
			DECLARE @idPuntoEmision AS INT 
			
			DECLARE @secuencial AS INT 

			SELECT @idPuntoEmision = idPuntoEmision FROM OPENJSON(@json) WITH (idPuntoEmision INT '$.idPuntoEmision')

			SELECT @secuencial = COUNT(*)+1 FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

			SELECT serieComprobante = es.estab+'-'+pe.ptoEmi+'-'+Helper.F_Auto_Sequential(@secuencial) 
			FROM dbo.PuntoEmision pe WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = pe.codEstab
			WHERE pe.idPuntoEmision = @idPuntoEmision
		END 

	IF @typeList = 4
		BEGIN
			DECLARE @idDocumentoIngreso AS INT
			DECLARE @subTotalIva AS NUMERIC(18,5)
			DECLARE @subTotalIvaCero AS NUMERIC(18,5)
			DECLARE @subTotalExentoIva AS NUMERIC(18,5)
			DECLARE @subTotalNoObjetoIva AS NUMERIC(18,5)
			DECLARE @subTotalNetoIva AS NUMERIC(18,5)
			DECLARE @subTotalNetoIvaCero AS NUMERIC(18,5)
			DECLARE @subTotalNetoExentoIva AS NUMERIC(18,5)
			DECLARE @subTotalNetoNoObjetoIva AS NUMERIC(18,5)
			DECLARE @iva AS NUMERIC(18,5)
			DECLARE @decuento AS NUMERIC(18,5)

			DECLARE @taxes AS TABLE (
				 descuento NUMERIC(18,5) NOT NULL
				,codigoPorcentaje VARCHAR(5) NOT NULL
				,tarifa NUMERIC(18,5) NOT NULL
				,baseImponible NUMERIC(18,5) NOT NULL
				,valor NUMERIC(18,5) NOT NULL
			)
				
			SELECT @idDocumentoIngreso = idDocumentoIngreso FROM OPENJSON(@json) WITH (idDocumentoIngreso INT '$.idDocumentoIngreso')


			INSERT INTO @taxes (descuento,codigoPorcentaje,tarifa,baseImponible,valor)
			SELECT 
				 descuento = (SELECT ISNULL(SUM(descuento),0) FROM Compra.Documento_Ingreso_Detail dt WHERE dt.idDocumentoIngreso = tX.idDocumentoIngreso AND dt.codigoPorcentaje  = tx.codigoPorcentaje)
				,tx.codigoPorcentaje
				,tx.tarifa
				,tx.baseImponible
				,tx.valor
			FROM Compra.Documento_Ingreso_Taxes tX 
			WHERE tx.idDocumentoIngreso = @idDocumentoIngreso

			SELECT @subTotalIvaCero     = ISNULL(SUM(baseImponible),0), @subTotalNetoIvaCero     = ISNULL(SUM(baseImponible - descuento),0)  FROM @taxes WHERE codigoPorcentaje = '0' 
			SELECT @subTotalIva         = ISNULL(SUM(baseImponible),0), @subTotalNetoIva         = ISNULL(SUM(baseImponible - descuento),0),@iva = ISNULL(SUM(valor),0) FROM @taxes WHERE codigoPorcentaje = '2' 
			SELECT @subTotalNoObjetoIva = ISNULL(SUM(baseImponible),0), @subTotalNetoNoObjetoIva = ISNULL(SUM(baseImponible - descuento),0)  FROM @taxes WHERE codigoPorcentaje = '6' 
			SELECT @subTotalExentoIva   = ISNULL(SUM(baseImponible),0), @subTotalNetoExentoIva   = ISNULL(SUM(baseImponible - descuento),0)  FROM @taxes WHERE codigoPorcentaje = '7' 

			SELECT @decuento = descuento FROM @taxes

			SELECT 
				 es.idEstablecimiento
				,pe.idPuntoEmision
				,pe.codEstab
				,es.estab
				,pe.ptoEmi
				,secuencial              = Helper.F_Auto_Sequential(di.secuencial)
				,di.fechaEmision
				,subTotalIva             = @subTotalIva
				,subTotalIvaCero         = @subTotalIvaCero
				,subTotalExentoIva       = @subTotalExentoIva
				,subTotalNoObjetoIva     = @subTotalNoObjetoIva
				,subTotalNetoIva         = @subTotalNetoIva
				,subTotalNetoIvaCero     = @subTotalNetoIvaCero
				,subTotalNetoExentoIva   = @subTotalNetoExentoIva
				,subTotalNetoNoObjetoIva = @subTotalNetoNoObjetoIva
				,subTotalSinImpuestos    = di.totalSinImpuestos
				,iva = @iva
				,totalDescuento = @decuento 
				,total = di.importeTotal
			FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
			INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = di.idPuntoEmision
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
			WHERE di.idDocumentoIngreso = @idDocumentoIngreso

			SELECT 
				 di.idProveedor
				,nombreComercial = ISNULL(pr.nombreComercial,'')
				,nombreFiscal = ISNULL(pr.nombreFiscal,'')
				,direccion = ISNULL(pr.direccion,'')
			FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
			INNER JOIN dbo.Proveedor pr WITH (NOLOCK) ON pr.idProveedor = di.idProveedor
			WHERE di.idDocumentoIngreso = @idDocumentoIngreso

			SELECT	
				 dt.idArticulo
				,dt.idMedida
				,dt.idBodega
				,dt.cantidad
				,dt.descripcion
				,dt.precioUnitario
				,dt.descuento
				,dt.precioTotalSinImpuesto
				,dt.codigoPorcentaje
				,tarifa = ti.porcentaje
			FROM Compra.Documento_Ingreso_Detail dt WITH (NOLOCK)
			INNER JOIN Sri.TarifaImpuesto ti WITH (NOLOCK) ON ti.codigo = dt.codigoPorcentaje
			WHERE dt.idDocumentoIngreso = @idDocumentoIngreso

			SELECT tx.* 
			FROM Compra.Documento_Ingreso_Taxes tx  WITH (NOLOCK)
			WHERE tx.idDocumentoIngreso = @idDocumentoIngreso
		END 
END
GO
