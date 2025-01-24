USE [Acontplus]
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
-- Create date: 8/15/2023
-- Description:	for the management of all data related to the vehicle.
-- =============================================
CREATE OR ALTER PROCEDURE Mechanical.Support_Get  
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
	DECLARE @tipo INT ,@CompanyId INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT
    
    --> Filters
    DECLARE @Id INT ,@CustomerId INT ,@UserId INT 

    -->Variables
    SELECT TOP 1 @CompanyId = idEntidad, @UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

     BEGIN TRY
            --> Get
	        IF @tipo = 1
		        BEGIN
                    DECLARE @SupportStatusId INT ,@assigned BIT ,@LicensePlate VARCHAR(50) ,@ckDate BIT ,@fromDate DATETIME2 ,@toDate DATETIME2

                    SET @tableNames = 'supports'

                    SET @params = '@CompanyId       INT 
                                  ,@UserId          INT 
                                  ,@pageSize        INT 
                                  ,@pageIndex       INT
                                  ,@SupportStatusId INT
                                  ,@CustomerId      INT
                                  ,@LicensePlate    VARCHAR(50)
                                  ,@fromDate        DATETIME2
                                  ,@toDate          DATETIME2'

                    SET @sql  = 'SELECT Id
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
                                WHERE CompanyId = @CompanyId
                                  AND [Enabled] = 1
                                  AND Deleted IS NULL '
			 
                    SELECT @pageIndex       = pageIndex
                          ,@pageSize        = pageSize
                          ,@SupportStatusId = supportStatusId
                          ,@CustomerId      = customerId
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

                    IF @SupportStatusId > 0
                        BEGIN
                            SET @sql = @sql + 'AND SupportStatusId = @SupportStatusId  ' 
                        END

                    IF @assigned = 1
                        BEGIN
                            SET @sql = @sql + 'AND UserAssignedId = @UserId '
                        END 

                    IF @CustomerId > 0 
                        BEGIN
                            SET @sql = @sql + 'AND CustomerId = @CustomerId ' 
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
                                      ,@CompanyId       = @CompanyId
                                      ,@UserId          = @UserId
							          ,@pageIndex       = @pageIndex
							          ,@pageSize        = @pageSize
                                      ,@SupportStatusId = @SupportStatusId
                                      ,@CustomerId      = @CustomerId
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

                    SELECT TOP 1 @TipoDocumentoId = idTipoDocumento FROM dbo.TipoDocumento WHERE codigo = 'SM'
			
                    SELECT idEstablecimiento as establecimientoId
                          ,nombreComercial
                     FROM v_Estab_Asign WITH (NOLOCK) 
                     WHERE idUsuarioRol = @userRoleId 
                     ORDER BY predeterminado DESC

                    SELECT ap.idEstablecimiento       as establecimientoId
                          ,ap.idPuntoEmision          as puntoEmisionId
                          ,ap.estab + '-' + ap.ptoEmi as ptoEmi
                          ,ISNULL
                          ((
                                SELECT TOP 1 (REPLICATE('0',(9-LEN(cd.ultimaSecuencia)))+CONVERT(NVARCHAR(10),cd.ultimaSecuencia)) 
                                FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK) 
                                WHERE cd.idPuntoEmision = ap.idPuntoEmision 
                                  AND cd.idTipoDocumento = @TipoDocumentoId

                          ),'0') as [sequence]
                    FROM v_PtoEmi_Asign ap WITH (NOLOCK) 
                    WHERE idUsuarioRol = @userRoleId 
                    ORDER BY defaultPtoEmi DESC

                    SELECT Id as vehicleTypeId, [Description] FROM Mechanical.VehicleType WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1

                    SELECT Id as countryId, [Description] FROM Common.Country WITH (NOLOCK) WHERE Deleted IS NULL AND [Enabled] = 1 ORDER BY [Description] ASC

                    SELECT codigoSri            as idType
                          ,descripcion          as [description] 
                          ,idTipoIdentificacion as tipoIdentificacionId
                    FROM dbo.TipoIdentificacion WITH (NOLOCK) 
                    WHERE estado = 1
                      AND codigoSri IN ('05','04','06')

                    SELECT idUsuario as UserAssignedId, nombreUsuario as UserName FROM v_usuario WITH (NOLOCK) WHERE idEntidad = @CompanyId

                    RETURN 
		        END 

            --> GET DATAFORM UPDATE O GET ID -- 
            IF @tipo = 3
                BEGIN
                    DECLARE @VehicleCompranyId INT

                    SET @tableNames = 'support,vehicle,customer,paramaters'

                    SELECT @Id = id FROM OPENJSON(@json) WITH (id INT)

                    SELECT TOP 1 @CustomerId = CustomerId, @VehicleCompranyId = VehicleCompanyId FROM Mechanical.v_Support WITH (NOLOCK) WHERE Id = @Id

                    SELECT Id
                          ,PuntoEmisionId
                          ,VehicleCompanyId
                          ,CustomerId
                          ,UserAssignedId
                          ,[Date]
                          ,Obs
                          ,[Status] AS [Status]
                    FROM Mechanical.v_Support WITH (NOLOCK)
                    WHERE Id = @Id

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
                    WHERE Id = @VehicleCompranyId

                    SELECT IDType
                          ,IDCard
                          ,BusinessName
                          ,TradeName
                          ,Email
                          ,Telephone
                          ,[Address]
                    FROM v_Cliente WITH (NOLOCK)
                    WHERE idCliente = @CustomerId

                    SELECT EstablecimientoId
                          ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence]
                    FROM Mechanical.v_Support WITH (NOLOCK)
                    WHERE Id = @Id

                    RETURN 
                END 

            --> GET SEARCH THE VEHICLE OR CUSTOMER 
            IF @tipo = 4
                BEGIN
                    DECLARE @textSearch VARCHAR(100)

                    SELECT @textSearch =  REPLACE(textSearch,SPACE(1),'%') FROM OPENJSON(@json) WITH (textSearch VARCHAR(100))

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
                    WHERE CompanyId = @CompanyId
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

            --> GET PARA LA TRANFORMACION DE DOCUMENTOS DE VENTA
            IF @tipo = 5
                BEGIN
            
                    SET @tableNames = 'comprobante,cliente,detalle,tiempoCredito,config,formapago,impuestos,vehicle,inspection'

                    SELECT @Id = id FROM OPENJSON(@json) WITH (id INT)

                    SELECT st.Id              as SupportId
                          ,st.PuntoEmisionId  as idPuntoEmision
                          ,st.UserId          as idUsuario
                          ,es.codEstab
                          ,st.Total
                    FROM Mechanical.Support        st WITH (NOLOCK)
                    INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = st.PuntoEmisionId
                    INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                    WHERE st.Id = @Id

                    SELECT cl.idCliente
                          ,cl.idTiempoCredito
                          ,cl.FormaPagoSriId                           as idFormaPagoSri
                          ,cl.idTipoIdentificacion
		                  ,cu.TradeName                                as razonSocialComprador
		                  ,cu.IDCard                                   as identificacionComprador
		                  ,ISNULL(cl.direccion, '')                    as direccionComprador
		                  ,ISNULL(cl.correo,'')                        as email
		                  ,ISNULL(cl.telefono, '')                     as telefono
		                  ,ISNULL(cl.placa+';'+ISNULL(cl.placa,''),'') as placa 
                    FROM Mechanical.Support      st WITH (NOLOCK)
                    INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = st.CustomerId
                    INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
                    WHERE st.Id = @Id

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
                            SELECT idArticulo,idBodega,fechaConsolidacion FROM Inventario.Stock st WITH (NOLOCK) WHERE st.idArticulo = md.ArticuloId AND st.idBodega = md.BodegaId FOR JSON PATH
                            ) as consolidacion
                           ,md.Obs
                    FROM Mechanical.SupportDetail md WITH (NOLOCK)
                    INNER JOIN dbo.Bodega         bo WITH (NOLOCK) ON bo.idBodega         = md.BodegaId
                    INNER JOIN dbo.Articulo       ar WITH (NOLOCK) ON ar.idArticulo       = md.ArticuloId
                    INNER JOIN Sri.TarifaImpuesto ta WITH (NOLOCK) ON ta.idTarifaImpuesto = md.TaxPercentId
                    WHERE SupportId = @Id
                      AND md.[Enabled] = 1
                      AND md.Deleted IS NULL

                    SELECT idTiempoCredito
	                      ,descripcion
	                      ,diasCredito
	                      ,numeroCuota 
                          ,entrada
	                FROM TiempoCredito WITH (NOLOCK) 
	                WHERE idEntidad = @CompanyId 
                        AND gestion = 1 
                        AND estado = 1

                    SELECT CAST(printerAutomatic AS BIT) as printerAutomatic
	                      ,CAST(payAutomatic     AS BIT) as payAutomatic
                          ,CAST(idFormaPagoSri   AS INT) as idFormaPagoSri
	                FROM Config.v_Sistema_Ventas gs
                    WHERE gs.idEntidad = @CompanyId

                    SELECT idFormaPagoSri, descripcion, codigo FROM dbo.FormaPagoSri WHERE estado = 1

                    SELECT ti.idTarifaImpuesto
                          ,ti.codigo
                          ,ti.codImpuesto
                          ,i.idImpuesto
                          ,ti.descripcion
                          ,ti.porcentaje
                          ,ti.estado 
                    FROM Sri.TarifaImpuesto ti WITH (NOLOCK)
                    INNER JOIN Sri.Impuesto  i WITH (NOLOCK)  ON i.codigo = ti.codImpuesto 
                    WHERE i.codigo = '2'
                      AND ti.estado = 1 

                    SELECT ve.LicensePlate  as placa
                          ,ve.Brand         as marca
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
                    WHERE st.Id = @Id

                    SELECT mi.Mileage   as kilometraje
                          ,mi.FuelLevel as nivelCombustible
                    FROM Mechanical.Inspection mi WITH (NOLOCK)
                    WHERE mi.SupportId = @Id


                    RETURN 
                END 
    
            --> ESTADISTICAS 
            IF @tipo = 6
                BEGIN
                    SET @tableNames = 'quantity,barchart'

                    SELECT (
                                SELECT COUNT(*) 
                                FROM Mechanical.Support 
                                WHERE [Enabled] = 1
                                  AND Deleted IS NULL
                                  AND CompanyId = @CompanyId

                           ) as quantitySupport

                          ,(
                                SELECT COUNT(*)
                                FROM Mechanical.VehicleCompany 
                                WHERE [Enabled] = 1
                                  AND Deleted IS NULL
                                  AND CompanyId = @CompanyId

                           ) as quantityVehicleCompany

                          ,(
                                SELECT COUNT(*) 
                                FROM Mechanical.Inspection
                                WHERE [Enabled] = 1
                                  AND Deleted IS NULL
                                  AND CompanyId = @CompanyId

                           ) as quantityInspection

                    SELECT st.[Name] as [Status]
                          ,COUNT(*)  as quantity
                    FROM Mechanical.Support             sp WITH (NOLOCK)
                    INNER JOIN Mechanical.SupportStatus st WITH (NOLOCK) ON st.Id = sp.SupportStatusId
                    WHERE sp.[Enabled] = 1
                      AND sp.Deleted IS NULL
                      AND sp.CompanyId = @CompanyId
                    GROUP BY st.[Name]

                    RETURN
                END 
    
            --> SupportDocument
            IF @tipo = 7
                BEGIN   
                    SET @tableNames = 'comprobante'

                    SELECT @Id = id FROM OPENJSON(@json) WITH (id INT)

                    SELECT TOP 1 td.codigo        as codDoc
                                ,td.descripcion   as tipoDocumento
                                ,sp.DocumentoId
                                ,sp.SeriesVoucher as SerieComprobante
                    FROM Mechanical.SupportDocument sp WITH (NOLOCK)
                    INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento = sp.TipoDocumentoId
                    WHERE sp.SupportId = @Id
                      AND sp.[Enabled] = 1
                      AND sp.Deleted IS NULL

                    RETURN
                END 
    
            --> FILTER 
            IF @tipo = 8
                BEGIN
            
                    SET @tableNames = 'supportStatus'

                    SELECT Id,[Name],Code FROM Mechanical.SupportStatus 
                    WHERE Deleted IS NULL 
                      AND [Enabled] = 1

                    RETURN 
                END
     END TRY 

     BEGIN CATCH 
        INSERT INTO ErroresSistema
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'Support/Get',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),dbo.ufnGetDateEcuador(),@userId
	         
        SELECT '0' as code, 'Error en el procedimiento' as 'message'
     END CATCH 

     
END
GO
