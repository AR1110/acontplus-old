USE [Acontplus]
GO
/****** Object:  StoredProcedure [Inventario].[Consolidacion_Update]    Script Date: 9/15/2025 9:09:11 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [Inventario].[Consolidacion_Update] @userRoleId INT ,@id INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	--> Global
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) 
    
    --> Data Json
    DECLARE @detalles VARCHAR(MAX)

    --> Consolidacion
    DECLARE @fechaEmision DATETIME2 ,@idEstadoDocumento INT ,@idEstadoDocumentoAnulado INT ,@idPuntoEmision INT 

    --> Transaccion 
    DECLARE @idTipoTransaccion  INT ,@idTipoDocumento INT ,@idTransaccionOriginal INT ,@codDoc VARCHAR(50) ,@idTransaccion INT ,@serieComprobante VARCHAR(25) ,@idTipoDocumentoIv INT

    DECLARE @tblDetails AS TABLE (
         orderIndex INT NOT NULL
        ,idArticulo INT NOT NULL
        ,idBodega INT NOT NULL
        ,idMedida INT NULL
        ,cantidad NUMERIC (18,5) NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,precioUnitario NUMERIC (18,5) NOT NULL
        ,precioCosto NUMERIC (18,5) NOT NULL
        ,total NUMERIC (18,5) NOT NULL
        ,nota VARCHAR(100) NULL
        ,descripcion VARCHAR(255) NULL 
        ,estado BIT NOT NULL
        ,conversion NUMERIC(15,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(15,5) NOT NULL
	)

	BEGIN TRY
        --> Global 
        SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data json
		SELECT @detalles      = detalles 
        FROM OPENJSON (@json) WITH 
        (
            detalles      NVARCHAR(MAX) AS JSON
        )

		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,estado,conversion,precioCostoFraccionado)
		SELECT orderIndex,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,estado,conversion,precioCostoFraccionado 
		FROM OPENJSON (@detalles) WITH 
        (
			 orderIndex                       INT            
			,idArticulo                       INT           
			,idBodega                         INT           
			,idMedida                         INT           
			,cantidad                         NUMERIC(15,5) 
			,cantidadTransaccion              NUMERIC(15,5) 
			,precioUnitario                   NUMERIC(15,5) 
			,precioCosto                      NUMERIC(15,5) 
			,total                            NUMERIC(15,5) 
			,nota                             NVARCHAR(100) 
			,descripcion                      NVARCHAR(255)
            ,conversion                       NUMERIC(15,5)
            ,precioCostoFraccionado           NUMERIC(15,5)
            ,estado                           BIT 
		)
        
        --> Variables
        SELECT TOP 1 @idEstadoDocumentoAnulado = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'A'

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento ,@idPuntoEmision = idPuntoEmision FROM dbo.ConsolidacionInventario WITH (NOLOCK) WHERE idConsolidacionInventario =  @id

        SELECT TOP 1 @idTransaccionOriginal = idTransaccion FROM Inventario.Transaccion WHERE idDocumento = @id AND idTipoDocumento = @idTipoDocumento

        SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WHERE codigo = 'AD'

        SELECT TOP 1 @codDoc = td.codigo
        FROM Inventario.Transaccion           tr WITH (NOLOCK) 
        INNER JOIN Inventario.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = tr.idTipoDocumento
        INNER JOIN Inventario.TipoTransaccion tt WITH (NOLOCK) ON tt.idTipoTransaccion = tr.idTipoTransaccion
        WHERE tr.idTransaccion = @idTransaccionOriginal

	    SELECT TOP 1 @idEstadoDocumento = idEstadoDocumento ,@fechaEmision = fechaEmision FROM ConsolidacionInventario WITH (NOLOCK) WHERE idConsolidacionInventario = @id

        SELECT TOP 1 @serieComprobante  = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
        FROM ConfiguracionDocumento    cd
        INNER JOIN dbo.TipoDocumento   td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision    pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento es ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE cd.idPuntoEmision = @idPuntoEmision
          AND td.codigo = 'AD'

        --> Validacion de informacion

        IF (SELECT COUNT(*) FROM @tblDetails) = 0 
            BEGIN
                SELECT '0'code, 'Error en los detalles'[message]
                RETURN
            END

	    IF (SELECT TOP 1 codigo FROM dbo.EstadoPago WHERE idEstadoPago = @idEstadoDocumento) = 'A'
            BEGIN
                SELECT '0'code, 'El Documento se encuentra Anulado'[message]
                RETURN
            END

        IF @codDoc = 'CI'
            BEGIN
                SELECT '0'code, 'No puedes anular consolidaciones es un documento de ajuste' as [message]
                RETURN
            END

        IF @idTransaccionOriginal IS NULL
            BEGIN
                SELECT  '0'code,'La Transaccion tiene error de origen'[message]
				RETURN 
            END

		BEGIN TRAN 
            --> Comprobante
			UPDATE ConsolidacionInventario SET idEstadoDocumento = @idEstadoDocumentoAnulado,lastChange = dbo.ufnGetDateEcuador(),idUserUpdate = @idUsuario WHERE idConsolidacionInventario = @id

            --> Transaccion
            INSERT INTO Inventario.Transaccion
                  (idTipoTransaccion,fechaEmision,idTipoDocumento,idUsuario,idEntidad,serieComprobante,idTransaccionOriginal)
            SELECT idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idUsuario,@idEntidad,@serieComprobante,@idTransaccionOriginal
            FROM Inventario.Transaccion
            WHERE idTransaccion = @idTransaccionOriginal

            SET @idTransaccion = SCOPE_IDENTITY()

            INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                   (idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total
            FROM @tblDetails

            UPDATE cd SET cd.ultimaSecuencia = cd.ultimaSecuencia + 1
            FROM ConfiguracionDocumento cd
            INNER JOIN TipoDocumento    td ON td.idTipoDocumento = cd.idTipoDocumento 
            WHERE td.codigo = 'AD'
                AND cd.idPuntoEmision = @idPuntoEmision

            --> Transaccion
            EXEC dbo.Transaccion_Handler_Init @idTransaccion
		COMMIT TRAN 
		SELECT '1'code, 'Actualizado Correctamente'[message],@payload as payload
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Consolidacion/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
       
        SELECT '0'code, 'Info: Error en el procedimiento'[message]
	END CATCH 
END
