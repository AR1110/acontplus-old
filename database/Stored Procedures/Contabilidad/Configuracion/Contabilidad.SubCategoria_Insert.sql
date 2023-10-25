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
IF OBJECT_ID(N'Contabilidad.SubCategoria_Insert', N'P') IS NOT NULL
DROP PROCEDURE Contabilidad.SubCategoria_Insert
GO
CREATE PROCEDURE Contabilidad.SubCategoria_Insert @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @TipoId INT 
	DECLARE @CategoriaId INT 
	DECLARE @Codigo VARCHAR(10)
	DECLARE @Descripcion VARCHAR(150)
	DECLARE @IdUsuario INT 
	DECLARE @IdEntidad INT
	
	BEGIN TRY
		
		SELECT @TipoId      = TipoId
		      ,@CategoriaId = CategoriaId
			  ,@Descripcion = Descripcion
			  ,@IdUsuario   = IdUsuario
			  ,@IdEntidad   = IdEntidad 
			  ,@Codigo      = Codigo
		FROM OPENJSON(@json) 
		WITH (TipoId               INT '$.TipoId'
		     ,CategoriaId          INT '$.CategoriaId'
			 ,Codigo       VARCHAR(10) '$.Codigo'
			 ,Descripcion VARCHAR(150) '$.Descripcion'
			 ,IdUsuario            INT '$.IdUsuario'
			 ,IdEntidad            INT '$.IdEntidad'
		     )

		IF EXISTS (SELECT 1 FROM Contabilidad.SubCategoria WITH (NOLOCK) WHERE Codigo = @Codigo)
			BEGIN 
				SELECT 0
				RETURN 
			END 

		BEGIN TRAN 
			INSERT INTO [Contabilidad].[SubCategoria]
				   ([TipoId]
				   ,[CategoriaId]
				   ,[Codigo]
				   ,[Descripcion]
				   ,[Enabled]
				   ,[IdUsuario]
				   ,[IdEntidad])
				   
			SELECT @TipoId
			      ,@CategoriaId
				  ,@Codigo
				  ,@Descripcion
				  ,1
				  ,@IdUsuario
				  ,@IdEntidad
			SELECT SCOPE_IDENTITY()
		COMMIT TRAN

	END TRY 

	BEGIN CATCH 
		
		SELECT '0'code, 'Error al insertar SubCategoria' as 'message'
		IF @@TRANCOUNT > 0
			BEGIN 
				ROLLBACK TRAN;
			END 
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), 'api/SubCategoria/Post', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @IdUsuario)
		
	END CATCH 
END
GO
