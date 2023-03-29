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
IF OBJECT_ID(N'Recepcion.Doc_Service_Get ', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Doc_Service_Get 
GO
CREATE PROCEDURE Recepcion.Doc_Service_Get @cantDocs INT 
AS
BEGIN
	SET NOCOUNT ON;

	SELECT TOP (@cantDocs) idDocumento, claveAcceso FROM Recepcion.DocumentoRecibido WHERE downloaded = 'ND'

END
GO
