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
-- Create date: 2023-04-19
-- Description:	SP FOR GET FILTERS FOR CARDEX
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Kardex_Get_Filters @idUsuarioRol INT
AS
BEGIN
	SET NOCOUNT ON;
	
    SELECT * FROM Inventario.TipoTransaccion WITH (NOLOCK)

	SELECT * FROM Inventario.TipoDocumento WITH (NOLOCK)

END
GO
