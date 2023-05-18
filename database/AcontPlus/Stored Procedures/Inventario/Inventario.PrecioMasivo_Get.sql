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
	,@rucProveedor VARCHAR(25)
	,@idFamilia INT
	,@idSubFamilia INT
	,@nroDocumento VARCHAR(25)
	,@sql NVARCHAR(MAX)

	DECLARE @idEntidad INT = (
			SELECT idEntidad
			FROM App.UsuarioRol
			WHERE idUsuarioRol = @idUsuarioRol
			)
	DECLARE @params NVARCHAR(MAX)


	SET @params = '@idEntidad INT,
				   @idArticulo INT,
				   @rucProveedor VARCHAR(25),
				   @idFamilia INT,
				   @idSubFamilia INT,
				   @nroDocumento VARCHAR(25) '


	SET @sql = 'SELECT a.idArticulo
				,codigo
				,codigoAuxiliar
				,descripcion
				,stock
				,precioCosto
				,pvp1 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.codTarifa = ''1''), 0)
				,pvp2 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.codTarifa = ''2''), 0)
				,pvp3 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
															WHERE ap.idArticulo = a.idArticulo 
															AND ap.codTarifa = ''3''), 0)
				,pvp4 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
															WHERE ap.idArticulo = a.idArticulo 
															AND ap.codTarifa = ''4''), 0)
				,pvp5 = ISNULL((SELECT TOP 1 ap.precioVenta FROM v_ArticuloPvp ap
															WHERE ap.idArticulo = a.idArticulo 
															AND ap.codTarifa = ''5''), 0)
				,pvpIva1 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.codTarifa = ''1''), 0)
				,pvpIva2 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
														WHERE ap.idArticulo = a.idArticulo 
														AND ap.codTarifa = ''2''), 0)
				,pvpIva3 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
															WHERE ap.idArticulo = a.idArticulo 
															AND ap.codTarifa = ''3''), 0)
				,pvpIva4 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
															WHERE ap.idArticulo = a.idArticulo 
															AND ap.codTarifa = ''4''), 0)
				,pvpIva5 = ISNULL((SELECT TOP 1 ap.precioConIva FROM v_ArticuloPvp ap
															WHERE ap.idArticulo = a.idArticulo 
															AND ap.codTarifa = ''5''), 0)

				FROM v_Articulo a 
				WHERE a.estado = 1 AND a.idEntidad = @idEntidad '
	
	SELECT @tipo = tipo
	,@opcion = opcion
	,@idArticulo = idArticulo
	,@rucProveedor = rucProveedor
	,@idFamilia = idFamilia
	,@idSubFamilia = idSubFamilia
	,@nroDocumento = nroDocumento
	FROM OPENJSON(@json) WITH (
		tipo INT '$.tipo',
		opcion INT '$.opcion',
		idArticulo INT '$.idArticulo',
		rucProveedor VARCHAR(25) '$.rucProveedor',
		idFamilia INT '$.idFamilia',
		idSubFamilia INT '$.idSubFamilia',
		nroDocumento INT '$.nroDocumento'
	)

	IF (@tipo = 1)
		BEGIN
			SELECT * FROM Familia
			SELECT * FROM SubFamilia
		END
	IF (@tipo = 2)
		BEGIN
			IF (@opcion = 1)
				BEGIN 
					SET @sql = @sql + 'AND a.idArticulo = @idArticulo '
				END
			IF (@opcion = 4)
				BEGIN
					SET @sql = @sql + 'AND idArticulo IN (SELECT idArticulo FROM v_InventarioTransaccion WHERE rucClienteProveedor = @rucProveedor) '
				END
		EXEC sp_executesql @sql, @params
							   ,@idEntidad = @idEntidad
							   ,@idArticulo = @idArticulo
							   ,@idFamilia = @idFamilia
							   ,@idSubFamilia = @idSubFamilia
							   ,@rucProveedor = @rucProveedor
							   ,@nroDocumento = @nroDocumento
		END
END
GO
