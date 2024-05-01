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
    DECLARE @Id INT ,@CustomerId INT ,@VehicleCompranyId INT ,@textSearch VARCHAR(100) ,@UserId INT ,@Status INT ,@assigned BIT

    -->Variables
    SELECT TOP 1 @CompanyId = idEntidad, @UserId = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get
	IF @tipo = 1
		BEGIN
            SET @tableNames = 'supports'

            SET @params = '@CompanyId INT 
                          ,@UserId    INT 
                          ,@pageSize  INT 
                          ,@pageIndex INT
                          ,@Status    INT'

            SET @sql  = 'SELECT Id
                               ,[Common].[ufnGetSerieDocument](estab,ptoEmi,[Sequence],0) as [Sequence]
                               ,FORMAT([Date], ''dd/MM/yyyy HH:mm'') as [Date]
                               ,idCard
                               ,TradeName
                               ,LicensePlate
                               ,CASE [Status] WHEN 0 THEN ''PENDIENTE'' 
                                              WHEN 1 THEN ''REVISIÓN''
                                              WHEN 2 THEN ''FINALIZADO''
                                              WHEN 3 THEN ''PROCESADO''
                                              WHEN 5 THEN ''ANULADO''
                                END as [Status]
                               ,CASE [Status] WHEN 5 THEN ''table-danger'' 
                                              WHEN 2 THEN ''table-success''
                                              ELSE '''' 
                                END as ColorRow 
                               ,UserAssigned
                               ,COUNT(*) OVER() AS [TotalRecords]
                               ,Obs
                               ,codEstab
                               ,[Status]        AS TypeStatus
                        FROM Mechanical.v_Support WITH (NOLOCK)
                        WHERE CompanyId = @CompanyId '
			 
            SELECT @pageIndex = pageIndex
                  ,@pageSize  = pageSize
                  ,@Status    = [status]
            FROM OPENJSON(@json) WITH 
            (
                pageIndex INT
               ,pageSize  INT
               ,[status]  BIT
            )

            IF @Status >= 0
                BEGIN
                    SET @sql = @sql + 'AND [Status] = @Status ' 
                END

            IF @assigned = 1
                BEGIN
                    SET @sql = @sql + 'AND UserAssignedId = @UserId '
                END 

            SET @sql = @sql + 'ORDER BY Id DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '
            
            EXEC sp_executesql @sql
							  ,@params
                              ,@CompanyId = @CompanyId
                              ,@UserId    = @UserId
							  ,@pageIndex = @pageIndex
							  ,@pageSize  = @pageSize
                              ,@Status    = @Status

            RETURN
		END

    -->DataForm 
	IF @tipo = 2
		BEGIN
			SET @tableNames = 'establishments,emissionPoints,vehicleTypes,countrys,idTypes,users'
			
            SELECT idEstablecimiento as establecimientoId
                  ,nombreComercial
             FROM v_Estab_Asign WITH (NOLOCK) 
             WHERE idUsuarioRol = @userRoleId 
             ORDER BY predeterminado DESC

            SELECT ap.idEstablecimiento       as establecimientoId
                  ,ap.idPuntoEmision          as puntoEmisionId
                  ,ap.estab + '-' + ap.ptoEmi as ptoEmi
                  ,(
                        SELECT (REPLICATE('0',(9-LEN(COUNT(*)+1)))+CONVERT(NVARCHAR(10),COUNT(*)+1)) 
                        FROM Mechanical.Support ms 
                        WHERE ms.PuntoEmisionId = ap.idPuntoEmision

                   ) as sequence
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

    ---- GET DATAFORM UPDATE O GET ID -- 
    IF @tipo = 3
        BEGIN
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

    -- GET SEARCH THE VEHICLE OR CUSTOMER 
    IF @tipo = 4
        BEGIN
            SELECT @textSearch =  REPLACE(textSearch,SPACE(1),'%') FROM OPENJSON(@json) WITH (textSearch VARCHAR(100))

            SET @tableNames = 'dataSearch'

            SELECT TOP 20 
                   vc.Id
                  ,LicensePlate
                  ,Brand
                  ,cl.nombreFiscal as TradeName
            FROM Mechanical.VehicleCompany vc WITH (NOLOCK) 
            INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente = vc.CustomerId
            INNER JOIN Mechanical.Vehicle  ve WITH (NOLOCK) ON ve.id        = vc.VehicleId
            WHERE CompanyId = @CompanyId
              AND (
                   ve.LicensePlate          LIKE '%' + @textSearch + '%'
                OR ve.Brand                 LIKE '%' + @textSearch + '%'
                OR ve.Model                 LIKE '%' + @textSearch + '%'
                OR cl.numeroIdentificacion  LIKE '%' + @textSearch + '%'
                OR cl.nombreComercial       LIKE '%' + @textSearch + '%'
                OR cl.nombreFiscal          LIKE '%' + @textSearch + '%'
                  )   

            RETURN 

        END

    --> GET PARA LA TRANFORMACION DE DOCUMENTOS DE VENTA
    IF @tipo = 5
        BEGIN
            
            SET @tableNames = 'comrpobante,cliente,detalle'

            SELECT @Id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT st.Id              as SupportId
                  ,st.PuntoEmisionId  as idPuntoEmision
                  ,st.UserId          as idUsuario
                  ,pe.codEstab
            FROM Mechanical.Support     st WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON pe.idPuntoEmision = st.PuntoEmisionId
            WHERE Id = @Id

            SELECT cl.idCliente
                  ,cl.idTiempoCredito
                  ,cl.FormaPagoSriId                           as idFormaPagoSri
                  ,cl.idTipoIdentificacion
		          ,cl.nombreFiscal
		          ,cl.numeroIdentificacion
		          ,ISNULL(cl.direccion, '')                    as direccion
		          ,ISNULL(cl.correo,'')                        as correo
		          ,ISNULL(cl.telefono, '')                     as telefono
		          ,ISNULL(cl.placa+';'+ISNULL(cl.placa,''),'') as placa 
            FROM Mechanical.Support     st WITH (NOLOCK)
            INNER JOIN dbo.Cliente      cl WITH (NOLOCK) ON cl.idCliente = st.CustomerId
            WHERE Id = @Id

            SELECT md.Id
                  ,md.ArticuloId        
                  ,md.BodegaId         
                  ,md.TarifaId          
                  ,md.MedidaId         
                  ,md.[Description]                       
                  ,md.Quantity          
                  ,md.Price              
                  ,md.Cost              
                  ,md.CodePercentage
                  ,md.[Percentage]     
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
            FROM Mechanical.SupportDetail md WITH (NOLOCK)
            INNER JOIN dbo.Bodega         bo WITH (NOLOCK) ON bo.idBodega   = md.BodegaId
            INNER JOIN dbo.Articulo       ar WITH (NOLOCK) ON ar.idArticulo = md.ArticuloId
            WHERE SupportId = @Id
              AND md.[Enabled] = 1
              AND md.Deleted IS NULL

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

            SELECT CASE [Status] WHEN 0 THEN 'Por Asignar' 
                                 WHEN 1 THEN 'En proceso'
                                 WHEN 2 THEN 'Por Entregar'
                                 WHEN 4 THEN 'Entregado'
                                        ELSE 'Anulado' 
                   END      as [Status]
                  ,COUNT(*) as quantity
            FROM Mechanical.Support 
            WHERE [Enabled] = 1
              AND Deleted IS NULL
              AND CompanyId = @CompanyId
            GROUP BY [Status]
            

            RETURN
        END 
END
GO
