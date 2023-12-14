USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2023-02-22
-- Description: sp for update retencion sustentos
-- =============================================
IF OBJECT_ID(N'FactElect.RetAts_Doc_Sust_Ret_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Update
GO
CREATE PROCEDURE FactElect.RetAts_Doc_Sust_Ret_Update @idUsuarioRol INT 
,@id INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @idUsuario INT 

	SET @idUsuario = (SELECT idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @idUsuarioRol)
	BEGIN TRY
		BEGIN TRAN 

			UPDATE rr SET rr.codigo = t.codigo
			,rr.codigoRetencion = t.codigoRetencion
			,rr.baseImponible = t.baseImponible
			,rr.porcentajeRetener = t.porcentajeRetener
			,rr.valorRetenido = t.valorRetenido
			,rr.fechaPagoDiv = t.fechaPagoDiv
			,rr.imRentaSoc = t.imRentaSoc
			,rr.ejerFisUtDiv = t.ejerFisUtDiv
			,rr.numCajBan = t.numCajBan
			,rr.precCajBan = t.precCajBan
			FROM FactElect.RetencionAtsRet rr WITH (ROWLOCK)
			JOIN (SELECT idRetencionAtsRet, codigo, codigoRetencion, baseImponible, porcentajeRetener, valorRetenido
			, fechaPagoDiv, imRentaSoc, ejerFisUtDiv, numCajBan, precCajBan
			FROM OPENJSON(@json) 
			WITH(
				idRetencionAtsRet INT '$.idRetencionAtsRet'
				,codigo TINYINT '$.codigo'
				,codigoRetencion VARCHAR(5) '$.codigoRetencion'
				,baseImponible NUMERIC(18,5) '$.baseImponible'
				,porcentajeRetener NUMERIC(18,5) '$.porcentajeRetener'
				,valorRetenido NUMERIC(18,5) '$.valorRetenido'
				,fechaPagoDiv DATE '$.fechaPagoDiv'
				,imRentaSoc NUMERIC(18,5) '$.imRentaSoc'
				,ejerFisUtDiv INT '$.ejerFisUtDiv'
				,numCajBan INT '$.numCajBan'
				,precCajBan NUMERIC(18,5) '$.precCajBan'
			)) as t ON t.idRetencionAtsRet = rr.idRetencionAtsRet
			WHERE rr.idRetencionAtsRet = @id

			SELECT '1' code, 'Retención del sustento actualizada con exito'  as 'message'
		COMMIT TRAN
	END TRY
	BEGIN CATCH
	SELECT '0' code, 'Error en base de datos: ' + ERROR_MESSAGE() as 'message'
		IF (@@TRANCOUNT > 0)
			ROLLBACK TRAN
		INSERT INTO ErroresSistema(token, method, errorNumber, errorSeverity, errorState, errorProcedure, errorLine, errorMessage, errorDate, idUsuario)
		VALUES (NEWID(), '/PUT', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), dbo.ufnGetDateEcuador(), @idUsuario)
	END CATCH
END
GO
