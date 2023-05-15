


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
-- Author:		Emilio Senguana
-- Create date: 15/05/2023
-- Description:	 
-- =============================================
IF OBJECT_ID(N'Recepcion.Dato_Adicional_Articulo_Get', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Dato_Adicional_Articulo_Get
GO
CREATE PROCEDURE Recepcion.Dato_Adicional_Articulo_Get
	@idUsuarioRol AS INT
   ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idDocumento INT
	SELECT 
		@idDocumento = idDocumento
	FROM OPENJSON(@json)
	WITH(
		idDocumento int
	)


	SELECT * FROM Compra.InfoAdicional 
				    WHERE uniqueId = (SELECT claveAcceso FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento)
END
GO
