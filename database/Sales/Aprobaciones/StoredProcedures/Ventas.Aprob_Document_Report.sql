USE AcontPlus
GO 
 
-- exec ReporteVentas.Aprob_Document '{"id":1164,"codEstab":"ESTAB-000000002","codDoc":"NE"}'
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Report @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@userRoleId INT

    --> Filters Generales
    DECLARE @id INT ,@codDoc VARCHAR(10)

    --> Variables
    SELECT @tipo = tipo ,@userRoleId = userRoleId FROM OPENJSON(@json) WITH (tipo INT ,userRoleId INT)

    --> Reporte Principal 
    IF @tipo = 1
        BEGIN 
            
            DEClARE @fechaEmision    DATETIME2
                   ,@idTipoDocumento INT 

            SELECT @id = id ,@codDoc = codDoc FROM OPENJSON(@json) WITH (id INT, codDoc VARCHAR(10))

            SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

            SELECT TOP 1 @fechaEmision = fechaEmision FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

            IF @codDoc = '01'
                BEGIN
                    SELECT 'PRE FACTURA'                                                        as tipoDoc
		                  ,av.claveAcceso
		                  ,av.claveAcceso                                                       as codigoAutorizacion
                          ,CASE WHEN pe.ambiente = '1' THEN 'Pruebas' ELSE 'Producción' END     as ambiente
		                  ,'NORMAL'                                                             as emision
                          ,en.razonSocial
                          ,en.ruc
		                  ,es.nombreComercial
		                  ,es.dirEstablecimiento 
		                  ,es.correo                                                           as emailEstablecimiento
		                  ,es.telefono                                                         as telefonoEstablecimiento 
		                  ,es.contribuyenteRimpe
                          ,es.obligadoContabilidad
		                  ,FORMAT(av.fechaEmision, 'dd/MM/yyyy hh:mm:ss')                      as fechaEmision
                          ,av.serieComprobante	
		                  ,cu.BusinessName                                                     as razonSocialComprador
		                  ,cu.IDCard                                                           as identificacionComprador
		                  ,cl.direccion                                                        as direccionComprador
		                  ,REPLACE(ISNULL(cl.correo , 'S/N'),';',',')                          as emailComprador
		                  ,REPLACE(ISNULL(cl.telefono, 'S/N'),';',',')                         as telefonoComprador
		                  ,ISNULL(cl.configValorBruto,0)                                       as configValorBruto
                          ,ci.descripcion                                                      as ciudadComprador
		                  ,CAST(av.totalSinImpuestos as numeric(18,2))                         as subTotalSinImpuestos
		                  ,CAST(av.totalDescuento as numeric(18,2))                            as totalDescuento
		                  ,CAST(av.propina as numeric(18,2))                                   as propina
		                  ,CAST(av.importeTotal as numeric(18,2))                              as importeTotal		
		                  ,CAST(0 as numeric(18,2))                                            as totalIce
                          ,CAST(0 as numeric(18,2))                                            as irbpnr
		                  ,av.observacion
	                FROM Ventas.Aprob_Document        av WITH (NOLOCK)
	                INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente         = av.idCliente
                    INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision    = av.idPuntoEmision 
	                INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                    INNER JOIN dbo.Entidad            en WITH (NOLOCK) ON en.idEntidad         = es.idEntidad
                    INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
                     LEFT JOIN dbo.Ciudad             ci WITH (NOLOCK) ON ci.idCiudad          = cl.idCiudad 
	                WHERE av.idAprob_Document = @id

                    SELECT ar.codigo
		                  ,CASE WHEN ABS(ROUND(ad.cantidad, 2) - ad.cantidad) < 0.000001 THEN FORMAT(ad.cantidad, '0.00')
                                                                         ELSE FORMAT(ad.cantidad, '0.##########')
                           END AS cantidad
		                  ,CASE WHEN ABS(ROUND(ad.precioUnitario, 2) - ad.precioUnitario) < 0.000001 THEN FORMAT(ad.precioUnitario, '0.00')
                                                                                     ELSE FORMAT(ad.precioUnitario, '0.##########')
                           END AS precioUnitario 
		                  ,ad.descripcion
                          ,CAST(0 as numeric(18,2))                      as subsidio 
		                  ,CAST(0 as numeric(18,2))                      as precioSinSubsidio
		                  ,CAST(ad.descuento as numeric(18,2))           as valorDescuento
		                  ,CAST(precioTotalSinImpuesto as numeric(18,2)) as precioTotal
		                  ,me.descripcion                                as medida
                          ,ad.nota
	                FROM Ventas.Aprob_Document_Detailt ad WITH (NOLOCK)
	                INNER JOIN dbo.Medida              me WITH (NOLOCK) ON me.idMedida   = ad.idMedida
	                INNER JOIN dbo.Articulo            ar WITH (NOLOCK) ON ar.idArticulo = ad.idArticulo 
	                WHERE ad.idAprob_Document = @id 
                      AND ad.estado = 1
                    ORDER BY ad.idAprob_Document_Detailt ASC
                END 
            ELSE 
                BEGIN
                    SELECT 'Nota de Entrega Por Aprobar'                                        as tipoDoc
                          ,en.razonSocial
                          ,en.ruc
		                  ,es.nombreComercial
		                  ,es.dirEstablecimiento 
		                  ,es.correo                                                           as emailEstablecimiento
		                  ,es.telefono                                                         as telefonoEstablecimiento 
		                  ,es.contribuyenteRimpe
                          ,es.obligadoContabilidad
		                  ,FORMAT(av.fechaEmision, 'dd/MM/yyyy hh:mm:ss')                      as fechaEmision
                          ,av.serieComprobante	
		                  ,cu.BusinessName                                                     as razonSocialComprador
		                  ,cu.IDCard                                                           as identificacionComprador
		                  ,cl.direccion                                                        as direccionComprador
		                  ,REPLACE(ISNULL(cl.correo , 'S/N'),';',',')                          as emailComprador
		                  ,REPLACE(ISNULL(cl.telefono, 'S/N'),';',',')                         as telefonoComprador
		                  ,ci.descripcion                                                      as ciudadComprador
		                  ,CAST(av.totalSinImpuestos as numeric(18,2))                         as subTotalSinImpuestos
		                  ,CAST(av.totalDescuento as numeric(18,2))                            as totalDescuento
		                  ,CAST(av.propina as numeric(18,2))                                   as propina
		                  ,CAST(av.importeTotal as numeric(18,2))                              as importeTotal		
		                  ,CAST(0 as numeric(18,2))                                            as totalIce
                          ,CAST(0 as numeric(18,2))                                            as irbpnr
		                  ,av.observacion 
	                FROM Ventas.Aprob_Document        av WITH (NOLOCK)
	                INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente         = av.idCliente
                    INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision    = av.idPuntoEmision 
	                INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                    INNER JOIN dbo.Entidad            en WITH (NOLOCK) ON en.idEntidad         = es.idEntidad
                    INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId
                     LEFT JOIN dbo.Ciudad             ci WITH (NOLOCK) ON ci.idCiudad          = cl.idCiudad 
	                WHERE av.idAprob_Document = @id

                    SELECT ar.codigo
		                  ,CAST(ad.cantidad as numeric(18,2))            as cantidad 
		                  ,ad.descripcion 
		                  ,CAST(ad.precioUnitario as numeric(18,2))      as precioUnitario 
                          ,CAST(0 as numeric(18,2))                      as subsidio 
		                  ,CAST(0 as numeric(18,2))                      as precioSinSubsidio
		                  ,CAST(ad.descuento as numeric(18,2))           as valorDescuento
		                  ,CAST(precioTotalSinImpuesto as numeric(18,2)) as precioTotal
		                  ,me.descripcion                                as medida
                          ,ad.nota
	                FROM Ventas.Aprob_Document_Detailt ad WITH (NOLOCK)
	                INNER JOIN dbo.Medida              me WITH (NOLOCK) ON me.idMedida   = ad.idMedida
	                INNER JOIN dbo.Articulo            ar WITH (NOLOCK) ON ar.idArticulo = ad.idArticulo 
	                WHERE ad.idAprob_Document = @id 
                      AND ad.estado = 1
                    ORDER BY ad.idAprob_Document_Detailt ASC
                END 
    
            

            IF @codDoc = '01'
                BEGIN
                    DECLARE @importeTotal NUMERIC(18,2)

                    SELECT TOP 1 @importeTotal = importeTotal FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

                    SELECT descripcion 
		                  ,@importeTotal as valor
	                FROM dbo.FormaPagoSri WITH (NOLOCK) 
	                WHERE codigo = '20'
                END 

            SELECT ia.nombre
		          ,ia.valor 
	        FROM InfoAdicionalDoc ia
	        WHERE ia.idComprobante = @id AND ia.idTipoDocumento = @idTipoDocumento

            SELECT 'Subtotal' + ' ' + ti.descripcion as descripcion
                  ,ISNULL
                  ((
                    SELECT SUM(CAST(ai.TaxBase as numeric(18,2)))
                    FROM Ventas.AprobVentasImpuesto ai WITH (NOLOCK) 
                    WHERE ai.AprobDocumentId = @id 
                      AND ai.TaxPercentId = ti.idTipoIva
                      AND ai.[Enabled] = 1

                  ),0) as subTotal
            FROM dbo.TipoIva ti WITH (NOLOCK)
            WHERE CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)


            SELECT ti.descripcion as descripcion
                  ,CAST(ISNULL
                  ((
                    SELECT SUM(CAST(ai.TaxBase as numeric(18,2)))
                    FROM Ventas.AprobVentasImpuesto ai WITH (NOLOCK) 
                    WHERE ai.AprobDocumentId = @id 
                      AND ai.TaxPercentId = ti.idTipoIva
                      AND ai.[Enabled] = 1

                  ),0) * porcentaje / 100 as numeric(18,2)) as iva
            FROM dbo.TipoIva ti WITH (NOLOCK) 
            WHERE ti.porcentaje > 0 
              AND CAST(@fechaEmision as date) BETWEEN CAST(fechaInicio as date) AND CAST(ISNULL(fechaExpiracion,GETDATE()) as date)
        
            RETURN 
    END 
    
    --> Reporte Historial 
    IF @tipo = 2
        BEGIN
            
            SELECT @id = id  FROM OPENJSON(@json) WITH (id INT, codDoc VARCHAR(10))

            SELECT ad.idAprob_Document                        as uniqueId
                  ,cu.IDCard                                  as identificacionCompador
                  ,cu.BusinessName                            as razonSocialComprador
                  ,FORMAT(ad.fechaEmision,'dd/MM/yyyy HH:mm') as fechaEmision
                  ,og.descripcion                             as docOrigen
                  ,td.descripcion                             as docDestino
                  ,CAST(ad.importeTotal as numeric(18,2))     as importeTotal
                  ,us.nombreUsuario                           as usuario
            FROM Ventas.Aprob_Document   ad WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente       = ad.idCliente
            INNER JOIN dbo.Usuario       us WITH (NOLOCK) ON us.idUsuario       = ad.idUsuario
            INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.idTipoDocumento = ad.idTipoDocumento
            INNER JOIN dbo.TipoDocumento og WITH (NOLOCK) ON og.idTipoDocumento = ad.idTipoDocOrigen
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id              = cl.CustomerId
            WHERE ad.idAprob_Document = @id

            SELECT CASE WHEN hv.idProForma    > 0 THEN pr.serieComprobante
			            WHEN hv.idNotaEntrega > 0 THEN ne.serieComprobante 
			                                      ELSE '' 
                   END as serieComprobante

	              ,CASE WHEN hv.idProForma    > 0 THEN FORMAT(pr.fechaEmision,'dd/MM/yyyy HH:mm') 
	                    WHEN hv.idNotaEntrega > 0 THEN FORMAT(ne.fechaEmision,'dd/MM/yyyy HH:mm') 
                   END as fechaEmision
            FROM Ventas.Aprob_Document_Hist hv WITH (NOLOCK)
            LEFT JOIN dbo.Proforma          pr WITH (NOLOCK) ON pr.idProforma    = hv.idProforma
            LEFT JOIN dbo.NotaEntrega       ne WITH (NOLOCK) ON ne.idNotaEntrega = hv.idNotaEntrega
            WHERE hv.idAprob_Document = @id
            ORDER BY serieComprobante ASC

            SELECT us.nombreUsuario                                               as usuario
                  ,CASE WHEN va.idFactura     > 0 THEN de.serieComprobante 
	                    WHEN va.idNotaEntrega > 0 THEN ne.serieComprobante 
                   END as serieComprobante
                  ,FORMAT(va.fechaRegistro,'dd/MM/yyyy HH:mm')                    as fechaRegistro
            FROM Ventas.Aprob_Document_Audit    va WITH (NOLOCK)
            INNER JOIN dbo.Usuario              us WITH (NOLOCK) ON us.idUsuario              = va.idUsuario
             LEFT JOIN dbo.Factura              fa WITH (NOLOCK) ON fa.idFactura              = va.idFactura
             LEFT JOIN dbo.NotaEntrega          ne WITH (NOLOCK) ON ne.idNotaEntrega          = va.idNotaEntrega
             LEFT JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fa.idDocumentoElectronico
            WHERE va.idAprob_Document = @id

            RETURN 
        END 

    --> Reporte general de historial
    IF  @tipo =  3
        BEGIN
            --> Sql
	        DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX)  

            --> Filters
            DECLARE @checkBoxFecha BIT 
                   ,@codEstab      VARCHAR(25) 
                   ,@idCliente     INT 
                   ,@idEntidad     INT
                   ,@idUsuario     INT
                   ,@codEstado     VARCHAR(5)
                   ,@dateStart     DATETIME2 
                   ,@dateEnd       DATETIME2 
                   ,@secuencial    VARCHAR(100) 

            SELECT @checkBoxFecha = checkBoxFecha
		          ,@codEstab      = codEstab
		          ,@idCliente     = byCliente
		          ,@codEstado     = byEstado
		          ,@idUsuario     = byUsuario
		          ,@dateStart     = fechaInicio
		          ,@dateEnd       = fechaFin
		          ,@secuencial    = LTRIM(TRIM(nroSecuencial))
	        FROM OPENJSON(@json) WITH
            (    
                 checkBoxFecha   BIT  
		        ,codEstab        VARCHAR(25)
		        ,byCliente       INT 
		        ,byEstado        VARCHAR(5) 
		        ,byUsuario       INT
		        ,fechaInicio     DATETIME2
		        ,fechaFin        DATETIME2
		        ,nroSecuencial   VARCHAR(20)
            )

            SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

            SET @params = '@idEntidad         INT
						  ,@idEstablecimiento INT
						  ,@idCliente         INT
						  ,@idUsuario         INT
                          ,@idEstadoDocumento INT
						  ,@dateStart         DATETIME2
						  ,@dateEnd           DATETIME2'

            SET @sql = 'SELECT ad.idAprob_Document 
                              ,cu.IdCard
                              ,cu.TradeName
                              ,og.codigo			                                                                                                                                            as codDocOrigen
	                          ,CASE WHEN hs.idNotaEntrega  > 0 THEN un.nombreUsuario                              WHEN hs.idProforma > 0 THEN up.nombreUsuario                              END as usuarioOrigen
	                          ,CASE WHEN hs.idNotaEntrega  > 0 THEN ne.serieComprobante                           WHEN hs.idProforma > 0 THEN pr.serieComprobante                           END as serieOrigen
	                          ,CASE WHEN hs.idNotaEntrega  > 0 THEN CAST(ne.total as numeric(18,2))               WHEN hs.idProforma > 0 THEN CAST(pr.total as numeric(18,2))               END as totalOrigen
                              ,CASE WHEN hs.idNotaEntrega  > 0 THEN FORMAT(ne.fechaEmision ,''dd/MM/yyyy hh:mm'') WHEN hs.idProforma > 0 THEN FORMAT(pr.fechaEmision ,''dd/MM/yyyy hh:mm'') END as fechaOrigen
	                          ,ud.nombreUsuario		                                                                                                                                            as usuarioCreador
	                          ,IIF(td.codigo = ''FV'',''PF'',td.codigo)			                                                                                                                as codDoc
	                          ,og.descripcion + '' / '' + td.descripcion                                                                                                                        as conversion
                              ,ad.serieComprobante
	                          ,dg.serieComprobante	                                                                                                                                          as serieGuia
	                          ,FORMAT(dg.fechaEmision ,''dd/MM/yyyy hh:mm'')                                                                                                                  as fechaGuia
                              ,CAST(ad.importeTotal as numeric(18,2))                                                                                                                         as importeTotal
	                          ,FORMAT(ad.fechaEmision ,''dd/MM/yyyy hh:mm'')                                                                                                                  as fechaEmision
	                          ,ua.nombreUsuario		                                                                                                                                          as usuarioDestino
	                          ,td.codigo                                                                                                                                                      as codDocDestino
                              ,CASE WHEN au.idFactura > 0 THEN de.serieComprobante                           WHEN au.idNotaEntrega > 0 THEN nd.serieComprobante                           END as serieDestino 
	                          ,CASE WHEN au.idFactura > 0 THEN FORMAT(de.fechaEmision ,''dd/MM/yyyy hh:mm'') WHEN au.idNotaEntrega > 0 THEN FORMAT(nd.fechaEmision ,''dd/MM/yyyy hh:mm'') END as fechaDestino
                              ,CASE WHEN au.idFactura > 0 THEN CAST(fa.total as numeric(18,2))               WHEN au.idNotaEntrega > 0 THEN CAST(pr.total as numeric(18,2))               END as totalDestino
	                          ,es.descripcion		                                                                                                                                          as estado
                       FROM Ventas.Aprob_Document_Hist        hs WITH (NOLOCK)
                        LEFT JOIN dbo.Proforma                pr WITH (NOLOCK) ON pr.idProforma             = hs.idProforma 
                        LEFT JOIN dbo.Usuario                 up WITH (NOLOCK) ON up.idUsuario              = pr.idUsuario
                        LEFT JOIN dbo.NotaEntrega             ne WITH (NOLOCK) ON ne.idNotaEntrega          = hs.idNotaEntrega
                        LEFT JOIN dbo.Usuario                 un WITH (NOLOCK) ON un.idUsuario              = ne.idUsuario
                       INNER JOIN Ventas.Aprob_Document       ad WITH (NOLOCK) ON ad.idAprob_Document       = hs.idAprob_Document
                       INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision         = ad.idPuntoEmision
                        LEFT JOIN dbo.GuiaRemision            gr WITH (NOLOCK) ON gr.idAprob_Document       = ad.idAprob_Document
                       INNER JOIN dbo.Usuario                 ud WITH (NOLOCK) ON ud.idUsuario              = ad.idUsuario
                       INNER JOIN dbo.TipoDocumento           td WITH (NOLOCK) ON td.idTipoDocumento        = ad.idTipoDocumento
                       INNER JOIN dbo.TipoDocumento           og WITH (NOLOCK) ON og.idTipoDocumento        = ad.idTipoDocOrigen
                       INNER JOIN dbo.EstadoPago              es WITH (NOLOCK) ON es.idEstadoPago           = ad.idEstadoDocumento
                       INNER JOIN dbo.Cliente                 cl WITH (NOLOCK) ON cl.idCliente		        = ad.idCliente
                        LEFT JOIN Ventas.Aprob_Document_Audit au WITH (NOLOCK) ON au.idAprob_Document       = ad.idAprob_Document
                        LEFT JOIN dbo.NotaEntrega             nd WITH (NOLOCK) ON nd.idNotaEntrega          = au.idNotaEntrega
                        LEFT JOIN dbo.Factura                 fa WITH (NOLOCK) ON fa.idFactura		        = au.idFactura
                        LEFT JOIN dbo.Usuario                 ua WITH (NOLOCK) ON ua.idUsuario			    = au.idUsuario
                        LEFT JOIN dbo.DocumentoElectronico    dg WITH (NOLOCK) ON dg.idDocumentoElectronico = gr.idDocumentoElectronico
                        LEFT JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = fa.idDocumentoElectronico
                       INNER JOIN Customer.Customer           cu WITH (NOLOCK) ON cu.Id			            = cl.CustomerId
                       INNER JOIN Sri.Establecimiento         ss WITH (NOLOCK) ON ss.idEstablecimiento      = pe.idEstablecimiento
                       WHERE ss.idEntidad = @idEntidad '
            
            IF EXISTS(SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @userRoleId AND viewOthersDocs=0)
                BEGIN 
                    SELECT TOP 1 @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId
                END

            IF @codEstab IS NOT NULL
                BEGIN
                    DECLARE @idEstablecimiento INT

                    SELECT TOP 1 @idEstablecimiento = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

                    SET @sql = @sql + 'AND pe.idEstablecimiento = @idEstablecimiento '
                END

            IF @secuencial IS NOT NULL
		        BEGIN
			        SET @sql = @sql + 'AND ad.secuencial BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
		        END

            IF @idCliente > 0
				BEGIN
					SET @sql = @sql + 'AND ad.idCliente = @idCliente '
				END

            IF @codEstado IS NOT NULL
				BEGIN
                    DECLARE @idEstadoDocumento INT 

                    SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = @codEstado

				    SET @sql = @sql + 'AND ad.idEstadoDocumento = @idEstadoDocumento '
				END

            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND es.codigo NOT IN (''A'') '
                END 

            IF @idUsuario > 0
				BEGIN
					SET @sql = @sql + 'AND ad.idUsuario = @idUsuario '
				END 
			
			IF @checkBoxFecha = 1 
				BEGIN
					SET @sql = @sql + 'AND CAST(ad.fechaEmision as date) BETWEEN CAST(@dateStart as date) AND CAST(@dateEnd as date) '
				END


            SET @sql = @sql + 'ORDER BY TradeName ASC '


             SELECT entidad                                                                   as razonSocial 
                   ,rucEmpresa                                                                as ruc
                   ,direccion                                                                 as direccionEntidad 
                   ,nombreUsuario                                                             as usuario
                   ,'Reporte - Trasabildiad de Aprobaciones'                                  as tituloReporte
                   ,FORMAT(@dateStart, 'dd/MM/yyyy') + ' a ' + FORMAT(@dateEnd, 'dd/MM/yyyy') as filtroFecha
            FROM v_usuario
            WHERE idUsuarioRol = @userRoleId

            EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad         = @idEntidad
			                  ,@idEstablecimiento = @idEstablecimiento
			                  ,@idCliente         = @idCliente
			                  ,@idEstadoDocumento = @idEstadoDocumento 
			                  ,@idUsuario         = @idUsuario
			                  ,@dateStart         = @dateStart
			                  ,@dateEnd           = @dateEnd

            RETURN 
        END 
    
     
END 