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
IF OBJECT_ID(N'FactElect.Doc_Relac_Serv_Insert', N'P') IS NOT NULL
DROP PROCEDURE FactElect.Doc_Relac_Serv_Insert 
GO
CREATE PROCEDURE FactElect.Doc_Relac_Serv_Insert @idDocumento INT, @codDoc VARCHAR(5),@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @DocumentoRelacionado AS TABLE(
		codDocSustento VARCHAR(5),
		numDocSustento VARCHAR(25),
		fechaEmisionDocSustento VARCHAR(100),
		codigo VARCHAR(5),
		baseImponible NUMERIC(18,2),
		porcentajeRetener NUMERIC(18,2),
		valorRetenido NUMERIC(18,2)
	)

	BEGIN TRY
		BEGIN TRAN 
			INSERT INTO @DocumentoRelacionado(codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
			SELECT 
				codDocSustento
			   ,numDocSustento
			   ,fechaEmisionDocSustento
			   ,codigo
			   ,baseImponible
			   ,porcentajeRetener 
			   ,valorRetenido
			FROM OPENJSON(@json)
			WITH (
					codDocSustento VARCHAR(5) '$.codDocSustento',
					numDocSustento VARCHAR(25) '$.numDocSustento',
					fechaEmisionDocSustento VARCHAR(100) '$.fechaEmisionDocSustento',
					codigo VARCHAR(5) '$.codigo',
					baseImponible NUMERIC(18,2) '$.baseImponible',
					porcentajeRetener NUMERIC(18,2) '$.porcentajeRetener',
					valorRetenido NUMERIC(18,2) '$.valorRetenido'
			     )

			INSERT INTO FactElect.DocRelacionado(idDocumentoRecibido,codDocSustento, numDocSustento,fechaEmisionDocSustento,codigo,baseImponible,porcentajeRetener,valorRetenido)
			SELECT @idDocumento,codDocSustento,numDocSustento,fechaEmisionDocSustento,codigo, baseImponible,porcentajeRetener,valorRetenido FROM @DocumentoRelacionado

		COMMIT TRAN 
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		BEGIN
			ROLLBACK TRAN; 
		END
		INSERT INTO ErroresSistema(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		VALUES (NEWID(),'/WS_DocumentoRelacionado/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),1)
	END CATCH 
END
GO
