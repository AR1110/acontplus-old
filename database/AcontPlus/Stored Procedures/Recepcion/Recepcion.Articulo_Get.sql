USE AcontPlus
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-09-19
-- Description:	SP PARA OBTENER LOS ARTICULOS SIMILARES A LOS IMPORTADOS
-- =============================================
--Recepcion.Articulo_Get 38, '{"codigoPrincipal":"","codigoAuxiliar":"","descripcion":"MOUSE", "tipo":"C"}'
IF OBJECT_ID(N'Recepcion.Articulo_Get ', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Articulo_Get
GO
CREATE PROCEDURE Recepcion.Articulo_Get 
@idRol INT
,@jsonData NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @tmp AS TABLE(
	codigoPrincipal VARCHAR(100) NOT NULL
	,codigoAuxiliar VARCHAR(100) NULL
	,descripcion VARCHAR(300) NOT NULL
	,tipo VARCHAR(1)
	,id INT
	)

	INSERT INTO @tmp (codigoPrincipal, codigoAuxiliar, descripcion, tipo, id)
	SELECT LTRIM(RTRIM(codigoPrincipal)), LTRIM(RTRIM(codigoAuxiliar)), LTRIM(RTRIM(descripcion)), tipo, id
	FROM OPENJSON(@jsonData) WITH (codigoPrincipal VARCHAR(100) '$.codigoPrincipal'
	,codigoAuxiliar VARCHAR(100) '$.codigoAuxiliar'
	,descripcion VARCHAR(300) '$.descripcion'
	,tipo VARCHAR(1) '$.tipo'
	,id INT '$.id'
	)
	

	IF NOT EXISTS (SELECT 1 FROM @tmp)
		BEGIN
			RETURN
		END

	SELECT @idEntidad = idEntidad FROM AFTDataRol(@idRol)
	
	IF (SELECT LEN(RTRIM(LTRIM(tipo)))  FROM @tmp) > 0
		BEGIN
			IF (SELECT tipo FROM @tmp) = 'C'
				BEGIN
					SELECT a.idEntidad
					,a.idArticulo
					,a.codigo codigoPrincipal
					,a.codigoAuxiliar
					,a.descripcion
					,a.precioCosto precioUnitario
					,p.nombreFiscal razonSocial
					INTO #TempFirst
					FROM dbo.Articulo a  
					INNER JOIN FacturaCompraDetalle fcd ON a.idArticulo = fcd.idArticulo
					INNER JOIN FacturaCompra fc ON fcd.idFacturaCompra = fc.idFacturaCompra 
					AND fc.idEntidad = @idEntidad
					INNER JOIN Proveedor p ON fc.idProveedor = p.idProveedor 
					AND p.idEntidad = @idEntidad
					WHERE  a.codigo = (SELECT t.descripcion FROM @tmp t)  COLLATE SQL_Latin1_General_Cp1_CI_AI
					AND a.idEntidad = @idEntidad

					INSERT INTO #TempFirst
					SELECT a.idEntidad
					,a.idArticulo
					,a.codigo codigoPrincipal
					,a.codigoAuxiliar
					,a.descripcion
					,a.precioCosto precioUnitario
					,'Sin compras registradas' razonSocial
					--INTO #Temp
					FROM dbo.Articulo a
					WHERE a.codigo = (SELECT t.descripcion FROM @tmp t)  COLLATE SQL_Latin1_General_Cp1_CI_AI
					AND  a.idEntidad = @idEntidad
					AND NOT EXISTS (
						SELECT * FROM FacturaCompraDetalle fcd WHERE a.idArticulo = fcd.idArticulo
					)
			
					--SELECT * FROM #Temp
			
					SELECT * FROM #TempFirst a WHERE idEntidad = @idEntidad 
					GROUP BY 
					 a.idEntidad
					,a.idArticulo
					,a.codigoPrincipal
					,a.codigoAuxiliar
					,a.descripcion
					,a.precioUnitario
					,a.razonSocial

					DROP TABLE #TempFirst
					RETURN
				END
			IF (SELECT tipo FROM @tmp) = 'H'
				BEGIN 
					SELECT p.nombreFiscal proveedor
					--,ISNULL(fc.estab,'') + ' - ' + 
					,fc.puntoEmision + ' - ' + CONVERT(VARCHAR, fc.nroDocumento) nroDocumento
					,fc.fechaEmision
					,fcd.cantidad
					,fcd.precioCosto precioUnitario
					INTO #TempH
					FROM dbo.Articulo a WITH (NOLOCK) 
					INNER JOIN FacturaCompraDetalle fcd ON a.idArticulo = fcd.idArticulo
					INNER JOIN FacturaCompra fc ON fcd.idFacturaCompra = fc.idFacturaCompra 
					AND fc.idEntidad = @idEntidad
					INNER JOIN Proveedor p ON fc.idProveedor = p.idProveedor 
					AND p.idEntidad = @idEntidad
					WHERE  a.idArticulo = (SELECT TOP 1 id FROM @tmp)
					ORDER BY fc.fechaEmision DESC
	
					SELECT TOP 10 * 
					FROM #TempH fc 
					GROUP BY fc.proveedor
					,fc.nroDocumento
					,fc.fechaEmision
					,fc.cantidad
					,fc.precioUnitario
					ORDER BY fechaEmision DESC
					DROP TABLE #Temp
					RETURN
				END

					SELECT a.idEntidad
					,a.idArticulo
					,a.codigo codigoPrincipal
					,a.codigoAuxiliar
					,a.descripcion
					,a.precioCosto precioUnitario
					,p.nombreFiscal razonSocial
					INTO #TempFirstII
					FROM dbo.Articulo a  
					INNER JOIN FacturaCompraDetalle fcd ON a.idArticulo = fcd.idArticulo
					INNER JOIN FacturaCompra fc ON fcd.idFacturaCompra = fc.idFacturaCompra 
					AND fc.idEntidad = @idEntidad
					INNER JOIN Proveedor p ON fc.idProveedor = p.idProveedor 
					AND p.idEntidad = @idEntidad
					WHERE   a.descripcion LIKE '%' + (SELECT t.descripcion FROM @tmp t) + '%' COLLATE SQL_Latin1_General_Cp1_CI_AI
					AND a.idEntidad = @idEntidad

					INSERT INTO #TempFirstII
					SELECT a.idEntidad
					,a.idArticulo
					,a.codigo codigoPrincipal
					,a.codigoAuxiliar
					,a.descripcion
					,a.precioCosto precioUnitario
					,'Sin compras registradas' razonSocial
					--INTO #Temp
					FROM dbo.Articulo a
					WHERE a.descripcion LIKE '%' + (SELECT t.descripcion FROM @tmp t) + '%' COLLATE SQL_Latin1_General_Cp1_CI_AI
					AND  a.idEntidad = @idEntidad
					AND NOT EXISTS (
						SELECT * FROM FacturaCompraDetalle fcd WHERE a.idArticulo = fcd.idArticulo
					)
			
					--SELECT * FROM #Temp
			
					SELECT * FROM #TempFirstII a WHERE idEntidad = @idEntidad 
					GROUP BY 
					 a.idEntidad
					,a.idArticulo
					,a.codigoPrincipal
					,a.codigoAuxiliar
					,a.descripcion
					,a.precioUnitario
					,a.razonSocial

					DROP TABLE #TempFirstII
					RETURN
		END


			SELECT a.idEntidad
			,a.idArticulo
			,a.codigo codigoPrincipal
			,a.codigoAuxiliar
			,a.descripcion
			,a.precioCosto precioUnitario
			,p.nombreFiscal razonSocial
			INTO #Temp
			FROM dbo.Articulo a  
			INNER JOIN FacturaCompraDetalle fcd ON a.idArticulo = fcd.idArticulo
			INNER JOIN FacturaCompra fc ON fcd.idFacturaCompra = fc.idFacturaCompra 
			AND fc.idEntidad = @idEntidad
			INNER JOIN Proveedor p ON fc.idProveedor = p.idProveedor 
			AND p.idEntidad = @idEntidad
			WHERE  a.codigo = (SELECT t.codigoPrincipal FROM @tmp t)
			--OR a.codigoAuxiliar = (SELECT t.codigoPrincipal FROM @tmp t)
			OR a.descripcion LIKE '%' + (SELECT t.descripcion FROM @tmp t) + '%' COLLATE SQL_Latin1_General_Cp1_CI_AI
			AND a.idEntidad = @idEntidad

			INSERT INTO #Temp
			SELECT a.idEntidad
			,a.idArticulo
			,a.codigo codigoPrincipal
			,a.codigoAuxiliar
			,a.descripcion
			,a.precioCosto precioUnitario
			,'Sin compras registradas' razonSocial
			--INTO #Temp
			FROM dbo.Articulo a
			WHERE a.codigo = (SELECT t.codigoPrincipal FROM @tmp t)
			--OR a.codigoAuxiliar = (SELECT t.codigoPrincipal FROM @tmp t)
			OR a.descripcion LIKE '%' + (SELECT t.descripcion FROM @tmp t) + '%' COLLATE SQL_Latin1_General_Cp1_CI_AI
			AND  a.idEntidad = @idEntidad
			AND NOT EXISTS (
				SELECT * FROM FacturaCompraDetalle fcd WHERE a.idArticulo = fcd.idArticulo
			)
			
			--SELECT * FROM #Temp
			
			SELECT * FROM #Temp a WHERE idEntidad = @idEntidad 
			GROUP BY 
			 a.idEntidad
			,a.idArticulo
			,a.codigoPrincipal
			,a.codigoAuxiliar
			,a.descripcion
			,a.precioUnitario
			,a.razonSocial

			DROP TABLE #Temp

END
GO
