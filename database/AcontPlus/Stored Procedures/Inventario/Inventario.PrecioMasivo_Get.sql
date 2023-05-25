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
IF OBJECT_ID(N'Inventario.PrecioMasivo_Get', N'P') IS NOT NULL
	DROP PROCEDURE Inventario.PrecioMasivo_Get
GO
CREATE PROCEDURE Inventario.PrecioMasivo_Get @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @tipo INT
	,@opcion INT
	,@idArticulo INT
	,@idTarifa Int
	,@rucProveedor VARCHAR(25)
	,@idFamilia INT
	,@idSubFamilia INT
	,@nroDocumento VARCHAR(25)
	,@sql NVARCHAR(MAX)
	,@idEntidad INT
	,@params NVARCHAR(MAX)

	SET @idEntidad = (SELECT idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)

	SET @params = '@idEntidad INT,
				   @idArticulo INT,
				   @idTarifa INT,
				   @rucProveedor VARCHAR(25),
				   @idFamilia INT,
				   @idSubFamilia INT,
				   @nroDocumento VARCHAR(25) '


	SET @sql = 'SELECT a.idArticulo
				,codigo
				,codigoAuxiliar
				,codigoBarra
				,descripcion
				,stock
				,precioCosto
				,estado
				,@idTarifa idTarifa
				,iva
				,idArticuloPvp = ISNULL((SELECT TOP 1 ap.idArticuloPvp FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.idTarifa = @idTarifa), 0)
				,precioVenta = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.idTarifa = @idTarifa), 0)
				
				,precioConIva = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.idTarifa = @idTarifa), 0)
				,porcentajeUtilidad = ISNULL((SELECT TOP 1 ap.porcentajeUtilidad FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.idTarifa = @idTarifa), 0)
				,estadoTarifa = ISNULL((SELECT TOP 1 ap.estado FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.idTarifa = @idTarifa), 0)
				--,pvp1 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
				--										WHERE ap.idArticulo = a.idArticulo 
				--										AND ap.codTarifa = ''1''), 0)
				--,pvp2 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
				--										WHERE ap.idArticulo = a.idArticulo 
				--										AND ap.codTarifa = ''2''), 0)
				--,pvp3 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
				--											WHERE ap.idArticulo = a.idArticulo 
				--											AND ap.codTarifa = ''3''), 0)
				--,pvp4 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
				--											WHERE ap.idArticulo = a.idArticulo 
				--											AND ap.codTarifa = ''4''), 0)
				--,pvp5 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
				--											WHERE ap.idArticulo = a.idArticulo 
				--											AND ap.codTarifa = ''5''), 0)
				--,pvpIva1 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
				--										WHERE ap.idArticulo = a.idArticulo 
				--										AND ap.codTarifa = ''1''), 0)
				--,pvpIva2 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
				--										WHERE ap.idArticulo = a.idArticulo 
				--										AND ap.codTarifa = ''2''), 0)
				--,pvpIva3 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
				--											WHERE ap.idArticulo = a.idArticulo 
				--											AND ap.codTarifa = ''3''), 0)
				--,pvpIva4 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
				--											WHERE ap.idArticulo = a.idArticulo 
				--											AND ap.codTarifa = ''4''), 0)
				--,pvpIva5 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
				--											WHERE ap.idArticulo = a.idArticulo 
				--											AND ap.codTarifa = ''5''), 0)

				FROM v_Articulo a 
				WHERE a.estado = 1 
				AND a.idEntidad = @idEntidad '
	
	SELECT @tipo = tipo
	,@opcion = opcion
	,@idTarifa = idTarifa
	,@idArticulo = idArticulo
	,@rucProveedor = rucProveedor
	,@idFamilia = idFamilia
	,@idSubFamilia = idSubFamilia
	,@nroDocumento = nroDocumento
	FROM OPENJSON(@json) WITH (
		tipo INT '$.tipo',
		opcion INT '$.opcion',
		idTarifa INT '$.idTarifa',
		idArticulo INT '$.idArticulo',
		rucProveedor VARCHAR(25) '$.rucProveedor',
		idFamilia INT '$.idFamilia',
		idSubFamilia INT '$.idSubFamilia',
		nroDocumento INT '$.nroDocumento'
	)

	IF (@tipo = 1)
		BEGIN
			SELECT * FROM Familia WITH (NOLOCK) WHERE idEntidad = @idEntidad
			SELECT * FROM SubFamilia WITH (NOLOCK) WHERE idEntidad = @idEntidad
			SELECT * FROM Tarifa WITH (NOLOCK) WHERE idEntidad = @idEntidad
			SELECT * FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = 'CD' --AND JSON_VALUE(jsonConfig, '$[0].codTransaccion') = 'AL'
		END
	IF (@tipo = 2)
		BEGIN
			IF (@opcion = 1)
				BEGIN 
					SET @sql = @sql + 'AND a.idArticulo = @idArticulo '
				END
			IF (@opcion = 2)
				BEGIN 
					PRINT CAST(@IDFAMILIA AS VARCHAR(4))
					SET @sql = @sql + 'AND a.idFamilia = @idFamilia '
				END
			IF (@opcion = 3)
				BEGIN
					SET @sql = @sql + 'AND a.idSubFamilia = @idSubFamilia '
				END
			IF (@opcion = 4)
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE rucClienteProveedor = @rucProveedor) '
				END
			IF (@opcion = 5)
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE nroDocumento = @nroDocumento) '
				END
		SET @sql = @sql + 'ORDER BY a.fechaModificacion DESC '
		EXEC sp_executesql @sql, @params
							   ,@idEntidad = @idEntidad
							   ,@idTarifa = @idTarifa
							   ,@idArticulo = @idArticulo
							   ,@idFamilia = @idFamilia
							   ,@idSubFamilia = @idSubFamilia
							   ,@rucProveedor = @rucProveedor
							   ,@nroDocumento = @nroDocumento
		END
END
GO
