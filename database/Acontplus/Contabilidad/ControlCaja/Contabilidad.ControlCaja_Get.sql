USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspControlCajaMovement]    Script Date: 12/13/2022 4:25:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.ControlCaja_Get 
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@idUsuario INT

    --> Sql
	DECLARE @params nvarchar(MAX) ,@sql nvarchar(MAX) ,@pageIndex INT ,@pageSize INT

    --> Filters
	DECLARE @idCaja INT ,@statusMovement BIT ,@checkBoxDate BIT ,@dateStart DATETIME2 ,@dateEnd DATETIME2 ,@idEstablecimiento INT

    --> Recuperando Variables
    SELECT TOP 1 @idEntidad  = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)
	
    --> Get
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'movimientos'

            SELECT @idCaja         = idCaja 
	              ,@dateStart      = dateStart
	              ,@dateEnd        = dateEnd
	              ,@statusMovement = statusMovement
	              ,@checkBoxDate   = checkBoxDate
                  ,@pageSize       = pageSize
				  ,@pageIndex      = pageIndex
	        FROM OPENJSON(@json) WITH 
            (
                 idCaja         INT 
                ,checkBoxDate   BIT 
                ,dateStart      DATETIME2 
                ,dateEnd        DATETIME2
                ,statusMovement BIT 
                ,pageSize       INT
                ,pageIndex      INT
	        )

            SET @sql  = 'SELECT cc.idControlCaja                               as id
					           ,FORMAT(cc.fechaApertura, ''dd/MM/yyyy HH:mm'') as fechaApertura
					           ,FORMAT(cc.fechaCierre, ''dd/MM/yyyy HH:mm'')   as fechaCierre
                               ,ISNULL(cc.faltante, 0)                         as faltante 
					           ,ISNULL(cc.sobrante,0)                          as sobrante
 					           ,ISNULL(cc.totalArqueo,0)                       as totalArqueo
					           ,cc.estado
                               ,ISNULL(e.email, null)                          as receptor
                               ,COUNT(*) OVER()                                as totalRecords
				         FROM ControlCaja      cc WITH (NOLOCK)  
                         INNER JOIN dbo.Caja    c WITH (NOLOCK) ON c.idCaja    = cc.idCaja
                         INNER JOIN dbo.Entidad e WITH (NOLOCK) ON e.idEntidad = c.idEntidad 
				         WHERE cc.idCaja = @idCaja '

	        SET @params  = '@idCaja         INT
				           ,@statusMovement BIT
				           ,@dateStart      DATETIME2
				           ,@dateEnd        DATETIME2
                           ,@pageSize       INT
                           ,@pageIndex      INT'

		    IF @checkBoxDate = 1
			    BEGIN
				    SET @sql = @sql + 'AND CAST(fechaApertura AS DATE) BETWEEN CAST(@dateStart AS DATE) AND CAST(@dateEnd AS DATE) '
			    END 

		    IF @statusMovement IN (0,1)
			    BEGIN
				    SET @sql = @sql + 'AND cc.estado = @statusMovement '
			    END 
            ELSE 
                BEGIN
                    SET @sql = @sql + 'AND idControlCaja IN (SELECT MAX(idControlCaja) FROM dbo.ControlCaja mc WITH (NOLOCK) WHERE estado = 1 AND idCaja = @idCaja) '
                END 

		    SET @sql = @sql + 'ORDER BY cc.idControlCaja DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

		    EXEC SP_EXECUTESQL @sql, @params
								    ,@idCaja         = @idCaja
								    ,@dateStart      = @dateStart
								    ,@dateEnd        = @dateEnd
								    ,@statusMovement = @statusMovement
                                    ,@pageIndex      = @pageIndex
                                    ,@pageSize       = @pageSize
      
            RETURN 
        END 
    
    --> DataForm Open CashBox
    IF @tipo = 2
        BEGIN
            
            SET @tableNames = 'formaPagos,tipoDocumento'

            SELECT idEntidadFinanciera,codigo,descripcion FROM EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

            SELECT idTipoDocumento,codigo,descripcion FROM dbo.TipoDocumento td WITH (NOLOCK) WHERE codigo IN ('FV','NE','EC','IC')

            RETURN 
        END 

    --> DataForm Close CashBox
    IF @tipo = 3
        BEGIN
            SET @tableNames = 'monedas'

            SELECT idMoneda 
                  ,0                  as cantidad 
                  ,UPPER(descripcion) as descripcion
			      ,valor
		    FROM dbo.Moneda WITH (NOLOCK)
		    ORDER BY tipoMoneda DESC

		    RETURN 
        END 
      
    --> Filter for Report 
    IF @tipo = 5
        BEGIN
            
            SET @tableNames = 'usuario,estadoPago'

            SELECT idUsuario, nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

            SELECT idEstadoPago, codigo as codEstado, descripcion FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('NCBR')

            RETURN 
        END 

    ---Filters
	IF @tipo = 6
        BEGIN 
            
            SET @tableNames = 'establecimiento'

            SELECT es.idEstablecimiento,es.codEstab,es.nombreComercial,ea.predeterminado
            FROM Config.Estab_Asig         ea WITH (NOLOCK) 
            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = ea.codEstab
            WHERE idUsuarioRol = @userRoleId ORDER BY predeterminado DESC			

            RETURN
        END

    --> Cheques 
    IF @tipo = 7
        BEGIN
            
            SET @tableNames = 'cheques'

            DECLARE @byPosfechado BIT

            SELECT @idEstablecimiento = idEstablecimiento
                  ,@dateStart         = dateStart
	              ,@dateEnd           = dateEnd
	              ,@checkBoxDate      = checkBoxDate
                  ,@byPosfechado      = byPosfechado
                  ,@pageSize          = pageSize
				  ,@pageIndex         = pageIndex
	        FROM OPENJSON(@json) WITH 
            (
                 idEstablecimiento INT
                ,checkBoxDate      BIT 
                ,dateStart         DATETIME2 
                ,dateEnd           DATETIME2
                ,pageSize          INT
                ,pageIndex         INT
                ,byPosfechado      BIT
	        )

            SET @params  = '@idEntidad    INT
                           ,@dateStart    DATETIME2
				           ,@dateEnd      DATETIME2
                           ,@pageSize     INT
                           ,@pageIndex    INT
                           ,@byPosfechado BIT'

            SET @sql = 'SELECT *,COUNT(*) OVER() as totalRecords
                                     FROM (

                                            SELECT co.idCobro                                                                                      as id
		                                          ,co.idComprobanteIngreso                                                                         as idComprobante
                                                  ,es.idEstablecimiento
                                                  ,''CI''                                                                                          as codDoc
		                                          ,''CI'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CONVERT(VARCHAR, ci.nroDocumento), 9) as nroDocumento
		                                          ,cu.BusinessName                                                                                 as persona
		                                          ,cu.IDCard                                                                                       as nroIdentificacion
		                                          ,co.valor
		                                          ,JSON_VALUE(dbo.f_sanitize_json(co.infoCobro),''$.nro'')                                         as nro
		                                          ,FORMAT(co.fechaEmision, ''dd/MM/yyyy HH:mm'')                                                   as fechaEmision
		                                          ,co.posfechado                                                                           
		                                          ,co.cobro
	                                        FROM dbo.Cobro                    co WITH (NOLOCK)
	                                        INNER JOIN dbo.ComprobanteIngreso ci WITH (NOLOCK) ON ci.idComprobanteIngreso = co.idComprobanteIngreso
	                                        INNER JOIN dbo.EntidadFinanciera  ef WITH (NOLOCK) ON ef.idEntidadFinanciera  = co.idEntidadFinanciera
                                            INNER JOIN Customer.Customer      cu WITH (NOLOCK) ON cu.Id                   = ci.CustomerId
                                            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.idEstablecimiento    = ci.idEstablecimiento
	                                        WHERE ef.codigo = ''CHE''
                                              AND ci.estado = 1
                                              AND ci.idEntidad = @idEntidad

                                            UNION ALL

                                            SELECT pa.idPago                                                                                       as id
		                                          ,pa.idComprobanteEgreso                                                                          as idComprobante
                                                  ,es.idEstablecimiento
                                                  ,''CE''                                                                                          as codDoc
		                                          ,''CE'' + ''-'' + es.estab + ''-'' + RIGHT(''000000000'' + CONVERT(VARCHAR, ce.nroDocumento), 9) as nroDocumento
		                                          ,cu.BusinessName                                                                                 as persona
		                                          ,cu.IDCard                                                                                       as nroIdentificacion
		                                          ,pa.valor
		                                          ,pa.nro                                 
		                                          ,FORMAT(pa.fechaEmision, ''dd/MM/yyyy HH:mm'')                                                   as fechaEmision
		                                          ,pa.posfechado                                                                           
		                                          ,pa.cobro 
                                            FROM dbo.Pago pa WITH (NOLOCK)
                                            INNER JOIN dbo.ComprobanteEgreso ce WITH (NOLOCK) ON ce.idComprobanteEgreso = pa.idComprobanteEgreso
                                            INNER JOIN dbo.EntidadFinanciera ef WITH (NOLOCK) ON ef.idEntidadFinanciera = pa.idEntidadFinanciera
                                            INNER JOIN Customer.Customer     cu WITH (NOLOCK) ON cu.Id                  = ce.CustomerId
                                            INNER JOIN Sri.Establecimiento   es WITH (NOLOCK) ON es.idEstablecimiento   = ce.idEstablecimiento
                                            WHERE ef.codigo = ''CHE''
                                              AND ce.estado = 1
                                              AND ce.idEntidad = @idEntidad
 
                                      ) as dt 
                                 
                                 WHERE dt.id > 0  '


            IF @checkBoxDate = 1
			    BEGIN
				    SET @sql = @sql + 'AND CAST(fechaEmision AS DATE) BETWEEN CAST(@dateStart AS DATE) AND CAST(@dateEnd AS DATE) '
			    END 

            IF @byPosfechado IN (1,0)
                BEGIN
                    SET @sql = @sql + 'AND posfechado = @byPosfechado '
                END
            
            SET @sql = @sql + 'ORDER BY dt.fechaEmision DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC SP_EXECUTESQL @sql,@params
								   ,@dateStart    = @dateStart
								   ,@dateEnd      = @dateEnd
                                   ,@pageIndex    = @pageIndex
                                   ,@pageSize     = @pageSize
                                   ,@idEntidad    = @idEntidad
                                   ,@byPosfechado = @byPosfechado

            RETURN 
        END 

    --> ArqueoCaja
    IF @tipo = 8 
        BEGIN
            
            DECLARE @id INT

            SET @tableNames = 'arqueoCajaDetalle'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT mo.descripcion  
                  ,JSON_VALUE(dt.[value],'$.cantidad')                                   as cantidad
                  ,mo.valor
                  ,CAST(JSON_VALUE(dt.[value],'$.cantidad') * mo.valor as numeric(18,2)) as total
            FROM dbo.ControlCaja                cc WITH (NOLOCK)
            CROSS APPLY OPENJSON(cc.arqueoCaja) dt
            INNER JOIN dbo.Moneda               mo WITH (NOLOCK) ON mo.idMoneda = JSON_VALUE(dt.[value],'$.idMoneda')
            WHERE cc.idControlCaja = @id

            RETURN 
        END 
END
