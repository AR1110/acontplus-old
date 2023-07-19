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
IF OBJECT_ID(N'Recepcion.Documento_Insert', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Documento_Insert
GO
CREATE PROCEDURE Recepcion.Documento_Insert @idUsuarioRol INT 
,@json VARCHAR(MAX) 
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @identificacionReceptor AS VARCHAR(20)
	DECLARE @codEstab  VARCHAR(50)
	,@idEstab INT
	,@jsonData NVARCHAR(MAX)

	DECLARE @Comprobantes AS TABLE( 
	comprobante VARCHAR(50) NULL 
	,serieComprobante VARCHAR(50) NULL
	,rucEmisor VARCHAR(15) NULL
	,razonSocialEmisior VARCHAR(250)  NULL
	,fechaEmision VARCHAR(50) NULL
	,fechaAutorizacion VARCHAR(50)  NULL
	,tipoEmision VARCHAR(20)  NULL
	,identificacionReceptor VARCHAR(15) NULL
	,claveAcceso VARCHAR(50) UNIQUE NOT NULL
	,numeroAutorizacion VARCHAR(50) NULL
	,importeTotal VARCHAR(50) NULL
	)

	SELECT @idUsuario = idUsuario,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
	
	--SELECT @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1

	SELECT TOP 1  @identificacionReceptor = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

	SELECT  @codEstab = codEstab, @jsonData = jsonData FROM OPENJSON(@json) WITH(codEstab VARCHAR(MAX) '$.codEstab', jsonData NVARCHAR(MAX) '$.comprobantes' AS JSON)

	SET @idEstab = (SELECT idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab)
	--print @jsondata

	BEGIN TRY
		BEGIN TRAN
			
			INSERT INTO @Comprobantes([comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal])

			SELECT comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, ISNULL(identificacionReceptor, @identificacionReceptor), claveAcceso, ISNULL(numeroAutorizacion, claveAcceso), CASE WHEN LEN(Ltrim(rtrim(importeTotal))) > 0 THEN Ltrim(rtrim(importeTotal)) ELSE NULL END

			FROM OPENJSON(@jsonData) WITH( 
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
			--select * from @Comprobantes
			INSERT  INTO Recepcion.DocumentoRecibido(idEstablecimiento, [codEstab], [comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], [idUsuario], [fechaRegistro], downloaded)
			SELECT @idEstab, @codEstab, comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, CONVERT(DECIMAL(18,2), Ltrim(rtrim(ISNULL(importeTotal, 0)))), @idUsuario, dbo.ufnGetDateEcuador(), 'ND'
			FROM @Comprobantes t
			WHERE t.identificacionReceptor = @identificacionReceptor AND t.claveAcceso NOT IN (SELECT c.claveAcceso FROM Recepcion.DocumentoRecibido c WITH (NOLOCK))

			INSERT  INTO Recepcion.DocumentoRecibido(idEstablecimiento, [codEstab], [comprobante], [serieComprobante], [rucEmisor], [razonSocialEmisior], [fechaEmision], [fechaAutorizacion], [tipoEmision], [identificacionReceptor], [claveAcceso], [numeroAutorizacion], [importeTotal], [idUsuario], [fechaRegistro], downloaded)
			SELECT @idEstab, @codEstab, comprobante, serieComprobante, rucEmisor, razonSocialEmisior, fechaEmision, fechaAutorizacion, tipoEmision, identificacionReceptor, claveAcceso, numeroAutorizacion, CONVERT(DECIMAL(18,2), Ltrim(rtrim(ISNULL(importeTotal, 0)))), @idUsuario, dbo.ufnGetDateEcuador(), 'ND'
			FROM @Comprobantes t
			WHERE t.identificacionReceptor = SUBSTRING(ltrim(rtrim(@identificacionReceptor)), 1, 10) AND t.claveAcceso NOT IN (SELECT c.claveAcceso FROM Recepcion.DocumentoRecibido c WITH (NOLOCK))

			
			SELECT '1' code, 'Importación Exitosa'  as 'message'
		COMMIT TRAN
	END TRY

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN 
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'ComprobanteImportacion/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH 
END
