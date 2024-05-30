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
	DECLARE @idCaja INT ,@statusMovement BIT ,@checkBoxDate BIT ,@dateStart DATETIME2 ,@dateEnd DATETIME2

    --> Permision 
    DECLARE @verOtrasCajas BIT

    --> Recuperando Variables
    SELECT TOP 1 @idEntidad  = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)
	
    --> Get
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'movimientos'

            SELECT @verOtrasCajas = (SELECT TOP 1 verOtrasCajas FROM Config.v_User_Permission_CashAccounting WHERE idUsuarioRol = @userRoleId)

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
                               ,COUNT(*) OVER()                             as totalRecords
				         FROM ControlCaja cc WITH (NOLOCK)  
                         INNER JOIN dbo.Caja c WITH (NOLOCK)       ON c.idCaja = cc.idCaja
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

            IF @checkBoxDate = 0 
                BEGIN
                    SET @sql = @sql + 'AND idControlCaja IN (SELECT MAX(idControlCaja) FROM dbo.ControlCaja mc WITH (NOLOCK) WHERE estado = 1 AND idCaja = @idCaja) '
                END 

		    IF @statusMovement IN (0,1)
			    BEGIN
				    SET @sql = @sql + 'AND cc.estado = @statusMovement '
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
END
