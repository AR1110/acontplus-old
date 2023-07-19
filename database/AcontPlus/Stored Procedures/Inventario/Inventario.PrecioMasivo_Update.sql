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
-- Description:	SP FOR UPDATE ALL PRICES OF ARTICLES
-- =============================================
IF OBJECT_ID(N'Inventario.PrecioMasivo_Update', N'P') IS NOT NULL
	DROP PROCEDURE Inventario.PrecioMasivo_Update
GO
CREATE PROCEDURE Inventario.PrecioMasivo_Update @idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT
	,@articles VARCHAR(MAX)
	DECLARE @tbl AS TABLE (
		tipo INT,
		articles VARCHAR(MAX)
	)
	INSERT INTO @tbl(tipo, articles)
	SELECT tipo, articles FROM OPENJSON (@json) WITH (
													tipo INT '$.tipo',
													articles VARCHAR(MAX) '$.articles'
												)
	SET @articles = (SELECT articles FROM @tbl)

	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN
			IF EXISTS (SELECT 1 FROM @tbl WHERE tipo = 1)
				BEGIN
					UPDATE tbl SET tbl.precioVenta = t.precioVenta
								,tbl.precioConIva = t.precioConIva
								,tbl.porcentajeUtilidad = t.porcentajeUtilidad
								,tbl.estado = t.estadoTarifa
					FROM ArticuloPvp tbl WITH (NOLOCK)
					JOIN (
							SELECT idArticulo
							,idTarifa
							,precioVenta
							,precioConIva
							,porcentajeUtilidad
							,estadoTarifa
							FROM OPENJSON (@json) WITH (
															idArticulo INT '$.idArticulo',
															idTarifa INT '$.idTarifa',
															precioVenta NUMERIC(18,5) '$.precioVenta',
															precioConIva NUMERIC(18,5) '$.precioConIva',
															porcentajeUtilidad NUMERIC(18,5) '$.porcentajeUtilidad',
															estadoTarifa BIT '$.estadoTarifa'
														)
				
					) as t ON tbl.idArticulo = t.idArticulo AND tbl.idTarifa = t.idTarifa
			END
		ELSE
			BEGIN
				UPDATE tbl SET tbl.precioVenta = t.precioVenta
								,tbl.precioConIva = t.precioConIva
								,tbl.porcentajeUtilidad = t.porcentajeUtilidad
								,tbl.estado = t.estadoTarifa
					FROM ArticuloPvp tbl WITH (ROWLOCK)
					JOIN (
							SELECT idArticulo
							,idTarifa
							,precioVenta
							,precioConIva
							,porcentajeUtilidad
							,estadoTarifa
							FROM OPENJSON (@articles) WITH (
															idArticulo INT '$.idArticulo',
															idTarifa INT '$.idTarifa',
															precioVenta NUMERIC(18,5) '$.precioVenta',
															precioConIva NUMERIC(18,5) '$.precioConIva',
															porcentajeUtilidad NUMERIC(18,5) '$.porcentajeUtilidad',
															estadoTarifa BIT '$.estado'
														)
				
					) as t ON tbl.idArticulo = t.idArticulo AND tbl.idTarifa = t.idTarifa
			END

			IF @@ROWCOUNT > 0
				SELECT '1' code, 'Actualización exitosa' as 'message'
			ELSE
				SELECT '0' code, 'No se actualizo ningun registro' as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error al guardar' as 'message'
		IF @@TRANCOUNT > 0
			ROLLBACK TRAN

		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'PrecioMasivo/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
