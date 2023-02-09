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
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Sri.Establecimiento_Get', N'P') IS NOT NULL
DROP PROCEDURE Sri.Establecimiento_Get 
GO
CREATE PROCEDURE Sri.Establecimiento_Get @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @ruc VARCHAR(15)

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

	SELECT @ruc = ruc FROM dbo.Entidad WHERE idEntidad  = @idEntidad

	SELECT 
		e.idEstablecimiento
	   ,e.codEstab
	   ,e.estab
	   ,e.nombreComercial
	   ,e.dirEstablecimiento
	   ,estado = IIF(e.estado = 1,'ABIERTO','CERRADO')
	FROM Sri.Establecimiento e
	WHERE e.ruc = @ruc
	ORDER BY e.idEstablecimiento DESC


END
GO