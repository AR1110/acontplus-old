GO
/****** Object:  StoredProcedure [FactElect].[ASPComprobanteImportacionInsert]    Script Date: 8/4/2022 9:30:34 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA ACTUALIZAR LOS COMPROBANTES ELECTRONICOS DEL SRI de manera rapida
-- =============================================
IF OBJECT_ID(N'FactElect.ComprobanteImportacionUpdateFast ', N'P') IS NOT NULL
DROP PROCEDURE FactElect.ComprobanteImportacionUpdateFast 
GO
CREATE PROCEDURE FactElect.ComprobanteImportacionUpdateFast @claveAcceso VARCHAR(50) 
,@codDoc VARCHAr(2)
,@xmlDoc XML
,@backendInfo VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
	BEGIN TRY
		BEGIN TRAN 
			IF @codDoc NOT IN ('01','04','07')
				BEGIN
					DELETE FROM factElect.ComprobanteImportacion WHERE claveAcceso = @claveAcceso 
				END
			ELSE
				BEGIN
					UPDATE factElect.ComprobanteImportacion SET codDoc = @codDoc, xmlDoc = @xmlDoc
					WHERE claveAcceso = @claveAcceso 
				END
		COMMIT TRAN
	END TRY
	BEGIN CATCH 
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
		SET @method = (SELECT method FROM OPENJSON(@backendInfo) WITH(method VARCHAR(200) '$.methodName'))
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate])
		VALUES (NEWID(), @method, ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador())
	END CATCH 
END
