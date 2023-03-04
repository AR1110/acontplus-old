USE AcontPlus

IF OBJECT_ID('FactElect.Doc_Elect_Get') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Elect_Get
GO
CREATE PROCEDURE FactElect.Doc_Elect_Get @idRol INT,@json NVARCHAR(max)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT;
	DECLARE @isCurrentDate BIT;

	DECLARE @codDoc VARCHAR(10);
	DECLARE @checkBoxEstadoServicio BIT;
	DECLARE @checkBoxComprobante BIT
	DECLARE @codEstado INT;
	DECLARE @checkBoxDate BIT;
	DECLARE @dateStart DATETIME;
	DECLARE @dateEnd DATETIME;
	DECLARE @tipo VARCHAR(2)
	DECLARE @textSearch VARCHAR(15)

	DECLARE @tblMain AS TABLE(
		idDocumentoElectronico BIGINT NOT NULL
		,idDocumento BIGINT NOT NULL
		,codDoc VARCHAR(2) NOT NULL
		,comprobante VARCHAR(100) NOT NULL
		,numeroDocumento VARCHAR(50) NOT NULL
		,ruc VARCHAR(20) NOT NULL
		,razonSocial VARCHAR(200) NOT NULL
		,correo VARCHAR(200) NOT NULL
		,fechaEmision DATETIME NOT NULL
		,claveAcceso VARCHAR(200) NOT NULL
		,fechaAutorizacion DATETIME NOT NULL
		,estado VARCHAR(50) NOT NULL
		,codEstado INT NOT NULL
		,style VARCHAR(200) NOT NULL
	)

	
	DECLARE @params NVARCHAR(MAX) = '@idEntidad INT,
	                                 @codDoc VARCHAR(10),
									 @codEstado VARCHAR(5),
									 @dateStart DATETIME,
									 @dateEnd DATETIME';

	DECLARE @sql NVARCHAR(MAX) = 'SELECT 
										 de.idDocumentoElectronico
										,de.idDocumento
										,de.codDoc
										,comprobante = td.descripcion + '' - versión: '' +  de.versionComp
										,serie = de.numEstab+''-''+de.ptoEmision+''-''+dbo.AFTAutoComplete(de.nroDocumento)
										,rucReceptor = CASE de.codDoc WHEN ''01'' THEN cl.numeroIdentificacion
																	  WHEN ''03'' THEN pr.numeroIdentificacion		
																	  WHEN ''04'' THEN cl.numeroIdentificacion
																	  WHEN ''06'' THEN cl.numeroIdentificacion
																	  WHEN ''07'' THEN pr.numeroIdentificacion
													   END
										,razonSocial = CASE de.codDoc WHEN ''01'' THEN cl.nombreFiscal 
																	  WHEN ''03'' THEN pr.nombreFiscal		
																	  WHEN ''04'' THEN cl.nombreFiscal
																	  WHEN ''06'' THEN cl.nombreFiscal
																	  WHEN ''07'' THEN pr.nombreFiscal
													   END
										,correo = CASE de.codDoc WHEN ''01'' THEN cl.correo
															     WHEN ''03'' THEN pr.correo	
															     WHEN ''04'' THEN cl.correo
																 WHEN ''06'' THEN cl.correo
																 WHEN ''07'' THEN pr.correo
													   END
										,de.fechaEmision
										,claveAcceso
										,fechaAutorizacion
										,estado = es.descripcion
										,de.codEstado
										,style = CASE de.codEstado WHEN 4 THEN ''table-success'' 
										                           WHEN 5 THEN ''table-warning''
																   WHEN 6 THEN ''table-danger''
																   WHEN 0 THEN ''table-warning''
												 END  
										,de.versionComp
									 FROM DocumentoElectronico de WITH (NOLOCK)
									 INNER JOIN FactElect.EstadoServicio es WITH (NOLOCK) ON de.codEstado = es.codigo
									 INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON td.codigoSri = de.codDoc
									 LEFT JOIN dbo.Cliente cl ON cl.idCliente = de.idContribuyente  
									 LEFT JOIN dbo.Proveedor pr ON pr.idProveedor = de.idContribuyente  
									 WHERE de.idEntidad = @idEntidad   ';

	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idRol ;
	
	--Filtros 
	SELECT 
		@codDoc        = codDoc,
		@isCurrentDate = isCurrentDate,
		@checkBoxEstadoServicio = checkBoxEstadoServicio,
		@checkBoxComprobante = checkBoxComprobante,
		@codEstado     = codEstado,
		@checkBoxDate  = checkBoxDate,
		@dateStart     = dateStart,
		@dateEnd       = dateEnd
		,@tipo = tipo
		,@textSearch = textSearch
	FROM OPENJSON(@json)
	WITH(codDoc VARCHAR(10) '$.codDoc',
		 checkBoxEstadoServicio BIT '$.checkBoxEstadoServicio',
		 checkBoxComprobante BIT '$.checkBoxComprobante',
		 codEstado INT '$.codEstado',
		 isCurrentDate BIT  '$.isCurrentDate',
		 checkBoxDate BIT   '$.checkBoxDate',
		 dateStart DATETIME '$.dateStart',
		 dateEnd   DATETIME '$.dateEnd'
		 ,tipo VARCHAR(2) '$.tipo'
		 ,textSearch VARCHAR(15) '$.textSearch'
		)
	IF @checkBoxDate = 1
		BEGIN 
			SET @sql = @sql + 'AND CAST(de.fechaEmision AS date) BETWEEN CAST(@dateStart AS date) AND CAST(@dateEnd AS date) '
		END 

	IF @isCurrentDate = 1
		BEGIN
			SET @sql = @sql + 'AND CAST(de.fechaRegistro AS DATE) = CAST(dbo.ufnGetDateEcuador() AS DATE) '
		END

	IF @checkBoxComprobante = 1
		BEGIN
			SET @sql = @sql +'AND de.codDoc = @codDoc '
		END 

	IF @checkBoxEstadoServicio = 1
		BEGIN	
			SET @sql = @sql + 'AND de.codEstado = @codEstado '
		END 

	SET @sql = @sql + 'ORDER BY de.idDocumentoElectronico DESC';


	EXEC sp_executesql @sql,@params
				           ,@idEntidad = @idEntidad
						   ,@codDoc = @codDoc 
						   ,@codEstado = @codEstado
						   ,@dateStart = @dateStart
						   ,@dateEnd = @dateEnd




END 
