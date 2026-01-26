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
	
    DECLARE @codEstab VARCHAR(150) 
    DECLARE @codDoc VARCHAR(5) 
    DECLARE @codEstado VARCHAR(5) 

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
        ,@codDoc = codDoc
        ,@codEstado = codEstado
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
						  ,@codDoc  VARCHAR(5)
						  ,@codEstado  VARCHAR(5)
                          ,@dateFrom DATETIME2
                          ,@dateTo DATETIME2
                          ,@pageIndex INT
                          ,@pageSize INT
                          ,@usuarioSolicitanteId INT'

            DECLARE @sql NVARCHAR(MAX) = ' SELECT 
                                                rowguid
                                               ,idSolicitud
			                                   ,usuarioAprobante
                                               ,usuarioSolicitante
                                               ,codigoAccion
                                               ,codEstado
                                               ,accionDescripcion
                                               ,estadoDescripcion
                                               ,observacion
                                               ,fechaRegistro  = FORMAT(s.fechaRegistro, ''dd/MM/yyyy HH:mm'')
                                               ,fechaAprobacion  = FORMAT(s.fechaAprobacion, ''dd/MM/yyyy HH:mm'')
                                               ,codDoc  
                                               ,tipoDoc  
                                               ,serieComprobante   
                                               ,totalRecords = count(*)     over()
			                              FROM Config.v_User_Request s  
			                              WHERE s.idUsuarioRolAprobante = @userRoleId  '

            IF @codEstab IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND s.codEstab = @codEstab '
				END 

            IF @codDoc IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND s.codDoc = @codDoc '
				END 

             IF @codEstado IS NOT NULL
				BEGIN
					SET @sql = @sql + ' AND s.codEstado = @codEstado '
				END

             IF @usuarioSolicitanteId IS NOT NULL
                BEGIN 
                    SET @sql = @sql + ' AND s.idUsuarioRolSolicitante = @usuarioSolicitanteId '
                END
                
            IF @checkBoxFecha = 1
				BEGIN
					SET @sql = @sql + ' AND CAST(s.fechaRegistro as date) BETWEEN CAST(@dateFrom as date) AND CAST(@dateTo as date) '
				END
			
			SET @sql= @sql + ' ORDER BY s.idSolicitud DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '
		
			EXEC sp_executesql @sql
							  ,@params 
							  ,@userRoleId  
						      ,@codEstab 
						      ,@codDoc  
						      ,@codEstado  
                              ,@dateFrom 
                              ,@dateTo 
                              ,@pageIndex 
                              ,@pageSize 
                              ,@usuarioSolicitanteId


			
		END 


    IF @tipo = 2
		BEGIN 

            SET @tableNames='response'
			DECLARE @keyRequest BIT 
            DECLARE @idDocumento INT
            DECLARE @codigoDoc VARCHAR(5) 

            DECLARE @tbRequestParams AS TABLE (
                idDocumento INT DEFAULT 0,
                codDoc VARCHAR(10) ,
                codEstado VARCHAR(5)
            )

			SELECT  @keyRequest = keyRequest FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @userRoleId   

            INSERT INTO @tbRequestParams (idDocumento, codDoc, codEstado)
            SELECT
                s.idDocumento,
                s.codDoc, 
                s.codEstado
            FROM
                Config.v_User_Request s WITH(NOLOCK)
            WHERE
                s.idDocumento =   JSON_VALUE(@json, '$.idDocumento')
                AND s.codDoc  = JSON_VALUE(@json, '$.codDoc')
                AND s.codigoAccion =  JSON_VALUE(@json, '$.codigoAccion')
                AND s.idUsuarioRolSolicitante = @userRoleId
                AND s.codEstado NOT IN ('F','R') 


;
			IF @keyRequest = 1
				BEGIN
					IF EXISTS(SELECT 1 FROM @tbRequestParams WHERE codEstado='P')
						BEGIN
							SELECT '0'code, 'Por el momento, tu solicitud no ha sido aprobada!'as 'message', 'Solicitud de Clave de Autorizaci�n' as titleSms
							RETURN 
						END 

					IF EXISTS(SELECT 1 FROM @tbRequestParams  WHERE codEstado ='A')
						BEGIN 
							SELECT '1'code, 'Tu soliciud ya ha sido Aprobada' as 'message'
							RETURN 
						END 

					IF NOT EXISTS(SELECT 1 FROM @tbRequestParams  WHERE codEstado='P')
						BEGIN 
							SELECT '2'code, 'Registrar solictud 'as 'message', 'Solicitud de Clave de Autorizaci�n' as titleSms
							RETURN	
						END 					
				END
			ELSE
				SELECT '1'code, 'Puede Editar o Anular'
				RETURN
			
		END 

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
	
END 
