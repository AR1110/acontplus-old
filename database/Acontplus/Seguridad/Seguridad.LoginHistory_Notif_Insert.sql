USE Acontplus
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date:  2024-04-03
-- Description: sp for insert send email of logins
-- =============================================
CREATE OR ALTER PROCEDURE Seguridad.LoginHistory_Notif_Insert @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @userId INT
		,@userRoleId INT
		,@userAgentMain VARCHAR(MAX)
		,@loginDate DATETIME2

    DECLARE @userAgent VARCHAR(MAX)
		,@ipAddress VARCHAR(100)

    DECLARE @browser VARCHAR(MAX)
        ,@os VARCHAR(MAX)

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

    SELECT TOP 1
           @enableSsl = [enableSsl]
          ,@from      = [from]
          ,@host      = [host]
          ,@passwordEmail  = [password]
          ,@port      = [port]
  FROM [Config].[Email_Config] WITH (NOLOCK)

    SELECT @userAgentMain = userAgent
        ,@loginDate = loginDate
        ,@userRoleId = userRoleId
        ,@userId = userId
    FROM OPENJSON (@json) WITH (userAgent VARCHAR(MAX), loginDate DATETIME2, userRoleId INT, userId INT)

    --SELECT @userAgentMain

    SELECT @userAgent = userAgent
        ,@ipAddress = ipAddress

    FROM OPENJSON (@userAgentMain) WITH (userAgent VARCHAR(MAX), ipAddress VARCHAR(100))

    --SELECT @userAgent, @ipAddress

    --SELECT @userId, @userRoleId

    SET @browser = (SELECT JSON_VALUE(@userAgent, '$.browser.name') + ' - version: ' + JSON_VALUE(@userAgent, '$.browser.version'))
    SET @os = (JSON_VALUE(@userAgent, '$.os.name') + ' - version: ' + JSON_VALUE(@userAgent, '$.os.version'))
    --SELECT JSON_VALUE(@userAgent, '$.browser.version') AS BrowserVersion
    --SELECT JSON_VALUE(@userAgent, '$.cpu.architecture') AS CPUArchitecture
    --SELECT JSON_VALUE(@userAgent, '$.engine.name') AS EngineName
    --SELECT JSON_VALUE(@userAgent, '$.engine.version') AS EngineVersion
    --SELECT JSON_VALUE(@userAgent, '$.os.name') AS OSName
    --SELECT JSON_VALUE(@userAgent, '$.os.version') AS OSVersion
    --SELECT JSON_VALUE(@userAgent, '$.ua') AS UserAgent

    --SELECT @browser, @os, CONVERT(VARCHAR, FORMAT(@loginDate, 'dd/MM/yyyy HH:mm'), 13)
 
    
    SELECT @template = 'Login_History.html'
                            SET @subject = 'ACCESO CON EXITO'

                            DECLARE @userToSendEmail AS TABLE (
                                emailData VARCHAR(MAX) NOT NULL,
                                params VARCHAR(500) NOT NULL,
                                receptor VARCHAR(100) NOT NULL
                                )

                            DECLARE @requesting_user VARCHAR(300)
                                ,@username VARCHAR(100)
                                ,@company VARCHAR(300)
                                ,@role VARCHAR(25)
                                 
                            
                                SELECT @company = IIF(en.nombreComercial IS NULL, en.razonSocial, en.nombreComercial)
                                    ,@role = ro.[Name]
                                    ,@username = us.nombreUsuario
                                    ,@requesting_user = UPPER(cu.BusinessName)
                                FROM Acontplus.App.UsuarioRol              ur WITH (NOLOCK) 
                                INNER JOIN Acontplus.dbo.Entidad           en WITH (NOLOCK) ON en.idEntidad = ur.idEntidad
                                INNER JOIN AcontplusAdmin.Seguridad.[Role] ro WITH (NOLOCK) ON ro.Id        = ur.RoleId
                                INNER JOIN Acontplus.dbo.Usuario           us WITH (NOLOCK) ON us.idUsuario = ur.idUsuario
                                INNER JOIN Customer.Customer               cu WITH (NOLOCK) ON cu.Id        = us.CustomerId
                                WHERE ur.idUsuarioRol = @userRoleId

                            INSERT INTO @userToSendEmail(emailData, params, receptor)
							SELECT  
                                (SELECT body = (SELECT @requesting_user requesting_user
                                                ,approving_user = UPPER(cu.BusinessName)
                                                ,@browser browser
                                                ,@os os
                                                ,CONVERT(VARCHAR, FORMAT(@loginDate, 'dd/MM/yyyy HH:mm'), 13) loginDate
                                                ,ISNULL(@ipAddress, '') ipAddress
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
                                       us.correo
							   FROM Acontplus.dbo.Usuario us WITH (NOLOCK)
                               INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id = us.customerId
                               WHERE us.idUsuario = @userId
                                    
                            
			                    INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario)
                                SELECT params, emailData, receptor,  'NE', @userId FROM @userToSendEmail

END
GO
