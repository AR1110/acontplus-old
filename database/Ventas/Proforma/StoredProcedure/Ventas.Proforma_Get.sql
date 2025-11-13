USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Proforma_Get]    Script Date: 1/27/2023 3:40:32 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Proforma_Get @userRoleId INT, @json NVARCHAR(MAX), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT, @idEntidad INT, @idUsuario INT

    --> Sql
    DECLARE @params NVARCHAR(MAX), @sql NVARCHAR(MAX), @pageIndex INT, @pageSize INT

    --> Filters
    DECLARE @id INT
           ,@checkBoxFecha BIT
           ,@codEstab VARCHAR(25)
           ,@codEstado VARCHAR(20)
           ,@idPuntoEmision INT
           ,@idCliente INT
           ,@fechaInicio DATETIME2
           ,@fechaFin DATETIME2
           ,@secuencial VARCHAR(50)

    --> Recupera informacion 
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    -- Get
    IF @tipo = 1
        BEGIN
            SET @params = '@idEntidad       INT
                          ,@idCliente       INT
                          ,@idUsuario       INT
                          ,@codEstab        VARCHAR(25)
                          ,@fechaInicio     DATETIME2
                          ,@fechaFin        DATETIME2
                          ,@pageSize        INT
                          ,@pageIndex       INT
                          ,@idPuntoEmision  INT'

            SET @sql = 'SELECT en.razonSocial                                                   as entidad
                              ,es.codEstab                                                      as codEstab
                              ,pr.idProforma                                                    as idProforma
                              ,pr.idProforma                                                    as idDocumento
                              ,pr.idTipoDocumento                                               as idTipoDocumento
                              ,pr.idCliente                                                     as idCliente
                              ,es.nombreComercial                                               as nombreComercial
                              ,ISNULL(es.telefono, '''')                                        as telefonoEstablecimiento
                              ,ISNULL(cl.correo, '''')                                          as correo
                              ,FORMAT(pr.fechaEmision, ''dd/MM/yyyy HH:mm'')                    as fechaEmision
                              ,pr.total                                                         as total
                              ,dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi, pr.nroDocumento) as nroDocumento
                              ,cu.BusinessName                                                  as nombreFiscal
                              ,cu.IDCard                                                        as nroIdentificacion
                              ,ISNULL(cl.telefono, '''')                                        as telefono
                              ,us.nombreUsuario                                                 as usuario
                              ,ep.descripcion                                                   as estadoDoc
                              ,''09''                                                           as codDoc
                              ,IIF(ep.codigo = ''A'', ''table-danger'', '''')                   as rowColor
                              ,ep.codigo                                                        as codEstado
                              ,COUNT(*) OVER()                                                  as totalRecords
                              ,SUM(pr.total) OVER()                                             as totalDocument
                        FROM dbo.Proforma              pr WITH (NOLOCK)
                        INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = pr.idPuntoEmision
                        INNER JOIN dbo.Cliente         cl WITH (NOLOCK) ON cl.idCliente         = pr.idCliente
                        INNER JOIN dbo.Usuario         us WITH (NOLOCK) ON us.idUsuario         = pr.idUsuario
                        INNER JOIN dbo.EstadoPago      ep WITH (NOLOCK) ON ep.idEstadoPago      = pr.idEstadoDocumento
                        INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                        INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
                        INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad         = es.idEntidad
                        WHERE pr.estado = 1 
                          AND es.idEntidad = @idEntidad '

            SELECT @checkBoxFecha  = checkBoxFecha
                  ,@codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
                  ,@idCliente      = byCliente
                  ,@idUsuario      = byUsuario
                  ,@fechaInicio    = fechaInicio
                  ,@fechaFin       = fechaFin
                  ,@secuencial     = LTRIM(RTRIM(nroSecuencial))
                  ,@pageSize       = pageSize
                  ,@pageIndex      = pageIndex
                  ,@codEstado      = codEstado
            FROM OPENJSON(@json) WITH
            (        
                 checkBoxFecha  BIT 
                ,codEstab       VARCHAR(25) 
                ,idPuntoEmision INT 
                ,byCliente      INT
                ,byUsuario      INT  
                ,fechaInicio    DATETIME2
                ,fechaFin       DATETIME2
                ,nroSecuencial  VARCHAR(50) 
                ,pageIndex      INT
                ,pageSize       INT 
                ,codEstado      VARCHAR(10)
            )

            IF EXISTS (SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @userRoleId AND viewOthersDocs = 0) 
                BEGIN
                    SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId
                END

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND es.codEstab = @codEstab '
                END

            IF @idPuntoEmision > 0 
                BEGIN
                    SET @sql = @sql + 'AND pr.idPuntoEmision = @idPuntoEmision '
                END

            IF @secuencial IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND pr.nroDocumento BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
                END

            IF @idCliente > 0 
                BEGIN
                    SET @sql = @sql + 'AND pr.idCliente = @idCliente '
                END

            IF @checkBoxFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(pr.fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) '
                END

            IF @codEstado IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND ep.codigo IN (''AC'') '
                END

            IF @idUsuario > 0
                BEGIN
                    SET @sql = @sql + 'AND pr.idUsuario = @idUsuario '
                END

            SET @sql = @sql + 'ORDER BY pr.idProforma DESC OFFSET @pageSize * (@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '

            SET @tableNames='proformaInvoices'
            EXEC sp_executesql 
                         @sql
                        ,@params 
                        ,@idEntidad      = @idEntidad
                        ,@idCliente      = @idCliente
                        ,@idUsuario      = @idUsuario
                        ,@codEstab       = @codEstab
                        ,@idPuntoEmision = @idPuntoEmision
                        ,@fechaInicio    = @fechaInicio
                        ,@fechaFin       = @fechaFin
                        ,@pageIndex      = @pageIndex
                        ,@pageSize       = @pageSize
                        
            RETURN
        END

    -- Data Form 
    IF @tipo = 2
        BEGIN

            SET @tableNames = 'decimalSettings,taxPercentages,fees,creditTimes,defaultProduct,defaultCustomer,salesConfig,users,estabEmissionPoints,estabWarehouses,documentConfig'


            DECLARE @existePoliticaVenta BIT = 0
                   ,@codRol VARCHAR(50)

            SELECT TOP 1 @codRol = codRol FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

            SELECT nroPrecio
                  ,nroCantidad
                  ,nroIva
                  ,nroDescuentoDetalle
                  ,nroTotalDetalle
                  ,nroTotalSubTotal
                  ,nroDescuento
                  ,nroIce
                  ,importeTotal
            FROM Config.v_Sistema_Decimal WITH (NOLOCK)
            WHERE codTrasaccion = 'V'
              AND idEntidad = @idEntidad

            SELECT idTipoIva
                  ,idImpuesto
                  ,descripcion
                  ,tarifa = porcentaje
                  ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
            FROM dbo.TipoIva WITH (NOLOCK)
            WHERE estado = 1

            SELECT idTarifa
                  ,descripcion
                  ,predeterminada
                  ,codigo
            FROM Tarifa WITH (NOLOCK)
            WHERE idEntidad = @idEntidad
              AND estado = 1

            SELECT idTiempoCredito
                  ,descripcion
                  ,diasCredito
                  ,numeroCuota
            FROM TiempoCredito WITH (NOLOCK)
            WHERE idEntidad = @idEntidad
              AND gestion = 1
              AND estado = 1

            SELECT a.idArticulo
                  ,a.codigo
                  ,a.descripcion
            FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN Articulo           a WITH (NOLOCK) ON a.idArticulo = gs.idArticulo
            WHERE gs.idEntidad = @idEntidad

            SELECT cl.idCliente
                  ,cu.IDCard       as numeroIdentificacion
                  ,cu.TradeName    as nombreComercial
                  ,cu.BusinessName as nombreFiscal
                  ,cl.direccion
                  ,cl.correo
            FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = gs.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
            WHERE gs.idEntidad = @idEntidad

            SELECT CAST(searchCode AS BIT)       as searchCode
                  ,CAST(multipleVendedor AS BIT) as multipleVendedor
                  ,detailDuplicate
            FROM Config.v_Sistema_Ventas gs
            WHERE gs.idEntidad = @idEntidad

            -- Verificamos si se cumple la política de múltiple vendedor para el documento de venta
            IF EXISTS (SELECT 1 FROM Config.v_Sistema_Ventas WHERE idEntidad = @idEntidad AND multipleVendedor = 1 AND @codRol = 'VEN')
                BEGIN
                    SET @existePoliticaVenta = 1;
                END;

            SELECT u.idUsuario
                  ,u.nombreUsuario
                  ,u.nombreCompleto
                  ,predeterminado = CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
            FROM v_usuario u
            WHERE u.idEntidad = @idEntidad
              AND u.estadoUsuario = 1
              AND (@existePoliticaVenta = 0 OR u.codRol NOT IN ('ADM'));

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi
            FROM v_PtoEmi_Asign WITH(NOLOCK)
            WHERE idUsuarioRol = @userRoleId
            ORDER BY defaultEstab DESC

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idBodega
                  ,bodega
                  ,defaultEstab
                  ,defaultBodega
            FROM v_Bodega_Asign WITH(NOLOCK)
            WHERE idUsuarioRol = @userRoleId
            ORDER BY defaultEstab DESC

            SELECT cd.idPuntoEmision
                  ,cd.infoAdicional
            FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
            INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento
            INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND td.codigo = 'PR'
              AND cd.infoAdicional IS NOT NULL

            RETURN
        END

    -- Filters
    IF @tipo = 3
        BEGIN
            SET @tableNames='estabs'
            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idPuntoEmision
                  ,estab + '-' + ptoEmi as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi
            FROM v_PtoEmi_Asign WITH(NOLOCK)
            WHERE idUsuarioRol = @userRoleId
            ORDER BY defaultEstab DESC

            RETURN
        END

    -- Get Id
    IF @tipo = 4 
        BEGIN
            SET @tableNames='header,customer,details,additionalsInfo,taxes'
            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT es.nombreComercial
                  ,Common.ufnGetSerieDocument(es.estab,pe.ptoEmi,pr.nroDocumento,0) as serieComprobante
                  ,pr.fechaEmision  as fechaEmision
                  ,subTotalSinImpuestos
                  ,totalDescuento
                  ,porcentajeDescuento
                  ,propina
                  ,recargo
                  ,transporte
                  ,total
                  ,ISNULL(observacion, '')      as observacion
                  ,pr.idCliente
            FROM Proforma                  pr WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = pr.idPuntoEmision
            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
            WHERE pr.idProforma = @id

            SELECT cu.BusinessName as razonSocialComprador
                  ,cu.IDCard       as identificacionComprador
                  ,cl.direccion    as direccionComprador
                  ,cl.correo
            FROM dbo.Proforma            pr WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = pr.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
            WHERE pr.idProforma = @id

            SELECT pd.idProformaDetalle
                  ,ar.codigo 
                  ,pd.descripcion
                  ,pd.cantidad
                  ,me.descripcion as medida
                  ,ti.descripcion as tipoIva
                  ,ta.descripcion as pvp
                  ,pd.precioUnitario 
                  ,pd.precioTotalSinImpuesto
                  ,pd.nota
                  ,bo.descripcion as bodega
                  ,pd.valorImpuesto
                  ,pd.valorDescuento
                  ,pd.porcentajeDescuento
                  ,pd.ice
                  ,pd.codigoPorcentaje
                  ,pd.tarifa
            FROM dbo.ProformaDetalle pd WITH (NOLOCK)
            INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idArticulo = pd.idArticulo
            INNER JOIN dbo.Medida    me WITH (NOLOCK) ON me.idMedida   = pd.idMedida
            INNER JOIN dbo.TipoIva   ti WITH (NOLOCK) ON ti.idTipoIva  = pd.idTipoIva
            INNER JOIN dbo.Tarifa    ta WITH (NOLOCK) ON ta.idTarifa   = pd.idTarifa
            INNER JOIN dbo.Bodega    bo WITH (NOLOCK) ON bo.idBodega   = pd.idBodega
            WHERE pd.idProforma = @id
            ORDER BY idProformaDetalle ASC

            SELECT  nombre as name, valor as value  FROM dbo.InfoAdicionalDoc idd
            WHERE idComprobante = @id

            SELECT idTipoIva
                  ,idImpuesto
                  ,descripcion
                  ,tarifa = porcentaje
                  ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
            FROM dbo.TipoIva WITH (NOLOCK)
            WHERE estado = 1

            RETURN
        END

    -- Serie Comprobante
    IF @tipo = 5
        BEGIN
            SELECT @idPuntoEmision = idPuntoEmision FROM OPENJSON(@json) WITH (idPuntoEmision INT)

            SELECT serieComprobante = [Common].[ufnGetSerieDocument](cd.estab,cd.ptoEmi,secuencial,0)
            FROM Config.v_ConfigDocumento cd WITH (NOLOCK)
            WHERE cd.idPuntoEmision = @idPuntoEmision
              AND cd.codDoc = 'PR'

            RETURN
        END

    -- Detalle para Apro.Ventas
    IF @tipo = 6
        BEGIN
            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT pd.idProformaDetalle
                  ,pd.idArticulo
                  ,pd.idBodega
                  ,pd.idTarifa
                  ,pd.idTipoIva
                  ,ti.idImpuesto
                  ,pd.idMedida
                  ,a.codigo
                  ,pd.descripcion
                  ,pd.cantidad
                  ,pd.precioUnitario
                  ,pd.valorDescuento
                  ,pd.porcentajeDescuento
                  ,pd.ice
                  ,pd.precioTotalSinImpuesto
                  ,pd.codigoPorcentaje
                  ,pd.tarifa
                  ,pd.valorImpuesto
                  ,pd.nota
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
                        WHERE af.idArticulo = pd.idArticulo
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
                        WHERE sc.idArticulo = pd.idArticulo
                        FOR JSON PATH

                   ),'[]') as principal
                  ,a.llevaInventario
                  ,pr.fechaEmision
                  ,a.precioCosto
            FROM ProformaDetalle     pd WITH (NOLOCK)
            INNER JOIN dbo.Articulo   a WITH (NOLOCK) ON pd.idArticulo = a.idArticulo
            INNER JOIN dbo.Proforma  pr WITH (NOLOCK) ON pr.idProforma = pd.idProforma
            LEFT JOIN dbo.Medida    me WITH (NOLOCK) ON me.idMedida   = pd.idMedida
            LEFT JOIN dbo.TipoIva   ti WITH (NOLOCK) ON ti.idTipoIva  = pd.idTipoIva
            WHERE pd.idProforma = @id
              AND pd.estado = 1

            RETURN
        END

    -- Ver historial de Conversion
    IF @tipo = 7
        BEGIN
            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            IF EXISTS (SELECT 1 FROM Ventas.ProformaDocumento WITH (NOLOCK) WHERE ProformaId = @id AND Estado = 1)
                BEGIN
                    SELECT 'Conversión'                                    as metodoConversion
                          ,FORMAT(pd.FechaRegistro,'dd/MM/yyyy HH:mm')     as fechaRegistro
                          ,us.nombreUsuario                                as usuario
                          ,pd.SerieComprobante                             as serieComprobante
                          ,td.codigo                                       as codDoc
                    FROM Ventas.ProformaDocumento pd WITH (NOLOCK)
                    INNER JOIN dbo.TipoDocumento  td WITH (NOLOCK) ON td.idTipoDocumento = pd.TipoDocumentoId
                    INNER JOIN dbo.Usuario        us WITH (NOLOCK) ON us.idUsuario       = pd.UsuarioId
                    WHERE pd.ProformaId = @id
                      AND pd.Estado = 1
                END 
            ELSE 
                BEGIN
                    SELECT 'Aprobación'								                                                                                  as metodoConversion
                          ,FORMAT(CASE WHEN ep.codigo = 'PE' THEN ad.fechaEmision ELSE au.fechaRegistro END, 'dd/MM/yyyy HH:mm')                      as fechaRegistro
                          ,CASE WHEN ep.codigo = 'PE' THEN us.nombreUsuario ELSE ua.nombreUsuario END                                                 as usuario
                          ,CASE WHEN ep.codigo = 'PE' THEN ad.serieComprobante ELSE IIF(au.idFactura > 0,de.serieComprobante,ne.serieComprobante) END as serieComprobante
                          ,CASE WHEN ep.codigo = 'PE' THEN 'PF' ELSE td.codigo END                                                                    as codDoc
                    FROM Ventas.Aprob_Document_Hist        ah WITH (NOLOCK)
                    INNER JOIN Ventas.Aprob_Document       ad WITH (NOLOCK) ON ad.idAprob_Document       = ah.idAprob_Document
                    INNER JOIN dbo.Usuario		           us WITH (NOLOCK) ON us.idUsuario              = ad.idUsuario
                    INNER JOIN dbo.EstadoPago              ep WITH (NOLOCK) ON ep.idEstadoPago           = ad.idEstadoDocumento
                    INNER JOIN dbo.TipoDocumento           td WITH (NOLOCK) ON td.idTipoDocumento        = ad.idTipoDocumento
                     LEFT JOIN Ventas.Aprob_Document_Audit au WITH (NOLOCK) ON au.idAprob_Document       = ad.idAprob_Document
                     LEFT JOIN dbo.Factura                 fe WITH (NOLOCK) ON fe.idFactura              = au.idFactura
                     LEFT JOIN dbo.NotaEntrega             ne WITH (NOLOCK) ON ne.idNotaEntrega          = au.idNotaEntrega
                     LEFT JOIN dbo.Usuario                 ua WITH (NOLOCK) ON ua.idUsuario              = au.idUsuario
                     LEFT JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = fe.idDocumentoElectronico
                    WHERE ah.idProforma = @id
                END
                
            RETURN
        END

    -- DataForm Conversion
    IF @tipo = 8
        BEGIN
            SELECT idTiempoCredito
                  ,descripcion
                  ,diasCredito
                  ,numeroCuota
            FROM TiempoCredito WITH (NOLOCK)
            WHERE idEntidad = @idEntidad 
              AND gestion = 1 
              AND estado = 1

            SELECT CAST(idFormaPagoSri   AS INT)  as idFormaPagoSri
                  ,CAST(multipleVendedor AS BIT) as multipleVendedor
            FROM Config.v_Sistema_Ventas gs
            WHERE gs.idEntidad = @idEntidad

            SELECT idFormaPagoSri
                  ,descripcion
                  ,codigo
            FROM dbo.FormaPagoSri
            WHERE estado = 1

            SELECT u.idUsuario
                  ,u.nombreUsuario
                  ,u.nombreCompleto
                  ,predeterminado = CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
            FROM v_usuario u
            WHERE u.idEntidad = @idEntidad

            RETURN
        END

    SELECT '0'code, 'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN
END
