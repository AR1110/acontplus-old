USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for insert tax sustentos
-- =============================================
IF OBJECT_ID(N'FactElect.RetAts_Doc_Sust_Ret_Insert', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Insert
GO
CREATE PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Insert @idUsuarioRol INT  
,@idDocSust INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 
		,@idRetencionAts INT

	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN 
			SET @idRetencionAts = (SELECT idRetencionAts FROM FactElect.RetAtsDocSustento WHERE idRetAtsDocSustento = @idDocSust)

			INSERT INTO FactElect.RetencionAtsRet(idRetencionAts, idRetAtsDocSustento, uniqueIdDoc, codigo, codigoRetencion
			, baseImponible, porcentajeRetener, valorRetenido, fechaPagoDiv, imRentaSoc, ejerFisUtDiv
			, numCajBan, precCajBan)
			SELECT @idRetencionAts, @idDocSust, uniqueIdDoc, codigo, codigoRetencion, baseImponible, porcentajeRetener, valorRetenido, fechaPagoDiv, imRentaSoc, ejerFisUtDiv, numCajBan, precCajBan
			FROM OPENJSON(@json) 
			WITH(
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
				codigo VARCHAR(1) '$.codigo'
				,codigoRetencion VARCHAR(5) '$.codigoRetencion'
				,baseImponible NUMERIC(18,5) '$.baseImponible'
				,porcentajeRetener NUMERIC(18,5) '$.porcentajeRetener'
				,valorRetenido NUMERIC(18,5) '$.valorRetenido'
				,fechaPagoDiv DATE '$.fechaPagoDiv'
				,imRentaSoc NUMERIC(18,5) '$.imRentaSoc'
				,ejerFisUtDiv INT '$.ejerFisUtDiv'
				,numCajBan INT '$.numCajBan'
				,precCajBan NUMERIC(18,5) '$.precCajBan'
			)

			SELECT '1' code, 'Retencion del sustento guardada con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/POST', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
