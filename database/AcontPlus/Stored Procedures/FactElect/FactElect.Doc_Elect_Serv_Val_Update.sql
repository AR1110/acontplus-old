USE [AcontPlus]
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'FactElect.Doc_Elect_Serv_Val_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Elect_Serv_Val_Update 
GO
CREATE PROCEDURE FactElect.Doc_Elect_Serv_Val_Update @id INT ,@codEstado INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	BEGIN TRY 
		BEGIN TRAN 
			IF (@codEstado = 3) 
				BEGIN
				UPDATE dbo.DocumentoElectronico SET codEstado = @codEstado
				,xmlAcontPlus = NULL
				WHERE idDocumentoElectronico = @id 
				END
			ELSE
				BEGIN
				UPDATE dbo.DocumentoElectronico SET codEstado = @codEstado
				WHERE idDocumentoElectronico = @id
				END 
		COMMIT TRAN 
	END TRY 

	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), '/Service/SignerUpdate', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), 1)
	END CATCH 
END
GO
