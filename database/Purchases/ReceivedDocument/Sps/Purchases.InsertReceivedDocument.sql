USE AcontPlus
GO
SET ANSI_NULLS ON
GO


SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA LISTAR LOS COMPROBANTES ELECTRONICOS DEL SRI IMPORTADOS 
-- =============================================
CREATE OR ALTER PROCEDURE Purchases.InsertReceivedDocument
     @UserRoleId INT
    ,@Json VARCHAR(MAX)
    ,@XmlDoc XML
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Id Identity
    DECLARE @DocumentoRecibidoId INT

    --> Data Json
    DECLARE @DocumentCode VARCHAR(10) ,@VersionComp VARCHAR(10)

    --> Varialbles BD
    DECLARE @UserId INT

    --> Xml
    DECLARE @fechaAutorizacion VARCHAR(50) ,@xmlQuery XML ,@xmlCompressed VARBINARY(MAX)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    
    DECLARE @tbDocumentoXml AS TABLE(
        razonSocialEmisior VARCHAR(300) NOT NULL 
       ,nombreComercial VARCHAR(300) NULL
       ,rucEmisor VARCHAR(13) NOT NULL			        
       ,dirMatriz VARCHAR(300) NOT NULL
       ,[serieComprobante] VARCHAR(20) NOT NULL      
       ,identificacionReceptor VARCHAR(300) NOT NULL
       ,importeTotal NUMERIC(18,5) NOT NULL DEFAULT 0
       ,[fechaRegistro] DATETIME2 NOT NULL
       ,[downloaded] VARCHAR(2) DEFAULT 'DE'
    )

    DECLARE @TbTaxes AS TABLE
    (
		[Discount] NUMERIC(18, 5) NOT NULL DEFAULT 0
	   ,[Code] VARCHAR(10) NULL
	   ,[CodePercentage] VARCHAR(10) NULL
	   ,[Fee] NUMERIC(18, 5) NULL
	   ,[TaxBase] NUMERIC(18, 5) NULL
	   ,[TaxValue] NUMERIC(18, 5) NULL
	);

    DECLARE @TbRelatedDocument AS TABLE
    (
        codDocSustento VARCHAR(5) NOT NULL
	   ,numDocSustento VARCHAR(25) NOT NULL
  	   ,fechaEmisionDocSustento VARCHAR(100) NOT NULL
    )


    BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        --> InfoJson
        SELECT @DocumentCode = DocumentCode ,@VersionComp = versionComp FROM OPENJSON(@Json) WITH (documentCode VARCHAR(10) ,versionComp VARCHAR(20))

        --> Info Xml
        SELECT @XmlCompressed = COMPRESS(CONVERT(VARBINARY(MAX), @XmlDoc))

        SELECT @xmlQuery = @xmlDoc.value('(/autorizacion/comprobante)[1]', 'NVARCHAR(MAX)')

        SET @fechaAutorizacion = @xmlDoc.value('(/autorizacion/fechaAutorizacion)[1]', 'VARCHAR(MAX)')
        
        IF @DocumentCode = '01'
            BEGIN
                INSERT INTO @tbDocumentoXml 
                      (razonSocialEmisior,nombreComercial,rucEmisor,dirMatriz,serieComprobante,identificacionReceptor,importeTotal)
				SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')          as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')      as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			        as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')            as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                       
                       + '-' + 
					   x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                
					   + '-' + 
                       x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')            as serieComprobante
					  ,x.y.value('(infoFactura/identificacionComprador)[1]','VARCHAR(300)') as identificacionComprador
                      ,x.y.value('(infoFactura/importeTotal)[1]','NUMERIC(18,2)')			as importeTotal
                FROM @xmlQuery.nodes('//factura') x(y)
            END

        IF @DocumentCode = '04'
            BEGIN
                INSERT INTO @tbDocumentoXml 
                      (razonSocialEmisior,nombreComercial,rucEmisor,dirMatriz,serieComprobante,identificacionReceptor,importeTotal)
                SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')              as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')          as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			            as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')                as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                       
                       + '-' + 
					   x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                
					   + '-' + 
                       x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')                as serieComprobante
					  ,x.y.value('(infoNotaCredito/identificacionComprador)[1]','VARCHAR(300)') as identificacionComprador
                      ,x.y.value('(infoNotaCredito/valorModificacion)[1]','NUMERIC(18,2)')      as importeTotal
                FROM @xmlQuery.nodes('//notaCredito') x(y)
            END

        IF @DocumentCode = '05'
            BEGIN
                INSERT INTO @tbDocumentoXml 
                      (razonSocialEmisior,nombreComercial,rucEmisor,dirMatriz,serieComprobante,identificacionReceptor,importeTotal)
                SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')             as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')         as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			           as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')               as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                       
                       + '-' + 
					   x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                
					   + '-' + 
                       x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')               as serieComprobante
					  ,x.y.value('(infoNotaDebito/identificacionComprador)[1]','VARCHAR(300)') as identificacionComprador
                      ,x.y.value('(motivos/motivo/valor)[1]','NUMERIC(18,2)')                  as importeTotal
                FROM @xmlQuery.nodes('//notaDebito') x(y)
            END

        IF @DocumentCode = '07'
            BEGIN
                
                
                INSERT INTO @tbDocumentoXml 
                      (razonSocialEmisior,nombreComercial,rucEmisor,dirMatriz,serieComprobante,identificacionReceptor)
                SELECT x.y.value('(infoTributaria/razonSocial)[1]','VARCHAR(300)')                     as razonSocialEmisor
                      ,x.y.value('(infoTributaria/nombreComercial)[1]','VARCHAR(300)')                 as nombreComercial
                      ,x.y.value('(infoTributaria/ruc)[1]','VARCHAR(13)')			                   as rucEmisor
                      ,x.y.value('(infoTributaria/dirMatriz)[1]','VARCHAR(300)')                       as dirMatriz
                      ,x.y.value('(infoTributaria/estab)[1]','VARCHAR(25)')                       
                       + '-' + 
					   x.y.value('(infoTributaria/ptoEmi)[1]','VARCHAR(25)')                
					   + '-' + 
                       x.y.value('(infoTributaria/secuencial)[1]','VARCHAR(25)')                       as serieComprobante
					  ,x.y.value('(infoCompRetencion/identificacionSujetoRetenido)[1]','VARCHAR(300)') as identificacionComprador
                FROM @xmlQuery.nodes('//comprobanteRetencion') x(y)
            END

        --> Validaciones
        IF NOT EXISTS (SELECT 1 FROM @tbDocumentoXml)
            BEGIN;
                THROW 50002, 'Error en la informacion del Documento Recibido.', 1;
            END

        IF NOT EXISTS (SELECT 1 FROM @TbTaxes)
            BEGIN;
                THROW 50002, 'Error en los impuestos.', 1;
            END

        IF @DocumentCode IN ('04','05','07')
            BEGIN;
                 IF NOT EXISTS (SELECT 1 FROM @TbRelatedDocument)
                    BEGIN;
                        THROW 50002, 'Error en la informacion del documento relacionado.', 1;
                    END
            END

       --> Transaccion Principal.
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            --> DocumentoRecibido
            --INSERT INTO Recepcion.DocumentoRecibido
            --      ([idEstablecimiento],[customerId],[idTipoDocumento],[idUsuario],[serieComprobante],[fechaEmision],[fechaAutorizacion],[claveAcceso],[importeTotal],[versionComp],[xmlCompressed],[downloaded],[fechaRegistro])
            --SELECT [idEstablecimiento],[customerId],[idTipoDocumento],[idUsuario],[serieComprobante],[fechaEmision],[fechaAutorizacion],[claveAcceso],[importeTotal],[versionComp],[xmlCompressed],[downloaded],[fechaRegistro]
            --FROM @TbReceivedDocument

            SET @DocumentoRecibidoId = SCOPE_IDENTITY()

            --> Impuestos del documento
            INSERT INTO [Recepcion].[DocumentoImpuesto]
			      ([DocumentoRecibidoId],[Discount],[Code],[CodePercentage],[Fee],[TaxBase],[TaxValue])
            SELECT  @DocumentoRecibidoId,[Discount],[Code],[CodePercentage],[Fee],[TaxBase],[TaxValue]
            FROM @TbTaxes


            --> Documento Relacionados
            INSERT INTO FactElect.DocRelacionado
			       (idDocumentoRecibido,codDocSustento,numDocSustento,fechaEmisionDocSustento)
            SELECT @DocumentoRecibidoId,codDocSustento,numDocSustento,fechaEmisionDocSustento
            FROM @TbRelatedDocument

	    IF (@startedTransaction = 1)
		    BEGIN
			    COMMIT;
			    SELECT '1' as code, 'Registrao Exitosamente' as 'message';
		    END
    END TRY

    BEGIN CATCH
        IF @startedTransaction = 1 
            BEGIN
                --> Variables locales para el error
                DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
                       ,@ErrorSeverity  INT            = ERROR_SEVERITY()
                       ,@ErrorState     INT            = ERROR_STATE()
                       ,@ErrorProcedure NVARCHAR(128)  = ERROR_PROCEDURE()
                       ,@ErrorLine      INT            = ERROR_LINE()
                       ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
                       ,@ErrorDetails   NVARCHAR(MAX)
                       ,@Token          VARCHAR(300)   = NEWID()
                       ,@Method         VARCHAR(200)   = 'Purchases/ReceivedDocument/Post'

                SELECT @ErrorDetails = (
                    SELECT @Json as [json]
                    FOR JSON PATH
                );

                IF (@@TRANCOUNT > 0) ROLLBACK TRAN

                INSERT INTO ErroresSistema
                       (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
                SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;

                SELECT '0' code, 'Error en el procedimiento' as 'message'
            END 
    END CATCH 
END
GO


