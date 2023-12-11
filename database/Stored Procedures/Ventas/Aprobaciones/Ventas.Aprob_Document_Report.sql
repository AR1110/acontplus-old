USE AcontPlus
GO 
 
-- exec ReporteVentas.Aprob_Document '{"id":1164,"codEstab":"ESTAB-000000002","codDoc":"NE"}'
CREATE OR ALTER PROCEDURE ReporteVentas.Aprob_Document @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    DECLARE @id INT ,@codDoc VARCHAR(10) ,@uniqueId VARCHAR(200) ,@idTipoDocumento INT 

    SELECT @id = id ,@codDoc = codDoc FROM OPENJSON(@json) WITH (id INT, codDoc VARCHAR(10))

    SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'APR'

    SELECT TOP 1 @uniqueId = uniqueId FROM Ventas.Aprob_Document WITH (NOLOCK) WHERE idAprob_Document = @id

    IF @codDoc = '01'
        BEGIN
            SELECT IIF(av.codDoc = '01','PRE FACTURA','Nota de Entrega Por Aprobar')    as tipoDoc
		          ,av.claveAcceso
		          ,av.claveAcceso  as codigoAutorizacion
                  ,CASE WHEN pe.ambiente = '1' THEN 'Pruebas' ELSE 'Producción' END     as ambiente
		          ,CASE WHEN av.tipoEmision = '1' THEN 'NORMAL' ELSE '' END             as emision
                  ,en.razonSocial
                  ,en.ruc
		          ,es.nombreComercial
		          ,es.dirEstablecimiento 
		          ,es.correo                                                           as emailEstablecimiento
		          ,es.telefono                                                         as telefonoEstablecimiento 
		          ,es.contribuyenteRimpe
                  ,es.obligadoContabilidad
		          ,CONVERT(NVARCHAR, FORMAT(av.fechaEmision, 'dd/MM/yyyy hh:mm:ss'))   as fechaEmision
                  ,dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,av.secuencial)        as serieComprobante	
		          ,cl.nombreFiscal                                                     as razonSocialComprador
		          ,cl.numeroIdentificacion                                             as identificacionComprador
		          ,cl.direccion                                                        as direccionComprador
		          ,REPLACE(ISNULL(cl.correo , 'S/N'),';',',')                          as correoComprador
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
            INNER JOIN dbo.Entidad            en WITH (NOLOCK) ON en.idEntidad      = av.idEntidad
	        INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision = av.idPuntoEmision 
	        INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
	        INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente      = av.idCliente
             LEFT JOIN dbo.Ciudad             ci WITH (NOLOCK) ON ci.idCiudad       = cl.idCiudad 
	        WHERE av.idAprob_Document = @id
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
		          ,CONVERT(NVARCHAR, FORMAT(av.fechaEmision, 'dd/MM/yyyy hh:mm:ss'))   as fechaEmision
                  ,dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,av.secuencial)        as serieComprobante	
		          ,cl.nombreFiscal                                                     as razonSocialComprador
		          ,cl.numeroIdentificacion                                             as identificacionComprador
		          ,cl.direccion                                                        as direccionComprador
		          ,REPLACE(ISNULL(cl.correo , 'S/N'),';',',')                          as correoComprador
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
            INNER JOIN dbo.Entidad            en WITH (NOLOCK) ON en.idEntidad      = av.idEntidad
	        INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision = av.idPuntoEmision 
	        INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
	        INNER JOIN dbo.Cliente            cl WITH (NOLOCK) ON cl.idCliente      = av.idCliente
             LEFT JOIN dbo.Ciudad             ci WITH (NOLOCK) ON ci.idCiudad       = cl.idCiudad 
	        WHERE av.idAprob_Document = @id
        END 
    
    SELECT ar.codigo
		  ,CAST(ad.cantidad as numeric(18,2))            as cantidad 
		  ,ad.descripcion 
		  ,CAST(ad.precioUnitario as numeric(18,2))      as precioUnitario 
          ,CAST(0 as numeric(18,2))                      as subsidio 
		  ,CAST(0 as numeric(18,2))                      as precioSinSubsidio
		  ,CAST(ad.descuento as numeric(18,2))           as valorDescuento
		  ,CAST(precioTotalSinImpuesto as numeric(18,2)) as precioTotal
		  ,me.descripcion                                as medida
	FROM Ventas.Aprob_Document_Detailt ad WITH (NOLOCK)
	INNER JOIN dbo.Medida              me WITH (NOLOCK) ON me.idMedida   = ad.idMedida
	INNER JOIN dbo.Articulo            ar WITH (NOLOCK) ON ar.idArticulo = ad.idArticulo 
	WHERE ad.uniqueId = @uniqueId AND ad.estado = 1

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
            SELECT  CAST(SUM(ai.TaxBase) as numeric(18,2)) 
            FROM Ventas.AprobVentasImpuesto ai WITH (NOLOCK) 
            WHERE ai.AprobDocumentId = @id AND ai.TaxPercentId = ti.idTipoIva

          ),0) as subTotal
    FROM dbo.TipoIva ti WITH (NOLOCK) 


    SELECT ti.descripcion as descripcion
          ,ISNULL
          ((
            SELECT  CAST(SUM(ai.TaxValue) as numeric(18,2)) 
            FROM Ventas.AprobVentasImpuesto ai WITH (NOLOCK) 
            WHERE ai.AprobDocumentId = @id AND ai.TaxPercentId = ti.idTipoIva

          ),0) as iva
    FROM dbo.TipoIva ti WITH (NOLOCK) 
    WHERE ti.porcentaje > 0 

END 