USE [Acontplus]
GO
/****** Object:  StoredProcedure [App].[Usuario_Get_Search]    Script Date: 21/1/2024 12:35:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-09-24
-- Description:	SP para listar los usuarios para un buscador 
-- =============================================
CREATE OR ALTER PROCEDURE App.Usuario_Search
	@userRoleId INT
	 ,@json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH; 
	DECLARE @idEntidad int 
		   ,@text nvarchar(200)

	SELECT  @text  = (REPLACE(busqueda,space(1),'%'))  FROM OPENJSON(@json) WITH (busqueda NVARCHAR(500) '$.busqueda')

	SELECT @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId
 
			SELECT 
				 idUsuario = u.idUsuario
				,nombreCompleto = u.nombreCompleto
				,nombreUsuario = u.nombreUsuario
				,nroIdentificacion = u.nroIdentificacion
			FROM App.UsuarioRol ur
			INNER JOIN dbo.Usuario u ON u.idUsuario = ur.idUsuario
			WHERE ur.idEntidad = @idEntidad AND (u.nombreCompleto LIKE '%'+@text+'%' OR u.nombreUsuario LIKE '%'+@text+'%' OR u.nroIdentificacion LIKE '%'+@text+'%')
			 
END
