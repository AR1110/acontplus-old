USE AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-05-16
-- Description:	SP FOR GET ALL PRICES OF ARTICLES
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.PrecioMasivo_Get 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

     --> Global
	DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX)

	DECLARE @idArticulo   INT 
           ,@idTarifa     INT
	       ,@rucProveedor VARCHAR(25)
	       ,@idSubFamilia INT
	       ,@nroDocumento VARCHAR(25)
           ,@subFamiliasChecked VARCHAR(250) 

    --> Filters
	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Filters
	IF @tipo = 1
		BEGIN
            
            SET @tableNames = 'subfamilias,tarifas,decimales,impuestos'

            SELECT sf.idSubFamilia
                  ,sf.descripcion as subFamilia
                  ,sf.codigo 
                  ,familia = ISNULL(fa.descripcion, 'Ninguna')
                  ,fa.idFamilia
            FROM dbo.SubFamilia    sf WITH (NOLOCK) 
            LEFT JOIN dbo.Familia fa WITH (NOLOCK) ON fa.idFamilia = sf.idFamilia
            WHERE idEntidad = @idEntidad

			SELECT * FROM Tarifa WITH (NOLOCK) WHERE idEntidad = @idEntidad

			SELECT * FROM Config.v_Sistema_Decimal WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codTrasaccion = 'AL'

            SELECT * FROM dbo.TipoIva WITH (NOLOCK) WHERE estado = 1 

            RETURN 
		END

    --> Get Articulos 
	IF @tipo = 2
		BEGIN
            
            SET @tableNames = 'articulos'

            SELECT @idTarifa     = idTarifa
	              ,@idArticulo   = idArticulo
	              ,@rucProveedor = rucProveedor
	              ,@idSubFamilia = idSubFamilia
	              ,@nroDocumento = nroDocumento
                  ,@subFamiliasChecked = subFamiliasChecked
	        FROM OPENJSON(@json) WITH 
            (
		        idTarifa           INT 
		       ,idArticulo         INT
		       ,rucProveedor       VARCHAR(25)
		       ,idSubFamilia       INT 
		       ,nroDocumento       VARCHAR(25) 
               ,subFamiliasChecked VARCHAR(250) 
	        )

            SET @params = '@idEntidad          INT
				          ,@idArticulo         INT
				          ,@idTarifa           INT
				          ,@rucProveedor       VARCHAR(25)
				          ,@idSubFamilia       INT
				          ,@nroDocumento       VARCHAR(25)
                          ,@subFamiliasChecked VARCHAR(250)'


	        SET @sql = 'SELECT a.idArticulo
                              ,a.idTipoIva
				              ,codigo
				              ,codigoAuxiliar
				              ,codigoBarra
				              ,descripcion
				              ,stock
				              ,precioCosto
				              ,estado
				              ,iva
				              ,ISNULL((SELECT       ap.idArticuloPvp
                                                   ,ap.idArticulo
                                                   ,ap.idTarifa
                                                   ,ap.precioVenta
                                                   ,ap.precioConIva
                                                   ,ap.porcentajeUtilidad
                                                   ,ap.tarifa
                                       FROM v_ArticuloPvp ap
									   WHERE ap.idArticulo = a.idArticulo
                                         AND ap.precioVenta > 0 
                                       ORDER BY ap.predeterminada DESC
                                       FOR JSON PATH
                                       ), ''[]'') as tarifas
				        FROM Inventario.v_Articulo a 
				        WHERE a.estado = 1 
				          AND a.idEntidad = @idEntidad '

			IF @idArticulo > 0
				BEGIN 
					SET @sql = @sql + 'AND a.idArticulo = @idArticulo '
				END

            IF @subFamiliasChecked IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND a.idSubFamilia IN (SELECT value FROM STRING_SPLIT(@subFamiliasChecked, '',''))'
                END 

			IF @rucProveedor IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE rucClienteProveedor = @rucProveedor) '
				END

			IF @nroDocumento IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE nroDocumento = @nroDocumento) '
				END

		    SET @sql = @sql + 'ORDER BY a.fechaModificacion DESC  '

		    EXEC sp_executesql @sql,@params
							       ,@idEntidad          = @idEntidad
							       ,@idTarifa           = @idTarifa
							       ,@idArticulo         = @idArticulo
							       ,@idSubFamilia       = @idSubFamilia
							       ,@rucProveedor       = @rucProveedor
							       ,@nroDocumento       = @nroDocumento
                                   ,@subFamiliasChecked = @subFamiliasChecked
            RETURN 
		END

    IF @tipo = 3
	    BEGIN
            
            SET @tableNames = 'articulos'

            SELECT @idTarifa           = idTarifa
	              ,@idArticulo         = idArticulo
	              ,@rucProveedor       = rucProveedor
	              ,@idSubFamilia       = idSubFamilia
	              ,@nroDocumento       = nroDocumento
                  ,@subFamiliasChecked = subFamiliasChecked
	        FROM OPENJSON(@json) WITH 
            (
		         idTarifa           INT 
		        ,idArticulo         INT
		        ,rucProveedor       VARCHAR(25)
		        ,idSubFamilia       INT 
		        ,nroDocumento       VARCHAR(25) 
                ,subFamiliasChecked VARCHAR(250) 
	        )

            SET @params = '@idEntidad          INT
				          ,@idArticulo         INT
				          ,@idTarifa           INT
				          ,@rucProveedor       VARCHAR(25)
				          ,@idSubFamilia       INT
				          ,@nroDocumento       VARCHAR(25)
                          ,@subFamiliasChecked VARCHAR(250)'


	        SET @sql = 'SELECT af.idArticuloFraccionado
                              ,af.idTipoIva
                              ,af.idArticulo
				              ,af.codigo  
				              ,descripcion = af.articulo
                              ,medida = af.medidaFraccionada
				              ,af.stock
				              ,precioCosto = af.precioCostoFraccionado
				              ,af.estado
				              ,af.iva
				              ,ISNULL((SELECT afp.idArticuloFraccionadoPvP 
                                             ,afp.idArticuloFraccionado
                                             ,afp.idTarifa
                                             ,afp.precioVenta
                                             ,afp.precioConIva
                                             ,afp.porcentajeUtilidad
                                             ,tarifa = t.descripcion
                                      FROM dbo.ArticuloFraccionadoPvp afp WITH (NOLOCK)
                                      INNER JOIN dbo.Tarifa             t WITH (NOLOCK) ON t.idTarifa = afp.idTarifa
									  WHERE afp.idArticuloFraccionado = af.idArticuloFraccionado
                                        AND afp.precioVenta > 0 
                                      ORDER BY afp.idArticuloFraccionadoPvP DESC
                                      FOR JSON PATH ), ''[]'') as tarifas
				        FROM v_articulo_fraccionado  af WITH (NOLOCK)
				        WHERE af.estado = 1  AND af.idEntidad = @idEntidad '

		    IF @idArticulo > 0
			    BEGIN 
				    SET @sql = @sql + 'AND af.idArticulo = @idArticulo '
			    END

            IF @subFamiliasChecked IS NOT NULL
                BEGIN 
                    SET @sql = @sql + 'AND af.idSubFamilia IN (SELECT value FROM STRING_SPLIT(@subFamiliasChecked, '',''))'
                END 

		    IF @rucProveedor IS NOT NULL
			    BEGIN
				    SET @sql = @sql + 'AND af.idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE rucClienteProveedor = @rucProveedor) '
			    END

		    IF @nroDocumento IS NOT NULL
			    BEGIN
				    SET @sql = @sql + 'AND af.idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE nroDocumento = @nroDocumento) '
			    END

		    SET @sql = @sql + 'ORDER BY af.idArticuloFraccionado DESC  '

		    EXEC sp_executesql @sql,@params
							        ,@idEntidad          = @idEntidad
							        ,@idTarifa           = @idTarifa
							        ,@idArticulo         = @idArticulo
							        ,@idSubFamilia       = @idSubFamilia
							        ,@rucProveedor       = @rucProveedor
							        ,@nroDocumento       = @nroDocumento
                                    ,@subFamiliasChecked = @subFamiliasChecked
            RETURN 
	    END
    END
GO
