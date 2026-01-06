USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Order_Get]    Script Date: 15/9/2025 15:17:29 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Restaurant.GetOrder
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
    DECLARE @idEntidad INT
           ,@UserId INT
           ,@IncludeDeleted BIT = 0
           ,@PuntoEmisionId INT
           ,@IsSearchDate BIT
           ,@TableId INT
           ,@CreatedByUserId INT
           ,@IsFinished BIT
           ,@StartDate DATETIME2
           ,@EndDate DATETIME2

    BEGIN TRY
        --> Data Json
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @IncludeDeleted  = ISNULL(TRY_CAST(IncludeDeleted AS BIT), 0)
                      ,@userRoleId      = ISNULL(TRY_CAST(userRoleId     AS INT), 0)
                      ,@PuntoEmisionId  = PuntoEmisionId
                      ,@IsSearchDate    = IsSearchDate
                      ,@StartDate       = startDate
                      ,@EndDate         = endDate
                      ,@TableId         = TableId
                      ,@CreatedByUserId = createdByUserId
                      ,@IsFinished      = isFinished
                FROM OPENJSON(@Filters)
                WITH
                (
                    includeDeleted  BIT
                   ,userRoleId      INT
                   ,puntoEmisionId  INT
                   ,isSearchDate    BIT
                   ,startDate       DATETIME2
                   ,endDate         DATETIME2
                   ,tableId         INT
                   ,createdByUserId INT
                   ,isFinished      BIT
                )
            END

        --> Variables
        SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        SET @WhereClause = N'WHERE es.idEntidad = @idEntidad '

        SET @Offset = (@PageIndex - 1) * @PageSize

        IF @SortDirection NOT IN ('ASC', 'DESC')
            BEGIN
                SET @SortDirection = 'DESC';
            END

        IF @SortBy NOT IN ('serie', 'createdAt', 'idCard', 'businessName')
            BEGIN
                SET @SortBy = 'Id';
            END

        SET @OrderByClause = N' ORDER BY ' + QUOTENAME(@SortBy) + N' ' + @SortDirection

        --> Validate input parameters
        IF @IncludeDeleted = 1
            BEGIN
                SET @WhereClause = @WhereClause + N'AND od.isDeleted = 1 ';
            END

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND (
                                                               od.Obs           LIKE ''%'' + @SearchTerm + ''%''
                                                            OR od.Serie         LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.IdCard        LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.BusinessName  LIKE ''%'' + @SearchTerm + ''%''
                                                            OR us.nombreUsuario LIKE ''%'' + @SearchTerm + ''%''
                                                         ) '
            END

        IF @PuntoEmisionId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND od.PuntoEmisionId = @PuntoEmisionId '
            END

        IF @IsSearchDate = 1
            BEGIN
                SET @WhereClause = @WhereClause + 'AND CAST(od.CreatedAt AS DATE) BETWEEN CAST(@StartDate AS DATE) AND CAST(@EndDate AS DATE) '
            END

        IF @TableId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND od.TableId = @TableId '
            END

        IF @CreatedByUserId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND od.CreatedByUserId = @CreatedByUserId '
            END

        IF @IsFinished = 1
            BEGIN
                SET @WhereClause = @WhereClause + 'AND ro.IsFinished = @IsFinished '
            END

        SET @Params = '@idEntidad       INT
                      ,@PuntoEmisionId  INT
                      ,@TableId         INT
                      ,@CreatedByUserId INT
                      ,@StartDate       DATETIME2
                      ,@EndDate         DATETIME2
                      ,@IsFinished      BIT
                      ,@SearchTerm      VARCHAR(100)
                      ,@Offset          INT
                      ,@PageSize        INT
                      ,@TotalCount      INT OUTPUT '

        SET @DataSQL = N'
                        IF OBJECT_ID(''tempdb..#FilteredOrders'') IS NOT NULL DROP TABLE #FilteredOrders;

                        WITH FilteredOrders AS
                            
                             (
                                SELECT od.Id
	                                  ,od.Serie
                                      ,od.Total
                                      ,od.Obs
		                              ,od.IsDivided
                                      ,od.IsFinished
		                              ,FORMAT(od.CreatedAt, ''dd-MM-yyyy HH:mm'') as CreatedAt
                                      ,od.IsActive
		                              ,ta.[Description]						      as [Table]
		                              ,us.nombreUsuario						      as [CreatedByUser]
		                              ,cu.IdCard
		                              ,cu.BusinessName
		                              ,COUNT(*) OVER()						      as TotalCount
	                            FROM Restaurant.[Order]	       od
	                            INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = od.PuntoEmisionId 
	                             LEFT JOIN Restaurant.[Table]  ta ON ta.Id				  = od.TableId
	                             LEFT JOIN dbo.Usuario         us ON us.idUsuario         = od.CreatedByUserId
	                            INNER JOIN dbo.Cliente         cl ON cl.idCliente	      = od.CustomerCompanyId
	                            INNER JOIN Customer.Customer   cu ON cu.Id			      = cl.CustomerId
	                            INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredOrders FROM FilteredOrders OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredOrders;

                     SELECT * FROM #FilteredOrders ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredOrders'') IS NOT NULL DROP TABLE #FilteredOrders ' ;

        EXEC sp_executesql
            @DataSQL
           ,@Params
           ,@idEntidad
           ,@PuntoEmisionId
           ,@TableId
           ,@CreatedByUserId
           ,@StartDate
           ,@EndDate
           ,@IsFinished
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
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.GetOrder'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/order/Get'

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
        IF OBJECT_ID('tempdb..#FilteredOrders') IS NOT NULL DROP TABLE #FilteredItems;
    END CATCH
END
