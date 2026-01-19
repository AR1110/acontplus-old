USE [AcontPlusAdmin]
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
DROP PROC IF EXISTS Config.UserCustomer_Get;
GO

DROP PROC IF EXISTS Config.Company_Get;
GO

CREATE OR ALTER PROCEDURE Config.GetUsers
     @json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	DECLARE @pageSize INT ,@pageIndex INT, @searchTerm VARCHAR(100), @sortBy VARCHAR(50), @sortDirection VARCHAR(10)

	SELECT @pageSize = pageSize, @pageIndex = pageIndex, @searchTerm = searchTerm, @sortBy = sortBy, @sortDirection = sortDirection 
	FROM OPENJSON(@json) WITH (pageIndex INT '$.pageIndex', pageSize INT '$.pageSize', searchTerm VARCHAR(100) '$.searchTerm', sortBy VARCHAR(50) '$.sortBy', sortDirection VARCHAR(10) '$.sortDirection')

	-- GET --
		    
			SET @tableNames = 'userCustomers'

			DECLARE @sql NVARCHAR(MAX)
			SET @sql = '
			SELECT idUsuario         as Id
				  ,c.IdCard
				  ,nombreUsuario     as Username
				  ,correo            as Email
				  ,c.BusinessName    as Fullname
				  ,estado
				  ,ISNULL(u.firstName, '''') firstName
				  ,ISNULL(u.lastName, '''') lastName
				  ,COUNT(*) OVER()   as TotalRecords
			FROM Acontplus.dbo.Usuario u WITH (NOLOCK)
				LEFT JOIN Acontplus.Customer.Customer c ON u.customerId = c.Id
			WHERE 1=1'

			IF @searchTerm IS NOT NULL AND @searchTerm <> ''
			BEGIN
				SET @sql = @sql + ' AND (c.BusinessName LIKE ''%'' + @searchTerm + ''%'' OR nombreUsuario LIKE ''%'' + @searchTerm + ''%'' OR correo LIKE ''%'' + @searchTerm + ''%'')'
			END

			DECLARE @orderBy NVARCHAR(100)
			SET @orderBy = CASE 
				WHEN @sortBy = 'username' THEN 'nombreUsuario'
				WHEN @sortBy = 'email' THEN 'correo'
				WHEN @sortBy = 'fullname' THEN 'c.BusinessName'
				WHEN @sortBy = 'id' THEN 'idUsuario'
				ELSE 'idUsuario'
			END

			IF @sortDirection = 'desc'
				SET @orderBy = @orderBy + ' DESC'
			ELSE
				SET @orderBy = @orderBy + ' ASC'

			SET @sql = @sql + ' ORDER BY ' + @orderBy + ' OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY'

			EXEC sp_executesql @sql, N'@pageSize INT, @pageIndex INT, @searchTerm VARCHAR(100)', @pageSize, @pageIndex, @searchTerm

END
