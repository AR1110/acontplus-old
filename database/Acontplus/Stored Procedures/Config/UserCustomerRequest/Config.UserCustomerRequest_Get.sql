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
			   *
			FROM Config.v_User_Request s WITH(NOLOCK) 
			WHERE s.idUsuarioRolAprobante = @userRoleId ORDER BY s.idSolicitud DESC 
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
                AND s.idUsuarioRolSolictante = @userRoleId
                AND s.codEstado NOT IN ('F','R') 


;
			IF @keyRequest = 1
				BEGIN
					IF EXISTS(SELECT 1 FROM @tbRequestParams WHERE codEstado='P')
						BEGIN
							SELECT '0'code, 'Por el momento, tu solicitud no ha sido aprobada!'as 'message', 'Solicitud de Clave de Autorización' as titleSms
							RETURN 
						END 

					IF EXISTS(SELECT 1 FROM @tbRequestParams  WHERE codEstado ='A')
						BEGIN 
							SELECT '1'code, 'Tu soliciud ya ha sido Aprobada' as 'message'
							RETURN 
						END 

					IF NOT EXISTS(SELECT 1 FROM @tbRequestParams  WHERE codEstado='P')
						BEGIN 
							SELECT '2'code, 'Registrar solictud 'as 'message', 'Solicitud de Clave de Autorización' as titleSms
							RETURN	
						END 					
				END
			ELSE
				SELECT '1'code, 'Puede Editar o Anular'
				RETURN
			
		END 

	 
	
END 
