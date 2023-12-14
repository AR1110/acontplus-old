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
-- Author:		Emilio Senguana
-- Create date: 15/05/2023
-- Description:	 
-- =============================================
IF OBJECT_ID(N'Recepcion.Dato_Adicional_Articulo_Insert', N'P') IS NOT NULL
DROP PROCEDURE Recepcion.Dato_Adicional_Articulo_Insert
GO
CREATE PROCEDURE Recepcion.Dato_Adicional_Articulo_Insert
	@idUsuarioRol AS INT
   ,@idDocumento INT 
   ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	
	
	
	--=============Datos capturados desde BD===========================
	DECLARE @idEntidad AS INT 
	DECLARE @claveAcceso VARCHAR(50) = (SELECT claveAcceso FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento)
	DECLARE @idUsuario INT = (SELECT idUsuario FROM  App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	DECLARE @artInfoAdicional AS TABLE (
		idInfoAdicional INT NOT NULL
		,idArticulo INT  NOT NULL		
		,idEtiqueta INT  NOT NULL
		,jsonAdicional NVARCHAR(MAX)  NULL
		
	)
	 
	-- SELECT '0'code, 'message' = CAST(@json AS VARCHAR(MAX))
	--Return
	BEGIN TRY		
		BEGIN TRAN
		INSERT INTO @artInfoAdicional  (idInfoAdicional, idArticulo, idEtiqueta, jsonAdicional)
		SELECT idInfoAdicional, idArticulo, idEtiqueta, jsonAdicional
		FROM OPENJSON(@json) WITH (
		  idInfoAdicional int,
		  idArticulo int,
		  idEtiqueta int,
		  jsonAdicional nvarchar(max) '$.jsonAdicional' AS JSON		
		) 

		---Datos Adicionales de articulo (etiquetas)
		IF EXISTS (SELECT 1 FROM @artInfoAdicional WHERE JSON_QUERY(jsonAdicional, '$') IS NOT NULL)
			BEGIN
								
				UPDATE Compra.InfoAdicional SET estado = 0 WHERE uniqueId = @claveAcceso AND estado = 1
				
				UPDATE  infoAdd SET infoAdd.idEtiqueta =  temp.idEtiqueta, infoAdd.jsonAdicional = temp.jsonAdicional, infoAdd.estado = 1 
				FROM  Compra.InfoAdicional infoAdd WITH(NOLOCK) 
				INNER JOIN @artInfoAdicional temp ON temp.idInfoAdicional = infoAdd.idInfoAdicional

				INSERT INTO  Compra.InfoAdicional (uniqueId, idArticulo, idEtiqueta, jsonAdicional, fechaRegistro)
				SELECT @claveAcceso, idArticulo, idEtiqueta, jsonAdicional, dbo.ufnGetDateEcuador() FROM @artInfoAdicional WHERE idInfoAdicional = 0 

				DELETE FROM Compra.InfoAdicional 
				WHERE estado = 0  AND uniqueId = @claveAcceso

			END
		ELSE
			BEGIN
				DELETE FROM Compra.InfoAdicional 
				WHERE estado = 0  AND uniqueId = @claveAcceso AND estado !=2
			END 
		COMMIT TRAN 
		SELECT '1' code,'Registrado Correctamente' as 'message', payload = (SELECT * FROM Compra.InfoAdicional 
				    WHERE uniqueId = (SELECT claveAcceso FROM Recepcion.DocumentoRecibido WHERE idDocumento = @idDocumento) FOR JSON PATH)
		RETURN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		SELECT '0'code,'Info: Error en el procedimiento : ' + ERROR_MESSAGE() as 'message'
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
									,'/DatoAdicionalArticulo/Insert'
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
