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
CREATE OR ALTER PROCEDURE Inventario.Subfamilia_Insert
	@userRoleId int
   ,@json VARCHAR(MAX)
   ,@s3ObjectKey VARCHAR(500) NULL
   ,@s3ObjectUrl VARCHAR(800) NULL
AS
BEGIN
	SET NOCOUNT ON
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @idEntidad INT ,@idUsuario INT ,@idSubFamilia INT ,@payload VARCHAR(MAX)

     --> Data
    DECLARE @idFamilia INT ,@descripcion VARCHAR(300) ,@siglas VARCHAR(30) ,@montoObjetivo NUMERIC(10,5)
    

	BEGIN TRY 

		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT @idFamilia     = idFamilia
              ,@descripcion   = descripcion
              ,@montoObjetivo = montoObjetivo
              ,@siglas        = siglas
        FROM OPENJSON(@json) WITH 
        ( 
            idFamilia     INT 
           ,descripcion   VARCHAR(300)
           ,montoObjetivo NUMERIC(10,5)
           ,siglas        VARCHAR(100)
        )

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
						(idFamilia, descripcion, siglas,codigo  ,montoObjetivo,ultimoSecuencial,idUsuario,idEntidad)
				 SELECT @idFamilia,@descripcion,@siglas,newid(),@montoObjetivo,1,@idUsuario,@idEntidad

				 SET @idSubFamilia = @@IDENTITY

                 
                 --> Photo
                 IF @s3ObjectKey IS NOT NULL AND @s3ObjectUrl IS NOT NULL
                    BEGIN 
                        INSERT INTO [Inventario].[SubcategoryPhoto] ([SubcategoryId], [S3ObjectKey], [S3ObjectUrl], [IsDefault], [UserId] ) 
                        SELECT @idSubFamilia,@s3ObjectKey,@s3ObjectUrl,1,@idUsuario
                    END 

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
