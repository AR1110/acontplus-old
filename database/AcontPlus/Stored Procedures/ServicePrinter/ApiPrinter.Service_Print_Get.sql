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
IF OBJECT_ID(N'ApiPrinter.Service_Print_Get', N'P') IS NOT NULL
DROP PROCEDURE ApiPrinter.Service_Print_Get
GO
CREATE PROCEDURE ApiPrinter.Service_Print_Get 
	@ruc VARCHAR(20)
   ,@estab VARCHAR(20)
   ,@idUser VARCHAR(15) =  NULL
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @idUser  IS NULL
		BEGIN
			SELECT 
				token = idService_Printer_Document
			   ,rdlcProps
			   ,rdlcParams
			   ,dataSources
			FROM ApiPrinter.Service_Printer_Document WHERE ruc = @ruc AND numEstab = @estab
		END 

	ELSE 
		BEGIN
			SELECT 
				token = idService_Printer_Document
			   ,rdlcProps
			   ,rdlcParams
			   ,dataSources
			FROM ApiPrinter.Service_Printer_Document WHERE ruc = @ruc AND numEstab = @estab AND idUser = @idUser
		END 

	

END
GO
