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
-- Author:		Ivan Paz
-- Create date: 2022-09-25
-- Description:	SP FOR GET DATA TO FILL FORM
-- =============================================
--FactElect.Comp_Imp_GetDataForm  1052
IF OBJECT_ID(N'FactElect.Comp_Imp_GetDataForm ', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Comp_Imp_GetDataForm 
GO
CREATE PROCEDURE FactElect.Comp_Imp_GetDataForm 
@idRol INT
AS
BEGIN 
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @codEstab VARCHAR(50)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol
	
	SELECT @codEstab = codEstab FROM Config.Estab_Asig WITH (NOLOCK) WHERE idUsuarioRol = @idRol AND predeterminado = 1

	SELECT * FROM SustentoTributario

	SELECT * FROM TiempoCredito WHERE idEntidad = @idEntidad AND gestion = 0

	SELECT * FROM CategoriaCompra WHERE idEntidad = @idEntidad

	SELECT * FROM Bodega WHERE codEstab = @codEstab

	SELECT * FROM Medida WHERE idEntidad = @idEntidad
END
GO
