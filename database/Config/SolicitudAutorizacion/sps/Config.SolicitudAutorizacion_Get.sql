USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Config].[Solicitud_Get]    Script Date: 27/4/2023 14:21:40 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 

CREATE OR ALTER PROCEDURE Config.SolicitudAutorizacion_Get @userRoleId INT, @json VARCHAR(400), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	DECLARE @tipo INT;
	DECLARE @codigoAccion VARCHAR(5)
	DECLARE @idEntidad INT 
	
    DECLARE @codEstab VARCHAR(150) 
    DECLARE @codigoModulo VARCHAR(5) 
    DECLARE @codigoEstado VARCHAR(5) 

    DECLARE @checkBoxFecha BIT 
    DECLARE @dateFrom DATETIME2
    DECLARE @dateTo DATETIME2  
    DECLARE @pageIndex INT
    DECLARE @pageSize INT
    DECLARE @usuarioSolicitanteId INT 

	SELECT TOP 1 @idEntidad =  idEntidad FROM v_usuario WHERE idUsuarioRol = @userRoleId
	SELECT 
		@tipo = tipo
        ,@codEstab = codEstab
        ,@codigoModulo = codDoc
        ,@codigoEstado = codEstado
        ,@dateFrom = dateFrom 
        ,@dateTo   = dateTo
        ,@checkBoxFecha = checkBoxFecha
        ,@pageIndex = pageIndex 
        ,@pageSize = pageSize 
        ,@usuarioSolicitanteId = usuarioSolicitanteId
	FROM OPENJSON(@json)
	WITH(
            tipo INT  
            ,codEstab VARCHAR(150) 
            ,codDoc VARCHAR(5)
            ,codEstado VARCHAR(5)
            ,checkBoxFecha BIT
            ,dateFrom DATETIME2 
            ,dateTo DATETIME2
            ,pageIndex INT 
            ,pageSize INT 
            ,usuarioSolicitanteId INT
        )
	
	IF @tipo = 1
		BEGIN 

            SET @tableNames='requests'

            DECLARE @params NVARCHAR(MAX) = '@userRoleId  INT
						  ,@codEstab VARCHAR(150)
						  ,@codigoModulo  VARCHAR(5)
						  ,@codigoEstado  VARCHAR(5)
                          ,@dateFrom DATETIME2
                          ,@dateTo DATETIME2
                          ,@pageIndex INT
                          ,@pageSize INT
                          ,@usuarioSolicitanteId INT'

            DECLARE @sql NVARCHAR(MAX) = '
            SELECT 
                s.rowguid,
                s.idSolicitudAutorizacion,
                s.usuarioAprobante,
                s.usuarioSolicitante,
                s.codigoAccion,
                s.codigoEstado,
                s.nombreAccion,
                s.nombreEstado,
                s.obs,
                fechaRegistro = FORMAT(s.fechaRegistro, ''dd/MM/yyyy HH:mm''),
                fechaRespuesta = FORMAT(s.fechaRespuesta, ''dd/MM/yyyy HH:mm''),
                s.codigoModulo,
                s.nombreModulo,
                s.serieComprobante,
                nomAdminRoles = (
                    SELECT STRING_AGG(apr.BusinessName, '', '')  
                    FROM Config.vw_Solicitud_Auth_Admin_Role apr
                    WHERE apr.idSolicitudAutorizacion = s.idSolicitudAutorizacion   
                    GROUP BY apr.idSolicitudAutorizacion
                ),
                totalRecords = COUNT(*) OVER()
            FROM Config.vw_Solicitud_Autorizacion s
            INNER JOIN Config.vw_Solicitud_Auth_Admin_Role r ON s.idSolicitudAutorizacion = r.idSolicitudAutorizacion
            WHERE r.idUsuarioRol = @userRoleId
            '

            IF @codEstab IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND s.codEstab = @codEstab '
				END 

            IF @codigoModulo IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND s.codigoModulo = @codigoModulo '
				END 

             IF @codigoEstado IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND s.codigoEstado = @codigoEstado '
				END

             IF @usuarioSolicitanteId IS NOT NULL
                BEGIN 
                    SET @sql = @sql + ' AND s.idUsuarioRolSolicitante = @usuarioSolicitanteId '
                END
                
            IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql + ' AND CAST(s.fechaRegistro as date) BETWEEN CAST(@dateFrom as date) AND CAST(@dateTo as date) '
				END
			
			SET @sql= @sql + ' ORDER BY s.idSolicitudAutorizacion DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '
		
			EXEC sp_executesql @sql
							  ,@params 
							  ,@userRoleId  
						      ,@codEstab 
						      ,@codigoModulo  
						      ,@codigoEstado  
                              ,@dateFrom 
                              ,@dateTo 
                              ,@pageIndex 
                              ,@pageSize 
                              ,@usuarioSolicitanteId


			
		END 

     
    --Verificar si puede tiene aprobado la accion 

    IF @tipo = 2
		BEGIN 

            SET @tableNames='response'
			DECLARE @keyRequest BIT =1
            DECLARE @idDocumento INT
            DECLARE @codigoDoc VARCHAR(5)  

            DECLARE @tbRequestParams AS TABLE (
                idDocumento INT DEFAULT 0,
                codDoc VARCHAR(10) ,
                codEstado VARCHAR(5)
            )

			SELECT @codigoAccion = codigoAccion 
			FROM OPENJSON(@json)
			WITH(
				codigoAccion VARCHAR(5)
			)

		SELECT  @keyRequest = keyRequest FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @userRoleId   
	
			-- Obtener el c�digo de acci�n desde el JSON
			SELECT @codigoAccion = codigoAccion 
			FROM OPENJSON(@json)
			WITH (
				codigoAccion VARCHAR(5)
			)

			-- Verificar que se haya recibido una acci�n v�lida
			IF @codigoAccion IS NULL
			BEGIN
				SELECT '0' AS code, 'Acci�n no definida' AS message, 'Solicitud de Autorizaci�n' AS titleSms
				RETURN
			END

			-- Determinar si el usuario tiene permiso para editar o anular
			--IF @codigoAccion = 'E' AND EXISTS (SELECT 1 FROM Config.vw_User_Permissions WHERE userRoleId = @userRoleId AND menuCode = 'GV' AND [name] = 'editar')
			--	SET @keyRequest = 1
			--IF @codigoAccion = 'A' AND EXISTS (SELECT 1 FROM Config.vw_User_Permissions WHERE userRoleId = @userRoleId AND menuCode = 'GV' AND [name] = 'anular')
			--	SET @keyRequest = 1

			-- Insertar par�metros de la solicitud en la tabla temporal
			INSERT INTO @tbRequestParams (idDocumento, codDoc, codEstado)
			SELECT
				IdDocumento,
				CodigoModulo,
				CodigoEstado
			FROM
				 Config.vw_Solicitud_Autorizacion WITH(NOLOCK)
			WHERE
				IdDocumento  = JSON_VALUE(@json, '$.idDocumento')
				AND CodigoModulo = JSON_VALUE(@json, '$.codigoModulo')
				AND CodigoAccion = JSON_VALUE(@json, '$.codigoAccion')
				AND userRoleIdLogged = @userRoleId
				AND CodigoEstado NOT IN ('F', 'R')

			-- Validar la solicitud y enviar la respuesta correspondiente
			IF @keyRequest = 1
			BEGIN
				IF EXISTS(SELECT 1 FROM @tbRequestParams WHERE codEstado = 'P')
				BEGIN
					SELECT '0' AS code, 'Por el momento, tu solicitud no ha sido aprobada!' AS message, 'Solicitud de Autorizaci�n' AS titleSms
					RETURN
				END

				IF EXISTS(SELECT 1 FROM @tbRequestParams WHERE codEstado = 'A')
				BEGIN
					SELECT '1' AS code, 'Tu solicitud ya ha sido Aprobada' AS message
					RETURN
				END

				IF NOT EXISTS(SELECT 1 FROM @tbRequestParams WHERE codEstado = 'P')
				BEGIN
					SELECT '2' AS code, 'Registrar solicitud' AS message, 'Solicitud de Autorizaci�n' AS titleSms
					RETURN
				END
			END
			ELSE
			BEGIN
				SELECT '1' AS code, 'Puede Editar o Anular' AS message
				RETURN
			END
			
		END 
    ---Filtros
	IF @tipo = 3
        BEGIN 
            SET @tableNames='estabs,usersRole'

             SELECT idEstablecimiento
                    ,nombreComercial
                    ,codEstab
                    ,idPuntoEmision
                    ,estab + '-' + ptoEmi as ptoEmi
                    ,defaultEstab
                    ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT 
				 idUsuarioRol = ur.idUsuarioRol
				,idUsuario = ur.idUsuario 
                ,cc.BusinessName as nombreCompleto 
				,cc.IDCard as nroIdentificacion 
			FROM App.UsuarioRol ur
			INNER JOIN dbo.Usuario u WITH(NOLOCK) on u.idUsuario = ur.idUsuario
            INNER JOIN Customer.Customer cc WITH(NOLOCK) ON cc.Id = u.customerId
            INNER JOIN Seguridad.[Role] sr WITH(NOLOCK) ON sr.Id = ur.RoleId
			WHERE ur.idEntidad = @idEntidad AND ur.idUsuarioRol !=@userRoleId 
        END

    IF @tipo = 4
        BEGIN 
            SET @tableNames='list'
            DECLARE @id INT

            SELECT 
                @id = id
            FROM OPENJSON(@json)
            WITH(
                id INT
            )

             SELECT 
                Nombre,
                Valor,
                NuevoValor,
                Obs
             FROM Config.SolicitudAutorizacionDetalle WHERE IdSolicitudAutorizacion = @id
        END
	
	
END 
