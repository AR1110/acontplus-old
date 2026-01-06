USE [AcontPlus]
GO 

-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 03/16/2023
-- Description:	SP para listar las compras que no tiene documento validado por el sri.
-- =============================================
CREATE OR ALTER PROCEDURE Purchases.NonHabitualGet
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
           ,@IsSearchDate BIT
           ,@DateStart DATETIME2
           ,@DateEnd DATETIME2
           ,@EmissionPointId INT
           ,@SequenceNumber VARCHAR(10)
           ,@CustomerCompanyId INT
           ,@SubcategoryId INT
           ,@PaymentStatusId INT

	BEGIN TRY
        --> Data Json
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @userRoleId        = userRoleId
                      ,@UserId            = UserId
                      ,@CustomerCompanyId = CustomerCompanyId
                      ,@EmissionPointId   = EmissionPointId  
                      ,@SubcategoryId     = SubcategoryId    
                      ,@PaymentStatusId   = PaymentStatusId
                      ,@IsSearchDate      = IsSearchDate     
                      ,@DateStart         = DateStart         
                      ,@DateEnd           = DateEnd
                      ,@SequenceNumber    = SequenceNumber
                FROM OPENJSON(@Filters)
                WITH
                (
                     userRoleId        INT
                    ,userId            INT 
                    ,isSearchDate      BIT
                    ,dateStart         DATETIME2
                    ,dateEnd           DATETIME2
                    ,emissionPointId   INT
                    ,sequenceNumber    VARCHAR(10)
                    ,customerCompanyId INT
                    ,subcategoryId     INT
                    ,paymentStatusId   INT
                )
            END

        --> Variables BD
        SELECT @CompanyId = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        SET @WhereClause = N'WHERE es.idEntidad = @CompanyId '

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

        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND (
                                                               cp.serieComprobante  LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.IdCard            LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.BusinessName      LIKE ''%'' + @SearchTerm + ''%''
                                                            OR us.nombreUsuario     LIKE ''%'' + @SearchTerm + ''%''
                                                         ) '
            END


        IF @UserId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND di.idUsuario = @UserId '
            END 

        IF @CustomerCompanyId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND di.idProveedor = @CustomerCompanyId '
            END 

        IF @EmissionPointId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND di.idPuntoEmision = @EmissionPointId '
            END

        IF @SequenceNumber IS NOT NULL
		    BEGIN 
			    SET @WhereClause = @WhereClause + 'AND di.secuencial BETWEEN ' + REPLACE(@SequenceNumber,'-',' AND ')
		    END

        IF @IsSearchDate = 1
            BEGIN
                SET @WhereClause = @WhereClause + 'AND CAST(di.fechaEmision as date) BETWEEN CAST(@DateStart as date) AND CAST(@DateEnd as date) '
            END

        IF @SubcategoryId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND cp.subcategoryId = @SubcategoryId '
            END

        IF @PaymentStatusId > 0
            BEGIN
                SET @WhereClause = @WhereClause + 'AND cp.idEstadoPago = @PaymentStatusId '
            END 

        SET @Params = '@CompanyId         INT
                      ,@UserId            INT
                      ,@CustomerCompanyId INT
                      ,@EmissionPointId   INT
                      ,@SequenceNumber    VARCHAR(50)
                      ,@DateStart         DATETIME2
				      ,@DateEnd           DATETIME2
                      ,@SubcategoryId     INT
                      ,@PaymentStatusId   INT
                      ,@SearchTerm        VARCHAR(100)
                      ,@Offset            INT
                      ,@PageSize          INT
                      ,@TotalCount        INT OUTPUT'


        SET @DataSQL = N'
                        IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems;

                        WITH FilteredItems AS
                            (
                                SELECT di.idDocumentoIngreso				         as Id
                                      ,FORMAT(di.fechaEmision, ''dd-MM-yyyy HH:mm'') as IssueDate
                                      ,di.importeTotal					             as TotalAmount
                                      ,ep.descripcion					             as PaymentStatus    
                                      ,ep.codigo							         as PaymentStatusCode
                                      ,cu.IDCard								     as IdCard			
                                      ,cu.BusinessName					             as IssuerBusiness
                                      ,cp.serieComprobante				             as Serie
		                              ,cp.abono									     as AmountPaid
                                      ,cp.saldo									     as Balance
                                      ,us.nombreUsuario						         as CreatedByUser
                                      ,sc.[Name]					                 as SubcategoryName
		                              ,COUNT(*) OVER()						         as TotalCount
	                            FROM Compra.Documento_Ingreso          di 
	                            INNER JOIN dbo.PuntoEmision            pe ON pe.idPuntoEmision    = di.idPuntoEmision
                                INNER JOIN dbo.Proveedor               pr ON pr.idProveedor       = di.idProveedor
                                INNER JOIN dbo.Usuario                 us ON us.idUsuario         = di.idUsuario
	                            INNER JOIN Contabilidad.CuentaPorPagar cp ON cp.idDocumento       = di.idDocumentoIngreso AND cp.codDoc = ''DH''
                                INNER JOIN Sri.Establecimiento         es ON es.idEstablecimiento = pe.idEstablecimiento
                                 LEFT JOIN dbo.EstadoPago              ep ON ep.idEstadoPago      = cp.idEstadoPago
                                 LEFT JOIN Contabilidad.Subcategory    sc ON sc.Id                = cp.subcategoryId
                                INNER JOIN Customer.Customer           cu ON cu.Id                = pr.CustomerId '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredItems FROM FilteredItems OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredItems;

                     SELECT * FROM #FilteredItems ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredItems'') IS NOT NULL DROP TABLE #FilteredItems ' ;

        EXEC sp_executesql @DataSQL
                          ,@params 
                          ,@CompanyId        
                          ,@UserId           
                          ,@CustomerCompanyId
                          ,@EmissionPointId  
                          ,@SequenceNumber  
                          ,@DateStart        
                          ,@DateEnd         
                          ,@SubcategoryId    
                          ,@PaymentStatusId  
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
               ,@ErrorProcedure NVARCHAR(128)  = 'Purchases.NonHabitualGet'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Purchases/nonHabitual/Get'

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
