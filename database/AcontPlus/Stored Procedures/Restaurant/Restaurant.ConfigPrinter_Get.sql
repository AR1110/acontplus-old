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
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-12-29
-- Description:	sp for get printer config
-- =============================================
IF OBJECT_ID(N'Restaurant.ConfigPrinter_Get', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.ConfigPrinter_Get
GO
CREATE PROCEDURE Restaurant.ConfigPrinter_Get @idRol INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab VARCHAR(50) 

	SELECT @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1


	SELECT * FROM Restaurant.configPrinter where codEstab = @codEstab
	
END
GO
