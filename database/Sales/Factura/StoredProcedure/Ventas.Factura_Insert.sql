USE [AcontPlus]
GO

/****** Object:  StoredProcedure [Ventas].[Factura_Insert]    Script Date: 12/2/2022 11:29:37 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-11-24
-- Description:	SP para registrar facturas
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Factura_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT,@idFactura INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    --> Data Json
    DECLARE @infoFactura VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@formaPago VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@cuotas VARCHAR(MAX)
           ,@historial VARCHAR(MAX)

	--> Venta 
	DECLARE @idPuntoEmision INT ,@codEstab VARCHAR(50) ,@payAutomatic BIT ,@printerAutomatic BIT 

	--> Cliente
	DECLARE @idCliente INT ,@identificacionComprador VARCHAR(15) ,@CustomerId INT 
	
	--> Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@claveAcceso NVARCHAR(50) ,@isAutomatic INT ,@uniqueId VARCHAR(150) ,@secuencial INT
           ,@idEstadoServicio INT ,@idDocumentoElectronico INT

	--> Contabilidad 
	DECLARE @tiempoCredito BIT ,@serieComprobante VARCHAR(30) ,@idEstadoPago INT ,@idCuentaPorCobrar INT 

    --> Mecanica
    DECLARE @SupportId INT ,@idEstadoDocumento INT


	DECLARE @tbComprobante AS TABLE (
		idCliente INT NULL
	   ,idTiempoCredito INT NOT NULL
	   ,idPuntoEmision INT NOT NULL
	   ,idUsuario INT NOT NULL
       ,codDoc VARCHAR(10) NOT NULL DEFAULT '01'
       ,versionComp VARCHAR(10) NOT NULL DEFAULT '1.1.0'
	   ,fechaEmision DATETIME2 NOT NULL
	   ,fechaVencimiento DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	   ,placa VARCHAR(100) NULL
	   ,IdTypeId INT NOT NULL
       ,IdCard VARCHAR(300) NOT NULL
	   ,BusinessName VARCHAR(300) NOT NULL
	   ,TradeName VARCHAR(300) NOT NULL
       ,direccionComprador VARCHAR(300) NULL
	   ,email VARCHAR(300) NULL
	   ,telefono VARCHAR(300) NULL
       ,SupportId INT NULL
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
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
		,nota VARCHAR(300) NULL
		,descripcion VARCHAR(300) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCosto NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
        ,uuid VARCHAR(300) NOT NULL
	)

    DECLARE @payment AS TABLE (
        idFormaPagoSri INT NOT NULL
       ,idTiempoCredito INT NOT NULL
       ,total NUMERIC(18,5) NOT NULL
    )

    DECLARE @tbTaxes AS TABLE (
        TaxId INT NOT NULL 
	   ,TaxPercentId INT NOT NULL 
	   ,[Percent] NUMERIC(18,5) NOT NULL
	   ,TaxBase NUMERIC(18,5) NOT NULL
	   ,TaxValue NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL
    )

    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
        ,idInfoAdicional INT NULL
	)

	DECLARE @historyInfoAdicional AS TABLE(
		 idInfoAdicional INT NOT NULL
	    ,uuid VARCHAR(300) NOT NULL
	)

    DECLARE @tbCuotas AS TABLE(
		nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)
	
	BEGIN TRY

        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @infoFactura           = infoFactura
              ,@detalles              = detalles
              ,@formaPago             = formaPago
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@infoAdicionalArticulo = infoAdicionalArticulo
              ,@cuotas                = cuotas
        FROM OPENJSON(@json) WITH 
        (
             infoFactura           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json 
            ,formaPago             NVARCHAR(MAX) as json
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,infoAdicionalArticulo NVARCHAR(MAX) as json
            ,cuotas                NVARCHAR(MAX) as json
        )

        --> Comprbante Json
		INSERT INTO @tbComprobante
		      (idCliente,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa,IdTypeId,IdCard,BusinessName,TradeName,direccionComprador,email,telefono,SupportId)
		SELECT idCliente,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa,IdTypeId,IdCard,BusinessName,TradeName,direccionComprador,email,telefono,SupportId 
		FROM OPENJSON(@infoFactura) WITH
        (
			 idCliente               INT  
			,idTiempoCredito         INT 
			,idPuntoEmision          INT 
			,idUsuario               INT 
			,fechaEmision            DATETIME2 
			,fechaVencimiento        DATETIME2 
			,subTotalSinImpuestos    NUMERIC(18,5) 
			,porcentajeDescuento     NUMERIC(18,5) 
			,totalDescuento          NUMERIC(18,5)  
			,propina                 NUMERIC(18,5) 
			,recargo			     NUMERIC(18,5) 
			,transporte              NUMERIC(18,5) 
			,total                   NUMERIC(18,5) 
			,observacion             VARCHAR(500) 
			,placa                   VARCHAR(100)
			,IdTypeId                INT            '$.idTipoIdentificacion'
            ,IdCard                  VARCHAR(300)   '$.identificacionComprador'
	        ,BusinessName            VARCHAR(300)   '$.razonSocialComprador'
	        ,TradeName               VARCHAR(300)   '$.razonSocialComprador'
	        ,direccionComprador      VARCHAR(300) 
	        ,email                   VARCHAR(300)
	        ,telefono                VARCHAR(300)
            ,supportId               INT
            ,uniqueId                VARCHAR(150)

		) AS js
		
        --> Detalles
		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,precioSinSubsidio,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,conversion,precioCostoFraccionado,uuid)
		SELECT orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,precioSinSubsidio,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion * -1,conversion,precioCostoFraccionado,uuid 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex             INT
		    ,idArticulo             INT
		    ,idTarifa               INT
		    ,idBodega               INT
		    ,idMedida               INT
		    ,ice                    NUMERIC(10,5)
		    ,cantidad               NUMERIC(15,5)
		    ,precioSinSubsidio      NUMERIC(15,5)
		    ,precioUnitario         NUMERIC(15,5)
		    ,precioCosto            NUMERIC(15,5)
		    ,valorDescuento         NUMERIC(15,5)
		    ,precioTotalSinImpuesto NUMERIC(15,5)
		    ,porcentajeDescuento    NUMERIC(15,5)
            ,codigoPorcentaje       VARCHAR(5)
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5)
		    ,precioTotalSinImpuesto NUMERIC(15,5)
		    ,nota                   VARCHAR(300)
		    ,descripcion            VARCHAR(300) 
		    ,idTipoIva              INT 
            ,llevaInventario        BIT
            ,cantidadTransaccion    NUMERIC(15,5)
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
            ,uuid                   VARCHAR(300)
		)

        --> Pagos
        INSERT INTO @payment
              (idFormaPagoSri,idTiempoCredito,total)
        SELECT idFormaPagoSri,idTiempoCredito,total
        FROM OPENJSON(@formaPago) WITH 
        (
            idFormaPagoSri  INT 
           ,idTiempoCredito INT 
           ,total           NUMERIC(18,5) 
        )

        --> Impuestos
        INSERT INTO @tbTaxes
              (TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
        SELECT TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount
        FROM OPENJSON(@impuestos) WITH 
        (
            taxId        INT 
	       ,taxPercentId INT
	       ,[percent]    NUMERIC(18,5)
	       ,taxBase      NUMERIC(18,5) 
	       ,taxValue     NUMERIC(18,5) 
           ,discount     NUMERIC(18,5)
        )

        --> Cuotas
        INSERT INTO @tbCuotas
              (nroCuota,fechaVencimiento,cuota,entrada)
        SELECT nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            nroCuota         INT
	       ,fechaVencimiento DATE 
	       ,cuota            NUMERIC(18,5) 
	       ,entrada          BIT 
        )

        -->InfoAdicional
		INSERT INTO @tblInfoAdicional 
              (nombre,valor,idInfoAdicional) 
        SELECT nombre,valor,idInfoAdicional FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre          VARCHAR(300) 
           ,valor           VARCHAR(300)
           ,idInfoAdicional INT
        )

        -->
		INSERT INTO @historyInfoAdicional 
              (idInfoAdicional,uuid)
        SELECT idInfoAdicional,uuid FROM OPENJSON(@infoAdicionalArticulo) WITH
        (
            idInfoAdicional INT
           ,uuid            VARCHAR(300)
        )

		--> Capturando Variables
		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE codigoSri = '01'

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

		SELECT @identificacionComprador = js.IdCard
			  ,@idPuntoEmision          = js.idPuntoEmision
              ,@fechaEmision            = js.fechaEmision
              ,@idUsuario		        = IIF(js.idUsuario = 0, @idUsuario, js.idUsuario)
			  ,@codEstab                = sr.codEstab
			  ,@estab                   = sr.estab
			  ,@ptoEmi                  = po.ptoEmi
			  ,@ambiente                = po.ambiente
		      ,@tiempoCredito           = tc.tipo 
		FROM @tbComprobante               js
		INNER JOIN dbo.PuntoEmision       po WITH (NOLOCK) ON po.idPuntoEmision    = js.idPuntoEmision
		INNER JOIN dbo.TiempoCredito      tc WITH (NOLOCK) ON tc.idTiempoCredito   = js.idTiempoCredito
        INNER JOIN Sri.Establecimiento    sr WITH (NOLOCK) ON sr.idEstablecimiento = po.idEstablecimiento
		
		SELECT TOP 1 @secuencial = ultimaSecuencia, @isAutomatic = autoSriAuth FROM Config.v_ConfigDocumento WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab), '01', @ambiente,'1', dbo.AFTConvertDate(@fechaEmision), @ruc, @estab + @ptoEmi, Helper.F_Auto_Sequential(@secuencial))

		SELECT @serieComprobante   = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial)

		--> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SELECT '0' code,'Error en la info Factura' AS 'message'
				RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SELECT '0' code,'Error en los detalles' AS 'message'
				RETURN
            END

        IF NOT EXISTS(SELECT 1 FROM @payment) 
            BEGIN
                SELECT '0' code,'Error en la forma de pago' AS 'message'
				RETURN
            END
           
        IF NOT EXISTS(SELECT 1 FROM @tbTaxes) 
            BEGIN
                SELECT '0' code,'Error en los impuestos' AS 'message'
				RETURN
            END

        IF NOT EXISTS(SELECT 1 FROM @tbCuotas) 
            BEGIN
                SELECT '0' code,'Error en las Cuotas' AS 'message'
                RETURN
            END


        IF EXISTS (SELECT 1 FROM Config.v_ConfigDocumento WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND codDocSri = '01' AND autoSriAuth = 1)
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad)
                    BEGIN
				        SELECT '0' code,'No tienes configurada ninguna firma electrónica.' AS 'message'
				        RETURN
			        END

                IF (SELECT DATEDIFF(DAY, fechaCaducidad, GETDATE()) FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad) = 0
                    BEGIN
                        SELECT '0' code,'Su firma ha caducado no puede realizar comprobantes electrónicos' AS 'message'
				        RETURN
                    END 
            END 
            
		IF @secuencial IS NULL
			BEGIN
				SELECT '0' code,'No existe una configuracion de secuencial para este Punto de Emision' AS 'message'
				RETURN
			END

		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE nroDocumento = @secuencial AND idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento)
			BEGIN
				SELECT '0' code,'La Factura: ' + dbo.AFTAutoComplete(@secuencial) + ' ya se encuentra registrada' AS 'message'
				RETURN
			END

		IF @claveAcceso IS NULL
			BEGIN
				SELECT '0' code,'Error critico la clave de Acceso no se genero correctamente' AS 'message'
				RETURN
			END

		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE claveAcceso = @claveAcceso)
			BEGIN
				SELECT '0' code,'Error critico esta clave de acceso ya se encuentra registrada' AS 'message'
				RETURN
			END

		BEGIN TRAN
            --> Customer 
			IF NOT EXISTS(SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@identificacionComprador)))
				BEGIN
					INSERT INTO Customer.Customer WITH (ROWLOCK)
                            (IdTypeId,IdCard,BusinessName,TradeName,email,telephone,[Address],SriValidation)
					SELECT IdTypeId,IdCard,BusinessName,TradeName,LTRIM(RTRIM(email)), LTRIM(RTRIM(telefono)),LTRIM(RTRIM(direccionComprador)), 1 
                    FROM @tbComprobante
							
                    SET @customerId = @@IDENTITY
				END
			ELSE
				BEGIN 
					SELECT TOP 1 @customerId = ID FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@identificacionComprador))
				END
            
            --> Customer Company
			IF NOT EXISTS (SELECT 1 FROM Cliente WITH (NOLOCK) WHERE CustomerId = @customerId AND idEntidad = @idEntidad)
				BEGIN
					INSERT INTO dbo.Cliente
                            (idEntidad,direccion,correo,telefono,customerId)
					SELECT @idEntidad,direccionComprador,email,telefono,@customerId 
                    FROM @tbComprobante

					SET @idCliente = @@IDENTITY
				END 

            ELSE    
                BEGIN
                    SELECT TOP 1 @idCliente = idCliente FROM Cliente WITH (NOLOCK) WHERE CustomerId = @customerId AND idEntidad = @idEntidad
                END

            --> InfoTributaria
			INSERT INTO dbo.DocumentoElectronico
                   (idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEstadoServicio,serieComprobante)
			SELECT @idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,@CustomerId,@secuencial,@claveAcceso,@isAutomatic,@idUsuario,@idEstadoServicio,@serieComprobante
            FROM @tbComprobante

            SET @idDocumentoElectronico = SCOPE_IDENTITY()

			--> InfoFactura 
			INSERT INTO Factura
                   (idCliente, idDocumentoElectronico,idUsuario,totalDescuento,porcentajeDescuento,propina,subTotalSinImpuestos,recargo,transporte,total,observacion,fechaRegistro,placa)
			SELECT @idCliente,@idDocumentoElectronico,idUsuario,totalDescuento,porcentajeDescuento,propina,subTotalSinImpuestos,recargo,transporte,total,observacion,dbo.ufnGetdateEcuador(),placa
			FROM @tbComprobante

			SET @idFactura = SCOPE_IDENTITY()

			--> Detalles 
			INSERT INTO FacturaDetalle WITH (ROWLOCK)
                   (idFactura,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,precioCosto,uuid)
            SELECT @idFactura,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,precioCosto,uuid
			FROM @tblDetails 
            ORDER BY orderIndex ASC

            -->Impuestos
            INSERT INTO Ventas.FacturaImpuesto WITH (ROWLOCK)
                   (FacturaId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @idFactura,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

			--> Forma de pago
			INSERT INTO dbo.FormaPagoFactura WITH (ROWLOCK)
                   (idFactura,idFormaPagoSri,idTiempoCredito,abono,idUsuario,fechaRegistro)
            SELECT @idFactura,idFormaPagoSri,idTiempoCredito,total,@idUsuario,dbo.ufnGetDateEcuador() FROM @payment
			
            --> informacion Adiciomal
			IF EXISTS (SELECT 1 FROM @tblInfoAdicional)
                BEGIN
                    INSERT INTO dbo.InfoAdicionalDoc
                           (idComprobante,idTipoDocumento,nombre,valor,idInfoAdicional)
                    SELECT @idFactura,@idTipoDocumento,nombre,valor,idInfoAdicional
                    FROM @tblInfoAdicional
                END 

            --> Manejo de InfoAdicional 
            IF EXISTS (SELECT 1 FROM @historyInfoAdicional)
                BEGIN 
                    INSERT INTO Ventas.HistoryInfoAdicional
                          (idInfoAdicional,idFacturaDetalle)
			        SELECT idInfoAdicional,idFacturaDetalle 
                    FROM @historyInfoAdicional    ia
                    INNER JOIN dbo.FacturaDetalle fd WITH (ROWLOCK) ON fd.uuid = ia.uuid
                    WHERE fd.idFactura = @idFactura

			        UPDATE infoAdd SET estado = 2 
			        FROM Compra.InfoAdicional infoAdd WITH (NOLOCK)
			        INNER JOIN @historyInfoAdicional h ON h.idInfoAdicional = infoAdd.idInfoAdicional
                END

            --> Actualizacion Secuencial
			UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

            --> Inventario
            IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
					BEGIN
                        
                        DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                        SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FE'

                        SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

                        --> Transaccion
                        INSERT INTO Inventario.Transaccion
                               (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                        SELECT @idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idFactura,@customerId,@idUsuario,@idEntidad,@serieComprobante 
                        FROM @tbComprobante 

                        SET @idTransaccion = SCOPE_IDENTITY()

                        --> Bienes
						IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
							BEGIN 
                                INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                                       (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			                    SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,precioTotalSinImpuesto 
                                FROM @tblDetails 
                                WHERE llevaInventario = 1
                                ORDER BY orderIndex ASC

                                EXEC dbo.Transaccion_Handler_Init @idTransaccion
						    END

                        --> Servicios
                        IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 0)
							BEGIN 

                                INSERT INTO [Contabilidad].[Servicio] WITH (ROWLOCK)
                                         (TipoDocumentoId, PuntoEmisionId, ClienteId, UsuarioId,ArticuloId,TarifaId,MedidaId,TipoIvaId,BodegaId,DocumentoId,Secuencial,FechaEmision,Descripcion,Nota,Cantidad,PrecioUnitario,PrecioCosto,PrecioTotalSinImpuesto)
					            SELECT @idTipoDocumentoIv,@idPuntoEmision,@idCliente,@idUsuario,idArticulo,idTarifa,idMedida,idTipoIva,idBodega,@idFactura,@secuencial,@fechaEmision,descripcion,nota,cantidadTransaccion,precioUnitario,precioCosto,precioTotalSinImpuesto
                                FROM @tblDetails 
                                WHERE llevaInventario = 0
                                ORDER BY orderIndex ASC

                            END 
                    END	

            --> Contabilidad
            INSERT INTO Contabilidad.CuentaPorCobrar
                   (idPuntoEmision,idTiempoCredito, idCliente, idEstadoPago,codDoc,idDocumento,secuencial ,serieComprobante,fechaEmision,fechaVencimiento,importeTotal, idEntidad, idUsuario,fechaRegistro)
	        SELECT  idPuntoEmision,idTiempoCredito,@idCliente,@idEstadoPago,codDoc,@idFactura,@secuencial,@serieComprobante,fechaEmision,fechaVencimiento,total,@idEntidad,@idUsuario,dbo.ufnGetDateEcuador()
            FROM @tbComprobante

            SET @idCuentaPorCobrar = SCOPE_IDENTITY()

            INSERT INTO Contabilidad.CuotaPorCobrar
                   (idCuentaPorCobrar,idEstadoPago ,nroCuota,fechaVencimiento,cuota,entrada)
	        SELECT @idCuentaPorCobrar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada 
            FROM @tbCuotas
            ORDER BY nroCuota ASC

            --> Modulo Talleres
            IF EXISTS (SELECT 1 FROM @tbComprobante WHERE SupportId > 0)
                BEGIN
                    SELECT TOP 1 @SupportId = SupportId FROM @tbComprobante 

                    SELECT TOP 1 @idEstadoDocumento = Id FROM Mechanical.SupportStatus WHERE Code = 'AP'

                    UPDATE Mechanical.Support SET SupportStatusId = @idEstadoDocumento WHERE Id = @SupportId 

                    INSERT INTO Mechanical.SupportDocument
                          (SupportId,TipoDocumentoId,UserId,DocumentoId,SeriesVoucher)
                    SELECT SupportId,@idTipoDocumento,@idUsuario,@idFactura,@serieComprobante FROM @tbComprobante
                END 

			--> Payload
			IF @tiempoCredito = 1
				BEGIN
					SELECT TOP 1 @payAutomatic = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.payAutomatic'), @printerAutomatic = JSON_VALUE(dbo.f_sanitize_json(jsonConfig),'$.printerAutomatic') FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CV'
				END

			SET @payload = (SELECT idDocumento       = @idFactura
			                      ,idTipoDocumento   = @idTipoDocumento
								  ,codEstab          = @codEstab
								  ,tiempoCredito     = @tiempoCredito
								  ,idCliente         = @idCliente
								  ,codDoc            = '01'
								  ,idCuentaPorCobrar = @idCuentaPorCobrar
								  ,payAutomatic      = @payAutomatic
								  ,printerAutomatic  = @printerAutomatic
							 FOR JSON PATH)

		COMMIT TRAN
		SELECT '1' code,'Registrado Exitosamente' as 'message', @payload as payload
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Factura/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH
END
