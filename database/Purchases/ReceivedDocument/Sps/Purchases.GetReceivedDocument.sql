USE AcontPlus
GO
SET ANSI_NULLS ON
GO


SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Fernando Paz
-- Create date: 2022-07-31
-- Description:	SP PARA LISTAR LOS COMPROBANTES ELECTRONICOS DEL SRI IMPORTADOS 
-- =============================================
CREATE OR ALTER PROCEDURE Purchases.GetReceivedDocument
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
    
    --> Parse JSON filters
    DECLARE @idEntidad INT
           ,@UserId INT
           ,@IncludeDeleted BIT = 0
           ,@IsSearchDate BIT
           ,@CreatedByUserId INT
           ,@StartDate DATETIME2
           ,@EndDate DATETIME2

    BEGIN TRY
        --> Data Json
        IF @Filters IS NOT NULL AND ISJSON(@Filters) = 1
            BEGIN
                SELECT @IncludeDeleted  = ISNULL(TRY_CAST(IncludeDeleted AS BIT), 0)
                      ,@userRoleId      = ISNULL(TRY_CAST(userRoleId     AS INT), 0)
                      ,@IsSearchDate    = IsSearchDate
                      ,@StartDate       = startDate
                      ,@EndDate         = endDate
                      ,@CreatedByUserId = createdByUserId
                FROM OPENJSON(@Filters)
                WITH
                (
                    includeDeleted  BIT
                   ,userRoleId      INT
                   ,isSearchDate    BIT
                   ,startDate       DATETIME2
                   ,endDate         DATETIME2
                   ,createdByUserId INT
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

        IF @SortBy NOT IN ('serie', 'issueDate', 'authorizationDate', 'customer','idCard')
            BEGIN
                SET @SortBy = 'Id';
            END

        SET @OrderByClause = N' ORDER BY ' + QUOTENAME(@SortBy) + N' ' + @SortDirection

        --> Validate input parameters
        IF @SearchTerm IS NOT NULL AND LEN(@SearchTerm) > 0
            BEGIN
                SET @WhereClause = @WhereClause + N'AND (
                                                               dr.serieComprobante LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.IdCard           LIKE ''%'' + @SearchTerm + ''%''
                                                            OR cu.BusinessName     LIKE ''%'' + @SearchTerm + ''%''
                                                            OR td.descripcion      LIKE ''%'' + @SearchTerm + ''%''
                                                            OR sc.Name             LIKE ''%'' + @SearchTerm + ''%''

                                                         ) '
            END

        SET @Params = '@idEntidad   INT
                      ,@SearchTerm  VARCHAR(100)
                      ,@Offset      INT
                      ,@PageSize    INT
                      ,@TotalCount  INT OUTPUT '

        SET @DataSQL = N'
                        IF OBJECT_ID(''tempdb..#FilteredDocumentReceived'') IS NOT NULL DROP TABLE #FilteredDocumentReceived;

                        WITH FilteredDocumentReceived AS
                            
                             (
                                SELECT dr.idDocumento                                     as Id 
                                      ,dr.idEstablecimiento                               as EstablishmentId
			                          ,dr.serieComprobante				                  as Serie
                                      ,FORMAT(dr.fechaEmision, ''dd-MM-yyyy'')            as IssueDate
                                      ,FORMAT(dr.fechaAutorizacion, ''dd-MM-yyyy HH:mm'') as AuthorizationDate                  
			                          ,dr.claveAcceso	                                  as Accesskey
			                          ,dr.complete						                  as IsComplete
			                          ,CAST(dr.importeTotal as numeric(18,2))             as Total
			                          ,td.descripcion                                     as Document
			                          ,td.codigoSri	                                      as CodDoc
			                          ,cu.IdCard           
			                          ,cu.BusinessName                                    as Customer
			                          ,sc.Name							                  as Subcategory
                                      ,COUNT(*) OVER()						              as TotalCount
                                FROM Recepcion.DocumentoRecibido       dr
                                INNER JOIN dbo.TipoDocumento           td ON td.idTipoDocumento   = dr.idTipoDocumento
                                INNER JOIN Sri.Establecimiento         es ON es.idEstablecimiento = dr.idEstablecimiento
                                INNER JOIN Customer.Customer           cu ON cu.Id			      = dr.customerId
                                 LEFT JOIN Contabilidad.CuentaPorPagar cp ON cp.uniqueId          = dr.claveAcceso
                                 LEFT JOIN Contabilidad.Subcategory    sc ON sc.Id	              = cp.subcategoryId '
                                + @WhereClause

                         + N')

                     SELECT * INTO #FilteredDocumentReceived FROM FilteredDocumentReceived OPTION (RECOMPILE);

                     SELECT TOP 1 @TotalCount = TotalCount FROM #FilteredDocumentReceived;

                     SELECT * FROM #FilteredDocumentReceived ' + @OrderByClause + N' OFFSET @Offset ROWS FETCH NEXT @PageSize ROWS ONLY

                     IF OBJECT_ID(''tempdb..#FilteredDocumentReceived'') IS NOT NULL DROP TABLE #FilteredDocumentReceived ' ;
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
               ,@ErrorProcedure NVARCHAR(128)  = 'Purchases.GetDocumentReceived'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Purchases/DocumentReceived/Get'

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
        IF OBJECT_ID('tempdb..#FilteredDocumentReceived') IS NOT NULL DROP TABLE FilteredDocumentReceived;
    END CATCH


 --   --> Get
 --   IF @tipo = 1
 --       BEGIN

 --           SET @tableNames = 'documentos'

 --           SET @params = '@idEstablecimiento   INT
	--					  ,@codDoc           VARCHAR(2)
	--					  ,@startDate        DATETIME2
	--					  ,@endDate          DATETIME2
	--					  ,@rucProveedor     VARCHAR(25)
 --                         ,@claveAcceso      VARCHAR(49)
 --                         ,@pageIndex        INT
 --                         ,@pageSize         INT
 --                         ,@serieComprobante VARCHAR(20)
 --                         ,@subcategoryId    INT '

 --           SET @sql = 'SELECT dr.[idDocumento]
	--                          ,e.idEstablecimiento
	--	                      ,e.[codEstab]
	--	                      ,dr.[comprobante]
	--	                      ,dr.[codDoc]
	--	                      ,dr.[serieComprobante]
	--	                      ,c.IDCard [rucEmisor]
	--	                      ,c.businessName razonSocialEmisor
	--	                      ,dr.[fechaEmision]
	--	                      ,dr.[fechaAutorizacion]
	--	                      ,dr.[identificacionReceptor]
	--	                      ,dr.[claveAcceso]
	--	                      ,dr.[importeTotal]
	--	                      ,CASE WHEN xmlCompressed IS NOT NULL THEN 1 ELSE 0 END hasXml
	--	                      ,ISNULL(complete, 0) complete
	--	                      ,CASE WHEN xmlCompressed IS NOT NULL AND complete = 0 THEN ''background-color: #FFF5BD;''
	--		                        WHEN complete = 1                               THEN ''background-color: #03a9f3; cursor: pointer;''
	--		                                                                        ELSE ''''
	--		                   END                                                               as colorRow
	--	                      ,CASE WHEN complete = 1 THEN ''background-color: #03a9f3;''
	--		                                          ELSE ''''
	--		                   END                                                               as colorCol
	--	                      ,CASE WHEN complete = 1 THEN ''Documento Importado'' ELSE '''' END as hoverText
 --                             ,COUNT(*) OVER()                                                   as totalRecords
 --                             ,ISNULL(s.[Name], '''') subcategoryName
 --                             ,ISNULL(dr.subcategoryId, 0) subcategoryId
	--                    FROM Recepcion.DocumentoRecibido       dr WITH (NOLOCK)
	--					INNER JOIN Sri.Establecimiento e WITH(NOLOCK) ON dr.idEstablecimiento = e.idEstablecimiento
 --                       LEFT JOIN Contabilidad.CuentaPorPagar cpp WITH (NOLOCK) ON dr.claveAcceso = cpp.uniqueId
 --                       LEFT JOIN Contabilidad.Subcategory      s WITH (NOLOCK) ON dr.subcategoryId = s.Id
	--					LEFT JOIN Customer.Customer c WITH(NOLOCK) ON dr.customerId = c.Id
	--                    WHERE dr.idEstablecimiento = @idEstablecimiento '

 --               SELECT 
 --                   @codDoc          = NULLIF(LTRIM(RTRIM(codDoc)), ''),
 --                   @ckBoxFecha      = ckBoxFecha,
 --                   @startDate       = startDate,
 --                   @endDate         = endDate,
 --                   @claveAcceso     = NULLIF(LTRIM(RTRIM(claveAcceso)), ''),
 --                   @codEstab        = NULLIF(LTRIM(RTRIM(codEstab)), ''),
 --                   @rucProveedor    = NULLIF(LTRIM(RTRIM(rucProveedor)), ''),
 --                   @pageSize        = pageSize,
 --                   @pageIndex       = pageIndex,
 --                   @serieComprobante = NULLIF(LTRIM(RTRIM(serieComprobante)), ''),
 --                   @subcategoryId   = subcategoryId
 --               FROM OPENJSON(@JSON) WITH 
 --               (
 --                   codDoc           VARCHAR(2),
 --                   ckBoxFecha       BIT,
 --                   startDate        DATETIME2,
 --                   endDate          DATETIME2,
 --                   claveAcceso      VARCHAR(50),
 --                   codEstab         VARCHAR(50),
 --                   rucProveedor     VARCHAR(25),
 --                   pageSize         INT,
 --                   pageIndex        INT,
 --                   serieComprobante VARCHAR(20),
 --                   subcategoryId    INT
 --               );

 --           print LEN(@rucProveedor )

 --           SET @idEstablecimiento = (SELECT idEstablecimiento FROM Sri.Establecimiento WHERE codEstab = @codEstab)

 --           IF @ckBoxFecha = 1 AND @serieComprobante IS NULL
 --               BEGIN
 --                   SET @sql = @sql + 'AND CAST(dr.fechaEmision AS DATE) BETWEEN CAST(@startDate AS DATE) AND CAST(@endDate AS DATE) '
 --               END 

 --           IF @codDoc IS NOT NULL
 --               BEGIN
 --                   SET @sql = @sql + 'AND dr.codDoc = @codDoc '
 --               END 

 --           IF @rucProveedor IS NOT NULL
	--            BEGIN 
	--	            SET @sql = @sql + 'AND rucEmisor = @rucProveedor '
	--            END

 --           IF @claveAcceso IS NOT NULL
 --               BEGIN
 --                   SET @sql = @sql + 'AND dr.claveAcceso = @claveAcceso '
 --               END
 --           ELSE 
 --               BEGIN
 --                   SET @sql = @sql + 'AND dr.estado = 1 '
 --               END 


 --           IF @serieComprobante IS NOT NULL
 --               BEGIN
 --                   SET @sql = @sql + ' AND dr.serieComprobante LIKE ''%' + @serieComprobante + '%'' ' 
 --               END


 --           IF @subcategoryId > 0
 --               BEGIN
 --                    SET @sql = @sql + ' AND dr.subcategoryId = @subcategoryId ' 
 --               END

 --           SET @sql = @sql + ' ORDER BY idDocumento DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

 --           EXEC sp_executesql @sql
	--	                      ,@params
	--	                      ,@idEstablecimiento         = @idEstablecimiento
	--	                      ,@codDoc           = @codDoc
	--	                      ,@startDate        = @startDate
	--	                      ,@endDate          = @endDate
	--	                      ,@rucProveedor     = @rucProveedor
 --                             ,@claveAcceso      = @claveAcceso
 --                             ,@pageIndex        = @pageIndex
 --                             ,@pageSize         = @pageSize
 --                             ,@serieComprobante = @serieComprobante
 --                             ,@subcategoryId    = @subcategoryId

 --           RETURN 
 --       END 

 --   --> Filter
 --   IF @tipo = 2
 --       BEGIN
            
 --           SET @tableNames = 'establecimientos,tipoComprobantes,subcategories'

 --           SELECT idEstablecimiento,codEstab,nombreComercial FROM Config.v_Estab_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY Predeterminado desc

 --           SELECT descripcion,codigoSri as codDoc, codigoSri FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri IN ('01','04','07','05') ORDER BY codigoSri

 --           SELECT * FROM Contabilidad.subcategory  WITH (NOLOCK) WHERE companyId = @idEntidad AND Enabled = 1

 --           RETURN 
 --       END 

	----> DataForm Detail
	--IF @tipo = 3
	--    BEGIN
		    
 --           SET @tableNames = 'SustentoTributario,CategoriaCompra,Bodega,Medida'

	--	    SELECT *
	--	    FROM SustentoTributario WITH (NOLOCK)

	--	    SELECT *
	--	    FROM CategoriaCompra WITH (NOLOCK)
	--	    WHERE idEntidad = @idEntidad

	--	    SELECT *
	--	    FROM Bodega WITH (NOLOCK)
	--	    WHERE estado = 1 AND codEstab IN (SELECT codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @userRoleId) 

	--	    SELECT *
	--	    FROM Medida WITH (NOLOCK)
	--	    WHERE idEntidad = @idEntidad

	--	    RETURN
	--    END

 --   --> Documento Relacionado 
	--IF @tipo = 4
	--    BEGIN
            
 --           SET @tableNames = 'comprobante'

 --           SELECT @id = id  , @codDoc = codDoc FROM OPENJSON(@json) WITH (codDoc VARCHAR(10),id INT)

	--	    IF @codDoc = '01'
	--	        BEGIN
                    
 --                   SELECT TOP 1 @claveAcceso = claveAcceso FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @id

	--		        SELECT 'Retenci�n'                                                           as comprobante
	--			           ,de.serieComprobante
	--			           ,cu.IDCard                                                            as rucEmisor
	--			           ,cu.TradeName                                                         as razonSocialEmisor
	--			           ,CONVERT(NVARCHAR, FORMAT(de.fechaEmision, 'dd/MM/yyyy HH:mm'))       as fechaEmision
	--			           ,de.claveAcceso
	--			           ,0                                                                    as importeTotal
	--		        FROM FactElect.RetAtsDocSustento retDoc
	--		        INNER JOIN FactElect.RetencionAts rAts WITH (NOLOCK) ON rAts.idRetencionAts       = retDoc.idRetencionAts
 --                   INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = rAts.idDocumentoElectronico
 --                   INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor            = rAts.idProveedor
 --                   INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = pr.CustomerId
	--		        WHERE retDoc.numAutDocSustento = @claveAcceso
	--		          AND rAts.anuladaSri = 0
	--	        END

	--	    IF @codDoc = '07' OR @codDoc = '04'
	--	        BEGIN
	--		        SELECT CASE dr.codDocSustento WHEN '01' THEN 'Factura' ELSE '' END  as comprobante
	--			          ,dr.numDocSustento                                            as serieComprobante
	--			          ,dr.fechaEmisionDocSustento                                   as fechaEmision
	--			          ,dr.claveAcceso
	--			          ,ISNULL((
 --                               SELECT CAST(SUM(di.TaxBase) as numeric(18,2)) FROM Recepcion.DocumentoImpuesto di WITH (NOLOCK) WHERE di.DocumentoRecibidoId = @id
 --                         ),0) as baseImponible
	--		        FROM FactElect.DocRelacionado dr WITH (NOLOCK)
	--		        WHERE dr.idDocumentoRecibido = @id
	--	        END

 --           RETURN 
	--    END
END
GO


