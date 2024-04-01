USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Config].[Solicitud_Get]    Script Date: 27/4/2023 14:21:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE OR ALTER PROCEDURE Config.UserCustomerRequest_Get @userRoleId INT, @json VARCHAR(400), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @tipo INT;
	DECLARE @codigoAccion VARCHAR(5)
	DECLARE @idEntidad INT 
	
	DECLARE @idUsuarioRolAprobante INT;

	SELECT TOP 1 @idEntidad =  idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId
	SELECT 
		@tipo = tipo
	FROM OPENJSON(@json)
	WITH(tipo INT '$.tipo')
	
	IF @tipo = 1
		BEGIN 

            SET @tableNames='requests'
			SELECT 
			    s.idSolicitud
				,u_aprob.nombreCompleto as usuarioAprobante
				,u_soli.nombreCompleto  as usuarioSolicitante
				,s.codigoAccion
				,accionDescripcion = CASE s.codigoAccion WHEN 'E' THEN 'EDITAR'
														 WHEN 'A' THEN 'ANULAR' 
														 END
				,s.codEstado
				,estadoDescripcion = CASE s.codEstado WHEN 'P' THEN 'PENDIENTE'
													  WHEN 'A' THEN 'APROBADA'
													  WHEN 'F' THEN 'FINALIZADO'
													  END
				,s.observacion
				,fechaRegistro = FORMAT(s.fechaRegistro, 'dd-MM-yyyy hh:mm')
				,fechaAprobacion = FORMAT(s.fechaAprobacion, 'dd-MM-yyyy hh:mm')
				,urs.codRol
			FROM Config.Solicitud s
			--Datos Aprobante
			INNER JOIN App.UsuarioRol ura WITH(NOLOCK) ON ura.idUsuarioRol = s.idUsuarioRolAprobante
			INNER JOIN Usuario u_aprob WITH(NOLOCK) ON u_aprob.idUsuario   = ura.idUsuario
			--Datos Solicitante
			INNER JOIN App.UsuarioRol urs WITH(NOLOCK) ON urs.idUsuarioRol = s.idUsuarioRolSolictante
			INNER JOIN Usuario u_soli WITH(NOLOCK) ON u_soli.idUsuario     = urs.idUsuario
			WHERE s.idUsuarioRolAprobante = @userRoleId ORDER BY s.idSolicitud DESC 
		END 

	 
	
END 
