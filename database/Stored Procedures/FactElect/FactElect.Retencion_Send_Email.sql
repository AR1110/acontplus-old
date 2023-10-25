USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Retencion_Send_Email]    Script Date: 23/12/2022 11:42:17 ******/

IF OBJECT_ID('FactElect.Retencion_Send_Email') IS NOT NULL
	DROP PROCEDURE FactElect.Retencion_Send_Email
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2022-03-25
-- Description:	SP para obtener los datos de envia de correos.
--EXEC [Compra].[RetencionCompra_Send_Email] [{"idRetencionCompra": "50"}]
-- =============================================
CREATE PROCEDURE FactElect.Retencion_Send_Email
	@json nvarchar(max)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	
	
	DECLARE @email nvarchar(100) 
		   ,@password nvarchar(100)
		   ,@to nvarchar(100)
		   ,@razonSocial nvarchar(350)
		   ,@cliente nvarchar(300)
		   ,@subject nvarchar(200)
		   ,@message nvarchar(800)
		   ,@nroDoc nvarchar(100)
		   ,@urlSri nvarchar(200)
		   ,@fecha nvarchar(200)
		   ,@nameDoc nvarchar(200)
		   ,@idRetencionCompra bigint 
		   ,@cc nvarchar(200)

	SELECT idRetencionCompra
	into #tbl
	FROM OPENJSON(@json)
	WITH (idRetencionCompra BIGINT '$.id'   
	) AS jsonValues 

	SELECT @idRetencionCompra = idRetencionCompra FROM dbo.#tbl
	
	--IF NOT EXISTS (SELECT 1 FROM RetencionCompra WHERE idRetencionCompra = @idRetencionCompra AND autorizada = 1)
	--	BEGIN 
	--		SELECT '0','Retencion No autorizada' 
	--		RETURN 
	--	END 


	SELECT 
		  @email =  'acontplusweb@gmail.com' --correo servidor 
		 ,@password =  'guzupdzsynqgamav'  -- passwrod 
		 ,@to =  REPLACE(pr.correo,';',',') -- correo al que se le enviara los documentos
		 ,@cliente = pr.nombreFiscal
		 ,@cc = e.email
		 ,@razonSocial = e.razonSocial
		 ,@nroDoc = dbo.AFTGenerarNroDocumento(s.serie+pe.serie,rc.nroDocumento)
		 ,@urlSri = ta.urlAutorizacion
		 ,@fecha  = dbo.AFTConvertDate(rc.fechaEmision)
		 ,@nameDoc = 'Retencion'+'-'+dbo.AFTGenerarNroDocumento(s.serie+pe.serie,rc.nroDocumento) 
	FROM dbo.RetencionCompra rc
	INNER JOIN Entidad e ON e.idEntidad = rc.idEntidad
	INNER JOIN Proveedor pr ON pr.idProveedor = rc.idProveedor
	INNER JOIN PuntoEmision pe ON pe.idPuntoEmision = rc.idPuntoEmision
	INNER JOIN TipoAmbiente ta ON ta.idTipoAmbiente = rc.idTipoAmbiente 
	INNER JOIN Sucursal  s ON s.idSucursal = pe.idSucursal
	WHERE rc.idRetencionCompra = @idRetencionCompra

	SET @subject = 'Retencion N°'+ @nroDoc;
	SET @message = 'Estimado (a) ' + @cliente+',<br><br>Le comunicamos el envio de su comprobante electronico Autorizado por el Sri correspondiente a la fecha '+ @fecha+ 
	               '<br><br> Documento Adjunto: '+ @nroDoc + '<br><br><br> Agradecemos su atencion y esperamos que la informacion proporcionado sea de utilidad para usted <br><br>
				    Atentamente,<br>' + @razonSocial+'<br><br><b>Nota: </b><i>No necesita responder a esta direccion de correo.</i>' 

	SELECT '1',''
		   ,ISNULL(@email,'') as 'from'
		   ,ISNULL(@password,'') as 'password'
		   ,ISNULL(@to,'') as 'to'
		   ,ISNULL(@subject,'') as 'subject'
		   ,ISNULL(@message,'') as 'message'
		   ,ISNULL(@cc,'') as 'cc'
		   ,ISNULL(@urlSri,'') as 'urlSri' 
		   ,ISNULL(@nameDoc,'') as 'invoiceName'
END
