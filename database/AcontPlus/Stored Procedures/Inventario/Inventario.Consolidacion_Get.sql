USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[ConsolidacionInventario_Get]    Script Date: 1/31/2023 2:18:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Inventario.Consolidacion_Get', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Consolidacion_Get
GO
CREATE PROCEDURE Inventario.Consolidacion_Get @idUsuarioRol INT 
,@json VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE  @idEntidad INT
	,@tipo INT
	SET @idEntidad = (SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)

	SELECT @tipo = tipo FROM OPENJSON (@json) WITH (tipo INT '$.tipo')
	IF @tipo = 1
		BEGIN
			SELECT * FROM Familia WHERE idEntidad = @idEntidad
			RETURN
		END
	

	SELECT
	     idConsolidacionInventario = ci.idConsolidacionInventario
		,fechaEmision = dbo.AFTConvertDate(ci.fechaEmision) 
		,observacion = ISNULL(ci.observacion,'Ninguna')
		,total = ci.total
		,nroDoc = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ci.nroDoc)
		,estadoDoc = ep.descripcion
		,codDoc = ep.codigo
		,usuario = u.nombreUsuario
		,style = IIF(ep.codigo = 'A','table-danger','')
	FROM dbo.ConsolidacionInventario ci WITH (NOLOCK)
	INNER JOIN dbo.PuntoEmision   pe  WITH (NOLOCK) ON pe.idPuntoEmision = ci.idPuntoEmision
	INNER JOIN Sri.Establecimiento s  WITH (NOLOCK) ON s.codEstab        = pe.codEstab
	INNER JOIN dbo.Usuario         u  WITH (NOLOCK) ON u.idUsuario       = ci.idUsuario
	INNER JOIN dbo.EstadoPago     ep  WITH (NOLOCK) ON ep.idEstadoPago   = ci.idEstadoDocumento
	WHERE ci.idEntidad = @idEntidad 
	AND ci.estado = 1
	ORDER by ci.idConsolidacionInventario DESC 
END
