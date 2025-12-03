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
    DECLARE @idEntidad INT ,@UserId INT ,@UserRoleId INT

    --> Variables especiales
    DECLARE @TableNames VARCHAR(MAX) ,@Module NVARCHAR(50) ,@Context NVARCHAR(20)


    --> Tabla Temporal
    CREATE TABLE #LookupResults
    (
        TableName    NVARCHAR(128) NOT NULL
       ,Id           INT NULL
       ,Code         NVARCHAR(100) NULL
       ,[Value]      NVARCHAR(400) NULL
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
        SELECT @userRoleId = userRoleId
              ,@Module     = module
              ,@Context    = context
        FROM OPENJSON(@Filters) WITH (
            userRoleId INT
           ,module     VARCHAR(100)
           ,context    VARCHAR(100)
        )

        --IF @Module = 'Order'
            BEGIN
                SELECT TOP 1 @idEntidad = idEntidad ,@UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
            END

        --> Data Lookups
        INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value], IsActive, [Description], IsDefault)
        SELECT 'PaymentMethodsSri' as TableName
              ,idFormaPagoSri      as Id
              ,codigo              as Code
	          ,descripcion         as [Value]
              ,estado              as IsActive
              ,''                  as [Description]
              ,0                   as IsDefault
        FROM FormaPagoSri WHERE estado = 1

        INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata, IsActive, [Description], IsDefault)
        SELECT 'CreditTimes'   as TableName
              ,idTiempoCredito as Id
              ,descripcion	   as [Value]
	          ,(SELECT diasCredito as creditDays
	                  ,numeroCuota as quotaNumber
			          ,entrada     as isDownPayment
                FOR JSON PATH
	           ) as MetaData
              ,estado          as IsActive
              ,''              as [Description]
              ,0               as IsDefault
        FROM dbo.TiempoCredito
        WHERE estado = 1
          AND gestion = 1
          AND idEntidad = @idEntidad

        INSERT INTO #LookupResults (TableName, Id, Code, [Value] ,IsDefault, IsActive, [Description])
        SELECT 'Establishments'     as TableName
              ,es.idEstablecimiento as Id
              ,es.estab             as Code
              ,es.nombreComercial   as Value
              ,ea.predeterminado    as IsDefault
              ,es.estado            as IsActive
              ,''                   as [Description]
        FROM Config.Estab_Asig         ea
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = ea.idEstablecimiento
        WHERE ea.idUsuarioRol = @UserRoleId
          AND es.estado = 1

        INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata ,IsDefault, IsActive, [Description])
        SELECT 'IssuingPoints'   as TableName
              ,pe.idPuntoEmision as Id
              ,pe.ptoEmi         as Value
              ,(SELECT pe.idEstablecimiento as establishmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
              ,pa.predeterminado as IsDefault
              ,pe.estado         as IsActive
              ,''                as [Description]
        FROM Config.PtoEmi_Asig      pa
        INNER JOIN Config.Estab_Asig ea ON ea.idEstab_Asig   = pa.idEstab_Asig
        INNER JOIN dbo.PuntoEmision  pe ON pe.idPuntoEmision = pa.idPuntoEmision
        WHERE ea.idUsuarioRol = @UserRoleId
          AND pe.estado = 1

        INSERT INTO #LookupResults (TableName ,Id ,[Value] ,Metadata ,IsDefault, IsActive, [Description])
        SELECT 'Warehouses'      as TableName
              ,bo.idBodega       as Id
              ,bo.descripcion    as Value
              ,(SELECT bo.idEstablecimiento as establishmentId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
              ,ba.predeterminado as IsDefault
              ,bo.estado         as IsActive
              ,''                as [Description]
        FROM Config.Bodeg_Asig       ba
        INNER JOIN Config.Estab_Asig ea ON ea.idEstab_Asig = ba.idEstab_Asig
        INNER JOIN dbo.Bodega        bo ON bo.idBodega     = ba.idBodega
        WHERE ea.idUsuarioRol = @UserRoleId
          AND bo.estado = 1

        INSERT INTO #LookupResults (TableName, Id ,[Value] ,Metadata, IsActive, [Description], IsDefault)
        SELECT 'Tables'         as TableName
              ,tb.Id            as Id
			  ,tb.[Description] as [Value]
              ,(SELECT ISNULL(tb.Assigned,0) as assigned
                      ,fl.[Description]      as [floor]
                      ,fl.EstablecimientoId  as establishmentId
                      ,ro.[Description]      as room
                      ,ro.FloorId            as floorId
               FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as Metadata
              ,es.estado        as IsActive
              ,''               as [Description]
              ,0                as IsDefault
        FROM Restaurant.[Table]       tb
        INNER JOIN Restaurant.[Room]  ro  ON ro.Id				   = Tb.RoomId
		INNER JOIN Restaurant.[Floor] fl  ON fl.Id				   = ro.FloorId
		INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = fl.EstablecimientoId
		WHERE es.estado = 1
		  AND es.idEntidad = @idEntidad

        INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value] ,Metadata, IsActive, [Description], IsDefault)
        SELECT 'SubCategories'            as TableName
              ,sf.idSubFamilia			  as Id
              ,sf.siglaFamilia            as Code
		      ,sf.descripcion		      as [Value]
              ,(SELECT ISNULL(sf.s3ObjectUrl, '') as imagenUrl FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as Metadata
              ,sf.estado                  as IsActive
              ,''                         as [Description]
              ,0                          as IsDefault
	    FROM Inventario.v_Subfamilia  sf
	    WHERE sf.estado = 1
          AND sf.idEntidad = @idEntidad
		  AND sf.siglaFamilia IN ( 'RES', 'POR')
        ORDER BY sf.idSubFamilia DESC

        INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value], Metadata, IsActive, [Description], IsDefault)
        SELECT 'Taxes'             as TableName
              ,ti.idTarifaImpuesto as Id
			  ,ti.codigo           as Code
			  ,ti.descripcion      as [Value]
              ,(SELECT ti.porcentaje as [percentage] ,ti.idImpuesto as taxId FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as Metadata
              ,ti.estado           as IsActive
              ,''                  as [Description]
              ,0                   as IsDefault
	    FROM Sri.TarifaImpuesto ti
        INNER JOIN Sri.Impuesto im ON im.idImpuesto = ti.idImpuesto
	    WHERE ti.estado = 1
		  AND im.codigo = 2

        INSERT INTO #LookupResults (TableName ,Id ,Code ,[Value] ,Metadata, IsActive, [Description], IsDefault)
        SELECT TOP 1 'CustomerCompany' as TableName
                    ,cl.idCliente      as Id
                    ,cu.IDCard         as Code
                    ,cu.BusinessName   as [Value]
                    ,(SELECT tradeName
                            ,ISNULL(cl.direccion,'') as [address]
                            ,ISNULL(cl.correo,'')    as [email]
                      FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as Metadata
                    ,cl.estado         as IsActive
                    ,''                as [Description]
                    ,0                 as IsDefault
        FROM dbo.Cliente				  cl
        INNER JOIN Customer.Customer      cu ON cu.Id = cl.CustomerId
        INNER JOIN dbo.TipoIdentificacion ti ON ti.idTipoIdentificacion = cu.IdTypeId
		WHERE cl.estado = 1
          AND cl.idEntidad = @idEntidad
		  AND ti.codigoSri = '07'

        INSERT INTO #LookupResults (TableName, Id, Code, [Value], Metadata, IsActive, [Description], IsDefault)
        SELECT 'SystemConfig' as TableName
              ,gs.idEntidad   as Id
              ,'CONFIG'       as Code
              ,'Configuración Sistema Ventas' as [Value]
              ,(SELECT CAST(searchCode AS BIT)       as searchCode,
                       CAST(printerAutomatic AS BIT) as printerAutomatic,
                       CAST(payAutomatic AS BIT)     as payAutomatic,
                       CAST(multipleVendedor AS BIT) as multipleVendedor

                FOR JSON PATH, WITHOUT_ARRAY_WRAPPER) as Metadata
              ,1              as IsActive
              ,''             as [Description]
              ,0              as IsDefault
        FROM Config.v_Sistema_Ventas gs
        WHERE gs.idEntidad = @idEntidad

        INSERT INTO #LookupResults (TableName ,Id ,Value ,IsDefault, IsActive, [Description])
        SELECT 'Users'                                        as TableName
              ,us.idUsuario                                   as Id
			  ,us.nombreUsuario                               as UserName
              ,CAST(IIF(ur.idUsuario = @UserId, 1, 0) AS bit) as IsDefault
              ,us.estado                                      as IsActive
              ,''                                             as [Description]
		FROM App.UsuarioRol    ur
		INNER JOIN dbo.Usuario us ON us.idUsuario = ur.idUsuario
        WHERE ur.idEntidad = @idEntidad
          AND us.estado = 1

        INSERT INTO #LookupResults (TableName ,Id ,[Value] , IsDefault, IsActive, [Description])
        SELECT 'Fees'         as TableName
              ,idTarifa       as Id
              ,descripcion    as [Value]
              ,predeterminada as IsDefault
              ,estado         as IsActive
              ,''             as [Description]
        FROM dbo.Tarifa
        WHERE idEntidad = @idEntidad AND estado = 1

       -- Generar lista de tablas
        SELECT @TableNames = STRING_AGG(TableName, ',') WITHIN GROUP (ORDER BY TableName) FROM (SELECT DISTINCT TableName FROM #LookupResults) AS t;

        IF @TableNames IS NULL OR @TableNames = ''
            BEGIN
                RAISERROR('Invalid Module or Context specified (no lookups found)', 16, 1);
                RETURN;
            END

        SELECT *
        FROM #LookupResults
        ORDER BY TableName,Id , DisplayOrder, Value

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
               ,@Method         VARCHAR(200)   = 'Restaurant/Lookups'

        SELECT @ErrorDetails = (
            SELECT JSON_QUERY(@Filters) AS Filters
            FOR JSON PATH
        );

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ApiRestaurant/Lookups',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),'Restaurant.GetLookups',ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@UserId

	END CATCH
END
