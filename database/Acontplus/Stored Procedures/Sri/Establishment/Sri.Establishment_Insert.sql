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
	DECLARE @idEntidad INT 
	DECLARE @idUsuario INT
	DECLARE @sequencial INT
	DECLARE @nombreUsuario VARCHAR(100)
	DECLARE @ruc VARCHAR(15)
	DECLARE @canton VARCHAR(10) 
    DECLARE @actividad VARCHAR(5)
    DECLARE @agenteRetencion VARCHAR(150) 
    DECLARE @contribuyente VARCHAR(5)
    DECLARE @estab VARCHAR(5) 
    DECLARE @contribuyenteEspecial VARCHAR(10) 
    DECLARE @obligadoContabilidad VARCHAR(5) 
    DECLARE @nombreComercial VARCHAR(150) 
    DECLARE @dirEstablecimiento VARCHAR(300) 
    DECLARE @contribuyenteRimpe VARCHAR(150) 
	DECLARE @codEstab VARCHAR(50)
	DECLARE @telefono VARCHAR(100)
	DECLARE @correo VARCHAR(300)
	
	BEGIN TRY
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT TOP 1 @nombreUsuario = nombreUsuario FROM dbo.Usuario WITH (NOLOCK) WHERE idUsuario = @idUsuario

		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT @sequencial = COUNT(*)+1 FROM Sri.Establecimiento WITH (NOLOCK)

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
		FROM OPENJSON (@json)
		WITH (
				 canton                VARCHAR(10) '$.canton'
				,actividad             VARCHAR(5)  '$.actividad'
				,agenteRetencion       VARCHAR(150)'$.agenteRetencion'
				,contribuyente         VARCHAR(5)  '$.contribuyente'
				,estab                 VARCHAR(5)  '$.estab'
				,contribuyenteEspecial VARCHAR(10) '$.contribuyenteEspecial'
				,obligadoContabilidad  VARCHAR(5)  '$.obligadoContabilidad'
				,nombreComercial       VARCHAR(150)'$.nombreComercial'
				,dirEstablecimiento    VARCHAR(300)'$.dirEstablecimiento'
				,telefono              VARCHAR(150)'$.telefono'
				,contribuyenteRimpe    VARCHAR(150)'$.contribuyenteRimpe'
				,correo                VARCHAR(300)'$.correo'
				)

		IF EXISTS (SELECT 1 FROM Sri.Establecimiento WHERE ruc = @ruc AND estab = @estab)
			BEGIN
				SELECT '0'code,'El numero de establecimiento ya se encuentra registrado' as 'message'
				RETURN 
			END 

		BEGIN TRAN 
				INSERT INTO Sri.Establecimiento
					(codEstab
                    ,canton
					,actividad
					,agenteRetencion
					,contribuyente
					,ruc
					,estab
					,contribuyenteEspecial
					,obligadoContabilidad
					,nombreComercial
					,dirEstablecimiento
					,telefono
					,correo
					,contribuyenteRimpe
					,fechaRegistro
					,usuario
                    ,idEntidad)
				SELECT 
				     @codEstab
                    ,@canton
				    ,@actividad
				    ,@agenteRetencion
				    ,@contribuyente
				    ,@ruc
				    ,@estab
				    ,@contribuyenteEspecial
				    ,@obligadoContabilidad
				    ,@nombreComercial
				    ,@dirEstablecimiento
					,@telefono
					,@correo
				    ,@contribuyenteRimpe
				    ,dbo.ufnGetDateEcuador()
				    ,@nombreUsuario
                    ,@idEntidad
					
		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' AS 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message'
	END CATCH 

END
