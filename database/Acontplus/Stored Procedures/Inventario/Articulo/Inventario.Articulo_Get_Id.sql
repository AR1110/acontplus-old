USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Almacen].[Articulo_Get_Id]    Script Date: 11/30/2022 11:16:31 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Danis Manchu
-- Create date: 2023-10-31
-- Description:	SP para buscar articulos en los documentos de compra y venta 
-- Inventario.Articulo_Get_Id 77554
-- =============================================
CREATE OR ALTER PROC Inventario.Articulo_Get_Id
@id INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT 
	DECLARE @ruc VARCHAR(15) 
	DECLARE @tableStock TABLE(
        id INT IDENTITY(1,1)
        ,idBodega INT
        ,codEstab VARCHAR(25)
        ,bodega VARCHAR(200)
        ,ubicacion VARCHAR(200)
        ,stock DECIMAL(15,5)
    )
	
	SELECT TOP 1 @idEntidad = idEntidad FROM dbo.Articulo WITH (NOLOCK) 
    WHERE idArticulo = @id

	SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) 
    WHERE idEntidad = @idEntidad

	INSERT INTO @tableStock(idBodega,codEstab,bodega,ubicacion,stock)
	SELECT 
		 bo.idBodega
		,bo.codEstab
		,bo.descripcion
		,ISNULL((SELECT ubicacion FROM dbo.ArticuloUbicacion au WITH (NOLOCK) WHERE au.idBodega = bo.idBodega AND au.idArticulo = @id),'SN')
		,st.cantidad
	FROM Inventario.Stock st WITH (NOLOCK)
	INNER JOIN dbo.Bodega bo WITH (NOLOCK) ON bo.idBodega = st.idBodega 
	WHERE st.idArticulo = @id and bo.estado = 1
             
	IF NOT EXISTS(SELECT 1 FROM Articulo WITH (NOLOCK) WHERE idArticulo = @id)
		BEGIN
			SELECT '0','El id: '+ CAST(@id as nvarchar)+' no existe',''
			RETURN
		END
        
	SELECT
		 idArticulo                 = a.idArticulo
		,idSubFamilia               = ISNULL(a.idSubFamilia,0) 
		,idTipoIce                  = ISNULL(a.idTipoIce,0) 
		,idTipoArticulo             = ISNULL(a.idTipoArticulo,0) 
		,idModelo                   = ISNULL(a.idModelo,0)
		,idMarca                    = ISNULL(a.idMarca,0)  
		,idTipoIva                  = a.idTipoIva
		,idMedida                   = ISNULL(a.idMedida,0)
		,codigo                     = a.codigo
		,codigoBarra                = ISNULL(a.codigoBarra,'S/N') 
		,codigoAuxiliar             = ISNULL(a.codigoAuxiliar, 'S/N')
		,descripcion                = a.descripcion
		,valorIce                   = ISNULL(a.valorIce,0)
		,llevaInventario            = a.llevaInventario
		,datosAdicionales           = ISNULL(a.datosAdicionales, 0)
		,datosLote                  = ISNULL(a.datosLote,0)
		,lote                       = ISNULL(a.lote, '')
		,fechaCreacion              = CAST(ISNULL(a.fechaCreacion,'') AS DATE)
		,fechaCaducidadLote         = CAST(ISNULL(a.fechaCaducidadLote,'') AS DATE)
		,productoFraccionable       = a.productoFraccionable
		,stockMinimo                = a.stockMinimo
		,stockMaximo                = a.stockMaximo
		,observaciones              = ISNULL(a.observaciones, 'S/A')
		,caducidad                  = a.caducidad
		,fechaCaducidad             = CAST(ISNULL(a.fechaCaducidad, '') AS DATE)
		,estado                     = a.estado
		,precioCosto                = a.precioCosto
		,precioSinSubsidio          = ISNULL(a.precioSinSubsidio,0)
		,idEtiqueta                 = ISNULL(a.idEtiqueta,0)
		,nombreTipoIva              = ti.descripcion
		,porcentajeTipoIva          = ti.porcentaje
		,codigoTipoIva              = ti.codigo
		,nombreMedida               = ISNULL(me.descripcion,'Ninguna') 
		,codigoArticulo             = CASE WHEN ti.porcentaje > 0 THEN '* '+a.codigo ELSE a.codigo END
		,cantMinimaVentaPorMayor    = ISNULL(cantMinimaVentaPorMayor, 0)
	FROM Articulo       a WITH (NOLOCK) 
	INNER JOIN TipoIva ti WITH (NOLOCK) ON ti.idTipoIva = a.idTipoIva
	LEFT JOIN Medida   me WITH (NOLOCK) ON me.idMedida = a.idMedida
	WHERE a.idArticulo = @id
                
	SELECT 
		idArticuloPvP           = ap.idArticuloPvP
		,idTarifa               = ap.idTarifa
		,precioVenta            = ap.precioVenta
		,precioConIva           = ap.precioConIva
		,porcentajeUtilidad     = ap.porcentajeUtilidad
		,precioPredeterminado   = ta.predeterminada
		,tarifa                 = ta.descripcion
		,porcentajeIva          = ti.porcentaje
	FROM ArticuloPvP   ap WITH (NOLOCK)
	INNER JOIN Tarifa  ta WITH (NOLOCK) ON ta.idTarifa  = ap.idTarifa
	INNER JOIN Articulo a WITH (NOLOCK) ON a.idArticulo = ap.idArticulo
	LEFT JOIN TipoIva  ti WITH (NOLOCK) ON ti.idTipoIva = a.idTipoIva
	WHERE ap.idArticulo = @id 
	ORDER BY ta.predeterminada DESC
        				
	SELECT
        idArticuloCodigoBarra   = ac.idArticuloCodigoBarra
		,idMedida               = ac.idMedida
		,codigoBarra            = ac.codigoBarra
		,descripcion            = ac.descripcion
		,color                  = ac.color
		,estado                 = ac.estado
		,medida                 = m.descripcion
	FROM ArticuloCodigoBarra ac WITH (NOLOCK)
	INNER JOIN Medida         m WITH (NOLOCK)  ON m.idMedida = ac.idMedida
	WHERE ac.idArticulo = @id

	SELECT 
		idArticuloUbicacion = au.idArticuloUbicacion
		,idBodega           = au.idBodega
		,ubicacion          = ISNULL(au.ubicacion, 'Ninguna') 
		,estado             = au.estado
		,descripcion        = b.descripcion
	FROM ArticuloUbicacion au WITH (NOLOCK)
	INNER JOIN Bodega       b WITH (NOLOCK) ON b.idBodega = au.idBodega
	WHERE au.idArticulo = @id
			
	SELECT 
		branchOffice    = s.nombreComercial 
		,warehouses     = ISNULL((SELECT bodega,stock,ubicacion FROM @tableStock ts WHERE ts.codEstab = s.codEstab FOR JSON PATH),'[]')
	FROM Sri.Establecimiento s WITH (NOLOCK) 
	WHERE s.ruc = @ruc

	SELECT me.idMedida
            , me.descripcion
            , a.precioCosto
            , a.idMedida 
    FROM Articulo a WITH (NOLOCK) 
    INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = a.idMedida 
    WHERE a.idEntidad = @idEntidad AND a.idArticulo = @id
	
    UNION ALL
	
    SELECT me.idMedida
            , me.descripcion
            , af.precioCostoFraccionado
            , af.idMedida 
    FROM ArticuloFraccionado af WITH (NOLOCK) 
    INNER JOIN Medida me ON me.idMedida = af.idMedida 
    WHERE af.idArticulo = @id and af.idEntidad = @idEntidad
END