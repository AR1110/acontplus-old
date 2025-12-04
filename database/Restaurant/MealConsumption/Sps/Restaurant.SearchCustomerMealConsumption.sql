USE Acontplus;
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-12-02
-- Description:	Search customers for meal consumptions
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.SearchCustomerMealConsumption
    @Filters NVARCHAR(MAX) 
   ,@PageIndex INT = 1
   ,@PageSize INT = 10
   ,@SortBy NVARCHAR(50) = 'Id'
   ,@SortDirection NVARCHAR(4) = 'DESC'
   ,@SearchTerm NVARCHAR(100) = NULL
   ,@TotalCount INT OUTPUT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    DECLARE @UserRoleId INT,
        @UserId INT,
        @CompanyId INT;

    DECLARE @DataSQL NVARCHAR(MAX) ,@Params NVARCHAR(MAX);
    DECLARE @CountSQL NVARCHAR(MAX);
    DECLARE @WhereClause NVARCHAR(MAX);
    DECLARE @OrderByClause NVARCHAR(200);
    DECLARE @Offset INT;

    BEGIN TRY
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @UserRoleId = TRY_CAST(UserRoleId AS INT)
                FROM OPENJSON(@Filters)
                WITH
                (
                    userRoleId INT
                );
            END
        ELSE
            THROW 50001, 'Invalid @Filters parameter. Expected a valid JSON string.', 1;

        SELECT @UserId = idUsuario, @CompanyId = idEntidad
        FROM v_usuario WHERE idUsuarioRol = @UserRoleId;

        SET @WhereClause = N'WHERE cc.idEntidad = @CompanyId ';

        SET @Offset = (@PageIndex - 1) * @PageSize;

        IF @SortDirection NOT IN ('ASC', 'DESC')
            BEGIN
                SET @SortDirection = 'DESC';
            END

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                 SET @WhereClause = @WhereClause + N'AND (c.BusinessName LIKE N''%'' + @SearchTerm + N''%''
                                                          OR c.IdCard LIKE N''%'' + @SearchTerm + N''%'') '
            END

        -- Determine ORDER BY based on @SortBy
        IF @SortBy = 'BusinessName'
            SET @OrderByClause = N' ORDER BY c.BusinessName ' + @SortDirection
        ELSE
            SET @OrderByClause = N' ORDER BY cc.idCliente ' + @SortDirection;

        SET @Params = N'@CompanyId INT
                       ,@SearchTerm NVARCHAR(100)
                       ,@Offset INT
                       ,@PageSize INT
                       ,@TotalCount INT OUTPUT';

        -- Get total count first
        SET @CountSQL = N'
        SELECT @TotalCount = COUNT(*)
        FROM dbo.Cliente cc
        INNER JOIN Customer.Customer c ON cc.CustomerId = c.Id
        LEFT JOIN Administrador.cargo cargo ON cc.idCargo = cargo.idCargo
        LEFT JOIN Administrador.Empresa e ON cc.idEmpresa = e.idEmpresa
        ' + @WhereClause;

        EXEC sp_executesql
            @CountSQL
           ,@Params
           ,@CompanyId
           ,@SearchTerm
           ,@Offset
           ,@PageSize
           ,@TotalCount = @TotalCount OUTPUT;

        -- Get paginated data
        SET @DataSQL = N'
        SELECT cc.idCliente AS CompanyCustomerId
        ,c.BusinessName
        ,c.IdCard
        ,cc.idEmpresa AS CustomerCompanyId
        ,ISNULL(cargo.descripcion, '''') AS CustomerCompanyRole
        ,ISNULL((SELECT customerCompany.BusinessName
            FROM Customer.Customer customerCompany
            WHERE customerCompany.Id = e.CustomerId), '''') AS CustomerCompanyName

        FROM dbo.Cliente cc
        INNER JOIN Customer.Customer c ON cc.CustomerId = c.Id
        LEFT JOIN Administrador.cargo cargo ON cc.idCargo = cargo.idCargo
        LEFT JOIN Administrador.Empresa e ON cc.idEmpresa = e.idEmpresa
        ' + @WhereClause + @OrderByClause + N'
        OFFSET @Offset ROWS
        FETCH NEXT @PageSize ROWS ONLY';

        EXEC sp_executesql
            @DataSQL
           ,@Params
           ,@CompanyId
           ,@SearchTerm
           ,@Offset
           ,@PageSize
           ,@TotalCount = @TotalCount OUTPUT;

    END TRY
    BEGIN CATCH
        --> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.SearchCustomerMealConsumption'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/MealConsumption/search-customer'

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
 
        INSERT INTO dbo.ErroresSistema
               (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage,errorDate,idUsuario,errorDetails)
        SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId, @ErrorDetails;
        
        -- Re-throw to let backend handle it properly
        THROW;
    END CATCH

END
GO
