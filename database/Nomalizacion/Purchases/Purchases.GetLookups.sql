USE [AcontPlus]
GO
-- =============================================
-- Author:		Ignacio Manchu
-- Create date: 2025-10-14
-- Description:	SP para listar datos de las ventas para un uso generico
-- =============================================
CREATE OR ALTER PROCEDURE Purchases.GetLookups @Filters VARCHAR(MAX) = NULL
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> DataJson
    DECLARE @IdEntidad INT ,@UserId INT ,@UserRoleId INT;

    --> Variables especiales
    DECLARE @TableNames VARCHAR(MAX) ,@Module NVARCHAR(50) ,@Context NVARCHAR(20);

    --> Declare logica de if Lookups
    DECLARE @IssuingPoints BIT
           ,@Warehouses BIT
           ,@Subcategories BIT
           ,@CreditTimes BIT
           ,@TaxRevenue BIT
           ,@Taxes BIT
           ,@Establishments BIT
           ,@DocumentStatus BIT

    --> Tabla Temporal
    CREATE TABLE #LookupResults
    (
        TableName    NVARCHAR(128) NOT NULL
       ,Id           INT NULL
       ,Code         NVARCHAR(100) NULL
       ,[Value]      NVARCHAR(400) NULL DEFAULT ''
       ,DisplayOrder INT NULL
       ,ParentId     INT NULL
       ,IsDefault    BIT DEFAULT 0
       ,IsActive     BIT DEFAULT 1
       ,[Description] NVARCHAR(MAX) DEFAULT ''
       ,Metadata     NVARCHAR(MAX) NULL
       ,INDEX IX_Temp_TableName CLUSTERED (TableName, Id)
       ,INDEX IX_Temp_TableName_Value NONCLUSTERED (TableName, [Value])
       ,INDEX IX_Temp_TableName_Order NONCLUSTERED (TableName, DisplayOrder)
    );

    BEGIN TRY

        --> Variables
        SELECT @UserRoleId = UserRoleId
              ,@Module     = Module
              ,@Context    = Context
        FROM OPENJSON(@Filters) WITH (
            UserRoleId INT          '$.userRoleId'
           ,Module     VARCHAR(100) '$.module'
           ,Context    VARCHAR(100) '$.context'
        );

        SELECT TOP 1 @IdEntidad = idEntidad ,@UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @UserRoleId;


        IF @Module IN ('Non-Habitual-','Order','Received-Document','Invoice')
            BEGIN
                IF @Context = 'Form'
                    BEGIN 
                        SELECT @IssuingPoints = 1 ,@Warehouses = 1 ,@Subcategories = 1 ,@CreditTimes = 1 ,@Taxes = 1 ,@Establishments = 1
                    END

                IF @Context = 'Filters'
                    BEGIN
                        SELECT @IssuingPoints = 1 ,@Subcategories = 1 ,@Establishments = 1 ,@DocumentStatus = 1
                    END 
            END

        IF @Module = 'Invoice'
            BEGIN
                SELECT @TaxRevenue = 1
            END

        ---> Insert data lookups
        IF @DocumentStatus = 1
            BEGIN
                INSERT INTO #LookupResults (TableName, Id, Code, [Value])
                SELECT 'DocumentStatus' as TableName
                      ,idEstadoPago     as Id
                      ,codigo           as Code
                      ,descripcion      as [Value]
                FROM dbo.EstadoPago
                WHERE codigo IN ('PFC','PA','NPA')
                  AND estado = 1
            END

        IF @Establishments = 1
            BEGIN 
                INSERT INTO #LookupResults (TableName, Id, Code, [Value] ,IsDefault, IsActive)
                SELECT 'Establishments'     AS TableName
                      ,es.idEstablecimiento AS Id
                      ,es.estab             AS Code
                      ,es.nombreComercial   AS Value
                      ,ea.predeterminado    AS IsDefault
                      ,es.estado            AS IsActive
                FROM Config.Estab_Asig         ea
                INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = ea.idEstablecimiento
                WHERE ea.idUsuarioRol = @UserRoleId
                  AND es.estado = 1
            END 


        IF @Taxes = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value] ,Metadata)
                SELECT 'Taxes'                           as TableName
                      ,idTipoIva                         as Id
                      ,CAST(codigoPorcentaje as varchar) as Code
                      ,descripcion                       as [Value]
                      ,(SELECT idImpuesto , tarifa = porcentaje FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as Metadata
                FROM dbo.TipoIva WITH (NOLOCK) 
                WHERE estado = 1
            END 

        IF @IssuingPoints = 1
            BEGIN 
                INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata ,IsDefault)
                SELECT 'IssuingPoints'     AS TableName
                        ,pe.idPuntoEmision AS Id
                        ,pe.ptoEmi         AS Value
                        ,(SELECT pe.idEstablecimiento AS establishmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                        ,pa.predeterminado AS IsDefault
                FROM Config.PtoEmi_Asig      pa
                INNER JOIN Config.Estab_Asig ea ON ea.idEstab_Asig   = pa.idEstab_Asig
                INNER JOIN dbo.PuntoEmision  pe ON pe.idPuntoEmision = pa.idPuntoEmision
                WHERE ea.idUsuarioRol = @UserRoleId
                    AND pe.estado = 1
            END 
           
        IF @Warehouses = 1
            BEGIN 
                INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata ,IsDefault)
                SELECT 'Warehouses'       AS TableName
                       ,bo.idBodega       AS Id
                       ,bo.descripcion    AS Value
                       ,(SELECT bo.idEstablecimiento AS establishmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                       ,ba.predeterminado AS IsDefault
                FROM Config.Bodeg_Asig       ba
                INNER JOIN Config.Estab_Asig ea ON ea.idEstab_Asig = ba.idEstab_Asig
                INNER JOIN dbo.Bodega        bo ON bo.idBodega     = ba.idBodega
                WHERE ea.idUsuarioRol = @UserRoleId
                    AND bo.estado = 1
            END

        IF @Subcategories = 1
            BEGIN 
                INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value])
                SELECT 'Subcategories' AS TableName
                       ,Id
                       ,Code
                       ,Name
                FROM Contabilidad.Subcategory WITH (NOLOCK)
                WHERE CompanyId = @idEntidad
                  AND [Enabled] = 1
            END 

        IF @Subcategories = 1
            BEGIN 
                INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata)
                SELECT 'CreditTimes'    AS TableName
                       ,idTiempoCredito AS Id
                       ,descripcion	    AS [Value]
	                   ,(SELECT diasCredito AS creditDays
	                            ,numeroCuota AS quotaNumber
			                    ,entrada     AS isDownPayment
                        FOR JSON PATH
	                    ) AS MetaData
                FROM dbo.TiempoCredito
                WHERE estado = 1
                  AND gestion = 0
                  AND idEntidad = @IdEntidad
            END 

        IF @TaxRevenue = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value])
                SELECT 'TaxRevenue'  as TableName
                       ,Id
                       ,Codigo       as Code
                       ,Descripcion  as [Value]
                FROM Sri.SustentoTributario WITH (NOLOCK)
                WHERE [Enabled] = 1
            END 
                    
        --> Generar lista de tablas
        SELECT @TableNames = STRING_AGG(TableName, ',') WITHIN GROUP (ORDER BY TableName) FROM (SELECT DISTINCT TableName FROM #LookupResults) AS t;

        IF @TableNames IS NULL OR @TableNames = ''
            BEGIN
                RAISERROR('Invalid Module or Context specified (no lookups found)', 16, 1);
                RETURN;
            END

        SELECT * FROM #LookupResults ORDER BY TableName,Id , DisplayOrder, Value;

        IF OBJECT_ID('tempdb..#LookupResults') IS NOT NULL DROP TABLE #LookupResults;
    END TRY
    BEGIN CATCH
        IF OBJECT_ID('tempdb..#LookupResults') IS NOT NULL DROP TABLE #LookupResults;

		--> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = 'Purchases.GetLookups'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Purchases/Lookups';

        SELECT @ErrorDetails = (
            SELECT JSON_QUERY(@Filters) AS Filters
            FOR JSON PATH
        );

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId;

    END CATCH

END
