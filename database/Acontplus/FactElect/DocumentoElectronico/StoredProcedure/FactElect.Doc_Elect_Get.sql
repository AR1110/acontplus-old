USE AcontPlus
GO

CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Get @idRol INT,@json NVARCHAR(max)
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    --Filters
	DECLARE @idUsuario INT
	       ,@codDoc VARCHAR(10)
	       ,@codEstado INT
	       ,@checkBoxDate BIT
	       ,@dateStart DATETIME2
	       ,@dateEnd DATETIME2
	       ,@codEstab VARCHAR(20)
           ,@secuencial VARCHAR(50)
	       ,@idPuntoEmision INT
	       ,@identificacionReceptor VARCHAR(20)

    -->Variables
    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

	SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol
	
    IF @tipo = 1
        BEGIN 
            SET @params = '@idEntidad              INT
						  ,@codEstab               VARCHAR(20)
	                      ,@codDoc                 VARCHAR(10)
						  ,@identificacionReceptor VARCHAR(20)
						  ,@codEstado              VARCHAR(5)
						  ,@dateStart              DATETIME2
						  ,@dateEnd                DATETIME2
						  ,@idUsuario              INT
                          ,@pageSize               INT
						  ,@pageIndex              INT
                          ,@idPuntoEmision         INT'

            SET @sql = 'SELECT de.idDocumentoElectronico
							  ,de.codDoc
							  ,de.comprobante
							  ,de.serieComprobante
							  ,de.rucReceptor 
							  ,de.razonSocial
							  ,FORMAT(de.fechaEmision, ''dd/MM/yyyy'')   as fechaEmision
							  ,claveAcceso
							  ,de.fechaAutorizacion
							  ,de.estado
							  ,de.codEstado
							  ,de.versionComp
							  ,de.usuario
							  ,ISNULL(de.codEstab, '''')                 as codEstab
                              ,COUNT(*) OVER()                           as totalRecords
						FROM FactElect.v_DocElectronico de
						WHERE de.idEntidad = @idEntidad '

	        SELECT @codDoc                   = codDoc
	              ,@codEstado                = codEstado
	              ,@checkBoxDate             = checkBoxDate
	              ,@dateStart                = dateStart
	              ,@dateEnd                  = dateEnd
	              ,@tipo                     = tipo
	              ,@codEstab                 = codEstab
	              ,@idPuntoEmision           = idPuntoEmision
	              ,@identificacionReceptor   = identificacionReceptor
	              ,@idUsuario                = idUsuario
		          ,@pageSize                 = pageSize
		          ,@pageIndex                = pageIndex
                  ,@secuencial               = LTRIM(RTRIM(nroSecuencial))
	        FROM OPENJSON(@json) WITH 
            (
                 codDoc                 VARCHAR(10) 
		        ,codEstado              INT 
		        ,checkBoxDate           BIT 
		        ,dateStart              DATETIME2 
		        ,dateEnd                DATETIME2 
		        ,tipo                   VARCHAR(2) 
		        ,codEstab               VARCHAR(20) 
		        ,idPuntoEmision         INT 
		        ,identificacionReceptor VARCHAR(20) 
		        ,idUsuario              INT 
		        ,nroSecuencial          VARCHAR(50) 
                ,pageIndex              INT 
		        ,pageSize               INT 
		     )

            IF EXISTS (SELECT 1 FROM Config.v_User_Permission_Sale WHERE idUsuarioRol = @idRol AND viewOthersDocs = 0) 
				BEGIN
                    SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH(NOLOCK) WHERE idUsuarioRol = @idRol
				END

	        IF @codEstab IS NOT NULL
		        BEGIN 
			        SET @sql = @sql + 'AND de.codEstab = @codEstab '
		        END 
            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND de.estadoEstablecimiento = 1 '
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
			        SET @sql = @sql +  'AND de.codEstado NOT IN (4,6) '
		        END
	
	        IF @codEstado >= 0
		        BEGIN
                    IF @codEstado = 8 
                        BEGIN
                            SET @sql = @sql +  'AND de.codEstado NOT IN (4,6) '
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


            SET @sql = @sql + 'ORDER BY de.fechaEmision DESC OFFSET @pageSize*(@pageIndex-1) ROWS FETCH NEXT @pageSize ROWS ONLY '
	 
	        EXEC sp_executesql @sql,@params
				                   ,@idEntidad              = @idEntidad
						           ,@idPuntoEmision         = @idPuntoEmision
                                   ,@idUsuario              = @idUsuario
                                   ,@codEstado              = @codEstado
                                   ,@codEstab               = @codEstab
						           ,@codDoc                 = @codDoc 
						           ,@identificacionReceptor = @identificacionReceptor
						           ,@dateStart              = @dateStart
						           ,@dateEnd                = @dateEnd
                                   ,@pageSize               = @pageSize
                                   ,@pageIndex              = @pageIndex
            RETURN 
        END 

    --> FILTERS 
    IF @tipo = 2
        BEGIN
            SELECT idEstablecimiento
                      ,nombreComercial
                      ,codEstab
                      ,idPuntoEmision
                      ,estab + '-' + ptoEmi as ptoEmi
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
