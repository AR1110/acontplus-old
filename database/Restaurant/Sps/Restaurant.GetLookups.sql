USE [AcontPlus]
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2025-10-14
-- Description:	SP para listar datos de las ventas para un uso generico
-- =============================================
CREATE OR ALTER PROCEDURE Restaurant.GetLookups @Filters VARCHAR(MAX) = NULL
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
    DECLARE @PaymentMethodsSri BIT
           ,@CreditTimes BIT
           ,@Establishments BIT
           ,@IssuingPoints BIT
           ,@Warehouses BIT
           ,@Tables BIT
           ,@SubCategories BIT
           ,@Taxes BIT
           ,@CustomerCompany BIT
           ,@SystemConfig BIT
           ,@Users BIT
           ,@Fees BIT

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

        IF @Module = 'Order'
            BEGIN
                IF @Context = 'Form'
                    BEGIN
                          SELECT @PaymentMethodsSri = 1
                                ,@CreditTimes = 1
                                ,@Establishments = 1
                                ,@IssuingPoints = 1
                                ,@Warehouses = 1
                                ,@Tables = 1
                                ,@SubCategories = 1
                                ,@Taxes = 1
                                ,@CustomerCompany = 1
                                ,@SystemConfig = 1
                                ,@Users = 1
                                ,@Fees = 1
                    END

                IF @Context = 'Filters'
                    BEGIN
                        SELECT @Users = 1, @Tables = 1
                    END 
            END

        IF @Module = 'Item'
            BEGIN
                IF @Context = 'Form'
                    BEGIN
                        SELECT @Taxes = 1
                    END
            END

        IF @Module = 'Infrastructure'
            BEGIN
                IF @Context = 'Filters'
                    BEGIN
                        SELECT @Establishments = 1
                    END
            END

        --> Data Lookups
        IF @PaymentMethodsSri = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value], IsActive)
                SELECT 'PaymentMethodsSri' AS TableName
                      ,idFormaPagoSri      AS Id
                      ,codigo              AS Code
	                  ,descripcion         AS [Value]
                      ,estado              AS IsActive
                FROM FormaPagoSri WHERE estado = 1;
            END

        IF @CreditTimes = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata, IsActive)
                SELECT 'CreditTimes'   AS TableName
                      ,idTiempoCredito AS Id
                      ,descripcion	   AS [Value]
	                  ,(SELECT diasCredito AS creditDays
	                          ,numeroCuota AS quotaNumber
			                  ,entrada     AS isDownPayment
                        FOR JSON PATH
	                   ) AS MetaData
                      ,estado          AS IsActive
                FROM dbo.TiempoCredito
                WHERE estado = 1
                  AND gestion = 1
                  AND idEntidad = @IdEntidad;
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
                  AND es.estado = 1;
            END 

        IF @IssuingPoints = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata ,IsDefault, IsActive)
                SELECT 'IssuingPoints'   AS TableName
                      ,pe.idPuntoEmision AS Id
                      ,pe.ptoEmi         AS Value
                      ,(SELECT pe.idEstablecimiento AS establishmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                      ,pa.predeterminado AS IsDefault
                      ,pe.estado         AS IsActive
                FROM Config.PtoEmi_Asig      pa
                INNER JOIN Config.Estab_Asig ea ON ea.idEstab_Asig   = pa.idEstab_Asig
                INNER JOIN dbo.PuntoEmision  pe ON pe.idPuntoEmision = pa.idPuntoEmision
                WHERE ea.idUsuarioRol = @UserRoleId
                  AND pe.estado = 1;
            END
        
        IF @Warehouses = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata ,IsDefault, IsActive)
                SELECT 'Warehouses'      AS TableName
                      ,bo.idBodega       AS Id
                      ,bo.descripcion    AS Value
                      ,(SELECT bo.idEstablecimiento AS establishmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
                      ,ba.predeterminado AS IsDefault
                      ,bo.estado         AS IsActive
                FROM Config.Bodeg_Asig       ba
                INNER JOIN Config.Estab_Asig ea ON ea.idEstab_Asig = ba.idEstab_Asig
                INNER JOIN dbo.Bodega        bo ON bo.idBodega     = ba.idBodega
                WHERE ea.idUsuarioRol = @UserRoleId
                  AND bo.estado = 1;
            END 
        
        IF @Tables = 1
            BEGIN
                INSERT INTO #LookupResults (TableName, Id ,[Value] ,Metadata )
                SELECT 'Tables'         as TableName
                      ,tb.Id            as Id
			          ,tb.[Description] as [Value]
                      ,(SELECT ISNULL(tb.Assigned,0) as assigned
                              ,tb.RoomId             as roomId
                              ,fl.[Description]      as [floor]
                              ,fl.EstablecimientoId  as establishmentId
                              ,ro.[Description]      as room
                              ,ro.FloorId            as floorId
                       FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as Metadata
                FROM Restaurant.[Table]       tb 
                INNER JOIN Restaurant.[Room]  ro  ON ro.Id				   = Tb.RoomId
		        INNER JOIN Restaurant.[Floor] fl  ON fl.Id				   = ro.FloorId
		        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = fl.EstablecimientoId
		        WHERE es.estado = 1
		          AND es.idEntidad = @IdEntidad;
            END 
        
        IF @SubCategories = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value] ,Metadata, IsActive)
                SELECT 'SubCategories'            AS TableName
                      ,sf.idSubFamilia			  AS Id
                      ,fa.siglas                  AS Code
		              ,sf.descripcion		      AS [Value]
                      ,(SELECT ISNULL(ph.s3ObjectUrl, '') AS imagenUrl FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Metadata
                      ,sf.estado                  AS IsActive
	            FROM dbo.SubFamilia                   sf
                LEFT JOIN dbo.Familia                 fa ON fa.idFamilia = sf.idFamilia
                LEFT JOIN Inventario.SubcategoryPhoto ph ON ph.SubcategoryId = sf.idSubFamilia AND ph.IsDefault = 1
	            WHERE sf.estado = 1
                  AND sf.idEntidad = @IdEntidad
		          AND fa.siglas IN ( 'RES', 'POR')
                ORDER BY sf.idSubFamilia DESC;
            END 
        
        IF @Taxes = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value], Metadata, IsActive)
                SELECT 'Taxes'             AS TableName
                      ,ti.idTarifaImpuesto AS Id
			          ,ti.codigo           AS Code
			          ,ti.descripcion      AS [Value]
                      ,(SELECT ti.porcentaje AS [percentage] ,ti.idImpuesto AS taxId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Metadata
                      ,ti.estado           AS IsActive
	            FROM Sri.TarifaImpuesto ti
                INNER JOIN Sri.Impuesto im ON im.idImpuesto = ti.idImpuesto
	            WHERE ti.estado = 1
		          AND im.codigo = 2;
            END
        
        IF @CustomerCompany = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value] ,Metadata, IsActive)
                SELECT TOP 1 'CustomerCompany' AS TableName
                            ,cl.idCliente      AS Id
                            ,cu.IDCard         AS Code
                            ,cu.BusinessName   AS [Value]
                            ,(SELECT tradeName
                                    ,ISNULL(cl.direccion,'') AS [address]
                                    ,ISNULL(cl.correo,'')    AS [email]
                              FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Metadata
                            ,cl.estado         AS IsActive
                FROM dbo.Cliente				  cl
                INNER JOIN Customer.Customer      cu ON cu.Id = cl.CustomerId
                INNER JOIN dbo.TipoIdentificacion ti ON ti.idTipoIdentificacion = cu.IdTypeId
		        WHERE cl.estado = 1
                  AND cl.idEntidad = @IdEntidad
		          AND ti.codigoSri = '07';
            END 
        
        IF @SystemConfig = 1
            BEGIN
                INSERT INTO #LookupResults (TableName, Id, Code, [Value], Metadata)
                SELECT 'SystemConfig' AS TableName
                      ,gs.idEntidad   AS Id
                      ,'CONFIG'       AS Code
                      ,'Configuración Sistema Ventas' AS [Value]
                      ,(SELECT CAST(searchCode AS BIT)       AS searchCode,
                               CAST(printerAutomatic AS BIT) AS printerAutomatic,
                               CAST(payAutomatic AS BIT)     AS payAutomatic,
                               CAST(multipleVendedor AS BIT) AS multipleVendedor

                        FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) AS Metadata
                FROM Config.v_Sistema_Ventas gs
                WHERE gs.idEntidad = @IdEntidad;
            END 

        IF @Users = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,Value ,IsDefault, IsActive)
                SELECT 'Users'                                        AS TableName
                      ,us.idUsuario                                   AS Id
			          ,us.nombreUsuario                               AS Value
                      ,CAST(IIF(ur.idUsuario = @UserId, 1, 0) AS BIT) AS IsDefault
                      ,us.estado                                      AS IsActive
		        FROM App.UsuarioRol    ur
		        INNER JOIN dbo.Usuario us ON us.idUsuario = ur.idUsuario
                WHERE ur.idEntidad = @IdEntidad
                  AND us.estado = 1;
            END 
        
        IF @Fees = 1
            BEGIN
                INSERT INTO #LookupResults (TableName ,Id ,[Value] , IsDefault, IsActive)
                SELECT 'Fees'         AS TableName
                      ,idTarifa       AS Id
                      ,descripcion    AS [Value]
                      ,predeterminada AS IsDefault
                      ,estado         AS IsActive
                FROM dbo.Tarifa
                WHERE idEntidad = @IdEntidad AND estado = 1;
            END
        

        --> Generar lista de tablas
        SELECT @TableNames = STRING_AGG(TableName, ',') WITHIN GROUP (ORDER BY TableName) FROM (SELECT DISTINCT TableName FROM #LookupResults) AS t;

        IF @TableNames IS NULL OR @TableNames = ''
            BEGIN
                RAISERROR('Invalid Module or Context specified (no lookups found)', 16, 1);
                RETURN;
            END

        SELECT *
        FROM #LookupResults
        ORDER BY TableName,Id , DisplayOrder, Value;

        IF OBJECT_ID('tempdb..#LookupResults') IS NOT NULL DROP TABLE #LookupResults;

    END TRY

    BEGIN CATCH
        IF OBJECT_ID('tempdb..#LookupResults') IS NOT NULL DROP TABLE #LookupResults;

		--> Variables locales para el error
        DECLARE @ErrorNumber    INT            = ERROR_NUMBER()
               ,@ErrorSeverity  INT            = ERROR_SEVERITY()
               ,@ErrorState     INT            = ERROR_STATE()
               ,@ErrorProcedure NVARCHAR(128)  = 'Restaurant.GetLookups'
               ,@ErrorLine      INT            = ERROR_LINE()
               ,@ErrorMessage   NVARCHAR(4000) = ERROR_MESSAGE()
               ,@ErrorDetails   NVARCHAR(MAX)
               ,@Token          VARCHAR(300)   = NEWID()
               ,@Method         VARCHAR(200)   = 'Restaurant/Lookups';

        SELECT @ErrorDetails = (
            SELECT JSON_QUERY(@Filters) AS Filters
            FOR JSON PATH
        );

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT @Token,@Method,@ErrorNumber,@ErrorSeverity,@ErrorState,@ErrorProcedure,@ErrorLine,@ErrorMessage,GETDATE(),@UserId;

	END CATCH
END
