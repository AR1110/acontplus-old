USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-02-21
-- Description: sp for update retencion ats
-- =============================================
IF OBJECT_ID(N'FactElect.RetencionAts_Update', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetencionAts_Update 
GO
CREATE PROCEDURE FactElect.RetencionAts_Update @idRol INT
,@id INT
,@infoCompRet VARCHAR(MAX) 
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE   @idEntidad INT 
	,@idPuntoEmision INT

	DECLARE  @ambiente nvarchar(1)
			,@tipoEmision TINYINT 
			,@idTipoDocumento INT
			,@secuencial VARCHAR(15)
			,@fechaEmision DATE
			,@ruc VARCHAR(15)
			,@claveAcceso VARCHAR(49)
			,@idUsuario INT
			,@idProveedor INT
			
	DECLARE @tblInfoCompRet AS TABLE(fechaEmision DATETIME NOT NULL
		,codEstab VARCHAR(25) NOT NULL
		,estab VARCHAR(5) NOT NULL
		,ptoEmi VARCHAR(5) NOT NULL
		,secuencial VARCHAR(9) NOT NULL
		,contribuyentEspecial VARCHAR(13) NULL
		,obligadoContabilidad VARCHAR(2) NULL
		,tipoIdentificacionSujetoRetenido VARCHAR(2) NULL
		,tipoSujetoRetenido VARCHAR(2) NULL
		,parteRel VARCHAR(2) NOT NULL
		,idCliente INT NULL
		,razonSocialSujetoRetenido VARCHAR(300) NULL
		,identificacionSujetoRetenido VARCHAR(13) NULL
		,periodoFiscal VARCHAR(8) NULL
	) 

	IF NOT EXISTS(SELECT 1 FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @id)
		BEGIN
			SELECT '0' code, 'Ingrese al menos un documento de sustento' as 'message'
			RETURN
		END
	
		IF NOT EXISTS(SELECT 1 FROM FactElect.RetAtsImpDocSustento WHERE idRetencionAts = @id)
		BEGIN
					SELECT '0' code, 'Debe agregar al menos un impuesto a los documentos de sustento' as 'message'
			RETURN
		END
			IF NOT EXISTS(SELECT 1 FROM FactElect.RetencionAtsRet WHERE idRetencionAts = @id)
		BEGIN
					SELECT '0' code, 'Debe agregar al menos una retencion al documento de sustento' as 'message'
			RETURN
		END
		--IF NOT EXISTS(SELECT 1 FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @id)
		--BEGIN
		--	SELECT '0' code, 'Ingrese al menos un documento de sustento' as 'message'
		--	RETURN
		--END

		SELECT @idEntidad = idEntidad 
 			,@idUsuario = idUsuario
			FROM App.UsuarioRol WHERE idUsuarioRol = @idRol
 
			INSERT INTO @tblInfoCompRet(codEstab, estab, ptoEmi, secuencial, fechaEmision, contribuyentEspecial, obligadoContabilidad, tipoIdentificacionSujetoRetenido, tipoSujetoRetenido, parteRel, idCliente, razonSocialSujetoRetenido, identificacionSujetoRetenido, periodoFiscal)
			SELECT codEstab, estab, ptoEmi, secuencial, fechaEmision, contribuyentEspecial, obligadoContabilidad, tipoIdentificacionSujetoRetenido, tipoSujetoRetenido, parteRel, idCliente, razonSocialSujetoRetenido, identificacionSujetoRetenido, periodoFiscal
			FROM OPENJSON(@infoCompRet) WITH(
								codEstab VARCHAR(25) '$.codEstab'
					,estab VARCHAR(5) '$.estab'
					,ptoEmi VARCHAR(5) '$.ptoEmi'
					,secuencial VARCHAR(6) '$.secuencial'
					,fechaEmision DATETIME '$.fechaEmision'
					,contribuyentEspecial VARCHAR(13) '$.contribuyentEspecial'
					,obligadoContabilidad VARCHAR(2) '$.obligadoContabilidad'
					,tipoIdentificacionSujetoRetenido VARCHAR(2) '$.tipoIdentificacionSujetoRetenido'
					,tipoSujetoRetenido VARCHAR(2) '$.tipoSujetoRetenido'
					,parteRel VARCHAR(2) '$.parteRel'
					,idCliente INT '$.idCliente'
					,razonSocialSujetoRetenido VARCHAR(300) '$.razonSocialSujetoRetenido'
					,identificacionSujetoRetenido VARCHAR(13) '$.identificacionSujetoRetenido'
					,periodoFiscal VARCHAR(8) '$.periodoFiscal'
			)
			
			IF EXISTS (SELECT 1 FROM @tblInfoCompRet
						where tipoIdentificacionSujetoRetenido = '04' AND LEN(LTRIM(RTRIM(identificacionSujetoRetenido))) != 13)
				BEGIN
					SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
					RETURN
				END

			IF EXISTS (SELECT 1 FROM @tblInfoCompRet
						where tipoIdentificacionSujetoRetenido = '05' AND LEN(LTRIM(RTRIM(identificacionSujetoRetenido))) != 10)
				BEGIN
					SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
					RETURN
				END

			SET @tipoEmision = 1
			
			SET @ruc = (SELECT RUC FROM Entidad WHERE idEntidad = @idEntidad)

			SELECT TOP 1  @idPuntoEmision = idPuntoEmision, @ambiente = ambiente FROM PuntoEmision p INNER JOIN @tblInfoCompRet t ON p.codEstab = t.codEstab AND p.ptoEmi = t.ptoEmi
	 
			SET @idProveedor = ISNULL((SELECT idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = (SELECT LTRIM(RTRIM(identificacionSujetoRetenido))  FROM @tblInfoCompRet)),0)
		
			IF (@idProveedor IS NULL OR @idProveedor = 0)
				BEGIN
					SELECT '0' code, 'No se encontro proveedor' as 'message'
					RETURN
				END

			SELECT @fechaEmision = fechaEmision FROM @tblInfoCompRet
			
 
			SET @secuencial = (SELECT secuencial FROM FactElect.RetencionAts WHERE idRetencionAts = @id)
 
			SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(estab)   
			 ,'07'
												   ,CAST(@ambiente as nvarchar)
												   ,CAST(@tipoEmision as nvarchar)                         
			,dbo.AFTConvertDate(@fechaEmision)                
			,@ruc                                             
			,estab+ptoEmi                                                     
			,Helper.F_Auto_Sequential(@secuencial)) 
			 FROM @tblInfoCompRet
			
			IF @claveAcceso IS NULL
				BEGIN
					SELECT '0' as code, 'Error al generar clave acceso ' as 'message' 
					RETURN
				END


	BEGIN TRY
		BEGIN TRAN
			
 
			UPDATE ret SET  ret.codEstab = t.codEstab
			,ret.claveAcceso = @claveAcceso 
			,ret.estab = t.estab
			,ret.ptoEmi = t.ptoEmi 
			,ret.fechaEmision = t.fechaEmision
			,ret.contribuyentEspecial = t.contribuyentEspecial
			,ret.obligadoContabilidad = t.obligadoContabilidad
			,ret.tipoIdentificacionSujetoRetenido = t.tipoIdentificacionSujetoRetenido
			,ret.tipoSujetoRetenido = t.tipoSujetoRetenido 
			,ret.parteRel = t.parteRel
			,ret.idCliente = t.idCliente
			,ret.razonSocialSujetoRetenido = t.razonSocialSujetoRetenido
			,ret.identificacionSujetoRetenido = t.identificacionSujetoRetenido
			,ret.periodoFiscal = t.periodoFiscal
			,ret.idUsuario = @idUsuario
			,ret.idProveedor   = @idProveedor

			FROM  FactElect.RetencionAts ret
			JOIN (SELECT @id idRetencionAts, codEstab,estab,ptoEmi,fechaEmision,contribuyentEspecial,obligadoContabilidad
			,tipoIdentificacionSujetoRetenido,tipoSujetoRetenido,parteRel,idCliente
			,razonSocialSujetoRetenido,identificacionSujetoRetenido,periodoFiscal
			FROM @tblInfoCompRet) AS t on ret.idRetencionAts = t.idRetencionAts
			WHERE ret.idRetencionAts = @id

			--DocumentoElectronico
			DECLARE @isAutomatic INT
			,@idDoc BIGINT

			SET @isAutomatic = (SELECT isAutomatic FROM FactElect.Config_Comprob_Elect WITH (NOLOCK) WHERE codEstab = (SELECT TOP 1 codEstab FROM @tblInfoCompRet))

			SET @idDoc = (SELECT idDocumentoElectronico FROM DocumentoElectronico WITH (NOLOCK)
														WHERE idDocumento = @id 
														AND codDoc = '07' 
														AND versionComp = '2.0.0')

			UPDATE DocumentoElectronico SET  idPuntoEmision = @idPuntoEmision
			,numEstab = (SELECT estab FROM @tblInfoCompRet)
			,ptoEmision = (SELECT ptoEmi FROM @tblInfoCompRet)
			,claveAcceso = @claveAcceso
			,isAutomatic = @isAutomatic
			,fechaEmision = @fechaEmision
			,codigoAutorizacion = @claveAcceso
			,idUsuario = @idUsuario
			,idEntidad = @idEntidad
			,codEstado = 1
			,ruc = @ruc
			,numeroIdentificacion = (SELECT identificacionSujetoRetenido FROM @tblInfoCompRet)
			,codEstab = (SELECT codEstab FROM @tblInfoCompRet)
			 
			--JOIN (SELECT codEstab, estab, ptoEmi, identificacionSujetoRetenido FROM @tblInfoCompRet) r ON
			WHERE  idDocumento = @id AND codDoc = '07' AND versionComp = '2.0.0'

			SELECT '1' code, 'Retencion actualizada con exito'  as 'message'
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
