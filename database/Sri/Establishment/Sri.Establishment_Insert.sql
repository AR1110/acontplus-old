USE [Acontplus]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Sri.Establishment_Insert @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@fromMobile BIT
    ,@errorCode INT = 0 OUTPUT
	,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;
    SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idEntidad INT,
        @idUsuario INT,
        @demoStepId INT,
        @uuid UNIQUEIDENTIFIER,
        @companyId INT,
        @username VARCHAR(100);
    --> Establecimiento
	DECLARE @sequencial INT,
        @codEstab VARCHAR(150),
        @estab VARCHAR(15),
        @ptosEmi VARCHAR(1000),
        @bodegas VARCHAR(MAX),
        @direccionBodega VARCHAR(300),
        @telefonoBodega VARCHAR(150),
        @actividad VARCHAR(10),
        @id INT;

    DECLARE @tbEstablecimiento AS TABLE (
         canton VARCHAR(10)
	    ,actividad VARCHAR(10) NOT NULL 
	    ,agenteRetencion VARCHAR(150)
	    ,contribuyente VARCHAR(5) NOT NULL  
	    ,estab VARCHAR(5) NOT NULL 
	    ,contribuyenteEspecial VARCHAR(10)
	    ,obligadoContabilidad VARCHAR(5) NOT NULL  
	    ,nombreComercial VARCHAR(150) NOT NULL
	    ,dirEstablecimiento VARCHAR(300) NOT NULL
	    ,telefono VARCHAR(150)
	    ,contribuyenteRimpe VARCHAR(150)
	    ,correo VARCHAR(300)
        ,demoStepId INT
        ,ptosEmi VARCHAR(1000)
        ,bodegas VARCHAR(MAX)

    );

    DECLARE @code VARCHAR,
        @message VARCHAR(300);
	
	BEGIN TRY
        --> Variables Globales
		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario, @username = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		--> Data Json
        INSERT INTO @tbEstablecimiento 
              (canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,
              dirEstablecimiento,telefono,contribuyenteRimpe,correo, demoStepId, ptosEmi, bodegas)
		SELECT canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,
        dirEstablecimiento,telefono,contribuyenteRimpe,correo, demoStepId, ptosEmi, bodegas
		FROM OPENJSON (@json) WITH 
        (
			 canton                 VARCHAR(10) 
		    ,actividad              VARCHAR(10)  
		    ,agenteRetencion        VARCHAR(150)
		    ,contribuyente          VARCHAR(5)  
		    ,estab                  VARCHAR(5)  
		    ,contribuyenteEspecial  VARCHAR(10) 
		    ,obligadoContabilidad   VARCHAR(5)  
		    ,nombreComercial        VARCHAR(150)
		    ,dirEstablecimiento     VARCHAR(300)
		    ,telefono               VARCHAR(150)
		    ,contribuyenteRimpe     VARCHAR(150)
		    ,correo                 VARCHAR(300)
            ,demoStepId             INT
            ,ptosEmi                VARCHAR(1000)
            ,bodegas                VARCHAR(MAX)
		)

        --> Variables 
        SELECT @sequencial = COUNT(*)+1 FROM Sri.Establecimiento WITH (NOLOCK)

		SELECT @codEstab =  'ESTAB-'+Helper.F_Auto_Sequential(@sequencial)

        SELECT TOP 1 @estab = estab
            ,@demoStepId = demoStepId
            ,@ptosEmi = ptosEmi
            ,@bodegas = bodegas
            ,@direccionBodega = dirEstablecimiento 
            ,@telefonoBodega = telefono
            ,@actividad = actividad
        FROM @tbEstablecimiento

        --> Validaciones
		IF NOT EXISTS (SELECT 1 FROM @tbEstablecimiento)
            BEGIN
				SELECT '0'code,'Error al obtener la informacion del establecimiento' as 'message'
				RETURN 
			END 

        IF EXISTS (SELECT 1 FROM Sri.Establecimiento WHERE idEntidad = @idEntidad AND estab = @estab)
			BEGIN
				SELECT '0'code,'El numero de establecimiento ya se encuentra registrado' as 'message'
				RETURN 
			END
        
        SET @uuid = (SELECT TOP 1 uuid FROM v_usuario WHERE idUsuarioRol = @userRoleId);

        SET @companyId = (SELECT Id FROM Config.Company WITH(NOLOCK) WHERE Uuid = @uuid);

		BEGIN TRAN

			INSERT INTO Sri.Establecimiento
				   (codEstab,canton,idActividadEconomica, actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,correo,contribuyenteRimpe,fechaRegistro,idEntidad,idUsuario, fromMobile, autoSriAuth)
			SELECT @codEstab,canton,ae.idActividadEconomica,actividad,NULLIF(TRIM(e.AgenteRetencion), ''),contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,correo,contribuyenteRimpe,GETDATE(),@idEntidad,@idUsuario, @fromMobile, 1
            FROM @tbEstablecimiento e
                INNER JOIN Sri.ActividadEconomica ae On e.actividad = ae.codigo

            SET @id = (SELECT SCOPE_IDENTITY())

            IF (@id > 0)
                BEGIN
                    SET @code = '1';
                    SET @message = 'Registrado Exitosamente!';

                    DECLARE @estabAsignParams VARCHAR(MAX)

                    SET @estabAsignParams = '{"idUsuarioRol": "' + CAST(@userRoleId AS VARCHAR(10)) + '",
                    "codEstab": "' + @codEstab + '"}'
            
                    EXEC Config.Estab_Asig_Insert @userRoleId, @estabAsignParams, @fromMobile, @errorCode = @errorCode OUT, @errorMessage = @errorMessage OUT
            
                    IF (@errorCode <> 0)
                        BEGIN
                            SET @errorMessage = 'sp Acontplus.Config.Estab_Asig_Insert failed: ' + ISNULL(@errorMessage, '')
				            RAISERROR(@errorMessage,16,1)
                        END

                    DECLARE @codEstab_Asig VARCHAR(150)
                        ,@idEstab_Asig INT;

                    SELECT @codEstab_Asig = codEstab_Asig
                        ,@idEstab_Asig = idEstab_Asig
                    FROM Acontplus.Config.Estab_Asig ea WITH(NOLOCK) 
                    WHERE idEstablecimiento = @id;

                    DECLARE @bodegaParams VARCHAR(300);
                    DECLARE @i INT = 0;
                    DECLARE @count INT;

                    IF (ISJSON(@bodegas) = 1 AND EXISTS (SELECT 1 FROM OPENJSON(@bodegas)))
                        BEGIN
                           DECLARE @TempBodegas TABLE (
                                id INT IDENTITY(1,1),
                                descripcion VARCHAR(300),
                                direccion VARCHAR(300),
                                telefono VARCHAR(100)
                            );

                            INSERT INTO @TempBodegas (descripcion, direccion, telefono)
                            SELECT descripcion, direccion, telefono
                            FROM OPENJSON(@bodegas) 
                            WITH (descripcion VARCHAR(300), direccion VARCHAR(300), telefono VARCHAR(150));

                            SELECT @count = COUNT(*) FROM @TempBodegas;

                            WHILE @i < @count
                            BEGIN
                                SET @i = @i + 1;

                                SELECT 
                                    @bodegaParams =  '{ "codEstab": "' + @codEstab + '",
                                    "descripcion": "' + descripcion + '",
                                    "direccion": "' + direccion + '", 
                                    "telefono": "' + telefono + '"}'
                                FROM @TempBodegas
                                WHERE id = @i;

                                EXEC Inventario.Bodega_Insert 
                                    @userRoleId, 
                                    @bodegaParams,
                                    @fromMobile, 
                                    @errorCode = @errorCode OUT,
                                    @errorMessage = @errorMessage OUT;

                                IF @errorCode <> 0
                                BEGIN
                                    SET @errorMessage = 'sp Acontplus.Inventario.Bodega_Insert failed: ' + ISNULL(@errorMessage, '')
				                    RAISERROR(@errorMessage,16,1);
                                    BREAK;
                                END
                            END
                        END
                    ELSE
                        BEGIN
                            SET @bodegaParams =  '{"codEstab": "' + @codEstab + '", "descripcion": "Principal", "direccion": "' + @direccionBodega + '", "telefono": "' + @telefonoBodega + '"}'
                            EXEC Inventario.Bodega_Insert 
                                    @userRoleId, 
                                    @bodegaParams,
                                    @fromMobile, 
                                    @errorCode = @errorCode OUT,
                                    @errorMessage = @errorMessage OUT;

                            IF @errorCode <> 0
                                BEGIN
                                    SET @errorMessage = 'sp Acontplus.Inventario.Bodega_Insert failed: ' + ISNULL(@errorMessage, '')
				                    RAISERROR(@errorMessage,16,1)
                                END
                        END

                    IF EXISTS(SELECT TOP 1 1 FROM Acontplus.dbo.Bodega WITH(NOLOCK) WHERE codEstab = @codEstab)
                        BEGIN
                            SET @i = 0;

                            DECLARE @TempBodegAsig TABLE (
                                id INT IDENTITY(1,1),
                                idBodega INT,
                                codEstabAsig VARCHAR(150)
                            );

                            INSERT INTO @TempBodegAsig (idBodega, codEstabAsig)
                            SELECT idBodega, @codEstab_Asig
                            FROM Acontplus.dbo.Bodega WITH(NOLOCK)
                            WHERE codEstab = @codEstab

                            SELECT @count = COUNT(*) FROM @TempBodegAsig;

                            WHILE @i < @count
                            BEGIN
                                SET @i = @i + 1;

                                SELECT 
                                    @bodegaParams =  '{"idBodega": "' + CAST(idBodega AS varchar(10)) + '", "codEstab_Asig": "' + codEstabAsig + '"}'
                                FROM @TempBodegAsig
                                WHERE id = @i;

                                EXEC Config.Bodeg_Asig_Insert 
                                    @userRoleId, 
                                    @bodegaParams,
                                    @fromMobile, 
                                    @errorCode = @errorCode OUT,
                                    @errorMessage = @errorMessage OUT;

                                IF @errorCode <> 0
                                BEGIN
                                    SET @errorMessage = 'sp Acontplus.Config.Bodeg_Asig_Insert failed: ' + ISNULL(@errorMessage, '')
				                    RAISERROR(@errorMessage,16,1);
                                    BREAK;
                                END
                            END
                        END

                    IF (ISJSON(@ptosEmi) = 1)
                        BEGIN
                            INSERT INTO Acontplus.dbo.PuntoEmision(idEstablecimiento, ambiente, ptoEmi, idUsuario)
                            SELECT @id, ambiente, ptoEmi, @idUsuario FROM OPENJSON(@ptosEmi) WITH (ambiente CHAR, ptoEmi VARCHAR(3))
                        END


                    IF (@demoStepId > 0)
                        BEGIN
                            IF NOT EXISTS (SELECT TOP 1 1 FROM Config.CompanyDemoStep WITH (NOLOCK) 
                                                            WHERE Uuid = @uuid AND DemoStepId = @demoStepId)
                                BEGIN
                                    INSERT INTO Config.CompanyDemoStep(DemoStepId, CompanyId, Uuid, IsMobileRequest, CreatedBy)
                                    VALUES(@demoStepId, @companyId, @uuid, @fromMobile, @username);
                                END

                            IF EXISTS (SELECT TOP 1 1 FROM Acontplus.dbo.PuntoEmision WITH(NOLOCK) WHERE idEstablecimiento = @id)
                                BEGIN
                                   SET @i = 0;

                                    DECLARE @TempPtoEmiAsig TABLE (
                                        id INT IDENTITY(1,1),
                                        idPuntoEmision INT,
                                        codEstabAsig VARCHAR(150)
                                    );

                                    INSERT INTO @TempPtoEmiAsig (idPuntoEmision, codEstabAsig)
                                    SELECT idPuntoEmision, @codEstab_Asig
                                    FROM Acontplus.dbo.PuntoEmision WITH(NOLOCK)
                                    WHERE idEstablecimiento = @id

                                    SELECT @count = COUNT(*) FROM @TempPtoEmiAsig;

                                    WHILE @i < @count
                                    BEGIN
                                        SET @i = @i + 1;

                                        SELECT 
                                            @bodegaParams =  '{"idPuntoEmision": "' + CAST(idPuntoEmision AS varchar(10)) + '", "codEstab_Asig": "' + codEstabAsig + '"}'
                                        FROM @TempPtoEmiAsig
                                        WHERE id = @i;

                                        EXEC Acontplus.Config.PtoEmi_Asig_Insert
                                            @userRoleId, 
                                            @bodegaParams,
                                            @fromMobile, 
                                            @errorCode = @errorCode OUT,
                                            @errorMessage = @errorMessage OUT;

                                        IF @errorCode <> 0
                                        BEGIN
                                            SET @errorMessage = 'sp Acontplus.Config.PtoEmi_Asig_Insert failed: ' + ISNULL(@errorMessage, '')
				                            RAISERROR(@errorMessage,16,1);
                                            BREAK;
                                        END
                                    END
                                END 
                        END
                
                                ---SUB ENTIDAD FINANCIERA
                        
                                DECLARE @subentidadFinancieraParams VARCHAR(MAX),
                                    @tiempoCreditoParams VARCHAR(MAX)

                                SET @subentidadFinancieraParams = '{
                                                              "idEntidadFinanciera": 13,
                                                              "descripcion": "EFECTIVO",
                                                              "codigo": "EFE",
                                                              "interes": 0.00000,
                                                              "idEntidad": "' + CONVERT(VARCHAR, @idEntidad) + '",
                                                              "predeterminado": 0,
                                                              "controlCaja": 1,
                                                              "fromMobile": "' + CONVERT(VARCHAR, @fromMobile) + '"
                                                            }
                                                            '

                                EXEC Contabilidad.SubEntidadFinanciera_Insert @userRoleId, 
                                            @subentidadFinancieraParams,
                                            @fromMobile, 
                                            @errorCode = @errorCode OUT,
                                            @errorMessage = @errorMessage OUT;
                        
                        
                                IF @errorCode <> 0
                                        BEGIN
                                            SET @errorMessage = 'sp Acontplus.Contabilidad.SubEntidadFinanciera_Insert failed: ' + ISNULL(@errorMessage, '')
				                            RAISERROR(@errorMessage,16,1);
                                        END
                       
                               ----TIEMPOS CREDITO ------
                          IF NOT EXISTS (SELECT 1 FROM dbo.TiempoCredito WHERE idEntidad = @idEntidad)
                             BEGIN
                                SET @tiempoCreditoParams = '{
                                                          "gestion": 1,
                                                          "descripcion": "VENTAS-CONTADO",
                                                          "diasCredito": 0,
                                                          "numeroCuota": 1,
                                                          "entrada": 0,
                                                          "idEntidad": "' + CONVERT(VARCHAR, @idEntidad) + '",
                                                          "tipo": 1,
                                                          "fromMobile": "' + CONVERT(VARCHAR, @fromMobile) + '"
                                                        }'

                                EXEC Config.TiempoCredito_Insert @userRoleId , 
                                            @tiempoCreditoParams,
                                            @fromMobile, 
                                            @errorCode = @errorCode OUT,
                                            @errorMessage = @errorMessage OUT;
                        
                                IF @errorCode <> 0
                                        BEGIN
                                            SET @errorMessage = 'sp Acontplus.Config.TiempoCredito_Insert failed: ' + ISNULL(@errorMessage, '')
				                            RAISERROR(@errorMessage,16,1);
                                        END
                              END

                                -----------FAMILIAS-------------------
                                DECLARE @idActividadEconomica INT,
                                    @actividadEconomicaName VARCHAR(500),
                                    @idFamilia INT

                                SELECT @idActividadEconomica = idActividadEconomica, @actividadEconomicaName = descripcion  
                                FROM Acontplus.Sri.ActividadEconomica WITH(NOLOCK) WHERE codigo = @actividad;

                                IF NOT EXISTS (SELECT TOP 1 1 FROM Acontplus.dbo.Familia WITH(NOLOCK) WHERE ActividadEconomicaId = @idActividadEconomica)
                                    BEGIN
                                        INSERT INTO Acontplus.dbo.Familia(descripcion, siglas, estado, ActividadEconomicaId)
                                        SELECT @actividadEconomicaName, LEFT(@actividadEconomicaName, 3) + '-' + LEFT(@actividad, 6), 1, @idActividadEconomica;

                                        SET @idFamilia = SCOPE_IDENTITY()
                                    END
                                 --SUBFAMILIA 

                                 IF NOT EXISTS (SELECT TOP 1 1 FROM Acontplus.dbo.subfamilia WITH(NOLOCK) WHERE idEntidad = @idEntidad)
                                    BEGIN
                                        SET @idFamilia = (SELECT TOP 1 idFamilia FROM Acontplus.dbo.Familia WITH(NOLOCK) WHERE ActividadEconomicaId = @idActividadEconomica)
                                        INSERT INTO dbo.SubFamilia(idFamilia, descripcion, siglas,codigo, montoObjetivo, ultimoSecuencial, idUsuario, idEntidad)
				                        SELECT @idFamilia, 'SUBFAMILIA DEMO', 'SD', newid(), 0.00, 1 ,@idUsuario, @idEntidad
                                    END

                                --MEDIDA
                                DECLARE @sequential INT,  @medidaCode VARCHAR(15)

                                IF NOT EXISTS (SELECT TOP 1 1 FROM Acontplus.dbo.Medida WITH(NOLOCK) WHERE idEntidad = @idEntidad)
                                    BEGIN
                                        SELECT @sequential = COUNT(*) + 1 FROM dbo.Medida WITH(NOLOCK)

	                                    SET @medidaCode = ('ME' + Helper.F_Auto_Sequential(@sequential))

                                        INSERT INTO dbo.Medida ([descripcion], [idUsuario], [idEntidad], [codigo])
                                        VALUES('UNIDAD', @idUsuario, @idEntidad, 'UNI')
                                    END

                                -----TURNOS---
                                IF NOT EXISTS (SELECT TOP 1 1 FROM Acontplus.dbo.Turno WITH(NOLOCK) WHERE idEntidad = @idEntidad)
                                    BEGIN
                                        INSERT INTO Acontplus.dbo.Turno(descripcion, estado, fechaRegistro, idUsuario, idEntidad)
                                        VALUES ('DIURNO', 1, dbo.ufnGetDateEcuador(), @idUsuario, @idEntidad);
                                    END

                                -----CAJAS----

                                DECLARE @idTurno INT,
                                    @idCaja INT;

                                IF NOT EXISTS (SELECT TOP 1 1 FROM Acontplus.dbo.Caja WITH(NOLOCK) WHERE idEntidad = @idEntidad)
                                    BEGIN
                                        INSERT INTO Acontplus.dbo.Caja(descripcion, estado, fechaRegistro, idUsuario, idEntidad, actividad)
                                        VALUES ('PRINCIPAL', 1, dbo.ufnGetDateEcuador(), @idUsuario, @idEntidad, 1);
                                
                                        SET @idCaja = SCOPE_IDENTITY()

                                        SET @idTurno = (SELECT TOP 1 idTurno FROM dbo.Turno WITH (NOLOCK) WHERE idEntidad = @idEntidad)

                                        ---ASIGNACION DE CAJAS---
                                        INSERT INTO dbo.AsignacionCaja(idCaja, idUsuario, idTurno, fechaRegistro, idUsuarioRegistro, idEntidad)
                                        VALUES(@idCaja, @idUsuario, @idTurno, dbo.ufnGetDateEcuador(), @idUsuario, @idEntidad)
                                    END
            END
        ELSE
            BEGIN
                 SET @code = '0';
                 SET @message = 'No se pudo registrar!';
            END
		COMMIT TRAN 
		SELECT @code code, @message AS 'message'
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/Establecimiento/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH 

END
GO
