USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[GetItem]    Script Date: 7/11/2025 11:08:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE Restaurant.GetMealConsumptions
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

    --> Parse JSON filters
    DECLARE @UserRoleId INT

    --> Sql
    DECLARE @DataSQL NVARCHAR(MAX) ,@Params NVARCHAR(MAX)

    --> Calculate offset
    DECLARE @Offset INT ;

    --> condicion 
    DECLARE @WhereClause NVARCHAR(MAX)

    --> Order
    DECLARE @OrderByClause NVARCHAR(200);
    

    --> Filters
    DECLARE @UserId INT
           ,@IncludeDeleted BIT = 0
           ,@MealScheduleSettingId INT
           ,@EstablishmentId INT

    BEGIN TRY
        --> Data Json
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @IncludeDeleted        = ISNULL(TRY_CAST(IncludeDeleted AS BIT), 0)
                      ,@userRoleId            = ISNULL(TRY_CAST(userRoleId     AS INT), 0)
                      ,@MealScheduleSettingId = MealScheduleSettingId
                      ,@EstablishmentId       = EstablishmentId
                FROM OPENJSON(@Filters)
                WITH
                (
                    includeDeleted        BIT         
                   ,userRoleId            INT
                   ,mealScheduleSettingId INT
                   ,establishmentId       INT
                );
            END

        --> Variables
        SELECT TOP 1 @UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SET @WhereClause = N'WHERE ms.EstablishmentId = @EstablishmentId '

        SET @Offset = (@PageIndex - 1) * @PageSize

        IF @SortDirection NOT IN ('ASC', 'DESC')
            BEGIN
                SET @SortDirection = 'DESC';
            END

        IF @SortBy NOT IN ('mealScheduleSettingName', 'customerName', 'consumptionStatus', 'consumptionDate')
            BEGIN
                SET @SortBy = 'Id';
            END

        SET @OrderByClause = N' ORDER BY ' + QUOTENAME(@SortBy) + N' ' + @SortDirection ;


        --> Validate input parameters
        IF @IncludeDeleted = 1
            BEGIN
                SET @WhereClause = @WhereClause + N'AND mc.IsDeleted = 1 ';
            END

        IF @MealScheduleSettingId > 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND mc.MealScheduleSettingId = @MealScheduleSettingId '
            END 

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                 SET @WhereClause = @WhereClause + N'AND (
                                                               mc.CancellationReason LIKE ''%'' + @SearchTerm + ''%''
                                                            OR ms.Description        LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.BusinessName       LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.IdCard             LIKE ''%'' + @SearchTerm + ''%''
                                                         ) '
            END

        SET @Params = '@EstablishmentId        INT
                      ,@MealScheduleSettingId  INT
                      ,@SearchTerm             VARCHAR(100)
                      ,@Offset                 INT
                      ,@PageSize               INT
                      ,@TotalCount             INT OUTPUT '

        SET @DataSQL = N'
                        IF OBJECT_ID(''tempdb..#FilteredMealConsumptions'') IS NOT NULL DROP TABLE #FilteredMealConsumptions;

                        WITH FilteredMealConsumptions AS
                            
                             (
                                
                                SELECT mc.Id
                                      ,mc.MealScheduleSettingId
	                                  ,FORMAT(mc.ConsumptionDate, ''dd-MM-yyyy HH:mm'') as ConsumptionDate
	                                  ,mc.Amount
	                                  ,mc.Status								        as ConsumptionStatus
	                                  ,mc.CancellationReason
	                                  ,FORMAT(mc.CancelledAt, ''dd-MM-yyyy HH:mm'')     as CancelledAt
	                                  ,FORMAT(mc.CreatedAt, ''dd-MM-yyyy HH:mm'')       as CreatedAt
                                      ,mc.[Status]
	                                  ,ms.Description							        as MealScheduleSettingName
	                                  ,cu.BusinessName							        as CustomerName
                                      ,ur.nombreUsuario								    as CreatedByUser
	                                  ,uc.nombreUsuario								    as CancelledByUser
                                      ,COUNT(*) OVER()                                  as TotalCount
                                FROM Restaurant.MealConsumption				      mc 
                                INNER JOIN [Restaurant].[MealScheduleSetting]     ms ON ms.Id        = mc.MealScheduleSettingId
                                INNER JOIN [Restaurant].[CompanyCustomerMealPlan] cp ON cp.Id        = mc.CompanyCustomerMealPlanId
                                 LEFT JOIN dbo.Usuario						      ur ON ur.idUsuario = mc.CreatedByUserId
                                 LEFT JOIN dbo.Usuario						      uc ON uc.idUsuario = mc.CancelledByUserId
                                INNER JOIN dbo.Cliente						      cl ON cl.idCliente = cp.CompanyCustomerId
                                INNER JOIN Customer.Customer					  cu ON cu.Id	     = cl.CustomerId '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredMealConsumptions FROM FilteredMealConsumptions OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredMealConsumptions;

                     SELECT * FROM #FilteredMealConsumptions ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredMealConsumptions'') IS NOT NULL DROP TABLE #FilteredMealConsumptions ' ;


        EXEC sp_executesql
            @DataSQL
           ,@Params
           ,@EstablishmentId
           ,@MealScheduleSettingId
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
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.GetMealConsumptions'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/MealConsumption/Get'

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
        IF OBJECT_ID('tempdb..#FilteredMealConsumptions') IS NOT NULL DROP TABLE #FilteredItems;
    END CATCH 
END
