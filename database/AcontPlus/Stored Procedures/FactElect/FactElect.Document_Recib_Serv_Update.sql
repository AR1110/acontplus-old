USE [AcontPlus]
GO
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
IF OBJECT_ID(N'FactElect.Document_Recib_Serv_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Document_Recib_Serv_Update 
GO
CREATE PROCEDURE FactElect.Document_Recib_Serv_Update @idDocumento INT,@complete BIT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	BEGIN TRY 
		BEGIN TRAN 
			UPDATE Recepcion.DocumentoRecibido SET complete = @complete WHERE idDocumento = @idDocumento
		COMMIT TRAN 
	END TRY 
	
	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
	END CATCH 

END
GO
