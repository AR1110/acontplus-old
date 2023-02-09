USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Factura_SendEmail]    Script Date: 23/12/2022 11:08:06 ******/
IF OBJECT_ID('FactElect.Factura_SendEmail') IS NOT NULL
	DROP PROCEDURE FactElect.Factura_SendEmail
GO
CREATE PROCEDURE FactElect.Factura_SendEmail
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
		   ,@idFactura bigint 
		   ,@cc nvarchar(200)
		   ,@telefono nvarchar(100)
		   ,@importeTotal VARCHAR(100)

	SELECT idFactura
	into #tbl
	FROM OPENJSON(@json)
	WITH (idFactura BIGINT '$.id'   
	) AS jsonValues 

	SELECT @idFactura = idFactura FROM dbo.#tbl
	
	--IF NOT EXISTS (SELECT 1 FROM Factura WHERE idFactura = @idFactura AND autorizada = 1)
	--	BEGIN 
	--		SELECT '0','Factura No autorizada' 
	--		RETURN 
	--	END 


	SELECT 
		  @email =  'acontplusweb@gmail.com' --correo servidor 
		 ,@password =  'guzupdzsynqgamav'  -- passwrod 
		 ,@to = REPLACE(cl.correo,';',',') -- correo al que se le enviara los documentos
		 ,@cliente = cl.nombreFiscal
		 ,@cc = e.email
		 ,@razonSocial = e.razonSocial
		 ,@nroDoc = dbo.AFTGenerarNroDocumento(s.serie+pe.serie,f.nroFactura)
		 ,@urlSri = ta.urlAutorizacion
		 ,@fecha  = dbo.AFTConvertDate(f.fechaEmision)
		 ,@nameDoc = td.descripcion+'-'+dbo.AFTGenerarNroDocumento(s.serie+pe.serie,f.nroFactura) 
		 ,@telefono = e.telefono
		 ,@importeTotal = CAST(f.total AS DECIMAL(15,2))
	FROM Factura f
	INNER JOIN Entidad e ON e.idEntidad = f.idEntidad
	INNER JOIN Cliente cl ON cl.idCliente = f.idCliente
	INNER JOIN PuntoEmision pe ON pe.idPuntoEmision = f.idPuntoEmision
	INNER JOIN TipoAmbiente ta ON ta.idTipoAmbiente = pe.idTipoAmbiente 
	INNER JOIN Sucursal  s ON s.idSucursal = pe.idSucursal
	INNER JOIN TipoDocumento td ON td.idTipoDocumento = f.idTipoDocumento
	WHERE f.idFactura = @idFactura

	SET @subject = 'Comprobante Electrónico - Acontplus N°: '+ @nroDoc;
					
	SELECT '1',''
		   ,ISNULL(@email,'') as 'from'
		   ,ISNULL(@password,'') as 'password'
		   ,ISNULL(@subject,'') as 'subject'
		   ,ISNULL(@cc,'') as 'cc'  
		   ,ISNULL(@nameDoc,'') as 'invoiceName'
		   ,'logoAcontPlus.jpg' logo --deberia el ruc
		   ,'smtp.gmail.com' host
		   ,587 as 'port'
		   ,1 EnableSsl
		   ,dataMail = (SELECT 'NOMBRE DOCUMENTO: ' + @nroDoc documento, @fecha fechaEmision,  @cliente cliente, @importeTotal importeTotal,
						@razonSocial razonSocial,
						@telefono telefono
		   FOR JSON path ) 
END
