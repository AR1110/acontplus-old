USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspSubFamiliaInsert]    Script Date: 10/11/2022 11:15:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez -- Modifier by Ignacio
-- Create date: 2021-06-21 - 2023 - 07- 28
-- Description:	Add category for restaurant
-- =============================================
IF OBJECT_ID(N'Restaurant.Category_Insert', N'P') IS NOT NULL
DROP PROCEDURE Restaurant.Category_Insert
GO
CREATE PROCEDURE Restaurant.Category_Insert
@idUsuarioRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON
	SET LANGUAGE SPANISH;
	DECLARE @idEntidad INT
	DECLARE @idUsuario INT 
	DECLARE @idSubFamilia INT 
	DECLARE @payload VARCHAR(MAX)
	DECLARE @sequential INT 
	DECLARE @code VARCHAR(15)
	
	---- Added ---
	,@idFamilia		INT
	,@descripcion	NVARCHAR(50)
	,@siglas		NVARCHAR(30)
	,@montoObjetivo DECIMAL(10,5)
	,@applicationId	INT
	,@imgUrl		VARCHAR(500)

	BEGIN TRY
		SELECT
			@idFamilia		= ISNULL(idFamilia, 0)
			,@descripcion	= descripcion
			,@siglas		= siglas
			,@montoObjetivo = ISNULL(montoObjetivo, 0)
			,@applicationId  = ISNULL(applicationId, 0)
			,@imgUrl		= ISNULL(imgUrl, NULL)
		FROM OPENJSON(@json) WITH(
			idFamilia	INT				 '$.idFamilia'
			,descripcion NVARCHAR(100)	 '$.descripcion'
			,siglas		NVARCHAR(3)		 '$.siglas'
			,montoObjetivo DECIMAL(10,5) '$.montoObjetivo'
			,applicationId INT			 '$.applicationId'
			,imgUrl VARCHAR(500)		 '$.imgUrl'
		)
			   
		SELECT @sequential = COUNT(*)+1 FROM dbo.SubFamilia WITH (NOLOCK)

		SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SET @code = ('F'+Helper.F_Auto_Sequential(@sequential))

		IF EXISTS( SELECT 1 FROM SubFamilia WITH (NOLOCK) WHERE descripcion = @descripcion AND idEntidad = @idEntidad)
			BEGIN 
				SELECT '0'code,'La Sub-Familia: '+@descripcion+' ya se encuentra registrada' as 'message'
				RETURN; 
			END

		IF EXISTS( SELECT 1 FROM SubFamilia WITH (NOLOCK) WHERE siglas = @siglas AND idEntidad = @idEntidad)
			BEGIN 
				SELECT '0'code,'La sigla: '+@siglas+' ya se encuentra registrada' as 'message'
				RETURN; 
			END

        IF @applicationId IS NULL OR @applicationId = ''
            BEGIN
                SET @applicationId = 1
            END
		BEGIN TRAN 
			      INSERT INTO SubFamilia(idFamilia,descripcion,siglas,codigo,montoObjetivo,ultimoSecuencial,idUsuario,idEntidad, applicationId, s3ObjectUrl)

				  SELECT CASE WHEN @idFamilia = 0 THEN NULL ELSE @idFamilia END
						,@descripcion,@siglas,@code,@montoObjetivo,1,@idUsuario,@idEntidad, @applicationId, @imgUrl

				 SET @idSubFamilia = @@IDENTITY

				 SET @payload = (SELECT idSubFamilia = @idSubFamilia FOR JSON PATH)

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente' as 'message',@payload as payload
		RETURN;
	END TRY
	
	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento: ' as 'message'
		RETURN 
	END CATCH 

END
