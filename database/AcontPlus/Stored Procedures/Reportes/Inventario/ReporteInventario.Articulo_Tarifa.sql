USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspInventarioReporteGeneral]    Script Date: 12/6/2022 9:47:15 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- exec ReporteInventario.Articulo_Valoracion 38, '[{"byOrderCampo":"ar.descripcion","byOrder":"ASC","byTipoReporte":1,"byTipoFormato":"pdf","codEstab":"ESTAB-000000002","checkboxSubFamiliaFiltro":false,"filtroFecha":"16-2-2023 12:52"}]'
IF OBJECT_ID(N'ReporteInventario.Articulo_Tarifa', N'P') IS NOT NULL
DROP PROCEDURE ReporteInventario.Articulo_Tarifa
GO
CREATE PROCEDURE ReporteInventario.Articulo_Tarifa @idRol INT ,@json NVARCHAR(MAX)
AS
BEGIN 

	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @byEntidad INT = (SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol)
	DECLARE @tituloReporte VARCHAR(150)
	DECLARE @filtroFecha VARCHAR(50)

	DECLARE @checkboxSubFamiliaFiltro BIT
	DECLARE @bySubFamilia INT
	DECLARE @checkboxStockFiltro BIT
	DECLARE @byStock INT
	DECLARE @checkboxDetalleBodegaFiltro BIT 
	DECLARE @byOrder NVARCHAR(10)			
	DECLARE @byOrderCampo NVARCHAR(50)	
	
	DECLARE @params NVARCHAR(MAX)='@byEntidad    INT,									
									@bySubFamilia INT,
									@byOrder      VARCHAR(10),									
									@byOrderCampo VARCHAR(50)'			

		--DECLARE @sql NVARCHAR(MAX) =  'SELECT 
		--									idArticulo       = ar.idArticulo,																			
		--									tarifa           = t.descripcion, 
		--									descripcion      = ar.descripcion, 
		--									codigo  		 = ar.codigo,
		--									subFamilia		 = sf.descripcion ,
		--									precioCosto      = CAST(ar.precioCosto as numeric(15, 2)),
		--									precioIva      = CAST(apvp.precioConIva as numeric(15,2)),
		--									totalStock       = CAST(ar.stock  as numeric(15, 2))                											
		--								FROM ArticuloPvP apvp WITH (NOLOCK) 		
		--								INNER JOIN Tarifa t WITH (NOLOCK) ON t.idTarifa            = apvp.idTarifa										
		--								INNER JOIN Articulo ar WITH (NOLOCK) ON ar.idArticulo      = apvp.idArticulo										
		--								INNER JOIN SubFamilia  sf WITH (NOLOCK) ON sf.idSubFamilia = ar.idSubFamilia									
		--								WHERE ar.estado = 1 AND ar.idEntidad = @byEntidad AND ar.llevaInventario = 1 '
	
		
			DECLARE @sql NVARCHAR(MAX) = 'SELECT ar.idArticulo
						,ar.descripcion
						 ,ar.codigo
						,ar.subfamilia
						,t.descripcion as tarifa
						,ISNULL(au.bodega, ''No asignada'') bodega
						,precioCosto = CAST(ar.precioCosto as numeric(15, 2)),
						precioIva = CAST(apvp.precioConIva as numeric(15,2)),
						totalStock = CAST(ar.stock  as numeric(15, 2))
						,ISNULL(s.cantidad,0) stock
					FROM v_Articulo ar  WITH (NOLOCK) 		
					INNER JOIN  ArticuloPvP apvp WITH (NOLOCK) ON ar.idArticulo = apvp.idArticulo
					INNER JOIN Tarifa t WITH (NOLOCK) ON t.idTarifa = apvp.idTarifa		
					LEFT JOIN v_Articulo_Ubicacion au ON ar.idArticulo = au.idArticulo
					LEFT JOIN Inventario.Stock s WITH (NOLOCK) ON s.idArticulo = ar.idArticulo AND s.idBodega = au.idBodega
					WHERE ar.estado = 1 AND ar.idEntidad = @byEntidad AND ar.llevaInventario = 1 '

			
			SELECT 	
			    @filtroFecha              = filtroFecha
			  
			   ,@checkboxSubFamiliaFiltro = checkboxSubFamiliaFiltro
			   ,@bySubFamilia			  = bySubFamilia

			   ,@checkboxStockFiltro      = checkboxStockFiltro
			   ,@byStock                  = byStock

			   ,@byOrder                  = byOrder			 
			   ,@byOrderCampo             = byOrderCampo			   
			
			FROM OPENJSON(@json)
			WITH (
			      filtroFecha  VARCHAR(50)     '$.filtroFecha',						

				  checkboxSubFamiliaFiltro BIT '$.checkboxSubFamiliaFiltro',
				  bySubFamilia INT             '$.bySubFamilia',	
				  
				  checkboxStockFiltro BIT      '$.checkboxStockFiltro',
				  byStock INT                  '$.byStock',				 			  				  

				  byOrder NVARCHAR(10)         '$.byOrder',
				  byOrderCampo NVARCHAR(50)    '$.byOrderCampo'			  				      
			) AS jsonValues	
			
		
		

		--Filtro con SubFamilia
		IF @checkboxSubFamiliaFiltro = 1
		BEGIN 
			SET @sql = @sql + ' AND ar.idSubFamilia = @bySubFamilia '
		END

		--Articulo con stock
		IF @checkboxStockFiltro = 1 AND @byStock = 1 
			BEGIN			
				SET @sql = @sql + ' AND ar.stock > 0 '
			END 

		--Articulo sin Stock 
		IF  @checkboxStockFiltro = 1 AND @byStock = 2 
			BEGIN			
				SET @sql = @sql + ' AND ar.stock <= 0 '
			END 
				
	    SET @sql = @sql + ' ORDER BY '+ @byOrderCampo+ ' ' +  @byOrder
		
		SELECT		    
			e.ruc
			,e.razonSocial 
			,e.nombreComercial	
			,ISNULL(e.telefono, '')telefonoEntidad
			,ISNULL(e.direccion, '')direccionEntidad
			,@filtroFecha as filtroFecha			
			FROM dbo.Entidad e	WITH(NOLOCK)	
			WHERE e.idEntidad = @byEntidad


		EXEC sp_executesql @sql, 
					@params,	
					@byEntidad    = @byEntidad,
					@bySubFamilia = @bySubFamilia,
					@byOrder      = @byOrder,
					@byOrderCampo = @byOrderCampo

	
		
END 