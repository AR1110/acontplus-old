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

    SELECT @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId
    
    SET @tableNames = 'user,roles'

    SELECT  [idUsuario]
    ,[nombreUsuario]
    ,[correo]
    ,[estado]
    ,[fechaRegistro]
    ,[firstName]
    ,[lastName]
    ,ISNULL(firstName + ' ' + lastName, 'No asignado') AS FullName
    ,[customerId]
    ,ISNULL(c.IdCard, 'No asignado') AS NroIdentificacion
    FROM dbo.Usuario u
    LEFT JOIN Customer.Customer c ON u.customerId = u.customerId
    WHERE idUsuario = @idUsuario

    SELECT au.idUsuarioRol
        ,e.razonSocial companyName
        ,e.ruc companyIdCard
        ,sr.Code
        ,CONVERT(NVARCHAR, FORMAT(au.fechaRegistro, 'dd/MM/yyyy HH:mm:ss')) AS fechaRegistro
        ,sr.Name AS name
        ,au.estado
    FROM App.UsuarioRol au WITH(NOLOCK)
    INNER JOIN Seguridad.[Role] sr WITH(NOLOCK) ON sr.Id = au.RoleId
    INNER JOIN dbo.Usuario u WITH(NOLOCK) ON au.idUsuario = u.idUsuario
    LEFT JOIN Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
    INNER JOIN dbo.Entidad e WITH(NOLOCK) ON au.idEntidad = e.idEntidad
    WHERE au.idUsuario = @idUsuario
END
GO