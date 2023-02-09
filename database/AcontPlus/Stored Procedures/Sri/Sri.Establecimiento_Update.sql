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
IF OBJECT_ID(N'Sri.Establecimiento_Update', N'P') IS NOT NULL
DROP PROCEDURE Sri.Establecimiento_Update 
GO
CREATE PROCEDURE Sri.Establecimiento_Update @idRol INT,@id INT,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad INT 
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

	SELECT @idEntidad = idEntidad  FROM App.UsuarioRol WHERE idUsuarioRol = @idRol

	SELECT @ruc = ruc FROM dbo.Entidad WHERE idEntidad = @idEntidad

	BEGIN TRY 
		BEGIN TRAN 
			SELECT 
					 @canton                = canton
					,@actividad             = actividad
					,@agenteRetencion       = agenteRetencion
					,@contribuyente         = contribuyente
					,@contribuyenteEspecial = contribuyenteEspecial
					,@obligadoContabilidad  = obligadoContabilidad
					,@nombreComercial       = nombreComercial
					,@dirEstablecimiento    = dirEstablecimiento
					,@contribuyenteRimpe    = contribuyenteRimpe
			FROM OPENJSON (@json)
			WITH (
					 canton                VARCHAR(10) '$.canton'
					,actividad             VARCHAR(5)  '$.actividad'
					,agenteRetencion       VARCHAR(150)'$.agenteRetencion'
					,contribuyente         VARCHAR(5)  '$.contribuyente'
					,contribuyenteEspecial VARCHAR(10) '$.contribuyenteEspecial'
					,obligadoContabilidad  VARCHAR(5)  '$.obligadoContabilidad'
					,nombreComercial       VARCHAR(150)'$.nombreComercial'
					,dirEstablecimiento    VARCHAR(300)'$.dirEstablecimiento'
					,contribuyenteRimpe    VARCHAR(150)'$.contribuyenteRimpe'
				 )

			UPDATE Sri.Establecimiento SET
				canton                = @canton
			   ,actividad             = @actividad
			   ,agenteRetencion       = @agenteRetencion
			   ,contribuyente         = @contribuyente
			   ,contribuyenteEspecial = @contribuyenteEspecial
			   ,obligadoContabilidad  = @obligadoContabilidad
			   ,nombreComercial       = @nombreComercial
			   ,dirEstablecimiento    = @dirEstablecimiento
			   ,contribuyenteRimpe    = @contribuyenteRimpe
			WHERE idEstablecimiento = @id
		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message'
		RETURN 
	END TRY 

	BEGIN CATCH 
			BEGIN
				ROLLBACK TRAN; 
			END
			SELECT '0'code,'Info: Error en el procedimiento: ' + ERROR_MESSAGE() as  'message'
	END CATCH

END
GO
