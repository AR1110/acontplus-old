USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[GetItem]    Script Date: 7/11/2025 11:08:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2023-08-14
-- Description:	Get Item
CREATE OR ALTER PROCEDURE Restaurant.GetItem
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
    DECLARE @OrderByClause NVARCHAR(200) ,@InnerJoin NVARCHAR(MAX)= ' ' ,@Column VARCHAR(MAX) = '';
    

    --> Parse JSON filters
    DECLARE @idEntidad INT
           ,@sigla VARCHAR(50)
           ,@siglaFormatted VARCHAR(500)
           ,@idSubFamilia INT
           ,@UserId INT
           ,@IncludeDeleted BIT = 0
           ,@IsPos BIT

    BEGIN TRY
        --> Data Json
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @IncludeDeleted = ISNULL(TRY_CAST(IncludeDeleted AS BIT), 0)
                      ,@idSubFamilia   = ISNULL(TRY_CAST(idSubFamilia   AS INT), 0)
                      ,@userRoleId     = ISNULL(TRY_CAST(userRoleId     AS INT), 0)
                      ,@sigla          = sigla
                      ,@IsPos          = isPos
                FROM OPENJSON(@Filters)
                WITH
                (
                    includeDeleted BIT         
                   ,idSubFamilia   INT         
                   ,userRoleId     INT         
                   ,sigla          VARCHAR(50)
                   ,isPos          BIT     
                );
            END

        --> Variables
        SELECT TOP 1 @idEntidad = idEntidad, @UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

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

        -->Variables Join
        IF @IsPos = 1
            BEGIN
                SET @InnerJoin = @InnerJoin +  'INNER JOIN dbo.ArticuloPvP pv ON pv.idArticulo = fi.ProductId 
                                                INNER JOIN dbo.Tarifa      ta ON ta.idTarifa   = pv.IdTarifa AND ta.codigo = 1  '

                SET @Column = @Column + ',pv.precioConIva AS priceWithTax '
            END

        --> Validate input parameters
        IF @IncludeDeleted = 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND ar.estado = 1 ';
            END

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                 SET @WhereClause = @WhereClause + N'AND (
                                                               ar.descripcion LIKE ''%'' + @SearchTerm + ''%''
                                                            OR ri.Summary     LIKE ''%'' + @SearchTerm + ''%''
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
                        SET @siglaFormatted = '''' + REPLACE(@sigla, ',', ''',''') + ''''

                        SET @WhereClause = @WhereClause + 'AND ar.siglaFamilia IN (' + @siglaFormatted + ') '
                    END
                ELSE
                    BEGIN
                        SET @WhereClause = @WhereClause + N'AND ar.siglaFamilia NOT IN (''COM'') '
                    END 
                
            END

        SET @Params = '@idEntidad    INT
                      ,@idSubFamilia INT
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
                                      ,ISNULL(ri.Summary, '''') AS Summary
                                      ,ri.[RequiresCooking]
                                      ,ri.[PreparationInstructions]
                                      ,ar.s3ObjectUrl           AS ImagenUrl
                                      ,ar.descripcion           AS Description
                                      ,ar.codigo                AS Code
                                      ,ar.medida                AS Measure
                                      ,ar.codigoAuxiliar        AS AuxiliaryCode
                                      ,ar.precioCosto           AS CostPrice
                                      ,ar.categoria             AS Category
                                      ,ar.siglaFamilia          AS AcronymFamily
                                      ,COUNT(*) OVER()          AS TotalCount
                                      ,ar.stock
                                FROM Restaurant.Item             ri
                                INNER JOIN Inventario.v_Articulo ar ON ar.idArticulo = ri.ProductId '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredItems FROM FilteredItems OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredItems;

                     SELECT fi.* ' + @Column + N'  FROM #FilteredItems fi ' + @InnerJoin + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems ' ;


        EXEC sp_executesql
            @DataSQL
           ,@Params
           ,@idEntidad
           ,@idSubFamilia
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
