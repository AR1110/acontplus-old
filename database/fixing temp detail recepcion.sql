USE Acontplus
GO
--Recepcion.Doc_Detail_Temp_Get 117, 68100

--select * from Recepcion.Doc_Detalle_Temp where iddocumento = 68100
declare 
    @userRoleId INT = 452
    ,@idDocumento INT = 112389
    ,@jsonData VARCHAR(MAX) = '
	[
            {
                "idDetalle": 0,
                "codigoPrincipal": "PE-PE0011",
                "codigoAuxiliar": "",
                "descripcion": "PEGA PVC ADHEPLAST 12 LITRO",
                "cantidad": "12.00",
                "precioUnitario": "2.6172",
                "descuento": "1.26",
                "precioTotalSinImpuesto": "30.15",
                "detAdicionalNombre": null,
                "detAdicionalValor": null,
                "detallesAdicionales": "",
                "impuestos": "<impuestos><impuesto><codigo>2</codigo><codigoPorcentaje>4</codigoPorcentaje><tarifa>15</tarifa><baseImponible>30.15</baseImponible><valor>4.52</valor></impuesto></impuestos>"
            },
            {
                "idDetalle": 1,
                "codigoPrincipal": "PI-PI047",
                "codigoAuxiliar": "",
                "descripcion": "BARNIZ DURACOLOR LITRO",
                "cantidad": "12.00",
                "precioUnitario": "2.9510",
                "descuento": "1.06",
                "precioTotalSinImpuesto": "34.35",
                "detAdicionalNombre": null,
                "detAdicionalValor": null,
                "detallesAdicionales": "",
                "impuestos": "<impuestos><impuesto><codigo>2</codigo><codigoPorcentaje>4</codigoPorcentaje><tarifa>15</tarifa><baseImponible>34.35</baseImponible><valor>5.15</valor></impuesto></impuestos>"
            },
            {
                "idDetalle": 2,
                "codigoPrincipal": "PE-CE003",
                "codigoAuxiliar": "",
                "descripcion": "CEMENTO CTAC.AFRI.14",
                "cantidad": "12.00",
                "precioUnitario": "2.7490",
                "descuento": "1.32",
                "precioTotalSinImpuesto": "31.67",
                "detAdicionalNombre": null,
                "detAdicionalValor": null,
                "detallesAdicionales": "",
                "impuestos": "<impuestos><impuesto><codigo>2</codigo><codigoPorcentaje>4</codigoPorcentaje><tarifa>15</tarifa><baseImponible>31.67</baseImponible><valor>4.75</valor></impuesto></impuestos>"
            },
            {
                "idDetalle": 3,
                "codigoPrincipal": "PE-PE0021",
                "codigoAuxiliar": "",
                "descripcion": "PEGA PVC LLAMA ROJA 14",
                "cantidad": "12.00",
                "precioUnitario": "3.8643",
                "descuento": "1.39",
                "precioTotalSinImpuesto": "44.98",
                "detAdicionalNombre": null,
                "detAdicionalValor": null,
                "detallesAdicionales": "",
                "impuestos": "<impuestos><impuesto><codigo>2</codigo><codigoPorcentaje>4</codigoPorcentaje><tarifa>15</tarifa><baseImponible>44.98</baseImponible><valor>6.75</valor></impuesto></impuestos>"
            }
        ]
	'


	 DECLARE @idUsuario INT
    DECLARE @idEntidad INT
    DECLARE @rucProv VARCHAR(20)
    DECLARE @idProveedor INT
    DECLARE @customerId INT


	DECLARE @tmp TABLE(
        idDocumento INT NOT NULL
        ,idArticulo INT NULL
        ,codigoPrincipal VARCHAR(100) NOT NULL
        ,codigoAuxiliar VARCHAR(100) NULL
        ,cantidad VARCHAR(100) NOT NULL
        ,descripcion VARCHAR(300) NOT NULL
        ,precioUnitario VARCHAR(15) NOT NULL
        ,descuento VARCHAR(15) NULL
        ,precioTotalSinImpuesto VARCHAR(15) NULL
        ,impuestos XML
        ,detallesAdicionales XML
        ,idDetalle INT NULL
    )

 


	        INSERT INTO @tmp(idDetalle, idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, detallesAdicionales, impuestos)
        SELECT idDetalle, @idDocumento, idArticulo, codigoPrincipal, codigoAuxiliar, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, detallesAdicionales, impuestos
        FROM OPENJSON(@jsonData) WITH (
            idDetalle INT '$.idDetalle'
            ,idArticulo INT '$.idArticulo'
            ,codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
            ,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
            ,cantidad VARCHAR(100) '$.cantidad'
            ,descripcion VARCHAR(300) '$.descripcion'
            ,precioUnitario VARCHAR(15) '$.precioUnitario'
            ,descuento VARCHAR(15) '$.descuento'
            ,precioTotalSinImpuesto VARCHAR(15) '$.precioTotalSinImpuesto'
            ,detallesAdicionales XML '$.detallesAdicionales'
            ,impuestos XML
        )
 

        IF NOT EXISTS (SELECT 1 FROM @tmp)
        BEGIN
            SELECT '0' code, 'No existe datos para registrar' as 'message'
            RETURN
        END

        SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

        SELECT @rucProv = rucEmisor FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento 

        SELECT TOP 1 @customerId = Id FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = @rucProv

        SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND CustomerId = @customerId



		 IF EXISTS(
                SELECT TOP 1 1 
                FROM Recepcion.Doc_Detalle_Temp cpt WITH (NOLOCK)
                INNER JOIN @tmp t ON cpt.idDocumento = t.idDocumento
            )
            BEGIN
                DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
            END

            IF EXISTS(
                SELECT TOP 1 1 
                FROM Recepcion.Doc_Impuesto_Temp cpt WITH (NOLOCK)
                INNER JOIN @tmp t ON cpt.idDocumento = t.idDocumento
            )
            BEGIN
                DELETE FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = (SELECT TOP 1 idDocumento FROM @tmp)
            END

            IF EXISTS (
                SELECT TOP 1 1 
                FROM Recepcion.DocumentoDetalle WITH (NOLOCK) 
                WHERE idDocumento = @idDocumento
            )
            BEGIN  

			print 'inside here'
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY dd.idDocumentoDetalle ASC) - 1 idDetalle, 
                    dd.idDocumento,
                    @idProveedor idProveedor, 
                    ISNULL(dd.idArticulo , 0) idArticulo, 
                    dd.idMedida, 
                    dd.codigoPrincipal, 
                    dd.codigoAuxiliar,
                    dd.cantidad, 
                    ISNULL(t.descripcion, a.descripcion) descripcion, 
                    dd.precioUnitario,
                    dd.precioTotalSinImpuesto,
                    CAST((CAST(dd.precioTotalSinImpuesto AS decimal(15,5)) / CAST(dd.cantidad AS decimal(18,5))) AS numeric(18,5)) costoNeto,
                    dd.descuento,
                    CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), dd.detallesAdicionales))))= 0 THEN NULL ELSE dd.detallesAdicionales END detallesAdicionales,
                    dd.impuestos,
                    @idUsuario idUsuario
                INTO #TEMP
                FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK)
                INNER JOIN Articulo a WITH (NOLOCK) ON dd.idArticulo = a.idArticulo
                LEFT JOIN @tmp t ON a.codigo = t.codigoPrincipal
                WHERE dd.idDocumento = @idDocumento

				--select * from #TEMP
				--return

                --INSERT INTO #TEMP
                SELECT 
                    t.idDetalle, 
                    idDocumento, 
                    @idProveedor idProveedor, 
                    ISNULL(ch.idArticulo,0) idArticulo, 
                    ISNULL(m.idMedida,0), 
                    t.codigoPrincipal, 
                    t.codigoAuxiliar,
                    cantidad, 
                    ISNULL(t.descripcion, a.descripcion) descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto,
                    CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)) costoNeto,
                    descuento, 
                    CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), detallesAdicionales))))= 0 THEN NULL ELSE detallesAdicionales END detallesAdicionales,
                    impuestos,
                    @idUsuario idUsuario
                FROM @tmp t
                LEFT JOIN Recepcion.CompraHabitual ch WITH (NOLOCK) ON t.codigoPrincipal = ch.codArticulo AND ch.idProveedor = @idProveedor
                LEFT JOIN dbo.Articulo a WITH (NOLOCK) ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad AND a.estado = 1
                LEFT JOIN dbo.Medida m WITH (NOLOCK) ON a.idMedida = m.idMedida AND m.idEntidad = @idEntidad
                WHERE NOT EXISTS(
                    SELECT * 
                    FROM #TEMP tt 
                    WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal
                )
                ORDER BY t.idDetalle ASC

                --INSERT INTO Recepcion.Doc_Detalle_Temp(
                --    idDetalle, 
                --    idDocumento, 
                --    idProveedor, 
                --    idArticulo, 
                --    idMedida, 
                --    codigoPrincipal, 
                --    codigoAuxiliar,
                --    cantidad, 
                --    descripcion, 
                --    precioUnitario, 
                --    precioTotalSinImpuesto, 
                --    costoNeto, 
                --    descuento, 
                --    detallesAdicionales, 
                --    impuestos, 
                --    idUsuario
                --)
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY (SELECT NULL)), 
                    idDocumento, 
                    idProveedor, 
                    idArticulo, 
                    idMedida, 
                    codigoPrincipal, 
                    codigoAuxiliar,
                    cantidad, 
                    descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto, 
                    costoNeto, 
                    descuento, 
                    detallesAdicionales, 
                    impuestos, 
                    idUsuario
                FROM #TEMP

                DROP TABLE #TEMP
            END
            ELSE
            BEGIN
                SELECT 
                    t.idDetalle, 
                    idDocumento, 
                    @idProveedor idProveedor, 
                    ISNULL(ch.idArticulo , 0) idArticulo, 
                    ISNULL(m.idMedida,0) idMedida, 
                    t.codigoPrincipal, 
                    t.codigoAuxiliar,
                    cantidad, 
                    t.descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto,
                    CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)) costoNeto,
                    descuento, 
                    CASE WHEN LEN(LTRIM(RTRIM(CONVERT(VARCHAR(MAX), detallesAdicionales))))= 0 THEN NULL ELSE detallesAdicionales END detallesAdicionales,
                    impuestos,
                    @idUsuario idUsuario
                INTO #TEMPII
                FROM @tmp t
                LEFT JOIN Recepcion.CompraHabitual ch WITH (NOLOCK) ON t.codigoPrincipal = ch.codArticulo AND ch.idProveedor = @idProveedor
                LEFT JOIN dbo.Articulo a WITH (NOLOCK) ON a.codigo = t.codigoPrincipal AND a.idEntidad = @idEntidad AND a.estado = 1
                LEFT JOIN dbo.Medida m WITH (NOLOCK) ON a.idMedida = m.idMedida AND m.idEntidad = @idEntidad
                WHERE NOT EXISTS(
                    SELECT * 
                    FROM Recepcion.Doc_Detalle_Temp tt WITH (NOLOCK)
                    WHERE t.idDocumento = tt.idDocumento AND t.codigoPrincipal = tt.codigoPrincipal
                )
                ORDER BY t.idDetalle ASC

                --INSERT INTO Recepcion.Doc_Detalle_Temp(
                --    idDetalle, 
                --    idDocumento, 
                --    idProveedor, 
                --    idArticulo, 
                --    idMedida, 
                --    codigoPrincipal, 
                --    codigoAuxiliar,
                --    cantidad, 
                --    descripcion, 
                --    precioUnitario, 
                --    precioTotalSinImpuesto, 
                --    costoNeto, 
                --    descuento, 
                --    detallesAdicionales, 
                --    impuestos, 
                --    idUsuario
                --)
                SELECT 
                    ROW_NUMBER() OVER(ORDER BY idDetalle), 
                    idDocumento, 
                    idProveedor, 
                    idArticulo, 
                    idMedida, 
                    codigoPrincipal, 
                    codigoAuxiliar,
                    cantidad, 
                    descripcion, 
                    precioUnitario, 
                    precioTotalSinImpuesto, 
                    costoNeto, 
                    descuento, 
                    detallesAdicionales, 
                    impuestos, 
                    idUsuario
                FROM #TEMPII

                DROP TABLE #TEMPII
            END

