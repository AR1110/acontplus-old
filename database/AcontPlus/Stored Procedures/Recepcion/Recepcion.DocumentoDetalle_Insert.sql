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
-- Create date: 2022-09-17
-- Description:	SP Para insertar los detalles temporales del comprobante importado
-- =============================================
IF OBJECT_ID(N'Recepcion.DocumentoDetalle_Insert', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.DocumentoDetalle_Insert 
GO
CREATE PROCEDURE Recepcion.DocumentoDetalle_Insert	@idUsuarioRol INT
,@idDocumento INT
,@idArticulo INT
AS
BEGIN
	SET NOCOUNT ON; 
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @rucProv VARCHAR(20)
	DECLARE @idProveedor INT 
	DECLARE @inventory VARCHAR(5)


	BEGIN TRY
		IF NOT EXISTS (SELECT 1 FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = @idDocumento)
			BEGIN
				SELECT '0' code, 'No existe datos para registrar'as 'message'
				RETURN
			END

		IF NOT EXISTS (SELECT 1 FROM Recepcion.Doc_Detalle_Temp WHERE idDocumento = @idDocumento AND idArticulo > 0)
			BEGIN
				SELECT '0' code, 'No existe ningun articulo vinculado para guardar'as 'message'
				RETURN
			END
	
		SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @inventory = llevaInventario FROM Config.GestionSistema WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT @rucProv = rucEmisor  FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento 

		SELECT TOP 1 @idProveedor = idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND numeroIdentificacion = @rucProv

		BEGIN TRAN
			
			IF (@idArticulo > 0)
				BEGIN
					INSERT INTO Recepcion.DocumentoDetalle(idDocumento, idBodega, idArticulo, idMedida, codigoPrincipal, codigoAuxiliar
					, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, costoNeto, detallesAdicionales, impuestos, idUsuario)

					SELECT idDocumento, t.idBodega, t.idArticulo, t.idMedida, t.codigoPrincipal, t.codigoAuxiliar
					,cantidad, t.descripcion, precioUnitario, descuento, precioTotalSinImpuesto, CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)), detallesAdicionales, impuestos, @idUsuario
					FROM Recepcion.Doc_Detalle_Temp t 
					WHERE t.idDocumento = @idDocumento
					AND t.idArticulo = @idArticulo
					AND NOT EXISTS (SELECT * FROM Recepcion.DocumentoDetalle rddd WHERE rddd.idDocumento = @idDocumento)

					INSERT INTO Recepcion.Doc_Detalle_Impuesto(idDocumento, codigoPrincipal, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
					SELECT @idDocumento, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor 
					FROM Recepcion.Doc_Impuesto_Temp tt 
					INNER JOIN Recepcion.Doc_Detalle_Temp ddt ON tt.idDocumento = ddt.idDocumento AND tt.idDetalle = ddt.idDetalle
					WHERE tt.idDocumento = @idDocumento
					AND ddt.idArticulo = @idArticulo
					AND NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Impuesto rddd WHERE rddd.idDocumento = @idDocumento)


					UPDATE ddi SET ddi.idDocumentoDetalle = t.idDocumentoDetalle
					FROM Recepcion.Doc_Detalle_Impuesto ddi
					JOIN (SELECT idDocumento, idDocumentoDetalle, idArticulo 
					FROM Recepcion.DocumentoDetalle) AS t ON ddi.codigoPrincipal = ddi.codigoPrincipal 
					AND ddi.idDocumento = t.idDocumento
					AND t.idArticulo = @idArticulo
					WHERE ddi.idDocumento = @idDocumento 
				END

			ELSE
				BEGIN 
					INSERT INTO Recepcion.DocumentoDetalle(idDocumento, idBodega, idArticulo, idMedida, codigoPrincipal, codigoAuxiliar
					, cantidad, descripcion, precioUnitario, descuento, precioTotalSinImpuesto, costoNeto, detallesAdicionales, impuestos, idUsuario)

					SELECT idDocumento, t.idBodega, t.idArticulo, t.idMedida, t.codigoPrincipal, t.codigoAuxiliar
					,cantidad, t.descripcion, precioUnitario, descuento, precioTotalSinImpuesto, CAST((CAST(precioTotalSinImpuesto AS decimal(15,5)) / CAST(cantidad AS decimal(18,5))) AS numeric(18,5)), detallesAdicionales, impuestos, @idUsuario
					FROM Recepcion.Doc_Detalle_Temp t 
					WHERE t.idDocumento = @idDocumento
					AND t.idArticulo > 0
					AND NOT EXISTS (SELECT * FROM Recepcion.DocumentoDetalle rddd WHERE rddd.idDocumento = @idDocumento)

					INSERT INTO Recepcion.Doc_Detalle_Impuesto(idDocumento, codigoPrincipal, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
					SELECT @idDocumento, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor 
					FROM Recepcion.Doc_Impuesto_Temp tt 
					INNER JOIN Recepcion.Doc_Detalle_Temp ddt ON tt.idDocumento = ddt.idDocumento AND tt.idDetalle = ddt.idDetalle
					WHERE tt.idDocumento = @idDocumento
					AND ddt.idArticulo > 0
					AND NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Impuesto rddd WHERE rddd.idDocumento = @idDocumento)


					UPDATE ddi SET ddi.idDocumentoDetalle = t.idDocumentoDetalle
					FROM Recepcion.Doc_Detalle_Impuesto ddi
					JOIN (SELECT idDocumento, idDocumentoDetalle FROM Recepcion.DocumentoDetalle) AS t ON ddi.codigoPrincipal = ddi.codigoPrincipal AND ddi.idDocumento = t.idDocumento
					WHERE ddi.idDocumento = @idDocumento
				END

			UPDATE Recepcion.DocumentoRecibido SET complete = 1 WHERE idDocumento = @idDocumento

			--==================================================================Inventario===============================================================
			IF @inventory = 'SI'
				BEGIN
					INSERT INTO Inventario.ControlStock(idTipoDocumento,idDocumento,idArticulo,idBodega)
					SELECT 1,@idDocumento,rd.idArticulo,rd.idBodega 
					FROM Recepcion.DocumentoDetalle rd 
					INNER JOIN dbo.Articulo a ON a.idArticulo = rd.idArticulo 
					WHERE a.llevaInventario = 1 AND rd.idDocumento = @idDocumento
				END 

			SELECT '1' code, 'Detalle importado exitosamente' as 'message'
		COMMIT TRAN 
	END TRY
	BEGIN CATCH
		SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoDetalle/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH

END
GO
