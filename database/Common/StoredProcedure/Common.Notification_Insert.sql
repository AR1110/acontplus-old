USE Acontplus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2024-12-17
-- Description:	sp for notification insert
-- =============================================

CREATE OR ALTER PROCEDURE Common.Notification_Insert @userRoleId INT,
	@json VARCHAR(MAX),
    @fromMobile BIT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT ,@idEntidad INT
	
    --> Data Json
    DECLARE @codDoc VARCHAR(5),
        @params NVARCHAR(MAX),
        @receptor VARCHAR(254),
        @codigo VARCHAR(5),
        @id INT; 

    DECLARE @notificationId INT;
    DECLARE @notificationTypeId INT;
    DECLARE @emailSenderConfigId INT;
    DECLARE @priorityId INT;
    DECLARE @statusId INT; 

	--> Email 
	DECLARE @body VARCHAR(MAX)
	       ,@template VARCHAR(50)
	       ,@subject VARCHAR(100)
           ,@cc VARCHAR(100);

	BEGIN TRY
            -- Set values for reusable constants
        SET @notificationTypeId = (SELECT TOP 1 Id FROM Common.NotificationType WHERE Code = 'E');
        SET @priorityId = (SELECT Id FROM Common.[Priority] WHERE Code = 'M');
        SET @statusId = (SELECT Id FROM Common.[Status] WHERE Code = 'Q');

        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        IF NOT EXISTS (SELECT 1 FROM Config.EmailSenderConfig WHERE CompanyId = @idEntidad)
            BEGIN
                SET @emailSenderConfigId = (SELECT TOP 1 Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE IsGlobal = 1 AND IsActive = 1);
            END
            ELSE
            BEGIN
                SET @emailSenderConfigId = (SELECT Id 
                                               FROM Config.EmailSenderConfig 
                                               WHERE CompanyId = @idEntidad);
            END

        IF (@emailSenderConfigId IS NULL OR @emailSenderConfigId = 0)
            BEGIN
                SELECT '0' code, 'No existe una configuración para el envio de correo' as 'message' 
                RETURN
            END

		
		SELECT @codDoc	 = js.codDoc		
			  ,@id		 = js.id
			  ,@codigo	 = js.codigo
			  ,@receptor = js.receptor
			  ,@params	 = js.params
			  ,@subject	 = js.subjectJson
		FROM OPENJSON(@json)WITH
        (			
            codDoc				VARCHAR(6)		'$.codDoc',
            serieComprobante	VARCHAR(50)		'$.serieComprobante',
            codigo				VARCHAR(5)		'$.params.reportParams.codigo',
            id					INT				'$.params.spParams.id',
            receptor			VARCHAR(254)	'$.receptor',
            params				NVARCHAR(MAX)	'$.params' AS JSON,
            subjectJson			VARCHAR(500)	'$.subject'

		) AS js


        --> Tipo para reportes 
		IF EXISTS (SELECT 1 FROM Config.Reporte WITH (NOLOCK) WHERE codigo = @codigo)
			BEGIN
                SET @template = 'ReporteGenerado.html'

				SET @body = (
								SELECT dbo.AFTConvertDate(dbo.ufnGetDateEcuador())+dbo.AFTConvertHora(dbo.ufnGetDateEcuador()) as fechaEmision
									  ,ISNULL(en.telefono, '')                                                                 as telefono
									  ,en.razonSocial                                                                          as razonSocial
                                      ,@subject         as title                                                                          
								FROM dbo.Entidad en WHERE idEntidad = @idEntidad
								FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							)
			END 

		--> Proforma 
		IF @codigo = 'PR'
			BEGIN 
				IF @id IS NULL
					BEGIN	
						SELECT '0' code, 'Id No Valido' as 'message'
						RETURN
					END 

				
				SET @body = (
								SELECT cu.BusinessName                                                         as cliente
									  ,dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,pr.nroDocumento)          as documento
									  ,dbo.AFTConvertDate(pr.fechaEmision)+dbo.AFTConvertHora(pr.fechaEmision) as fechaEmision
									  ,CAST(pr.total as numeric(18,2))	                                       as importeTotal													   
									  ,ISNULL(es.telefono, '')                                                 as telefono
									  ,en.razonSocial                                                          as razonSocial
								FROM dbo.Proforma              pr WITH (NOLOCK) 
								INNER JOIN DBO.Cliente         cl WITH (NOLOCK) ON cl.idCliente         = pr.idCliente 
								INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = pr.idPuntoEmision
								INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad         = pr.idEntidad
                                INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
								INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId 
								WHERE pr.idProforma = @id
								FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
						    )
								 
			END 

		--> Nota Entrega
		IF @codigo ='RNE'
			BEGIN
				IF @id IS NULL
					BEGIN	
						SELECT '0' code, 'Id No Valido' as 'message'
						RETURN
					END 

				
				SET @body = (
								SELECT cu.BusinessName                                                         as cliente
									  ,dbo.AFTGenerarNroDocumento(es.estab+pe.ptoEmi,ne.nroDocumento)          as documento
								      ,dbo.AFTConvertDate(ne.fechaEmision)+dbo.AFTConvertHora(ne.fechaEmision) as fechaEmision
								      ,CAST(ne.total as numeric(18,2))	                                       as importeTotal													   
								      ,ISNULL(es.telefono, '')                                                 as telefono
								      ,en.razonSocial                                                          as razonSocial
								FROM dbo.NotaEntrega           ne WITH (NOLOCK) 
								INNER JOIN DBO.Cliente         cl WITH (NOLOCK) ON cl.idCliente         = ne.idCliente 
								INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision    = ne.idPuntoEmision
								INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
								INNER JOIN dbo.Entidad         en WITH (NOLOCK) ON en.idEntidad         = ne.idEntidad
								INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id                = cl.CustomerId 
								WHERE ne.idNotaEntrega = @id
								FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							)
			END 

		--> Comprobante Ingreso
		IF @codDoc='CI'
			BEGIN
				SET @template = 'EmailCompIngreso.html'

				SET @body = (
                                SELECT cu.BusinessName                                                                 as cliente
					                  ,'CI' + '-' + es.estab + '-' +Helper.F_Auto_Sequential(ci.nroDocumento)          as documento
                                      ,dbo.AFTConvertDate(ci.fechaRegistro)+''''+ dbo.AFTConvertHora(ci.fechaRegistro) as fechaEmision
						              ,ci.total	                                                                       as importeTotal															   
						              ,ISNULL(es.telefono, '')                                                         as telefono
						              ,es.nombreComercial                                                              as razonSocial
					            FROM dbo.ComprobanteIngreso    ci WITH(NOLOCK)
					            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = ci.idEstablecimiento
                                INNER JOIN Customer.Customer   cu WITH (NOLOCK) ON cu.Id                = ci.CustomerId
					            WHERE ci.idComprobanteIngreso = @id
					            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
					         )

			END
                  
        BEGIN TRAN 
			--INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario)
   --         VALUES(@params, @emailData, REPLACE(@receptor,'|',','), 'NE', @idUsuario)
            
            -- Insert into Notification table
            INSERT INTO Common.Notification ([NotificationTypeId], [CompressedParameters], [Title], [Subject], [UserId], [FromMobile])
            VALUES (@notificationTypeId, COMPRESS(CONVERT(VARCHAR(MAX), ISNULL(@params, '{}'))), 'Envio por correo', @subject, @idUsuario, @fromMobile);

            SET @notificationId = SCOPE_IDENTITY();

            -- Insert into EmailQueue table
            INSERT INTO Common.EmailQueue ([NotificationId], [EmailSenderConfigId], [RecipientEmail], Cc, [Subject], [IsHtml],
            [CompressedBody], [PriorityId], [StatusId], [Template], [UserId], [FromMobile])
            VALUES (@notificationId, @emailSenderConfigId, @receptor, @cc, @subject, CAST(0 AS BIT),
            COMPRESS(@body), @priorityId, @statusId, @template, @idUsuario, @fromMobile)
		COMMIT TRAN
        
        SELECT '1' code, 'Reenviado Correctamente' as 'message' 
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
        INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'Notificacion/Insert', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)

        SELECT '0' code,'Info: Error en el procedimiento de Reenvío por Correo' as 'message'
	END CATCH
END
GO
