USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Insert]    Script Date: 12/8/2022 9:37:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.InsertNotaCredito
     @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH

    --> GLOBAL
	DECLARE @idUsuario INT ,@idEntidad INT ,@idNotaCredito INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Json
    DECLARE @infoNotaCredito VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

    --> Devolucion
    DECLARE @idFactura INT

    DECLARE @tbComprobante AS TABLE (
		idCliente INT NOT NULL
       ,idDocumentoElectronico INT NOT NULL
       ,idFactura INT NOT NULL
       ,idUsuario INT NOT NULL
       ,fechaEmision DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
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
		
        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

         --> Data Json 
        SELECT @infoNotaCredito = infoNotaCredito
              ,@detalles        = detalles
              ,@impuestos       = impuestos
              ,@infoAdicional   = infoAdicional
        FROM OPENJSON(@json) WITH 
        (
             infoNotaCredito NVARCHAR(MAX) as json
            ,detalles        NVARCHAR(MAX) as json 
            ,impuestos       NVARCHAR(MAX) as json
            ,infoAdicional   NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idCliente,idFactura,idUsuario,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion)
		SELECT idCliente,idFactura,idUsuario,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion
		FROM OPENJSON(@infoNotaCredito) WITH
        (
			 idCliente               INT
			,idFactura               INT 
			,idUsuario               INT 
			,fechaEmision            DATETIME2 
			,subTotalSinImpuestos    NUMERIC(18,5) 
			,totalDescuento          NUMERIC(18,5) 
			,porcentajeDescuento     NUMERIC(18,5) 
			,propina                 NUMERIC(18,5) 
			,recargo			     NUMERIC(18,5)
			,transporte              NUMERIC(18,5)
			,total                   NUMERIC(18,5)  
			,observacion             VARCHAR(500)
		) AS js


        INSERT INTO @tblDetails
              (orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion)
		SELECT orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion
		FROM OPENJSON (@detalles) WITH 
        (
			 orderIndex             INT 
			,idArticulo             INT
			,idTarifa               INT
			,idBodega               INT
			,idMedida               INT
			,ice                    NUMERIC(10,5)
			,cantidad               NUMERIC(15,5)
			,precioCosto            NUMERIC(15,5)
			,precioUnitario         NUMERIC(15,5)
			,valorDescuento         NUMERIC(15,5) 
			,precioTotalSinImpuesto NUMERIC(15,5)
			,porcentajeDescuento    NUMERIC(15,5)
			,precioTotalSinImpuesto NUMERIC(15,5) 
            ,codigoPorcentaje       VARCHAR(5)
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5)
			,nota                   NVARCHAR(100) 
			,descripcion            NVARCHAR(255)
			,idTipoIva              INT
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

        --> Recuperando Varaibles 
		SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE td.codigoSri = '04'

		SELECT @idFactura      = js.idFactura
              ,@idUsuario	   = IIF(js.idUsuario = 0, @idUsuario, js.idUsuario)
		FROM @tbComprobante js 

        --> onValidate 
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

		IF EXISTS (SELECT 1 FROM Factura WITH (NOLOCK) WHERE idFactura = @idFactura AND notaCredito = 1 )
			BEGIN
				SET @message = 'La factura ya tiene registrada una nota de credito';
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
			INSERT INTO NotaCredito 
			      (idDocumentoElectronico,idCliente,idFactura,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion,idUsuario,fechaRegistro)
			SELECT idDocumentoElectronico,idCliente,idFactura,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion,@idUsuario,dbo.ufnGetDateEcuador()
			FROM @tbComprobante

			SET @idNotaCredito = SCOPE_IDENTITY()

			--> Detalles
			INSERT INTO NotaCreditoDetalle 
				   (idNotaCredito,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto)
			SELECT @idNotaCredito,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto
			FROM @tblDetails 
            ORDER BY orderIndex ASC

            -->Impuestos
            INSERT INTO Ventas.NotaCreditoImpuesto
                   (NotaCreditoId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @idNotaCredito,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount 
            FROM @tbTaxes

            --> informacion Adiciomal
			INSERT INTO dbo.InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor) SELECT @idNotaCredito,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

            -->Actualizar Estado Fac.
            UPDATE Factura SET notaCredito = 1 WHERE idFactura = @idFactura

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
                    'NotaCredito/Insert'
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
