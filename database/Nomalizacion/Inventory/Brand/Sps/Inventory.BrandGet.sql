USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Marca_Get]    Script Date: 1/7/2023 9:36:00 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 01-07-2026 
-- Description:	Listado de Marcas
-- =============================================
CREATE OR ALTER PROCEDURE Inventory.BrandGet
    @Filters NVARCHAR(MAX) 
   ,@PageIndex INT = 1
   ,@PageSize INT = 10
   ,@SortBy NVARCHAR(50) = 'Id'
   ,@SortDirection NVARCHAR(4) = 'DESC'
   ,@SearchTerm NVARCHAR(100) = NULL
   ,@TotalCount INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    DECLARE @UserRoleId INT

    --> Sql
    DECLARE @DataSQL NVARCHAR(MAX) ,@Params NVARCHAR(MAX)

    --> Calculate offset
    DECLARE @Offset INT ;

    --> condicion 
    DECLARE @WhereClause NVARCHAR(MAX)

    --> Order
    DECLARE @OrderByClause NVARCHAR(200);

    --> filters
    DECLARE @CompanyId INT
           ,@UserId INT

    BEGIN TRY
        --> Data Json
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @userRoleId        = userRoleId
                FROM OPENJSON(@Filters)
                WITH
                (
                     userRoleId INT
                )    
            END

        --> Variables BD
        SELECT @CompanyId = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        SET @WhereClause = N'WHERE br.CompanyId = @CompanyId '

        SET @Offset = (@PageIndex - 1) * @PageSize

        IF @SortDirection NOT IN ('ASC', 'DESC')
            BEGIN
                SET @SortDirection = 'DESC';
            END

        IF @SortBy NOT IN ('code', 'description', 'createdAt', 'createdByUser')
            BEGIN
                SET @SortBy = 'Id';
            END

        SET @OrderByClause = N' ORDER BY ' + QUOTENAME(@SortBy) + N' ' + @SortDirection

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND (
                                                               br.Description   LIKE ''%'' + @SearchTerm + ''%''
                                                            OR br.Code          LIKE ''%'' + @SearchTerm + ''%''
                                                            OR us.nombreUsuario LIKE ''%'' + @SearchTerm + ''%''
                                                         ) '
            END

        SET @Params = '@CompanyId  INT
                      ,@SearchTerm VARCHAR(100)
                      ,@Offset     INT
                      ,@PageSize   INT
                      ,@TotalCount INT OUTPUT'

        SET @DataSQL = N'
                        IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems;

                        WITH FilteredItems AS
                            (
                                SELECT br.Id
                                      ,br.Code
	                                  ,br.[Description]
	                                  ,br.IsActive
	                                  ,FORMAT(br.CreatedAt,''dd-MM-yyyy HH:mm'') as CreatedAt
	                                  ,us.nombreUsuario					         as CreatedByUser
	                                  ,COUNT(*) OVER()					         as TotalCount
                                FROM Inventory.Brand  br
                                LEFT JOIN dbo.Usuario us ON us.idUsuario = br.[CreatedByUserId] '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredItems FROM FilteredItems OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredItems;

                     SELECT * FROM #FilteredItems ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems ' ;

        EXEC sp_executesql @DataSQL
                          ,@params 
                          ,@CompanyId    
                          ,@SearchTerm       
                          ,@Offset           
                          ,@PageSize 
                          ,@TotalCount = @TotalCount OUTPUT

    END TRY

    BEGIN CATCH
        --> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = 'Inventory.BrandGet'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Inventory/Brand/Get'

        SELECT @ErrorDetails = (
            SELECT @PageIndex           AS PageIndex
                  ,@PageSize            AS PageSize
                  ,@SortBy              AS SortBy
                  ,@SortDirection       AS SortDirection
                  ,@SearchTerm          AS SearchTerm
                  ,JSON_QUERY(@Filters) AS Filters 
                  ,@Offset              AS Offset
            FOR JSON PATH
        );
 
        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;

        --> Limpiar tabla temporal en caso de error
        IF OBJECT_ID('tempdb..#FilteredItems') IS NOT NULL DROP TABLE #FilteredItems;
    END CATCH
	
END
GO
