USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Item_Get]    Script Date: 6/10/2025 18:01:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2023-08-14
-- Description:	Get Item
CREATE OR ALTER PROCEDURE Restaurant.GetItem
    @UserRoleId INT
   ,@Filters NVARCHAR(MAX) = NULL
   ,@TableNames NVARCHAR(MAX) OUTPUT
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

    --> Sql
    DECLARE @DataSQL NVARCHAR(MAX) ,@Params NVARCHAR(MAX)

    --> Calculate offset
    DECLARE @Offset INT ;

    --> condicion 
    DECLARE @WhereClause NVARCHAR(MAX)

    --> Order
    DECLARE @OrderByClause NVARCHAR(200);

    --> Parse JSON filters
    DECLARE @idEntidad INT
           ,@sigla VARCHAR(50)
           ,@siglaFormatted VARCHAR(500)
           ,@idSubFamilia INT
           ,@UserId INT
           ,@IncludeDeleted BIT = 0

    --> Data Global
    SELECT TOP 1 @idEntidad = idEntidad, @UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> Variables
    SET @WhereClause = N'WHERE ar.idEntidad = @idEntidad '

    SET @Offset = (@PageIndex - 1) * @PageSize

    IF @SortDirection NOT IN ('ASC', 'DESC')
        BEGIN
            SET @SortDirection = 'DESC';
        END

    IF @SortBy NOT IN ('code', 'description', 'measure', 'category')
        BEGIN
            SET @SortBy = 'Id';
        END

     SET @OrderByClause = CASE @SortBy WHEN 'code'        THEN N' ORDER BY ' + QUOTENAME('code')        + N' ' + @SortDirection
                                       WHEN 'description' THEN N' ORDER BY ' + QUOTENAME('description') + N' ' + @SortDirection
                                       WHEN 'measure'     THEN N' ORDER BY ' + QUOTENAME('measure')     + N' ' + @SortDirection
                                       WHEN 'category'    THEN N' ORDER BY ' + QUOTENAME('category')    + N' ' + @SortDirection
                                                          ELSE N' ORDER BY ' + QUOTENAME('Id')          + N' ' + @SortDirection
                          END;

    BEGIN TRY
        SET @TableNames = 'items,pagination'

        --> Validate input parameters
        IF @PageIndex < 1
            BEGIN
                THROW 50001, 'PageIndex must be greater than or equal to 1', 1;
            END

        IF @PageSize < 1 OR @PageSize > 1000
            BEGIN
                THROW 50002, 'PageSize must be between 1 and 1000', 1;
            END

        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @IncludeDeleted = ISNULL(TRY_CAST(JSON_VALUE(@Filters ,'$.IncludeDeleted') AS BIT), 0)
                      ,@idSubFamilia   = ISNULL(TRY_CAST(JSON_VALUE(@Filters ,'$.idSubFamilia')   AS INT), 0)
                      ,@sigla          = TRY_CAST(JSON_VALUE(@Filters ,'$.sigla')          AS VARCHAR(50));
            END

        IF @IncludeDeleted = 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND ar.estado = 1 ';
            END

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                 SET @WhereClause = @WhereClause + N'AND (
                                                               ar.descripcion LIKE ''%'' + @SearchTerm + ''%''
                                                            OR ri.Summary     LIKE ''%'' + @SearchTerm + ''%''
                                                            OR ri.Content     LIKE ''%'' + @SearchTerm + ''%''
                                                         ) '
            END

        IF @idSubFamilia > 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND ar.idSubFamilia = @idSubFamilia '
            END
        ELSE
            BEGIN
                IF @sigla IS NOT NULL
                    BEGIN
                        SET @WhereClause = @WhereClause + N'AND ar.siglaFamilia '
                    END
                ELSE
                    BEGIN
                        SET @WhereClause = @WhereClause + N'AND ar.siglaFamilia NOT IN (''COM'') '
                    END 
                
            END


        SET @Params = '@idEntidad    INT
                      ,@idSubFamilia INT
                      ,@sigla        VARCHAR(50)
                      ,@SearchTerm   VARCHAR(100)
                      ,@Offset       INT
                      ,@PageSize     INT
                      ,@TotalCount   INT OUTPUT '

        SET @DataSQL = N'
                        IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems;

                        WITH FilteredItems AS
                            
                             (
                                SELECT ri.Id                   
                                      ,ri.ProductId
                                      ,ISNULL(ri.title, '''')   AS title
                                      ,ISNULL(ri.Summary, '''') AS summary
                                      ,ar.s3ObjectUrl           AS s3ObjectUrl
                                      ,ar.descripcion           AS description
                                      ,ar.codigo                AS code
                                      ,ar.medida                AS measure
                                      ,ar.codigoAuxiliar        AS auxiliary_code
                                      ,ar.precioCosto           AS costPrice
                                      ,ar.categoria             AS category
                                      ,COUNT(*) OVER()          AS TotalCount
                                FROM Restaurant.Item             ri
                                INNER JOIN Inventario.v_Articulo ar ON ar.idArticulo = ri.ProductId '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredItems FROM FilteredItems OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredItems;

                     SELECT * FROM #FilteredItems ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems ' ;


        EXEC sp_executesql
            @DataSQL
           ,@Params
           ,@idEntidad
           ,@idSubFamilia
           ,@sigla
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
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.GetItem'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/item/Get'

        SELECT @ErrorDetails = (
            SELECT @UserRoleId          AS UserRoleId
                  ,@PageIndex           AS PageIndex
                  ,@PageSize            AS PageSize
                  ,@SortBy              AS SortBy
                  ,@SortDirection       AS SortDirection
                  ,@SearchTerm          AS SearchTerm
                  ,JSON_QUERY(@Filters) AS Filters 
                  ,@Offset              AS Offset
            FOR JSON PATH
        );
 
        --> Limpiar tabla temporal en caso de error
        IF OBJECT_ID('tempdb..#FilteredItems') IS NOT NULL DROP TABLE #FilteredItems;

        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;
    END CATCH 
END
