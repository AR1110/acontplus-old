USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Factura_Insert]    Script Date: 23/7/2023 11:38:47 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--- Modificado por Ignacio Manchu.
CREATE OR ALTER PROC [Ventas].[Factura_Insert_v2] 
     @idUsuarioRol INT
	,@jsonFactura VARCHAR(max)
	,@jsonDetalle VARCHAR(max)
	,@jsonInfoAdicional VARCHAR(max)
	,@infoAdicionalArticulo VARCHAR(max)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH

	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @idFactura BIGINT

	DECLARE @fechaCaducidad DATE
	DECLARE @firma INT
	
	--Dato TipoDocumento establecido por el sri
	DECLARE @idTipoDocumento BIGINT
	DECLARE @payload VARCHAR(MAX)

	--Dato Estado Financiero del documento
	DECLARE @idEstadoPago INT

	--Datos de la factura 
	DECLARE @secuencial INT
	DECLARE @idPuntoEmision INT
	DECLARE @codEstab VARCHAR(50)

	--DATOS CLIENTE
	DECLARE @idCliente INT 
	DECLARE @idTipoIdentificacion INT
	DECLARE @razonSocialComprador VARCHAR(200)
	DECLARE @identificacionComprador VARCHAR(15)
	DECLARE @direccionComprador VARCHAR(300)
	DECLARE @email VARCHAR(100)
	DECLARE @telefono VARCHAR(25)
	DECLARE @IDType VARCHAR(2)
	DECLARE @customerId INT

	--Datos tributarios de la factura 
	DECLARE @porcentaje DECIMAL(15, 5)
	
	--Datos de Administracion
	DECLARE @versionComp VARCHAR(5) = '1.1.0'
	DECLARE @ruc NVARCHAR(100)
	DECLARE @fechaEmision DATETIME
	DECLARE @ambiente INT
	DECLARE @estab VARCHAR(5)
	DECLARE @ptoEmi VARCHAR(5)
	DECLARE @emision NVARCHAR(5) = '1'
	DECLARE @codDoc NVARCHAR(50) = '01'
	DECLARE @claveAcceso NVARCHAR(50)
	DECLARE @isAutomatic INT
	DECLARE @actividad NVARCHAR(100)
	DECLARE @inventory VARCHAR(5)
	DECLARE @uniqueId VARCHAR(150)

	-- PARAMETER CONTABILIDAD -- 
	DECLARE @idTiempoCredito INT
	DECLARE @tiempoCredito BIT
	DECLARE @importeTotal AS NUMERIC(18,5)
	DECLARE @fechaVencimiento DATETIME
	DECLARE @serieComprobante VARCHAR(30)
	

	-- PARAMETER INVENTARIO -- 
	DECLARE @idArticulo INT
	DECLARE @idBodega INT
	DECLARE @idMedida INT
	DECLARE @idTarifa INT
	DECLARE @cantidad NUMERIC(18,2)
	DECLARE @precioUnitario NUMERIC(18,5)
	DECLARE @precioCosto NUMERIC(18,5) 
	DECLARE @precioTotalSinImpuesto NUMERIC(18,5)

	-- DECLARE VENTAS -- 
	DECLARE @payAutomatic BIT 
	DECLARE @printerAutomatic BIT 
	DECLARE @idCuentaPorCobrar INT
	
	
	DECLARE @tbComprobante AS TABLE (
		idCliente INT NULL
	   ,idTiempoCredito INT NOT NULL
	   ,idPuntoEmision INT NOT NULL
	   ,idUsuario INT NOT NULL
	   ,tarifa NUMERIC(18,5) NOT NULL
	   ,fechaEmision DATETIME NOT NULL
	   ,fechaVencimiento DATETIME NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,subTotalIva NUMERIC(18,5) NOT NULL
	   ,subTotalNetoIva NUMERIC(18,5) NOT NULL 
	   ,subTotalIvaCero NUMERIC(18,5) NOT NULL 
	   ,subTotalNetoIvaCero NUMERIC(18,5) NOT NULL 
	   ,subTotalNoObjetoIva NUMERIC(18,5) NOT NULL 
	   ,subTotalNetoNoObjetoIva NUMERIC(18,5) NOT NULL
	   ,subTotalExentoIva NUMERIC(18,5) NOT NULL 
	   ,subTotalNetoExentoIva  NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,totalIce NUMERIC(18,5) NOT NULL 
	   ,irbpnr NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,iva NUMERIC(18,5) NOT NULL 
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	   ,placa VARCHAR(100) NULL
	   ,identificacionComprador VARCHAR(300) NULL
	   ,razonSocialComprador VARCHAR(300) NULL
	   ,direccionComprador VARCHAR(300) NULL
	   ,email VARCHAR(300) NULL
	   ,telefono VARCHAR(300) NULL
	)

	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idArticulo INT NOT NULL
		,idTarifa INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,precioSinSubsidio NUMERIC(18,5) NOT NULL
		,precioConIva NUMERIC (18,5) NOT NULL
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
		,total NUMERIC (18,5) NOT NULL
		,nota VARCHAR(100) NULL
		,descripcion VARCHAR(255) NOT NULL
	)

	DECLARE @historyInfoAdicional AS TABLE(
		idArticulo INT NOT NULL,
		idInfoAdicional INT NOT NULL
	)
	
	DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	BEGIN TRY
		

		INSERT INTO @tbComprobante
		   (idCliente
		   ,idTiempoCredito
		   ,idPuntoEmision
		   ,idUsuario
		   ,tarifa
		   ,fechaEmision
		   ,fechaVencimiento
		   ,subTotalSinImpuestos  
		   ,subTotalIva 
		   ,subTotalNetoIva  
		   ,subTotalIvaCero  
		   ,subTotalNetoIvaCero  
		   ,subTotalNoObjetoIva  
		   ,subTotalNetoNoObjetoIva 
		   ,subTotalExentoIva  
		   ,subTotalNetoExentoIva   
		   ,totalDescuento  
		   ,porcentajeDescuento 
		   ,totalIce 
		   ,irbpnr 
		   ,propina 
		   ,iva 
		   ,recargo 
		   ,transporte 
		   ,total 
		   ,observacion 
		   ,placa
		   ,identificacionComprador 
	       ,razonSocialComprador     
	       ,direccionComprador       
	       ,email                   
	       ,telefono
		   )
		SELECT
			ISNULL(idCliente,0)
		   ,idTiempoCredito
		   ,idPuntoEmision
		   ,idUsuario
		   ,tarifa
		   ,fechaEmision = CONVERT(datetime,fechaEmision,121)
		   ,fechaVencimiento = CONVERT(datetime,fechaVencimiento,121)
		   ,subTotalSinImpuestos  
		   ,subTotalIva 
		   ,subTotalNetoIva  
		   ,subTotalIvaCero  
		   ,subTotalNetoIvaCero  
		   ,subTotalNoObjetoIva  
		   ,subTotalNetoNoObjetoIva 
		   ,subTotalExentoIva  
		   ,subTotalNetoExentoIva   
		   ,totalDescuento  
		   ,porcentajeDescuento 
		   ,totalIce 
		   ,irbpnr 
		   ,ISNULL(propina,0) 
		   ,iva 
		   ,ISNULL(recargo,0) 
		   ,ISNULL(transporte,0) 
		   ,total 
		   ,observacion 
		   ,placa
		   ,identificacionComprador 
	       ,razonSocialComprador     
	       ,direccionComprador       
	       ,email                   
	       ,telefono
		FROM OPENJSON(@jsonFactura) 
		WITH(
			 idCliente                         INT '$.idCliente' 
			,idTiempoCredito                   INT '$.idTiempoCredito'
			,idPuntoEmision                    INT '$.idPuntoEmision'
			,idUsuario                         INT '$.idUsuario'
			,tarifa                  NUMERIC(18,5) '$.tarifa'
			,fechaEmision                 DATETIME '$.fechaEmision'
			,fechaVencimiento             DATETIME '$.fechaVencimiento'
			,subTotalSinImpuestos    NUMERIC(18,5) '$.subTotalSinImpuestos' 
			,subTotalIva             NUMERIC(18,5) '$.subTotalIva'
			,subTotalNetoIva         NUMERIC(18,5) '$.subTotalNetoIva' 
			,subTotalIvaCero         NUMERIC(18,5) '$.subTotalIvaCero' 
			,subTotalNetoIvaCero     NUMERIC(18,5) '$.subTotalNetoIvaCero' 
			,subTotalNoObjetoIva     NUMERIC(18,5) '$.subTotalNoObjetoIva' 
			,subTotalNetoNoObjetoIva NUMERIC(18,5) '$.subTotalNetoNoObjetoIva'
			,subTotalExentoIva       NUMERIC(18,5) '$.subTotalExentoIva' 
			,subTotalNetoExentoIva   NUMERIC(18,5) '$.subTotalNetoExentoIva' 
			,totalDescuento          NUMERIC(18,5) '$.totalDescuento' 
			,porcentajeDescuento     NUMERIC(18,5) '$.porcentajeDescuento' 
			,totalIce                NUMERIC(18,5) '$.totalIce' 
			,irbpnr                  NUMERIC(18,5) '$.irbpnr' 
			,propina                 NUMERIC(18,5) '$.propina'
			,iva				     NUMERIC(18,5) '$.iva' 
			,recargo			     NUMERIC(18,5) '$.recargo' 
			,transporte              NUMERIC(18,5) '$.transporte' 
			,total                   NUMERIC(18,5) '$.total' 
			,observacion              VARCHAR(500) '$.observacion' 
			,placa                    VARCHAR(100) '$.placa'
			,identificacionComprador  VARCHAR(300) '$.identificacionComprador'
	        ,razonSocialComprador     VARCHAR(300) '$.razonSocialComprador'
	        ,direccionComprador       VARCHAR(300) '$.direccionComprador'
	        ,email                    VARCHAR(300) '$.email'
	        ,telefono                 VARCHAR(300) '$.telefono'
			) AS js
		
		INSERT INTO @tblDetails(orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioSinSubsidio
			                   ,precioConIva,valorDescuento,porcentajeDescuento,total,nota,descripcion)
						SELECT orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,ISNULL(precioSinSubsidio,0)
							,precioConIva,valorDescuento,porcentajeDescuento,total,nota,descripcion 
						FROM OPENJSON (@jsonDetalle) WITH (
								orderIndex                       INT '$.orderIndex' 
							   ,idArticulo                       INT '$.idArticulo'
							   ,idTarifa                         INT '$.idTarifa'
							   ,idBodega                         INT '$.idBodega'
							   ,idMedida                         INT '$.idMedida'
							   ,ice                    NUMERIC(10,5) '$.ice'
							   ,cantidad               NUMERIC(15,5) '$.cantidad'
							   ,precioVenta            NUMERIC(15,5) '$.precioVenta'
							   ,precioSinSubsidio      NUMERIC(15,5) '$.precioSinSubsidio'
							   ,precioUnitario         NUMERIC(15,5) '$.precioUnitario'
							   ,precioConIva           NUMERIC(15,5) '$.precioConIva'
							   ,valorDescuento         NUMERIC(15,5) '$.valorDescuento'
							   ,precioTotalSinImpuesto NUMERIC(15,5) '$.precioTotalSinImpuesto'
							   ,porcentajeDescuento    NUMERIC(15,5) '$.porcentajeDescuento'
							   ,total                  NUMERIC(15,5) '$.total'
							   ,nota                    VARCHAR(100) '$.nota'
							   ,descripcion             VARCHAR(255) '$.descripcion' 
							   ,idTipoIva                        INT '$.idTipoIva' 
						)

		INSERT INTO @tblInfoAdicional (nombre,valor)
		SELECT nombre,valor FROM OPENJSON(@jsonInfoAdicional) WITH (nombre VARCHAR(300) '$.nombre', valor VARCHAR(300) '$.valor')


		INSERT INTO @historyInfoAdicional SELECT * FROM OPENJSON(@infoAdicionalArticulo)WITH(idArticulo INT, idInfoAdicional INT)


		--============================================CAPTURANDO VARIABLES ============================================================

		SELECT TOP 1 @idUsuario = idUsuario,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT TOP 1 @inventory = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.llevaInventario') FROM Config.Sistema WHERE idEntidad = @idEntidad AND codConfig = 'CI'

		SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE codigoSri = @codDoc

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT @uniqueId = uniqueId FROM OPENJSON(@jsonFactura) WITH (uniqueId VARCHAR(150) '$.uniqueId')

		SELECT TOP 1 @fechaCaducidad = fechaCaducidad,@firma = idFirmaElectronica FROM dbo.FirmaElectronica WITH (NOLOCK)WHERE idEntidad = @idEntidad

		SELECT @idCliente               = js.idCliente
			  ,@identificacionComprador = js.identificacionComprador
			  ,@razonSocialComprador    = js.razonSocialComprador
			  ,@direccionComprador      = js.direccionComprador
			  ,@email                   = js.email
			  ,@telefono                = js.telefono
			  ,@idPuntoEmision          = js.idPuntoEmision
			  ,@codEstab                = sr.codEstab
			  ,@idTiempoCredito         = js.idTiempoCredito
			  ,@importeTotal            = js.total
			  ,@fechaEmision            = fechaEmision
			  ,@estab                   = sr.estab
			  ,@ptoEmi                  = pto.ptoEmi
			  ,@ambiente                = pto.ambiente
			  ,@porcentaje              = ae.porcentaje
			  ,@idUsuario		        = IIF(js.idUsuario = 0, @idUsuario, js.idUsuario)
		FROM @tbComprobante js
		INNER JOIN dbo.PuntoEmision      pto WITH (NOLOCK) ON pto.idPuntoEmision = js.idPuntoEmision
		INNER JOIN Sri.Establecimiento    sr WITH (NOLOCK) ON sr.codEstab        = pto.codEstab
		INNER JOIN Sri.ActividadEconomica ae WITH (NOLOCK) ON ae.codigo          = sr.actividad
		
		SELECT @idTiempoCredito  = tb.idTiempoCredito
		      ,@tiempoCredito    = tc.tipo 
			  ,@fechaVencimiento = fechaVencimiento
		FROM @tbComprobante tb INNER JOIN dbo.TiempoCredito tc ON tc.idTiempoCredito = tb.idTiempoCredito

		IF @idCliente > 0
			BEGIN 
				SELECT TOP 1 @razonSocialComprador = nombreFiscal, @identificacionComprador = numeroIdentificacion, @idTipoIdentificacion = idTipoIdentificacion FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente
			END
		ELSE
			BEGIN
				IF (@identificacionComprador IS NULL)
					BEGIN
						SELECT '0' as code, 'El nro de identificación del cliente es incorrecto' as 'message'
						RETURN
					END

					SET @identificacionComprador = (SELECT LTRIM(RTRIM(@identificacionComprador)))

					SET @idTipoIdentificacion = (SELECT CASE 
													WHEN LEN(@identificacionComprador) = 10 THEN (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion WHERE codigoSri = '05')
													WHEN LEN(@identificacionComprador) = 13 THEN (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion WHERE codigoSri = '04')
													WHEN LEN(@identificacionComprador) < 10 OR LEN(@identificacionComprador) > 13 THEN (SELECT TOP 1 idTipoIdentificacion FROM TipoIdentificacion WHERE codigoSri = '06')
												END)
			END


		SELECT TOP 1 @secuencial = ultimaSecuencia FROM dbo.ConfiguracionDocumento WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

		SELECT TOP 1 @isAutomatic = isAutomatic FROM factElect.Config_Comprob_Elect WHERE codEstab = @codEstab

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab), @codDoc, @ambiente, @emision, dbo.AFTConvertDate(@fechaEmision), @ruc, @estab + @ptoEmi, Helper.F_Auto_Sequential(@secuencial))

		SELECT @serieComprobante   = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial)

		--=================================== VALIDANDO INFORMACION ===================================================================

		IF  CAST(@fechaEmision AS DATE)  >  CAST(dbo.ufnGetDateEcuador() AS DATE)
			BEGIN 
				SELECT '0'code, 'La fecha de emisión del documento no puede ser posterior a la fecha actual.' as 'message'
				RETURN 
			END

		IF @firma IS NULL
			BEGIN
				SELECT '0' code,'No tienes configurada ninguna firma electrónica.' AS 'message'
				RETURN
			END

		IF DATEDIFF(DAY, @fechaCaducidad, GETDATE()) = 0
			BEGIN
				SELECT '0' code,'Su firma ha caducado no puede realizar comprobantes electrónicos' AS 'message'
				RETURN
			END

		IF @secuencial IS NULL
			BEGIN
				SELECT '0' code,'No existe una configuracion de secuencial para este Punto de Emision' AS 'message'
				RETURN
			END

		IF EXISTS (SELECT 1 FROM Factura WITH (NOLOCK) WHERE nroFactura = @secuencial AND idPuntoEmision = @idPuntoEmision)
			BEGIN
				SELECT '0' code,'La Factura: ' + dbo.AFTAutoComplete(@secuencial) + ' ya se encuentra registrada' AS 'message'
				RETURN
			END

		IF @claveAcceso IS NULL
			BEGIN
				SELECT '0' code,'Error critico la clave de Acceso no se genero correctamente' AS 'message'
				RETURN
			END

		IF EXISTS (SELECT 1 FROM Factura WITH (NOLOCK) WHERE claveAcceso = @claveAcceso)
			BEGIN
				SELECT '0' code,'Error critico esta clave de acceso ya existe en la Factura' AS 'message'
				RETURN
			END

		BEGIN TRAN
			
			IF @idCliente = 0
				BEGIN
					IF NOT EXISTS(SELECT 1 FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@identificacionComprador)))
						BEGIN
							SELECT TOP 1 @IDType = codigoSri FROM TipoIdentificacion t WITH (NOLOCK)  WHERE t.idTipoIdentificacion = @idTipoIdentificacion

							INSERT INTO Customer.Customer(IDType, IDCard, BusinessName, TradeName, email, telephone, [Address], SriValidation)
							SELECT @IDType, LTRIM(RTRIM(@identificacioncomprador)), LTRIM(RTRIM(@razonSocialComprador)), LTRIM(RTRIM(@razonSocialComprador)),  LTRIM(RTRIM(@email)), LTRIM(RTRIM(@telefono)), LTRIM(RTRIM(@direccionComprador)), 1
							
							SET @customerId = @@IDENTITY
						END
					ELSE
						BEGIN 
							SELECT TOP 1 @customerId = ID FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@identificacionComprador))
						END
					
					IF NOT EXISTS (SELECT 1 FROM Cliente WITH (NOLOCK) WHERE numeroIdentificacion = @identificacionComprador AND idEntidad = @idEntidad)
						BEGIN
							INSERT INTO dbo.Cliente(idEntidad, idTipoIdentificacion, numeroIdentificacion, nombreFiscal, nombreComercial, direccion, correo, telefono, validationSri, customerId)
							VALUES (@idEntidad, @idTipoIdentificacion, @identificacionComprador, @razonSocialComprador, @razonSocialComprador, @direccionComprador, @email, @telefono, 1, @customerId)

							SET @idCliente = @@IDENTITY
						END 
				END
			ELSE 
				BEGIN
					UPDATE dbo.Cliente 
					SET direccion	= @direccionComprador,
						correo		= @email,
						telefono	= @telefono
					WHERE idCliente = @idCliente
				END
	
			--==== INFORMACION DE LA VENTA =============================================================
			
			-- comprobante 
			INSERT INTO Factura (idCliente ,idPuntoEmision ,idEstadoPago ,idTipoDocumento ,idTiempoCredito ,ambiente ,porcentaje
				,idEntidad ,idUsuario ,claveAcceso,nroFactura,fechaEmision,fechaVencimiento,subTotalSinImpuestos,subTotalIva
				,subTotalNetoIva,subTotalIvaCero,subTotalNetoIvaCero,subTotalNoObjetoIva,subTotalNetoNoObjetoIva
				,subTotalExentoIva,subTotalNetoExentoIva,totalDescuento,porcentajeDescuento,totalIce,irbpnr,propina
				,iva,recargo,transporte,total,observacion,fechaRegistro,placa)
		
			SELECT @idCliente ,idPuntoEmision ,@idEstadoPago ,@idTipoDocumento ,idTiempoCredito ,@ambiente ,tarifa
				,@idEntidad ,@idUsuario ,@claveAcceso ,@secuencial ,@fechaEmision ,fechaVencimiento ,subTotalSinImpuestos ,subTotalIva
				,subTotalNetoIva ,subTotalIvaCero ,subTotalNetoIvaCero ,subTotalNoObjetoIva ,subTotalNetoNoObjetoIva
				,subTotalExentoIva ,subTotalNetoExentoIva ,totalDescuento ,porcentajeDescuento ,totalIce ,irbpnr ,propina
				,iva ,recargo ,transporte ,total ,observacion ,dbo.ufnGetdateEcuador() ,placa
			FROM @tbComprobante

			SET @idFactura = @@IDENTITY
			-- comprobante 

			--detalle 
			INSERT INTO FacturaDetalle (idFactura,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioVenta,precioSinSubsidio
				,precioConIva,valorDescuento,porcentajeDescuento,total,nota,descripcion,precioCosto,porcentajeIva,iva)
			SELECT @idFactura, td.idArticulo, td.idTarifa, td.idBodega, td.idMedida, td.idTipoIva, td.ice, td.cantidad, td.precioUnitario,td.precioSinSubsidio
			,td.precioConIva, td.valorDescuento, td.porcentajeDescuento, td.total, td.nota, td.descripcion, a.precioCosto, ti.porcentaje, (porcentaje/100) * total
			FROM @tblDetails td 
			INNER JOIN Articulo a WITH (NOLOCK) ON a.idArticulo = td.idArticulo
			LEFT JOIN TipoIva ti ON td.idTipoIva = ti.idTipoIva
			--detalle

			--forma de pago
			INSERT INTO dbo.FormaPagoFactura (idFactura,idFormaPagoSri,idTiempoCredito,abono,idUsuario,fechaRegistro)
			SELECT @idFactura,Helper.F_FormaPago_Get_Generate(@idFactura, @idTipoDocumento),@idTiempoCredito,@importeTotal,@idUsuario,dbo.ufnGetDateEcuador()
			--forma de pago

			--actualizacion del secuencial de la venta--
			UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento
			--/actualizacion del secuencial de la venta/--

			--==== INFORMACION DE LA VENTA =============================================================



			--==== FACTURARION ELECTRONICA ===============================================================

			INSERT INTO dbo.DocumentoElectronico (ambiente,codDoc,idDocumento,idContribuyente,nroDocumento,idPuntoEmision,numEstab,ptoEmision,claveAcceso
												 ,versionComp,isAutomatic,fechaEmision,codigoAutorizacion,idUsuario,idEntidad)

										  SELECT @ambiente,@codDoc,@idFactura,@idCliente,@secuencial,@idPuntoEmision,@estab,@ptoEmi,@claveAcceso
											    ,@versionComp,@isAutomatic,@fechaEmision,@claveAcceso,@idUsuario,@idEntidad
			--==== FACTURARION ELECTRONICA ===============================================================


			---------------------------------------------START-INFO-ADICIONAL-ARTICULO-------------------------------------------
			INSERT INTO Ventas.HistoryInfoAdicional(idInfoAdicional, codDoc, idDocumento, secuencial, ptoEmi, estab)
			SELECT idInfoAdicional, 'FE', @idFactura, @secuencial, @ptoEmi, @estab FROM @historyInfoAdicional
			
			INSERT INTO @tblInfoAdicional
			SELECT j.[key] as nombre, ar.codigo + ' : ' +  STRING_AGG(j.[value], ', ') WITHIN GROUP (ORDER BY j.[value]) AS valor
			FROM Compra.InfoAdicional t WITH (NOLOCK)
			INNER JOIN Ventas.HistoryInfoAdicional h WITH (NOLOCK) ON t.idInfoAdicional = h.idInfoAdicional
			INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = t.idArticulo
			CROSS APPLY OPENJSON(t.jsonAdicional) j
			WHERE h.codDoc = 'FE' AND h.idDocumento = @idFactura
			GROUP BY j.[key],ar.codigo


			UPDATE infoAdd  SET estado = 2 
			FROM Compra.InfoAdicional infoAdd WITH (NOLOCK)
			INNER JOIN @historyInfoAdicional h ON h.idInfoAdicional = infoAdd.idInfoAdicional
			--------------------------------------------END-INFO-ADICIONAL-ARTICULO------------------------------


			--informacion Adiciomal--
			INSERT INTO dbo.InfoAdicionalDoc (idComprobante,idTipoDocumento,nombre,valor)
									      SELECT @idFactura,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional
			--informacion Adicional--



			--================== VENTA CON OREGEN A PARTIR DE UNA APROBACION =====================================================
			IF @uniqueId IS NOT NULL
				BEGIN
					UPDATE Ventas.Aprob_Document SET codEstado = 'APR' WHERE uniqueId = @uniqueId

					INSERT INTO Ventas.Aprob_Document_Audit (uniqueId,estab,ptoEmi,secuencial,idEntidad,idUsuario,fechaRegistro)
													 SELECT @uniqueId,@estab,@ptoEmi,@secuencial,@idEntidad,@idUsuario,dbo.ufnGetDateEcuador()
				END
			--================== VENTA CON OREGEN A PARTIR DE UNA APROBACION =====================================================


			--============================================ CONTABILIDAD ==============================================================
			
			EXEC Contabilidad.CuentaPorCobrar_Insert '01',@idFactura,@idPuntoEmision,@idTiempoCredito,@idCliente,@secuencial,@serieComprobante,@fechaEmision,@fechaVencimiento,@importeTotal,@idEntidad,@idUsuario

			--============================================ CONTABILIDAD ==============================================================


			--============================================ INVENTARIO ======================================================================
			
			IF @inventory = 'SI'
				BEGIN
					IF EXISTS (SELECT 1 FROM @tblDetails td INNER JOIN Articulo a WITH (NOLOCK) ON td.idArticulo = a.idArticulo WHERE a.llevaInventario = 1)
						BEGIN 
							
							DECLARE cursor_inventory CURSOR LOCAL FOR
							SELECT td.idArticulo, idBodega,td.idMedida,td.idTarifa, cantidad,td.precioUnitario,a.precioCosto,td.total
							FROM @tblDetails td 
							INNER JOIN Articulo a WITH (NOLOCK) ON td.idArticulo = a.idArticulo 
							WHERE a.llevaInventario = 1

							OPEN cursor_inventory

								FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto

								WHILE @@FETCH_STATUS = 0
									BEGIN
										--tipo transaccion salidas
										--tipo documento  factura electronica

										EXEC Inventario.Transaccion_Insert 'S', 'FE', @fechaEmision, @idFactura,  @idArticulo, @idBodega ,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto, @idUsuario
										FETCH NEXT FROM cursor_inventory INTO @idArticulo,@idBodega,@idMedida, @idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSinImpuesto
									END
							CLOSE cursor_inventory
							DEALLOCATE cursor_inventory  
						END
				END
			
			--============================================ PAYLOAD ==========================================================================
			IF @tiempoCredito = 1
				BEGIN
					SELECT TOP 1 @payAutomatic = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.payAutomatic'), @printerAutomatic = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.printerAutomatic') FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CV'
				END

			SELECT TOP 1 @idCuentaPorCobrar = idCuentaPorCobrar FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = '01' AND idDocumento = @idFactura

			SET @payload = (SELECT  idDocumento             = @idFactura
			                       ,idTipoDocumento         = @idTipoDocumento
								   ,codEstab                = @codEstab
								   ,tiempoCredito           = @tiempoCredito
								   ,idCliente               = @idCliente
								   ,codDoc                  = '01'
								   ,idCuentaPorCobrar       = @idCuentaPorCobrar
								   ,payAutomatic            = @payAutomatic
								   ,printerAutomatic        = @printerAutomatic
							 FOR JSON PATH)

		COMMIT TRAN
		SELECT '1' code,'Registrado Exitosamente' as 'message', @payload as payload
		RETURN 
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN;
		END

		SELECT '0' code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() AS 'message'

		INSERT INTO ErroresSistema (
			token
			,method
			,errorNumber
			,errorSeverity
			,errorState
			,errorProcedure
			,errorLine
			,errorMessage
			,errorDate
			,idUsuario
			)
		VALUES (
			NEWID()
			,'/Factura/Insert'
			,ERROR_NUMBER()
			,ERROR_SEVERITY()
			,ERROR_STATE()
			,ERROR_PROCEDURE()
			,ERROR_LINE()
			,ERROR_MESSAGE()
			,GETDATE()
			,@idUsuario
			)
	END CATCH
END
