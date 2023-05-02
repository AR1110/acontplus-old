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
	SET LANGUAGE SPANISH;

	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @rucProv VARCHAR(20)
	DECLARE @idProveedor INT 
	DECLARE @inventory VARCHAR(5)
	DECLARE @fechaEmision DATETIME
	DECLARE @codDoc VARCHAR(2)
	

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
	
		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @inventory = llevaInventario FROM Config.GestionSistema WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT TOP 1 @rucProv = rucEmisor, @fechaEmision = CAST(fechaEmision AS date), @codDoc = codDoc FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento 
		
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
					  AND t.idArticulo  = @idArticulo
					

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
					  --AND NOT EXISTS (SELECT * FROM Recepcion.DocumentoDetalle rddd WHERE rddd.idDocumento = @idDocumento)

					INSERT INTO Recepcion.Doc_Detalle_Impuesto(idDocumento, codigoPrincipal, codigo, codigoPorcentaje, tarifa, baseImponible, valor)
					SELECT @idDocumento, codArticulo, codigo, codigoPorcentaje, tarifa, baseImponible, valor 
					FROM Recepcion.Doc_Impuesto_Temp tt 
					INNER JOIN Recepcion.Doc_Detalle_Temp ddt ON tt.idDocumento = ddt.idDocumento AND tt.idDetalle = ddt.idDetalle
					WHERE tt.idDocumento = @idDocumento
					  AND ddt.idArticulo > 0
					  --AND NOT EXISTS (SELECT * FROM Recepcion.Doc_Detalle_Impuesto rddd WHERE rddd.idDocumento = @idDocumento)


					UPDATE ddi SET ddi.idDocumentoDetalle = t.idDocumentoDetalle
					FROM Recepcion.Doc_Detalle_Impuesto ddi
					JOIN (SELECT idDocumento, idDocumentoDetalle FROM Recepcion.DocumentoDetalle) AS t ON ddi.codigoPrincipal = ddi.codigoPrincipal AND ddi.idDocumento = t.idDocumento
					WHERE ddi.idDocumento = @idDocumento
				END


			UPDATE Recepcion.DocumentoRecibido SET complete = 1 WHERE idDocumento = @idDocumento

			--==================================================================Inventario===============================================================
			--	END

			IF @inventory = 'SI'
				BEGIN
					IF EXISTS (SELECT 1 FROM Recepcion.DocumentoDetalle t INNER JOIN Articulo a WITH(NOLOCK) ON t.idArticulo = a.idArticulo WHERE t.idDocumento = @idDocumento  AND a.llevaInventario = 1)
						BEGIN
							DECLARE @idArticuloStock INT
							DECLARE @idBodega INT
							DECLARE @idMedida INT
							DECLARE @idTarifa INT
							DECLARE @cantidad NUMERIC(18,2)
							DECLARE @precioUnitario NUMERIC(18,5)
							DECLARE @precioCosto NUMERIC(18,5) 
							DECLARE @precioTotalSimImpuestos AS NUMERIC(18,5)
							DECLARE @codDocInv VARCHAR(2)
							DECLARE @multiplier INT 
							DECLARE @tblDetails AS TABLE (
								 idArticulo  INT NOT NULL
								,idTarifa  INT  NULL
								,idBodega   INT NOT NULL
								,idMedida  INT NULL
								,cantidad NUMERIC (18,5)
								,precioUnitario NUMERIC (18,5)
								,precioTotalSimImpuestos NUMERIC (18,5)
							)

							IF @idArticulo > 0 
								BEGIN 
									INSERT INTO @tblDetails (idArticulo   ,idBodega   ,idMedida   ,cantidad,precioUnitario,precioTotalSimImpuestos)
										   SELECT dd.idArticulo,dd.idBodega,dd.idMedida,dd.cantidad,precioUnitario,dd.precioTotalSinImpuesto 
										   FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK) 
										   WHERE dd.idDocumento = @idDocumento
											 AND dd.idArticulo = @idArticulo
								END 

							ELSE 
								BEGIN 
									INSERT INTO @tblDetails (idArticulo   ,idBodega   ,idMedida   ,cantidad,precioUnitario,precioTotalSimImpuestos)
										   SELECT dd.idArticulo,dd.idBodega,dd.idMedida,dd.cantidad,precioUnitario,dd.precioTotalSinImpuesto 
										   FROM Recepcion.DocumentoDetalle dd WITH (NOLOCK) 
										   WHERE dd.idDocumento = @idDocumento
								END 

							SET @codDocInv = (SELECT CASE WHEN @codDoc = '01' THEN 'FE' WHEN @codDoc = '04' THEN 'NC' END)

							SET @multiplier = (SELECT CASE WHEN @codDoc = '01' THEN 1  WHEN @codDoc = '04' THEN -1 END)

							DECLARE cursor_inventory CURSOR LOCAL FOR
							SELECT td.idArticulo, idBodega,td.idMedida,NULL, cantidad * @multiplier, td.precioUnitario * @multiplier,a.precioCosto,td.precioTotalSimImpuestos * @multiplier
							FROM @tblDetails td
							INNER JOIN Articulo a WITH(NOLOCK) ON td.idArticulo = a.idArticulo
							
							OPEN cursor_inventory

							FETCH NEXT FROM cursor_inventory INTO @idArticuloStock,@idBodega,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSimImpuestos

							WHILE @@FETCH_STATUS = 0
								BEGIN
									--tipo transaccion 2 salidas
									--tipo documento 1 factura electronica
									EXEC Inventario.Transaccion_Insert 'E', @codDocInv, @fechaEmision, @idDocumento,  @idArticuloStock, @idBodega ,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSimImpuestos, @idUsuario
									FETCH NEXT FROM cursor_inventory INTO @idArticuloStock,@idBodega,@idMedida,@idTarifa,@cantidad,@precioUnitario,@precioCosto,@precioTotalSimImpuestos
								END
							CLOSE cursor_inventory
							DEALLOCATE cursor_inventory  
						END
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
