



USE AcontPlus;

IF OBJECT_ID('Config.Solicitud_Get') IS NOT NULL
	DROP PROCEDURE Config.Solicitud_Get
GO 

--Config.Solicitud_Get 38, '{"typeList":3,"searchText":"s"}'

CREATE PROCEDURE Config.Solicitud_Get @idUsuarioRol INT, @json VARCHAR(400)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @typeList INT;
	DECLARE @codigoAccion VARCHAR(5)
	DECLARE @idEntidad VARCHAR(10) = (SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol);
	
	SELECT 
		@typeList = typeList,
		@codigoAccion = codigoAccion
	FROM OPENJSON(@json)
	WITH(typeList INT '$.typeList', codigoAccion VARCHAR(5) '$.codigoAccion')
	
	IF @typeList = 1
		BEGIN 
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
				,s.fechaRegistro
				,urs.codRol
			FROM Config.Solicitud s
			--Datos Aprobante
			INNER JOIN App.UsuarioRol ura WITH(NOLOCK) ON ura.idUsuarioRol = s.idUsuarioRolAprobante
			INNER JOIN Usuario u_aprob WITH(NOLOCK) ON u_aprob.idUsuario   = ura.idUsuario
			--Datos Solicitante
			INNER JOIN App.UsuarioRol urs WITH(NOLOCK) ON urs.idUsuarioRol = s.idUsuarioRolSolictante
			INNER JOIN Usuario u_soli WITH(NOLOCK) ON u_soli.idUsuario     = urs.idUsuario
			WHERE s.idUsuarioRolAprobante = @idUsuarioRol
		END 

	IF @typeList = 2
		BEGIN 
			
			IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idUsuarioRolSolictante = @idUsuarioRol AND codigoAccion=@codigoAccion AND codEstado='P')
				BEGIN
					SELECT '0'code, 'Por el momento, tu solicitud no ha sido aprobada!'as 'message', 'Solicitud de Clave de Autorización' as titleSms
					RETURN 
				END 

			IF EXISTS(SELECT 1 FROM Config.Solicitud WHERE idUsuarioRolSolictante = @idUsuarioRol AND codigoAccion=@codigoAccion AND codEstado='A')
				BEGIN 
					SELECT '1'code, 'Tu soliciud ya ha sido Aprobada' as 'message'
					RETURN 
				END 

			IF NOT EXISTS(SELECT 1 FROM Config.Solicitud WHERE idUsuarioRolSolictante = @idUsuarioRol AND codigoAccion=@codigoAccion AND codEstado='P')
				BEGIN 
					SELECT '2'code, 'register solictud 'as 'message', 'Solicitud de Clave de Autorización' as titleSms
					RETURN	
				END 
		END 

	IF @typeList = 3
		BEGIN
			DECLARE @searchText VARCHAR(50);
			
			SELECT 
				@searchText = searchText
			FROM OPENJSON(@json)
			WITH(
				searchText VARCHAR(10) '$.searchText'
			)

			SELECT 
			 ur.idUsuarioRol
			 ,u.nombreCompleto
			 ,u.nroIdentificacion
			FROM App.UsuarioRol ur 
			INNER JOIN Usuario u WITH(NOLOCK) ON u.idUsuario = ur.idUsuario
			WHERE ur.idEntidad = @idEntidad AND u.nombreCompleto LIKE '%' + @searchText + '%' OR u.nroIdentificacion LIKE '%' + @searchText + '%'  
			


		END 
	--INSERT INTO Config.Solicitud (idUsuarioRolAprobante, idUsuarioRolSolictante, observacion, codigoAccion, codEstado)VALUES(38, 39, 'EDITAR FACTURA N°. 23545454', 'E', 'P')

	
END 
