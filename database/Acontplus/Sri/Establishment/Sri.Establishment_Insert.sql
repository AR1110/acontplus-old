USE [Acontplus]
GO
/****** Object:  StoredProcedure [Sri].[Establecimiento_Insert]    Script Date: 10/5/2024 16:51:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Sri.Establishment_Insert @userRoleId INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idEntidad INT,
        @idUsuario INT,
        @demoStepId INT,
        @uuid UNIQUEIDENTIFIER,
        @companyId INT;
    --> Establecimiento
	DECLARE @sequencial INT ,@codEstab VARCHAR(150) ,@estab VARCHAR(15)

    DECLARE @tbEstablecimiento AS TABLE (
         canton VARCHAR(10) NULL
	    ,actividad VARCHAR(5) NOT NULL 
	    ,agenteRetencion VARCHAR(150) NULL
	    ,contribuyente VARCHAR(5) NOT NULL  
	    ,estab VARCHAR(5) NOT NULL 
	    ,contribuyenteEspecial VARCHAR(10) NULL
	    ,obligadoContabilidad VARCHAR(5) NOT NULL  
	    ,nombreComercial VARCHAR(150) NOT NULL
	    ,dirEstablecimiento VARCHAR(300) NOT NULL
	    ,telefono VARCHAR(150) NULL
	    ,contribuyenteRimpe VARCHAR(150) NULL
	    ,correo VARCHAR(300) NULL
    )
	
	BEGIN TRY
        --> Variables Globales
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		--> Data Json
        INSERT INTO @tbEstablecimiento 
              (canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,contribuyenteRimpe,correo)
		SELECT canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,contribuyenteRimpe,correo
		FROM OPENJSON (@json) WITH 
        (
			 canton                VARCHAR(10) 
		    ,actividad             VARCHAR(5)  
		    ,agenteRetencion       VARCHAR(150)
		    ,contribuyente         VARCHAR(5)  
		    ,estab                 VARCHAR(5)  
		    ,contribuyenteEspecial VARCHAR(10) 
		    ,obligadoContabilidad  VARCHAR(5)  
		    ,nombreComercial       VARCHAR(150)
		    ,dirEstablecimiento    VARCHAR(300)
		    ,telefono              VARCHAR(150)
		    ,contribuyenteRimpe    VARCHAR(150)
		    ,correo                VARCHAR(300)
		)

        --> Variables 
        SELECT @sequencial = COUNT(*)+1 FROM Sri.Establecimiento WITH (NOLOCK)

		SELECT @codEstab =  'ESTAB-'+Helper.F_Auto_Sequential(@sequencial)

        SELECT TOP 1 @estab = estab FROM @tbEstablecimiento

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

           IF (@demoStepId > 0)
                BEGIN
                    IF NOT EXISTS (SELECT TOP 1 1 FROM AcontplusAdmin.Config.CompanyDemoStep WITH (NOLOCK) 
                                                    WHERE Uuid = @uuid AND DemoStepId = @demoStepId)
                        BEGIN
                            INSERT INTO AcontplusAdmin.Config.CompanyDemoStep(DemoStepId, CompanyId, Uuid)
                            VALUES(@demoStepId, @companyId, @uuid);
                        END
                END

			INSERT INTO Sri.Establecimiento
				   (codEstab,canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,correo,contribuyenteRimpe,fechaRegistro,idEntidad,idUsuario)
			SELECT @codEstab,canton,actividad,agenteRetencion,contribuyente,estab,contribuyenteEspecial,obligadoContabilidad,nombreComercial,dirEstablecimiento,telefono,correo,contribuyenteRimpe,GETDATE(),@idEntidad,@idUsuario
            FROM @tbEstablecimiento
            
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
