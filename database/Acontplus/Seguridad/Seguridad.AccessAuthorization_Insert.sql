USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-04-08
-- Description: sp for insert notification
-- =============================================
CREATE OR ALTER PROCEDURE Seguridad.AccessAuthorization_Insert @uuid UNIQUEIDENTIFIER
	,@userRoleId INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON; 

	DECLARE @userId INT

	DECLARE @params NVARCHAR(MAX)
	DECLARE @emailData VARCHAR(MAX)

	DECLARE @receptor VARCHAR(200)
	DECLARE @codigo VARCHAR(5)
	DECLARE @jsonConfig AS VARCHAR(MAX)
	DECLARE @id INT 

	--Email 
	DECLARE @body VARCHAR(MAX);
	DECLARE @cliente VARCHAR(100)
	DECLARE @documento VARCHAR(30)
	DECLARE @template VARCHAR(50)
	DECLARE @subject VARCHAR(100)

    DECLARE  @enableSsl INT 
    DECLARE @from  VARCHAR(100)
    DECLARE @host  VARCHAR(100) 
    DECLARE @passwordEmail VARCHAR(50)
    DECLARE @port INT 
    DECLARE @cc VARCHAR(100)

	--SET @userId = (SELECT idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId)

    SELECT TOP 1
           @enableSsl = [enableSsl]
          ,@from      = [from]
          ,@host      = [host]
          ,@passwordEmail  = [password]
          ,@port      = [port]
        FROM [Config].[Email_Config] WITH (NOLOCK)

	SELECT @template = 'Email_Auth.html'
                                    SET @subject = 'Solicitud de Autorización de Ingreso'

                                    DECLARE @userToSendEmail AS TABLE (
                                        emailData VARCHAR(MAX) NOT NULL,
                                        params VARCHAR(500) NOT NULL,
                                        receptor VARCHAR(100) NOT NULL
                                        )

                                  DECLARE @requesting_user VARCHAR(300)
                                        ,@username VARCHAR(100)
                                        ,@company VARCHAR(300)
                                        ,@role VARCHAR(25)
                                        ,@auth_code INT = (SELECT 100000 + ABS(CHECKSUM(NEWID()) % 900000))


                                       SELECT @company = IIF(e.nombreComercial IS NULL, e.razonSocial, e.nombreComercial)
                                    ,@role = r.[Name]
                                    ,@username = u.nombreUsuario
                                    ,@requesting_user = UPPER(u.nombreCompleto)
                                    ,@userId = ur.idUsuario
                                FROM Acontplus.App.UsuarioRol ur 
                                INNER JOIN Acontplus.dbo.Entidad e ON ur.idEntidad = e.idEntidad
                                INNER JOIN AcontplusAdmin.Seguridad.[Role] r ON ur.RoleId = r.Id
                                INNER JOIN Acontplus.dbo.Usuario u ON ur.idUsuario = u.idUsuario
                                WHERE ur.idUsuarioRol = @userRoleId

                                    INSERT INTO Seguridad.AccessAuthorization(SenderId, ReceiverId, Code, Uuid)
                                    SELECT @userId, u.idUsuario, @auth_code, @Uuid FROM Acontplus.dbo.Usuario u 
                                            INNER JOIN Acontplus.App.UsuarioRol ur ON u.idUsuario = ur.idUsuario
                                             INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                                             INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.Uuid = c.Uuid 
                                            INNER JOIN AcontplusAdmin.Seguridad.[Role] r ON ur.RoleId = r.Id
                                         WHERE  r.Code = 'ADM'
                                            AND c.Id IN (SELECT cc.Id FROM Acontplus.App.UsuarioRol urr WITH (NOLOCK) 
                                                                    INNER JOIN Acontplus.dbo.Entidad ee WITH (NOLOCK) ON urr.idEntidad = ee.idEntidad
                                                                    INNER JOIN AcontplusAdmin.Config.Company cc WITH (NOLOCK) ON ee.Uuid = cc.Uuid 
                                                                    WHERE urr.idUsuarioRol = @userRoleId
                                                                    AND urr.estado = 1
                                                        )
                                            AND u.correo IS NOT NULL
                                            AND u.estado = 1

                                    INSERT INTO @userToSendEmail(emailData, params, receptor)
							        SELECT  
                                        (SELECT body = (SELECT @requesting_user requesting_user
                                                    ,@auth_code auth_code
                                                    ,approving_user = u.nombreCompleto 
                                                    ,@username username
                                                    ,@company company
                                                    ,@role AS 'role'
                                                    FOR JSON PATH, WITHOUT_ARRAY_WRAPPER)
			                                ,ISNULL(@cc,'') as 'cc' 						  
							                 ,EnableSsl =@enableSsl
									         ,'from' = @from
                                             ,'username' = @from
									         ,'host'= @host
									         ,'logo'= 'logoAcontPlus.jpg'
									         ,'password'= @passwordEmail
									         ,'port'= @port
									         ,'subject'= @subject 
									         ,'template'= @template FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							           ),
                                       (SELECT hasFile = CAST(0 AS BIT) FOR JSON PATH, WITHOUT_ARRAY_WRAPPER),
                                       u.correo
								        FROM Acontplus.dbo.Usuario u 
                                            INNER JOIN Acontplus.App.UsuarioRol ur ON u.idUsuario = ur.idUsuario
                                             INNER JOIN Acontplus.dbo.Entidad e WITH (NOLOCK) ON ur.idEntidad = e.idEntidad
                                             INNER JOIN AcontplusAdmin.Config.Company c WITH (NOLOCK) ON e.Uuid = c.Uuid 
                                            INNER JOIN AcontplusAdmin.Seguridad.[Role] r ON ur.RoleId = r.Id
                                         WHERE  r.Code = 'ADM'
                                            AND c.Id IN (SELECT cc.Id FROM Acontplus.App.UsuarioRol urr WITH (NOLOCK) 
                                                                    INNER JOIN Acontplus.dbo.Entidad ee WITH (NOLOCK) ON urr.idEntidad = ee.idEntidad
                                                                    INNER JOIN AcontplusAdmin.Config.Company cc WITH (NOLOCK) ON ee.Uuid = cc.Uuid 
                                                                    WHERE urr.idUsuarioRol = @userRoleId
                                                                    AND urr.estado = 1
                                                        )
                                            AND u.correo IS NOT NULL
                                            AND u.estado = 1
                            
			                            INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario)
                                        SELECT params, emailData, receptor,  'NE', @userId FROM @userToSendEmail
END
GO
