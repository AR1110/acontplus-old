USE AcontPlus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA IMPORTAR LOS COMPROBANTES ELECTRONICOS DEL SRI
-- =============================================
CREATE OR ALTER PROCEDURE Recepcion.Documento_Insert @userRoleId INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idUsuario INT,
        @idEntidad INT,
        @identificacionReceptor VARCHAR(20),
        @idEstab INT;
	
    --> Data Json
    DECLARE @codEstab VARCHAR(50),
        @jsonData NVARCHAR(MAX),
        @subcategoryId INT;


	DECLARE @Comprobantes AS TABLE( 
	     comprobante VARCHAR(50)  
	    ,serieComprobante VARCHAR(50)
	    ,rucEmisor VARCHAR(15)
	    ,razonSocialEmisior VARCHAR(250)
	    ,fechaEmision VARCHAR(50)
	    ,fechaAutorizacion VARCHAR(50) 
	    ,identificacionReceptor VARCHAR(15)
	    ,claveAcceso VARCHAR(50) UNIQUE NOT  NULL
	    ,importeTotal VARCHAR(50)
	);

	BEGIN TRY
        
        --> Informacion general
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @identificacionReceptor = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
        
        SELECT  @codEstab = codEstab
            ,@jsonData = jsonData
            ,@subcategoryId = subcategoryId
        FROM OPENJSON(@json) WITH(
                                    codEstab VARCHAR(MAX) '$.codEstab', 
                                    jsonData NVARCHAR(MAX) '$.comprobantes' AS JSON,
                                    subcategoryId INT)

        INSERT INTO @Comprobantes
              (comprobante,serieComprobante,rucEmisor,razonSocialEmisior,fechaEmision,fechaAutorizacion,identificacionReceptor,claveAcceso,importeTotal)
		SELECT comprobante,serieComprobante,rucEmisor,razonSocialEmisior,fechaEmision,fechaAutorizacion,ISNULL(identificacionReceptor,@identificacionReceptor),claveAcceso,CASE WHEN LEN(Ltrim(rtrim(importeTotal))) > 0 THEN Ltrim(rtrim(importeTotal)) ELSE NULL END
		FROM OPENJSON(@jsonData) WITH
        ( 
			 comprobante            VARCHAR(50) 
			,serieComprobante       VARCHAR(50) 
			,rucEmisor              VARCHAR(15) 
			,razonSocialEmisior     VARCHAR(250) 
			,fechaEmision           VARCHAR(50) 
			,fechaAutorizacion      VARCHAR(50) 
			,identificacionReceptor VARCHAR(15)
			,claveAcceso            VARCHAR(50) 
			,numeroAutorizacion     VARCHAR(50) 
			,importeTotal           VARCHAR(50)
	    ) as t
        WHERE t.claveAcceso NOT IN (SELECT c.claveAcceso FROM Recepcion.DocumentoRecibido c WITH (NOLOCK))

        --> Recupenrando informacion
	    SELECT TOP 1 @idEstab = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

        --> Validacion de informacion
        IF (SELECT COUNT(*) FROM @Comprobantes) = 0 
            BEGIN
                SELECT '0' code,'Los comprobantes ya se encuentran registrados' as 'message'
                RETURN
            END  

		BEGIN TRAN
			
			INSERT  INTO Recepcion.DocumentoRecibido(idEstablecimiento, [comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [identificacionReceptor], [claveAcceso], [importeTotal], [idUsuario], [fechaRegistro], downloaded)
			SELECT @idEstab, comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, identificacionReceptor, claveAcceso, CONVERT(DECIMAL(18,2), Ltrim(rtrim(ISNULL(importeTotal, 0)))), @idUsuario, dbo.ufnGetDateEcuador(), 'ND'
			FROM @Comprobantes t
			WHERE t.identificacionReceptor = @identificacionReceptor  

			INSERT  INTO Recepcion.DocumentoRecibido(idEstablecimiento, [comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [identificacionReceptor], [claveAcceso], [importeTotal], [idUsuario], [fechaRegistro], downloaded)
			SELECT @idEstab, comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, identificacionReceptor, claveAcceso, CONVERT(DECIMAL(18,2), Ltrim(rtrim(ISNULL(importeTotal, 0)))), @idUsuario, dbo.ufnGetDateEcuador(), 'ND'
			FROM @Comprobantes t
			WHERE t.identificacionReceptor = SUBSTRING(ltrim(rtrim(@identificacionReceptor)), 1, 10) 

		COMMIT TRAN
        SELECT '1' code, 'Importación Exitosa' as 'message'
	END TRY

	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
            BEGIN 
			    ROLLBACK TRAN
            END 
        SELECT '0' code, 'Error en base de datos: ' as 'message'
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoRecepcion/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
