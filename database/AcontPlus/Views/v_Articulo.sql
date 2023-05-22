use acontplus

GO
IF OBJECT_ID(N'v_Articulo', N'V') IS NOT NULL
DROP VIEW v_Articulo
GO
CREATE VIEW v_Articulo AS (
SELECT  a.idArticulo
	,a.idEntidad
	,a.codigo	--	 = IIF(ti.porcentaje > 0,'*','') + a.codigo
	,a.codigoAuxiliar
	,a.codigoBarra
	,descripcion = a.descripcion  
	,iva		 = CAST(CAST(ti.porcentaje as decimal(15,0)) AS varchar)--+'%'
	,stock       = CAST(a.stock AS decimal(15,2))
	,stockMinimo       = CAST(a.stockMinimo AS decimal(15,2))
	,subFamilia  =  sf.descripcion 
	,marca       =  m.descripcion 
	,medida		 = me.descripcion 
	,a.estado 
	,ti.porcentaje
	,a.llevaInventario
	,a.idFamilia
	,a.idSubFamilia
	,a.precioCosto
FROM dbo.Articulo a WITH(NOLOCK)
INNER JOIN dbo.TipoIva    ti WITH(NOLOCK) ON ti.idTipoIva    = a.idTipoIva 
LEFT JOIN dbo.SubFamilia sf WITH(NOLOCK) ON sf.idSubFamilia = a.idSubFamilia
LEFT JOIN dbo.Marca       m WITH(NOLOCK) ON m.idMarca		= a.idMarca
LEFT JOIN dbo.Medida     me WITH(NOLOCK) ON me.idMedida		= a.idMedida
LEFT JOIN dbo.Modelo     mo WITH(NOLOCK) ON mo.idModelo     = a.idModelo
 )