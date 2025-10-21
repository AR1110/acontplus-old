USE [Acontplus]
GO
/****** Object:  StoredProcedure [Inventario].[Consolidacion_Insert]    Script Date: 9/15/2025 9:06:28 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE [Inventario].[Consolidacion_Insert] @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idConsolidacionInventario INT 

	--> Data Json
    DECLARE @consolidacion VARCHAR(MAX) ,@detalles VARCHAR(MAX) 

    --> Consolidacion
    DECLARE @idPuntoEmision INT ,@fechaEmision DATETIME2 ,@total NUMERIC(15,5) ,@observacion VARCHAR(150) ,@idEstadoDocumento INT ,@secuencial INT
    
    --> Transaccion 
    DECLARE @idTipoTransaccion  INT ,@idTipoDocumento INT ,@idTransaccion INT ,@serieComprobante VARCHAR(30) ,@codDoc VARCHAR(50) ,@codTran VARCHAR(50) ,@valor INT = 1

    DECLARE @fechaRegistro DATETIME2 = GETDATE()
	
    DECLARE @tbComprobante AS TABLE(
         idPuntoEmision INT NOT NULL
        ,idTipoDocumento INT NOT NULL
        ,idTipoTransaccion INT NOT NULL
        ,fechaEmision DATETIME2 NOT NULL
        ,observacion VARCHAR(300) NULL
        ,total NUMERIC(18,5) NOT NULL
        ,fechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE()
        
    )

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
        ,descripcion VARCHAR(255) NOT NULL 
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
        ,uniqueId VARCHAR(100) NULL
	)

	BEGIN TRY
	    
        --> Global 
        SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data json
		SELECT @consolidacion = consolidacion
              ,@detalles      = detalles 
        FROM OPENJSON (@json) WITH 
        (
            consolidacion NVARCHAR(MAX) AS JSON
           ,detalles      NVARCHAR(MAX) AS JSON
        )

        
        INSERT INTO @tbComprobante 
              (idPuntoEmision,idTipoDocumento,idTipoTransaccion,fechaEmision,total,observacion)
		SELECT idPuntoEmision,idTipoDocumento,idTipoTransaccion,fechaEmision,total,observacion
		FROM OPENJSON (@consolidacion) WITH 
        (
		     idPuntoEmision    INT 
		    ,idTipoDocumento   INT
            ,idTipoTransaccion INT
            ,fechaEmision      DATETIME2 
		    ,total             NUMERIC(18,5) 
		    ,observacion       VARCHAR(150) 
		)

		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,conversion,precioCostoFraccionado,uniqueId)
		SELECT orderIndex,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,total,nota,descripcion,conversion,precioCostoFraccionado,uniqueId
		
		
		FROM OPENJSON (@detalles) WITH 
        (
			 orderIndex             INT            
			,idArticulo             INT           
			,idBodega               INT           
			,idMedida               INT           
			,cantidad               NUMERIC(18,5) 
			,cantidadTransaccion    NUMERIC(18,5)  
			,precioUnitario         VARCHAR(30)
            ,precioCosto            VARCHAR(30) 
            ,precioCostoFraccionado VARCHAR(30)
			,total                  NUMERIC(18,5) 
			,nota                   VARCHAR(100) 
			,descripcion            VARCHAR(255)  
            ,conversion             NUMERIC(18,5)
            ,uniqueId               VARCHAR(100)
		)
	
        
        --> Variables
        SELECT TOP 1 @fechaEmision      = fechaEmision 
                    ,@idPuntoEmision    = idPuntoEmision 
                    ,@idTipoDocumento   = idTipoDocumento
                    ,@idTipoTransaccion = idTipoTransaccion
        FROM @tbComprobante

        SELECT TOP 1 @codDoc = codigo FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento

        SELECT TOP 1 @codTran = codigo FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE idTipoTransaccion = @idTipoTransaccion

		SELECT TOP 1 @idEstadoDocumento = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'AC'

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WHERE codigo = 'CIV'

		SELECT TOP 1 @secuencial = ultimaSecuencia FROM dbo.ConfiguracionDocumento WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

        SELECT TOP 1 @serieComprobante = es.estab + '-' + pe.ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial) 
        FROM dbo.PuntoEmision          pe WITH (NOLOCK)
        INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE pe.idPuntoEmision = @idPuntoEmision

        IF @codTran = 'S'
            BEGIN
                SET @valor = -1
            END

        IF @codDoc = 'A'
            BEGIN
                SET @fechaRegistro = @fechaEmision
            END

        --> Validacion de informacion
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SELECT '0'code,'Error en el comprobante'[message]
                RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails)
            BEGIN
                SELECT '0'code,'Error en los detalles'[message]
                RETURN
            END

		IF NOT EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
			BEGIN
				SELECT '0'code,'Tu empresa no lleva inventario este documento esta desabilitado.'[message]
				RETURN
			END 
	
		IF @secuencial IS NULL
			BEGIN
				SELECT '0'code,'No existe una configuracion de secuencial para este Punto de Emision'[message]
				RETURN
			END 

		BEGIN TRAN 
            
            --> Comprobante
			INSERT INTO dbo.ConsolidacionInventario
				   (idPuntoEmision,nroDoc,idTipoDocumento,idEstadoDocumento,fechaEmision,idUsuario,idEntidad,observacion,total,fechaRegistro)
			SELECT @idPuntoEmision,@secuencial,idTipoDocumento,@idEstadoDocumento,fechaEmision,@idUsuario,@idEntidad,observacion,total,fechaRegistro
            FROM @tbComprobante

			SET @idConsolidacionInventario = @@IDENTITY 

            --> Detalles
			INSERT INTO dbo.ConsolidacionInventarioDetalle
				   (idConsolidacionInventario,idArticulo,idBodega,idMedida,cantidad,descripcion,precioCosto,uniqueId,precioActual)
			SELECT @idConsolidacionInventario,idArticulo,idBodega,idMedida,cantidad,descripcion,precioCosto,uniqueId,precioUnitario
			FROM @tblDetails 
            ORDER BY orderIndex ASC

            --> Transaccion
            INSERT INTO Inventario.Transaccion
                   (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,idUsuario,idEntidad,serieComprobante,fechaRegistro)
            SELECT  idTipoTransaccion,fechaEmision,idTipoDocumento,@idConsolidacionInventario,@idUsuario,@idEntidad,@serieComprobante,@fechaRegistro
            FROM @tbComprobante 

            SET @idTransaccion = SCOPE_IDENTITY()

            INSERT INTO Inventario.TransaccionDetalle WITH(ROWLOCK)
				   (idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioCosto,precioCostoFraccionado,precioUnitario,total)
			SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion * @valor,precioCosto,precioCostoFraccionado,precioUnitario,total
            FROM @tblDetails

			UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento
			
            EXEC dbo.Transaccion_Handler_Init @idTransaccion

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente'[message],@payload as payload
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Consolidacion/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
        
        SELECT '0'code,'Info: Error en el procedimiento'[message]
	END CATCH 
END
