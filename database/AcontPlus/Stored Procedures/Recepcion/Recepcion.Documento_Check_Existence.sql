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
-- Create date: 2023-05-01
-- Description:	SP FOR CHECK EXISTENCE OF DOC
-- =============================================
IF OBJECT_ID(N'Recepcion.Documento_Check_Existence ', N'P') IS NOT NULL
	DROP PROCEDURE Recepcion.Documento_Check_Existence
GO

CREATE PROCEDURE Recepcion.Documento_Check_Existence @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @table as table (claveAcceso VARCHAR(49))
	INSERT INTO @table
	select claveAcceso FROM OPENJSON(@JSON) WITH(claveAcceso VARCHAR(49) '$.claveAcceso')

	SELECT dr.claveAcceso FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK) INNER JOIN @table t ON dr.claveAcceso = t.claveAcceso
 
	--SELECT @exits AS '@exists'
	--RETURN
END
GO
