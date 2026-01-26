USE Acontplus
GO
/****** Object:  StoredProcedure [App].[Usuario_Insert]    Script Date: 6/4/2023 20:45:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-03
-- Description:	Agregar Informacion a la tabla Usuario y la tabla Rol 
-- =============================================
DROP PROC IF EXISTS Config.UserCustomerRole_Get;
GO

CREATE OR ALTER PROCEDURE Config.GetUserRoles 
     @userId INT
AS
BEGIN

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	-- GET --
	SELECT ur.idUsuarioRol    as Id
		  ,ur.idUsuario       as UserCustomerId
		  ,en.Uuid       as companyUuid
		  ,ur.RoleId
		  ,us.nombreUsuario   as UserName
		  ,en.nombreComercial as BusinessName
		  ,po.[Name] as [Role]
		  ,ur.estado as IsActive
	FROM Acontplus.App.UsuarioRol     ur WITH (NOLOCK)
	INNER JOIN Acontplus.dbo.Usuario  us WITH (NOLOCK) ON us.idUsuario  = ur.idUsuario
	INNER JOIN Acontplus.dbo.Entidad  en WITH (NOLOCK) ON en.idEntidad  = ur.idEntidad
	INNER JOIN Seguridad.[Role] po WITH (NOLOCK) ON po.Id = ur.RoleId
	WHERE ur.idUsuario = @userId 
	ORDER BY ur.idUsuarioRol DESC
END
