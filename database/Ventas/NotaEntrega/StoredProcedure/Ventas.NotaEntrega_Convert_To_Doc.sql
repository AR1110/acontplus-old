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
CREATE OR ALTER PROCEDURE Ventas.NotaEntrega_Convert_To_Doc @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT,@idDocumento INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    -- Data Json
    DECLARE @comprobante VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@formaPago VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@cuotas VARCHAR(MAX)
       
	--> Convert 
    DECLARE @idPuntoEmision INT ,@idNotaEntrega INT

	--> Cliente
	DECLARE @idCliente INT ,@CustomerId INT 
	
	--> Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@claveAcceso NVARCHAR(50) ,@isAutomatic INT ,@secuencial INT
           ,@idEstadoServicio INT ,@idDocumentoElectronico INT

	--> Contabilidad 
	DECLARE @serieComprobante VARCHAR(30) ,@idEstadoPago INT ,@idCuentaPorCobrar INT 


	DECLARE @tbComprobante AS TABLE (
		idCliente INT NOT NULL
	   ,idPuntoEmision INT NOT NULL
	   ,idUsuario INT NOT NULL
	   ,idTiempoCredito INT NOT NULL
       ,codDoc VARCHAR(10) NOT NULL DEFAULT '01'
       ,versionComp VARCHAR(10) NOT NULL DEFAULT '1.1.0'
       ,fechaEmision DATETIME2 NOT NULL
       ,fechaVencimiento DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
       ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
       ,docDestino VARCHAR(15) NOT NULL
       ,idNotaEntrega INT NOT NULL
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
		,precioSinSubsidio NUMERIC(18,5) NOT NULL DEFAULT 0
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
		,nota VARCHAR(100) NULL
		,descripcion VARCHAR(255) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) DEFAULT 0 NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCosto NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
        ,estado INT NOT NULL DEFAULT 2
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
        SELECT @comprobante           = comprobante
              ,@detalles              = detalles
              ,@formaPago             = formaPago
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@cuotas                = cuotas
        FROM OPENJSON(@json) WITH 
        (
             comprobante           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json 
            ,formaPago             NVARCHAR(MAX) as json
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,cuotas                NVARCHAR(MAX) as json
        )

        --> Comprbante Json
		INSERT INTO @tbComprobante
		      (idCliente,idTiempoCredito,idPuntoEmision,idUsuario,idNotaEntrega,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,docDestino)
		SELECT idCliente,idTiempoCredito,idPuntoEmision,idUsuario,idNotaEntrega,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,docDestino 
		FROM OPENJSON(@comprobante) WITH
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
            ,idNotaEntrega           INT
            ,docDestino              VARCHAR(50)

		) AS js
		
        --> Detalles
		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,conversion,precioCostoFraccionado)
		SELECT orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,conversion,precioCostoFraccionado 
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
		    ,nota                   VARCHAR(100)
		    ,descripcion            VARCHAR(255) 
		    ,idTipoIva              INT 
            ,llevaInventario        BIT
            ,cantidadTransaccion    NUMERIC(15,5)
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
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
              (nombre,valor) 
        SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre VARCHAR(300) 
           ,valor  VARCHAR(300) 
        )

		--> Capturando Variables
		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE codigoSri = '01'

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

		SELECT @idCliente      = js.idCliente
			  ,@idPuntoEmision = js.idPuntoEmision
              ,@idNotaEntrega  = js.idNotaEntrega
              ,@idUsuario	   = IIF(js.idUsuario = 0, @idUsuario, js.idUsuario)
              ,@fechaEmision   = js.fechaEmision
			  ,@estab          = sr.estab
			  ,@ptoEmi         = po.ptoEmi
			  ,@ambiente       = po.ambiente 
		FROM @tbComprobante               js
		INNER JOIN dbo.PuntoEmision       po WITH (NOLOCK) ON po.idPuntoEmision    = js.idPuntoEmision
		INNER JOIN dbo.TiempoCredito      tc WITH (NOLOCK) ON tc.idTiempoCredito   = js.idTiempoCredito
        INNER JOIN Sri.Establecimiento    sr WITH (NOLOCK) ON sr.idEstablecimiento = po.idEstablecimiento
		
		SELECT TOP 1 @secuencial = ultimaSecuencia ,@isAutomatic = autoSriAuth FROM Config.v_ConfigDocumento WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab), '01', @ambiente,'1', dbo.AFTConvertDate(@fechaEmision), @ruc, @estab + @ptoEmi, Helper.F_Auto_Sequential(@secuencial))

		SELECT @serieComprobante   = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial)

        SELECT TOP 1 @customerId = ISNULL(CustomerId,0) FROM Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

		--> Validando Informacion 
        IF (SELECT COUNT(*) FROM @tbComprobante) = 0 
            BEGIN
                SELECT '0' code,'Error en la info Factura' AS 'message'
				RETURN
            END 

        IF (SELECT COUNT(*) FROM @tblDetails) = 0 
            BEGIN
                SELECT '0' code,'Error en los detalles' AS 'message'
				RETURN
            END

         IF (SELECT COUNT(*) FROM @payment) = 0 
            BEGIN
                SELECT '0' code,'Error en la forma de pago' AS 'message'
				RETURN
            END
           
        IF (SELECT COUNT(*) FROM @tbTaxes) = 0 
            BEGIN
                SELECT '0' code,'Error en los impuestos' AS 'message'
				RETURN
            END

        IF (SELECT COUNT(*) FROM @tbCuotas) = 0 
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
				SELECT '0' code,'Error critico esta clave de acceso ya existe en la Factura' AS 'message'
				RETURN
			END

		BEGIN TRAN
            
            IF EXISTS (SELECT 1 FROM @tbComprobante WHERE docDestino = 'FE')
                BEGIN 
			        --> InfoTributaria
			        INSERT INTO dbo.DocumentoElectronico
                           (idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEstadoServicio,serieComprobante)
			        SELECT @idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,@CustomerId,@secuencial,@claveAcceso,@isAutomatic,@idUsuario,@idEstadoServicio,@serieComprobante
                    FROM @tbComprobante

                    SET @idDocumentoElectronico = SCOPE_IDENTITY()

			        --> InfoFactura 
			        INSERT INTO Factura
                           (idCliente, idDocumentoElectronico,idUsuario,totalDescuento,porcentajeDescuento,propina,subTotalSinImpuestos,recargo,transporte,total,observacion,fechaRegistro)
			        SELECT @idCliente,@idDocumentoElectronico,idUsuario,totalDescuento,porcentajeDescuento,propina,subTotalSinImpuestos,recargo,transporte,total,observacion,dbo.ufnGetdateEcuador()
			        FROM @tbComprobante

			        SET @idDocumento = SCOPE_IDENTITY()

			        --> Detalle 
			        INSERT INTO FacturaDetalle WITH (ROWLOCK)
                           (  idFactura,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,precioCosto)
			        SELECT @idDocumento,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioSinSubsidio,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,precioCosto
			        FROM @tblDetails 
                    ORDER BY orderIndex ASC

                    -->Impuestos
                    INSERT INTO Ventas.FacturaImpuesto WITH (ROWLOCK)
                             (FacturaId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
                    SELECT @idDocumento,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

			        --> Forma de pago
			        INSERT INTO dbo.FormaPagoFactura WITH (ROWLOCK)
                             (idFactura,idFormaPagoSri,idTiempoCredito,abono,idUsuario,fechaRegistro)
                    SELECT @idDocumento,idFormaPagoSri,idTiempoCredito,total,@idUsuario,dbo.ufnGetDateEcuador() FROM @payment
			
                    --> informacion Adiciomal
			        INSERT INTO dbo.InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor) SELECT @idDocumento,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

                    --> Actualizacion Secuencial
			        UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

                END 

            --> Inventario
            IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                        
                    DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FE'

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

                    --IF EXISTS (SELECT 1 FROM Inventario.v_Articulo_Transaccion WITH (NOLOCK ) WHERE codTransaccion = 'S' AND codDoc = 'NE' AND idDocumento = @idNotaEntrega AND estado = 1)
                    --    BEGIN
                    --        UPDATE t1 
                    --           SET t1.estado = 2
                    --              ,t1.cantidadTransaccion = 0 
                    --        FROM Inventario.TransaccionDetalle    t1 WITH (ROWLOCK)
                    --        INNER JOIN Inventario.Transaccion     t2 WITH (ROWLOCK) ON t2.idTransaccion     = t1.idTransaccion
                    --        INNER JOIN Inventario.TipoDocumento   t3 WITH (ROWLOCK) ON t3.idTipoDocumento   = t2.idTipoDocumento
                    --        INNER JOIN Inventario.TipoTransaccion t4 WITH (ROWLOCK) ON t4.idTipoTransaccion = t2.idTipoTransaccion
                    --        WHERE t1.estado = 1 
                    --          AND t2.idDocumento = @idNotaEntrega 
                    --          AND t3.codigo = 'NE'
                    --          AND t4.codigo = 'S'
                              
                    --    END 

                    --> Bienes
					IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
						BEGIN 
                            --> Transaccion
                            INSERT INTO Inventario.Transaccion
                                   (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                            SELECT @idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idDocumento,@customerId,@idUsuario,@idEntidad,@serieComprobante 
                            FROM @tbComprobante 

                            SET @idTransaccion = SCOPE_IDENTITY()

                            -->Detalles
                            INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                                   (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total,estado)
			                SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,precioTotalSinImpuesto,estado
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
					        SELECT @idTipoDocumentoIv,@idPuntoEmision,@idCliente,@idUsuario,idArticulo,idTarifa,idMedida,idTipoIva,idBodega,@idDocumento,@secuencial,@fechaEmision,descripcion,nota,cantidadTransaccion,precioUnitario,precioCosto,precioTotalSinImpuesto
                            FROM @tblDetails 
                            WHERE llevaInventario = 0
                            ORDER BY orderIndex ASC
                        END 
                END	

            --> Contabilidad
            INSERT INTO Contabilidad.CuentaPorCobrar
                  (idPuntoEmision,idTiempoCredito,idCliente, idEstadoPago,codDoc,idDocumento,secuencial ,serieComprobante,fechaEmision,fechaVencimiento,importeTotal, idEntidad, idUsuario,fechaRegistro)
	        SELECT idPuntoEmision,idTiempoCredito,idCliente,@idEstadoPago,codDoc,@idDocumento,@secuencial,@serieComprobante,fechaEmision,fechaVencimiento,total,@idEntidad,@idUsuario,dbo.ufnGetDateEcuador()
            FROM @tbComprobante

            SET @idCuentaPorCobrar = SCOPE_IDENTITY()

            INSERT INTO Contabilidad.CuotaPorCobrar
                   (idCuentaPorCobrar,idEstadoPago ,nroCuota,fechaVencimiento,cuota,entrada)
	        SELECT @idCuentaPorCobrar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada 
            FROM @tbCuotas
            ORDER BY nroCuota ASC

            --> NotaEntrega Documento
            UPDATE dbo.NotaEntrega WITH (ROWLOCK) SET convertToDoc = 1 WHERE idNotaEntrega = @idNotaEntrega

            INSERT INTO Ventas.NotaEntregaDocumento 
                   (NotaEntregaId,TipoDocumentoId,UsuarioId,DocumentoId,SerieComprobante)
            SELECT @idNotaEntrega,@idTipoDocumento,@idUsuario,@idDocumento,@SerieComprobante FROM @tbComprobante

		COMMIT TRAN
		SELECT '1' code,'Registrado Exitosamente' as 'message'
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/NotaEntrega/ConvertToDoc',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH
END
