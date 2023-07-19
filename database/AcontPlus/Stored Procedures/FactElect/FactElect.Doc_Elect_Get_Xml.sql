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
-- Author:		Ivan Paz
-- Create date: 2023-05-05
-- Description:	SP FOR GET XML
-- =============================================
IF OBJECT_ID(N'FactElect.Doc_Elect_Get_Xml', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Elect_Get_Xml 
GO
CREATE PROCEDURE FactElect.Doc_Elect_Get_Xml @idUsuarioRol INT
,@id INT
AS
BEGIN
	SET NOCOUNT ON;
	IF EXISTS (SELECT 1 FROM DocumentoElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND xmlSri IS NOT NULL)
		BEGIN
			SELECT comprobante + ' ' + serieComprobante as 'filename',  xmlSri FROM v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id
		END
END
GO
