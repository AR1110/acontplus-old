USE AcontPlus
GO 
 
-- exec ReporteVentas.Aprob_Document '{"id":1164,"codEstab":"ESTAB-000000002","codDoc":"NE"}'
CREATE OR ALTER PROCEDURE Ventas.Aprob_Document_Report @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT

    --> Filters Generales
    DECLARE @id INT ,@codDoc VARCHAR(10)

    --> Variables
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

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
                  ,CASE ad.docOrigen WHEN 'NE' THEN 'Nota Entrega' 
                                     WHEN 'PR' THEN 'Proforma'
                   END                                        as docOrigen
                  ,CASE ad.codDoc WHEN '01' THEN 'Factura'
                                  WHEN 'NE' THEN 'Nota Entrega'
                   END                                        as docDestino
                  ,CAST(ad.importeTotal as numeric(18,2))     as importeTotal
                  ,us.nombreUsuario                           as usuario
            FROM Ventas.Aprob_Document   ad WITH (NOLOCK)
            INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = ad.idCliente
            INNER JOIN dbo.Usuario       us WITH (NOLOCK) ON us.idUsuario = ad.idUsuario
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
            WHERE ad.idAprob_Document = @id

            SELECT serie        as seriComprobante
	              ,CASE codDocumento WHEN 'NE' THEN (SELECT TOP 1 FORMAT(ne.fechaEmision,'dd/MM/yyyy HH:mm') FROM dbo.NotaEntrega ne WITH (NOLOCK) WHERE ne.idNotaEntrega = hv.idDocumento) 
	                                 WHEN 'PR' THEN (SELECT TOP 1 FORMAT(pr.fechaEmision,'dd/MM/yyyy HH:mm') FROM dbo.Proforma pr WITH (NOLOCK) WHERE pr.idProforma = hv.idDocumento) 
                   END          as fechaEmision
            FROM Ventas.Aprob_Document_Hist hv WITH (NOLOCK)
            WHERE hv.idAprob_Document = @id
            ORDER BY hv.serie ASC

            SELECT us.nombreUsuario                                               as usuario
                  ,Common.ufnGetSerieDocument(va.estab,va.ptoEmi,va.secuencial,0) as serieComprobante
                  ,FORMAT(va.fechaRegistro,'dd/MM/yyyy HH:mm')                    as fechaRegistro
            FROM Ventas.Aprob_Document_Audit va WITH (NOLOCK)
            INNER JOIN dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = va.idUsuario
            WHERE va.idAprob_Document = @id

            RETURN 
        END 
END 