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

            SELECT @verOtrasCajas = ISNULL(JSON_VALUE(jsonPermission, '$.verOtrasCajas.view'), 0) FROM Config.UserPermission WHERE idUsuarioRol = @userRoleId AND codModule='C' 

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

            SET @sql  = 'SELECT idControlCaja                               as id
					           ,FORMAT(fechaApertura, ''dd/MM/yyyy HH:mm'') as fechaApertura
					           ,FORMAT(fechaCierre, ''dd/MM/yyyy HH:mm'')   as fechaCierre
                               ,ISNULL(faltante, 0)                         as faltante 
					           ,ISNULL(sobrante,0)                          as sobrante
 					           ,ISNULL(totalArqueo,0)                       as totalArqueo
					           ,estado
                               ,COUNT(*) OVER()                             as totalRecords
				         FROM ControlCaja WITH (NOLOCK)  
				         WHERE idCaja = @idCaja '

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
				    SET @sql = @sql + 'AND estado = @statusMovement '
			    END 

		    SET @sql = @sql + 'ORDER BY idControlCaja DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

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
            
            SET @tableNames = 'formaPagos'

            SELECT idEntidadFinanciera,codigo,descripcion FROM EntidadFinanciera WITH (NOLOCK) WHERE estado = 1

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
        
        ----Operacion para abrir caja de moneda fisica 
		--IF @typeList = 1
		--	BEGIN 	
		--		DECLARE @codEstab VARCHAR(100) = (SELECT top 1 codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1)
		--		DECLARE @urlPrinter VARCHAR(40)
		--		DECLARE @dataSources VARCHAR(MAX)
		--		DECLARE @rdlcProps VARCHAR(MAX)

		--		SELECT TOP 1 @urlPrinter = ipMaquina
		--		FROM ApiPrinter.Config_Document cd WITH (NOLOCK)
		--		INNER JOIN ApiPrinter.Impresora      i WITH (NOLOCK) ON i.idImpresora      = cd.idImpresora
		--		INNER JOIN ApiPrinter.TipoImpresora ti WITH (NOLOCK) ON ti.idTipoImpresora = i.idTipoImpresora
		--		WHERE i.codEstab = (SELECT codEstab FROM Config.Estab_Asig WHERE idUsuarioRol = @idRol AND predeterminado = 1)

		--		SET @rdlcProps = (
		--							SELECT  i.nombreImpresora printerName
		--									,CAST(0 AS bit) isThermal
		--								    ,ti.formato
		--								   ,ti.deviceInfo
		--								   ,i.nombreEquipo computerName
		--								   ,rdlcName = 'Blank.rdl'
		--								   ,copyPrint = 1
		--							FROM ApiPrinter.Impresora i
		--							INNER JOIN ApiPrinter.TipoImpresora ti ON ti.idTipoImpresora = i.idTipoImpresora
		--							WHERE i.codEstab = @codEstab AND ti.codigo != 'AT'
		--							 FOR JSON PATH
		--							)

		--		SET @dataSources = (SELECT test = 'test' FOR JSON PATH)

		--		IF NOT EXISTS(SELECT 1 FROM ApiPrinter.Impresora i
		--									INNER JOIN ApiPrinter.TipoImpresora ti ON ti.idTipoImpresora = i.idTipoImpresora
		--									WHERE i.codEstab = @codEstab)
		--				BEGIN							
		--					SELECT '0' code, 'No tienes configurada ninguna impresora' as 'message'
		--				END 

		--		SELECT '1' code, '' as 'message', payload = (SELECT 'http://' + @urlPrinter urlPrinter, @rdlcProps rdlcProps, dataSources= '[{"mainDs":"[{\"test\":\"test\"}]"}]' FOR JSON PATH)
		--		RETURN 
		--	END 
END
