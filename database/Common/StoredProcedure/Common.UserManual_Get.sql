USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-10-27
-- Description:	sp for get userManuals
-- =============================================
CREATE OR ALTER PROCEDURE Common.UserManual_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
	
	DECLARE @menuId INT,
		@textSearch VARCHAR(100),
		@pageIndex INT,
		@pageSize INT,
		@params NVARCHAR(500),
		@query NVARCHAR(MAX),
        @totalRecords INT;

    BEGIN TRY
    
    	SELECT @menuId = menuId
    		,@textSearch = textSearch
    		,@pageIndex = pageIndex
    		,@pageSize = pageSize
    	FROM OPENJSON(@json)
    		WITH(
    			menuId INT,
    			textSearch VARCHAR(100),
    			pageIndex INT,
    			pageSize INT
    		);
    	
    	SET @params = '@menuId INT, @textSearch VARCHAR(100), @pageIndex INT, @pageSize INT, @totalRecords INT '
    	
        SET @tableNames = 'modules,userManuals'

        SELECT Id
            ,Name
        
        FROM Config.Menu WITH(NOLOCK)
        WHERE IsActive = CAST(1 AS BIT)
        ORDER BY Name

        SET @totalRecords = (SELECT COUNT(*) FROM Common.UserManual WITH(NOLOCK))

        SET @query = '
	        SELECT umt.Code
            ,umt.Name
            ,ISNULL(m.Name, ''General'') AS Module
            ,um.Title
            ,um.CompressedContent
		    ,@totalRecords                                                   as totalRecords
            FROM Common.UserManual um WITH(NOLOCK)
                INNER JOIN Common.UserManualType umt WITH(NOLOCK) 
            	    ON um.UserManualTypeId = umt.Id
			    LEFT JOIN Config.Menu m WITH(NOLOCK) ON um.menuId = m.Id
		    WHERE um.IsActive = CAST(1 AS BIT) '
      	
       	IF (@menuId > 0)
        	BEGIN
        		SET @query = @query + 'AND um.MenuId = @menuId '
        	END
        IF (@textSearch IS NOT NULL AND LEN(LTRIM(RTRIM(@textSearch))) > 0)
        	BEGIN 
        		 SET @query = @query + 'AND (CONVERT(VARCHAR(MAX), DECOMPRESS(um.CompressedContent)) LIKE ''%' + @textSearch + '%''
										OR um.Title LIKE ''%' + @textSearch + '%'')'
        	END
        	
       SET @query = @query + ' ORDER BY m.Name ASC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '
        	
   		EXEC sp_executesql @query, @params,
   									@menuId,
   									@textSearch,
   									@pageIndex,
   									@pageSize,
                                    @totalRecords;
    END TRY
    BEGIN CATCH
        
    END CATCH
END
GO
