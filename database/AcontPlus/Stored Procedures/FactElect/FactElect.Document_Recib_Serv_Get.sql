USE [Acontplus]
go
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
IF OBJECT_ID(N'FactElect.Document_Recib_Serv_Get', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Document_Recib_Serv_Get 
GO
CREATE PROCEDURE FactElect.Document_Recib_Serv_Get @cantDocs INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT TOP (@cantDocs) idDocumento,codDoc,versionComp,claveAcceso FROM Recepcion.DocumentoRecibido WHERE codDoc IN ('04','07') AND downloaded = 'DE' 
END
GO
