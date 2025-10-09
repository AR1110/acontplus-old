USE [AcontPlus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Config.Estab_Asig_Get @userRoleId INT,@json VARCHAR(MAX), @tableNames VARCHAR(MAX) OUTPUT
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

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol  WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

	SELECT @ruc = ruc FROM dbo.Entidad  WITH (NOLOCK) WHERE idEntidad = @idEntidad

	IF @idUsuarioRol IS NULL
		BEGIN
			SET @idUsuarioRol = @userRoleId
		END 

	SELECT * FROM ( SELECT 
		 asig.idEstab_Asig
		,asig.codEstab_Asig
		,asig.codEstab
		,es.estab
		,es.nombreComercial
		,asig.predeterminado 
		,asig.estado
        ,es.idEstablecimiento
	FROM Config.Estab_Asig       asig  WITH (NOLOCK)
	INNER JOIN Sri.Establecimiento es  WITH (NOLOCK) ON es.codEstab = asig.codEstab 
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
        ,es.idEstablecimiento
	FROM Sri.Establecimiento es  WITH (NOLOCK)
	WHERE es.codEstab NOT IN (SELECT sc.codEstab FROM Config.Estab_Asig sc WITH (NOLOCK) WHERE sc.idUsuarioRol = @idUsuarioRol)
	AND es.idEntidad = @idEntidad 
	) AS t ORDER BY t.predeterminado DESC


END
GO
