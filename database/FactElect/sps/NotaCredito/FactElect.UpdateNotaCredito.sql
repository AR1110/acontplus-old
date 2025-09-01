USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Update]    Script Date: 1/28/2023 12:32:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE FactElect.UpdateNotaCredito
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

	--> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Json
    DECLARE @infoNotaCredito VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

    --> Devolucion
    DECLARE @idFactura INT

    DECLARE @tbComprobante AS TABLE (
	    idNotaCredito INT NOT NULL
       ,idCliente INT NOT NULL
       ,idFactura INT NOT NULL
	   ,fechaEmision DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	)

		
	DECLARE @tblDetails AS TABLE (
		 orderIndex INT
        ,idNotaCreditoDetalle INT NOT NULL
	    ,idArticulo INT NOT NULL
	    ,idTarifa INT NOT NULL
	    ,idBodega INT NOT NULL
	    ,idMedida INT NULL
	    ,idTipoIva INT NOT NULL
	    ,ice NUMERIC (18,5) NOT NULL 
	    ,cantidad NUMERIC (18,5) NOT NULL
	    ,precioUnitario NUMERIC (18,5) NOT NULL
	    ,precioCosto NUMERIC (18,5) NOT NULL  
	    ,valorDescuento  NUMERIC (18,5) NOT NULL
	    ,porcentajeDescuento NUMERIC (18,5) NOT NULL
	    ,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
	    ,nota VARCHAR(100) NULL
	    ,descripcion VARCHAR(255) NOT NULL
        ,estado BIT NOT NULL
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


	BEGIN TRY

        SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

         --> Data Json 
        SELECT @infoNotaCredito       = infoNotaCredito
              ,@detalles              = detalles
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
        FROM OPENJSON(@json) WITH 
        (
             infoNotaCredito       NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json 
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idNotaCredito,idCliente,idFactura,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion)
		SELECT @id          ,idCliente,idFactura,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion
		FROM OPENJSON(@infoNotaCredito) WITH
        (
			 idCliente               INT 
            ,idFactura               INT
			,fechaEmision            DATETIME2
			,subTotalSinImpuestos    NUMERIC(18,5) 
			,totalDescuento          NUMERIC(18,5)
			,porcentajeDescuento     NUMERIC(18,5)
			,propina                 NUMERIC(18,5)
			,total                   NUMERIC(18,5)
			,observacion             VARCHAR(500)
		) AS js


        INSERT INTO @tblDetails
              (idNotaCreditoDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,estado)
		SELECT idNotaCreditoDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,estado 
		FROM OPENJSON (@detalles) WITH 
        (
			 orderIndex             INT
			,idNotaCreditoDetalle   INT
            ,idArticulo             INT
			,idTarifa               INT
			,idBodega               INT
			,idMedida               INT
			,ice                    NUMERIC(10,5)
			,cantidad               NUMERIC(15,5)
			,precioCosto            NUMERIC(15,5)
			,precioUnitario         NUMERIC(15,5)
			,valorDescuento         NUMERIC(15,5)
			,porcentajeDescuento    NUMERIC(15,5)
			,precioTotalSinImpuesto NUMERIC(15,5)
            ,codigoPorcentaje       VARCHAR(5)
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5)
			,nota                   NVARCHAR(100)
			,descripcion            NVARCHAR(255)
			,idTipoIva              INT
            ,estado                 BIT
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

        INSERT INTO @tblInfoAdicional 
              (nombre,valor) 
        SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
             nombre VARCHAR(300)
            ,valor  VARCHAR(300)
        )

        --> Variables
		SELECT TOP 1 @idFactura = idFactura FROM @tbComprobante

        --> OnValidate
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante) 
            BEGIN
                SET @message = 'Error en la info NotaCredito';
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SET @message = 'Error en los detalles';
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

            --> InfoNotaCredito
            UPDATE f SET f.notaCredito = 0  FROM Factura f JOIN Notacredito nc ON nc.idFactura = f.idFactura  WHERE nc.idNotaCredito = @id

            UPDATE nc WITH (ROWLOCK) 
               SET nc.idCliente            = jc.idCliente
                  ,nc.idFactura            = jc.idFactura
                  ,nc.subTotalSinImpuestos = jc.subTotalSinImpuestos
                  ,nc.totalDescuento       = jc.totalDescuento
                  ,nc.porcentajeDescuento  = jc.porcentajeDescuento
                  ,nc.propina              = jc.propina
                  ,nc.total                = jc.total
                  ,nc.observacion          = jc.observacion
            FROM NotaCredito nc
            INNER JOIN @tbComprobante jc ON nc.idNotaCredito = jc.idNotaCredito

            UPDATE Factura SET notaCredito = 1 WHERE idFactura = @idFactura

            --> Detalles 
            UPDATE nd WITH (ROWLOCK)
               SET nd.idTarifa               = jd.idTarifa
                  ,nd.idBodega               = jd.idBodega
                  ,nd.idMedida               = jd.idMedida
                  ,nd.ice                    = jd.ice
                  ,nd.cantidad               = jd.cantidad
                  ,nd.porcentajeDescuento    = jd.porcentajeDescuento
                  ,nd.valorDescuento         = jd.valorDescuento
                  ,nd.precioUnitario         = jd.precioUnitario
                  ,nd.precioTotalSinImpuesto = jd.precioTotalSinImpuesto
                  ,nd.codigoPorcentaje       = jd.codigoPorcentaje
                  ,nd.tarifa                 = jd.tarifa
                  ,nd.valorImpuesto          = jd.valorImpuesto
                  ,nd.nota                   = jd.nota
                  ,nd.descripcion            = jd.descripcion
                  ,nd.idTipoIva              = jd.idTipoIva
                  ,nd.estado                 = jd.estado
            FROM NotaCreditoDetalle nd
            INNER JOIN @tblDetails  jd ON jd.idNotaCreditoDetalle = nd.idNotaCreditoDetalle

            INSERT INTO NotaCreditoDetalle 
                  (idNotaCredito,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto)
            SELECT @id,          idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto
            FROM @tblDetails
            WHERE idNotaCreditoDetalle = 0
            ORDER BY orderIndex ASC

            -->Impuestos
            UPDATE Ventas.NotaCreditoImpuesto WITH (ROWLOCK) SET [Enabled]  = 0 WHERE NotaCreditoId = @id

            INSERT INTO Ventas.NotaCreditoImpuesto
                (NotaCreditoId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @id        ,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

            --> informacion Adiciomal
            UPDATE dbo.InfoAdicionalDoc WITH (ROWLOCK) SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor) SELECT @id,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

		IF (@@ROWCOUNT > 0)
			    BEGIN
				    SET @code = '0';
				    SET @message = 'Actualizado Exitosamente';
			    END
		    ELSE
			    BEGIN
				    SET @code = '50001';
				    SET @errorCode = 5001
                    SET @errorMessage = 'No se pudo actualizar'
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
                    'NotaCredito/Update'
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
