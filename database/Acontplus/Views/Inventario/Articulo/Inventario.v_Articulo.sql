USE AcontPlus
GO
CREATE OR ALTER VIEW Inventario.v_Articulo WITH SCHEMABINDING AS (
	SELECT  a.idArticulo
		,a.code_unique
		,a.idEntidad
		,a.codigo	--	 = IIF(ti.porcentaje > 0,'*','') + a.codigo
		,a.codigoAuxiliar
		,a.codigoBarra
        ,a.idTipoArticulo
		,descripcion = a.descripcion  
		,iva		 = CAST(CAST(ti.porcentaje as decimal(15,0)) AS varchar)--+'%'
		,stock       = CAST(a.stock AS decimal(15,2))
		,stockMinimo  = CAST(a.stockMinimo AS decimal(15,2))
		,siglaSubfamilia = sf.siglas
		,subFamilia   = sf.descripcion 
        ,a.idMarca
		,marca        = m.descripcion 
		,medida		  = me.descripcion 
		,modelo       = mo.descripcion
		,tipoArticulo = ta.descripcion
        ,tarifaImpuesto = ti.descripcion
        ,ti.codigoPorcentaje
		,a.estado
		,a.idTipoIva
		,ti.porcentaje
		,ti.descripcion tipoIva
		,a.llevaInventario
		,a.idFamilia
		,a.idSubFamilia
		,a.precioCosto
		,a.fechaModificacion
		,a.idMedida
		,a.caducidad
		,a.fechaCaducidad
		,a.productoFraccionable fraccionado
		,precioSinSubsidio = ISNULL(a.precioSinSubsidio, 0)
		,observaciones = ISNULL(a.observaciones, '')
		,colorRow = CASE WHEN a.stock <= 0                            THEN 'badge badge-danger'
						 WHEN a.stock > 0 AND a.stock < a.stockMinimo THEN 'badge badge-warning' 
						 ELSE ''
					END
		,a.idUsuario
		,(SELECT TOP 1 s3ObjectKey FROM [Inventario].[ProductPhoto] ph WITH (NOLOCK) WHERE ph.ProductId = a.idArticulo AND IsDefault = 1) s3ObjectKey
		,(SELECT TOP 1 s3ObjectUrl FROM [Inventario].[ProductPhoto] ph WITH (NOLOCK) WHERE ph.ProductId = a.idArticulo AND IsDefault = 1) s3ObjectUrl
		,ISNULL((SELECT TOP 1 Id          FROM [Inventario].[ProductPhoto] ph WITH (NOLOCK) WHERE ph.ProductId = a.idArticulo AND IsDefault = 1),0) productPhotoId
        ,ta.codigo as codTipoArticulo
        ,fa.siglas as siglaFamilia
	FROM dbo.Articulo            a WITH(NOLOCK)
	INNER JOIN dbo.TipoIva      ti WITH(NOLOCK) ON ti.idTipoIva      = a.idTipoIva 
	 LEFT JOIN dbo.SubFamilia   sf WITH(NOLOCK) ON sf.idSubFamilia   = a.idSubFamilia
     LEFT JOIN dbo.Familia      fa WITH(NOLOCK) ON fa.idFamilia      = sf.idFamilia
	 LEFT JOIN dbo.Marca         m WITH(NOLOCK) ON m.idMarca		 = a.idMarca
	 LEFT JOIN dbo.Medida       me WITH(NOLOCK) ON me.idMedida	     = a.idMedida
	 LEFT JOIN dbo.Modelo       mo WITH(NOLOCK) ON mo.idModelo       = a.idModelo
	 LEFT JOIN dbo.TipoArticulo ta WITH(NOLOCK) ON ta.idTipoArticulo = a.idTipoArticulo

 )
