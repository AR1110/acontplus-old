USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Liquidacion_Update]    Script Date: 12/9/2022 10:55:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-12-06
-- Description:	SP para actualizar las liqidacioenes de compra
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.UpdateLiquidacion
     @userRoleId INT
    ,@id INT
    ,@json VARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

     --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@idTipoDocumento INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Json
    DECLARE @infoLiquidacion VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

     --> Liquidacion
    DECLARE @importeTotal NUMERIC(18,5)

    DECLARE @tbComprobante AS TABLE (
	    idLiquidacionCompra INT UNIQUE NOT NULL
       ,idProveedor INT NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	)

	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idLiquidacionCompraDetalle INT NOT NULL
        ,idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
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

        --> Global
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @infoLiquidacion = infoLiquidacion
              ,@detalles        = detalles
              ,@impuestos       = impuestos
              ,@infoAdicional   = infoAdicional
        FROM OPENJSON(@json) WITH 
        (
             infoLiquidacion NVARCHAR(MAX) as json
            ,detalles        NVARCHAR(MAX) as json 
            ,impuestos       NVARCHAR(MAX) as json
            ,infoAdicional   NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idLiquidacionCompra,idProveedor,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion)
		SELECT @id                ,idProveedor,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion
		FROM OPENJSON(@infoLiquidacion) WITH
        (
			 idProveedor          INT 
			,subTotalSinImpuestos NUMERIC(18,5)
			,porcentajeDescuento  NUMERIC(18,5)
			,totalDescuento       NUMERIC(18,5) 
			,propina              NUMERIC(18,5)
			,recargo			  NUMERIC(18,5)
			,transporte           NUMERIC(18,5)
			,total                NUMERIC(18,5)
			,observacion          VARCHAR(500)

		) AS js


		INSERT INTO @tblDetails
              (idLiquidacionCompraDetalle,orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,estado)
		SELECT idLiquidacionCompraDetalle,orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,estado 
		FROM OPENJSON (@detalles) WITH 
        (
		     idLiquidacionCompraDetalle INT 
            ,orderIndex                 INT
		    ,idArticulo                 INT 
		    ,idBodega                   INT 
		    ,idMedida                   INT 
            ,idTipoIva                  INT  
		    ,ice                        NUMERIC(10,5) 
		    ,cantidad                   NUMERIC(15,5)
		    ,precioUnitario             NUMERIC(15,5) 
		    ,valorDescuento             NUMERIC(15,5)
		    ,precioTotalSinImpuesto     NUMERIC(15,5)
		    ,porcentajeDescuento        NUMERIC(15,5)
            ,codigoPorcentaje           VARCHAR(5)
            ,tarifa                     NUMERIC(15,5) 
            ,valorImpuesto              NUMERIC(15,5) 
		    ,precioTotalSinImpuesto     NUMERIC(15,5) 
		    ,nota                       VARCHAR(100) 
		    ,descripcion                VARCHAR(255)
            ,estado                     BIT
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
		SELECT @importeTotal = total FROM @tbComprobante 

        --> Validaciones 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante) 
            BEGIN
                SET @message = 'Error en la infoliquidacion';
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

            --> InfoLiquidacion 
			UPDATE lc 
               SET lc.idProveedor          = jlc.idProveedor
				  ,lc.subTotalSinImpuestos = jlc.subTotalSinImpuestos
				  ,lc.totalDescuento       = jlc.totalDescuento
				  ,lc.porcentajeDescuento  = jlc.porcentajeDescuento
				  ,lc.propina              = jlc.propina
				  ,lc.recargo              = jlc.recargo
				  ,lc.transporte           = jlc.transporte
				  ,lc.total                = jlc.total
				  ,lc.observacion          = jlc.observacion
				  ,lc.lastChange           = dbo.ufnGetDateEcuador()
			FROM LiquidacionCompra     lc WITH (ROWLOCK)
			INNER JOIN @tbComprobante jlc ON lc.idLiquidacionCompra = jlc.idLiquidacionCompra

            --> Forma pago
            UPDATE FormaPagoLiquidacion SET abono = @importeTotal WHERE idLiquidacionCompra = @id

            --> Detalles 
			UPDATE lcd WITH (ROWLOCK)
               SET lcd.idBodega               = js.idBodega
				  ,lcd.idMedida               = js.idMedida
				  ,lcd.idTipoIva              = js.idTipoIva
				  ,lcd.descripcion            = js.descripcion
				  ,lcd.cantidad               = js.cantidad
				  ,lcd.precioUnitario         = js.precioUnitario
				  ,lcd.porcentajeDescuento    = js.porcentajeDescuento
				  ,lcd.valorDescuento         = js.valorDescuento
				  ,lcd.nota                   = js.nota
				  ,lcd.precioTotalSinImpuesto = js.precioTotalSinImpuesto
                  ,lcd.codigoPorcentaje       = js.codigoPorcentaje
                  ,lcd.tarifa                 = js.tarifa
                  ,lcd.valorImpuesto          = js.valorImpuesto
				  ,lcd.estado                 = js.estado
			FROM LiquidacionCompraDetalle lcd 
			INNER JOIN @tblDetails         js ON lcd.idLiquidacionCompraDetalle = js.idLiquidacionCompraDetalle

            --> Detalles  
			INSERT INTO LiquidacionCompraDetalle
				   (idLiquidacionCompra,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,ice)
			SELECT @id                 ,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,ice
			FROM @tblDetails
            WHERE idLiquidacionCompraDetalle = 0
            ORDER BY orderIndex ASC

            --> Impuestos
            UPDATE Compra.LiquidacionImpuesto WITH (ROWLOCK) SET [Enabled] = 0 WHERE LiquidacionId = @id

            INSERT INTO Compra.LiquidacionImpuesto
                   (LiquidacionId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @id,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes
			
            --> informacion Adicional
			UPDATE dbo.InfoAdicionalDoc WITH(ROWLOCK) SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc (idComprobante,idTipoDocumento,nombre,valor) SELECT @id,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

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
                    'liquidacion/Update'
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
