USE AcontPlus
GO

CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_GetByStatus @idRol INT,@json NVARCHAR(max)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT

	DECLARE @isViewOtherDocs BIT = (SELECT JSON_VALUE(jsonPermission, '$.additional.viewOthersDocs.view') FROM Config.UserPermission WHERE codModule='V' AND idUsuarioRol = @idRol)
	
	DECLARE @idUsuario INT
	DECLARE @isCurrentDate BIT

	DECLARE @codDoc VARCHAR(10)
	DECLARE @checkBoxEstadoServicio BIT
	DECLARE @checkBoxComprobante BIT
	DECLARE @codEstado INT
	DECLARE @checkBoxDate BIT
	DECLARE @dateStart DATETIME
	DECLARE @dateEnd DATETIME
	DECLARE @tipo VARCHAR(2)
	DECLARE @textSearch VARCHAR(15)

	DECLARE @checkboxEstablecimiento BIT 
	DECLARE @codEstab VARCHAR(50)
	DECLARE @checkboxPuntoEmision BIT
	DECLARE @idPuntoEmision VARCHAR(10)

	DECLARE @isSearchCustomerProvider BIT 
	DECLARE @identificacionReceptor VARCHAR(20)

	DECLARE @isSearchUser BIT
	DECLARE @idUsuarioSearch INT
	
	DECLARE @pageSize INT
	DECLARE @pageIndex INT 
	DECLARE @totalRecords INT 

	DECLARE @tblMain AS TABLE(
		 idDocumentoElectronico BIGINT NOT NULL
		,idDocumento BIGINT NOT NULL
		,codDoc VARCHAR(2) NOT NULL
		,comprobante VARCHAR(100) NOT NULL
		,serieComprobante VARCHAR(50) NOT NULL
		,rucReceptor VARCHAR(20)  NULL
		,razonSocial VARCHAR(200)  NULL
		,correo VARCHAR(200) NULL
		,fechaEmision VARCHAR(150) NOT NULL
		,claveAcceso VARCHAR(200) NOT NULL
		,fechaAutorizacion DATETIME  NULL
		,estado VARCHAR(50) NOT NULL
		,codEstado INT NOT NULL
		,style VARCHAR(200) NULL
		,versionComp VARCHAR(50) NOT NULL
		,ambiente VARCHAR(50) NOT NULL
		,usuario VARCHAR(100) NOT NULL
		,codEstab VARCHAR(50) NOT NULL
		,telefono VARCHAR(150) NULL
		,telefonoEstablecimiento VARCHAR(150) NULL
		,entidad VARCHAR(150) NOT NULL
		,nombreComercial VARCHAR(150) NOT NULL
	)

	
	DECLARE @params NVARCHAR(MAX) = '@idEntidad INT
									,@codEstab VARCHAR(50)
									,@idPuntoEmision VARCHAR(5)
	                                ,@codDoc VARCHAR(10)
									,@identificacionReceptor VARCHAR(20)
									,@codEstado VARCHAR(5)
									,@dateStart DATETIME
									,@dateEnd DATETIME
									,@idUsuario INT
									,@idUsuarioSearch INT'

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
										,ISNULL(de.codEstab, '''') codEstab
										,ISNULL(telefono, '''') telefono
										,de.telefonoEstablecimiento
										,de.entidad
										,de.nombreComercial
									 FROM FactElect.v_DocElectronico de WITH (NOLOCK)
									 INNER JOIN Usuario     u WITH (NOLOCK) ON u.idUsuario = de.idUsuario
									 WHERE de.idEntidad = @idEntidad   '

	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol
	
	--Filtros 
	SELECT @codDoc                   = codDoc
	      ,@isCurrentDate            = isCurrentDate
	      ,@checkBoxEstadoServicio   = checkBoxEstadoServicio
	      ,@checkBoxComprobante      = checkBoxComprobante
	      ,@codEstado                = codEstado
	      ,@checkBoxDate             = checkBoxDate
	      ,@dateStart                = dateStart
	      ,@dateEnd                  = dateEnd
	      ,@tipo                     = tipo
	      ,@textSearch               = textSearch
	      ,@checkboxEstablecimiento  = checkboxEstablecimiento
	      ,@codEstab                    = codEstab
	      ,@checkboxPuntoEmision     = checkboxPuntoEmision
	      ,@idPuntoEmision           = idPuntoEmision
	      ,@isSearchCustomerProvider = isSearchCustomerProvider
	      ,@identificacionReceptor   = identificacionReceptor
	      ,@isSearchUser             = isSearchUser
	      ,@idUsuarioSearch          = idUsuarioSearch
		  ,@pageSize                 = pageSize
		  ,@pageIndex                = pageIndex
	FROM OPENJSON(@json)
	WITH (codDoc                 VARCHAR(10) '$.codDoc'
		 ,checkBoxEstadoServicio         BIT '$.checkBoxEstadoServicio'
		 ,checkBoxComprobante            BIT '$.checkBoxComprobante'
		 ,codEstado                      INT '$.codEstado'
		 ,isCurrentDate                  BIT '$.isCurrentDate'
		 ,checkBoxDate                   BIT '$.checkBoxDate'
		 ,dateStart                 DATETIME '$.dateStart'
		 ,dateEnd                   DATETIME '$.dateEnd'
		 ,tipo                    VARCHAR(2) '$.tipo'
		 ,textSearch             VARCHAR(15) '$.textSearch'
		 ,checkboxEstablecimiento        BIT '$.checkBoxEstab'
		 ,codEstab                  VARCHAR(100) '$.codEstab'
		 ,checKboxPuntoEmision           BIT '$.checKboxPuntoEmision'
		 ,idPuntoEmision                 VARCHAR(10) '$.idPuntoEmision'
		 ,isSearchCustomerProvider       BIT '$.isSearchCustomerProvider'
		 ,identificacionReceptor VARCHAR(20) '$.identificacionReceptor'
		 ,isSearchUser                   BIT '$.isSearchUser'
		 ,idUsuarioSearch                INT '$.idUsuario'
		 ,pageIndex                      INT '$.pageIndex'
		 ,pageSize                       INT '$.pageSize'
		)

	

	IF @codEstab IS NOT NULL
		BEGIN 
			SET @sql = @sql +  ' AND de.codEstab = @codEstab '
		END 

	IF @idPuntoEmision > 0
		BEGIN 
			SET @sql = @sql + ' AND de.idPuntoEmision = @idPuntoEmision'
		END 

	IF @checkBoxDate = 1 AND @tipo !='3'
		BEGIN 
			SET @sql = @sql + ' AND CAST(de.fechaEmision AS date) BETWEEN CAST(@dateStart AS date) AND CAST(@dateEnd AS date) '
		END 


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
			SET @sql = @sql +  ' AND codEstado NOT IN (4,6) '
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

	
	INSERT INTO @tblMain 
		(    idDocumentoElectronico
		    ,idDocumento
		    ,codDoc
		    ,comprobante
		    ,serieComprobante
		    ,rucReceptor
		    ,razonSocial
		    ,correo
		    ,fechaEmision
		    ,claveAcceso
		    ,fechaAutorizacion
		    ,estado
		    ,codEstado
		    ,style
		    ,versionComp
		    ,ambiente 
		    ,usuario
		    ,codEstab
		    ,telefono
		    ,telefonoEstablecimiento
		    ,entidad
		    ,nombreComercial
		)

	EXEC sp_executesql @sql,@params
				           ,@idEntidad              = @idEntidad
						   ,@codEstab               = @codEstab
						   ,@idPuntoEmision         = @idPuntoEmision
						   ,@codDoc                 = @codDoc 
						   ,@identificacionReceptor = @identificacionReceptor
						   ,@codEstado              = @codEstado
						   ,@dateStart              = @dateStart
						   ,@dateEnd                = @dateEnd
						   ,@idUsuario              = @idUsuario
						   ,@idUsuarioSearch        = @idUsuarioSearch
	--SELECT @totalRecords = COUNT(*) FROM @tblMain

	SELECT *, totalRecords = @totalRecords  FROM @tblMain --ORDER BY idDocumentoElectronico DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY
END 
