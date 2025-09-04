USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Factura_Delete]    Script Date: 12/8/2022 5:08:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-11-25
-- Description:	SP para anular las facturas 
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Factura_Cancel @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 

	--> GLOBAL
	DECLARE @idEntidad INT, @idUsuario INT ,@idTipoDocumento INT
    
    --> DataJson
    DECLARE @infoAdicional VARCHAR(MAX)

    --> Contabilidad
    DECLARE @idEstadoPago INT

    --> Conversiones
    DECLARE @idEstadoDocumento INT

    --> Fact. Electronica 
    DECLARE @idEstadoServicio INT ,@idDocumentoElectronico INT

    --> Tb Variables
    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	BEGIN TRY 
        
        --> Recuperando Datos
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Json
        SELECT @infoAdicional = infoAdicional FROM OPENJSON(@json) WITH (infoAdicional NVARCHAR(MAX) as json)

        --> InfoAdicional
		INSERT INTO @tblInfoAdicional 
              (nombre,valor) 
        SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre VARCHAR(300) 
           ,valor  VARCHAR(300)
        )

        -->variables
		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 6

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri = '01'

        SELECT TOP 1 @idDocumentoElectronico = idDocumentoElectronico FROM dbo.Factura WITH (NOLOCK) WHERE idFactura = @id


        --> Validacion de Informacion
        IF NOT EXISTS(SELECT 1 FROM @tblInfoAdicional)
            BEGIN
                SELECT '0'code, 'Error en la informacion adicional' as 'message'
                RETURN 
            END
        
        IF EXISTS (SELECT 1 FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico AND codEstado NOT IN(4) )
            BEGIN
                SELECT '0'code, 'El Documento no esta Autorizado no puede ser Anulado' as 'message'
                RETURN 
            END 

        IF EXISTS (SELECT 1 FROM Ventas.v_Factura WITH (NOLOCK) WHERE codCuenta NOT IN ('PE') AND idFactura = @id)
            BEGIN
                SELECT '0'code, 'El Documento tiene movimientos financieros o esta Anulado' as 'message'
                RETURN 
            END 
		
		BEGIN TRAN
			
            --> Fact. Electronico
			UPDATE dbo.DocumentoElectronico WITH (ROWLOCK) SET idEstadoServicio = @idEstadoServicio WHERE idDocumentoElectronico = @idDocumentoElectronico

            --> InfoFactura
            UPDATE dbo.Factura WITH (ROWLOCK) SET estado = 0,lastChange = GETDATE(),idUsuario = @idUsuario WHERE idFactura = @id

            --> Contabilidad
			UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK) SET idEstadoPago = @idEstadoPago WHERE codDoc = '01' AND idDocumento = @id

            --> Manejo de infoAdicional
			UPDATE ia SET estado = 1
			FROM Compra.InfoAdicional              ia WITH (ROWLOCK)
			INNER JOIN Ventas.HistoryInfoAdicional hv WITH (ROWLOCK) ON hv.idInfoAdicional  = ia.idInfoAdicional
            INNER JOIN dbo.FacturaDetalle          fd WITH (ROWLOCK) ON fd.idFacturaDetalle = hv.idFacturaDetalle
			WHERE fd.idFactura = @id
              AND hv.estado = 1
            

            --> Apro. Ventas
            IF EXISTS (SELECT 1 FROM Ventas.Aprob_Document_Audit WITH (NOLOCK) WHERE idFactura = @id)
                BEGIN
                    DECLARE @idAprob_Document INT

                    SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

                    SELECT TOP 1 @idAprob_Document = idAprob_Document FROM Ventas.Aprob_Document_Audit WITH (NOLOCK)  WHERE idFactura = @id

                    UPDATE Ventas.Aprob_Document SET idEstadoDocumento = @idEstadoDocumento WHERE idAprob_Document = @idAprob_Document
                END 

            --> Proforma Documento 
            IF EXISTS (SELECT 1 FROM Ventas.ProformaDocumento WITH (NOLOCK) WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento)
                BEGIN
                    DECLARE @ProformaId INT

                    SELECT TOP 1 @ProformaId = ProformaId FROM Ventas.ProformaDocumento WITH (NOLOCK) WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento

                    SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'AC'

                    UPDATE dbo.Proforma WITH (ROWLOCK) SET idEstadoDocumento = @idEstadoDocumento WHERE idProforma = @ProformaId

                    UPDATE Ventas.ProformaDocumento WITH (ROWLOCK) SET Estado = 0, Eliminado = 1 WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento
                END

            --> Nota Entrega Documento
            IF EXISTS (SELECT 1 FROM Ventas.NotaEntregaDocumento WITH (NOLOCK) WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento)
                BEGIN
                    DECLARE @idNotaEntrega INT

                    SELECT TOP 1 @idNotaEntrega = NotaEntregaId FROM Ventas.NotaEntregaDocumento WITH (NOLOCK) WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento
                    
                    UPDATE dbo.NotaEntrega WITH (ROWLOCK) SET convertToDoc = 0 WHERE idNotaEntrega = @idNotaEntrega

                    UPDATE Ventas.NotaEntregaDocumento WITH (ROWLOCK) SET Estado = 0, Eliminado = 1 WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento

                    IF EXISTS (SELECT 1 FROM Inventario.v_Articulo_Transaccion WITH (NOLOCK ) WHERE codTransaccion = 'S' AND codDoc = 'NE' AND idDocumento = @idNotaEntrega AND estado = 2)
                        BEGIN
                            UPDATE t1 
                               SET t1.estado = 1
                            FROM Inventario.TransaccionDetalle    t1 WITH (ROWLOCK)
                            INNER JOIN Inventario.Transaccion     t2 WITH (ROWLOCK) ON t2.idTransaccion     = t1.idTransaccion
                            INNER JOIN Inventario.TipoDocumento   t3 WITH (ROWLOCK) ON t3.idTipoDocumento   = t2.idTipoDocumento
                            INNER JOIN Inventario.TipoTransaccion t4 WITH (ROWLOCK) ON t4.idTipoTransaccion = t2.idTipoTransaccion
                            WHERE t1.estado = 2
                              AND t2.idDocumento = @idNotaEntrega 
                              AND t3.codigo = 'NE'
                              AND t4.codigo = 'S'
                        END
                END 

            --> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    DECLARE @idTipoDocumentoIv INT ,@idTipoTransaccion INT ,@idTransaccion INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FE'

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

                    SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = @idTipoDocumentoIv AND idDocumento = @id

                    --> Transaccion
                    UPDATE Inventario.Transaccion WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

                    UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion
                    
                    EXEC dbo.Transaccion_Handler_Init 'S', 'FE', @id ,3
                    
                    IF EXISTS (SELECT 1 FROM Contabilidad.Servicio WITH (NOLOCK) WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento)    
                        BEGIN
                            UPDATE Contabilidad.Servicio WITH (ROWLOCK) SET Estado = 0 WHERE DocumentoId = @id AND TipoDocumentoId = @idTipoDocumento
                        END 
                END 

            INSERT INTO dbo.InfoAdicionalDoc
                   (idComprobante,idTipoDocumento,nombre,valor)
            SELECT @id,@idTipoDocumento,nombre,valor
            FROM @tblInfoAdicional

		COMMIT TRAN
		SELECT '1'code,'Documento Anulado' as 'message'
	END TRY 


	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END

        INSERT INTO dbo.ErroresSistema WITH (ROWLOCK) 
            (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Factura/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
			
		SELECT '0'code,'Info: Error en el procedimiento: ' as  'message'
	END CATCH 
END
