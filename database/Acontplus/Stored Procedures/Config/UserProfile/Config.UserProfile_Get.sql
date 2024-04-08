USE AcontPlus
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2027-04-03
-- Description:	GET DATA FOR USER PROFILE
-- =============================================
-- Config.UserProfile_Get  264, '', ''
CREATE OR ALTER PROC Config.UserProfile_Get 
@userRoleId	INT
, @tableNames VARCHAR(500) OUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;    
    DECLARE @idUsuario INT

    SELECT @idUsuario = idUsuario FROM Acontplus.App.UsuarioRol WHERE idUsuarioRol = @userRoleId
    
    SET @tableNames = 'user,roles'

    SELECT * FROM Acontplus.dbo.Usuario WHERE idUsuario = @idUsuario

    SELECT au.idUsuarioRol
        , au.nroIdentificacion
        , au.ruc
        , sr.Code
        , CONVERT(NVARCHAR, FORMAT(au.fechaRegistro, 'dd/MM/yyyy HH:mm:ss')) AS fechaRegistro        
        , au.codigo
        , sr.Name AS name
        , au.estado
    FROM Acontplus.App.UsuarioRol au WITH(NOLOCK)
    INNER JOIN AcontplusAdmin.Seguridad.[Role] sr WITH(NOLOCK) ON sr.Id = au.RoleId
    WHERE au.idUsuario = @idUsuario
END
GO