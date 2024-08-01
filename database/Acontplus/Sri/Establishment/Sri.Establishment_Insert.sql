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
        @id INT;

    DECLARE @tbEstablecimiento AS TABLE (
         canton VARCHAR(10)
	    ,actividad VARCHAR(5) NOT NULL 
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
		    ,actividad              VARCHAR(5)  
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
        FROM @tbEstablecimiento

        --> Validaciones
		IF NOT EXISTS (SELECT 1 FROM @tbEstablecimiento)
            BEGIN
				SELECT '0'code,'Error en el informacion del establecimiento' as 'message'
				RETURN 
			END 

        IF EXISTS (SELECT 1 FROM Sri.Establecimiento WHERE idEntidad = @idEntidad AND estab = @estab)
			BEGIN
				SELECT '0'code,'El numero de establecimiento ya se encuentra registrado' as 'message'
				RETURN 
			END 

        
        SET @uuid = (SELECT TOP 1 uuid FROM v_usuario WHERE idUsuarioRol = @userRoleId);

        SET @companyId = (SELECT Id FROM AcontplusAdmin.Config.Company WITH(NOLOCK) WHERE Uuid = @uuid);


		BEGIN TRAN

			INSERT INTO Sri.Establecimiento
				   (codEstab,canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,correo,contribuyenteRimpe,fechaRegistro,idEntidad,idUsuario, fromMobile)
			SELECT @codEstab,canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,correo,contribuyenteRimpe,GETDATE(),@idEntidad,@idUsuario, @fromMobile
            FROM @tbEstablecimiento

            SET @id = (SELECT SCOPE_IDENTITY())

 
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
                    IF NOT EXISTS (SELECT TOP 1 1 FROM AcontplusAdmin.Config.CompanyDemoStep WITH (NOLOCK) 
                                                    WHERE Uuid = @uuid AND DemoStepId = @demoStepId)
                        BEGIN
                            INSERT INTO AcontplusAdmin.Config.CompanyDemoStep(DemoStepId, CompanyId, Uuid, FromMobile)
                            VALUES(@demoStepId, @companyId, @uuid, @fromMobile);
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
            
		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' AS 'message'
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
