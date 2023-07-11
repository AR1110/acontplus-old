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
	DECLARE @jsonConfig AS VARCHAR(MAX)

	SELECT @typeList = typeList FROM OPENJSON(@json) WITH(typeList INT '$.typeList')

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT TOP 1 @jsonConfig = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD'


	IF @typeList = 1
		BEGIN

			DECLARE @sql AS NVARCHAR(MAX) = 'SELECT TOP (100)
												 di.idDocumentoIngreso
												,serieComprobante = es.estab+''-''+pt.ptoEmi+''-''+Helper.F_Auto_Sequential(di.secuencial)
												,fechaEmision     = FORMAT(di.fechaEmision, ''dd/MM/yyyy HH:mm'')
												,nombreFiscal     = pr.nombreFiscal
												,importeTotal     = di.importeTotal
												,estado           = IIF(di.estado = 0, ''Anulado'',''Activo'')
												,usuario          = us.nombreUsuario
												,colorRow         = IIF(di.estado = 0, ''table-danger'','''')
											 FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
											 INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = di.idEstablecimiento
											 INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision    = di.idPuntoEmision
											 INNER JOIN dbo.Proveedor       pr WITH (NOLOCK) ON pr.idProveedor       = di.idProveedor
											 INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = di.idUsuario
											 WHERE di.idEntidad = @idEntidad AND es.codEstab = @codEstab'

			DECLARE @params AS NVARCHAR(MAX) = '@idEntidad AS INT
											   ,@codEstab AS VARCHAR(100)
											   ,@dateStart AS DATETIME
											   ,@dateEnd AS DATETIME
											   ,@idProveedor AS INT
											   ,@estado AS BIT
											   ,@nroSecuencial VARCHAR(13)'

			DECLARE @codEstab AS VARCHAR(20)
			DECLARE @checkBoxProveedor AS BIT 
			DECLARE @checkBoxEstab AS BIT  
			DECLARE @checkBoxEstado AS BIT
			DECLARE @idProveedor AS INT
			DECLARE @estado AS BIT
			DECLARE @dateStart AS DATE
			DECLARE @dateEnd AS DATE
			DECLARE @typeStatus AS VARCHAR(5)
			DECLARE @isSearchNroDoc BIT
			DECLARE @nroSecuencial  VARCHAR(13)

			SELECT @checkBoxEstab     = checkBoxEstab
				  ,@checkBoxProveedor = checkBoxProveedor 
				  ,@checkBoxEstado    = checkBoxEstado
				  ,@codEstab          = codEstab
				  ,@idProveedor       = idProveedor
				  ,@dateStart         = CONVERT(DATETIME, dateStart, 121)
				  ,@dateEnd           = CONVERT(DATETIME, dateEnd, 121)
				  ,@typeStatus        = estado
				  ,@isSearchNroDoc     = isSearchNroDoc
				  ,@nroSecuencial      = LTRIM(TRIM(nroSecuencial))
			FROM OPENJSON(@json)
			WITH (codEstab  VARCHAR(20) '$.codEstab'
			     ,checkBoxEstab     BIT '$.checkBoxEstab'
			     ,checkBoxProveedor BIT '$.checkBoxProveedor' 
			     ,checkBoxEstado    BIT '$.checkBoxEstado'
				 ,idProveedor       INT '$.idProveedor'
				 ,dateStart    VARCHAR(50) '$.dateStart'
				 ,dateEnd      VARCHAR(50) '$.dateEnd'
				 ,estado	 VARCHAR(5) '$.estado'
				 ,isSearchNroDoc BIT
				 ,nroSecuencial VARCHAR(13)
				 ) as dt
 
			 
			IF @isSearchNroDoc = 1
				BEGIN 
					SET @sql = @sql + ' AND di.secuencial = @nroSecuencial'
				END 
			ELSE
				BEGIN 
					SET @sql = @sql + ' AND CAST(di.fechaEmision AS DATE) BETWEEN CAST(@dateStart AS DATE) AND CAST(@dateEnd AS DATE) '
					IF @checkBoxProveedor = 1 
						BEGIN
							SET @sql = @sql + ' AND di.idProveedor = @idProveedor  '
						END 

					IF @checkBoxEstado = 1
						BEGIN
							SET @estado = IIF(@typeStatus= 'AC',1,0)

							SET @sql = @sql + ' AND di.estado = @estado '
						END 
				END 

			SET @sql = @sql + ' ORDER BY di.idDocumentoIngreso DESC '

			EXEC sp_executesql 
			      @sql
			     ,@params 
			     ,@idEntidad   = @idEntidad
				 ,@codEstab    = @codEstab
				 ,@dateStart   = @dateStart
				 ,@dateEnd     = @dateEnd
				 ,@idProveedor = @idProveedor
				 ,@estado      = @estado
				 ,@nroSecuencial = @nroSecuencial
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
			SELECT nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle ,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce
			FROM OPENJSON(@jsonConfig)
			WITH (codTransaccion VARCHAR(5) '$.codTransaccion'
				,nroPrecio              INT '$.nroPrecio'
				,nroCantidad            INT '$.nroCantidad'
				,nroIva                 INT '$.nroIva'
				,nroDescuentoDetalle    INT '$.nroDescuentoDetalle'
				,nroTotalDetalle        INT '$.nroTotalDetalle'
				,nroTotalSubTotal       INT '$.nroTotalSubTotal'
				,nroDescuento           INT '$.nroDescuento'
				,nroIce                 INT '$.nroIce') as dt
			 WHERE dt.codTransaccion = 'C'


			--=============================Impuestos===========================================================================
			SELECT codImpuesto = codImpuesto, codigoPorcentaje = codigo, descripcion = 'Iva '+descripcion,tarifa = porcentaje 
			FROM sri.TarifaImpuesto WITH (NOLOCK) WHERE estado = 1 AND codImpuesto = 2

			--============================Impuestos por tipo de Actividad======================================================
			SELECT ea.codEstab,codigoPorcentaje = ae.codTarifaImpuesto,tarifa = ae.porcentaje
			FROM Config.Estab_Asig            ea WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON ea.codEstab = es.codEstab
			INNER JOIN Sri.ActividadEconomica ae WITH (NOLOCK) ON ae.codigo   = es.actividad
			WHERE idUsuarioRol = @idUsuarioRol

			--===============================Inventario========================================================================
			SELECT TOP 1 inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.llevaInventario') FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CI'
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
				 di.idDocumentoIngreso
				,es.idEstablecimiento
				,pe.idPuntoEmision
				,pe.codEstab
				,ptoEmi = es.estab+'-'+pe.ptoEmi
				,es.nombreComercial
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
				,tarifa = 12
				,codigoPorcentaje = '2'
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
				,pr.numeroIdentificacion
			FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
			INNER JOIN dbo.Proveedor pr WITH (NOLOCK) ON pr.idProveedor = di.idProveedor
			WHERE di.idDocumentoIngreso = @idDocumentoIngreso

			SELECT	
				 idDetalle = dt.idDocumentoIngresoDetail 
				,dt.idDocumentoIngresoDetail
				,dt.idArticulo
				,dt.idMedida
				,dt.idBodega
				,codigo = dt. codigoPrincipal
				,codigoPrincipal = dt. codigoPrincipal
				,codigoAuxiliar = dt. codigoAuxiliar
				,costoNeto
				,dt.cantidad
				,dt.descripcion
				,dt.precioUnitario
				,precioCostoNeto = dt.precioUnitario - descuento 
				,valorDescuento = dt.descuento
				,porcentajeDescuento = CAST((descuento / precioUnitario) * 100 AS numeric(18,5))
				,totalDescuento = CAST(cantidad * descuento AS numeric(18,5))
				,dt.precioTotalSinImpuesto
				,total = dt.precioTotalSinImpuesto
				,dt.codigoPorcentaje
				,tarifa = ti.porcentaje
				,ar.datosAdicionales
			FROM Compra.Documento_Ingreso_Detail dt WITH (NOLOCK)
			INNER JOIN Sri.TarifaImpuesto ti WITH (NOLOCK) ON ti.codigo = dt.codigoPorcentaje
			INNER JOIN Articulo ar WITH(NOLOCK) ON ar.idArticulo = dt.idArticulo
			WHERE dt.idDocumentoIngreso = @idDocumentoIngreso

			SELECT tx.* 
			FROM Compra.Documento_Ingreso_Taxes tx  WITH (NOLOCK)
			WHERE tx.idDocumentoIngreso = @idDocumentoIngreso

			--================================Bodegas=================================================================
			SELECT bo.idBodega,ea.codEstab,ab.predeterminado,bo.descripcion
			FROM Config.Bodeg_Asig        ab WITH (NOLOCK) 
			INNER JOIN Config.Estab_Asig  ea WITH (NOLOCK) ON ea.codEstab_Asig = ab.codEstab_Asig
			INNER JOIN dbo.Bodega         bo WITH (NOLOCK) ON bo.idBodega      = ab.idBodega
 			WHERE ea.idUsuarioRol = @idUsuarioRol


			--==============================Configuracion Decimal============================================================== 
			SELECT nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle ,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce
			FROM OPENJSON(@jsonConfig)
			WITH (codTransaccion VARCHAR(5) '$.codTransaccion'
				,nroPrecio              INT '$.nroPrecio'
				,nroCantidad            INT '$.nroCantidad'
				,nroIva                 INT '$.nroIva'
				,nroDescuentoDetalle    INT '$.nroDescuentoDetalle'
				,nroTotalDetalle        INT '$.nroTotalDetalle'
				,nroTotalSubTotal       INT '$.nroTotalSubTotal'
				,nroDescuento           INT '$.nroDescuento'
				,nroIce                 INT '$.nroIce') as dt
			 WHERE dt.codTransaccion = 'C'


			--=============================Impuestos===========================================================================
			SELECT codImpuesto = codImpuesto, codigoPorcentaje = codigo, descripcion = 'Iva '+descripcion,tarifa = porcentaje 
			FROM sri.TarifaImpuesto WHERE estado = 1 AND codImpuesto = 2

			--===============================Inventario========================================================================
			SELECT TOP 1 inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.llevaInventario') FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CI'

			--=============================Datos Adicionales===================================================================
			SELECT * FROM Compra.InfoAdicional 
				    WHERE uniqueId = (SELECT uniqueId FROM Compra.Documento_Ingreso WHERE idDocumentoIngreso = @idDocumentoIngreso)
		END 
END
GO
