USE [Acontplus]
GO
/****** Object:  StoredProcedure [Restaurant].[Item_Get]    Script Date: 6/10/2025 18:01:16 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		IGNACIO MANCHU
-- Create date: 2023-08-14
-- Description:	Get Item
CREATE OR ALTER PROCEDURE Restaurant.GetItem
    @UserRoleId INT
   ,@Json NVARCHAR(MAX)
   ,@TableNames NVARCHAR(MAX) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Variables Globales
    DECLARE @idEntidad INT
           ,@tipo INT
           ,@SearchTerm VARCHAR(50)
           ,@pageIndex INT
           ,@pageSize INT
           ,@sigla VARCHAR(50)
           ,@siglaFormatted VARCHAR(500)
           ,@idSubFamilia INT
           ,@Skip INT
           ,@Take INT
           ,@TotalRecords INT
           ,@UserId INT

    --> Data Global
    SELECT TOP 1 @idEntidad = idEntidad, @UserId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    BEGIN TRY
        SET @TableNames = 'items,pagination'

        --> CREAR TABLA TEMPORAL CON DATOS FILTRADOS Y ORDENADOS
        IF OBJECT_ID('tempdb..#FilteredItems') IS NOT NULL DROP TABLE #FilteredItems;

        --> Extraer parámetros del JSON
        SELECT @idSubFamilia = idSubFamilia
              ,@pageIndex    = pageIndex
              ,@pageSize     = pageSize
              ,@SearchTerm   = textSearch
              ,@sigla        = sigla
        FROM OPENJSON(@json) WITH
        (
             idSubFamilia INT
            ,pageIndex    INT
            ,pageSize     INT
            ,textSearch   VARCHAR(50)
            ,sigla        VARCHAR(50)
        );

        -- Query principal con ordenamiento dinámico y paginación
        WITH FilteredItems AS
        (
            SELECT ri.Id
                  ,ri.ProductId
                  ,ISNULL(ri.title, '')   AS title
                  ,ISNULL(ri.Summary, '') AS summary
                  ,ar.s3ObjectUrl         AS s3ObjectUrl
                  ,ar.descripcion         AS description
                  ,ar.codigo              AS code
                  ,ar.medida              AS measure
                  ,ar.codigoAuxiliar      AS auxiliary_code
                  ,ar.precioCosto         AS costPrice
                  ,ar.categoria           AS category
                  ,COUNT(*) OVER()        AS TotalRecords
            FROM Restaurant.Item ri
            INNER JOIN Inventario.v_Articulo ar ON ar.idArticulo = ri.ProductId
            WHERE ar.estado = 1
              AND ar.idEntidad = @idEntidad
              AND (@SearchTerm IS NULL
                OR @SearchTerm = ''
                OR ar.descripcion LIKE '%' + @SearchTerm + '%'
                OR ri.Summary     LIKE '%' + @SearchTerm + '%'
                OR ri.Content     LIKE '%' + @SearchTerm + '%'
              )
              AND (@idSubFamilia IS NULL
                OR @idSubFamilia = 0
                OR ar.idSubFamilia = @idSubFamilia)

              AND (@idSubFamilia > 0
                OR @sigla IS NULL
                OR ar.siglaFamilia IN (SELECT value FROM STRING_SPLIT(@sigla, ',')))

              AND (@idSubFamilia > 0
                OR @sigla IS NOT NULL
                OR ar.siglaFamilia NOT IN ('COM'))
        )
        SELECT * INTO #FilteredItems FROM FilteredItems OPTION (RECOMPILE);

        --> Crear índice para mejorar el ORDER BY paginado
        CREATE CLUSTERED INDEX IX_FilteredItems_Id ON #FilteredItems(Id);

        --> Obtener total de registros
        SELECT TOP 1 @TotalRecords = TotalRecords FROM #FilteredItems;

        --> Obtener la página solicitada
        SELECT * FROM #FilteredItems ORDER BY Id OFFSET @pageSize * (@pageIndex - 1) ROWS FETCH NEXT @pageSize ROWS ONLY;

        --> Retornar total de registros
        SELECT @TotalRecords as total_records

        --> LIMPIAR RECURSOS
        IF OBJECT_ID('tempdb..#FilteredItems') IS NOT NULL DROP TABLE #FilteredItems;
    END TRY

    BEGIN CATCH

        --> Limpiar tabla temporal en caso de error
        IF OBJECT_ID('tempdb..#FilteredItems') IS NOT NULL DROP TABLE #FilteredItems;

        INSERT INTO ErroresSistema
              (token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario ,errorDetails)
        VALUES(NEWID(), 'Item/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(),'Restaurant.GetItem', ERROR_LINE(), ERROR_MESSAGE(),GETDATE(), @UserId,@Json)
    END CATCH 
END
