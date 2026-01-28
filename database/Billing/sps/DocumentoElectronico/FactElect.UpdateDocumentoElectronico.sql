USE [AcontPlus]
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2023-07-05
-- Description:	sp 
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.InsertDocumentoElectronico
     @userRoleId INT
    ,@id INT 
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;


    --> Global
    DECLARE @result VARCHAR(MAX) ,@code VARCHAR(50) ,@message VARCHAR(MAX)

    --> Documento Electronico 
	DECLARE @fechaEmision DATETIME ,@claveAcceso NVARCHAR(50) ,@idEstadoServicio INT ,@idUsuario INT ,@idEntidad INT ,@codDoc VARCHAR(5) ,@customerId INT

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

        SELECT TOP 1 @fechaEmision = fechaEmision, @idUsuario = idUsuario ,@CustomerId = CustomerId FROM @tbComprobante

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
                                ,FORMAT(de.nroDocumento, 'D9')
                              )
        FROM DocumentoElectronico       de
        INNER JOIN dbo.TipoDocumento    td ON td.idTipoDocumento   = de.idTipoDocumento
        INNER JOIN dbo.PuntoEmision     pe ON pe.idPuntoEmision    = de.idPuntoEmision
        INNER JOIN Sri.Establecimiento  es ON es.idEstablecimiento = pe.idEstablecimiento
        INNER JOIN dbo.Entidad          en ON en.idEntidad         = es.idEntidad
        WHERE de.idDocumentoElectronico = @id

        --> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SET @message = 'Error en la info tributaria';
            END

        IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE claveAcceso = @claveAcceso AND idDocumentoElectronico != @id)
			BEGIN
				SET @message = 'Error critico esta clave de acceso ya existe';
			END

        IF EXISTS (SELECT 1 FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id AND codEstado IN (4,3,6,8))
            BEGIN
                SET @message = 'El Documento tiene un proceso en el Sri';
            END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END

        --> Transaccion
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            UPDATE DocumentoElectronico WITH (ROWLOCK)
               SET claveAcceso      = @claveAcceso
                  ,customerId       = @customerId
                  ,fechaEmision     = @fechaEmision
                  ,idEstadoServicio = @idEstadoServicio
            WHERE idDocumentoElectronico = @id


        IF (@@ROWCOUNT > 0)
			BEGIN
				SET @code = '0';
				SET @message = 'Actualizado Exitosamente';
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
                    'DocumentoElectronico/Update'
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
