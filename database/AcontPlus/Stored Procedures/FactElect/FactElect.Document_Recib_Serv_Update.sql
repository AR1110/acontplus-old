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
IF OBJECT_ID(N'FactElect.Document_Recib_Serv_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Document_Recib_Serv_Update 
GO
CREATE PROCEDURE FactElect.Document_Recib_Serv_Update @idDocumento INT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codDoc AS VARCHAR(5)
	DECLARE @table as TABLE(
		idDocRelacionado INT UNIQUE NOT NULL
	   ,numDocSustento VARCHAR(20)
	   ,codDocSustento VARCHAR(5)
	   ,claveAcceso VARCHAR(49)
	)


	BEGIN TRY 
		SELECT TOP 1 @codDoc = codDoc FROM Recepcion.DocumentoRecibido WITH (NOLOCK) WHERE idDocumento = @idDocumento
		BEGIN TRAN 
			INSERT INTO @table (idDocRelacionado,numDocSustento,codDocSustento,claveAcceso)
			SELECT 
			   dr.idDocRelacionado
			  ,dr.numDocSustento
			  ,dr.codDocSustento
			  ,claveAcceso = (SELECT TOP 1 
								de.claveAcceso
							  FROM dbo.DocumentoElectronico de 
							  INNER JOIN dbo.Entidad e ON e.idEntidad = de.idEntidad 
							  WHERE e.ruc = d.identificacionReceptor
							  AND de.codDoc = dr.codDocSustento
  							  AND de.numEstab+de.ptoEmision+Helper.F_Auto_Sequential(de.nroDocumento) = dr.numDocSustento)
			FROM 
			FactElect.DocRelacionado dr
			INNER JOIN Recepcion.DocumentoRecibido d ON d.idDocumento = dr.idDocumentoRecibido
			WHERE d.idDocumento = @idDocumento

			IF @codDoc = '04'
				BEGIN 
					UPDATE Recepcion.DocumentoRecibido SET downloaded = 'DR' WHERE idDocumento = @idDocumento
				END 

			IF @codDoc = '07'
				BEGIN
					UPDATE Recepcion.DocumentoRecibido SET downloaded = 'DR', complete = 1 WHERE idDocumento = @idDocumento
				END 
			

			UPDATE dr SET 
				dr.claveAcceso = t.claveAcceso
			FROM FactElect.DocRelacionado dr 
			INNER JOIN @table t ON  t.idDocRelacionado = dr.idDocRelacionado

		COMMIT TRAN 
	END TRY 
	
	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
	END CATCH 

END
GO
