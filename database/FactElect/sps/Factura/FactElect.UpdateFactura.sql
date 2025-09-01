USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Factura_Update]    Script Date: 12/8/2022 4:59:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-11-25
-- Description:	SP para actualizar la factura
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.UpdateFactura
     @userRoleId INT
    ,@id INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	--> Global 
    DECLARE @idUsuario INT ,@idEntidad INT ,@idTipoDocumento INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Data Json
    DECLARE @infoFactura VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@formaPago VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

	DECLARE @tbComprobante AS TABLE (
	    idFactura INT NOT NULL UNIQUE
       ,idCliente INT NOT NULL
	   ,idUsuario INT NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	   ,placa VARCHAR(100) NULL
	)

	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idFacturaDetalle INT NOT NULL
		,idArticulo INT NOT NULL
		,idTarifa INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,nota VARCHAR(100)  NULL
		,descripcion VARCHAR(300) NOT NULL
        ,precioCosto NUMERIC (18,5)  NOT NULL
        ,estado BIT NOT NULL
        ,uuid VARCHAR(300) NOT NULL
	)

    DECLARE @payment AS TABLE (
        idFormaPagoFactura INT UNIQUE NOT NULL
       ,idFormaPagoSri INT NOT NULL
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
		 idInfoAdicional INT NULL
        ,nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	DECLARE @historyInfoAdicional AS TABLE(
		 idHistoryInfoAdicional INT NOT NULL  
        ,idInfoAdicional INT NOT NULL
	    ,estado INT NOT NULL
        ,uuid VARCHAR(300) NOT NULL
        
	)

	BEGIN TRY
		
        --> Data Json 
        SELECT @infoFactura           = infoFactura
              ,@detalles              = detalles
              ,@formaPago             = formaPago
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@infoAdicionalArticulo = infoAdicionalArticulo
        FROM OPENJSON(@json) WITH 
        (
             infoFactura           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json 
            ,impuestos             NVARCHAR(MAX) as json
            ,formaPago             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,infoAdicionalArticulo NVARCHAR(MAX) as json
        )

		INSERT INTO @tbComprobante
		      (idFactura,idCliente,idUsuario,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa)
		SELECT @id      ,idCliente,idUsuario,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa
		FROM OPENJSON(@infoFactura) 
		WITH
        (
			 idCliente            INT  
			,idUsuario            INT  
			,subTotalSinImpuestos NUMERIC(18,5)
			,totalDescuento       NUMERIC(18,5)
			,porcentajeDescuento  NUMERIC(18,5)
			,propina              NUMERIC(18,5)
			,recargo			  NUMERIC(18,5)
			,transporte           NUMERIC(18,5)
			,total                NUMERIC(18,5) 
			,observacion          VARCHAR(500) 
			,placa                VARCHAR(100) 

         ) AS js
		
		INSERT INTO @tblDetails
              (idFacturaDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,estado,uuid)
		SELECT idFacturaDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,estado,uuid 
		FROM OPENJSON (@detalles) WITH 
        (
             orderIndex             INT 
			,idFacturaDetalle       INT 
			,idArticulo             INT 
			,idTarifa               INT 
			,idBodega               INT 
			,idMedida               INT 
            ,idTipoIva              INT 
			,ice                    NUMERIC(10,5) 
			,cantidad               NUMERIC(15,5) 
			,precioUnitario         NUMERIC(15,5) 
			,precioCosto            NUMERIC(15,5) 
			,valorDescuento         NUMERIC(15,5) 
			,precioTotalSinImpuesto NUMERIC(15,5) 
			,porcentajeDescuento    NUMERIC(15,5)
			,precioTotalSinImpuesto NUMERIC(15,5) 
            ,codigoPorcentaje       VARCHAR(5) 
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5) 
			,nota                   VARCHAR(100)
			,descripcion            VARCHAR(300) 
            ,estado                 BIT 
            ,uuid                   VARCHAR(300)
		)

        INSERT INTO @payment
              (idFormaPagoFactura,idFormaPagoSri,idTiempoCredito,total)
        SELECT idFormaPagoFactura,idFormaPagoSri,idTiempoCredito,total
        FROM OPENJSON(@formaPago) WITH 
        (
            idFormaPagoFactura INT
           ,idFormaPagoSri     INT 
           ,idTiempoCredito    INT 
           ,total              NUMERIC(18,5) 
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

		-->InfoAdicional
		INSERT INTO @tblInfoAdicional 
              (idInfoAdicional,nombre,valor) 
        SELECT idInfoAdicional,nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            idInfoAdicional INT
           ,nombre          VARCHAR(300) 
           ,valor           VARCHAR(300) 
        )

		INSERT INTO @historyInfoAdicional 
              (idHistoryInfoAdicional,idInfoAdicional,estado,uuid)
        SELECT idHistoryInfoAdicional,idInfoAdicional,estado,uuid FROM OPENJSON(@infoAdicionalArticulo) WITH
        (
            idHistoryInfoAdicional INT
           ,idInfoAdicional        INT
           ,uuid                   VARCHAR(300)
           ,estado                 INT
        )

        --> VARIABLES
		SELECT TOP 1 @idUsuario = idUsuario,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE codigoSri = '01'

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

            --> Info Factura
			UPDATE f SET 
				   f.idCliente           = jf.idCliente
				  ,f.subTotalSinImpuestos= jf.subTotalSinImpuestos
				  ,f.totalDescuento      = jf.totalDescuento
				  ,f.porcentajeDescuento = jf.porcentajeDescuento
				  ,f.propina             = jf.propina
				  ,f.recargo             = jf.recargo
				  ,f.transporte          = jf.transporte
				  ,f.total               = jf.total
				  ,f.placa               = jf.placa
				  ,f.observacion         = jf.observacion
				  ,f.lastChange          = dbo.ufnGetDateEcuador()
			FROM Factura               f WITH (ROWLOCK)
			INNER JOIN @tbComprobante jf ON f.idFactura = jf.idFactura

            --> Detalles
			UPDATE fd SET 
				   fd.idTarifa               = js.idTarifa
				  ,fd.idBodega               = js.idBodega
				  ,fd.idMedida               = js.idMedida
				  ,fd.ice                    = js.ice
				  ,fd.cantidad               = js.cantidad
				  ,fd.precioUnitario         = js.precioUnitario
				  ,fd.valorDescuento         = js.valorDescuento
				  ,fd.porcentajeDescuento    = js.porcentajeDescuento
				  ,fd.precioTotalSinImpuesto = js.precioTotalSinImpuesto
				  ,fd.nota                   = js.nota
				  ,fd.descripcion            = js.descripcion
				  ,fd.idTipoIva              = js.idTipoIva
                  ,fd.codigoPorcentaje       = js.codigoPorcentaje
                  ,fd.tarifa                 = js.tarifa
                  ,fd.valorImpuesto          = js.valorImpuesto
				  ,fd.estado                 = js.estado
			FROM FacturaDetalle fd 
			INNER JOIN @tblDetails js ON js.idFacturaDetalle = fd.idFacturaDetalle

			INSERT INTO FacturaDetalle 
                  (idFactura,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,precioCosto,uuid)
			SELECT @id,      idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,precioCosto,uuid
			FROM @tblDetails  
			WHERE idFacturaDetalle = 0 
            ORDER BY orderIndex ASC
            
            -->Forma Pago
            UPDATE fp WITH (ROWLOCK) 
               SET fp.abono          = py.total
                  ,fp.idFormaPagoSri = py.idFormaPagoSri
            FROM dbo.FormaPagoFactura fp
            INNER JOIN @payment       py ON py.idFormaPagoFactura = fp.idFormaPagoFactura

            
            -->Impuestos
            UPDATE Ventas.FacturaImpuesto SET [Enabled] = 0 WHERE FacturaId = @id

            INSERT INTO Ventas.FacturaImpuesto
                  (FacturaId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @id      ,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

            
			--> informacion Adicional
			UPDATE dbo.InfoAdicionalDoc SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc (idComprobante,idTipoDocumento,idInfoAdicional,nombre,valor) SELECT @id,@idTipoDocumento,idInfoAdicional,nombre,valor FROM @tblInfoAdicional

            --> Manejo de InfoAdicional 
            IF EXISTS (SELECT 1 FROM @historyInfoAdicional)
                BEGIN 
                    UPDATE ia SET ia.estado = 0 
                    FROM Ventas.HistoryInfoAdicional ia WITH (NOLOCK) 
                    INNER JOIN @historyInfoAdicional hi ON hi.idHistoryInfoAdicional = ia.idHistoryInfoAdicional

                    INSERT INTO Ventas.HistoryInfoAdicional
                          (idInfoAdicional,idFacturaDetalle)
			        SELECT idInfoAdicional,idFacturaDetalle 
                    FROM @historyInfoAdicional    ia
                    INNER JOIN dbo.FacturaDetalle fd WITH (ROWLOCK) ON fd.uuid = ia.uuid
                    WHERE fd.idFactura = @id
                      AND fd.estado = 1
                      AND ia.estado = 2

			        UPDATE ia SET ia.estado = hi.estado
			        FROM Compra.InfoAdicional        ia WITH (NOLOCK)
			        INNER JOIN @historyInfoAdicional hi ON hi.idInfoAdicional = ia.idInfoAdicional
                END

            IF (@@ROWCOUNT > 0)
			    BEGIN
				    SET @code = '0';
				    SET @message = 'Actualizado Exitosamente';
			    END
		    ELSE
			    BEGIN
				    SET @code = '50001';
				    SET @errorCode = 5001
                    SET @errorMessage = 'No se pudo Actualizar'
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
                    'Factura/update'
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
