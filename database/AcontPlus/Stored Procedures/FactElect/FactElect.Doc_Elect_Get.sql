USE AcontPlus

IF OBJECT_ID('FactElect.Doc_Elect_Get') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Elect_Get
GO


-- FactElect.Doc_Elect_Get 28, '{"isCurrentDate":false,"checkBoxDate":true,"isSearchCustomerProvider":false,"dateStart":"2023-04-01T05:00:00.000Z","dateEnd":"2023-05-01T04:59:59.999Z"}'

CREATE PROCEDURE FactElect.Doc_Elect_Get @idRol INT,@json NVARCHAR(max)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT;

	DECLARE @isViewOtherDocs BIT = (SELECT JSON_VALUE(jsonPermission, '$.additional.viewOthersDocs.view') FROM Config.UserPermission WHERE codModule='V' AND idUsuarioRol = @idRol)
	
	DECLARE @idUsuario INT;
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

	DECLARE @checkboxEstablecimiento BIT 
	DECLARE @estab VARCHAR(10)
	DECLARE @checkboxPuntoEmision BIT
	DECLARE @ptoEmi VARCHAR(10)

	DECLARE @isSearchCustomerProvider BIT 
	DECLARE @identificacionReceptor VARCHAR(20)

	DECLARE @isSearchUser BIT
	DECLARE @idUsuarioSearch INT;

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
									 @estab VARCHAR(5),
									 @ptoEmi VARCHAR(5),
	                                 @codDoc VARCHAR(10),
									 @identificacionReceptor VARCHAR(20),
									 @codEstado VARCHAR(5),
									 @dateStart DATETIME,
									 @dateEnd DATETIME,
									 @idUsuario INT,
									 @idUsuarioSearch INT';

	DECLARE @sql NVARCHAR(MAX) = 'SELECT de.idDocumentoElectronico
										,de.idDocumento
										,de.codDoc
										,comprobante = de.comprobante + '' - '' + de.versionComp
										,de.serieComprobante
										,de.rucReceptor 
										,de.razonSocial
										,de.correo
										,fechaEmision =   FORMAT(de.fechaEmision, ''dd/MM/yyyy'') 
										,claveAcceso
										,de.fechaAutorizacion
										,de.estado
										,de.codEstado
										,style = CASE de.codEstado WHEN 4 THEN ''table-success'' 
										                           WHEN 5 THEN ''table-warning''
																   WHEN 6 THEN ''table-danger''
																   WHEN 0 THEN ''table-warning''
												 END
										,de.versionComp
										,de.ambiente
										,usuario = u.nombreUsuario
										,ISNULL(de.codEstab, '') codEstab
									 FROM v_DocElectronico de WITH (NOLOCK)
									 INNER JOIN Usuario u WITH(NOLOCK) ON u.idUsuario = de.idUsuario
									 WHERE de.idEntidad = @idEntidad   ';

	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol ;
	
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

		,@checkboxEstablecimiento = checkboxEstablecimiento
		,@estab = estab
		,@checkboxPuntoEmision = checkboxPuntoEmision
		,@ptoEmi = ptoEmi

		,@isSearchCustomerProvider = isSearchCustomerProvider
		,@identificacionReceptor = identificacionReceptor
		,@isSearchUser = isSearchUser
		,@idUsuarioSearch  = idUsuarioSearch
	FROM OPENJSON(@json)
	WITH(codDoc VARCHAR(10) '$.codDoc'
		 ,checkBoxEstadoServicio BIT '$.checkBoxEstadoServicio'
		 ,checkBoxComprobante BIT '$.checkBoxComprobante'
		 ,codEstado INT '$.codEstado'
		 ,isCurrentDate BIT  '$.isCurrentDate'
		 ,checkBoxDate BIT   '$.checkBoxDate'
		 ,dateStart DATETIME '$.dateStart'
		 ,dateEnd   DATETIME '$.dateEnd'
		 ,tipo VARCHAR(2) '$.tipo'
		 ,textSearch VARCHAR(15) '$.textSearch'
		 ,checkboxEstablecimiento BIT '$.checkBoxEstab'
		 ,estab VARCHAR(10) '$.estab'
		 ,checKboxPuntoEmision BIT '$.checKboxPuntoEmision'
		 ,ptoEmi VARCHAR(10) '$.ptoEmi'

		 ,isSearchCustomerProvider BIT '$.isSearchCustomerProvider'
		 ,identificacionReceptor VARCHAR(20) '$.identificacionReceptor'
		 ,isSearchUser BIT '$.isSearchUser'
		 ,idUsuarioSearch INT '$.idUsuario'
		)

	

	IF @checkboxEstablecimiento = 1
		BEGIN 
			SET @sql = @sql + ' AND de.estab = @estab'
		END 

	IF @checkboxPuntoEmision = 1
		BEGIN 
			SET @sql = @sql + ' AND de.ptoEmi = @ptoEmi'
		END 

	IF @checkBoxDate = 1
		BEGIN 
			SET @sql = @sql + ' AND CAST(de.fechaEmision AS date) BETWEEN CAST(@dateStart AS date) AND CAST(@dateEnd AS date) '
		END 

	--IF @isCurrentDate = 1
	--	BEGIN
	--		SET @sql = @sql + ' AND CAST(de.fechaRegistro AS DATE) = CAST(dbo.ufnGetDateEcuador() AS DATE) '
	--	END

	IF @checkBoxComprobante = 1
		BEGIN
			SET @sql = @sql +' AND de.codDoc = @codDoc '
		END 

	IF @isSearchCustomerProvider = 1
		BEGIN 
			SET @sql = @sql + ' AND de.rucReceptor = @identificacionReceptor'
		END 

	IF (@tipo = '3')
		BEGIN
			SET @sql = @sql +  ' AND codEstado IN (0,5) '
		END
	ELSE 
		BEGIN
			IF @checkBoxEstadoServicio = 1
				BEGIN	
					SET @sql = @sql + ' AND de.codEstado = @codEstado '
				END 
		END

	--Verificamos si tiene permiso a ver otros documentos
	IF @isViewOtherDocs = 0
		BEGIN
			SET @sql = @sql + ' AND de.idUsuario = @idUsuario'
		END 
	 ELSE
		BEGIN 
			IF @isSearchUser = 1
				BEGIN 
					SET @sql = @sql + ' AND de.idUsuario = @idUsuarioSearch'
				END 
		END 

	SET @sql = @sql + ' ORDER BY de.idDocumentoElectronico DESC';
	
	print @sql 
	EXEC sp_executesql @sql,@params
				           ,@idEntidad = @idEntidad
						   ,@estab = @estab
						   ,@ptoEmi = @ptoEmi
						   ,@codDoc = @codDoc 
						   ,@identificacionReceptor = @identificacionReceptor
						   ,@codEstado = @codEstado
						   ,@dateStart = @dateStart
						   ,@dateEnd = @dateEnd
						   ,@idUsuario =  @idUsuario
						   ,@idUsuarioSearch = @idUsuarioSearch
END 
