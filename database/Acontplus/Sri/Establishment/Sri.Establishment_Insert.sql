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
	DECLARE @idEntidad INT, 
	    @idUsuario INT,
	    @sequencial INT, 
	    @canton VARCHAR(10), 
        @actividad VARCHAR(5),
        @agenteRetencion VARCHAR(150), 
        @contribuyente VARCHAR(5),
        @estab VARCHAR(5), 
        @contribuyenteEspecial VARCHAR(10), 
        @obligadoContabilidad VARCHAR(5), 
        @nombreComercial VARCHAR(150), 
        @dirEstablecimiento VARCHAR(300), 
        @contribuyenteRimpe VARCHAR(150), 
	    @codEstab VARCHAR(50),
	    @telefono VARCHAR(100),
	    @correo VARCHAR(300),
	    @demoStepId INT,
        @uuid UNIQUEIDENTIFIER,
        @companyId INT;

	BEGIN TRY
		SELECT TOP 1 @idEntidad = idEntidad
            ,@idUsuario = idUsuario 
            FROM v_usuario WHERE idUsuarioRol = @userRoleId

		SELECT @sequencial = COUNT(*) + 1 FROM Sri.Establecimiento WITH (NOLOCK)

		SELECT @codEstab =  'ESTAB-'+Helper.F_Auto_Sequential(@sequencial)

		SELECT 
				 @canton                = canton
				,@actividad             = actividad
				,@agenteRetencion       = agenteRetencion
				,@contribuyente         = contribuyente
				,@estab                 = estab
				,@contribuyenteEspecial = contribuyenteEspecial
				,@obligadoContabilidad  = obligadoContabilidad
				,@nombreComercial       = nombreComercial
				,@dirEstablecimiento    = dirEstablecimiento
				,@telefono              = telefono
				,@contribuyenteRimpe    = contribuyenteRimpe
				,@correo                = correo
                ,@demoStepId            = demoStepId
		FROM OPENJSON (@json)
		WITH (
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
				)

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
					(codEstab
                    ,canton
					,actividad
					,agenteRetencion
					,contribuyente 
					,estab
					,contribuyenteEspecial
					,obligadoContabilidad
					,nombreComercial
					,dirEstablecimiento
					,telefono
					,correo
					,contribuyenteRimpe
					,fechaRegistro 
                    ,idEntidad)
				SELECT 
				     @codEstab
                    ,@canton
				    ,@actividad
				    ,@agenteRetencion
				    ,@contribuyente 
				    ,@estab
				    ,@contribuyenteEspecial
				    ,@obligadoContabilidad
				    ,@nombreComercial
				    ,@dirEstablecimiento
					,@telefono
					,@correo
				    ,@contribuyenteRimpe
				    ,dbo.ufnGetDateEcuador() 
                    ,@idEntidad
					
		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' AS 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF (@@TRANCOUNT > 0) 
        BEGIN
		   ROLLBACK TRAN; 
		END
        INSERT INTO Acontplus.dbo.ErroresSistema (method, token, [ErrorNumber],[ErrorSeverity],[ErrorState],[ErrorProcedure],[ErrorLine],[ErrorMessage])
		VALUES ('Establishment/Post', NEWID(), ERROR_NUMBER(), ERROR_SEVERITY(),  ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE());
		SELECT '0' as code,'Info: Error en el procedimiento' as [message];
	END CATCH 

END
