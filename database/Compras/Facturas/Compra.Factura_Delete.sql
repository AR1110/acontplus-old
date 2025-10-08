USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Factura_Delete]    Script Date: 21/4/2023 9:14:14 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-12-03
-- Description:	SP para eliminar factura de compra
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Factura_Delete @userRoleId INT ,@id INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    DECLARE @idEstadoPago INT ,@idUsuario INT ,@idEntidad INT

    --> Data Principal
    DECLARE @idTransaccionOriginal INT ,@idTransaccion INT ,@serieComprobante VARCHAR(25)

    --> Compra
    DECLARE @idPuntoEmision INT

	BEGIN TRY 
		
        --> Recuperanado informacion
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @idTransaccionOriginal = idTransaccion
        FROM Inventario.Transaccion           tr
        INNER JOIN Inventario.TipoDocumento   td ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idDocumento = @id
          AND td.codigo = 'FF'
          AND tt.codigo = 'E'

        SELECT TOP 1 @idPuntoEmision = pa.idPuntoEmision
        FROM Config.PtoEmi_Asig      pa 
        INNER JOIN Config.Estab_Asig ae ON ae.idEstab_Asig = pa.idEstab_Asig
        WHERE pa.predeterminado = 1
          AND ae.idUsuarioRol = @userRoleId

        SELECT TOP 1 @serieComprobante  = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM ConfiguracionDocumento    cd
        INNER JOIN dbo.TipoDocumento   td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE cd.idPuntoEmision = @idPuntoEmision
          AND td.codigo = 'AD'

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        --> Validando Informacion 
		IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = 'FC' AND codEstado != 'PE' AND idDocumento = @id)
            BEGIN
                SELECT '0'code,'El Documento tiene movimientos financieros o esta Anulado'[message]
                RETURN 
            END

        IF EXISTS (SELECT 1 FROM FacturaCompra WITH (NOLOCK) WHERE idFacturaCompra = @id AND retencion = 1)
            BEGIN
                SELECT '0'code,'El Documento tiene aplicada una retencion'[message]
                RETURN 
            END

		BEGIN TRAN 
			UPDATE FacturaCompra SET estado = 0, idUsuario = @idUsuario, lastChange = dbo.ufnGetDateEcuador() WHERE idFacturaCompra = @id

            UPDATE Contabilidad.CuentaPorPagar SET idEstadoPago = @idEstadoPago WHERE codDoc = 'FC' AND idDocumento = @id

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
				END 

		COMMIT TRAN 
		SELECT '1'code,'Anulado Correctamente'[message]
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
			    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/FacturaCompra/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	
        SELECT '0'code,'Info: Error en el procedimiento'[message]
	END CATCH 



END
