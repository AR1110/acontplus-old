USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[TransferenciaBodega_Delete]    Script Date: 12/9/2022 12:11:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.TransferenciaBodega_Delete @userRoleId INT,@id INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    --> Global
	DECLARE @idUsuario INT ,@idEntidad INT

    --> Transferencia
    DECLARE @idEstadoDocumento INT,@codDOc VARCHAR(5) ,@idPuntoEmision INT

    --> Data Principal
    DECLARE @idTransaccionOriginal INT ,@idTransaccion INT ,@serieComprobante VARCHAR(25) ,@idTipoDocumentoIv INT
	
	BEGIN TRY 

		--> Variables
        SELECT TOP 1 @idTransaccionOriginal = idTransaccion
        FROM Inventario.Transaccion           tr
        INNER JOIN Inventario.TipoDocumento   td ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idDocumento = @id
          AND td.codigo = 'TB'
          AND tt.codigo = 'S'

        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WHERE codigo = 'AD'
		
		SELECT TOP 1 @codDOc         = ep.codigo
                    ,@idPuntoEmision = tb.idPuntoEmision
		FROM TransferenciaBodega tb WITH (NOLOCK)
		INNER JOIN EstadoPago    ep WITH (NOLOCK) ON ep.idEstadoPago = tb.idEstadoDocumento
		WHERE tb.idTransferenciaBodega = @id

        SELECT TOP 1 @serieComprobante  = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM ConfiguracionDocumento    cd
        INNER JOIN dbo.TipoDocumento   td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE cd.idPuntoEmision = @idPuntoEmision
          AND td.codigo = 'AD'

		IF @codDOC = 'A'
			BEGIN
				SELECT  '0'code,'La Transferencia se encuenentra <b> Anulada <b> no puede ser editada'[message]
				RETURN 
			END 


		BEGIN TRAN
            
			UPDATE dbo.TransferenciaBodega WITH (ROWLOCK) 
               SET idEstadoDocumento = @idEstadoDocumento
                  ,idUsuario         = @idUsuario
            WHERE idTransferenciaBodega = @id

            --> Transaccion
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
                AND estado = 1

            UPDATE cd SET cd.ultimaSecuencia = cd.ultimaSecuencia + 1
            FROM ConfiguracionDocumento cd
            INNER JOIN TipoDocumento    td ON td.idTipoDocumento = cd.idTipoDocumento 
            WHERE td.codigo = 'AD'
                AND cd.idPuntoEmision = @idPuntoEmision

            --> Transaccion
            EXEC dbo.Transaccion_Handler_Init @idTransaccion

		COMMIT TRAN 
		SELECT '1'code,'Anulado Correctamente'[message]
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Transferencia/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
       
        SELECT  '0'code,'Info: Error en el procedimiento'[message]
	END CATCH 
END
