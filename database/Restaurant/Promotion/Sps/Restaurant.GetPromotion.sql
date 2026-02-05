USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-08-10
-- Description: sp for get restaurant menus
-- Restaurant.Promotion_Get 139, '{"tipo": 2}', ''
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.PromotionGet
    @Filters NVARCHAR(MAX) 
   ,@PageIndex INT = 1
   ,@PageSize INT = 10
   ,@SortBy NVARCHAR(50) = 'Id'
   ,@SortDirection NVARCHAR(4) = 'DESC'
   ,@SearchTerm NVARCHAR(100) = NULL
   ,@TotalCount INT OUTPUT
AS
BEGIN
    SET LANGUAGE SPANISH;
	SET NOCOUNT ON;

    DECLARE @UserRoleId INT

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
           ,@UserId INT
           ,@IncludeDeleted BIT = 0

    BEGIN TRY 
        --> Variables
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @IncludeDeleted = IncludeDeleted
                      ,@userRoleId     = userRoleId
                FROM OPENJSON(@Filters)
                WITH
                (
                    includeDeleted BIT         
                   ,userRoleId     INT         
                );
            END

        SELECT TOP 1 @idEntidad = idEntidad, @UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SET @WhereClause = N'WHERE es.idEntidad = @idEntidad '

        SET @Offset = (@PageIndex - 1) * @PageSize

        IF @SortDirection NOT IN ('ASC', 'DESC')
            BEGIN
                SET @SortDirection = 'DESC';
            END

        IF @SortBy NOT IN ('code', 'description', 'measure', 'category')
            BEGIN
                SET @SortBy = 'Id';
            END

        SET @OrderByClause = CASE @SortBy WHEN 'Description' THEN N' ORDER BY ' + QUOTENAME('Description') + N' ' + @SortDirection
                                          WHEN 'StartDate'   THEN N' ORDER BY ' + QUOTENAME('StartDate')   + N' ' + @SortDirection
                                          WHEN 'EndDate'     THEN N' ORDER BY ' + QUOTENAME('EndDate')     + N' ' + @SortDirection
                                                             ELSE N' ORDER BY ' + QUOTENAME('Id')          + N' ' + @SortDirection
                              END;

        --> Filters
        IF @IncludeDeleted = 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND pr.IsActive = 0 ';
            END

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                 SET @WhereClause = @WhereClause + N'AND (
                                                               pr.Description LIKE ''%'' + @SearchTerm + ''%''
                                                         ) '
            END


        SET @Params = '@idEntidad    INT
                      ,@SearchTerm   VARCHAR(100)
                      ,@Offset       INT
                      ,@PageSize     INT
                      ,@TotalCount   INT OUTPUT '

        SET @DataSQL = N'
                        IF OBJECT_ID(''tempdb..#FilteredPromotions'') IS NOT NULL DROP TABLE #FilteredPromotions;

                        WITH FilteredPromotions AS
                            
                             (
                                
                                SELECT pr.Id
                                      ,pr.Name
                                      ,pr.Description
                                      ,FORMAT(pr.StartDate, ''yyyy-MM-dd'')   AS StartDate
                                      ,FORMAT(pr.EndDate, ''yyyy-MM-dd'')     AS EndDate
                                      ,pr.[ApplicableDays]
                                      ,ISNULL(pr.[ImageUrl], '''')            AS [ImageUrl]
                                      ,pr.IsActive
                                      ,COUNT(*) OVER()                        AS TotalCount
	                            FROM Restaurant.Promotion      pr 
                                INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pr.EstablishmentId  '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredPromotions FROM FilteredPromotions OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredPromotions;

                     SELECT * FROM #FilteredPromotions ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredPromotions'') IS NOT NULL DROP TABLE #FilteredPromotions ' ;

        EXEC sp_executesql
            @DataSQL
           ,@Params
           ,@idEntidad
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
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.GetPromotion'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/promotion/Get'

        SELECT @ErrorDetails = (
            SELECT @PageIndex           AS PageIndex
                  ,@PageSize            AS PageSize
                  ,@SortBy              AS SortBy
                  ,@SortDirection       AS SortDirection
                  ,@SearchTerm          AS SearchTerm
                  ,@Filters             AS Filters 
                  ,@Offset              AS Offset
            FOR JSON PATH
        );
 
        --> Limpiar tabla temporal en caso de error
        IF OBJECT_ID('tempdb..#FilteredPromotions') IS NOT NULL DROP TABLE #FilteredItems;

        INSERT INTO ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;
    END CATCH
END
GO

