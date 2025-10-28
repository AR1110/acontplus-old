USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Liquidacion_Insert]    Script Date: 12/8/2022 11:50:32 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-12-06
-- Description:	SP para registra liquidacion de compra
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.InsertLiquidacion
     @userRoleId INT
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
	DECLARE @idUsuario INT ,@idEntidad INT ,@idLiquidacionCompra INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Json
    DECLARE @infoLiquidacion VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) 

    DECLARE @tbComprobante AS TABLE (
		idProveedor INT NOT NULL
       ,idDocumentoElectronico INT NOT NULL
       ,uniqueId VARCHAR(50) NOT NULL
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
		      (idProveedor,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion)
		SELECT idProveedor,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion 
		FROM OPENJSON(@infoLiquidacion) WITH
        (
			 idProveedor            INT 
			,subTotalSinImpuestos   NUMERIC(18,5) 
			,porcentajeDescuento    NUMERIC(18,5)
			,totalDescuento         NUMERIC(18,5)
			,propina                NUMERIC(18,5)
			,recargo			    NUMERIC(18,5)
			,transporte             NUMERIC(18,5) 
			,total                  NUMERIC(18,5) 
			,observacion            VARCHAR(500)

		) AS js


		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion)
		SELECT orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex             INT 
		    ,idArticulo             INT 
		    ,idBodega               INT
		    ,idMedida               INT 
            ,idTipoIva              INT 
		    ,ice                    NUMERIC(10,5)
		    ,cantidad               NUMERIC(15,5)
		    ,precioUnitario         NUMERIC(15,5)
		    ,valorDescuento         NUMERIC(15,5)
		    ,precioTotalSinImpuesto NUMERIC(15,5)
		    ,porcentajeDescuento    NUMERIC(15,5) 
            ,codigoPorcentaje       VARCHAR(5)
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5)
		    ,precioTotalSinImpuesto NUMERIC(15,5) 
		    ,nota                   VARCHAR(100) 
		    ,descripcion            VARCHAR(255) 
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
	    SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE td.codigoSri = '03'
		
        --> Validaciones 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SET @message = 'Error en la infoliquidacion';
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SET @message = 'Error en los detalles';
            END

        IF NOT EXISTS(SELECT 1 FROM @payment)
            BEGIN
                SET @message = 'Error en la forma de pago';
            END

        IF NOT EXISTS(SELECT 1FROM @tbTaxes)
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
            
			INSERT INTO LiquidacionCompra
				  (idDocumentoElectronico,uniqueId,idProveedor,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,fechaRegistro,idUsuario)
			SELECT idDocumentoElectronico,uniqueId,idProveedor,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,dbo.ufnGetDateEcuador(),@idUsuario
			FROM @tbComprobante

			SET @idLiquidacionCompra = SCOPE_IDENTITY()

            --> Impuestos
            INSERT INTO Compra.LiquidacionImpuesto
                   (LiquidacionId      ,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @idLiquidacionCompra,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount 
            FROM @tbTaxes

			--> Detalles  
			INSERT INTO LiquidacionCompraDetalle
				   (idLiquidacionCompra,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,ice,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto)
			SELECT @idLiquidacionCompra,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,ice,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto
			FROM @tblDetails
            ORDER BY orderIndex ASC

            --> FormaPago 
			INSERT INTO dbo.FormaPagoLiquidacion
                   (idLiquidacionCompra,idFormaPagoSri,idTiempoCredito,abono,idUsuario,fechaRegistro)
			SELECT @idLiquidacionCompra,idFormaPagoSri,idTiempoCredito,total,@idUsuario,dbo.ufnGetDateEcuador() 
            FROM @payment


            --> informacion Adiciomal
			INSERT INTO dbo.InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor) SELECT @idLiquidacionCompra,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

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
                    'liquidacion/Insert'
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
