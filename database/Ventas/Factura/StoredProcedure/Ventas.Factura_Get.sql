USE [AcontPlus]
GO
-- Ventas.Factura_Get 28, '{"tipo":5 }'
CREATE OR ALTER PROCEDURE Ventas.Factura_Get
    @userRoleId INT,
    @json NVARCHAR(MAX),
    @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@idUsuario INT

    --> Sql
    DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX)

    --> Filters Global
    DECLARE @id             INT
           ,@idPuntoEmision INT 
           ,@idCliente      INT 
           ,@codEstab       VARCHAR(150)
           ,@codRol         VARCHAR(50)

    BEGIN TRY
        --> Recuperacion de Informacion
	    SELECT @tipo = tipo
    FROM OPENJSON(@json) WITH (tipo INT)

	    SELECT TOP 1 @idEntidad  = idEntidad , @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId

	    --> Get 
	    IF @tipo = 1
		    BEGIN
        --> Filters
        DECLARE @checkBoxFecha   BIT 
                       ,@codDoc          VARCHAR(20) 
                       ,@idEstadoPago    INT 
	                   ,@fechaInicio     DATETIME2 
                       ,@fechaFin        DATETIME2 
                       ,@secuencial      VARCHAR(50) 
                       ,@infoAdicional   VARCHAR(100)

        --> Sql
        DECLARE @pageIndex INT ,@pageSize INT

        SET @sql = 'SELECT fe.idCuentaPorCobrar
                          ,fe.idDocumentoElectronico
                          ,fe.idFactura							         as idDocumento
                          ,fe.codEstab
                          ,FORMAT(fe.fechaEmision, ''dd/MM/yyyy HH:mm'') as fechaEmision
                          ,FORMAT(fe.fechaVencimiento, ''dd/MM/yyyy'')   as fechaVencimiento
                          ,fe.serieComprobante						     
                          ,fe.razonSocialComprador                       as nombreFiscal
                          ,fe.identificacionComprador
                          ,fe.estadoCuenta							     as estadoFinanciero
                          ,CAST(fe.total as numeric(18,2))               as total 									     
                          ,CAST(fe.abono as numeric(18,2))               as abono
                          ,CAST(fe.saldo as numeric(18,2))               as saldo
                          ,fe.codEstado                                  as estadoSri                              
                          ,fe.usuario              
                          ,fe.tipoTiempoCredito                          as tiempoCredito
                          ,fe.codCuenta                                  as codEstado
                          ,COUNT(*) OVER()                               as totalRecords
                    FROM Ventas.v_Factura fe WITH (NOLOCK)
                    WHERE fe.idEntidad = @idEntidad '

        SET @params = '@idEntidad       INT
						      ,@codEstab        VARCHAR(150)
						      ,@idCliente       INT
						      ,@idEstadoPago    INT
						      ,@idUsuario       INT
						      ,@fechaE          DATETIME
						      ,@fechaF          DATETIME
						      ,@pageSize        INT
						      ,@pageIndex       INT
                              ,@idPuntoEmision  INT
                              ,@infoAdicional   VARCHAR(300)'

        SELECT @checkBoxFecha  = checkBoxFecha
				      , @idCliente      = byCliente
				      , @idEstadoPago   = byEstado
				      , @idUsuario      = idUsuario
				      , @codEstab       = codEstab
				      , @fechaInicio    = fechaInicio
			          , @fechaFin       = fechaFin
				      , @secuencial     = LTRIM(RTRIM(nroSecuencial)) 
				      , @pageSize       = pageSize
				      , @pageIndex      = pageIndex
                      , @idPuntoEmision = idPuntoEmision
                      , @infoAdicional  = infoAdicional
        FROM OPENJSON(@json) WITH
                (    
                     checkBoxFecha  BIT 
				    ,byCliente      INT 
				    ,codEstab       VARCHAR(150) 
                    ,idPuntoEmision INT 
				    ,byEstado       INT 
				    ,idUsuario      INT 
				    ,fechaInicio    DATETIME2 
			        ,fechaFin       DATETIME2 
				    ,nroSecuencial  VARCHAR(50) 
				    ,pageIndex      INT
				    ,pageSize       INT 
                    ,infoAdicional  VARCHAR(100)
			    )

        IF EXISTS (SELECT 1
        FROM Config.v_User_Permission_Sale WITH (NOLOCK)
        WHERE idUsuarioRol = @userRoleId AND viewOthersDocs = 0) 
				    BEGIN
            SELECT TOP 1
                @idUsuario = idUsuario
            FROM App.UsuarioRol WITH (NOLOCK)
            WHERE idUsuarioRol = @userRoleId
        END
        -------------------------------------------BUSQUEDA POR PARAMETRO----------------------------------------------------------------
        IF @codEstab IS NOT NULL
                    BEGIN
            SET @sql = @sql + 'AND fe.codEstab = @codEstab '
        END

        IF @checkBoxFecha = 1
				    BEGIN
            SET @sql = @sql + 'AND CAST(fe.fechaEmision as date) BETWEEN CAST(@fechaE as date) AND CAST(@fechaF as date) '
        END

        IF @secuencial IS NOT NULL
				    BEGIN
            SET @sql = @sql + 'AND fe.secuencial BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
        END

        IF @idPuntoEmision > 0 
                    BEGIN
            SET @sql = @sql + 'AND fe.idPuntoEmision = @idPuntoEmision '
        END

        IF @idCliente > 0
				    BEGIN
            SET @sql = @sql + 'AND fe.idCliente = @idCliente '
        END

        IF @idEstadoPago > 0
				    BEGIN
            SELECT TOP 1
                @codDoc = codigo
            FROM dbo.EstadoPago WITH (NOLOCK)
            WHERE idEstadoPago = @idEstadoPago

            IF @codDoc = 'NCBR'
						    BEGIN
                SET @sql = @sql + 'AND (fe.codCuenta = ''PE'' OR fe.codCuenta = ''PP'') '
            END 

					    ELSE 
						    BEGIN
                SET @sql = @sql + 'AND fe.idEstadoPago = @idEstadoPago '
            END
        END	
                ELSE 
                    BEGIN
            SET @sql = @sql + 'AND fe.codCuenta <> ''A'' '
        END

        IF @idUsuario > 0
				    BEGIN
            SET @sql = @sql + 'AND fe.idUsuario = @idUsuario '
        END

        IF @infoAdicional IS NOT NULL
                    BEGIN
            SET @sql = @sql + 'AND fe.idFactura IN (
                                                                    SELECT idComprobante
                                                                    FROM dbo.InfoAdicionalDoc           ia WITH (NOLOCK)
                                                                    INNER JOIN dbo.TipoDocumento        td WITH (NOLOCK) ON td.idTipoDocumento        = ia.idTipoDocumento
                                                                    INNER JOIN dbo.Factura              fe WITH (NOLOCK) ON fe.idFactura              = ia.idComprobante
                                                                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fe.idDocumentoElectronico
                                                                    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                                                                    INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
                                                                    WHERE td.codigoSri = ''01''
	                                                                  AND es.idEntidad = @idEntidad
	                                                                  AND ia.valor LIKE ''%''+ @infoAdicional +''%''
                                                                 ) '
        END

        SET @sql = @sql + 'ORDER BY fe.idFactura DESC OFFSET @pageSize * (@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '
        SET @tableNames='invoices'

        EXEC sp_executesql @sql
							      ,@params 
							      ,@idEntidad      = @idEntidad
							      ,@codEstab       = @codEstab
							      ,@idCliente      = @idCliente
							      ,@idEstadoPago   = @idEstadoPago 
							      ,@idUsuario      = @idUsuario
							      ,@fechaE         = @fechaInicio
							      ,@fechaF         = @fechaFin
							      ,@pageIndex      = @pageIndex
							      ,@pageSize       = @pageSize
                                  ,@idPuntoEmision = @idPuntoEmision
                                  ,@infoAdicional  = @infoAdicional

        RETURN
    END

	    --> Devolucion
	    IF @tipo = 2
		    BEGIN

        SELECT @idCliente = byCliente 
                      , @codEstab  = codEstab 
                      , @pageSize  = pageSize
				      , @pageIndex = pageIndex
        FROM OPENJSON(@json) WITH 
                (
                    byCliente INT 
                   ,codEstab  VARCHAR(150)
                   ,pageSize  INT
                   ,pageIndex INT

                )

        SET @params = '@codEstab  VARCHAR(150)
					          ,@idCliente INT
                              ,@pageIndex INT
                              ,@pageSize  INT'

        SET @sql = 'SELECT fe.idFactura 
	                              ,de.serieComprobante
                                  ,de.fechaEmision
	                              ,cu.BusinessName     as razonSocialComprador
                                  ,COUNT(*) OVER()     as totalRecords
                            FROM dbo.Factura	                fe WITH (NOLOCK) 
                            INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fe.idDocumentoElectronico
                            INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id					  = de.customerId
                            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                            INNER JOIN FactElect.EstadoServicio ss WITH (NOLOCK) ON ss.idEstadoServicio	      = de.idEstadoServicio
                            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
                            WHERE es.codEstab = @codEstab '

        SET @sql = @sql + 'AND fe.idCliente = @idCliente AND ss.codigo = 4 AND fe.notaCredito = 0 ORDER BY idFactura DESC OFFSET @pageSize * (@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY  '

        EXEC sp_executesql @sql
							      ,@params 
							      ,@codEstab  = @codEstab
							      ,@idCliente = @idCliente
                                  ,@pageIndex = @pageIndex
                                  ,@pageSize  = @pageSize
        RETURN
    END

        --> Data Form
        IF @tipo = 3
            BEGIN

        DECLARE @existePoliticaVenta BIT = 0;

        SELECT nroPrecio
	                  , nroCantidad
	                  , nroIva
	                  , nroDescuentoDetalle
	                  , nroTotalDetalle
	                  , nroTotalSubTotal
	                  , nroDescuento
	                  , nroIce
	                  , importeTotal
        FROM Config.v_Sistema_Decimal WITH (NOLOCK)
        WHERE codTrasaccion = 'V'
            AND idEntidad = @idEntidad

        SELECT idTipoIva
                      , idImpuesto
	                  , descripcion
	                  , porcentaje                        as tarifa
	                  , CAST(codigoPorcentaje as varchar) as codigoPorcentaje 
                      , estado
        FROM dbo.TipoIva WITH (NOLOCK)
        WHERE estado = 1

        SELECT idTarifa
	                  , descripcion
	                  , predeterminada
	                  , codigo
        FROM Tarifa WITH (NOLOCK)
        WHERE idEntidad = @idEntidad
            AND estado = 1

        SELECT idTiempoCredito
	                  , descripcion
	                  , diasCredito
	                  , numeroCuota
                      , entrada
        FROM TiempoCredito WITH (NOLOCK)
        WHERE idEntidad = @idEntidad
            AND gestion = 1
            AND estado = 1

        SELECT ar.idArticulo
	                  , ar.codigo
	                  , ar.descripcion
        FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN Articulo          ar WITH (NOLOCK) ON ar.idArticulo = gs.idArticulo
        WHERE gs.idEntidad = @idEntidad

        SELECT cl.idCliente
                      , cl.FormaPagoSriId       as idFormaPagoSri
                      , cu.IdTypeId             as idTipoIdentificacion
	                  , cu.IDCard               as numeroIdentificacion
	                  , cl.direccion
	                  , cl.correo
                      , cu.TradeName            as nombreComercial       
	                  , cu.BusinessName         as nombreFiscal
                      , cu.IDCard               as identificacionComprador
                      , cu.BusinessName         as razonSocialComprador
                      , cl.direccion            as direccionComprador
                      , cl.correo               as email
        FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = gs.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
        WHERE gs.idEntidad = @idEntidad

        SELECT searchCode
	                  , printerAutomatic
	                  , payAutomatic
	                  , multipleVendedor
	                  , detailDuplicate
                      , idFormaPagoSri
        FROM Config.v_Sistema_Ventas gs
        WHERE gs.idEntidad = @idEntidad


        -- Verificamos si se cumple la política de múltiple vendedor para el documento de venta
        IF EXISTS (
                    SELECT 1
        FROM Config.v_Sistema_Ventas
        WHERE idEntidad = @idEntidad AND multipleVendedor = 1 AND @codRol = 'VEN'
                )
                BEGIN
            SET @existePoliticaVenta = 1;
        END;

        -- Listamos usuarios dependiendo de la política
        SELECT
            u.idUsuario,
            u.nombreUsuario,
            u.nombreCompleto,
            predeterminado = CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
        FROM
            v_usuario u
        WHERE 
                    u.idEntidad = @idEntidad
            AND u.estadoUsuario = 1
            AND (
                        @existePoliticaVenta = 0 OR u.codRol NOT IN ('ADM')
                    );

        SELECT TOP 1
            estado as notificacionVenta
        FROM Config.v_Sistema_Notificacion WITH (NOLOCK)
        WHERE codigo = 'MMD' AND idEntidad = @idEntidad

        SELECT idEstablecimiento
                      , nombreComercial
                      , codEstab
                      , idPuntoEmision
                      , estab + '-' + ptoEmi as ptoEmi
                      , defaultEstab
                      , defaultPtoEmi
        FROM v_PtoEmi_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idEstablecimiento
                      , nombreComercial
                      , codEstab
                      , idBodega
                      , bodega
                      , defaultEstab
                      , defaultBodega
        FROM v_Bodega_Asign WITH (NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idFormaPagoSri, descripcion, codigo
        FROM dbo.FormaPagoSri
        WHERE estado = 1

        SELECT idTipoIdentificacion, descripcion, codigoSri
        FROM dbo.TipoIdentificacion
        WHERE estado = 1 AND codigoSri IN ('04','05','06')

        SELECT cd.idPuntoEmision, cd.infoAdicional
        FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
            INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento
            INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE es.idEntidad = @idEntidad
            AND td.codigoSri = '01'
            AND cd.infoAdicional IS NOT NULL

        RETURN
    END
		
        --> Filters  
        IF @tipo = 4
            BEGIN
            SET @tableNames='estabs,status'
        SELECT idEstablecimiento
                      , nombreComercial
                      , codEstab
                      , idPuntoEmision
                      , estab + '-' + ptoEmi as ptoEmi
                      , defaultEstab
                      , defaultPtoEmi
        FROM v_PtoEmi_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idEstadoPago, descripcion, codigo
        FROM dbo.EstadoPago WITH (NOLOCK)
        WHERE codigo IN ('PFC','NCBR','CBR','A')

        RETURN
    END 

        --> Data Form for App
        IF @tipo = 5
            BEGIN
        SELECT nroPrecio
	                  , nroCantidad
	                  , nroIva
	                  , nroDescuentoDetalle
	                  , nroTotalDetalle
	                  , nroTotalSubTotal
	                  , nroDescuento
	                  , nroIce
	                  , importeTotal
        FROM Config.v_Sistema_Decimal WITH (NOLOCK)
        WHERE codTrasaccion = 'V'
            AND idEntidad = @idEntidad

        SELECT idTipoIva
                    , idImpuesto
	                , descripcion
	                , tarifa = porcentaje
	                , codigoPorcentaje = CAST(codigoPorcentaje as varchar)
                    , estado
        FROM dbo.TipoIva WITH (NOLOCK)
        WHERE estado = 1

        SELECT idTarifa
	                    , descripcion
	                    , predeterminada
	                    , codigo
        FROM Tarifa WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND estado = 1

        SELECT idTiempoCredito
	                , descripcion
	                , diasCredito
	                , numeroCuota 
                    , entrada
                    , gestion
        FROM TiempoCredito WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

        SELECT a.idArticulo
	                    , a.codigo
	                    , a.descripcion
        FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN Articulo           a WITH (NOLOCK) ON a.idArticulo = gs.idArticulo
        WHERE gs.idEntidad = @idEntidad

        SELECT cl.idCliente
	                  , cl.FormaPagoSriId as idFormaPagoSri
                      , cu.IDCard         as numeroIdentificacion
                      , cu.TradeName      as nombreComercial       
	                  , cu.BusinessName   as nombreFiscal
                      , cl.direccion
	                  , cl.correo
        FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = gs.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
        WHERE gs.idEntidad = @idEntidad

        SELECT CAST(searchCode AS BIT)       as searchCode
	                  , CAST(printerAutomatic AS BIT) as printerAutomatic
	                  , CAST(payAutomatic AS BIT)     as payAutomatic
	                  , CAST(multipleVendedor AS BIT) as multipleVendedor
        FROM Config.v_Sistema_Ventas gs
        WHERE gs.idEntidad = @idEntidad

        SELECT es.codEstab
	                    , es.predeterminado
	                    , sr.nombreComercial
	                    , sr.estab
	                    , sr.actividad
        FROM Config.Estab_Asig es WITH (NOLOCK)
            INNER JOIN Sri.Establecimiento sr WITH (NOLOCK) ON sr.codEstab = es.codEstab
        WHERE es.idUsuarioRol = @userRoleId
        ORDER BY es.predeterminado DESC

        SELECT idEstablecimiento
                        , nombreComercial
                        , codEstab
                        , idPuntoEmision
                        , ptoEmi + '-' + estab as ptoEmi
                        , defaultEstab
                        , defaultPtoEmi
        FROM v_PtoEmi_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idEstablecimiento
                        , nombreComercial
                        , codEstab
                        , idBodega
                        , bodega
                        , defaultEstab
                        , defaultBodega
        FROM v_Bodega_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT u.idUsuario
	                  , u.nombreUsuario
	                  , u.nombreCompleto
	                  , predeterminado =  CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
        FROM v_usuario u WITH (NOLOCK)
        WHERE u.idEntidad = @idEntidad

        SELECT idFormaPagoSri, descripcion, codigo
        FROM dbo.FormaPagoSri
        WHERE estado = 1

        RETURN
    END

        --> Manejo InfoAdicional
        IF @tipo = 6
            BEGIN
        DECLARE @idInfoAdicional INT

        SELECT @idInfoAdicional = idInfoAdicional
        FROM OPENJSON(@json) WITH (idInfoAdicional INT)

        SELECT j.[key] as nombre
			          , ar.codigo + ' : ' + STRING_AGG(j.[value], ', ') WITHIN GROUP (ORDER BY j.[value]) as valor
                      , t.idInfoAdicional
        FROM Compra.InfoAdicional t WITH (NOLOCK)
            INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idArticulo = t.idArticulo
			    CROSS APPLY OPENJSON(t.jsonAdicional) j
        WHERE t.idInfoAdicional = @idInfoAdicional
        GROUP BY j.[key],ar.codigo,t.idInfoAdicional

        RETURN
    END 

        --> Serie Comprobante
        IF @tipo = 7
            BEGIN
        SELECT @idPuntoEmision = idPuntoEmision
        FROM OPENJSON(@json) WITH(idPuntoEmision INT)

        SELECT serieComprobante = [Common].[ufnGetSerieDocument](cd.estab,cd.ptoEmi,secuencial,0)
        FROM Config.v_ConfigDocumento cd WITH (NOLOCK)
        WHERE cd.idPuntoEmision = @idPuntoEmision
            AND cd.codDocSri = '01'

        RETURN
    END 
    
        --> Ver Documento
        IF @tipo = 8
            BEGIN
        DECLARE @idDocumentoElectronico INT

        SELECT @id = id , @idDocumentoElectronico = idDocumentoElectronico
        FROM OPENJSON(@json) WITH (id INT, idDocumentoElectronico INT) AS dt

        IF @idDocumentoElectronico > 0
                    BEGIN
            SELECT TOP 1
                @id = idFactura
            FROM Factura WITH (NOLOCK)
            WHERE idDocumentoElectronico = @idDocumentoElectronico
        END

        SELECT fv.nombreComercial
                      , fv.serieComprobante
                      , fv.fechaEmision
                      , fv.fechaVencimiento 
                      , fv.subTotalSinImpuestos
                      , fv.porcentajeDescuento
                      , fv.totalDescuento
                      , fv.totalIce
                      , fv.propina
                      , fv.recargo
                      , fv.transporte
                      , fv.total
                      , fv.tiempoCredito
                      , fv.usuario as empleado
                      , fv.observacion
        FROM Ventas.v_Factura fv WITH (NOLOCK)
        WHERE fv.idFactura = @id

        SELECT cu.BusinessName  as razonSocialComprador
                      , cu.IDCard        as identificacionComprador
                      , cl.direccion     as direccionComprador
                      , cl.correo
        FROM dbo.Factura              fv WITH (NOLOCK)
            INNER JOIN dbo.Cliente        cl WITH (NOLOCK) ON cl.idCliente = fv.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
        WHERE fv.idFactura = @id

        SELECT fd.idFacturaDetalle
                      , ar.codigo 
                      , fd.descripcion
                      , fd.cantidad
                      , fd.precioUnitario
                      , fd.porcentajeDescuento
                      , fd.valorDescuento
                      , fd.ice
                      , fd.precioTotalSinImpuesto
                      , im.codigo
                      , fd.codigoPorcentaje
                      , fd.tarifa
                      , fd.valorImpuesto
                      , fd.nota
                      , bo.descripcion as bodega
                      , me.descripcion as medida
                      , ti.descripcion as tipoIva
                      , ta.descripcion as pvp
        FROM dbo.FacturaDetalle fd WITH (NOLOCK)
            INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = fd.idArticulo
            INNER JOIN dbo.Medida   me WITH (NOLOCK) ON me.idMedida   = fd.idMedida
            INNER JOIN dbo.TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva  = fd.idTipoIva
            INNER JOIN dbo.Impuesto im WITH (NOLOCK) ON im.idImpuesto = ti.idImpuesto
            INNER JOIN dbo.Tarifa   ta WITH (NOLOCK) ON ta.idTarifa   = fd.idTarifa
            INNER JOIN dbo.Bodega   bo WITH (NOLOCK) ON bo.idBodega   = fd.idBodega
        WHERE fd.idFactura = @id
            AND fd.estado = 1
        ORDER By fd.idFacturaDetalle ASC

        SELECT ia.nombre 
                      , ia.valor
        FROM dbo.InfoAdicionalDoc    ia WITH (NOLOCK)
            INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ia.idTipoDocumento
        WHERE ia.idComprobante = @id
            AND ia.estado = 1
            AND td.codigoSri = '01'

        SELECT idTipoIva
                      , idImpuesto
	                  , descripcion
	                  , tarifa = porcentaje
	                  , CAST(codigoPorcentaje as varchar) as codigoPorcentaje
        FROM dbo.TipoIva WITH (NOLOCK)
        WHERE estado = 1

        SELECT fp.idFormaPagoFactura
                      , ps.descripcion as formaPago
                      , fp.abono       as total 
                      , tc.diasCredito as plazo
        FROM dbo.FormaPagoFactura    fp WITH (NOLOCK)
            INNER JOIN dbo.TiempoCredito tc WITH (NOLOCK) ON tc.idTiempoCredito = fp.idTiempoCredito
            INNER JOIN dbo.FormaPagoSri  ps WITH (NOLOCK) ON ps.idFormaPagoSri  = fp.idFormaPagoSri
        WHERE idFactura = @id

        RETURN
    END 
    
        --> Detalle para Devoluciones o Aprobaciones de Ventas
        IF @tipo = 9
            BEGIN
        SELECT @id = id
        FROM OPENJSON(@json) WITH(id INT)

        SELECT idDetalle = fc.idFacturaDetalle
		              , fc.idFacturaDetalle
		              , fc.idArticulo
		              , fc.idBodega
		              , fc.idTarifa
		              , fc.idMedida
                      , ti.idImpuesto
		              , fc.idTipoIva
                      , ar.codigo
                      , fc.descripcion
		              , fc.cantidad
		              , fc.precioUnitario
		              , ISNULL(fc.precioSinSubsidio,0) as precioSinSubsidio
		              , fc.valorDescuento
		              , fc.porcentajeDescuento
                      , fc.ice
		              , fc.precioTotalSinImpuesto
                      , fc.codigoPorcentaje
                      , fc.tarifa
                      , fc.valorImpuesto
		              , fc.nota
		              , datosAdicionales = ISNULL(ar.datosAdicionales, 0)
                      , ISNULL
                      ((
                            SELECT af.idMedida
                                  , IIF(af.gestionVenta = 1,1,3) as orden
                                  , af.conversion
                                  , af.precioCostoFraccionado
                                  , ar.precioCosto
			                      , me.descripcion               as descripcion
			                      , (
                                        SELECT pv.idTarifa
                                              , pv.precioVenta
                                              , pv.precioConIva
                                              , UPPER(ta.descripcion) as tarifa
                                              , ta.ventaPorMayor
                FROM dbo.ArticuloFraccionadoPvP  pv WITH (NOLOCK)
                    INNER JOIN dbo.Tarifa            ta WITH (NOLOCK) ON ta.idTarifa = pv.idTarifa
                WHERE pv.idArticuloFraccionado = af.idArticuloFraccionado
                ORDER BY ta.predeterminada DESC
                FOR JSON PATH

                                  ) as tarifas
            FROM dbo.ArticuloFraccionado af WITH (NOLOCK)
                INNER JOIN dbo.Medida        me WITH (NOLOCK) ON me.idMedida   = af.idMedida
                INNER JOIN dbo.Articulo      ar WITH (NOLOCK) ON ar.idArticulo = af.idArticulo
            WHERE af.idArticulo = fc.idArticulo
            FOR JSON PATH
                
                        ),'[]') as fraccionado

                       , ISNULL
                        ((
                            SELECT sc.idMedida
                                  , 2              as orden
                                  , 1              as conversion
			                      , sc.precioCosto as precioCostoFraccionado
                                  , sc.precioCosto
                                  , me.descripcion
			                      , (
                                        SELECT ap.idTarifa
                                              , ap.precioVenta
                                              , ap.precioConIva
                                              , UPPER(ta.descripcion) as tarifa
                                              , ta.ventaPorMayor
                FROM dbo.ArticuloPvP  ap WITH (NOLOCK)
                    INNER JOIN dbo.Tarifa ta WITH (NOLOCK) ON ta.idTarifa = ap.idTarifa
                WHERE ap.idArticulo = sc.idArticulo
                ORDER BY ta.predeterminada DESC
                FOR JSON PATH

                                   ) as tarifas
            FROM dbo.Articulo     sc WITH (NOLOCK)
                INNER JOIN dbo.Medida me WITH (NOLOCK) ON me.idMedida = sc.idMedida
            WHERE sc.idArticulo = fc.idArticulo
            FOR JSON PATH

                        ),'[]') as principal
                        , (
                
                            SELECT idArticulo, idBodega, fechaConsolidacion
            FROM Inventario.Stock st WITH (NOLOCK)
            WHERE st.idArticulo = fc.idArticulo AND st.idBodega = fc.idBodega
            FOR JSON PATH
         
                         ) as consolidacion
                        , ar.llevaInventario
                        , fc.precioCosto
                        , fc.estado
                        , (SELECT TOP 1
                ph.s3ObjectKey
            FROM [Inventario].[ProductPhoto] ph WITH (NOLOCK)
            WHERE ph.ProductId = ar.idArticulo AND IsDefault = 1) s3ObjectKey
		                , (SELECT TOP 1
                ph.s3ObjectUrl
            FROM [Inventario].[ProductPhoto] ph WITH (NOLOCK)
            WHERE ph.ProductId = ar.idArticulo AND IsDefault = 1) s3ObjectUrl
        FROM FacturaDetalle fc WITH (NOLOCK)
            INNER JOIN Articulo ar WITH (NOLOCK) ON ar.idArticulo = fc.idArticulo
            INNER JOIN Medida   me WITH (NOLOCK) ON me.idMedida   = fc.idMedida
            INNER JOIN TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva  = fc.idTipoIva
        WHERE fc.idFactura = @id
            AND fc.estado = 1
        ORDER BY fc.idFacturaDetalle ASC

        RETURN
    END 

        SELECT '0'code, 'No se encontraron datos con los parametros solicitados' as 'message'
    END TRY 

    BEGIN CATCH
        
        SELECT TOP 1
        @idUsuario = idUsuario
    FROM App.UsuarioRol WITH(NOLOCK)
    WHERE idUsuarioRol = @userRoleId

        INSERT INTO dbo.ErroresSistema
        (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
    VALUES(NEWID(), '/Factura/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), 'Ventas.Factura_Get', ERROR_LINE(), ERROR_MESSAGE(), GETDATE(), @idUsuario);

        THROW;
    END CATCH
END
