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

    --> Inventario
    DECLARE @idTransaccionOriginal INT ,@idTransaccion INT ,@serieComprobante VARCHAR(25) ,@idTipoDocumento INT

    --> Compra
    DECLARE @idPuntoEmision INT ,@idEstadoPago INT ,@claveAcceso VARCHAR(50)

    --> Tables
    DECLARE @Transaccion AS TABLE
    (
       fechaEmision DATETIME2
      ,idTipoTransaccion INT NOT NULL
      ,idTipoDocumento INT NOT NULL
      ,idUsuario INT NOT NULL
      ,idEntidad INT NOT NULL
      ,serieComprobante NVARCHAR(50)
      ,idTransaccionOriginal INT NOT NULL 
    )

    DECLARE @TransaccionDetalle AS TABLE
    (
        idArticulo INT NOT NULL
       ,idBodega INT NOT NULL
       ,idMedida INT NOT NULL
       ,idTarifa INT  NULL
       ,cantidad NUMERIC(18,5) NOT NULL
       ,conversion NUMERIC(18,5) NOT NULL
       ,cantidadTransaccion NUMERIC(18,5) NOT NULL
       ,precioUnitario NUMERIC(18,5) NOT NULL
       ,precioCosto NUMERIC(18,5) NOT NULL
       ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
       ,total NUMERIC(18,5) NOT NULL
    )

	BEGIN TRY
        --> Recuperanado informacion
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol

        SELECT TOP 1 @codDoc = codDoc ,@claveAcceso = claveAcceso  FROM Recepcion.DocumentoRecibido WHERE idDocumento = @id

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM Inventario.TipoDocumento WHERE codigo = 'AD'

        SELECT TOP 1 @idTransaccionOriginal = idTransaccion
        FROM Inventario.Transaccion           tr
        INNER JOIN Inventario.TipoDocumento   td ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idDocumento = @id
            AND td.codigo = CASE @codDoc WHEN '01' THEN 'FE' WHEN '04' THEN 'NC' END 
            AND tt.codigo = 'E'

        SELECT TOP 1 @idPuntoEmision = pa.idPuntoEmision
        FROM Config.PtoEmi_Asig      pa 
        INNER JOIN Config.Estab_Asig ae ON ae.idEstab_Asig = pa.idEstab_Asig
        WHERE pa.predeterminado = 1
            AND ae.idUsuarioRol = @idUsuarioRol

        SELECT TOP 1 @serieComprobante  = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM ConfiguracionDocumento    cd
        INNER JOIN dbo.TipoDocumento   td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE cd.idPuntoEmision = @idPuntoEmision
            AND td.codigo = 'AD'

        --> Tablas Temporales
        INSERT INTO @Transaccion
              (idTipoTransaccion,fechaEmision ,idTipoDocumento ,idUsuario ,idEntidad ,serieComprobante ,idTransaccionOriginal)
        SELECT idTipoTransaccion,fechaEmision,@idTipoDocumento,@idUsuario,@idEntidad,@serieComprobante,@idTransaccionOriginal
        FROM Inventario.Transaccion
        WHERE idTransaccion = @idTransaccionOriginal

        INSERT INTO @TransaccionDetalle
              (idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion     ,precioUnitario,precioCosto,precioCostoFraccionado,total)
		SELECT idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion * -1,precioUnitario,precioCosto,precioCostoFraccionado,total
        FROM Inventario.TransaccionDetalle
        WHERE idTransaccion = @idTransaccionOriginal

        --> Validaciones
        IF NOT EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
            BEGIN
                SELECT '0'code,'Esta Empresa no lleva inventario, este proceso no esta permitido'[message]
                RETURN 
            END

        IF NOT EXISTS (SELECT 1 FROM @Transaccion)
            BEGIN
                SELECT '0'code,'Error en la informacion Transacción-Comprobante' as [message]
                RETURN 
            END

        IF NOT EXISTS (SELECT 1 FROM @TransaccionDetalle)
            BEGIN
                SELECT '0'code,'Error en la informacion Transacción-Detalle' as [message]
                RETURN 
            END

        IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE idDocumento = @id AND estado = 0)
            BEGIN
                SELECT '0'code,'Este documento ya se encuntra anulado.'[message]
                RETURN 
            END

        IF @codDoc NOT IN ('01','04')
            BEGIN
                SELECT '0'code,'Este documento no lleva inventario.'[message]
                RETURN 
            END

        IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE complete = 0 AND idDocumento = @id)
            BEGIN
                SELECT '0' code, 'Esta Documento no tiene inventario, proceso no permitido' as 'message'
				RETURN
            END

        IF EXISTS (SELECT 1 FROM Recepcion.DocumentoRecibido WHERE inventarioAnulado = 1 AND idDocumento = @id)
            BEGIN
                SELECT '0' code, 'Esta Documento ya fue anulado su inventario' as 'message'
				RETURN
            END

		BEGIN TRAN 
            INSERT INTO Inventario.Transaccion
                  (idTipoTransaccion,fechaEmision,idTipoDocumento,idUsuario,idEntidad,serieComprobante,idTransaccionOriginal)
            SELECT idTipoTransaccion,fechaEmision,idTipoDocumento,idUsuario,idEntidad,serieComprobante,idTransaccionOriginal
            FROM @Transaccion

            SET @idTransaccion = SCOPE_IDENTITY()

            INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                   (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
		    SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total
            FROM @TransaccionDetalle

            --> Transaccion
            EXEC dbo.Transaccion_Handler_Init @idTransaccion

            UPDATE cd SET cd.ultimaSecuencia = cd.ultimaSecuencia + 1
            FROM ConfiguracionDocumento cd
            INNER JOIN TipoDocumento    td ON td.idTipoDocumento = cd.idTipoDocumento 
            WHERE td.codigo = 'AD'
              AND cd.idPuntoEmision = @idPuntoEmision

            UPDATE Recepcion.DocumentoRecibido SET inventarioAnulado = 1, fechaAnulacion = GETDATE() ,idUsuarioAnulacion = @idUsuario WHERE idDocumento = @id

		COMMIT TRAN
		SELECT '1' code, 'Inventario registrado Correctante' as 'message'
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
