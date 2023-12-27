USE AcontPlus
GO

CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Get @idRol INT,@json NVARCHAR(max)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT
	DECLARE @isViewOtherDocs BIT
	DECLARE @idUsuario INT
	DECLARE @codDoc VARCHAR(10)
	DECLARE @codEstado INT
	DECLARE @checkBoxDate BIT
	DECLARE @dateStart DATETIME
	DECLARE @dateEnd DATETIME
	DECLARE @tipo VARCHAR(2)
	DECLARE @codEstab VARCHAR(20)
    DECLARE @secuencial VARCHAR(50)
	DECLARE @idPuntoEmision INT
	DECLARE @identificacionReceptor VARCHAR(20)
	DECLARE @pageSize INT
	DECLARE @pageIndex INT 
	
	DECLARE @params NVARCHAR(MAX) = '@idEntidad                      INT
									,@codEstab               VARCHAR(20)
	                                ,@codDoc                 VARCHAR(10)
									,@identificacionReceptor VARCHAR(20)
									,@codEstado               VARCHAR(5)
									,@dateStart                 DATETIME
									,@dateEnd                   DATETIME
									,@idUsuario                      INT
                                    ,@pageSize                       INT
						            ,@pageIndex                      INT
                                    ,@idPuntoEmision                 INT'

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
                                        ,totalRecords  = count(*) over()
									 FROM FactElect.v_DocElectronico de WITH (NOLOCK)
									 INNER JOIN Usuario     u WITH (NOLOCK) ON u.idUsuario = de.idUsuario
									 WHERE de.idEntidad = @idEntidad  '

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT '$.tipo')

	SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol
	
    IF @tipo = 1
        BEGIN 
	        SELECT @codDoc                   = codDoc
	              ,@codEstado                = codEstado
	              ,@checkBoxDate             = checkBoxDate
	              ,@dateStart                = dateStart
	              ,@dateEnd                  = dateEnd
	              ,@tipo                     = tipo
	              ,@codEstab                 = codEstab
	              ,@idPuntoEmision           = idPuntoEmision
	              ,@identificacionReceptor   = identificacionReceptor
	              ,@idUsuario                = idUsuarioSearch
		          ,@pageSize                 = pageSize
		          ,@pageIndex                = pageIndex
                  ,@secuencial               = LTRIM(RTRIM(nroSecuencial))
	        FROM OPENJSON(@json)
	        WITH (codDoc                 VARCHAR(10) '$.codDoc'
		         ,codEstado                      INT '$.codEstado'
		         ,checkBoxDate                   BIT '$.checkBoxDate'
		         ,dateStart                 DATETIME '$.dateStart'
		         ,dateEnd                   DATETIME '$.dateEnd'
		         ,tipo                    VARCHAR(2) '$.tipo'
		         ,codEstab               VARCHAR(20) '$.codEstab'
		         ,idPuntoEmision                 INT '$.idPuntoEmision'
		         ,identificacionReceptor VARCHAR(20) '$.identificacionReceptor'
		         ,idUsuarioSearch                INT '$.idUsuario'
		         ,nroSecuencial          VARCHAR(50) '$.nroSecuencial'
                 ,pageIndex                      INT '$.pageIndex'
		         ,pageSize                       INT '$.pageSize'
		        )

            SELECT @isViewOtherDocs =  JSON_VALUE(jsonPermission, '$.additional.viewOthersDocs.view') FROM Config.UserPermission WHERE codModule = 'V' AND idUsuarioRol = @idRol
				
            IF @isViewOtherDocs = 0
				BEGIN
                    SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @idRol
				END 

	        IF @codEstab IS NOT NULL
		        BEGIN 
			        SET @sql = @sql + 'AND de.codEstab = @codEstab '
		        END 

	        IF @idPuntoEmision > 0
		        BEGIN 
			        SET @sql = @sql + 'AND de.idPuntoEmision = @idPuntoEmision '
		        END 

            IF @secuencial IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND de.secuencial BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
				END 

	        IF @checkBoxDate = 1
		        BEGIN 
			        SET @sql = @sql + 'AND CAST(de.fechaEmision AS date) BETWEEN CAST(@dateStart AS date) AND CAST(@dateEnd AS date) '
		        END 

	        IF @codDoc IS NOT NULL
		        BEGIN
			        SET @sql = @sql +'AND de.codDoc = @codDoc '
		        END 

	        IF @identificacionReceptor IS NOT NULL
		        BEGIN 
			        SET @sql = @sql + 'AND de.rucReceptor = @identificacionReceptor '
		        END 

	        IF (@tipo = '3')
		        BEGIN
			        SET @sql = @sql +  'AND codEstado NOT IN (4,6) '
		        END
	
	        IF @codEstado >= 0
		        BEGIN
                    
                    IF @codEstado = 8 
                        BEGIN
                            SET @sql = @sql +  'AND codEstado NOT IN (4,6) '
                        END 
                    ELSE 
                        BEGIN
                            SET @sql = @sql + 'AND de.codEstado = @codEstado '
                        END 
		        END 
		
	        IF @idUsuario > 0
		        BEGIN
			        SET @sql = @sql + 'AND de.idUsuario = @idUsuario '
		        END 


            SET @sql = @sql + 'ORDER BY de.idDocumentoElectronico DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '
	 
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
                                   ,@pageSize               = @pageSize
                                   ,@pageIndex              = @pageIndex
            RETURN 
    END 

    -- FILTERS 
    IF @tipo = 2
        BEGIN
            SELECT idEstablecimiento
                      ,nombreComercial
                      ,codEstab
                      ,idPuntoEmision
                      ,ptoEmi + '-' + estab as ptoEmi
                      ,defaultEstab
                      ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @idRol ORDER BY defaultEstab DESC

            SELECT idTipoDocumento,descripcion,codigoSri as codDoc FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri IN ('01','03','04','06','07') ORDER BY codigoSri

            SELECT idEstadoServicio, codigo as codEstado , descripcion FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE estado = 1 AND codigo IN (4,6,8)

            RETURN 
        END 

    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN 
END 
