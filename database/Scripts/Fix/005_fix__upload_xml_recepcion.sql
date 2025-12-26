--select CONVERT(xml, DECOMPRESS(xmlCOmpressed)) from Recepcion.DocumentoRecibido where claveAcceso = '0305202401070154187200120010010000028671980911010'
declare @idUsuarioRol INT = 75
,@json VARCHAR(1000) = '{
  "codEstab": "ESTAB-000000048"
}'
,@codDoc VARCHAR(2) = '01'
,@claveAcceso AS VARCHAR(49) = '0305202401070154187200120010010000028671980911010'
,@versionComp VARCHAR(5) = '2.1.0'
,@fechaEmision VARCHAR(10) = '03/05/2024'
,@xmlDoc XML =
CONVERT(XML, '
<autorizacion>
    <estado>AUTORIZADO</estado>
    <numeroAutorizacion>0305202401070154187200120010010000028671980911010</numeroAutorizacion>
    <fechaAutorizacion>2024-05-03T09:24:12-05:00</fechaAutorizacion>
    <ambiente>PRODUCCIÓN</ambiente>
    <comprobante>&lt;factura id="comprobante" version="2.1.0"&gt;&lt;infoTributaria&gt;&lt;ambiente&gt;2&lt;/ambiente&gt;&lt;tipoEmision&gt;1&lt;/tipoEmision&gt;&lt;razonSocial&gt;VERA AVILA NESTOR NEMESIO&lt;/razonSocial&gt;&lt;nombreComercial&gt;VERA AVILA NESTOR NEMESIO&lt;/nombreComercial&gt;&lt;ruc&gt;0701541872001&lt;/ruc&gt;&lt;claveAcceso&gt;0305202401070154187200120010010000028671980911010&lt;/claveAcceso&gt;&lt;codDoc&gt;01&lt;/codDoc&gt;&lt;estab&gt;001&lt;/estab&gt;&lt;ptoEmi&gt;001&lt;/ptoEmi&gt;&lt;secuencial&gt;000002867&lt;/secuencial&gt;&lt;dirMatriz&gt;FLOR DE BASTION BLOQUE 21&lt;/dirMatriz&gt;&lt;/infoTributaria&gt;&lt;infoFactura&gt;&lt;fechaEmision&gt;03/05/2024&lt;/fechaEmision&gt;&lt;dirEstablecimiento&gt;FLOR DE BASTION BLOQUE 21&lt;/dirEstablecimiento&gt;&lt;obligadoContabilidad&gt;NO&lt;/obligadoContabilidad&gt;&lt;tipoIdentificacionComprador&gt;04&lt;/tipoIdentificacionComprador&gt;&lt;razonSocialComprador&gt;FERRETERÍA SALINAS&lt;/razonSocialComprador&gt;&lt;identificacionComprador&gt;0102289790001&lt;/identificacionComprador&gt;&lt;direccionComprador&gt;AV. 9 DE OCTUBRE S/N Y AGUARICO BARRIO 20 DE MAYO&lt;/direccionComprador&gt;&lt;totalSinImpuestos&gt;120.49&lt;/totalSinImpuestos&gt;&lt;totalDescuento&gt;0.00&lt;/totalDescuento&gt;&lt;totalConImpuestos&gt;&lt;totalImpuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;descuentoAdicional&gt;0&lt;/descuentoAdicional&gt;&lt;baseImponible&gt;120.49&lt;/baseImponible&gt;&lt;valor&gt;18.07&lt;/valor&gt;&lt;/totalImpuesto&gt;&lt;/totalConImpuestos&gt;&lt;propina&gt;0&lt;/propina&gt;&lt;importeTotal&gt;138.56&lt;/importeTotal&gt;&lt;moneda&gt;DOLAR&lt;/moneda&gt;&lt;pagos&gt;&lt;pago&gt;&lt;formaPago&gt;20&lt;/formaPago&gt;&lt;total&gt;138.56&lt;/total&gt;&lt;plazo&gt;0&lt;/plazo&gt;&lt;unidadTiempo&gt;días&lt;/unidadTiempo&gt;&lt;/pago&gt;&lt;/pagos&gt;&lt;/infoFactura&gt;&lt;detalles&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0001&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0001&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;CUCHILLA FORRO 23CM LARG&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;4.640000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;13.92&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;13.92000&lt;/baseImponible&gt;&lt;valor&gt;2.09&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0002&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0002&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;CUCHILLA T/NAVAJA BLISTER&lt;/descripcion&gt;&lt;cantidad&gt;2.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.920000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;3.84&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;3.84000&lt;/baseImponible&gt;&lt;valor&gt;0.58&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0014&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0014&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;ANZUELO KIRBY ARGOLLADO #12 YOUVELLA&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;2.370000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;2.37&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;2.37000&lt;/baseImponible&gt;&lt;valor&gt;0.36&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0015&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0015&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;ANZUELO KIRBY ARGOLLADO #13 YOUVELLA&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.820000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;1.82&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;1.82000&lt;/baseImponible&gt;&lt;valor&gt;0.27&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0016&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0016&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;ANZUELO KIRBY ARGOLLADO #14 YOUVELLA&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.970000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;1.97&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;1.97000&lt;/baseImponible&gt;&lt;valor&gt;0.30&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0017&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0017&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;ANZUELO KIRBY ARGOLLADO #15 YOUVELLA&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.790000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;1.79&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;1.79000&lt;/baseImponible&gt;&lt;valor&gt;0.27&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0018&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0018&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;ANZUELO KIRBY ARGOLLADO #16 YOUVELLA&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.500000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;1.50&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;1.50000&lt;/baseImponible&gt;&lt;valor&gt;0.22&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0019&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0019&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;ANZUELO KIRBY ARGOLLADO #17 YOUVELLA&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.550000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;1.55&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;1.55000&lt;/baseImponible&gt;&lt;valor&gt;0.23&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0020&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0020&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;ANZUELO KIRBY  #18 YOUVELLA&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.470000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;1.47&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;1.47000&lt;/baseImponible&gt;&lt;valor&gt;0.22&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0082&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0082&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;LINTERNA ACUATICA FRONTAL&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;6.250000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;18.75&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;18.75000&lt;/baseImponible&gt;&lt;valor&gt;2.81&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;A0095&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;A0095&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;PESAS  CAJA AMARILLA DE 80PZ&lt;/descripcion&gt;&lt;cantidad&gt;1.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;4.910000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;4.91&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;4.91000&lt;/baseImponible&gt;&lt;valor&gt;0.74&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0049&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0049&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;CANDADO BICICLETA GRANDE&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;2.680000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;8.04&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;8.04000&lt;/baseImponible&gt;&lt;valor&gt;1.21&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0050&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0050&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;CANDADO BICICLETA MEDIANO&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;2.050000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;6.15&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;6.15000&lt;/baseImponible&gt;&lt;valor&gt;0.92&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0051&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0051&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;CANDADO BICICLETA PEQUEÑO&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.570000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;4.71&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;4.71000&lt;/baseImponible&gt;&lt;valor&gt;0.71&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0092&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0092&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;LINTERNA LED A BOTON  USB&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;3.820000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;11.46&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;11.46000&lt;/baseImponible&gt;&lt;valor&gt;1.72&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0093&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0093&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;LINTERNA LED USB&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;4.370000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;13.11&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;13.11000&lt;/baseImponible&gt;&lt;valor&gt;1.97&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0217&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0217&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;AFILADOR DE CUCHILLO&lt;/descripcion&gt;&lt;cantidad&gt;5.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;1.770000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;8.85&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;8.85000&lt;/baseImponible&gt;&lt;valor&gt;1.33&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0355&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0355&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;LLAVE P/FILTRO DE CARRO CORREA AMARILLA&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;2.380000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;7.14&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;7.14000&lt;/baseImponible&gt;&lt;valor&gt;1.07&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;detalle&gt;&lt;codigoPrincipal&gt;B0357&lt;/codigoPrincipal&gt;&lt;codigoAuxiliar&gt;B0357&lt;/codigoAuxiliar&gt;&lt;descripcion&gt;LLAVE P/FILTRO DE CARRO&lt;/descripcion&gt;&lt;cantidad&gt;3.000000&lt;/cantidad&gt;&lt;precioUnitario&gt;2.380000&lt;/precioUnitario&gt;&lt;descuento&gt;0.00&lt;/descuento&gt;&lt;precioTotalSinImpuesto&gt;7.14&lt;/precioTotalSinImpuesto&gt;&lt;impuestos&gt;&lt;impuesto&gt;&lt;codigo&gt;2&lt;/codigo&gt;&lt;codigoPorcentaje&gt;4&lt;/codigoPorcentaje&gt;&lt;tarifa&gt;15&lt;/tarifa&gt;&lt;baseImponible&gt;7.14000&lt;/baseImponible&gt;&lt;valor&gt;1.07&lt;/valor&gt;&lt;/impuesto&gt;&lt;/impuestos&gt;&lt;/detalle&gt;&lt;/detalles&gt;&lt;infoAdicional&gt;&lt;campoAdicional nombre="Descripción"&gt;VENDEDOR  SORAIDA M  CIUDAD  COCA&lt;/campoAdicional&gt;&lt;/infoAdicional&gt;&lt;ds:Signature xmlns:ds="http://www.w3.org/2000/09/xmldsig#" xmlns:etsi="http://uri.etsi.org/01903/v1.3.2#" Id="Signature533081"&gt;&lt;ds:SignedInfo Id="Signature-SignedInfo791058"&gt;&lt;ds:CanonicalizationMethod Algorithm="http://www.w3.org/TR/2001/REC-xml-c14n-20010315" /&gt;&lt;ds:SignatureMethod Algorithm="http://www.w3.org/2000/09/xmldsig#rsa-sha1" /&gt;&lt;ds:Reference Id="SignedPropertiesID854619" Type="http://uri.etsi.org/01903#SignedProperties" URI="#Signature533081-SignedProperties594321"&gt;&lt;ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /&gt;&lt;ds:DigestValue&gt;jwMNDcp/Nr85oYrQYX5yy7aLKCY=&lt;/ds:DigestValue&gt;&lt;/ds:Reference&gt;&lt;ds:Reference URI="#Certificate1754205"&gt;&lt;ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /&gt;&lt;ds:DigestValue&gt;5iEUlavNMbScACk0AEdL6ldt3fg=&lt;/ds:DigestValue&gt;&lt;/ds:Reference&gt;&lt;ds:Reference Id="Reference-ID-210923" URI="#comprobante"&gt;&lt;ds:Transforms&gt;&lt;ds:Transform Algorithm="http://www.w3.org/2000/09/xmldsig#enveloped-signature" /&gt;&lt;/ds:Transforms&gt;&lt;ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /&gt;&lt;ds:DigestValue&gt;yIimiPyQZMXmuGR9/7jNn/jL0sg=&lt;/ds:DigestValue&gt;&lt;/ds:Reference&gt;&lt;/ds:SignedInfo&gt;&lt;ds:SignatureValue Id="SignatureValue104861"&gt;
bw2TAXmIPpk8fAhCQXrQ7WyMvHw9DxnbKG879wxJK6mXGQxie8jmeqho0YFbi05V7SoM1WZnqohY
0W3hjUDZlGIiyXzlprIhDWvMZpuwHZlKibbYcmdVUF42VGs3KRzdc2xXZW3+uCzboUFXeTGPSwLx
ZLPrhOXjumSy4Jkk06kn0Vf1HytKr49RdI84Ed6M2FsBziYz50ZwuvJroCaim3Y6yIBcy6LgEWxF
4hiegfoq/HXPcL0rOWEKfu7Am0uSByb3ptJFwCFu0vbOWR3686BIZPF1kM4pIRScbf8pwSwjg5uW
4wMHjFMHn/Q9mu49mujL5SzJLvzOfPyMCNoaIA==
&lt;/ds:SignatureValue&gt;&lt;ds:KeyInfo Id="Certificate1754205"&gt;&lt;ds:X509Data&gt;&lt;ds:X509Certificate&gt;
MIIJGjCCBwKgAwIBAgIIdze2rhJBWwswDQYJKoZIhvcNAQELBQAwgbgxCzAJBgNVBAYTAkVTMUQw
QgYDVQQHDDtCYXJjZWxvbmEgKHNlZSBjdXJyZW50IGFkZHJlc3MgYXQgd3d3LnVhbmF0YWNhLmNv
bS9hZGRyZXNzKTEWMBQGA1UECgwNVUFOQVRBQ0EgUy5BLjEVMBMGA1UECwwMVFNQLVVBTkFUQUNB
MRowGAYDVQQDDBFVQU5BVEFDQSBDQTIgMjAxNjEYMBYGA1UEYQwPVkFURVMtQTY2NzIxNDk5MB4X
DTI0MDQxMjAwMzIwMFoXDTI1MDQxMjAwMzIwMFowgZgxCzAJBgNVBAYTAkVDMRMwEQYDVQQEDApW
RVJBIEFWSUxBMRcwFQYDVQQqDA5ORVNUT1IgTkVNRVNJTzEZMBcGA1UEBRMQSURDRUMtMDcwMTU0
MTg3MjEiMCAGA1UEAwwZTkVTVE9SIE5FTUVTSU8gVkVSQSBBVklMQTEcMBoGA1UEYQwTVElORUMt
MDcwMTU0MTg3MjAwMTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAJF9dbXDAJ9qUZRF
gfvZVneCljYOQETmEdOEanXcZWyZV95HCxExNQNBtq7bcbdAZ1f7OgpmuwJkRiqrB0hCfuUqyjsH
L2G/4bl1vX0ubHbDPmL38rT6sjzjywS3ypwKbPiQ/rWrL1AxfBnaj0jw262tOcJWWAMhvs2ZrkUL
muNq3YTX2Bskv/Z4FFT5WURguV2O6bUV6fqUMkw53BA/fkulTLRNocq+9C8AS/7YDm/36kM+jKBU
DIIvedY2zD8EwuUBCrn+HBHRD4HXbiXe5Ik49PwEV/UqNTXbILqwMYZMf0rzvP8K+HVu761OHNbX
FQXTDfILmBF1nu7vF92UF60CAwEAAaOCBEQwggRAMBsGCysGAQQBgvE2ZgMBBAwMCjA3MDE1NDE4
NzIwHgYLKwYBBAGC8TZmAwsEDwwNMDcwMTU0MTg3MjAwMTCB1wYIKwYBBQUHAQEEgcowgccwVQYI
KwYBBQUHMAKGSWh0dHA6Ly93d3cudWFuYXRhY2EuY29tL3B1YmxpYy9kb3dubG9hZC90c3BfY2Vy
dGlmaWNhdGVzL3N1Ym9yZGluYXRlMS5jcnQwNgYIKwYBBQUHMAGGKmh0dHA6Ly9vY3NwMS51YW5h
dGFjYS5jb20vcHVibGljL3BraS9vY3NwLzA2BggrBgEFBQcwAYYqaHR0cDovL29jc3AyLnVhbmF0
YWNhLmNvbS9wdWJsaWMvcGtpL29jc3AvMB0GA1UdDgQWBBS4aal6Qts5vvPtqthi6cLbL1wN5DAM
BgNVHRMBAf8EAjAAMB8GA1UdIwQYMBaAFH1X52BzzgdGqeKjaPDhEbJ0knP9MIGZBgNVHSAEgZEw
gY4wgYsGDCsGAQQBgvE2ZgIBATB7MDcGCCsGAQUFBwIBFitodHRwczovL3d3dy51YW5hdGFjYS5j
b20vcHVibGljL3BraS9kcGMtZWMvMEAGCCsGAQUFBwICMDQMMkNFUlRJRklDQURPIERFIFBFUlNP
TkEgTkFUVVJBTCBPIEZJU0lDQSBFTiBBUkNISVZPMIGPBgNVHR8EgYcwgYQwQKA+oDyGOmh0dHA6
Ly9jcmwxLnVhbmF0YWNhLmNvbS9wdWJsaWMvcGtpL2NybC9DQTJzdWJvcmRpbmFkYS5jcmwwQKA+
oDyGOmh0dHA6Ly9jcmwyLnVhbmF0YWNhLmNvbS9wdWJsaWMvcGtpL2NybC9DQTJzdWJvcmRpbmFk
YS5jcmwwDgYDVR0PAQH/BAQDAgXgMB0GA1UdJQQWMBQGCCsGAQUFBwMCBggrBgEFBQcDBDCCAXoG
A1UdEQSCAXEwggFtgRtkaXN0cmlidWNpb25lc252YUBnbWFpbC5jb22gGwYLKwYBBAGC8TZmAwGg
DAwKMDcwMTU0MTg3MqAfBgsrBgEEAYLxNmYDAqAQDA5ORVNUT1IgTkVNRVNJT6AVBgsrBgEEAYLx
NmYDA6AGDARWRVJBoBYGCysGAQQBgvE2ZgMEoAcMBUFWSUxBoCoGCysGAQQBgvE2ZgMHoBsMGUZM
T1IgREUgQkFTVElPTiBCTE9RVUUgMjGgHwYLKwYBBAGC8TZmAwigEAwOMDA1OTM5ODcwNTY3Mjig
GgYLKwYBBAGC8TZmAwmgCwwJR1VBWUFRVUlMoB4GCysGAQQBgvE2ZgMLoA8MDTA3MDE1NDE4NzIw
MDGgEwYLKwYBBAGC8TZmAwygBAwCRUOgKQYLKwYBBAGC8TZmAzKgGgwYUEVSU09OQSBOQVRVUkFM
IE8gRklTSUNBoBgGCysGAQQBgvE2ZgMzoAkMB0FSQ0hJVk8wDQYJKoZIhvcNAQELBQADggIBACz1
H6AJ7/srVUTCAmBl0Eq6CcW13qM1yFRYZrsi3IABBHCPlLnSnF7KLIaof4xA7f9wnxF4wabE18KL
YnkQiudey9tJefEi7a+GeN+QMORVex8lZE/FQtRG+jpu6tw3frT3KVue9YYvxjYc2j4M2iTZ+cNj
oNXGiOB2Q7c/4ZFoQWRW7QPjZJRZVPzfGSOv1n+zozRVqYsm2Ae6ty+A2JmGGrB28nOY0EeGTJJX
BAdl12lmW+36V9jbH74fHvXAcygLGgZ4L7PzpA5pnAxLePY8vukDOiRmTek7vikZEmarXy0GFVzG
pPkJeIDE8QqSZqx678gA68aSCEOhMh87FA8q16Y8Ay6CWeBmgGTlyPG7DPP+ofRPqXeJ3o1tQQ8w
OrP6pGaLFH0Cj/ktpFg9OvDT7Eqq95jWrfZeQ+gzkMUVAQFDwSuQVNZt0nZxoHJAWD9hoom3p6hK
JZLWnQJa4ctzHiwLCQF0KmMFEh+/18NTBK/CMJkt7bhyL+Ue7WzPSs5VycojjHA0zymdMz2mMuvb
xWuMp3OR46ZqJvYp8ioXpJSZjs+ii8SXRge+h8Zf9RBGJbs/leGXX3Fc8a7plS8Kfn1aGAbuR0A3
MF/A4HUZhNRASBaQlPjgR0Uv3/2K1hjcJbVj5INleQdrUDsjSQJQtwgEDGxZHYmeGNaSeHBc
&lt;/ds:X509Certificate&gt;&lt;/ds:X509Data&gt;&lt;ds:KeyValue&gt;&lt;ds:RSAKeyValue&gt;&lt;ds:Modulus&gt;
kX11tcMAn2pRlEWB+9lWd4KWNg5AROYR04RqddxlbJlX3kcLETE1A0G2rttxt0BnV/s6Cma7AmRG
KqsHSEJ+5SrKOwcvYb/huXW9fS5sdsM+YvfytPqyPOPLBLfKnAps+JD+tasvUDF8GdqPSPDbra05
wlZYAyG+zZmuRQua42rdhNfYGyS/9ngUVPlZRGC5XY7ptRXp+pQyTDncED9+S6VMtE2hyr70LwBL
/tgOb/fqQz6MoFQMgi951jbMPwTC5QEKuf4cEdEPgdduJd7kiTj0/ARX9So1NdsgurAxhkx/SvO8
/wr4dW7vrU4c1tcVBdMN8guYEXWe7u8X3ZQXrQ==
&lt;/ds:Modulus&gt;&lt;ds:Exponent&gt;AQAB&lt;/ds:Exponent&gt;&lt;/ds:RSAKeyValue&gt;&lt;/ds:KeyValue&gt;&lt;/ds:KeyInfo&gt;&lt;ds:Object Id="Signature533081-Object54243"&gt;&lt;etsi:QualifyingProperties Target="#Signature533081"&gt;&lt;etsi:SignedProperties Id="Signature533081-SignedProperties594321"&gt;&lt;etsi:SignedSignatureProperties&gt;&lt;etsi:SigningTime&gt;2024-05-03T09:24:09-05:00&lt;/etsi:SigningTime&gt;&lt;etsi:SigningCertificate&gt;&lt;etsi:Cert&gt;&lt;etsi:CertDigest&gt;&lt;ds:DigestMethod Algorithm="http://www.w3.org/2000/09/xmldsig#sha1" /&gt;&lt;ds:DigestValue&gt;MJRyTt3lKvKMze4Gms2FTfNUsus=&lt;/ds:DigestValue&gt;&lt;/etsi:CertDigest&gt;&lt;etsi:IssuerSerial&gt;&lt;ds:X509IssuerName&gt;2.5.4.97=#0c0f56415445532d413636373231343939,CN=UANATACA CA2 2016,OU=TSP-UANATACA,O=UANATACA S.A.,L=Barcelona (see current address at www.uanataca.com/address),C=ES&lt;/ds:X509IssuerName&gt;&lt;ds:X509SerialNumber&gt;8590535672979348235&lt;/ds:X509SerialNumber&gt;&lt;/etsi:IssuerSerial&gt;&lt;/etsi:Cert&gt;&lt;/etsi:SigningCertificate&gt;&lt;/etsi:SignedSignatureProperties&gt;&lt;/etsi:SignedProperties&gt;&lt;/etsi:QualifyingProperties&gt;&lt;/ds:Object&gt;&lt;/ds:Signature&gt;&lt;/factura&gt;</comprobante>
    <mensajes/>
</autorizacion>
')


DECLARE @idEntidad INT ,@ruc VARCHAR(20)
	,@idProveedor INT 
	,@idEstadoPago INT
	,@idTipoIdentificacion INT
	,@identificacionCliProv VARCHAR(25)
	,@razonSocial VARCHAR(300)
	,@nombreComercial VARCHAR(300)
	,@direccion VARCHAR(300)
	,@rucReceptor VARCHAR(15)
	,@comprobante VARCHAR(100)
	,@serieComprobante VARCHAR(50)
	,@importeTotal NUMERIC(18,5)
	,@idUsuario INT
	,@codEstab  VARCHAR(50)
	,@idEstab INT
	,@idDocumento INT
    ,@tipoIdentificacion VARCHAR(20)
    ,@CustomerId INT 
        
        --> Recuperndo Informacion
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago ep WHERE ep.codigo = 'PE'

        SELECT TOP 1 @ruc = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad
	
        SELECT  @codEstab = codEstab FROM OPENJSON(@json) WITH(codEstab VARCHAR(100) '$.codEstab')
	
        SELECT TOP 1 @idEstab = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

        IF (@codDoc = '01')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Factura'
				      ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoTributaria/secuencial)[1]','VARCHAR(25)')
				      ,@importeTotal          = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/importeTotal)[1]','NUMERIC(18,5)')
                      ,@tipoIdentificacion    = CONVERT(xml,dbo.f_sanitize_xml(convert(VARCHAR(max), @xmlDoc.query('/autorizacion/comprobante')))).value('(//factura/infoFactura/tipoIdentificacionComprador)[1]','VARCHAR(20)')
			END

		IF (@codDoc = '03')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoLiquidacionCompra/identificacionProveedor)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Liquidación de Compra'
					  ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//liquidacionCompra/infoTributaria/secuencial)[1]','VARCHAR(25)')
			END

		IF (@codDoc = '04')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Nota de Crédito'
					  ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoTributaria/secuencial)[1]','VARCHAR(25)')
				      ,@importeTotal          = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/importeTotal)[1]','NUMERIC(18,5)')
                      ,@tipoIdentificacion    = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaCredito/infoNotaCredito/tipoIdentificacionComprador)[1]','VARCHAR(20)')

			END

		IF (@codDoc = '05')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoNotaDebito/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Nota de Débito'
					  ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//notaDebito/infoTributaria/secuencial)[1]','VARCHAR(25)')
			END

		IF (@codDoc = '06')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoGuiaRemision/identificacionComprador)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Guía de Remisión'
				      ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoTributaria/secuencial)[1]','VARCHAR(25)')
				      ,@importeTotal          = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//guiaRemision/infoGuiaRemision/importeTotal)[1]','NUMERIC(18,5)')
			END

		IF (@codDoc = '07')
			BEGIN
				SELECT @razonSocial           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/razonSocial)[1]','VARCHAR(300)')
				      ,@nombreComercial       = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/nombreComercial)[1]','VARCHAR(300)')
				      ,@identificacionCliProv = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/ruc)[1]','VARCHAR(13)')
				      ,@direccion             = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/dirMatriz)[1]','VARCHAR(300)')
				      ,@rucReceptor           = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoCompRetencion/identificacionSujetoRetenido)[1]','VARCHAR(25)')
				      ,@comprobante           = 'Comprobante de Retención'
				      ,@serieComprobante      = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/estab)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/ptoEmi)[1]','VARCHAR(25)')
				                       + '-' +  CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoTributaria/secuencial)[1]','VARCHAR(25)')
                      ,@tipoIdentificacion    = CONVERT(xml,dbo.f_sanitize_xml(convert(varchar(max), @xmlDoc.query('/autorizacion/comprobante')))).value('(//comprobanteRetencion/infoCompRetencion/tipoIdentificacionSujetoRetenido)[1]','VARCHAR(20)')
                     
			END

			select LEN(@identificacionCliProv)

        IF @codDoc != '07' 
            BEGIN
                IF LEN(@identificacionCliProv) = 13
                    BEGIN 
						select 'inside ruc'
                        SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = '04'
                    END 

                ELSE IF LEN(@identificacionCliProv) = 10
                    BEGIN 
						select 'inside cedula'
                        SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = '05'
                    END 

                ELSE 
                    BEGIN	 select 'inside pasaporte'

                        SELECT TOP 1 @idTipoIdentificacion = idTipoIdentificacion FROM TipoIdentificacion WITH (NOLOCK) WHERE codigoSri = '06'
                    END 
             END

			 select @idTipoIdentificacion
		return

        IF @ruc != @rucReceptor + IIF(LEN(@rucReceptor) = 10,'001','')
            BEGIN
                SELECT '0'code,'El comprobante no pertenece al Contribuyente' + ' ' +  @ruc as 'message'
                RETURN
            END 

		BEGIN TRAN 
			IF (@codDoc != '07')
				BEGIN	

                    IF NOT EXISTS(SELECT 1 FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@identificacionCliProv)))
						BEGIN

							--INSERT INTO Customer.Customer WITH (ROWLOCK)
       --                            (IDType,IDCard,BusinessName,TradeName,[Address],SriValidation)
							--SELECT @tipoIdentificacion,LTRIM(RTRIM(@identificacionCliProv)), LTRIM(RTRIM(@razonSocial)), LTRIM(RTRIM(@nombreComercial)),LTRIM(RTRIM(@direccion)), 1 
                           
                            SET @customerId = 0-- @@IDENTITY
						END
					ELSE
						BEGIN 
							SELECT TOP 1 @customerId = ID FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = LTRIM(RTRIM(@identificacionCliProv))
						END


					IF NOT EXISTS(SELECT 1 FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@identificacionCliProv)))
						BEGIN
							--INSERT INTO Proveedor WITH (ROWLOCK)
       --                            (idTipoIdentificacion, nombreFiscal, nombreComercial, numeroIdentificacion, direccion, idEntidad,CustomerId,validationSri)
							--SELECT @idTipoIdentificacion,@razonSocial, @nombreComercial, @identificacionCliProv, @direccion, @idEntidad,@customerId,1

                            SELECT @idProveedor = SCOPE_IDENTITY()
						END
                    ELSE 
                        BEGIN
                            SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = LTRIM(RTRIM(@identificacionCliProv)) 
                        END 
				END