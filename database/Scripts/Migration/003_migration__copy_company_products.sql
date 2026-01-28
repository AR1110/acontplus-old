
declare     @rucOrigen VARCHAR(25)
   ,@rucDestino VARCHAR(25);

DECLARE 
        @companyOrigenId INT,
        @companyDestinoId INT;


	SET @rucOrigen = '1718880550001'
	SET @rucDestino = '1708179153001'

    --> Tb Temp
	DECLARE @tbArticle AS TABLE (
		idSubFamilia INT  NULL
	   ,idMarca INT NULL
	   ,idModelo INT NULL
	   ,idTipoIce INT NULL
	   ,idTipoArticulo INT NULL
	   ,idTipoIva INT NOT NULL
	   ,idMedida INT NULL
	   ,idEtiqueta INT NULL
	   ,precioCosto NUMERIC(18,5) NOT NULL
	   ,precioSinSubsidio NUMERIC(18,5) NOT NULL
	   ,codigo VARCHAR(150) UNIQUE NOT NULL
	   ,codigoAuxiliar VARCHAR(150) NOT NULL
	   ,codigoBarra VARCHAR(150) UNIQUE NOT NULL
	   ,valorIce NUMERIC(18,5)
	   ,descripcion VARCHAR(500) NOT NULL
	   ,llevaInventario BIT NOT NULL
	   ,datosAdicionales BIT NOT NULL
	   ,productoFraccionable BIT NOT NULL
	   ,datosLote BIT NULL
	   ,lote VARCHAR(150) NULL
	   ,fechaCreacion DATETIME NULL
	   ,fechaCaducidadlote DATETIME NULL
	   ,stockMinimo INT NULL
	   ,stockMaximo INT NULL
	   ,observaciones VARCHAR(300) NULL
	   ,caducidad BIT NULL
	   ,fechaCaducidad DATETIME NULL
	   ,cantMinimaVentaPorMayor INT NOT NULL
	   ,idEntidad INT NOT NULL
	   ,idUsuario INT NOT NULL
	   ,code_unique UNIQUEIDENTIFIER
	)

    DECLARE @tbPrices AS TABLE (
	    codigo VARCHAR(150) NOT NULL
       ,idTarifa INT NULL
	   ,precioVenta NUMERIC(18,6) NOT NULL  
	   ,precioConIva NUMERIC(18,6) NOT NULL 
	   ,porcentajeUtilidad NUMERIC(18,5) NOT NULL 
	   ,precioPredeterminado BIT NOT NULL
	   ,idUsuario INT
	   ,estado BIT
	)


SET @companyOrigenId = (SELECT idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE ruc = @rucOrigen);
        
        SET @companyDestinoId = (SELECT idEntidad FROM dbo.Entidad WITH (NOLOCK) WHERE ruc = @rucDestino);

				--select * from SubEntidadFinanciera where idEntidad = @companyOrigenId return

						--select * from SubEntidadFinanciera where idEntidad = @companyDestinoId return
 
						insert into dbo.SubEntidadFinanciera(idEntidadFinanciera, descripcion, codigo, interes, idUsuario, idEntidad, predeterminado, controlCaja)
						select idEntidadFinanciera, descripcion, codigo, interes, idUsuario, @companyDestinoId, predeterminado, controlCaja from SubEntidadFinanciera sef 
						where idEntidad = @companyOrigenId AND NOT EXISTS (SELECT 1 FROM dbo.SubEntidadFinanciera where sef.codigo = codigo AND idEntidad = @companyDestinoId )
						 return

        SELECT * 
        FROM dbo.SubFamilia WITH (NOLOCK) 
        WHERE idEntidad = @companyOrigenId 
          AND descripcion NOT IN (SELECT descripcion FROM dbo.SubFamilia WITH (NOLOCK) WHERE idEntidad = @companyDestinoId)

        SELECT * 
        FROM dbo.Medida WITH (NOLOCK) 
        WHERE idEntidad = @companyDestinoId 
          AND descripcion NOT IN (SELECT descripcion FROM dbo.Medida WITH (NOLOCK) WHERE idEntidad = @companyDestinoId)


        SELECT * 
        FROM dbo.Marca WITH (NOLOCK) 
        WHERE idEntidad = @companyOrigenId 
          AND descripcion NOT IN (SELECT descripcion FROM dbo.Marca WITH (NOLOCK) WHERE idEntidad = @companyDestinoId)


        SELECT * 
        FROM dbo.Modelo WITH (NOLOCK) 
        WHERE idEntidad = @companyOrigenId 
          AND descripcion NOT IN (SELECT descripcion FROM dbo.Modelo WITH (NOLOCK) WHERE idEntidad = @companyDestinoId)

		--select * from Tarifa where idEntidad = @companyOrigenId

		--SELECT * FROM dbo.Articulo where idEntidad = @companyOrigenId
				--SELECT * FROM dbo.Articulo where idEntidad = @companyDestinoId return


        INSERT INTO @tbArticle
				(idSubFamilia
				,idMarca
				,idModelo
				,idTipoIce
				,idTipoArticulo
				,idTipoIva
				,idMedida
				,precioCosto
				,precioSinSubsidio
				,codigo
				,codigoAuxiliar
				,valorIce
				,descripcion
				,llevaInventario
				,datosAdicionales
				,productoFraccionable
				,datosLote
				,lote
				,fechaCreacion
				,fechaCaducidadLote
				,stockMinimo
				,stockMaximo
				,observaciones
				,caducidad
				,fechaCaducidad
				,codigoBarra		
				,idEtiqueta
				,cantMinimaVentaPorMayor
				,idEntidad
				,idUsuario
				,code_unique)
        SELECT (SELECT TOP 1 idSf.idSubFamilia FROM dbo.SubFamilia idSf WITH (NOLOCK) WHERE idSf.idEntidad = @companyDestinoId AND idSf.descripcion = sf.descripcion ) as idSubFamilia
              ,(SELECT TOP 1 idMa.idMarca FROM dbo.Marca idMa WITH (NOLOCK) WHERE idMa.idEntidad = @companyDestinoId AND idMa.descripcion = ma.descripcion )           as idMarca
              ,(SELECT TOP 1 idMo.idModelo FROM dbo.Modelo idMo WITH (NOLOCK) WHERE idMo.idEntidad = @companyDestinoId AND idMo.descripcion = mo.descripcion )         as idModelo
              ,ar.idTipoIce
              ,ar.idTipoArticulo
              ,ar.idTipoIva
              ,(SELECT TOP 1 idMe.idMedida FROM dbo.Medida idMe WITH (NOLOCK) WHERE idMe.idEntidad = @companyDestinoId AND idMe.descripcion = me.descripcion )         as idMedida
              ,ar.precioCosto
              ,ar.precioSinSubsidio
              ,ar.codigo
              ,ISNULL(ar.codigoAuxiliar, ar.codigo)
              ,ar.valorIce
              ,ar.descripcion
              ,ar.llevaInventario
              ,ar.datosAdicionales
              ,ar.productoFraccionable
              ,ar.datosLote
              ,ar.lote
              ,ar.fechaCreacion
              ,ar.fechaCaducidadLote
              ,ar.stockMinimo
              ,ar.stockMaximo
              ,ar.observaciones
              ,ar.caducidad
              ,ar.fechaCaducidad
              ,ar.codigoBarra		
              ,ar.idEtiqueta
              ,ar.cantMinimaVentaPorMayor
			  ,@companyDestinoId
			  ,ar.idUsuario
			  ,NEWID()
        FROM dbo.Articulo         ar WITH (NOLOCK) 
        INNER JOIN dbo.SubFamilia sf WITH (NOLOCK) ON sf.idSubFamilia = ar.idSubFamilia
        INNER JOIN dbo.Medida     me WITH (NOLOCK) ON me.idMedida     = ar.idMedida
         LEFT JOIN dbo.Marca      ma WITH (NOLOCK) ON ma.idMarca      = ar.idMarca
         LEFT JOIN dbo.Modelo     mo WITH (NOLOCK) ON mo.idModelo     = ar.idModelo
        WHERE ar.idEntidad = @companyOrigenId

        INSERT INTO @tbPrices
               (codigo,idTarifa,precioVenta,precioConIva,porcentajeUtilidad,precioPredeterminado, idUsuario, estado)
        SELECT ar.codigo
              ,(SELECT TOP 1 idTa.idTarifa FROM dbo.Tarifa idTa WITH (NOLOCK) WHERE idTa.codigo = ta.codigo AND idTa.idEntidad = @companyDestinoId) as idTarifa
              ,ap.precioVenta
              ,ap.precioConIva
              ,ap.porcentajeUtilidad
              ,ap.precioPredeterminado
			  ,ISNULL(ap.idUsuario, 4)
			  ,ap.estado
        FROM dbo.ArticuloPvP    ap WITH (NOLOCK) 
        INNER JOIN dbo.Tarifa   ta WITH (NOLOCK) ON ta.idTarifa   = ap.idTarifa
        INNER JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = ap.idArticulo
        WHERE ar.idEntidad = @companyOrigenId
        ORDER BY ar.idArticulo ASC

		--INSERT INTO dbo.Articulo(idSubFamilia, idMarca, idModelo, idTipoIce, idTipoArticulo, idTipoIva, idMedida, idEtiqueta, precioCosto, precioSinSubsidio, codigo, codigoAuxiliar, codigoBarra, valorIce, descripcion, llevaInventario, datosAdicionales, productoFraccionable, datosLote, lote, fechaCreacion, fechaCaducidadLote, stockMinimo, stockMaximo, observaciones, caducidad, fechaCaducidad, cantMinimaVentaPorMayor, idEntidad, idUsuario, code_unique)
		--SELECT * FROM @tbArticle a
		--WHERE NOT EXISTS (SELECT 1 FROM dbo.Articulo WHERE a.codigo = codigo 
		--						AND idEntidad = @companyDestinoId)

		--INSERT INTO dbo.ArticuloPvP([idArticulo], [idTarifa], [precioVenta], [precioConIva], [porcentajeUtilidad], [estado], [precioPredeterminado], [idUsuario])

		--SELECT a.idArticulo, ta.idTarifa, tp.precioVenta, precioConIva, porcentajeUtilidad, tp.estado, precioPredeterminado, tp.idUsuario 
		--FROM @tbPrices tp
		--INNER JOIN dbo.Articulo a WITH (NOLOCK) ON tp.codigo = a.codigo
		--INNER JOIN dbo.Tarifa   ta WITH (NOLOCK) ON ta.idTarifa   = tp.idTarifa
		--WHERE a.idEntidad = @companyDestinoId
		--AND NOT EXISTS (SELECT 1 FROM dbo.ArticuloPvP WHERE a.idArticulo = idArticulo AND tp.idTarifa = idTarifa)
		--ORDER BY idArticulo

 	--	INSERT INTO dbo.ArticuloUbicacion([idArticulo], [idBodega], [idUsuario])
		
		--SELECT a.idArticulo, (SELECT b.idBodega FROM dbo.Bodega b 
		--	INNER JOIN Sri.Establecimiento e ON b.idEstablecimiento = e.idEstablecimiento WHERE e.idEntidad = @companyDestinoId), 4 FROM dbo.Articulo a 
		--WHERE a.idEntidad = @companyDestinoId
		--AND NOT EXISTS (SELECT 1 FROM dbo.ArticuloUbicacion WHERE idBodega = (SELECT b.idBodega FROM dbo.Bodega b 
		--	INNER JOIN Sri.Establecimiento e ON b.idEstablecimiento = e.idEstablecimiento WHERE e.idEntidad = @companyDestinoId) AND a.idArticulo = idArticulo)


		--select * from dbo.ArticuloCodigoBarra acb INNER JOIN dbo.Articulo a on acb.idArticulo = a.idArticulo

		--where a.idEntidad = @companyOrigenId

