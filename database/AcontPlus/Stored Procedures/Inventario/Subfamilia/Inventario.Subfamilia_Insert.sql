USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspSubFamiliaInsert]    Script Date: 10/11/2022 11:15:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-06-21
-- Description:	SP Par registrar sub familias 
-- =============================================
IF OBJECT_ID(N'Inventario.Subfamilia_Insert', N'P') IS NOT NULL
DROP PROCEDURE Inventario.Subfamilia_Insert
GO
CREATE PROCEDURE Inventario.Subfamilia_Insert
	@idUsuarioRol int 
   ,@idFamilia int
   ,@descripcion nvarchar(50)
   ,@siglas nvarchar (30)
   ,@montoObjetivo decimal(10,5)
   ,@s3ObjectKey VARCHAR(500) NULL
   ,@s3ObjectUrl VARCHAR(800) NULL
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

	BEGIN TRY 
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

		IF(LEN(LTRIM(RTRIM(@s3ObjectKey))) = 0)
			BEGIN
				SET @s3ObjectKey = NULL
				SET @s3ObjectUrl = NULL
			END
		BEGIN TRAN 
			      INSERT INTO SubFamilia 
						(idFamilia
						,descripcion,siglas,codigo,montoObjetivo,ultimoSecuencial,idUsuario,idEntidad, s3ObjectKey, s3ObjectUrl)
				  SELECT CASE WHEN @idFamilia = 0 THEN NULL ELSE @idFamilia END
						,@descripcion,@siglas,@code,@montoObjetivo,1,@idUsuario,@idEntidad, @s3ObjectKey, @s3ObjectUrl

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
