USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Logistica].[GuiaRemision_Insert]    Script Date: 12/8/2022 12:21:06 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2022-02-21
-- Description:	SP para insertar las guias de remision
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.InsertGuiaRemision
     @userRoleId INT
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
	DECLARE @idUsuario INT,@idEntidad INT,@idGuiaRemision  INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Data Json
    DECLARE @infoGuiaRemision VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) 


    DECLARE @tbGuia AS TABLE(
        idCliente INT NOT NULL
       ,idDocumentoElectronico INT NOT NULL
       ,idTransportista INT NOT NULL
       ,idVehiculo INT NOT NULL
       ,idEmpleado INT NULL
       ,idFactura INT NULL
       ,idNotaEntrega INT NULL
       ,idAprob_Document INT NULL
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
		,idArticulo INT NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,descripcion VARCHAR(255) NOT NULL
	)

    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)
    

	BEGIN TRY 
        --> Informacion General
		SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

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
              (idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,idNotaEntrega,idAprob_Document,fechaEmision,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo)
        SELECT idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,idNotaEntrega,idAprob_Document,fechaEmision,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo
        FROM OPENJSON(@infoGuiaRemision) WITH 
        (
            idCliente        INT 
           ,idTransportista  INT 
           ,idVehiculo       INT 
           ,idEmpleado       INT 
           ,idFactura        INT 
           ,idNotaEntrega    INT
           ,idAprob_Document INT
           ,fechaEmision     DATETIME2 
           ,fechaInicio      DATETIME2 
           ,fechaFin         DATETIME2 
           ,docAduanero      VARCHAR(100) 
           ,ptoPartida       VARCHAR(150) 
           ,ptoLlegada       VARCHAR(150) 
           ,ruta             VARCHAR(100) 
           ,estableDestino   VARCHAR(5) 
           ,entregar         VARCHAR(150)
           ,motivo           VARCHAR(300)
        )


        INSERT INTO @tblDetails
              (orderIndex,idArticulo,cantidad,descripcion)
		SELECT orderIndex,idArticulo,cantidad,descripcion 
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex  INT 
		    ,idArticulo  INT 
		    ,cantidad    NUMERIC(15,5) 
		    ,descripcion VARCHAR(255) 
		    
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
             
            --> infoGuiaRemision
			INSERT INTO GuiaRemision WITH (ROWLOCK)
				  (idDocumentoElectronico,idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,idNotaEntrega,idAprob_Document,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo,idUsuario,fechaRegistro)
			SELECT idDocumentoElectronico,idCliente,idTransportista,idVehiculo,idEmpleado,idFactura,idNotaEntrega,idAprob_Document,fechaInicio,fechaFin,docAduanero,ptoPartida,ptoLlegada,ruta,estableDestino,entregar,motivo,@idUsuario,GETDATE()
			FROM @tbGuia

			SET @idGuiaRemision = SCOPE_IDENTITY()
			
            --> Detalles
			INSERT INTO GuiaRemisionDetalle WITH (ROWLOCK)
                   (idGuiaRemision,idArticulo,cantidad,descripcion)
	        SELECT @idGuiaRemision,idArticulo,cantidad,descripcion 
            FROM @tblDetails 
            ORDER BY orderIndex ASC

            --> informacion Adiciomal
			INSERT INTO dbo.InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor) SELECT @idGuiaRemision,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

            --> Actualizacion de estado de la Factura
            IF EXISTS (SELECT 1 FROM @tbGuia WHERE idFactura > 0)
                BEGIN
	                DECLARE @idFactura INT

                    SELECT @idFactura = idFactura FROM @tbGuia 

                    UPDATE dbo.Factura WITH (ROWLOCK) SET guiaRemision = 1 WHERE idFactura = @idFactura
                END 

            SET @payload = (SELECT @idGuiaRemision as id FOR JSON PATH)

		IF (@@ROWCOUNT > 0)
			    BEGIN
				    SET @code = '0';
				    SET @message = 'Registrado Exitosamente';
			    END
		    ELSE
			    BEGIN
				    SET @code = '50001';
				    SET @errorCode = 5001
                    SET @errorMessage = 'No se pudo registrar'
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
                    'GuiaRemision/Insert'
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
