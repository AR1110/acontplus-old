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
CREATE PROCEDURE Almacen.GestionGeneral_Get @idRol INT,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 

	SELECT @idEntidad = idEntidad FROM AFTDataRol(@idRol)

	SELECT * FROM dbo.SubFamilia WHERE idEntidad = @idEntidad AND estado = 1

	SELECT * FROM dbo.Familia WHERE idEntidad = @idEntidad AND estado = 1
	
	SELECT * FROM dbo.Medida WHERE idEntidad = @idEntidad AND estado = 1

	SELECT * FROM dbo.Modelo WHERE idEntidad = @idEntidad AND estado = 1

	SELECT * FROM dbo.Marca WHERE idEntidad = @idEntidad AND estado = 1
END
GO
