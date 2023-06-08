USE [AcontPlus]
GO

/****** Object:  View [dbo].[v_Rol]    Script Date: 06/08/2023 9:50:22 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


	ALTER VIEW [dbo].[v_Rol] AS (
	SELECT r.idUsuarioRol
	,r.idUsuario
	,r.idRol
	,p.codigo codPolitica
	,r.idEntidad
	,u.nombreUsuario
	,u.nombreCompleto
	,p.descripcion rol
	,e.razonSocial empresa
	,r.estado
	FROM App.UsuarioRol r
	INNER JOIN dbo.Usuario u ON r.idUsuario = u.idUsuario
	LEFT JOIN dbo.Politica p ON r.idRol = p.idPolitica
	LEFT JOIN dbo.Entidad e ON r.idEntidad = e.idEntidad
	)
GO


