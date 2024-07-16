USE AcontPlus
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-09-19
-- Description:	SP PARA OBTENER LOS ARTICULOS SIMILARES A LOS IMPORTADOS
-- =============================================
--Recepcion.Articulo_Get 28, '{"id":74327,"tipo":"H"}'
 
CREATE OR ALTER PROCEDURE Recepcion.Articulo_Get 
@idRol INT
,@jsonData NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idEntidad INT
	DECLARE @tmp AS TABLE(
	codigoPrincipal VARCHAR(100) NULL
	,codigoAuxiliar VARCHAR(100) NULL
	,descripcion VARCHAR(300) NULL
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

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol
	
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
					,'Sin compras registradas' razonSocial
					INTO #TempFirst
					FROM dbo.Articulo a WITH(NOLOCK)
					WHERE a.codigo = (SELECT t.descripcion FROM @tmp t)  COLLATE SQL_Latin1_General_Cp1_CI_AI
					AND  a.idEntidad = @idEntidad
					OR (a.codigoAuxiliar = (SELECT t.descripcion FROM @tmp t)  COLLATE SQL_Latin1_General_Cp1_CI_AI)
					OR (a.codigoBarra = (SELECT t.descripcion FROM @tmp t)  COLLATE SQL_Latin1_General_Cp1_CI_AI)
					AND a.estado = 1
					--AND NOT EXISTS (
					--	SELECT * FROM FacturaCompraDetalle fcd WHERE a.idArticulo = fcd.idArticulo
					--)
			
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
					SELECT fc.razonSocialEmisior proveedor
					,fc.serieComprobante nroDocumento
					,fc.fechaEmision
					,fcd.cantidad
					,fcd.precioUnitario
					INTO #TempH
					FROM dbo.Articulo a WITH (NOLOCK) 
					INNER JOIN Recepcion.DocumentoDetalle fcd  WITH(NOLOCK) ON a.idArticulo = fcd.idArticulo
					INNER JOIN Recepcion.DocumentoRecibido fc  WITH(NOLOCK) ON fcd.idDocumento = fc.idDocumento
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
					DROP TABLE #TempH
					RETURN
				END 
					SELECT a.idEntidad
					,a.idArticulo
					,a.codigo codigoPrincipal
					,a.codigoAuxiliar
					,a.descripcion
					,a.precioCosto precioUnitario
					,'Sin compras registradas' razonSocial
					INTO #TempFirstII
					FROM dbo.Articulo a  WITH(NOLOCK)
					WHERE a.descripcion LIKE '%' + (SELECT t.descripcion FROM @tmp t) + '%' COLLATE SQL_Latin1_General_Cp1_CI_AI
					AND  a.idEntidad = @idEntidad
					AND a.estado = 1
 
 
			
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
	,'Sin compras registradas' razonSocial
	INTO #Temp
	FROM dbo.Articulo a  WITH(NOLOCK)
	WHERE   a.idEntidad = @idEntidad
	AND a.estado = 1
	AND (a.codigo = (SELECT t.codigoPrincipal FROM @tmp t) OR 
			a.descripcion LIKE '%' + (SELECT t.descripcion FROM @tmp t) + '%' COLLATE SQL_Latin1_General_Cp1_CI_AI
	) 

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
