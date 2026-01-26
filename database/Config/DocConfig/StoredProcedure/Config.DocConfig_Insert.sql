USE [Acontplus]
GO

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE OR ALTER PROCEDURE [Config].[DocConfig_Insert] @userRoleId INT ,@json VARCHAR(MAX) ,@fromMobile BIT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

    --> Variables Globales
    DECLARE @userId INT,
        @username VARCHAR(100),
        @idEstablecimiento INT;

    --> Data Json
    DECLARE
        @docsValue NVARCHAR(MAX),
        @docs VARCHAR(MAX)

    --> Data Config
    DECLARE @demoStepId INT
           ,@idTipoDocumento INT
           ,@idPuntoEmision INT
           ,@codDoc VARCHAR(5)

    DECLARE @tblDocs AS TABLE(
        id INT
       ,idPuntoEmision INT NOT NULL
       ,idTipoDocumento INT NOT NULL
       ,ultimaSecuencia INT NOT NULL
       ,infoAdicional VARCHAR(MAX) NULL
       ,editInfo BIT NULL
       ,estado BIT DEFAULT 1 NOT NULL
    )


	BEGIN TRY
        --> Variables Globales
        SELECT TOP 1 @userId = idUsuario, @username = nombreUsuario FROM v_usuario WHERE idUsuarioRol = @userRoleId

        SELECT @docs = docs, @demoStepId = demoStepId
        FROM OPENJSON(@json)
        WITH (docs NVARCHAR(MAX) '$.docs', demoStepId INT '$.demoStepId')

        -- Extraer el valor de $.docs (puede ser array JSON o texto que contiene JSON)
        SET @docsValue = JSON_VALUE(@docs, '$.docs');

        IF @docsValue IS NOT NULL
            BEGIN
                SET @docs = @docsValue;
                SET @demoStepId = ISNULL(TRY_CAST(JSON_VALUE(@docs, '$.demoStepId') AS INT), 0);
            END

        --> Data Doc
        INSERT INTO @tblDocs
            (id,idPuntoEmision,idTipoDocumento,ultimaSecuencia,infoAdicional,editInfo, estado)
        SELECT id,idPuntoEmision,idTipoDocumento,ultimaSecuencia,infoAdicional,editInfo, estado
	    FROM OPENJSON(@docs) WITH
        (
		    id              INT
           ,idPuntoEmision  INT
           ,idTipoDocumento INT
           ,ultimaSecuencia INT
           ,infoAdicional   VARCHAR(MAX)
           ,editInfo        BIT
           ,estado          BIT
	    )

        --> Variables
        SELECT @idPuntoEmision  = idPuntoEmision
              ,@idTipoDocumento = idTipoDocumento
	    FROM @tblDocs

		SELECT TOP 1 @codDoc = codigo FROM dbo.TipoDocumento WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento;

        --> Validate
        IF NOT EXISTS (SELECT 1 FROM @tblDocs WHERE editInfo = 1)
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM @tblDocs)
                    BEGIN
                        SELECT '0' code,'Error en el información' as 'message'
			            RETURN
			        END

                IF @codDoc IN ('FV','NC','LC','GR','RC')
		            BEGIN
			            IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento)
					        BEGIN
                                SELECT '0' code,'No puedes actualizar el secuencial se encuentra en uso' as 'message'
						        RETURN
					        END
				        END
		        ELSE
			        BEGIN
				        IF @codDoc = 'PR'
					        BEGIN
						        IF EXISTS (SELECT 1 FROM dbo.Proforma WHERE idPuntoEmision = @idPuntoEmision)
							        BEGIN
                                        SELECT '0' code,'No puedes actualizar el secuencial se encuentra en uso' as 'message'
								        RETURN
							        END
					        END

				        IF @codDoc = 'NE'
					        BEGIN
						        IF EXISTS (SELECT 1 FROM dbo.NotaEntrega WHERE idPuntoEmision = @idPuntoEmision)
							        BEGIN
                                        SELECT '0','No puedes actualizar el secuencial se encuentra en uso' as 'message'
								        RETURN
							        END
					        END

				        IF @codDoc = 'CI'
					        BEGIN
						        IF EXISTS (SELECT 1 FROM dbo.ConsolidacionInventario WHERE idPuntoEmision = @idPuntoEmision)
							        BEGIN
                                        SELECT '0' code,'No puedes actualizar el secuencial se encuentra en uso' as 'message'
								        RETURN
							        END
					        END

				        IF @codDoc = 'TB'
					        BEGIN
						        IF EXISTS (SELECT 1 FROM dbo.TransferenciaBodega WHERE idPuntoEmision = @idPuntoEmision)
							        BEGIN
                                        SELECT '0' code,'No puedes actualizar el secuencial se encuentra en uso' as 'message'
								        RETURN
							        END
					        END

                        IF (@codDoc IN ('OR', 'ORC'))
                            BEGIN
                                IF EXISTS (SELECT 1 FROM Restaurant.[Order] o
                                INNER JOIN @tblDocs d ON o.PuntoEmisionId = d.idPuntoEmision)
                                    BEGIN
                                        SELECT '0' code,'No puedes actualizar el secuencial se encuentra en uso' as 'message'
								        RETURN
                                    END
                            END

			        END
                END

		BEGIN TRAN
      IF (@demoStepId > 0)
                BEGIN
                    DECLARE @uuid UNIQUEIDENTIFIER ,@companyId INT

                    SELECT TOP 1 @uuid = uuid FROM v_usuario WHERE idUsuarioRol = @userRoleId

                    SELECT TOP 1 @companyId = Id FROM Config.Company WITH(NOLOCK) WHERE Uuid = @uuid

                    IF NOT EXISTS (SELECT TOP 1 1 FROM Config.CompanyDemoStep WITH (NOLOCK)
                        WHERE Uuid        = @uuid
                        AND DemoStepId    = @demoStepId
                    )

                        BEGIN
                            INSERT INTO Config.CompanyDemoStep(DemoStepId, CompanyId, Uuid, IsMobileRequest, CreatedBy)
                            VALUES(@demoStepId, @companyId, @uuid, @fromMobile, @username);
                        END
                END

			IF EXISTS (SELECT 1 FROM @tblDocs WHERE id > 0)
				BEGIN
                    UPDATE cd SET
                           cd.ultimaSecuencia    = IIF(td.editInfo = 1,cd.ultimaSecuencia,td.ultimaSecuencia)
                          ,cd.infoAdicional      = td.infoAdicional
                          ,cd.UsuarioEditId      = @userId
                          ,cd.fechaActualizacion = GETDATE()
                          ,cd.estado = td.estado
                    FROM dbo.ConfiguracionDocumento cd WITH(ROWLOCK)
                    INNER JOIN @tblDocs td ON td.id = cd.idConfiguracionDocumento
				END

			ELSE
				BEGIN
					INSERT INTO dbo.ConfiguracionDocumento
                        (idPuntoEmision,idTipoDocumento,ultimaSecuencia,estado,idUsuario ,fromMobile)
                    SELECT idPuntoEmision,idTipoDocumento,ultimaSecuencia,estado,@userId  ,@fromMobile FROM @tblDocs
                    WHERE ISNULL(id,0) = 0
				END

		COMMIT TRAN
        SELECT '1' code, 'Registrado correctamente' as 'message'
	END TRY

	BEGIN CATCH
        IF (@@TRANCOUNT > 0)
            BEGIN
		        ROLLBACK TRAN;
            END

        INSERT INTO dbo.ErroresSistema
             (method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,idUsuario)
	    SELECT '/DocConfig/Post',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE() +' - '+ @json, @userId

	    SELECT '0' code, 'Error en el procedimiento' as 'message'
	END CATCH
END
GO
