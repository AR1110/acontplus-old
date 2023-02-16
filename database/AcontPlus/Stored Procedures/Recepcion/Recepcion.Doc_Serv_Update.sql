USE AcontPlus
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
-- Author:		Ivan Fernando Paz
-- Create date: 2023-02-13
-- Description: SP FOR GET DOCS RECEIVED TO DOWNLOAD XML FROM SRI
-- =============================================
--Recepcion.Doc_Service_Get 50
IF OBJECT_ID(N'Recepcion.Doc_Serv_Update ', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Doc_Serv_Update 
GO
CREATE PROCEDURE Recepcion.Doc_Serv_Update @idDocumento INT
,@downloaded VARCHAR(2)
,@codDoc VARCHAR(2)
,@xmlDoc XML
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		BEGIN TRAN
			UPDATE dr SET dr.codDoc = @codDoc
			,dr.xmlDoc = @xmlDoc
			,dr.downloaded = @downloaded 
			FROM Recepcion.DocumentoRecibido dr WITH (ROWLOCK)
			WHERE idDocumento = @idDocumento
		COMMIT TRAN
	END TRY
	BEGIN CATCH
 		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		DECLARE @method VARCHAR(200)
 		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate])
		VALUES (NEWID(), 'DocumentoService/Update', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador())
	END CATCH 

END
GO
