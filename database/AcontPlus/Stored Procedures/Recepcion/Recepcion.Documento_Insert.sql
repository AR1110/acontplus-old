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
IF OBJECT_ID(N'Recepcion.Documento_Insert ', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Documento_Insert
GO
CREATE PROCEDURE Recepcion.Documento_Insert @idRol INT
,@json VARCHAR(MAX)
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	DECLARE @codEstab  VARCHAR(50)
	,@idEstab INT

	DECLARE @Comprobantes AS TABLE( 
	comprobante VARCHAR(50) NOT NULL 
	,serieComprobante VARCHAR(50) NULL
	,rucEmisor VARCHAR(15) NOT NULL
	,razonSocialEmisior VARCHAR(250)  NULL
	,fechaEmision VARCHAR(50) NULL
	,fechaAutorizacion VARCHAR(50)  NULL
	,tipoEmision VARCHAR(20)  NULL
	,identificacionReceptor VARCHAR(15) NULL
	,claveAcceso VARCHAR(50)  NULL
	,numeroAutorizacion VARCHAR(50) NOT NULL
	,importeTotal VARCHAR(50) NULL
	)

	SELECT @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol
	
	SELECT @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1

	SET @idEstab = (SELECT idEstablecimiento FROM SRI.Establecimiento WHERE CODESTAB = @codEstab)

	BEGIN TRY
		BEGIN TRAN
			
			INSERT INTO @Comprobantes([comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal])

			SELECT comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, CASE WHEN LEN(Ltrim(rtrim(importeTotal))) > 0 THEN Ltrim(rtrim(importeTotal)) ELSE NULL END

			FROM OPENJSON(@json) WITH( 
				comprobante VARCHAR(50) '$.comprobante'
				,serieComprobante VARCHAR(50) '$.serieComprobante'
				,rucEmisor VARCHAR(15) '$.rucEmisor'
				,razonSocialEmisior VARCHAR(250) '$.razonSocialEmisior'
				,fechaEmision VARCHAR(50) '$.fechaEmision'
				,fechaAutorizacion VARCHAR(50) '$.fechaAutorizacion'
				,tipoEmision VARCHAR(20) '$.tipoEmision'
				,identificacionReceptor VARCHAR(15) '$.identificacionReceptor'
				,claveAcceso VARCHAR(50) '$.claveAcceso'
				,numeroAutorizacion VARCHAR(50) '$.numeroAutorizacion'
				,importeTotal VARCHAR(50) '$.importeTotal'
			)

			INSERT  INTO Recepcion.DocumentoRecibido(idEstablecimiento, [codEstab], [comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], [idUsuario], [fechaRegistro], downloaded)
			SELECT @idEstab, @codEstab, comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, CONVERT(DECIMAL(18,2), Ltrim(rtrim(ISNULL(importeTotal, 0)))), @idUsuario, dbo.ufnGetDateEcuador(), 'ND'
			FROM @Comprobantes t
			WHERE NOT EXISTS (SELECT * FROM Recepcion.DocumentoRecibido c WITH (NOLOCK)
										WHERE c.codEstab = @codEstab
										AND t.claveAcceso = c.claveAcceso)

			SELECT '1' code, 'Importación Exitosa'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
		SET @method = (SELECT method FROM OPENJSON(@backendInfo) WITH(method VARCHAR(200) '$.methodName'))
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'ComprobanteImportacion/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
