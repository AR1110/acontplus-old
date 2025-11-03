USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Cliente_Get]    Script Date: 12/15/2022 11:21:36 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-10-06
-- Description:	SP para listar los clietes
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Cliente_Get
    @userRoleId INT ,
    @json NVARCHAR(MAX),
    @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT

    --> Sql
    DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT

    -->Filters
    DECLARE @checkTextSearch BIT ,@textSearch VARCHAR(MAX)

    --> Recuperacion de Informacion
    SELECT @tipo = tipo
    FROM OPENJSON(@json) WITH (tipo INT )

    SELECT TOP 1
        @idEntidad = idEntidad
    FROM v_usuario WITH (NOLOCK)
    WHERE idUsuarioRol = @userRoleId

    --> Get
    -- For the type = 1 section, modify the SQL to use this approach
    IF @tipo = 1
    BEGIN
        SET @params = '@idEntidad  INT
                      ,@textSearch VARCHAR(500)
                      ,@pageSize   INT
                      ,@pageIndex  INT'

        -- Get the parameters
        SELECT @pageSize        = pageSize
              , @pageIndex       = pageIndex 
              , @checkTextSearch = checkTextSearch 
              , @textSearch      = (REPLACE(textSearch,SPACE(1),'%'))
        FROM OPENJSON(@json) WITH 
        (
             pageIndex       INT 
            ,pageSize        INT 
            ,checkTextSearch BIT  
            ,textSearch      VARCHAR(255)
        )

        -- Construct the WHERE clause
        DECLARE @whereClause NVARCHAR(MAX) = ' WHERE cl.idEntidad = @idEntidad '

        IF @checkTextSearch = 1
            SET @whereClause = @whereClause + 'AND cl.IDCard + '' '' + cl.TradeName + '' '' + cl.BusinessName LIKE ''%''+@textSearch+''%'' '

        -- Get total count with a separate query
        DECLARE @countSql NVARCHAR(MAX) = 'SELECT @totalRecords = COUNT(*) FROM v_Cliente cl WITH (NOLOCK) ' + @whereClause
        DECLARE @totalRecords INT

        EXEC sp_executesql @countSql
                          ,N'@idEntidad INT, @textSearch VARCHAR(500), @totalRecords INT OUTPUT'
                          ,@idEntidad = @idEntidad
                          ,@textSearch = @textSearch
                          ,@totalRecords = @totalRecords OUTPUT

        -- Main query for the data without the COUNT(*) OVER()
        SET @sql = 'SELECT cl.idCliente 
                          ,cl.idTipoIdentificacion
                          ,cl.IDCard          as numeroIdentificacion
                          ,cl.TradeName       as nombreComercial
                          ,cl.BusinessName    as nombreFiscal
                          ,cl.direccion
                          ,cl.telefono
                          ,cl.correo
                          ,cl.consumidorFinal
                          ,cl.validationSri
                          ,cl.tipoIdentificacion
                          ,cl.codTipoIdentificacion
                          ,cl.estado
                          ,' + CAST(@totalRecords AS NVARCHAR(20)) + ' as totalRecords
                    FROM v_Cliente cl WITH (NOLOCK) ' + @whereClause + '
                    ORDER BY cl.idCliente DESC 
                    OFFSET @pageSize*(@pageIndex-1) ROWS 
                    FETCH NEXT @pageSize ROWS ONLY'

        EXEC sp_executesql @sql
                          ,@params 
                          ,@idEntidad  = @idEntidad
                          ,@textSearch = @textSearch
                          ,@pageIndex  = @pageIndex
                          ,@pageSize   = @pageSize
        RETURN
    END

    --> DataForm 
    IF @tipo = 2
		BEGIN
        SET @tableNames = 'identificationTypes,subTaxpayers,creditTerms,cities,clientSupplierTypes,businesses,positions,paymentMethodsSri,housingTypes,maritalStatus,employees';


        SELECT codigoSri, codigo, idTipoIdentificacion, descripcion
        FROM TipoIdentificacion WITH (NOLOCK)
        WHERE codigo IN('C','R','P')

        SELECT idSubContribuyente, descripcion, codigo
        FROM SubContribuyente WITH (NOLOCK)
        WHERE estado = 1
        ORDER BY idSubContribuyente desc

        SELECT idTiempoCredito, descripcion, diasCredito, numeroCuota, entrada, tipo
        FROM TiempoCredito WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

        SELECT c.idCiudad, ciudad = c.descripcion, c.codigo, c.estado, c.idProvincia, provincia = pr.descripcion
        FROM Ciudad  c WITH (NOLOCK)
            INNER JOIN Provincia pr WITH (NOLOCK) ON pr.idProvincia = c.idProvincia

        SELECT t_cp.idTipoClienteProveedor, t_cp.descripcion, t_cp.codigo
        FROM TipoClienteProveedor t_cp WITH (NOLOCK)
            INNER JOIN TipoPersona tp WITH (NOLOCK) ON t_cp.idTipoPersona =tp.idTipoPersona
        WHERE tp.codigo = 'CL'
            AND t_cp.codigo IN ('01','02')
        ORDER BY t_cp.idTipoClienteProveedor DESC

        SELECT idEmpresa
                  , cu.IDCard       as ruc
                  , cu.BusinessName as razonSocial
                  , cu.TradeName    as nombreComercial 
                  , estado
        FROM Administrador.Empresa   en WITH (NOLOCK)
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id = en.CustomerId
        WHERE en.idEntidad = @idEntidad
            AND en.estado = 1
        ORDER BY idEmpresa DESC

        SELECT idCargo, codigo, descripcion, estado
        FROM Administrador.Cargo WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND estado = 1
        ORDER BY idCargo DESC

        SELECT idFormaPagoSri, descripcion, codigo
        FROM dbo.FormaPagoSri WITH (NOLOCK)
        WHERE estado = 1

        SELECT id, code, [name]
        FROM [Common].[HousingType]
        WHERE [IsActive] = 1

        SELECT id, code, [name]
        FROM [Common].[MaritalStatus]
        WHERE [IsActive] = 1

        SELECT idEmpleado, nombreCompleto
        FROM dbo.Empleado
        WHERE idEntidad = @idEntidad

        RETURN
    END

    --> Exists Customer
    IF @tipo = 3
		BEGIN
        SELECT @textSearch = textSearch
        FROM OPENJSON(@json) WITH (textSearch VARCHAR(15) '$.textSearch')

        SELECT cl.idCliente 
				  , cl.idTipoIdentificacion
				  , cl.IDCard          as numeroIdentificacion
				  , cl.TradeName       as nombreComercial
				  , cl.BusinessName    as nombreFiscal
				  , cl.direccion
				  , cl.telefono
				  , cl.correo
				  , cl.consumidorFinal
				  , cl.validationSri
				  , cl.tipoIdentificacion
                  , cl.codTipoIdentificacion
				  , cl.estado
				  , COUNT(*) over() as totalRecords
        FROM v_Cliente cl WITH (NOLOCK)
        WHERE cl.idEntidad = @idEntidad
            AND cl.IDCard = @textSearch

        RETURN
    END

    --> Exportar 
    IF @tipo = 4
		BEGIN
        SET @params = '@idEntidad INT'

        EXEC sp_executesql @sql
							  ,@params 
							  ,@idEntidad  = @idEntidad

        RETURN
    END

    SELECT '0'code, 'No se encontraron datos con los parametros solicitados' as 'message'
    RETURN
END
