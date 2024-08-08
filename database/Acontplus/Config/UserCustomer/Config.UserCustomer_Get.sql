USE [AcontPlus]
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
CREATE OR ALTER PROCEDURE Config.UserCustomer_Get 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	DECLARE @tipo INT ,@pageSize INT ,@pageIndex INT, @idEntidad INT 

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')
    SELECT top 1 @idEntidad = idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId
	-- GET --
	IF @tipo = 1
		BEGIN
		    
			SET @tableNames = 'userCustomers'

			SELECT @pageSize = pageSize, @pageIndex  = pageIndex FROM OPENJSON(@json) WITH ( pageIndex INT '$.pageIndex', pageSize  INT '$.pageSize')

			SELECT u.idUsuario          
				  ,c.IDCard nroIdentificacion 
				  ,u.nombreUsuario  
                  ,u.nombreUsuario as 'username'
				  ,u.correo email           
                  ,ISNULL(u.firstName, '') firstName
                  ,ISNULL(u.lastName, '') lastName
				  ,c.BusinessName nombreCompleto    
				  ,COUNT(*) OVER()   as TotalRecords
                  ,ur.roleId
                  ,ur.estado
			FROM dbo.Usuario u WITH (NOLOCK) 
            INNER JOIN App.UsuarioRol ur WITH(NOLOCK) ON ur.idUsuario = u.idUsuario
            LEFT JOIN Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
            WHERE ur.idEntidad = @idEntidad
			ORDER BY idUsuario DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY

			RETURN 
		END

	-- DATA FORM
	IF @tipo = 2
		BEGIN
			
			SET @tableNames = 'roles' 
            SELECT Id, [Name], Code FROM AcontPlusAdmin.Seguridad.[Role] WHERE Code NOT IN ('RT', 'SU', 'ADM')
            AND [Enabled] = 1

			RETURN 
		END 

	IF (@tipo = 3)
		BEGIN
			DECLARE @textSearch VARCHAR(100)
			 
			SET @tableNames = 'userCustomers'

			SELECT @textSearch = textSearch, @pageSize = pageSize, @pageIndex  = pageIndex FROM OPENJSON(@json) WITH ( pageIndex INT '$.pageIndex', pageSize  INT '$.pageSize', textSearch VARCHAR(100) '$.textSearch')

			SELECT idUsuario         as Id
				  ,c.IDCard as IDCard
				  ,nombreUsuario     as Username
				  ,correo            as Email
				  ,c.BusinessName    as Fullname
				  ,COUNT(*) OVER()   as TotalRecords
			FROM dbo.Usuario u WITH (NOLOCK) 
            LEFT JOIN Customer.Customer c WITH(NOLOCK) ON u.customerId = c.Id
			WHERE c.BusinessName LIKE '%' + @textSearch + '%'
				OR nombreUsuario LIKE '%'  +@textSearch + '%'
			ORDER BY idUsuario DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
		END

END
