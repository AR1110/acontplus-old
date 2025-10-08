USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Inventario].[TransferenciaBodega_Insert]    Script Date: 12/9/2022 11:56:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.TransferenciaBodega_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT ,@idTransferenciaBodega INT ,@idTipoDocumentoIv INT ,@idTipoTransaccion INT

    --> Data Json
    DECLARE @comprobante NVARCHAR(MAX) ,@detalles NVARCHAR(MAX) ,@transaccion VARCHAR(MAX) ,@transaccionDetalle NVARCHAR(MAX)
    
    --> Transferencia
	DECLARE @secuencial INT ,@idEstadoDocumento INT ,@idPuntoEmision INT ,@fechaEmision DATETIME2 ,@idTransaccion INT
	
    --> Transaccion 
    DECLARE @serieComprobante VARCHAR(30)

    DECLARE @tbTranferencia TABLE (
        idPuntoEmision INT NOT NULL
	   ,idBodegaOrigen INT NOT NULL
	   ,idBodegaDestino INT NOT NULL
	   ,fechaEmision DATETIME2 NOT NULL
	   ,observacion VARCHAR(300) NULL
	   ,total NUMERIC(18,5) NOT NULL
    )

	DECLARE @tblDetails AS TABLE (
         orderIndex INT NOT NULL
        ,idArticulo INT NOT NULL
	    ,idMedida INT NOT NULL
	    ,cantidad NUMERIC(18,5) NOT NULL
	    ,descripcion VARCHAR(300) NOT NULL
	    ,precioCosto NUMERIC(15,5) NOT NULL
	    ,total NUMERIC(18,5) NOT NULL
	)

    DECLARE @tbTransaccion AS TABLE(
        idTipoTransaccion INT NOT NULL
       ,idTipoDocumento INT NOT NULL
       ,fechaEmision DATETIME NOT NULL
    )

    DECLARE @tbTransaccionDetalle AS TABLE(
        idTipoTransaccion INT NOT NULL
       ,idTipoDocumento INT NOT NULL 
       ,idArticulo INT NOT NULL
       ,idBodega INT NOT NULL
       ,idMedida INT NOT NULL
       ,cantidad NUMERIC(18,5) NOT NULL 
       ,cantidadTransaccion NUMERIC(18,5) NOT NULL
       ,precioUnitario NUMERIC(18,5) NOT NULL
       ,precioCosto NUMERIC(18,5) NOT NULL
       ,conversion NUMERIC(15,5) NOT NULL
       ,precioCostoFraccionado NUMERIC(15,5) NOT NULL
       ,total NUMERIC(18,5) NOT NULL
    )

	BEGIN TRY
        
        --> Global 
        SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @comprobante        = comprobante
              ,@detalles           = detalles
              ,@transaccion        = transaccion
              ,@transaccionDetalle = transaccionDetalle
        FROM OPENJSON(@json) WITH 
        (
             comprobante        NVARCHAR(MAX) as json
            ,detalles           NVARCHAR(MAX) as json 
            ,transaccion        NVARCHAR(MAX) as json
            ,transaccionDetalle NVARCHAR(MAX) as json
            
        )


        INSERT INTO @tbTranferencia 
              (idPuntoEmision,idBodegaOrigen,idBodegaDestino,fechaEmision,observacion,total)
        SELECT idPuntoEmision,idBodegaOrigen,idBodegaDestino,fechaEmision,observacion,total 
        FROM OPENJSON(@comprobante) WITH 
        (
            idPuntoEmision  INT
	       ,idBodegaOrigen  INT
	       ,idBodegaDestino INT
	       ,fechaEmision    DATETIME2
	       ,observacion     VARCHAR(300)
	       ,total           NUMERIC(18,5)
        )

		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idMedida,cantidad,descripcion,precioCosto,total)
		SELECT orderIndex,idArticulo,idMedida,cantidad,descripcion,precioCosto,total
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex  INT 
            ,idArticulo  INT 
		    ,idMedida    INT 
		    ,cantidad    NUMERIC(15,5) 
            ,descripcion VARCHAR(300)
		    ,precioCosto NUMERIC(15,5) 
		    ,total       NUMERIC(18,5)
		)

        INSERT INTO @tbTransaccion
              (idTipoTransaccion,fechaEmision,idTipoDocumento)
        SELECT idTipoTransaccion,fechaEmision,idTipoDocumento 
        FROM OPENJSON(@transaccion) WITH 
        (
            idTipoTransaccion INT 
           ,idTipoDocumento   INT
           ,fechaEmision      DATETIME2
        )

        INSERT INTO @tbTransaccionDetalle 
              (idTipoTransaccion,idTipoDocumento,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,conversion,precioCostoFraccionado)
        SELECT idTipoTransaccion,idTipoDocumento,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,conversion,precioCostoFraccionado
        FROM OPENJSON(@transaccionDetalle) WITH 
        (
             idTipoTransaccion      INT 
            ,idTipoDocumento        INT 
            ,idArticulo             INT 
            ,idBodega               INT 
            ,idMedida               INT 
            ,cantidad               NUMERIC(18,5)  
            ,cantidadTransaccion    NUMERIC(18,5) 
            ,precioUnitario         NUMERIC(18,5) 
            ,precioCosto            NUMERIC(18,5) 
            ,total                  NUMERIC(18,5)
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
        )

		
        --> Recuperando Datos
        SELECT TOP 1 @idPuntoEmision = idPuntoEmision, @fechaEmision = fechaEmision FROM @tbTranferencia 

		SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'AC'

		SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'TRA'

        SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'TB'

        SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WHERE codigo = 'S'

		SELECT TOP 1 @secuencial = ultimaSecuencia FROM dbo.ConfiguracionDocumento WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

        SELECT TOP 1 @serieComprobante = es.estab + '-' + pe.ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial) 
        FROM dbo.PuntoEmision          pe WITH (NOLOCK)
        INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE pe.idPuntoEmision = @idPuntoEmision

        --> Validacion de informacion
        IF (SELECT COUNT(*) FROM @tbTranferencia) = 0 
            BEGIN
                SELECT '0'code,'Error en el comprobante'[message]
                RETURN
            END 

        IF (SELECT COUNT(*) FROM @tblDetails) = 0 
            BEGIN
                SELECT '0'code,'Error en los detalles'[message]
                RETURN
            END
           
        IF (SELECT COUNT(*) FROM @tbTransaccion) = 0 
            BEGIN
                SELECT '0'code,'Error en la transaccion'[message]
                RETURN
            END

        IF (SELECT COUNT(*) FROM @tbTransaccionDetalle) = 0 
            BEGIN
                SELECT '0'code,'Error en la transaccion Detalle'[message]
                RETURN
            END


		IF NOT EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
			BEGIN
				SELECT '0'code,'Tu empresa no lleva inventario este documento esta desabilitado.'[message]
				RETURN
			END 

		IF @secuencial IS NULL
			BEGIN
				SELECT '0'code,'El secuencial no se encuentra registrado '[message]
				RETURN
			END 

		BEGIN TRAN 
            
            --> Comprobante
			INSERT INTO TransferenciaBodega
			      (idPuntoEmision,idTipoDocumento,idBodegaOrigen,idBodegaDestino,idEstadoDocumento,idEntidad,idUsuario,nroDoc,fechaEmision,observacion,total)
			SELECT idPuntoEmision,@idTipoDocumento,idBodegaOrigen,idBodegaDestino,@idEstadoDocumento,@idEntidad,@idUsuario,@secuencial,fechaEmision,observacion,total
			FROM @tbTranferencia

			SET @idTransferenciaBodega = SCOPE_IDENTITY()

            --> Detalle
			INSERT INTO TransferenciaBodegaDetalle
				   (idTransferenciaBodega,idArticulo,idMedida,cantidad,descripcion,precioCosto,total)
			SELECT @idTransferenciaBodega,idArticulo,idMedida,cantidad,descripcion,precioCosto,total
			FROM @tblDetails
            ORDER BY orderIndex ASC

            --> Transaccion
            INSERT INTO Inventario.Transaccion
                  (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,idUsuario,idEntidad,serieComprobante)
            SELECT TOP 1 @idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idTransferenciaBodega,@idUsuario,@idEntidad,@serieComprobante 
            FROM @tbTransaccion 

            SET @idTransaccion = SCOPE_IDENTITY()

            INSERT INTO Inventario.TransaccionDetalle 
                   (idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total)
			SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion * IIF(tt.codigo = 'S',-1,1) ,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total 
            FROM @tbTransaccionDetalle            td
            INNER JOIN Inventario.TipoTransaccion tt ON tt.idTipoTransaccion = td.idTipoTransaccion

			UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

            EXEC dbo.Transaccion_Handler_Init @idTransaccion

		COMMIT TRAN
		SELECT  '1'code,'Registrado Correctamente '[message],@payload as payload
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Transferencia/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
       
        SELECT  '0'code,'Info: Error en el procedimiento'[message]
	END CATCH 
END
