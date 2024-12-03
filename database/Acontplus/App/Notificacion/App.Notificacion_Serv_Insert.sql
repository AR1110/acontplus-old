USE [AcontPlus]
GO
--UPDATE App.Notificacion SET estado ='NE' WHERE idNotificacion = 2
--select * from aPP.Notificacion
--DELETE FROM App.Notificacion WHERE idNotificacion = 3
-- exec App.Notificacion_Serv_Insert '{"subject":"Documento Nota Entrega - Acontplus N°: 002-003-000000042","params":{"hasFile":true,"isReport":"SI","reportParams":{"hasParams":true,"codEstab":"ESTAB-000000002","codigo":"RNE","format":"pdf"},"spParams":{"id":69577}},"idUsuarioRol":25,"receptor":"sengua2017@gmail.com;emilio.senguana@itsae.edu.ec"}'

CREATE OR ALTER PROCEDURE App.Notificacion_Serv_Insert @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT ,@idEntidad INT
	
    --> Data Json
    DECLARE @codDoc VARCHAR(5) ,@params NVARCHAR(MAX) ,@emailData VARCHAR(MAX) ,@receptor VARCHAR(200) ,@codigo VARCHAR(5) ,@id INT 

	--> Email 
	DECLARE @body VARCHAR(MAX)
	       ,@template VARCHAR(50) = 'EmailTemplate.html'
	       ,@subject VARCHAR(100)
           ,@cc VARCHAR(100)

	BEGIN TRY

		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
		
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
            receptor			VARCHAR(100)	'$.receptor',
            params				NVARCHAR(MAX)	'$.params' AS JSON,
            subjectJson			VARCHAR(500)	'$.subject' 

		) AS js

		SELECT top 1 @cc = email from Entidad where idEntidad = @idEntidad

        --> Tipo para reportes 
		IF EXISTS (SELECT 1 FROM Config.Reporte WITH (NOLOCK) WHERE codigo = @codigo)
			BEGIN 
                
                SELECT TOP 1 @receptor = email FROM dbo.Entidad WHERE idEntidad = @idEntidad

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

		SET @emailData = (
                            SELECT TOP 1 
                                    [enableSsl]         as EnableSsl
                                   ,[from]              as 'from'
                                   ,[from]              as 'username'
                                   ,[host]              as 'host'
                                   ,[password]          as 'password'
                                   ,[port]              as 'port'
                                   ,@body               as body
			                       ,ISNULL(@cc,'')      as 'cc'
								   ,'logoAcontPlus.jpg' as 'logo'
								   ,@subject            as 'subject'
								   ,@template           as 'template' 
                            FROM [Config].[Email_Config] WITH (NOLOCK)
                            FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
						 )
                  
        BEGIN TRAN 
			INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario)
            VALUES(@params, @emailData, REPLACE(@receptor,'|',','), 'NE', @idUsuario)
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