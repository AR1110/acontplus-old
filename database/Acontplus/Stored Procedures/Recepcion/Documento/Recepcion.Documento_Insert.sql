USE AcontPlus
GO
/****** Object:  StoredProcedure [Recepcion].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA IMPORTAR LOS COMPROBANTES ELECTRONICOS DEL SRI
-- =============================================
CREATE OR ALTER PROCEDURE Recepcion.Documento_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idUsuario INT ,@idEntidad INT ,@identificacionReceptor AS VARCHAR(20) ,@idEstab INT
	
    --> Data Json
    DECLARE @codEstab VARCHAR(50) ,@jsonData NVARCHAR(MAX)


	DECLARE @Comprobantes AS TABLE( 
	     comprobante VARCHAR(50) NOT NULL 
	    ,serieComprobante VARCHAR(50) NOT NULL
	    ,rucEmisor VARCHAR(15) NOT NULL
	    ,razonSocialEmisior VARCHAR(250) NOT NULL
	    ,fechaEmision VARCHAR(50) NOT NULL
	    ,fechaAutorizacion VARCHAR(50) NOT  NULL
	    ,tipoEmision VARCHAR(20)  NOT NULL
	    ,identificacionReceptor VARCHAR(15) NULL
	    ,claveAcceso VARCHAR(50) UNIQUE NOT NULL
	    ,numeroAutorizacion VARCHAR(50) NOT NULL
	    ,importeTotal VARCHAR(50) NULL
	)

	BEGIN TRY
        
        --> Informacion general
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
        
        SELECT  @codEstab = codEstab, @jsonData = jsonData FROM OPENJSON(@json) WITH(codEstab VARCHAR(MAX) '$.codEstab', jsonData NVARCHAR(MAX) '$.comprobantes' AS JSON)

        INSERT INTO @Comprobantes
              (comprobante,serieComprobante,rucEmisor,razonSocialEmisior,fechaEmision,fechaAutorizacion,tipoEmision,identificacionReceptor,claveAcceso,numeroAutorizacion,importeTotal)
		SELECT comprobante,serieComprobante,rucEmisor,razonSocialEmisior,fechaEmision,fechaAutorizacion,tipoEmision,identificacionReceptor,claveAcceso,numeroAutorizacion,importeTotal
		FROM OPENJSON(@jsonData) WITH
        ( 
			 comprobante            VARCHAR(50) 
			,serieComprobante       VARCHAR(50) 
			,rucEmisor              VARCHAR(15) 
			,razonSocialEmisior     VARCHAR(250) 
			,fechaEmision           VARCHAR(50) 
			,fechaAutorizacion      VARCHAR(50) 
			,tipoEmision            VARCHAR(20) 
			,identificacionReceptor VARCHAR(15)
			,claveAcceso            VARCHAR(50) 
			,numeroAutorizacion     VARCHAR(50) 
			,importeTotal           VARCHAR(50)
	    ) as t
        WHERE t.claveAcceso NOT IN (SELECT c.claveAcceso FROM Recepcion.DocumentoRecibido c WITH (NOLOCK))

        --> Recupenrando informacion
	    SELECT TOP 1 @identificacionReceptor = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

	    SELECT TOP 1 @idEstab = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

		BEGIN TRAN
			
			INSERT  INTO Recepcion.DocumentoRecibido(idEstablecimiento, [codEstab], [comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], [idUsuario], [fechaRegistro], downloaded)
			SELECT @idEstab, @codEstab, comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, CONVERT(DECIMAL(18,2), Ltrim(rtrim(ISNULL(importeTotal, 0)))), @idUsuario, dbo.ufnGetDateEcuador(), 'ND'
			FROM @Comprobantes t
			WHERE t.identificacionReceptor = @identificacionReceptor  

			INSERT  INTO Recepcion.DocumentoRecibido(idEstablecimiento, [codEstab], [comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], [idUsuario], [fechaRegistro], downloaded)
			SELECT @idEstab, @codEstab, comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, CONVERT(DECIMAL(18,2), Ltrim(rtrim(ISNULL(importeTotal, 0)))), @idUsuario, dbo.ufnGetDateEcuador(), 'ND'
			FROM @Comprobantes t
			WHERE t.identificacionReceptor = SUBSTRING(ltrim(rtrim(@identificacionReceptor)), 1, 10) 

		COMMIT TRAN
        SELECT '1' code, 'Importación Exitosa'  as 'message'
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
