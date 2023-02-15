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
-- Author:		Ivan Paz
-- Create date: 2022-09-27
-- Description: SP FOR GET DETAIL TEMP
-- =============================================
--Recepcion.Doc_Detail_Temp_Get 1061, 'A250AADC-1033-4056-B0A1-13A2F857CB37'
IF OBJECT_ID(N'Recepcion.Doc_Detail_Temp_Get', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Doc_Detail_Temp_Get 
GO
CREATE PROCEDURE Recepcion.Doc_Detail_Temp_Get
@idRol INT
,@idComp UNIQUEIDENTIFIER
,@jsonData NVARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	IF NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Temp WHERE idComp = @idComp)
		BEGIN
			RETURN
		END

	SELECT * FROM Recepcion.Doc_Detalle_Temp WHERE idComp = @idComp
END
GO
