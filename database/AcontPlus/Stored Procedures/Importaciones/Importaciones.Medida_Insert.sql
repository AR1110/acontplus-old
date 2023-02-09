-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
IF OBJECT_ID(N'Importaciones.Medida_Insert', N'P') IS NOT NULL
DROP PROCEDURE Importaciones.Medida_Insert 
GO
CREATE PROCEDURE Importaciones.Medida_Insert @idRol INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idUsuario INT
	DECLARE @idEntidad INT
	DECLARE @count INT
	DECLARE @sequential INT
	DECLARE @table table 
	(
		id INT IDENTITY(1,1) UNIQUE NOT NULL
	   ,descripcion VARCHAR(200) NOT NULL
	   ,importacion BIT DEFAULT 1 
	)
	SELECT @sequential = COUNT(*) FROM dbo.Medida

	SELECT @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

	INSERT INTO @table(descripcion) 
	SELECT js.descripcion FROM OPENJSON(@json) WITH (descripcion VARCHAR(200) '$.descripcion') as js

	SELECT @count = COUNT(*) FROM @table 

	BEGIN TRY
		BEGIN TRAN 
			INSERT INTO dbo.Medida(codigo,descripcion,fechaRegistro,idUsuario,idEntidad,importacion)
			SELECT 'ME'+Helper.F_Auto_Sequential(id+@sequential),descripcion,dbo.ufnGetDateEcuador(),@idUsuario,@idEntidad,importacion FROM @table 

			INSERT INTO Importaciones.Historial(idUsuario,idEntidad,modulo,cantidad,fechaRegistro)
			SELECT @idUsuario,@idEntidad,'/Almacen/Medida',@count,dbo.ufnGetDateEcuador()

		COMMIT TRAN 
		SELECT '1' code, 'Medidas Importadas correctamente' as 'message'
		RETURN 
	END TRY 
	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0' code, 'Error en el procedimiento: '+ERROR_MESSAGE() as 'message'
		INSERT INTO ErroresSistema
								   (token
								   ,method
								   ,errorNumber
								   ,errorSeverity 
								   ,errorState
								   ,errorProcedure
								   ,errorLine
								   ,errorMessage
								   ,errorDate
								   ,idUsuario)
							VALUES
									(NEWID()
									,'/ImportacionMedida'
									,ERROR_NUMBER()
									,ERROR_SEVERITY()
									,ERROR_STATE()
									,ERROR_PROCEDURE()
									,ERROR_LINE()
									,ERROR_MESSAGE()
									,GETDATE()
									,@idUsuario)
	END CATCH
END
GO