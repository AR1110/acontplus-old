USE [AcontPlus]

IF OBJECT_ID('App.Notificacion_Serv_Insert') IS NOT NULL
	DROP PROCEDURE App.Notificacion_Serv_Insert
GO 
--UPDATE App.Notificacion SET estado ='NE' WHERE idNotificacion = 2
--select * from aPP.Notificacion
--DELETE FROM App.Notificacion WHERE idNotificacion = 3
-- exec App.Notificacion_Serv_Insert '{"subject":"Documento Nota Entrega - Acontplus N°: 002-003-000000042","params":{"hasFile":true,"isReport":"SI","reportParams":{"hasParams":true,"codEstab":"ESTAB-000000002","codigo":"RNE","format":"pdf"},"spParams":{"id":69577}},"idUsuarioRol":25,"receptor":"sengua2017@gmail.com;emilio.senguana@itsae.edu.ec"}'

CREATE PROCEDURE App.Notificacion_Serv_Insert @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idUsuarioRol INT
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT 
	DECLARE @codDoc VARCHAR(5)
	DECLARE @serieComprobante VARCHAR(50)

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
	DECLARE @tlDecimal  AS TABLE (
		  idEntidad INT
		 ,nroPrecio INT 
	     ,nroCantidad  INT 
		 ,nroIva INT 
		 ,nroDescuentoDetalle INT 
		 ,nroTotalDetalle INT 
		 ,nroTotalSubTotal INT 
		 ,nroDescuento INT 
		 ,nroIce INT
	)

    DECLARE  @enableSsl INT 
    DECLARE @from  VARCHAR(100)
    DECLARE @host  VARCHAR(100) 
    DECLARE @password VARCHAR(50)
    DECLARE @port INT 
    DECLARE @cc VARCHAR(100)

    SELECT TOP 1
           @enableSsl = [enableSsl]
          ,@from      = [from]
          ,@host      = [host]
          ,@password  = [password]
          ,@port      = [port]
  FROM [Config].[Email_Config] WITH (NOLOCK)


	BEGIN TRY
		
		SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId
		
		SELECT 
			@codDoc				= js.codDoc,
			@serieComprobante	= js.serieComprobante,			
			@id					= js.id,
			@codigo				= js.codigo,
			@receptor			= js.receptor,
			@params				= js.params,
			@subject			= js.subjectJson
		FROM OPENJSON(@json)		
		WITH(			
			codDoc				VARCHAR(6)		'$.codDoc',
			serieComprobante	VARCHAR(50)		'$.serieComprobante',
			codigo				VARCHAR(5)		'$.params.reportParams.codigo',
			id					INT				'$.params.spParams.id',
			receptor			VARCHAR(100)	'$.receptor',
			params				NVARCHAR(MAX)	'$.params' AS JSON,
			subjectJson			VARCHAR(500)	'$.subject' 
		) AS js

		SELECT top 1 @cc = email from Entidad where idEntidad = @idEntidad
		SELECT TOP 1 @jsonConfig = jsonConfig FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig='CD'
		
		INSERT INTO @tlDecimal(idEntidad,nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce)
					   SELECT @idEntidad,nroPrecio,nroCantidad,nroIva,nroDescuentoDetalle,nroTotalDetalle,nroTotalSubTotal,nroDescuento,nroIce              
					   FROM OPENJSON(@jsonConfig)
					   WITH 
					     (codTransaccion VARCHAR(5) '$.codTransaccion'
						 ,nroPrecio             INT '$.nroPrecio'
						 ,nroCantidad           INT '$.nroCantidad'
						 ,nroIva                INT '$.nroIva'
						 ,nroDescuentoDetalle   INT '$.nroDescuentoDetalle'
						 ,nroTotalDetalle       INT '$.nroTotalDetalle'
						 ,nroTotalSubTotal      INT '$.nroTotalSubTotal'
						 ,nroDescuento          INT '$.nroDescuento'
						 ,nroIce                INT '$.nroIce') as dt
						WHERE dt.codTransaccion = 'C'

		SELECT  @template = 'EmailTemplate.html'
		
		BEGIN TRAN 

			--Proforma 
			IF @codigo = 'PR'
			BEGIN 
				IF @id IS NULL
					BEGIN	
						SELECT Common.ufnSpResponse('0', 'Id No Valido', DEFAULT)
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
								INNER JOIN @tlDecimal            cd ON cd.idEntidad      = pr.idEntidad
								WHERE pr.idProforma = @id
								FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							 )
								 
			END 

			--Nota Entrega --
			IF @codigo ='RNE'
				BEGIN
					IF @id IS NULL
					BEGIN	
						SELECT Common.ufnSpResponse('0', 'Id No Valido', DEFAULT)
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
									INNER JOIN @tlDecimal            cd ON cd.idEntidad      = ne.idEntidad
									WHERE ne.idNotaEntrega = @id
									FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
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
									FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
								)
				END 
			

			--Envio por correo de comprobante Ingreso
			IF @codDoc='CI'
				BEGIN
					SET @template = 'EmailCompIngreso.html'
					SET @body = (SELECT cliente     = ci.nombreFiscal, 
						   documento    = @serieComprobante,
					       fechaEmision = dbo.AFTConvertDate(ci.fechaRegistro)+''''+ dbo.AFTConvertHora(ci.fechaRegistro),
						   importeTotal = ci.total,																   
						   telefono     = ISNULL(estab.telefono, ''),
						   razonSocial  = estab.nombreComercial
					 FROM dbo.ComprobanteIngreso ci WITH(NOLOCK)
					 INNER JOIN Sri.Establecimiento estab WITH (NOLOCK) ON estab.codEstab = ci.codEstab
					 WHERE ci.idComprobanteIngreso = @id
					 FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
					 )

				END


			SET @emailData = (SELECT body = @body
			                        ,ISNULL(@cc,'') as 'cc' 						  
							         ,EnableSsl =@enableSsl
									 ,'from' = @from
                                     ,'username' = @from
									 ,'host'= @host
									 ,'logo'= 'logoAcontPlus.jpg'
									 ,'password'= @password
									 ,'port'= @port
									 ,'subject'= @subject 
									 ,'template'= @template FOR JSON PATH, WITHOUT_ARRAY_WRAPPER
							   )
         
			--return
			INSERT INTO App.Notificacion(params, emailData, receptor, estado, idUsuario)
            VALUES(@params, @emailData, REPLACE(@receptor,';',','), 'NE', @idUsuario)
			SELECT Common.ufnSpResponse('1', 'Reenviado el Correo Correctamente', DEFAULT)
		
		COMMIT TRAN 
	END TRY

	BEGIN CATCH 
		SELECT Common.ufnSpResponse('0','Info: Error en el procedimiento de Reenvío por Correo ' + ERROR_MESSAGE(), DEFAULT)
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
	END CATCH
END 