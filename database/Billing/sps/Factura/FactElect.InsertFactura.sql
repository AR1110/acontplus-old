USE [AcontPlus]
GO

CREATE OR ALTER PROCEDURE FactElect.InsertFactura
     @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @code VARCHAR(50) ,@message VARCHAR(300) ,@idFactura INT

    --> Factura
	DECLARE @idDocumentoElectronico INT
           ,@idUsuario              INT
           ,@idTipoDocumento        INT
           ,@idEntidad              INT
           ,@result                 VARCHAR(MAX)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Json
    DECLARE @infoFactura VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@formaPago VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

    --> Customer Company
    DECLARE @idCliente INT

    --> Documento Electronico
    DECLARE @idPuntoEmision INT

    DECLARE @tbComprobante AS TABLE
    (
		idCliente INT NULL
	   ,idTiempoCredito INT NOT NULL
	   ,idPuntoEmision INT NOT NULL
	   ,idUsuario INT NOT NULL
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

    BEGIN TRY
        --> Comprbante Json
		INSERT INTO @tbComprobante
		      (idCliente,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa)
		SELECT idCliente,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa 
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
		    ,nota                   VARCHAR(100)
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

        --> Recuperacion de variables
        SELECT TOP 1 @idCliente = ISNULL(idCliente,0),@idPuntoEmision = idPuntoEmision FROM @tbComprobante  

        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SET @message = 'Error en la info Factura';
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SET @message = 'Error en los detalles';
            END

        IF NOT EXISTS(SELECT 1 FROM @payment) 
            BEGIN
                SET @message = 'Error en la forma de pago';
            END
           
        IF NOT EXISTS(SELECT 1 FROM @tbTaxes) 
            BEGIN
                SET @message = 'Error en los impuestos';
            END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END

        --> Transaccion Principal.
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END
                
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

        IF (@@ROWCOUNT > 0)
			    BEGIN
				    SET @code = '0';
				    SET @message = 'Registrado Exitosamente';
			    END
		    ELSE
			    BEGIN
				    SET @code = '50001';
				    SET @errorCode = 5001
                    SET @errorMessage = 'No se pudo registrar'
				    SET @message = @errorMessage;
			    END
 
	    IF (@startedTransaction = 1)
		    BEGIN
			    COMMIT;
			    SELECT @code as code, @message as 'message';
		    END
    END TRY

    BEGIN CATCH
        IF @startedTransaction = 1 
            BEGIN
                ROLLBACK TRANSACTION;
                -- Log error details
                INSERT INTO dbo.ErroresSistema
                (
                    [method]
                   ,[errorNumber]
                   ,[errorSeverity]
                   ,[errorState]
                   ,[errorProcedure]
                   ,[errorLine]
                   ,[errorMessage]
                   ,[idUsuario]
                )
                VALUES
                (
                    'InsertFactura/Insert'
                   ,ERROR_NUMBER()
                   ,ERROR_SEVERITY()
                   ,ERROR_STATE()
                   ,ERROR_PROCEDURE()
                   ,ERROR_LINE()
                   ,ERROR_MESSAGE()
                   ,@idUsuario
                );

                SELECT '50001' Code, 'Error en el procedimiento: ' as Message;
				THROW;
            END
        ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE()
			END
    END CATCH
END
