USE [AcontPlus]
GO
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
IF OBJECT_ID(N'Contabilidad.SubCategoria_Update', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.SubCategoria_Update
GO
CREATE PROCEDURE Contabilidad.SubCategoria_Update 
	 @userRoleId INT
	,@Id INT
	,@TipoId INT 
	,@CategoriaId INT 
	,@Descripcion VARCHAR(150)
	,@IdUsuario INT 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	BEGIN TRY
		
		BEGIN TRAN 
			UPDATE Contabilidad.SubCategoria
			   SET [TipoId]      = @TipoId
				  ,[CategoriaId] = @CategoriaId
				  ,[Descripcion] = @Descripcion
				  ,[UpdatedAt]   = GETDATE()
			 WHERE Id = @Id
		COMMIT TRAN
		SELECT '1'code,'Actualizado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH 
		SELECT '0'code, 'Error al Actualizar SubCategoria' as 'message'
		IF @@TRANCOUNT > 0
			BEGIN 
				ROLLBACK TRAN;
			END 
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), 'api/SubCategoria/Put', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @IdUsuario)
	END CATCH 
END
GO
