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
-- Create date: 2023-03-09
-- Description:	 SP FOR DELETE DETAIL
-- =============================================
CREATE OR ALTER PROCEDURE Recepcion.DocumentoDetalle_Delete	@idUsuarioRol INT,@id INT 
AS
BEGIN
	SET NOCOUNT ON; 
	set language spanish;

	DECLARE @idEntidad INT , @idUsuario INT

	DECLARE @idDocumento INT ,@fechaEmision DATETIME ,@codDoc AS VARCHAR(2) ,@idArticulo INT

    DECLARE @idTipoDocumentoIv INT

    --> Data Principal
    DECLARE @idTransaccionOriginal INT ,@idTransaccion INT ,@serieComprobante VARCHAR(25)

    --> Compra
    DECLARE @idPuntoEmision INT

	BEGIN TRY
		--> variables 
		SELECT TOP 1 @idDocumento = idDocumento, @idArticulo = idArticulo FROM Recepcion.DocumentoDetalle WITH (NOLOCK) WHERE idDocumentoDetalle = @id

        SELECT TOP 1 @codDoc = CASE WHEN codDoc = '01' THEN 'FE' WHEN codDoc = '04' THEN 'NC' END , @fechaEmision = cast(fechaEmision as date) FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento

		SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

        SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WHERE codigo = 'AD'

        SELECT TOP 1 @idPuntoEmision = pa.idPuntoEmision
        FROM Config.PtoEmi_Asig      pa 
        INNER JOIN Config.Estab_Asig ae ON ae.idEstab_Asig = pa.idEstab_Asig
        WHERE pa.predeterminado = 1
          AND ae.idUsuarioRol = @idUsuarioRol

        SELECT TOP 1 @idTransaccion = idTransaccion
        FROM Inventario.Transaccion           tr
        INNER JOIN Inventario.TipoDocumento   td ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idDocumento = @idDocumento
            AND td.codigo = @codDoc
            AND tt.codigo = 'E'

        SELECT TOP 1 @serieComprobante  = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM ConfiguracionDocumento    cd
        INNER JOIN dbo.TipoDocumento   td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE cd.idPuntoEmision = @idPuntoEmision
          AND td.codigo = 'AD'

        IF EXISTS (SELECT 1 FROM Inventario.Transaccion WHERE idTransaccionOriginal = @idTransaccion)
            BEGIN
                SELECT TOP 1 @idTransaccionOriginal = MAX(idTransaccion) FROM Inventario.Transaccion WHERE idTransaccionOriginal = @idTransaccion
            END
        ELSE
            BEGIN
                SET @idTransaccionOriginal = @idTransaccion
            END 

        IF NOT EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
			BEGIN
				SELECT '0'code,'Tu empresa no lleva Inventario' as 'message'
				RETURN 
			END 

		BEGIN TRAN

			DELETE FROM Recepcion.Doc_Detalle_Impuesto WHERE idDocumentoDetalle = @id

            IF EXISTS (SELECT 1 FROM Recepcion.DocumentoDetalle t INNER JOIN Articulo a WITH(NOLOCK) ON t.idArticulo = a.idArticulo WHERE t.idDocumento = @idDocumento  AND a.llevaInventario = 1)
				BEGIN
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
                      AND idArticulo = @idArticulo

                    UPDATE cd SET cd.ultimaSecuencia = cd.ultimaSecuencia + 1
                    FROM ConfiguracionDocumento cd
                    INNER JOIN TipoDocumento    td ON td.idTipoDocumento = cd.idTipoDocumento 
                    WHERE td.codigo = 'AD'
                      AND cd.idPuntoEmision = @idPuntoEmision

                    --> Transaccion
                    EXEC dbo.Transaccion_Handler_Init @idTransaccion
				END 
					
                DELETE FROM Recepcion.DocumentoDetalle WHERE idDocumentoDetalle = @id

                IF NOT EXISTS(SELECT 1 FROM Recepcion.DocumentoDetalle WHERE idDocumento = @idDocumento)
				    BEGIN
					    UPDATE Recepcion.DocumentoRecibido SET complete = 0 WHERE idDocumento = @idDocumento
				    END
		COMMIT TRAN
		SELECT '1' code, 'Articulo eliminado exitosamente del stock' as 'message'
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
