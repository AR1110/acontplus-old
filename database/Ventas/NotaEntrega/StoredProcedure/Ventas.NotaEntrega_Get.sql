USE [AcontPlus]
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-12-01
-- Description:	SP para listar datos de las notas de entrega por punto de emision 
-- =============================================
--- Ventas.NotaEntrega_Get 28, '{"tipo": 7}'
CREATE OR ALTER PROCEDURE Ventas.NotaEntrega_Get
    @userRoleId INT ,
    @json VARCHAR(MAX),
    @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Filters
    DECLARE @checkBoxFecha BIT ,@idCliente INT ,@idEstadoPago INT ,@idPuntoEmision INT ,@idInfoAdicional INT ,@codEstab VARCHAR(150)
	       ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2 ,@secuencial VARCHAR(50) ,@idUsuario INT ,@id INT ,@infoAdicional VARCHAR(100)
           ,@codEstado CHAR(5) ,@convertToDoc BIT 

    --> Recuperacion de Informacion
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    SELECT TOP 1 @idEntidad = idEntidad , @idUsuario = idUsuario FROM app.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    --> GET 
    IF @tipo = 1
        BEGIN
        --> Sql
        DECLARE @params    NVARCHAR(MAX) 
                   ,@sql       NVARCHAR(MAX) 
                   ,@pageIndex INT 
                   ,@pageSize  INT

        SET @sql = 'WITH CTE AS (
								      SELECT ne.idCuentaPorCobrar
	                                        ,ne.idNotaEntrega                              as idDocumento
	                                        ,ne.codEstab
	                                        ,FORMAT(ne.fechaEmision, ''dd/MM/yyyy HH:mm'') as fechaEmision
	                                        ,FORMAT(ne.fechaVencimiento, ''dd/MM/yyyy'')   as fechaVencimiento
	                                        ,ne.serieComprobante
	                                        ,ne.razonSocialComprador                       as nombreFiscal
	                                        ,ne.identificacionComprador
	                                        ,ne.estadoCuenta                               as estadoFinanciero
	                                        ,CAST(ne.total as numeric(18,2))               as total 
	                                        ,CAST(ne.abono as numeric(18,2))               as abono  
	                                        ,CAST(ne.saldo as numeric(18,2))               as saldo 
	                                        ,ne.usuario
	                                        ,ne.tipoTiempoCredito                          as tiempoCredito
	                                        ,ne.codCuenta                                  as codEstado
	                                        ,ne.convertToDoc
	                                        ,COUNT(*) OVER()                               as contador
                                    FROM Ventas.v_NotaEntrega ne WITH (NOLOCK)
                                    WHERE ne.idEntidad = @idEntidad '

        SET @params = '@idEntidad      INT
						  ,@idEstadoPago   INT
                          ,@idPuntoEmision INT
						  ,@idCliente      INT
						  ,@codEstab       VARCHAR(150)
						  ,@idUsuario      INT
						  ,@fechaI         DATETIME2
						  ,@fechaF         DATETIME2
						  ,@pageSize       INT
						  ,@pageIndex      INT
                          ,@infoAdicional  VARCHAR(100)
                          ,@convertToDoc   BIT'

        SELECT @checkBoxFecha  = checkBoxFecha
			      , @codEstab       = codEstab
                  , @idPuntoEmision = idPuntoEmision
                  , @idEstadoPago   = idEstadoPago
			      , @idCliente      = byCliente
			      , @codEstado      = codEstado
			      , @idUsuario      = byUsuario
			      , @fechaInicio    = fechaInicio
			      , @fechaFin       = fechaFin
			      , @secuencial     = LTRIM(RTRIM(nroSecuencial))
			      , @pageSize       = pageSize
			      , @pageIndex      = pageIndex
                  , @infoAdicional  = infoAdicional
                  , @convertToDoc   = convertToDoc
        FROM OPENJSON(@json) WITH
            (    
                 checkBoxFecha  BIT 
			    ,codEstab       VARCHAR(25) 
                ,idPuntoEmision INT 
                ,idEstadoPago   INT
			    ,byCliente      INT 
			    ,codEstado      CHAR(5)
			    ,byUsuario      INT
			    ,fechaInicio    DATETIME2
			    ,fechaFin       DATETIME2
			    ,nroSecuencial  VARCHAR(50)
			    ,pageIndex      INT 
			    ,pageSize       INT
                ,infoAdicional  VARCHAR(100)
                ,convertToDoc   BIT
			)

        IF EXISTS (SELECT 1
        FROM Config.v_User_Permission_Sale
        WHERE idUsuarioRol = @userRoleId AND viewOthersDocs = 0) 
				BEGIN
            SELECT TOP 1
                @idUsuario = idUsuario
            FROM App.UsuarioRol WITH(NOLOCK)
            WHERE idUsuarioRol = @userRoleId
        END

        IF @checkBoxFecha = 1 
				BEGIN
            SET @sql = @sql + 'AND CAST(ne.fechaEmision as date) BETWEEN CAST(@fechaI as date) AND CAST(@fechaF as date) '
        END

        IF @codEstab IS NOT NULL
                BEGIN
            SET @sql = @sql + 'AND ne.codEstab = @codEstab '
        END

        IF @idPuntoEmision > 0 
                BEGIN
            SET @sql = @sql + 'AND ne.idPuntoEmision = @idPuntoEmision '
        END

        IF @secuencial IS NOT NULL
				BEGIN
            SET @sql = @sql + 'AND ne.secuencial BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
        END

        IF @idCliente > 0 
				BEGIN
            SET @sql = @sql + 'AND ne.idCliente = @idCliente '
        END

        IF @idEstadoPago > 0
				BEGIN
            SELECT TOP 1
                @codEstado = codigo
            FROM dbo.EstadoPago WITH (NOLOCK)
            WHERE idEstadoPago = @idEstadoPago

            IF @codEstado = 'NCBR'
						BEGIN
                SET @sql = @sql + 'AND ne.codCuenta IN (''PP'',''PE'') '
            END 
                    ELSE 
						BEGIN
                SET @sql = @sql + 'AND ne.idEstadoPago = @idEstadoPago '
            END
        END
            ELSE 
                BEGIN
            SET @sql = @sql + 'AND ne.codCuenta NOT IN (''A'') '
        END

        IF @convertToDoc IN (1,0)
                BEGIN
            SET @sql = @sql + 'AND ne.convertToDoc = @convertToDoc '
        END

        IF @idUsuario > 0 
				BEGIN
            SET @sql = @sql + 'AND ne.idUsuario = @idUsuario '
        END

        IF @infoAdicional IS NOT NULL
                BEGIN
            SET @sql = @sql + 'AND ne.idNotaEntrega IN (
                                                                SELECT idComprobante
                                                                FROM dbo.InfoAdicionalDoc    ia WITH (NOLOCK)
                                                                INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ia.idTipoDocumento
                                                                INNER JOIN dbo.NotaEntrega   ne WITH (NOLOCK) ON ne.idNotaEntrega   = ia.idComprobante
                                                                WHERE td.codigo = ''NE''
                                                                  AND ne.idEntidad = @idEntidad
                                                                  AND ia.valor LIKE ''%''+ @infoAdicional +''%''
                                                             ) '
        END

        SET @sql = @sql + ')
								SELECT *
									  ,MAX(contador) OVER() AS totalRecords
								FROM CTE
								ORDER BY idDocumento DESC
								OFFSET @pageSize * (@pageIndex - 1) ROWS
								FETCH NEXT @PageSize ROWS ONLY '

        EXEC sp_executesql @sql 
				              ,@params 
				              ,@idEntidad      = @idEntidad
				              ,@idCliente      = @idCliente
				              ,@idEstadoPago   = @idEstadoPago 
                              ,@idUsuario      = @idUsuario
				              ,@idPuntoEmision = @idPuntoEmision
                              ,@codEstab       = @codEstab
				              ,@fechaI         = @fechaInicio
				              ,@fechaF         = @fechaFin	
							  ,@pageSize       = @pageSize
							  ,@pageIndex      = @pageIndex
                              ,@infoAdicional  = @infoAdicional
                              ,@convertToDoc   = @convertToDoc
        RETURN
    END

    --> DATA FORM
    IF @tipo = 2
        BEGIN
            DECLARE @existePoliticaVenta BIT=0, @codRol VARCHAR(50)

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
            WHERE codTrasaccion = 'V' AND idEntidad = @idEntidad

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
            WHERE idEntidad = @idEntidad AND estado = 1

            SELECT idTiempoCredito
	              ,descripcion
	              ,diasCredito
	              ,numeroCuota 
                  ,entrada
            FROM TiempoCredito WITH (NOLOCK)
            WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

            SELECT a.idArticulo
	              ,a.codigo
	              ,a.descripcion
            FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN Articulo           a WITH (NOLOCK) ON a.idArticulo = gs.idArticulo
            WHERE gs.idEntidad = @idEntidad

            SELECT cl.idCliente
                    ,cl.FormaPagoSriId       as idFormaPagoSri
	                ,cu.IDCard               as numeroIdentificacion
	                ,cl.direccion
	                ,cl.correo
                    ,cu.IdTypeId             as idTipoIdentificacion
                    ,cu.TradeName            as nombreComercial       
	                ,cu.BusinessName         as nombreFiscal
                    ,cu.IDCard               as identificacionComprador
                    ,cu.BusinessName         as razonSocialComprador
                    ,cl.direccion            as direccionComprador
                    ,cl.correo               as email
            FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = gs.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
            WHERE gs.idEntidad = @idEntidad

            SELECT CAST(searchCode       AS BIT) as searchCode
	              ,CAST(printerAutomatic AS BIT) as printerAutomatic
	              ,CAST(payAutomatic     AS BIT) as payAutomatic
	              ,CAST(multipleVendedor AS BIT) as multipleVendedor
                  ,CAST(detailDuplicate  AS BIT) as detailDuplicate
                  ,CAST(idFormaPagoSri   AS INT) as idFormaPagoSri
            FROM Config.v_Sistema_Ventas gs
            WHERE gs.idEntidad = @idEntidad

            --> Verificamos si se cumple la política de múltiple vendedor para el documento de venta
            IF EXISTS (SELECT 1 FROM Config.v_Sistema_Ventas WHERE idEntidad = @idEntidad AND multipleVendedor = 1 AND @codRol = 'VEN')
                BEGIN
                    SET @existePoliticaVenta = 1;
                END;

            SELECT u.idUsuario
                  ,u.nombreUsuario
                  ,u.nombreCompleto
                  ,predeterminado = CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
            FROM v_usuario u WITH (NOLOCK)
            WHERE u.idEntidad = @idEntidad
              AND u.estadoUsuario = 1
              AND (
                    @existePoliticaVenta = 0 OR u.codRol NOT IN ('ADM')
                  );

            SELECT TOP 1 estado as notificacionVenta FROM Config.v_Sistema_Notificacion WITH (NOLOCK) WHERE codigo = 'MMD' AND idEntidad = @idEntidad

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

            SELECT idFormaPagoSri, descripcion, codigo FROM dbo.FormaPagoSri WHERE estado = 1

            SELECT idTipoIdentificacion, descripcion, codigoSri FROM dbo.TipoIdentificacion WHERE estado = 1 AND codigoSri IN ('04','05','06')

            SELECT cd.idPuntoEmision, cd.infoAdicional
            FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
            INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento
            INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
                AND td.codigo = 'NE'
                AND cd.infoAdicional IS NOT NULL

        RETURN
    END

    --> FILTERRS
    IF @tipo = 3
        BEGIN
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

    --> Serie Comprobante
    IF @tipo = 4
        BEGIN
        SELECT @idPuntoEmision = idPuntoEmision
        FROM OPENJSON(@json) WITH(idPuntoEmision INT)

        SELECT serieComprobante = [Common].[ufnGetSerieDocument](cd.estab,cd.ptoEmi,secuencial,0)
        FROM Config.v_ConfigDocumento cd WITH (NOLOCK)
        WHERE cd.idPuntoEmision = @idPuntoEmision
            AND cd.codDoc = 'NE'

        RETURN
    END

    --> Ver Documento
    IF @tipo = 5
        BEGIN
        SELECT @id = id
        FROM OPENJSON(@json) WITH(id INT)

        SELECT ne.nombreComercial
                  , ne.serieComprobante
                  , ne.fechaEmision
                  , ne.fechaVencimiento 
                  , ne.subTotalSinImpuestos
                  , ne.totalDescuento
                  , ne.porcentajeDescuento
                  , ne.propina
                  , ne.recargo
                  , ne.transporte
                  , ne.total
                  , ne.tiempoCredito
                  , ne.usuario as empleado
                  , ne.observacion
        FROM Ventas.v_NotaEntrega ne WITH (NOLOCK)
        WHERE ne.idNotaEntrega = @id

        SELECT cu.BusinessName as razonSocialComprador
                  , cu.IDCard       as identificacionComprador
                  , cl.direccion    as direccionComprador
                  , cl.correo
        FROM dbo.NotaEntrega         ne WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = ne.idCliente
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
        WHERE ne.idNotaEntrega = @id

        SELECT nd.idNotaEntregaDetalle
                  , ar.codigo 
                  , nd.descripcion
                  , nd.cantidad
                  , nd.precioUnitario
                  , nd.porcentajeDescuento
                  , nd.valorDescuento
                  , nd.ice
                  , nd.precioTotalSinImpuesto
                  , im.codigo
                  , nd.codigoPorcentaje
                  , nd.tarifa
                  , nd.valorImpuesto
                  , nd.nota
                  , bo.descripcion as bodega
                  , me.descripcion as medida
                  , ti.descripcion as tipoIva
                  , ta.descripcion as pvp
        FROM dbo.NotaEntregaDetalle nd WITH (NOLOCK)
            INNER JOIN dbo.Articulo     ar WITH (NOLOCK) ON ar.idArticulo = nd.idArticulo
            INNER JOIN dbo.Medida       me WITH (NOLOCK) ON me.idMedida   = nd.idMedida
            INNER JOIN dbo.TipoIva      ti WITH (NOLOCK) ON ti.idTipoIva  = nd.idTipoIva
            INNER JOIN dbo.Tarifa       ta WITH (NOLOCK) ON ta.idTarifa   = nd.idTarifa
            INNER JOIN dbo.Bodega       bo WITH (NOLOCK) ON bo.idBodega   = nd.idBodega
            INNER JOIN dbo.Impuesto     im WITH (NOLOCK) ON im.idImpuesto = ti.idImpuesto
        WHERE nd.idNotaEntrega = @id
            AND nd.estado = 1
        ORDER BY nd.idNotaEntregaDetalle ASC

        SELECT ia.nombre 
                  , ia.valor
        FROM dbo.InfoAdicionalDoc    ia WITH (NOLOCK)
            INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ia.idTipoDocumento
        WHERE ia.idComprobante = @id AND td.codigo = 'NE'

        SELECT idTipoIva
                  , idImpuesto
	              , descripcion
	              , tarifa = porcentaje
	              , codigoPorcentaje = CAST(codigoPorcentaje as varchar)
        FROM dbo.TipoIva WITH (NOLOCK)
        WHERE estado = 1

        RETURN
    END

    --> Detalle para Apro.Ventas
    IF @tipo = 6
        BEGIN

        SELECT @id = id
        FROM OPENJSON(@json) WITH(id INT)

        SELECT ned.idNotaEntregaDetalle
		          , ned.idArticulo
		          , ned.idBodega
		          , ned.idTarifa
		          , ned.idMedida
                  , ti.idImpuesto
                  , ned.idTipoIva
                  , a.codigo
                  , ned.descripcion
		          , ned.cantidad
		          , ned.precioUnitario 
		          , ned.valorDescuento
		          , ned.porcentajeDescuento
                  , ned.ice
		          , ned.precioTotalSinImpuesto
                  , ned.codigoPorcentaje
		          , ned.tarifa 
                  , ned.valorImpuesto
		          , ned.nota
		          , ISNULL(a.datosAdicionales, 0) as datosAdicionales
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
            WHERE af.idArticulo = ned.idArticulo
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
            WHERE sc.idArticulo = ned.idArticulo
            FOR JSON PATH

                     ),'[]') as principal
                     , (
                        SELECT idArticulo, idBodega, fechaConsolidacion
            FROM Inventario.Stock st WITH (NOLOCK)
            WHERE st.idArticulo = ned.idArticulo AND st.idBodega = ned.idBodega
            FOR JSON PATH
                      ) as consolidacion
                     , a.llevaInventario
                     , a.precioCosto
                     , ned.estado
                     , ne.fechaEmision
        FROM NotaEntregaDetalle ned
            INNER JOIN Articulo       a WITH (NOLOCK) ON a.idArticulo     = ned.idArticulo
            INNER JOIN NotaEntrega   ne WITH (NOLOCK) ON ne.idNotaEntrega = ned.idNotaEntrega
            LEFT JOIN Medida        me WITH (NOLOCK) ON me.idMedida      = ned.idMedida
            LEFT JOIN TipoIva       ti WITH (NOLOCK) ON ti.idTipoIva     = ned.idTipoIva
        WHERE ned.idNotaEntrega = @id
            AND ned.estado = 1
        ORDER BY ned.idNotaEntregaDetalle  ASC

        RETURN
    END

    --> DataForm para AppMobile
    IF @tipo = 7
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
        FROM TiempoCredito WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

        SELECT a.idArticulo
	              , a.codigo
	              , a.descripcion
        FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
            INNER JOIN Articulo           a WITH (NOLOCK) ON a.idArticulo = gs.idArticulo
        WHERE gs.idEntidad = @idEntidad

        SELECT cl.idCliente
	              , cu.IDCard       as numeroIdentificacion
                  , cu.BusinessName as nombreFiscal       
	              , cu.TradeName    as nombreComercial
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

        --   SELECT u.idUsuario
        --         ,u.nombreUsuario
        --         ,u.nombreCompleto
        --         ,CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT) as predeterminado
        --FROM Usuario               u WITH(NOLOCK)
        --INNER JOIN App.UsuarioRol ur WITH(NOLOCK) ON u.idUsuario = ur.idUsuario
        --WHERE ur.idEntidad = @idEntidad

        SELECT u.idUsuario
                , u.nombreUsuario
                , u.nombreCompleto
                , predeterminado =  CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
        FROM v_usuario u WITH(NOLOCK)
        WHERE u.idEntidad = @idEntidad

        RETURN
    END

    --> Ver historial de Conversion
    IF @tipo = 8
        BEGIN
            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            IF EXISTS (SELECT 1 FROM Ventas.NotaEntregaDocumento WITH (NOLOCK) WHERE NotaEntregaId = @id AND Estado = 1)
                BEGIN
                    SELECT 'Conversión'		                           as metodoConversion
                          ,FORMAT(nd.FechaRegistro,'dd/MM/yyyy HH:mm') as fechaRegistro
                          ,us.nombreUsuario						       as usuario
                          ,nd.SerieComprobante                         as serieComprobante
                          ,td.codigo                                   as codDoc
                    FROM Ventas.NotaEntregaDocumento nd WITH (NOLOCK)
                    INNER JOIN dbo.TipoDocumento     td WITH (NOLOCK) ON td.idTipoDocumento = nd.TipoDocumentoId
                    INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario       = nd.UsuarioId
                    WHERE nd.NotaEntregaId = @id
                      AND nd.Estado = 1
                END 
            ELSE 
                BEGIN
                    SELECT 'Aprobación'								                                                             as metodoConversion
                          ,FORMAT(CASE WHEN ep.codigo = 'PE' THEN ad.fechaEmision ELSE au.fechaRegistro END, 'dd/MM/yyyy HH:mm') as fechaRegistro
                          ,CASE WHEN ep.codigo = 'PE' THEN us.nombreUsuario ELSE ua.nombreUsuario END                            as usuario
                          ,CASE WHEN ep.codigo = 'PE' THEN ad.serieComprobante ELSE de.serieComprobante END                      as serieComprobante
                          ,CASE WHEN ep.codigo = 'PE' THEN 'PF' ELSE td.codigo END                                               as codDoc
                    FROM Ventas.Aprob_Document_Hist        ah WITH (NOLOCK)
                    INNER JOIN Ventas.Aprob_Document       ad WITH (NOLOCK) ON ad.idAprob_Document       = ah.idAprob_Document
                    INNER JOIN dbo.Usuario		           us WITH (NOLOCK) ON us.idUsuario              = ad.idUsuario
                    INNER JOIN dbo.EstadoPago              ep WITH (NOLOCK) ON ep.idEstadoPago           = ad.idEstadoDocumento
                    INNER JOIN dbo.TipoDocumento           td WITH (NOLOCK) ON td.idTipoDocumento        = ad.idTipoDocumento
                     LEFT JOIN Ventas.Aprob_Document_Audit au WITH (NOLOCK) ON au.idAprob_Document       = ad.idAprob_Document
                     LEFT JOIN dbo.Factura                 fe WITH (NOLOCK) ON fe.idFactura              = au.idFactura
                     LEFT JOIN dbo.Usuario                 ua WITH (NOLOCK) ON ua.idUsuario              = au.idUsuario
                     LEFT JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = fe.idDocumentoElectronico
                    WHERE ah.idNotaEntrega = @id
                END
        RETURN
    END

    --> DataForm Conversion
    IF @tipo = 9
        BEGIN
        SELECT idTiempoCredito
	              , descripcion
	              , diasCredito
	              , numeroCuota
        FROM TiempoCredito WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

        SELECT CAST(idFormaPagoSri   AS INT) as idFormaPagoSri
                  , CAST(multipleVendedor AS BIT) as multipleVendedor
        FROM Config.v_Sistema_Ventas gs
        WHERE gs.idEntidad = @idEntidad

        SELECT idFormaPagoSri, descripcion, codigo
        FROM dbo.FormaPagoSri
        WHERE estado = 1

        SELECT u.idUsuario
                  , u.nombreUsuario
                  , u.nombreCompleto
                  , predeterminado =  CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
        FROM v_usuario u WITH(NOLOCK)
        WHERE u.idEntidad = @idEntidad

        RETURN
    END

    SELECT '0'code, 'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN
END
