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
IF OBJECT_ID(N'Config.Estab_Asig_Get', N'P') IS NOT NULL
DROP PROCEDURE Config.Estab_Asig_Get 
GO
CREATE PROCEDURE Config.Estab_Asig_Get @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @ruc VARCHAR(20)
	DECLARE @idUsuarioRol INT 
	DECLARE @typeList INT 

	SELECT @idUsuarioRol = idUsuarioRol, @typeList = typeList FROM OPENJSON(@json) WITH (idUsuarioRol INT '$.idUsuarioRol', typeList INT '$.typeList')

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

	SELECT @ruc = ruc FROM dbo.Entidad WHERE idEntidad = @idEntidad

	IF @idUsuarioRol IS NULL
		BEGIN
			SET @idUsuarioRol = @idRol
		END 

	SELECT 
		 asig.idEstab_Asig
		,asig.codEstab_Asig
		,asig.codEstab
		,es.estab
		,es.nombreComercial
		,asig.predeterminado 
		,asig.estado
	FROM Config.Estab_Asig asig
	INNER JOIN Sri.Establecimiento es ON es.codEstab = asig.codEstab 
	wHERE asig.idUsuarioRol = @idUsuarioRol

	UNION ALL

	SELECT 
		 0
		,NULL
		,codEstab
		,estab
		,es.nombreComercial
		,CAST(0 AS bit)
		,CAST(0 AS bit)
	FROM Sri.Establecimiento es 
	WHERE es.codEstab NOT IN (SELECT sc.codEstab FROM Config.Estab_Asig sc WHERE sc.idUsuarioRol = @idUsuarioRol)
	AND es.ruc = @ruc 


END
GO
