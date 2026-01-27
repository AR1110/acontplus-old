USE AcontPlus;
GO

SET ANSI_NULLS ON;
GO

SET QUOTED_IDENTIFIER ON;
GO

-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-10-11
-- Description:	<Description,,>
-- Test : EXEC [Almacen].[Articulo_Get_Search] 32 ,'[{"busqueda":"galle"}]'
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Articulo_Get_Search
    @userRoleId INT ,
    @json NVARCHAR(MAX)
  --  @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    -------------------------------------------------------------------------
    --  VARIABLES
    -------------------------------------------------------------------------
    DECLARE
        @idEntidad INT,
        @bySearch NVARCHAR(500),
        @byFraccionado BIT,
        @pageSize INT,
        @pageIndex INT,
        @warehouseId INT;

    -------------------------------------------------------------------------
    --  OBTENER ENTIDAD DEL USUARIO
    -------------------------------------------------------------------------
    SELECT TOP 1
        @idEntidad = idEntidad
    FROM App.UsuarioRol WITH (NOLOCK)
    WHERE idUsuarioRol = @userRoleId;

    -------------------------------------------------------------------------
    --  PARSEAR JSON DE ENTRADA
    -------------------------------------------------------------------------
    SELECT
        @bySearch = REPLACE(busqueda, SPACE(1), '%'),
        @byFraccionado = fraccionado,
        @pageIndex = pageIndex,
        @pageSize = pageSize,
        @warehouseId = warehouseId
    FROM OPENJSON(@json)
    WITH (
        busqueda NVARCHAR(500),
        fraccionado BIT,
        pageIndex INT,
        pageSize INT,
        warehouseId INT
    );

    -------------------------------------------------------------------------
    --  RESOLVER BODEGA POR DEFECTO SI NO SE ENVÍA UNA
    -------------------------------------------------------------------------
    IF (@warehouseId IS NULL OR @warehouseId <= 0)
    BEGIN
        SELECT TOP 1
            @warehouseId = cba.idBodega
        FROM Config.Bodeg_Asig cba
            INNER JOIN Config.Estab_Asig cea
            ON cea.codEstab_Asig = cba.codEstab_Asig
        WHERE cea.idUsuarioRol = @userRoleId
            AND cba.predeterminado = 1
            AND cea.predeterminado = 1;
    END

    -------------------------------------------------------------------------
    --  CONSULTA PRINCIPAL CON PAGINACIÓN
    -------------------------------------------------------------------------
    ;
    WITH
        ArticulosCTE
        AS
        (
            SELECT
                a.idArticulo,
                IIF(a.porcentaje > 0, '*', '') + a.codigo AS codigo,
                a.descripcion,
                CAST(CAST(a.iva AS DECIMAL(15,0)) AS VARCHAR) + '%' AS iva,
                ISNULL(a.stock, 0) AS stock,
                a.subFamilia,
                a.marca,
                a.medida,
                CASE WHEN a.fraccionado = 1 THEN 'badge badge-danger' ELSE '' END AS fraccionado,
                CASE
                WHEN a.stock <= 0 THEN 'badge badge-danger'
                WHEN a.stock > 0 AND a.stock < a.stockMinimo THEN 'badge badge-warning'
                ELSE ''
            END AS style,
                a.s3ObjectUrl,
                a.s3ObjectKey
            FROM Inventario.v_Articulo a WITH (NOLOCK)
            WHERE a.idEntidad = @idEntidad
                AND a.estado = 1
                AND (
                a.descripcion    LIKE '%' + @bySearch + '%' OR
                a.codigo         LIKE '%' + @bySearch + '%' OR
                a.codigoAuxiliar LIKE '%' + @bySearch + '%' OR
                a.codigoBarra    LIKE '%' + @bySearch + '%'
              )
            --   AND (@byFraccionado = 0 OR a.fraccionado = 1)
        )
    -------------------------------------------------------------------------
    --  DEVOLVER RESULTADOS CON PAGINACIÓN Y DETALLES ADICIONALES
    -------------------------------------------------------------------------
    SELECT
        art.idArticulo,
        art.codigo,
        art.descripcion,
        art.iva,
        art.stock,
        art.subFamilia,
        art.marca,
        art.medida,
        art.fraccionado,
        art.style,
        art.s3ObjectUrl,
        art.s3ObjectKey,

        -- Precios (JSON)
        (
            SELECT
            t.descripcion AS tarifa,
            p.precioVenta,
            p.precioConIva AS precio
        FROM dbo.ArticuloPvP p WITH (NOLOCK)
            INNER JOIN dbo.Tarifa t WITH (NOLOCK)
            ON t.idTarifa = p.idTarifa
        WHERE p.idArticulo = art.idArticulo
        ORDER BY t.codigo ASC
        FOR JSON PATH
        ) AS priceSale,

        -- Ubicaciones (JSON)
        (
            SELECT TOP 1
            ISNULL(au.ubicacion, '') AS ubicacion
        FROM dbo.ArticuloUbicacion au WITH (NOLOCK)
        WHERE au.idArticulo = art.idArticulo
        FOR JSON PATH
        ) AS warehouses,

        -- Stock por bodega (JSON)
        (
            SELECT TOP 1
            stock
        FROM Inventario.Stock st WITH (NOLOCK)
            INNER JOIN dbo.Bodega bo WITH (NOLOCK)
            ON bo.idBodega = st.idBodega
        WHERE st.idArticulo = art.idArticulo
            AND bo.idBodega = @warehouseId
            AND bo.estado = 1
        ) AS warehouseStock,

        -- Paginación y total
        (SELECT COUNT(*)
        FROM ArticulosCTE) AS totalRecords

    FROM ArticulosCTE art
    ORDER BY art.stock DESC, art.descripcion ASC
    OFFSET @pageSize * (@pageIndex - 1) ROWS
    FETCH NEXT @pageSize ROWS ONLY;
END
GO
