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
    DECLARE @infoAdicional VARCHAR(MAX) , @detalles VARCHAR(MAX)

    --> Contabilidad
    DECLARE @idEstadoPago INT

    --> Conversiones
    DECLARE @idEstadoDocumento INT

    --> Fact. Electronica 
    DECLARE @idEstadoServicio INT ,@idDocumentoElectronico INT ,@idPuntoEmision INT

    --> Data Principal
    DECLARE @idTransaccionOriginal INT ,@idTransaccion INT ,@serieComprobante VARCHAR(25)

    --> Tb Variables
    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	BEGIN TRY 
        
        --> Recuperando Datos
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @infoAdicional = infoAdicional FROM OPENJSON(@json) WITH (infoAdicional NVARCHAR(MAX) as json)

        --> InfoAdicional
		INSERT INTO @tblInfoAdicional 
              (nombre,valor) 
        SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre VARCHAR(300) 
           ,valor  VARCHAR(300)
        )

        --> variables
        SELECT TOP 1 @idTransaccionOriginal = idTransaccion
        FROM Inventario.Transaccion           tr
        INNER JOIN Inventario.TipoDocumento   td ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idDocumento = @id
          AND td.codigo = 'FE'
          AND tt.codigo = 'S'

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 6

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri = '01'

        SELECT TOP 1 @idDocumentoElectronico = de.idDocumentoElectronico
                    ,@idPuntoEmision         = de.idPuntoEmision
        FROM dbo.Factura fe
        INNER JOIN dbo.DocumentoElectronico de ON de.idDocumentoElectronico = fe.idDocumentoElectronico
        WHERE fe.idFactura = @id

        SELECT TOP 1 @serieComprobante  = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM ConfiguracionDocumento    cd
        INNER JOIN dbo.TipoDocumento   td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE cd.idPuntoEmision = @idPuntoEmision
          AND td.codigo = 'AD'

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

                END 

            --> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    DECLARE @idTipoDocumentoIv INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WHERE codigo = 'AD'

                    INSERT INTO Inventario.Transaccion
                          (idTipoTransaccion,fechaEmision,idTipoDocumento,idUsuario,idEntidad,serieComprobante,idTransaccionOriginal)
                    SELECT idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idUsuario,@idEntidad,@serieComprobante,@idTransaccionOriginal
                    FROM Inventario.Transaccion
                    WHERE idTransaccion = @idTransaccionOriginal

                    SET @idTransaccion = SCOPE_IDENTITY()

                    INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                           (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion     ,precioUnitario,precioCosto,precioCostoFraccionado,total)
			        SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion * -1,precioUnitario,precioCosto,precioCostoFraccionado,total
                    FROM Inventario.TransaccionDetalle
                    WHERE idTransaccion = @idTransaccionOriginal

                    UPDATE cd SET cd.ultimaSecuencia = cd.ultimaSecuencia + 1
                    FROM ConfiguracionDocumento cd
                    INNER JOIN TipoDocumento    td ON td.idTipoDocumento = cd.idTipoDocumento 
                    WHERE td.codigo = 'AD'
                      AND cd.idPuntoEmision = @idPuntoEmision

                    --> Transaccion
                    EXEC dbo.Transaccion_Handler_Init @idTransaccion
                    
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
		SELECT NEWID(),'/Factura/Cancel',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
			
		SELECT '0'code,'Info: Error en el procedimiento: ' as  'message'
	END CATCH 
END
