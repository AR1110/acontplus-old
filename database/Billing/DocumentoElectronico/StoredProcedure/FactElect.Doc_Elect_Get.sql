USE AcontPlus
GO

CREATE OR ALTER PROCEDURE FactElect.Doc_Elect_Get @idRol INT,@json NVARCHAR(max) --,@tableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN 
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
    SET DATEFIRST 1;

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

    --> Get 
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

	        IF @codEstado >= 0
		        BEGIN
                    IF @codEstado = 8 
                        BEGIN
                            SET @sql = @sql +  'AND de.codEstado <> 4 AND de.codEstado <> 6 AND de.codEstado <> 8 '
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
            --SET @tableNames = 'establishments,documents,serviceStatus';
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
    
    --> Normativas del sri
    IF @tipo = 3
        BEGIN
            DECLARE @fechaEmision   DATETIME2
                   ,@identificacion VARCHAR(20)
                   ,@importeTotal   NUMERIC(18,2)
                   ,@fechaAnulacion DATETIME2
                   ,@idFormaPago    INT
                   ,@formaPago      VARCHAR(10)
                   ,@message        VARCHAR(500)

            --> Data Json
            SELECT @codDoc         = codDoc
                  ,@identificacion = identificacion
                  ,@fechaEmision   = fechaEmision
                  ,@idFormaPago    = idFormaPago
                  ,@importeTotal   = importeTotal
            FROM OPENJSON(@json) WITH
            (
                codDoc         VARCHAR(15)
               ,identificacion VARCHAR(100)
               ,fechaEmision   DATETIME2
               ,idFormaPago    INT
               ,importeTotal   NUMERIC(18,2)
            )


            --> Normativas del sri para el tipo de cliente Consumidor Final
            IF EXISTS
            (
                SELECT 1 FROM Customer.Customer   cu WITH (NOLOCK)
                INNER JOIN dbo.TipoIdentificacion ti WITH (NOLOCK) ON ti.idTipoIdentificacion = cu.IdTypeId 
                WHERE cu.IdCard = @identificacion
                    AND ti.codigoSri = '07' 
            )
                BEGIN
                    --> Normativa vigente solo puede emitir facturas menores o iguales a 50 para consumidor final
                    IF @importeTotal > 50
                        BEGIN
                            SELECT @message = 'No está permitido emitir facturas mayores a 50 dolares a consumidor final Según normativa del SRI' 
                        END

                    --ELSE IF @importeTotal IS NULL
                    --    BEGIN
                    --        SELECT @message = 'No se permite anular ventas a consumidor final.'
                    --    END
                END

            --> Normativa que restringue a tipos ciertos de pagos si se eleva el valor destinado por el sri
            ELSE
                BEGIN 
                    IF @importeTotal > 500
                        BEGIN
                            SELECT TOP 1 @formaPago = codigo FROM FormaPagoSri WHERE idFormaPagoSri = @idFormaPago

                            IF @formaPago IN ('01','15','21')
                                BEGIN
                                    SELECT @message = 'No se permite esta forma de pago para montos mayores a $500.'
                                END 
                        END
                END 

            --> Validacion para procedo de anular documento
            IF @fechaEmision IS NOT NULL
                BEGIN
                    DECLARE @feriados TABLE (fecha DATE)

                    SET @fechaAnulacion = DATEFROMPARTS(YEAR(DATEADD(MONTH, 1, @fechaEmision)),MONTH(DATEADD(MONTH, 1, @fechaEmision)),7)

                    -- 🔹 Agrega aquí los feriados que quieras excluir
                    INSERT INTO @feriados (fecha)
                    VALUES ('2025-11-03'),('2025-11-04')

                    -- 🔹 Ajustar si cae sábado o domingo
                    IF DATEPART(WEEKDAY, @fechaAnulacion) IN (7, 1)
                        BEGIN
                            SET @fechaAnulacion = DATEADD(DAY, 1, @fechaAnulacion)
                        END 
                        
                    -- 🔹 Ajustar por feriados
                    IF EXISTS (SELECT 1 FROM @feriados WHERE fecha BETWEEN @fechaAnulacion AND DATEADD(DAY, 3, @fechaAnulacion))
                        BEGIN 
                            SET @fechaAnulacion = DATEADD(DAY, 3, @fechaAnulacion)
                        END

                    -- 🔹 Validación
                    IF CAST(GETDATE() AS DATE) > @fechaAnulacion
                    BEGIN 
                        SELECT @message = CONCAT(
                            'No puede anular este documento. ',
                            'El SRI solo permite anular hasta el día 7 (hábil) del mes siguiente a la fecha de emisión. ',
                            'Fecha límite real: ', CONVERT(VARCHAR(10), @fechaAnulacion, 103)
                        )
                    END
                END 

            SELECT '0' as code, @message as 'message' WHERE @message IS NOT NULL
            RETURN 
        END 


    SELECT '0'code,'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN 
END 
