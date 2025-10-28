USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Delete]    Script Date: 12/9/2022 9:36:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.NotaCredito_Delete @idUsuarioRol int,@id int 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET LANGUAGE SPANISH;

	-- GLOBAL
	DECLARE @idEntidad INT, @idUsuario INT 

     -- Venta 
    DECLARE @idFactura INT 

    -- Contabilidad
    DECLARE @idEstadoPago INT

    --> Fact.Elect
    DECLARE @idEstadoServicio INT ,@idDocumentoElectronico INT ,@idPuntoEmision INT

    --> Data Principal
    DECLARE @idTransaccionOriginal INT ,@idTransaccion INT ,@serieComprobante VARCHAR(25)

	BEGIN TRY 
        --> Recuperando Variables
        SELECT TOP 1 @idTransaccionOriginal = idTransaccion
        FROM Inventario.Transaccion           tr
        INNER JOIN Inventario.TipoDocumento   td ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idDocumento = @id
          AND td.codigo = 'NC'
          AND tt.codigo = 'S'

		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 6

        SELECT TOP 1 @idDocumentoElectronico = de.idDocumentoElectronico
                    ,@idPuntoEmision         = de.idPuntoEmision
                    ,@idFactura              = nc.idFactura
        FROM dbo.NotaCredito                nc
        INNER JOIN dbo.DocumentoElectronico de ON de.idDocumentoElectronico = nc.idDocumentoElectronico
        WHERE nc.idNotaCredito = @id

        SELECT TOP 1 @serieComprobante  = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM ConfiguracionDocumento    cd
        INNER JOIN dbo.TipoDocumento   td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE cd.idPuntoEmision = @idPuntoEmision
          AND td.codigo = 'AD'

		-- Validacion de Informacion
        IF EXISTS (SELECT 1 FROM Ventas.v_NotaCredito WITH (NOLOCK) WHERE idNotaCredito = @id AND codServicio NOT IN(4))
            BEGIN
                SELECT '0'code, 'El Documento no esta Autorizado no puede ser Anulado' as 'message'
                RETURN 
            END

		IF EXISTS (SELECT 1 FROM Ventas.v_NotaCredito WITH (NOLOCK) WHERE idNotaCredito = @id AND codCuenta NOT IN('PE'))
            BEGIN
                SELECT '0'code, 'El Documento tiene movimientos financieros o esta Anulado' as 'message'
                RETURN 
            END

		BEGIN TRAN 

			UPDATE dbo.DocumentoElectronico WITH (ROWLOCK) SET idEstadoServicio = @idEstadoServicio WHERE idDocumentoElectronico = @idDocumentoElectronico
           
            UPDATE NotaCredito WITH (ROWLOCK) SET idUsuario = @idUsuario,lastChange = dbo.ufnGetDateEcuador() ,estado = 0 WHERE idNotaCredito = @id

			UPDATE Factura WITH (ROWLOCK) SET notaCredito = 0 WHERE idFactura = @idFactura

            UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK) SET idEstadoPago = @idEstadoPago WHERE idDocumento = @id AND codDoc = '04' 

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
		SELECT '1'code,'Documento Anulado'as 'message',''
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END

		INSERT INTO ErroresSistema
		    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/NotaCredito/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	    
        SELECT '0' as code,'Info: Error en el procedimiento ' as 'message', 'Nota de Credito'
    END CATCH 
END
