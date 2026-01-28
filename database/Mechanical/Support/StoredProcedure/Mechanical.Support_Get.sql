USE [Acontplus]
GO
/****** Object:  StoredProcedure [Mechanical].[Support_Get]    Script Date: 1/20/2026 11:11:56 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- Mechanical.Support_Get 28, '{"tipo":1}'
CREATE OR ALTER PROCEDURE [Mechanical].[Support_Get]
    @userRoleId INT
   ,@json NVARCHAR(MAX)
   ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT, @idEntidad INT, @idUsuario INT

    --> Sql
    DECLARE @params NVARCHAR(MAX), @sql NVARCHAR(MAX)

    --> Filters Global
    DECLARE @id              INT
           ,@idCustomer      INT
           ,@codEstab        VARCHAR(150)

    BEGIN TRY
        --> Recuperacion de Informacion
        SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Get
        IF @tipo = 1
            BEGIN
            --> Filters
            DECLARE @SupportStatusId INT
                   ,@assigned        BIT
                   ,@LicensePlate    VARCHAR(50)
                   ,@ckDate          BIT
                   ,@fromDate        DATETIME2
                   ,@toDate          DATETIME2

            --> Sql
            DECLARE @pageIndex INT, @pageSize INT

            SET @tableNames = 'supports'

            SET @sql = 'SELECT Id
                              ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence]
                              ,FORMAT([Date], ''dd/MM/yyyy HH:mm'')                      as [Date]
                              ,idCard
                              ,TradeName
                              ,LicensePlate
                              ,[Status]
                              ,UserAssigned
                              ,COUNT(*) OVER()                                           as [TotalRecords]
                              ,Obs
                              ,codEstab
                              ,[CodeStatus]
                              ,(SELECT TOP 1 CAST(1 as bit) FROM Mechanical.[Inspection] st WITH (NOLOCK) WHERE st.SupportId = sm.Id) as existsInsp
                        FROM Mechanical.v_Support sm WITH (NOLOCK)
                        WHERE CompanyId = @idEntidad
                          AND [Enabled] = 1
                          AND Deleted IS NULL '

            SET @params = '@idEntidad       INT
                          ,@idUsuario       INT
                          ,@pageSize        INT
                          ,@pageIndex       INT
                          ,@SupportStatusId INT
                          ,@idCustomer      INT
                          ,@LicensePlate    VARCHAR(50)
                          ,@fromDate        DATETIME2
                          ,@toDate          DATETIME2'

            SELECT @pageIndex       = pageIndex
                  ,@pageSize        = pageSize
                  ,@SupportStatusId = supportStatusId
                  ,@idCustomer      = customerId
                  ,@LicensePlate    = licensePlate
                  ,@ckDate          = ckDate
                  ,@fromDate        = fromDate
                  ,@toDate          = toDate
                  ,@assigned        = assigned
            FROM OPENJSON(@json) WITH 
            (
                pageIndex       INT
               ,pageSize        INT
               ,supportStatusId INT
               ,customerId      INT
               ,licensePlate    VARCHAR(50)
               ,ckDate          BIT
               ,fromDate        DATETIME2
               ,toDate          DATETIME2
               ,assigned        BIT
            )

            -------------------------------------------BUSQUEDA POR PARAMETRO----------------------------------------------------------------
            IF @SupportStatusId > 0
                BEGIN
                    SET @sql = @sql + 'AND SupportStatusId = @SupportStatusId '
                END

            IF @assigned = 1
                BEGIN
                    SET @sql = @sql + 'AND UserAssignedId = @idUsuario '
                END

            IF @idCustomer > 0 
                BEGIN
                    SET @sql = @sql + 'AND CustomerId = @idCustomer '
                END

            IF @LicensePlate IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND LicensePlate LIKE @LicensePlate '
                END

            IF @ckDate = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST([Date] as date) BETWEEN CAST(@fromDate as date) AND CAST(@toDate as date) '
                END

            SET @sql = @sql + 'ORDER BY Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
                              ,@params
                              ,@idEntidad       = @idEntidad
                              ,@idUsuario       = @idUsuario
                              ,@pageIndex       = @pageIndex
                              ,@pageSize        = @pageSize
                              ,@SupportStatusId = @SupportStatusId
                              ,@idCustomer      = @idCustomer
                              ,@LicensePlate    = @LicensePlate
                              ,@fromDate        = @fromDate
                              ,@toDate          = @toDate

            RETURN
        END

        --> DataForm
        IF @tipo = 2
            BEGIN
            DECLARE @TipoDocumentoId INT

            SET @tableNames = 'establishments,emissionPoints,vehicleTypes,countrys,idTypes,users'

            SELECT TOP 1
                @TipoDocumentoId = idTipoDocumento
            FROM dbo.TipoDocumento
            WHERE codigo = 'SM'

            SELECT idEstablecimiento as establecimientoId
                  ,nombreComercial
            FROM v_Estab_Asign WITH (NOLOCK)
            WHERE idUsuarioRol = @userRoleId
            ORDER BY predeterminado DESC

            SELECT ap.idEstablecimiento       as establecimientoId
                  ,ap.idPuntoEmision          as puntoEmisionId
                  ,ap.estab + '-' + ap.ptoEmi as ptoEmi
            FROM v_PtoEmi_Asign ap WITH (NOLOCK)
            WHERE idUsuarioRol = @userRoleId
            ORDER BY defaultPtoEmi DESC

            SELECT Id as vehicleTypeId, [Description]
            FROM Mechanical.VehicleType WITH (NOLOCK)
            WHERE Deleted IS NULL AND [Enabled] = 1

            SELECT Id as countryId, [Description]
            FROM Common.Country WITH (NOLOCK)
            WHERE Deleted IS NULL AND [Enabled] = 1
            ORDER BY [Description] ASC

            SELECT codigoSri            as idType
                  ,descripcion          as [description] 
                  ,idTipoIdentificacion as tipoIdentificacionId
            FROM dbo.TipoIdentificacion WITH (NOLOCK)
            WHERE estado = 1
                AND codigoSri IN ('05','04','06')

            SELECT idUsuario as UserAssignedId, nombreUsuario as UserName
            FROM v_usuario WITH (NOLOCK)
            WHERE idEntidad = @idEntidad

            RETURN
        END 

        --> Get By Id
        IF @tipo = 3
            BEGIN
            DECLARE @VehicleCompanyId INT

            SET @tableNames = 'support,vehicle,customer,paramaters'

            SELECT @id = id
            FROM OPENJSON(@json) WITH (id INT)

            SELECT TOP 1
                @idCustomer = CustomerId, @VehicleCompanyId = VehicleCompanyId
            FROM Mechanical.v_Support WITH (NOLOCK)
            WHERE Id = @id

            SELECT Id
                  ,PuntoEmisionId
                  ,VehicleCompanyId
                  ,CustomerId
                  ,UserAssignedId
                  ,[Date]
                  ,Obs
                  ,[Status] AS [Status]
            FROM Mechanical.v_Support WITH (NOLOCK)
            WHERE Id = @id

            SELECT Id
                  ,CountryId
                  ,VehicleTypeId
                  ,VehicleId 
                  ,CustomerId
                  ,LicensePlate
                  ,Brand
                  ,Model
                  ,[Year]
                  ,Color
                  ,Engine
                  ,Chassis
                  ,Cylindraje
            FROM Mechanical.v_Vehicle WITH (NOLOCK)
            WHERE Id = @VehicleCompanyId

            SELECT IDType
                  ,IDCard
                  ,BusinessName
                  ,TradeName
                  ,Email
                  ,Telephone
                  ,[Address]
            FROM v_Cliente WITH (NOLOCK)
            WHERE idCliente = @idCustomer

            SELECT EstablecimientoId
                  ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence]
            FROM Mechanical.v_Support WITH (NOLOCK)
            WHERE Id = @id

            RETURN
        END 

        --> Busqueda de vehiculos y clientes
        IF @tipo = 4
            BEGIN
            DECLARE @textSearch VARCHAR(100)

            SELECT @textSearch = REPLACE(textSearch,SPACE(1),'%')
            FROM OPENJSON(@json) WITH (textSearch VARCHAR(100))

            SET @tableNames = 'dataSearch'

            SELECT TOP 20
                vc.Id
               ,LicensePlate
               ,Brand
               ,cu.TradeName
            FROM Mechanical.VehicleCompany vc WITH (NOLOCK)
            INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente = vc.CustomerId
            INNER JOIN Mechanical.Vehicle  ve WITH (NOLOCK) ON ve.id        = vc.VehicleId
            INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
            WHERE CompanyId = @idEntidad
                AND (
                       ve.LicensePlate  LIKE '%' + @textSearch + '%'
                    OR ve.Brand         LIKE '%' + @textSearch + '%'
                    OR ve.Model         LIKE '%' + @textSearch + '%'
                    OR cu.TradeName     LIKE '%' + @textSearch + '%'
                    OR cu.BusinessName  LIKE '%' + @textSearch + '%'
                    OR cu.IDCard        LIKE '%' + @textSearch + '%'
                )

            RETURN
        END

        --> Transformacion a documentos de venta
        IF @tipo = 5
            BEGIN
            SET @tableNames = 'comprobante,cliente,detalle,tiempoCredito,config,formapago,impuestos,vehicle,inspection'

            SELECT @id = id
            FROM OPENJSON(@json) WITH (id INT)

            SELECT st.Id              as SupportId
                  ,st.PuntoEmisionId  as idPuntoEmision
                  ,st.UserId          as idUsuario
                  ,es.codEstab
                  ,st.Total
            FROM Mechanical.Support        st WITH (NOLOCK)
                INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = st.PuntoEmisionId
                INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
            WHERE st.Id = @id

            SELECT cl.idCliente
                  ,cl.idTiempoCredito
                  ,cl.FormaPagoSriId                           as idFormaPagoSri
                  ,cu.IdTypeId                                 as idTipoIdentificacion
                  ,cu.TradeName                                as razonSocialComprador
                  ,cu.IDCard                                   as identificacionComprador
                  ,ISNULL(cl.direccion, '')                    as direccionComprador
                  ,ISNULL(cl.correo,'')                        as email
                  ,ISNULL(cl.telefono, '')                     as telefono
                  ,ISNULL(cl.placa+';'+ISNULL(cl.placa,''),'') as placa
            FROM Mechanical.Support      st WITH (NOLOCK)
                INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = st.CustomerId
                INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
            WHERE st.Id = @id

            SELECT md.Id
                  ,md.ArticuloId        
                  ,md.BodegaId         
                  ,md.TarifaId          
                  ,md.MedidaId
                  ,(SELECT TOP 1 ti.idTipoIva FROM dbo.TipoIva ti WITH (NOLOCK) WHERE ti.codigoPorcentaje = ta.codigo)  as idTipoIva
                  ,(SELECT TOP 1 ti.idImpuesto FROM dbo.TipoIva ti WITH (NOLOCK) WHERE ti.codigoPorcentaje = ta.codigo) as idImpuesto
                  ,md.[Description]                       
                  ,md.Quantity          
                  ,md.Price              
                  ,md.Cost  
                  ,md.Discount
                  ,md.TaxValue
                  ,md.TaxPercentId
                  ,ta.codigo       as codePercentage
                  ,ta.porcentaje   as [percentage]  
                  ,bo.codEstab
                  ,md.Total                  
                  ,ar.llevaInventario
                  ,ar.stockMinimo
                  ,ar.stock
                  ,ar.precioSinSubsidio
                  ,ar.codigo            AS codigoArticulo
                  ,ar.codigoAuxiliar    AS codigoAuxiliar
                  ,0                    AS valorDescuento
                  ,md.[Enabled] 
                  ,md.Deleted
                  ,ISNULL
                   ((
                        SELECT af.idMedida
                              ,IIF(af.gestionVenta = 1,1,3) as orden
                              ,af.conversion
                              ,af.precioCostoFraccionado
                              ,ar.precioCosto
                              ,me.descripcion               as descripcion
                              ,(
                                    SELECT pv.idTarifa
                                          ,pv.precioVenta
                                          ,pv.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor
                                    FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
                                        INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
                                    WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
                                    ORDER BY ta.predeterminada DESC
                                    FOR JSON PATH
                               ) as tarifas
                        FROM dbo.ArticuloFraccionado af WITH (NOLOCK)
                            INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
                            INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
                        WHERE af.idArticulo = md.ArticuloId
                        FOR JSON PATH
                    ),'[]') as fraccionado
                   ,ISNULL
                    ((
                        SELECT sc.idMedida
                              ,2              as orden
                              ,1              as conversion
                              ,sc.precioCosto as precioCostoFraccionado
                              ,sc.precioCosto
                              ,me.descripcion
                              ,(
                                    SELECT ap.idTarifa
                                          ,ap.precioVenta
                                          ,ap.precioConIva
                                          ,UPPER(ta.descripcion) as tarifa
                                          ,ta.ventaPorMayor
                                    FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
                                        INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
                                    WHERE ap.idArticulo = sc.idArticulo
                                    ORDER BY ta.predeterminada DESC
                                    FOR JSON PATH
                               ) as tarifas
                        FROM dbo.Articulo     sc WITH (NOLOCK)
                            INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
                        WHERE sc.idArticulo = md.ArticuloId
                        FOR JSON PATH
                    ),'[]') as principal
                   ,(
                        SELECT idArticulo, idBodega, fechaConsolidacion
                        FROM Inventario.Stock st WITH (NOLOCK)
                        WHERE st.idArticulo = md.ArticuloId AND st.idBodega = md.BodegaId
                        FOR JSON PATH
                    ) as consolidacion
                   ,md.Obs
            FROM Mechanical.SupportDetail md WITH (NOLOCK)
                INNER JOIN dbo.Bodega         bo WITH (NOLOCK) ON bo.idBodega         = md.BodegaId
                INNER JOIN dbo.Articulo       ar WITH (NOLOCK) ON ar.idArticulo       = md.ArticuloId
                INNER JOIN Sri.TarifaImpuesto ta WITH (NOLOCK) ON ta.idTarifaImpuesto = md.TaxPercentId
            WHERE SupportId = @id
                AND md.[Enabled] = 1
                AND md.Deleted IS NULL

            SELECT idTiempoCredito
                  ,descripcion
                  ,diasCredito
                  ,numeroCuota 
                  ,entrada
            FROM TiempoCredito WITH (NOLOCK)
            WHERE idEntidad = @idEntidad
                AND gestion = 1
                AND estado = 1

            SELECT CAST(printerAutomatic AS BIT) as printerAutomatic
                  ,CAST(payAutomatic     AS BIT) as payAutomatic
                  ,CAST(idFormaPagoSri   AS INT) as idFormaPagoSri
            FROM Config.v_Sistema_Ventas gs
            WHERE gs.idEntidad = @idEntidad

            SELECT idFormaPagoSri, descripcion, codigo
            FROM dbo.FormaPagoSri
            WHERE estado = 1

            SELECT ti.idTarifaImpuesto
                  ,ti.codigo
                  ,codImpuesto = ti.codigo
                  ,i.idImpuesto
                  ,ti.descripcion
                  ,ti.porcentaje
                  ,ti.estado
            FROM Sri.TarifaImpuesto ti WITH (NOLOCK)
                INNER JOIN Sri.Impuesto  i WITH (NOLOCK) ON i.idImpuesto = ti.idImpuesto
            WHERE i.codigo = '2'
                AND ti.estado = 1

            SELECT ve.LicensePlate  as placa
                  ,ve.Brand         as marca
                  ,ve.[Model]       as modelo
                  ,ve.Chassis       as chasis
                  ,ve.Color         as color
                  ,ve.Cylindraje    as cilindraje
                  ,ve.Engine        as motor
                  ,co.[Description] as pais
            FROM Mechanical.Support              st WITH (NOLOCK)
                INNER JOIN dbo.PuntoEmision          pe WITH (NOLOCK) ON pe.idPuntoEmision = st.PuntoEmisionId
                INNER JOIN Mechanical.VehicleCompany vc WITH (NOLOCK) ON vc.Id             = st.VehicleCompanyId
                INNER JOIN Mechanical.Vehicle        ve WITH (NOLOCK) ON ve.Id             = vc.VehicleId
                INNER JOIN Common.Country            co WITH (NOLOCK) ON co.Id             = ve.CountryId
            WHERE st.Id = @id

            SELECT mi.Mileage   as kilometraje
                  ,mi.FuelLevel as nivelCombustible
            FROM Mechanical.Inspection mi WITH (NOLOCK)
            WHERE mi.SupportId = @id

            RETURN
        END 
    
        --> Estadisticas
        IF @tipo = 6
            BEGIN
            SET @tableNames = 'quantity,barchart'

            SELECT (
                        SELECT COUNT(*)
                        FROM Mechanical.Support
                        WHERE [Enabled] = 1
                            AND Deleted IS NULL
                            AND CompanyId = @idEntidad
                   ) as quantitySupport
                  ,(
                        SELECT COUNT(*)
                        FROM Mechanical.VehicleCompany
                        WHERE [Enabled] = 1
                            AND Deleted IS NULL
                            AND CompanyId = @idEntidad
                   ) as quantityVehicleCompany
                  ,(
                        SELECT COUNT(*)
                        FROM Mechanical.Inspection
                        WHERE [Enabled] = 1
                            AND Deleted IS NULL
                            AND CompanyId = @idEntidad
                   ) as quantityInspection

            SELECT st.[Name] as [Status]
                  ,COUNT(*)  as quantity
            FROM Mechanical.Support             sp WITH (NOLOCK)
                INNER JOIN Mechanical.SupportStatus st WITH (NOLOCK) ON st.Id = sp.SupportStatusId
            WHERE sp.[Enabled] = 1
                AND sp.Deleted IS NULL
                AND sp.CompanyId = @idEntidad
            GROUP BY st.[Name]

            RETURN
        END 
    
        --> Ver Documento
        IF @tipo = 7
            BEGIN
            SET @tableNames = 'comprobante'

            SELECT @id = id
            FROM OPENJSON(@json) WITH (id INT)

            SELECT TOP 1
                td.codigo        as codDoc
               ,td.descripcion   as tipoDocumento
               ,sp.DocumentoId
               ,sp.SeriesVoucher as SerieComprobante
            FROM Mechanical.SupportDocument sp WITH (NOLOCK)
                INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento = sp.TipoDocumentoId
            WHERE sp.SupportId = @id
                AND sp.[Enabled] = 1
                AND sp.Deleted IS NULL

            RETURN
        END 
    
        --> Filters
        IF @tipo = 8
            BEGIN
            SET @tableNames = 'supportStatus'

            SELECT Id, [Name], Code
            FROM Mechanical.SupportStatus
            WHERE Deleted IS NULL
                AND [Enabled] = 1

            RETURN
        END
            
        --> Serie Comprobante
        IF @tipo = 9 
            BEGIN
            DECLARE @idPuntoEmision INT

            SET @tableNames = 'sequence'

            SELECT @idPuntoEmision = idPuntoEmision
            FROM OPENJSON(@json) WITH (idPuntoEmision INT)

            SELECT serieComprobante = [Common].[ufnGetSerieDocument](cd.estab,cd.ptoEmi,secuencial,0)
            FROM Config.v_ConfigDocumento cd WITH (NOLOCK)
            WHERE cd.idPuntoEmision = @idPuntoEmision
                AND cd.codDoc = 'SM'

            RETURN
        END 

        SELECT '0' code, 'No se encontraron datos con los parametros solicitados' as 'message'

    END TRY 

    BEGIN CATCH
        
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId

        INSERT INTO dbo.ErroresSistema
        (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
        VALUES(NEWID(), '/Support/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), 'Mechanical.Support_Get', ERROR_LINE(), ERROR_MESSAGE(), GETDATE(), @idUsuario);

        THROW;
    END CATCH
END
