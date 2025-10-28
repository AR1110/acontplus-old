USE [AcontPlus]
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2023-07-05
-- Description:	sp 
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.InsertDocumentoElectronico
     @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
    ,@idDocumentoElectronico INT = 0 OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;


    --> Global
    DECLARE @result VARCHAR(MAX) ,@code VARCHAR(50) ,@message VARCHAR(MAX)

    --> Documento Electronico 
	DECLARE @fechaEmision DATETIME ,@claveAcceso NVARCHAR(50) ,@isAutomatic INT ,@nroDocumento INT
           ,@idEstadoServicio INT ,@idUsuario INT ,@serieComprobante VARCHAR(100) ,@idPuntoEmision INT ,@idTipoDocumento INT
           ,@idEntidad INT ,@codDoc VARCHAR(5)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    DECLARE @tbComprobante AS TABLE
    (
		 idPuntoEmision INT NOT NULL
        ,idTipoDocumento INT NOT NULL
        ,CustomerId INT NOT NULL
        ,idUsuario INT NOT NULL
        ,versionComp VARCHAR(10) NOT NULL 
	    ,fechaEmision DATETIME2 NOT NULL
	)

    BEGIN TRY

        --> Comprbante Json
		INSERT INTO @tbComprobante
		      (idTipoDocumento,CustomerId,idPuntoEmision,idUsuario,fechaEmision,versionComp)
		SELECT idTipoDocumento,CustomerId,idPuntoEmision,idUsuario,fechaEmision,versionComp 
		FROM OPENJSON(@json) WITH
        (
             idTipoDocumento INT
            ,CustomerId      INT 
			,idPuntoEmision  INT 
			,idUsuario       INT 
			,fechaEmision    DATETIME2
            ,versionComp     VARCHAR(50)

		) AS js

        --> Variables
        SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @idPuntoEmision = idPuntoEmision ,@idTipoDocumento = idTipoDocumento ,@fechaEmision = fechaEmision, @idUsuario = idUsuario FROM @tbComprobante

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1
		
        SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso
                              (
                                 (LTRIM(TRIM(RTRIM(REPLACE(es.estab,'0','')))))
                                ,td.codigoSri
                                ,pe.ambiente
                                ,'1'
                                ,(CONVERT(NVARCHAR, FORMAT(@fechaEmision, 'dd/MM/yyyy'),106))
                                ,en.ruc
                                ,es.estab + pe.ptoEmi
                                ,FORMAT(cd.ultimaSecuencia, 'D9')
                              )
              ,@isAutomatic        = es.autoSriAuth
              ,@serieComprobante   = es.estab + '-' + pe.ptoEmi + '-' +  FORMAT(cd.ultimaSecuencia, 'D9')
              ,@nroDocumento       = cd.ultimaSecuencia
              ,@codDoc             = td.codigoSri
        FROM dbo.ConfiguracionDocumento cd
        INNER JOIN dbo.TipoDocumento    td ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN dbo.PuntoEmision     pe ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN Sri.Establecimiento  es ON es.idEstablecimiento = pe.idEstablecimiento
        INNER JOIN dbo.Entidad          en ON en.idEntidad         = es.idEntidad
        WHERE cd.idPuntoEmision  = @idPuntoEmision
          AND cd.idTipoDocumento = @idTipoDocumento;

        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SET @message = 'Error en la info tributaria';
            END

        IF @codDoc = '05'
            BEGIN
                SET @message = 'Comprobante no disponible';
            END 

        IF EXISTS (SELECT 1 FROM Config.v_ConfigDocumento WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND codDocSri = '01' AND autoSriAuth = 1)
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad)
                    BEGIN
                        SET @message = 'No tienes configurada ninguna firma electrónica.';
			        END

                IF (SELECT DATEDIFF(DAY, fechaCaducidad, GETDATE()) FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad) = 0
                    BEGIN
                        SET @message = 'Su firma ha caducado no puede realizar comprobantes electrónicos';
                    END 
            END

        IF @nroDocumento IS NULL
			BEGIN
                SET @message = 'No existe una configuracion de secuencial para este Punto de Emision';
			END

		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE nroDocumento = @nroDocumento AND idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento)
			BEGIN
                SET @message = 'El Comprobante: ' + @serieComprobante + ' ya se encuentra registrada';
			END

		IF @claveAcceso IS NULL
			BEGIN
                SET @message = 'Error critico la clave de Acceso no se genero correctamente';
			END

		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE claveAcceso = @claveAcceso)
			BEGIN
                SET @message = 'Error critico esta clave de acceso ya se encuentra registrada';
			END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END 

        --> TRANSACCION
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

		    INSERT INTO dbo.DocumentoElectronico
                  (idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,CustomerId,nroDocumento,claveAcceso,isAutomatic,idUsuario,idEstadoServicio,serieComprobante)
            SELECT idTipoDocumento,idPuntoEmision,fechaEmision,versionComp,CustomerId,@nroDocumento,@claveAcceso,@isAutomatic,idUsuario,@idEstadoServicio,@serieComprobante
            FROM @tbComprobante

            SET @idDocumentoElectronico = SCOPE_IDENTITY()

            SET @result = (SELECT @idDocumentoElectronico as id FOR JSON PATH)

            --> Actualizacion del secuencial
            BEGIN
                DECLARE @idConfiguracionDocumento INT

                SELECT TOP 1 @idConfiguracionDocumento = idConfiguracionDocumento FROM  ConfiguracionDocumento WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

                EXEC Config.UpdateConfiguracionDocumento @userRoleId ,@idConfiguracionDocumento ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                IF (@errorCode <> 0)
                    BEGIN
                        SET @errorMessage = 'sp Acontplus.Config.UpdateConfiguracionDocumento response: ' + ISNULL(@errorMessage, '');
                        THROW 50001, @errorMessage, 1;
                    END
            END

            --> InfoFactura
            IF @codDoc = '01'
                BEGIN
                    EXEC FactElect.InsertFactura @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.FactElect.InsertFactura response: ' + ISNULL(@errorMessage, '');
                            THROW 50001, @errorMessage, 1;
                        END
                END

            --> InfoLiquidacion
            IF @codDoc = '03'
                BEGIN
                    EXEC FactElect.InsertLiquidacion @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.FactElect.InsertLiquidacion response: ' + ISNULL(@errorMessage, '');
                            THROW 50001, @errorMessage, 1;
                        END
                END

            --> InfoNotaCredito
            IF @codDoc = '04'
                BEGIN
                    EXEC FactElect.InsertNotaCredito @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.FactElect.InsertNotaCredito response: ' + ISNULL(@errorMessage, '');
                            THROW 50001, @errorMessage, 1;
                        END
                END

            --> InfoGuia
            IF @codDoc = '06'
                BEGIN
                    EXEC FactElect.InsertGuiaRemision @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.FactElect.InsertGuiaRemision response: ' + ISNULL(@errorMessage, '');
                            THROW 50001, @errorMessage, 1;
                        END
                END 

            --> infoComprobanteRetencion
            IF @codDoc = '07'
                BEGIN
                    EXEC FactElect.InsertRetencionAts @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.FactElect.InsertRetencionAts response: ' + ISNULL(@errorMessage, '');
                            THROW 50001, @errorMessage, 1;
                        END
                END 

            --> Inventario
            IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
			    BEGIN
                    IF @codDoc IN ('01','04','03')
                        BEGIN
                    
                            EXEC Inventario.InsertTransaccion @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                            IF (@errorCode <> 0)
                                BEGIN
                                    SET @errorMessage = 'sp Acontplus.Inventario.InsertTransaccion response: ' + ISNULL(@errorMessage, '');
                                    THROW 50001, @errorMessage, 1;
                                END    
                        
                        END
                END 

            --> Contabilidad CuentaPorCobrar
            IF @codDoc IN ('01','04')
                BEGIN
                    EXEC Contabilidad.InsertCuentaPorCobrar @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.Contabilidad.InsertCuentaPorCobrar response: ' + ISNULL(@errorMessage, '');
                            THROW 50001, @errorMessage, 1;
                        END
                END

            --> Contabilidad CuentaPorPagar
            IF @codDoc IN ('03','07')
                BEGIN
                    EXEC Contabilidad.InsertCuentaPorPagar @userRoleId ,@json ,@errorCode = @errorCode OUT ,@errorMessage = @errorMessage OUT

                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.Contabilidad.InsertCuentaPorPagar response: ' + ISNULL(@errorMessage, '');
                            THROW 50001, @errorMessage, 1;
                        END
                END

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
        -- Rollback transaction if an error occurs
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
                    'DocumentoElectronico/Insert'
                   ,ERROR_NUMBER()
                   ,ERROR_SEVERITY()
                   ,ERROR_STATE()
                   ,ERROR_PROCEDURE()
                   ,ERROR_LINE()
                   ,ERROR_MESSAGE()
                   ,@idUsuario
                );

                THROW 50001, 'Error en el procedimiento: ', 1;
            END
        ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE();
			END
    END CATCH
END
