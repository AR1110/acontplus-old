USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Logistica].[GuiaRemision_Update]    Script Date: 2/2/2023 8:54:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE FactElect.UpdateGuiaRemision
     @userRoleId INT
    ,@id INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Json
    DECLARE @infoGuiaRemision VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) 

    DECLARE @tbGuia AS TABLE
    (
        id INT NOT NULL UNIQUE
       ,idCliente INT NOT NULL
       ,idTransportista INT NOT NULL
       ,idVehiculo INT NOT NULL
       ,idEmpleado INT NULL
       ,idFactura INT NULL
       ,fechaEmision DATETIME2 NOT NULL
       ,fechaInicio DATETIME2 NOT NULL
       ,fechaFin DATETIME2 NOT NULL
       ,docAduanero VARCHAR(100) NULL
       ,ptoPartida VARCHAR(150) NOT NULL
       ,ptoLlegada VARCHAR(150) NOT NULL
       ,ruta VARCHAR(100) NULL
       ,estableDestino VARCHAR(5) NULL
       ,entregar VARCHAR(150) NULL
       ,motivo VARCHAR(300) NULL
    )

    DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idGuiaRemisionDetalle INT NOT NULL
        ,idArticulo INT NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,descripcion VARCHAR(255) NOT NULL
        ,estado BIT NOT NULL
	)

    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	BEGIN TRY 
        --> Informacion General
        SELECT TOP 1 @idUsuario = idUsuario ,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @infoGuiaRemision = infoGuiaRemision
              ,@detalles         = detalles
              ,@infoAdicional    = infoAdicional
        FROM OPENJSON(@json) WITH 
        (
             infoGuiaRemision NVARCHAR(MAX) as json
            ,detalles         NVARCHAR(MAX) as json 
            ,infoAdicional    NVARCHAR(MAX) as json
        )

        INSERT INTO @tbGuia 
               (id,idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,fechaEmision,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo)
        SELECT @id,idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,fechaEmision,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo
        FROM OPENJSON(@infoGuiaRemision) WITH 
        (
            idCliente       INT 
           ,idTransportista INT 
           ,idVehiculo      INT 
           ,idEmpleado      INT 
           ,idFactura       INT 
           ,fechaEmision    DATETIME2 
           ,fechaInicio     DATETIME2 
           ,fechaFin        DATETIME2 
           ,docAduanero     VARCHAR(100) 
           ,ptoPartida      VARCHAR(150) 
           ,ptoLlegada      VARCHAR(150) 
           ,ruta            VARCHAR(100) 
           ,estableDestino  VARCHAR(5) 
           ,entregar        VARCHAR(150)
           ,motivo          VARCHAR(300)
        )


        INSERT INTO @tblDetails
              (orderIndex,idGuiaRemisionDetalle,idArticulo,cantidad,descripcion,estado)
		SELECT orderIndex,idGuiaRemisionDetalle,idArticulo,cantidad,descripcion,estado 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex            INT 
		    ,idGuiaRemisionDetalle INT
            ,idArticulo            INT 
		    ,cantidad              NUMERIC(15,5) 
		    ,descripcion           VARCHAR(255)
            ,estado                BIT
		    
		)

        INSERT INTO @tblInfoAdicional 
              (nombre,valor) 
        SELECT nombre,valor 
        FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre VARCHAR(300)
           ,valor VARCHAR(300)
        )
	    
        --> Recuperando Informacion en las variables
        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'GR'

	    --> Validacion de informacion
        IF NOT EXISTS(SELECT 1 FROM @tbGuia) 
            BEGIN
                SET @message = 'Error en la info GuiaRemision';
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SET @message = 'Error en los detalles';
            END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END

		--> Transaccion Principal.
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            --> InfoGuiaRemision
			UPDATE gr SET 
				   gr.idCliente       = jgr.idCliente
				  ,gr.idTransportista = jgr.idTransportista
				  ,gr.idVehiculo      = jgr.idVehiculo
				  ,gr.idEmpleado      = jgr.idEmpleado
				  ,gr.fechaInicio     = jgr.fechaInicio
				  ,gr.fechaFin        = jgr.fechaFin
				  ,gr.docAduanero     = jgr.docAduanero
				  ,gr.ptoPartida      = jgr.ptoPartida
				  ,gr.ptoLlegada      = jgr.ptoLlegada
				  ,gr.ruta            = jgr.ruta
				  ,gr.estableDestino  = jgr.estableDestino
				  ,gr.entregar        = jgr.entregar
				  ,gr.motivo          = jgr.motivo
                  ,gr.lastChange      = GETDATE()
			FROM GuiaRemision   gr WITH (ROWLOCK)
			INNER JOIN @tbGuia jgr ON gr.idGuiaRemision = jgr.id 

            --> Detalles
			UPDATE grd SET 
				   grd.cantidad    = jgr.cantidad
			      ,grd.descripcion = jgr.descripcion
			      ,grd.estado      = jgr.estado
			FROM GuiaRemisionDetalle grd WITH (ROWLOCK)
			INNER JOIN @tblDetails   jgr ON grd.idGuiaRemisionDetalle = jgr.idGuiaRemisionDetalle

            INSERT INTO GuiaRemisionDetalle WITH (ROWLOCK)
                   (idGuiaRemision,idArticulo,cantidad,descripcion)
	        SELECT @id            ,idArticulo,cantidad,descripcion FROM	@tblDetails
			WHERE idGuiaRemisionDetalle = 0
            ORDER BY orderIndex ASC

			--> informacion Adicional
			UPDATE dbo.InfoAdicionalDoc WITH (ROWLOCK) SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc 
                   (idComprobante,idTipoDocumento,nombre,valor) 
            SELECT @id          ,@idTipoDocumento,nombre,valor 
            FROM @tblInfoAdicional
			
		IF (@@ROWCOUNT > 0)
			    BEGIN
				    SET @code = '0';
				    SET @message = 'Actulizado Exitosamente';
			    END
		    ELSE
			    BEGIN
				    SET @code = '50001';
				    SET @errorCode = 5001
                    SET @errorMessage = 'No se pudo Actualizar'
				    SET @message = @errorMessage;
			    END
 
	    IF (@startedTransaction = 1)
		    BEGIN
			    COMMIT;
			    SELECT @code as code, @message as 'message';
		    END
	END TRY 

	BEGIN CATCH 
		IF @startedTransaction = 1 
            BEGIN
                ROLLBACK TRANSACTION;
                -- Log error details
                INSERT INTO dbo.ErroresSistema
                (
                    [method]
                   ,[errorNumber]
                   ,[errorSeverity]
                   ,[errorState]
                   ,[errorProcedure]
                   ,[errorLine]
                   ,[errorMessage]
                   ,[idUsuario]
                )
                VALUES
                (
                    'GuiaRemision/Update'
                   ,ERROR_NUMBER()
                   ,ERROR_SEVERITY()
                   ,ERROR_STATE()
                   ,ERROR_PROCEDURE()
                   ,ERROR_LINE()
                   ,ERROR_MESSAGE()
                   ,@idUsuario
                );

                SELECT '50001' Code, 'Error en el procedimiento: ' as Message;
				THROW;
            END
        ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE()
			END
	END CATCH 

END
