USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspSubFamiliaUpdate]    Script Date: 10/11/2022 11:17:46 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-06-21
-- Description:	Sp para actualizar las subfamilias
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.Subfamilia_Update
    @userRoleId INT 
   ,@id INT 
   ,@json VARCHAR(MAX)
   ,@s3ObjectKey VARCHAR(500) NULL
   ,@s3ObjectUrl VARCHAR(800) NULL
AS
BEGIN
	SET NOCOUNT ON
	SET LANGUAGE SPANISH

    DECLARE @idFamilia INT ,@descripcion VARCHAR(50) ,@montoObjetivo NUMERIC(10,5) ,@estado BIT ,@secuencial INT

	BEGIN TRY
        
        SELECT @idFamilia     = idFamilia
              ,@descripcion   = descripcion
              ,@montoObjetivo = @montoObjetivo
              ,@estado        = estado
              ,@secuencial    = secuencial
        FROM OPENJSON(@json) WITH 
        ( 
            idFamilia     INT 
           ,descripcion   VARCHAR(300)
           ,montoObjetivo NUMERIC(10,5)
           ,estado        BIT
           ,secuencial    INT
        )


        IF(LEN(LTRIM(RTRIM(@s3ObjectKey))) = 0)
			BEGIN 
				SELECT  @s3ObjectKey = s3ObjectKey, @s3ObjectUrl = s3ObjectUrl  FROM SubFamilia WHERE idSubFamilia = @id
			END

		BEGIN TRAN 
			UPDATE SubFamilia SET
				 idFamilia        = CASE WHEN @idFamilia = 0 THEN NULL ELSE @idFamilia END  
				,descripcion      = LTRIM(RTRIM(@descripcion))
				,montoObjetivo    = @montoObjetivo
                ,ultimoSecuencial = @secuencial
				,estado           = @estado
				,s3ObjectKey      = @s3ObjectKey
				,s3ObjectUrl      = @s3ObjectUrl
			WHERE idSubFamilia = @id

			UPDATE a SET a.estado = @estado
			FROM Articulo a
				INNER JOIN Subfamilia s WITH(NOLOCK) ON a.idSubfamilia = s.idSubfamilia
			WHERE s.idSubfamilia = @id

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
		RETURN;
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as 'message'
		RETURN 
	END CATCH 
END
