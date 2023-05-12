

USE [AcontPlus]

IF OBJECT_ID('App.Notificacion_Serv_Insert') IS NOT NULL
	DROP PROCEDURE App.Notificacion_Serv_Insert
GO 
--UPDATE App.Notificacion SET estado ='NE' WHERE idNotificacion = 2
--select * from aPP.Notificacion
--DELETE FROM App.Notificacion WHERE idNotificacion = 3
-- exec App.Notificacion_Serv_Insert '{"params":{"hasFile":true,"isReport":"SI","reportParams":{"codEstab":"ESTAB-000000002","codigo":"PR","format":"pdf"},"spParams":{"id":67}},"idUsuarioRol":38,"receptor":"sengua2017@gmail.com"}'

CREATE PROCEDURE App.Notificacion_Serv_Insert @json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT
	DECLARE @idEntidad INT 
	
	DECLARE @params NVARCHAR(MAX)
	DECLARE @emailData VARCHAR(MAX)

	DECLARE @receptor VARCHAR(200)
	DECLARE @codigo VARCHAR(5)

	DECLARE @id INT 

	--Email 
	DECLARE @body VARCHAR(MAX);
	DECLARE @cliente VARCHAR(100)
	DECLARE @documento VARCHAR(30)
	DECLARE @template VARCHAR(50)
	DECLARE @subject VARCHAR(100)
	

	SELECT 
		@idEntidad = ur.idEntidad,
	    @idUsuario = ur.idUsuario,
		@id        = js.id,
		@codigo    = js.codigo,
		@receptor  = js.receptor,
		@params    = js.params,
		@subject   = subject
	FROM App.UsuarioRol ur JOIN OPENJSON(@json)		
	WITH(
		idUsuarioRol        INT '$.idUsuarioRol',
		codigo       VARCHAR(5) '$.params.reportParams.codigo',
		id                 INT  '$.params.spParams.id',
		receptor   VARCHAR(100) '$.receptor',
		params    NVARCHAR(MAX) '$.params' AS JSON,
		subject   VARCHAR(100)
	) as js ON js.idUsuarioRol = ur.idUsuarioRol

	SET @template = 'EmailTemplate.html'
	
	--SELECT @idUsuario, @id, @codigo, @receptor

	--RETURN 

	BEGIN TRY
		BEGIN TRAN 

		--Proforma 
		IF @codigo = 'PR'
			BEGIN 
				IF @id IS NULL
					BEGIN	
						SELECT '0'code, 'Id No Valido' as 'message', 'Reenvío por Correo' as titleSms	
						RETURN
					END 

				
				SET @body = (
								SELECT cliente      = cl.nombreComercial, 
										documento    = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,pr.nroDocumento),
										fechaEmision = dbo.AFTConvertDate(pr.fechaEmision)+dbo.AFTConvertHora(pr.fechaEmision),
										importeTotal = Herramientas.Round_Out(pr.total, cd.nroTotalSubTotal),																   
										telefono     = ISNULL(e.telefono, ''),
										razonSocial  = e.razonSocial
										
								FROM dbo.Proforma pr 
								INNER JOIN Cliente               cl ON cl.idCliente      = pr.idCliente 
								INNER JOIN dbo.PuntoEmision      pe ON pe.idPuntoEmision = pr.idPuntoEmision
								INNER JOIN Sri.Establecimiento    s ON s.codEstab        = pe.codEstab
								INNER JOIN dbo.Entidad            e ON e.idEntidad       = pr.idEntidad
								LEFT JOIN Config.CantidadDecimal cd ON cd.idEntidad      = pr.idEntidad AND codTransaccion = 'V'
								WHERE pr.idProforma = @id
								FOR JSON PATH
							 )
								 
			END 

			--Nota Entrega --
			IF @codigo ='RNE'
				BEGIN
					IF @id IS NULL
					BEGIN	
						SELECT '0'code, 'Id No Valido' as 'message', 'Reenvío por Correo' as titleSms	
						RETURN
					END 

				
					SET @body = (
									SELECT cliente      = cl.nombreComercial, 
											documento    = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,ne.nroDocumento),
											fechaEmision = dbo.AFTConvertDate(ne.fechaEmision)+dbo.AFTConvertHora(ne.fechaEmision),
											importeTotal = Herramientas.Round_Out(ne.total, cd.nroTotalSubTotal),																   
											telefono     = ISNULL(e.telefono, ''),
											razonSocial  = e.razonSocial
										
									FROM dbo.NotaEntrega ne 
									INNER JOIN Cliente               cl ON cl.idCliente      = ne.idCliente 
									INNER JOIN dbo.PuntoEmision      pe ON pe.idPuntoEmision = ne.idPuntoEmision
									INNER JOIN Sri.Establecimiento    s ON s.codEstab        = pe.codEstab
									INNER JOIN dbo.Entidad            e ON e.idEntidad       = ne.idEntidad
									LEFT JOIN Config.CantidadDecimal cd ON cd.idEntidad      = ne.idEntidad AND codTransaccion = 'V'
									WHERE ne.idNotaEntrega = @id
									FOR JSON PATH
								 )
				END 

			-- Reporte Control Caja
			IF @codigo ='RCC'
				BEGIN 
					SET @body = (
									SELECT 
										fechaEmision = dbo.AFTConvertDate(dbo.ufnGetDateEcuador())+dbo.AFTConvertHora(dbo.ufnGetDateEcuador()),
									    telefono     = ISNULL(e.telefono, ''),
										razonSocial  = e.razonSocial
									FROM dbo.Entidad e WHERE idEntidad = @idEntidad
									FOR JSON PATH
								)
				END 

			
			
			SET @emailData = (SELECT body = @body, 
			                         cc = '',									    
							         EnableSsl = '1', 
									 'from' = 'envio.comprobantes@acontplus.com.ec',
									 'host'= 'smtp.gmail.com', 
									 'logo'= 'logoAcontPlus.jpg', 
									 'password'= 'rovsnbdgalpwbnfx', 
									 'port'= '587', 
									 'subject'= @subject, 
									 'template'= @template FOR JSON PATH
							   )

							
         
		--return
		INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario) VALUES('[' + @params + ']', @emailData, REPLACE(@receptor,';',','), 'NE', @idUsuario)
		SELECT '1'code, 'Reenviado el Correo Correctamente' as 'message', 'Reenvío por Correo' as titleSms		
		COMMIT TRAN 
	END TRY

	BEGIN CATCH 
		SELECT '0'code,'Info: Error en el procedimiento de Reenvío por Correo ' + ERROR_MESSAGE() as 'message', 'Reenvío por Correo' as titleSms
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
	END CATCH 

	   




END 