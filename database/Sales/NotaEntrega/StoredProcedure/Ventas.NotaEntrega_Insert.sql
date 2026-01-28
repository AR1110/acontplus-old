USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaEntrega_Insert]    Script Date: 12/8/2022 9:19:07 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-12-01
-- Description:	SP para insertas las notas de entrega 
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.NotaEntrega_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN

	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET DEADLOCK_PRIORITY LOW;

	SET LANGUAGE SPANISH 

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT,@idNotaEntrega INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT 

    --> Data Json
    DECLARE @notaEntrega VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

    --> Venta 
	DECLARE @idPuntoEmision INT ,@codEstab VARCHAR(50) ,@payAutomatic BIT ,@printerAutomatic BIT ,@idCuentaPorCobrar INT ,@secuencial INT  
           ,@fechaEmision DATETIME ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5)

	--> Cliente
	DECLARE @idCliente INT ,@identificacionComprador VARCHAR(15),@customerId INT

	--> Contabilidad 
	DECLARE @tiempoCredito BIT ,@serieComprobante VARCHAR(30) ,@idEstadoPago INT

     --> Mecanica
    DECLARE @SupportId INT ,@idEstadoDocumento INT

    --> Tb
    DECLARE @tbComprobante AS TABLE (
		idCliente INT NOT NULL
	   ,idTiempoCredito INT NOT NULL
	   ,idPuntoEmision INT NOT NULL
	   ,idUsuario INT NOT NULL
	   ,codDoc VARCHAR(10) NOT NULL DEFAULT 'NE'
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
         orderIndex INT
        ,idArticulo INT NOT NULL
        ,idTarifa INT NOT NULL
        ,idBodega INT NOT NULL
        ,idMedida INT NULL
        ,idTipoIva INT NOT NULL
        ,ice NUMERIC (18,5) NOT NULL
        ,cantidad NUMERIC (18,5) NOT NULL
        ,precioUnitario NUMERIC (18,6)  NOT NULL
        ,precioCosto NUMERIC (18,5)  NOT NULL
        ,valorDescuento NUMERIC (18,5) NOT NULL
        ,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
        ,nota VARCHAR(300) NULL
        ,descripcion VARCHAR(255) NOT NULL 
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
        ,uuid VARCHAR(300) NOT NULL
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
        SELECT @notaEntrega           = notaEntrega
              ,@detalles              = detalles
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@infoAdicionalArticulo = infoAdicionalArticulo
              ,@cuotas                = cuotas
        FROM OPENJSON(@json) WITH 
        (
             notaEntrega           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,infoAdicionalArticulo NVARCHAR(MAX) as json
            ,cuotas                NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idCliente,IdTypeId,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,IdCard,BusinessName,TradeName,direccionComprador,email,telefono,SupportId)
		SELECT idCliente,IdTypeId,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,IdCard,BusinessName,TradeName,direccionComprador,email,telefono,SupportId
		FROM OPENJSON(@notaEntrega) WITH
        (
			 idCliente               INT 
			,idTiempoCredito         INT 
			,idPuntoEmision          INT
			,idUsuario               INT
			,fechaEmision            DATETIME2
			,fechaVencimiento        DATETIME2
			,subTotalSinImpuestos    NUMERIC(18,5)
			,totalDescuento          NUMERIC(18,5)
			,porcentajeDescuento     NUMERIC(18,5)
			,propina                 NUMERIC(18,5)
			,recargo			     NUMERIC(18,5)
			,transporte              NUMERIC(18,5) 
			,total                   NUMERIC(18,5)
			,observacion             VARCHAR(500) 
			,IdTypeId                INT          '$.idTipoIdentificacion'
            ,IdCard                  VARCHAR(300) '$.identificacionComprador'
	        ,BusinessName            VARCHAR(300) '$.razonSocialComprador'
	        ,TradeName               VARCHAR(300) '$.razonSocialComprador'
	        ,direccionComprador      VARCHAR(300)
	        ,email                   VARCHAR(300)
	        ,telefono                VARCHAR(300)
            ,proformaId              INT
            ,supportId               INT

		) AS js

		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,conversion,precioCostoFraccionado,uuid)
		SELECT orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion*-1,conversion,precioCostoFraccionado,uuid
		FROM OPENJSON (@detalles) WITH
        (
			 orderIndex             INT 
			,idArticulo             INT
			,idTarifa               INT 
			,idBodega               INT 
			,idMedida               INT 
            ,idTipoIva              INT 
			,ice                    NUMERIC(10,5) 
			,cantidad               NUMERIC(15,5)
			,precioCosto            NUMERIC(15,5) 
			,precioUnitario         NUMERIC(18,6) 
			,valorDescuento         NUMERIC(15,5) 
			,precioTotalSinImpuesto NUMERIC(15,5) 
            ,codigoPorcentaje       VARCHAR(5) 
            ,tarifa                 NUMERIC(15,5) 
			,porcentajeDescuento    NUMERIC(15,5) 
            ,valorImpuesto          NUMERIC(15,5) 
			,nota                   VARCHAR(300) 
			,descripcion            VARCHAR(255) 
            ,llevaInventario        BIT 
            ,cantidadTransaccion    NUMERIC(15,5)
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
            ,uuid                   VARCHAR(300)
		)

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

        INSERT INTO @tblInfoAdicional 
              (idInfoAdicional,nombre,valor)
		SELECT idInfoAdicional,nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre          VARCHAR(300) 
           ,valor           VARCHAR(300)
           ,idInfoAdicional INT
        )
			
		INSERT INTO @historyInfoAdicional 
              (idInfoAdicional,uuid)
        SELECT idInfoAdicional,uuid FROM OPENJSON(@infoAdicionalArticulo) WITH
        (
            idInfoAdicional INT
           ,uuid            VARCHAR(300)
        )
				
        --> Variables del documento
		SELECT @idCliente               = js.idCliente
              ,@idPuntoEmision          = js.idPuntoEmision
              ,@idUsuario		        = IIF(js.idUsuario = 0, @idUsuario, js.idUsuario)
              ,@identificacionComprador = js.IdCard
              ,@SupportId               = js.SupportId
              ,@fechaEmision            = js.fechaEmision
			  ,@codEstab                = sr.codEstab
			  ,@estab                   = sr.estab
			  ,@ptoEmi                  = pt.ptoEmi
		      ,@tiempoCredito           = tc.tipo
		FROM @tbComprobante               js
		INNER JOIN dbo.PuntoEmision       pt WITH (NOLOCK) ON pt.idPuntoEmision    = js.idPuntoEmision
		INNER JOIN dbo.TiempoCredito      tc WITH (NOLOCK) ON tc.idTiempoCredito   = js.idTiempoCredito
        INNER JOIN Sri.Establecimiento    sr WITH (NOLOCK) ON sr.idEstablecimiento = pt.idEstablecimiento
        

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH(NOLOCK) WHERE codigo = 'PE'
			
        SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH(NOLOCK) WHERE codigo = 'NE'

		SELECT TOP 1 @secuencial = ultimaSecuencia FROM dbo.ConfiguracionDocumento WITH(NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

        SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Cliente WHERE idCliente = @idCliente

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

		IF @secuencial IS NULL
			BEGIN
				SELECT '0'code,'No existe una configuracion de secuencial para este Punto de Emision' as 'message'
				RETURN 
			END

		IF EXISTS (SELECT 1 FROM NotaEntrega WHERE nroDocumento = @secuencial AND idPuntoEmision = @idPuntoEmision)
			BEGIN 
				SELECT '0'code,'La Nota de Entrega: '+dbo.AFTAutoComplete(@secuencial)+' ya se encuentra registrada'  as 'message'
				RETURN 
			END 

		BEGIN TRAN
			IF @idCliente = 0
				BEGIN
                    --> Customer
					IF NOT EXISTS(SELECT 1 FROM Customer.Customer WHERE IDCard = LTRIM(RTRIM(@identificacionComprador)))
						BEGIN
							INSERT INTO Customer.Customer WITH (ROWLOCK)
                                  (IdTypeId,IdCard,BusinessName,TradeName,email,telephone,[Address],SriValidation)
							SELECT IdTypeId,IdCard,BusinessName,TradeName,LTRIM(RTRIM(email)), LTRIM(RTRIM(telefono)),LTRIM(RTRIM(direccionComprador)), 1 
                            FROM @tbComprobante
							
                            SET @customerId = SCOPE_IDENTITY()
						END
					ELSE
						BEGIN 
							SELECT TOP 1 @customerId = ID FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@identificacionComprador))
						END

                    --> Customer Company
                    IF NOT EXISTS (SELECT 1  FROM dbo.Cliente WHERE CustomerId = @customerId AND idEntidad = @idEntidad)
                        BEGIN 
                            INSERT INTO dbo.Cliente
                                   (idEntidad,direccion,correo,telefono,customerId)
							SELECT @idEntidad,direccionComprador,email,telefono,@customerId 
                            FROM @tbComprobante

							SET @idCliente = SCOPE_IDENTITY()

                        END 
                    ELSE 
                        BEGIN
                            SELECT @idCliente = idCliente FROM dbo.Cliente WITH (NOLOCK) WHERE CustomerId = @customerId AND idEntidad = @idEntidad
                        END
				END
				
            --> Comprobante
			INSERT INTO NotaEntrega
			       (idCliente,idPuntoEmision,nroDocumento,idTipoDocumento,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,idUsuario ,idEntidad  ,serieComprobante)
			SELECT @idCliente,idPuntoEmision,@secuencial,@idTipoDocumento,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,@idUsuario,@idEntidad,@serieComprobante
			FROM @tbComprobante

			SET @idNotaEntrega = SCOPE_IDENTITY()

		    --> Detalles
			INSERT INTO NotaEntregaDetalle 
				   (idNotaEntrega,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,tarifa,codigoPorcentaje,nota,descripcion,valorImpuesto,precioCosto,uuid)
			SELECT @idNotaEntrega,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,tarifa,codigoPorcentaje,nota,descripcion,valorImpuesto,precioCosto,uuid
			FROM @tblDetails
			ORDER BY orderIndex ASC 

            --> Impuestos
            INSERT INTO Ventas.NotaEntregaImpuesto
                   (NotaEntregaId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @idNotaEntrega,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

            --> informacion Adiciomal
			IF EXISTS (SELECT 1 FROM @tblInfoAdicional)
                BEGIN
                    INSERT INTO dbo.InfoAdicionalDoc
                            (idComprobante,idTipoDocumento,nombre,valor,idInfoAdicional)
                    SELECT @idNotaEntrega,@idTipoDocumento,nombre,valor,idInfoAdicional
                    FROM @tblInfoAdicional
                END

            --> Manejo de InfoAdicional 
            IF EXISTS (SELECT 1 FROM @historyInfoAdicional)
                BEGIN 
                    INSERT INTO Ventas.HistoryInfoAdicional
                          (idInfoAdicional,idNotaEntregaDetalle)
			        SELECT idInfoAdicional,idNotaEntregaDetalle 
                    FROM @historyInfoAdicional        ia
                    INNER JOIN dbo.NotaEntregaDetalle nd WITH (ROWLOCK) ON nd.uuid = ia.uuid
                    WHERE nd.idNotaEntrega = @idNotaEntrega
			
			        UPDATE infoAdd  SET estado = 2 
			        FROM Compra.InfoAdicional infoAdd WITH (NOLOCK)
			        INNER JOIN @historyInfoAdicional h ON h.idInfoAdicional = infoAdd.idInfoAdicional
                END

            --> Ultimo Secuencial
			UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

            --> Modulo Talleres
            IF EXISTS (SELECT 1 FROM @tbComprobante WHERE SupportId > 0)
                BEGIN
                    SELECT TOP 1 @SupportId = SupportId FROM @tbComprobante 

                    SELECT TOP 1 @idEstadoDocumento = Id FROM Mechanical.SupportStatus WHERE Code = 'AP'

                    UPDATE Mechanical.Support SET SupportStatusId = @idEstadoDocumento WHERE Id = @SupportId 

                    INSERT INTO Mechanical.SupportDocument
                          (SupportId,TipoDocumentoId,UserId,DocumentoId,SeriesVoucher)
                    SELECT SupportId,@idTipoDocumento,@idUsuario,@idNotaEntrega,@serieComprobante FROM @tbComprobante
                END

			--> Invetario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    
                    DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NE'

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

                    --> Bienes 
					IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
						BEGIN 
                            --> Transaccion
                            INSERT INTO Inventario.Transaccion
                                   (idTipoTransaccion,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,fechaEmision,serieComprobante)
                            SELECT @idTipoTransaccion,@idTipoDocumentoIv,@idNotaEntrega,@customerId,@idUsuario,@idEntidad,fechaEmision,@serieComprobante 
                            FROM @tbComprobante 

                            SET @idTransaccion = SCOPE_IDENTITY()

                            -->Detalles
                            INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                                   (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			                SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,precioTotalSinImpuesto 
                            FROM @tblDetails WHERE llevaInventario = 1

                            EXEC dbo.Transaccion_Handler_Init @idTransaccion
						END

                    --> Servicios
                    IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 0)
						BEGIN 
                            INSERT INTO [Contabilidad].[Servicio] WITH (ROWLOCK)
                                     (TipoDocumentoId,PuntoEmisionId,ClienteId,UsuarioId,ArticuloId,TarifaId,MedidaId,TipoIvaId,BodegaId,DocumentoId,Secuencial,FechaEmision,Descripcion,Nota,Cantidad,PrecioUnitario,PrecioCosto,PrecioTotalSinImpuesto)
					        SELECT @idTipoDocumentoIv,@idPuntoEmision,@idCliente,@idUsuario,idArticulo,idTarifa,idMedida,idTipoIva,idBodega,@idNotaEntrega,@secuencial,@fechaEmision,descripcion,nota,cantidadTransaccion,precioUnitario,precioCosto,precioTotalSinImpuesto
                            FROM @tblDetails WHERE llevaInventario = 0
                        END 
				END

            --> Contabilidad
            INSERT INTO Contabilidad.CuentaPorCobrar
                  (idPuntoEmision,idTiempoCredito,codDoc,fechaEmision,fechaVencimiento, idCliente, idEstadoPago,idDocumento,secuencial ,serieComprobante,importeTotal, idEntidad, idUsuario,fechaRegistro)
	        SELECT idPuntoEmision,idTiempoCredito,codDoc,fechaEmision,fechaVencimiento,@idCliente,@idEstadoPago,@idNotaEntrega,@secuencial,@serieComprobante,total,@idEntidad,@idUsuario,dbo.ufnGetDateEcuador()
            FROM @tbComprobante

            SET @idCuentaPorCobrar = SCOPE_IDENTITY()

            INSERT INTO Contabilidad.CuotaPorCobrar
                   (idCuentaPorCobrar,idEstadoPago ,nroCuota,fechaVencimiento,cuota,entrada)
	        SELECT @idCuentaPorCobrar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada 
            FROM @tbCuotas
            ORDER BY nroCuota ASC


			--> Payload
			IF @tiempoCredito = 1
				BEGIN
					SELECT TOP 1 @payAutomatic = CAST(payAutomatic AS BIT) , @printerAutomatic = CAST(printerAutomatic AS BIT) FROM Config.v_Sistema_Ventas WITH (NOLOCK) WHERE idEntidad = @idEntidad 
				END
				
			SELECT TOP 1 @idCuentaPorCobrar = idCuentaPorCobrar FROM Contabilidad.CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = 'NE' AND idDocumento = @idNotaEntrega

			SET @payload = (SELECT idDocumento             = @idNotaEntrega
			                      ,idTipoDocumento         = @idTipoDocumento
								  ,codEstab                = @codEstab
								  ,tiempoCredito           = @tiempoCredito
								  ,idCliente               = @idCliente
								  ,codDoc                  = 'NE'
								  ,idCuentaPorCobrar       = @idCuentaPorCobrar
								  ,payAutomatic            = @payAutomatic
								  ,printerAutomatic        = @printerAutomatic
						    FOR JSON PATH)
				
		COMMIT TRAN
		SELECT '1'code,'Registrado Correctamente' as 'message',@payload  as payload
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
		
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/NotaEntrega/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	    
        SELECT '0'code,'Info: Error en el procedimiento:' as 'message'
    END CATCH 
END
