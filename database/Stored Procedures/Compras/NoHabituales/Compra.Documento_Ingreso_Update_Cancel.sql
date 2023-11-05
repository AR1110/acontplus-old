USE [AcontPlus]
GO 
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
-- Author:		Alexis Ramirez
-- Create date: 03/16/2023
-- Description:	SP para dar de baja a las compra
-- =============================================
IF OBJECT_ID(N'Compra.Documento_Ingreso_Update_Cancel', N'P') IS NOT NULL
DROP PROCEDURE Compra.Documento_Ingreso_Update_Cancel
GO
CREATE PROCEDURE Compra.Documento_Ingreso_Update_Cancel @idUsuarioRol INT, @idDocumentoIngreso INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	--=============Datos capturados desde BD===========================
	DECLARE @idUsuario AS INT
	DECLARE @idEntidad AS INT

	--===========Datos para la validacion de informacion===============
	DECLARE @uniqueId AS VARCHAR(20), @fechaEmision DATETIME

	--==============Parametros para el area de contabilidad============
	DECLARE @idEstado AS INT
	DECLARE @idEstadoPago AS INT
	DECLARE @codPago AS VARCHAR(5)


	BEGIN TRY 
		
		----======================================Recuperar datos de las Tablas===========================================================
		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo  = 'A'

		SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @uniqueId = uniqueId ,@fechaEmision = fechaEmision FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idDocumentoIngreso = @idDocumentoIngreso
		
		SELECT TOP 1 @idEstado = idEstadoPago FROM Contabilidad.CuentaPorPagar WITH (NOLOCK) WHERE uniqueId = @uniqueId

		SELECT TOP 1 @codPago = codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE idEstadoPago = @idEstado

		--==================================Validacion de la informacion============================================================

		IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso WHERE idDocumentoIngreso = @idDocumentoIngreso AND estado = 0 )
			BEGIN
				SELECT '0' code,'El Documento ya se encuentra anulado' as 'message'
				RETURN 
			END 

		IF @codPago = 'PP' AND @codPago = 'PA'
			BEGIN 
				SELECT '0' code,'El Documento tiene un proceso contable no puede ser editado' as 'message'
				RETURN  
			END 

		BEGIN TRAN 
			--============================================================Administracion=========================================================================================
			UPDATE Compra.Documento_Ingreso SET estado = 0 WHERE idDocumentoIngreso = @idDocumentoIngreso

            UPDATE Compra.Documento_Ingreso_Detail SET estado = 0 WHERE idDocumentoIngreso = @idDocumentoIngreso

			UPDATE Compra.Documento_Ingreso_Taxes SET estado = 0 WHERE idDocumentoIngreso = @idDocumentoIngreso

            UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago, abono = 0 WHERE uniqueId = @uniqueId

			UPDATE Compra.InfoAdicional SET estado = 0 WHERE  uniqueId = @uniqueId

			--==============================================================Inventario============================================================================================
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN 
					
                     -- Inventario
                    DECLARE @idTipoDocumento INT ,@idTipoTransaccion INT ,@idArticulo INT 
                           ,@idBodega INT ,@cantidad NUMERIC(18,2) ,@idMedida INT ,@stock NUMERIC(18,5)

                    SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'IV'

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

					UPDATE Inventario.Transaccion WITH (ROWLOCK) SET estado = 0 WHERE idDocumento = @idDocumentoIngreso AND idTipoDocumento = @idTipoDocumento AND idTipoTransaccion = @idTipoTransaccion

					IF EXISTS (SELECT 1 FROM Compra.Documento_Ingreso_Detail td WITH (NOLOCK)
                                        INNER JOIN Articulo                   a WITH (NOLOCK) ON td.idArticulo = a.idArticulo 
                                        WHERE a.llevaInventario = 1 
                                          AND td.idDocumentoIngreso = @idDocumentoIngreso)
						BEGIN 
							
							DECLARE cursor_inventory CURSOR LOCAL FOR
							SELECT dd.idArticulo,dd.idBodega,dd.idMedida,dd.cantidad
					        FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK) 
					        INNER JOIN dbo.Articulo              ar WITH (NOLOCK) ON ar.idArticulo = dd.idArticulo
					        WHERE dd.idDocumentoIngreso = @idDocumentoIngreso AND ar.llevaInventario = 1 

							OPEN cursor_inventory

							FETCH NEXT FROM cursor_inventory INTO @idArticulo, @idBodega ,@idMedida ,@cantidad

							WHILE @@FETCH_STATUS = 0
							    BEGIN
								
								    --> Articulo Fraccionado
                                    IF EXISTS (SELECT 1 FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idMedida = @idMedida)
                                        BEGIN
                                            SELECT TOP 1 @cantidad = @cantidad  * conversion FROM dbo.ArticuloFraccionado WITH (NOLOCK) WHERE idArticulo = @idArticulo AND idMedida = @idMedida
                                        END

                                   IF EXISTS (SELECT 1 FROM Inventario.Stock WHERE idArticulo = @idArticulo AND idBodega = @idBodega AND fechaConsolidacion >= @fechaEmision)
                                        BEGIN
                                            SELECT @cantidad = 0       
                                        END

                                    UPDATE Inventario.Stock WITH(ROWLOCK) SET cantidad = cantidad - ISNULL(@cantidad,0) WHERE idArticulo = @idArticulo AND idBodega = @idBodega

	                                SELECT @stock = SUM(cantidad) FROM Inventario.Stock s WITH (NOLOCK) WHERE idArticulo = @idArticulo AND s.estado = 1

	                                UPDATE dbo.Articulo WITH(ROWLOCK) SET stock = ISNULL(@stock,0) WHERE idArticulo = @idArticulo


                                    FETCH NEXT FROM cursor_inventory INTO @idArticulo, @idBodega ,@idMedida ,@cantidad
							    END
							CLOSE cursor_inventory
							DEALLOCATE cursor_inventory  
                            
						END

				END 

		COMMIT TRAN 
		SELECT '1' code,'Anulado Correctamente ' as 'message'
		RETURN
	END TRY 

	BEGIN CATCH
		IF (@@TRANCOUNT > 0)
            BEGIN 
			    ROLLBACK TRAN
            END 
		INSERT INTO ErroresSistema([token], [method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [errorDate], [idUsuario])
		VALUES (NEWID(), 'DocumentoIngreso/PutCancel', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	    
        SELECT '0' code, 'Error en base de datos ' as 'message'

    END CATCH 


END
GO
