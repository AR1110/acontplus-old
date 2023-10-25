USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPConsolidacionInventarioReport]    Script Date: 12/8/2022 6:11:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

--exec ASPConsolidacionInventarioReport 1036, [{"idConsolidacionInventario": 34}]
IF OBJECT_ID(N'ReporteInventario.ConsolidacionInventario', N'P') IS NOT NULL
DROP PROCEDURE ReporteInventario.ConsolidacionInventario
GO
CREATE PROCEDURE ReporteInventario.ConsolidacionInventario
	@idRol INT
	,@json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @idConsolidacionInventario BIGINT
		   ,@idEntidad int = (SELECT idEntidad FROM AFTDataRol(@idRol))		   		   

	SELECT idConsolidacionInventario
	into #tbl
	FROM OPENJSON(@json)
	WITH (idConsolidacionInventario BIGINT '$.idConsolidacionInventario'   
	) AS jsonValues 
	
	SELECT @idConsolidacionInventario = idConsolidacionInventario FROM dbo.#tbl

	BEGIN TRY
		SELECT 
		     dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,cinv.nroDoc) nroDoc
			,CONVERT(NVARCHAR, FORMAT(cinv.fechaEmision, 'dd/MM/yyyy hh:mm')) as fechaEmision 
			,'CONSOLIDACIÓN DE INVENTARIO' tipoDoc
			,ISNULL(cinv.observacion, '') as observacion 
			,e.razonSocial
			,e.nombreComercial
			,e.ruc
			,e.direccion 
			,e.email 																					
			,CAST(cinv.total AS numeric(15,2)) as total
		FROM dbo.ConsolidacionInventario cinv WITH (NOLOCK)
		INNER JOIN dbo.PuntoEmision        pe WITH (NOLOCK) ON pe.idPuntoEmision  = cinv.idPuntoEmision
		INNER JOIN Sri.Establecimiento      s WITH (NOLOCK) ON s.codEstab         = pe.codEstab
		INNER JOIN dbo.TipoDocumento       td WITH (NOLOCK) ON td.idTipoDocumento = cinv.idTipoDocumento					
		INNER JOIN dbo.Entidad              e WITH (NOLOCK) ON e.idEntidad        = cinv.idEntidad
		WHERE cinv.idConsolidacionInventario = @idConsolidacionInventario 

		SELECT 
			 a.codigo			
			,cid.descripcion 
			,CAST(cid.cantidad as numeric(18,2)) as cantidad
			,m.descripcion as medida
			,CAST(a.stock as numeric(18,2)) as stock 
			,CAST(cid.precioCosto as numeric(18,2)) as precioCosto
			,CAST(cid.precioActual as numeric(18,2)) as precioActual 			
			,CAST((cid.cantidad * cid.precioActual) AS numeric(15,2)) as total
		FROM ConsolidacionInventarioDetalle cid WITH (NOLOCK)
		INNER JOIN Medida                     m WITH (NOLOCK) ON m.idMedida = cid.idMedida
		INNER JOIN Articulo                   a WITH (NOLOCK) ON a.idArticulo = cid.idArticulo 
		WHERE cid.idConsolidacionInventario = @idConsolidacionInventario AND cid.estado = 1
	END TRY
	BEGIN CATCH
	END CATCH

	
END 

