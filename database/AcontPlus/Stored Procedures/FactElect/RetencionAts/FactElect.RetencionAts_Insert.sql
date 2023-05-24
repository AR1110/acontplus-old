USE AcontPlus

SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-12-15
-- Description: sp for insert retencion ats
-- =============================================
IF OBJECT_ID(N'FactElect.RetencionAts_Insert', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetencionAts_Insert 
GO
CREATE PROCEDURE FactElect.RetencionAts_Insert @idRol INT
,@infoCompRet VARCHAR(MAX)
,@docsSust VARCHAR(MAX)
,@impuestos VARCHAR(MAX)
,@retenciones VARCHAR(MAX)
,@reembolsos VARCHAR(MAX) = NULL
,@payments VARCHAR(MAX)
,@infoAdicional VARCHAR(MAX) = NULL
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @tblInfoCompRet AS TABLE(
		fechaEmision DATETIME NOT NULL
		,codEstab VARCHAR(25) NOT NULL
		,estab VARCHAR(5) NOT NULL
		,ptoEmi VARCHAR(5) NOT NULL
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

	DECLARE @tblDocs AS TABLE(
		uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
		,codSustento VARCHAR(2) NULL
		,codDocSustento VARCHAR(2) NULL
		,numDocSustento VARCHAR(15) NULL
		,fechaEmisionDocSustento DATETIME NOT NULL
		,fechaRegistroContable DATETIME NULL
		,numAutDocSustento VARCHAR(49) NULL
		,pagoLocExt VARCHAR(2) NULL
		,tipoRegi VARCHAR(2) NULL
		,paisEfecPago VARCHAR(3) NULL
		,aplicConvDobTrib VARCHAR(2) NULL
		,pagExtSujRetNorLeg VARCHAR(2) NULL
		,pagoRegFis VARCHAR(2) NULL
		,totalComprobantesReembolso NUMERIC(18,5) NULL
		,totalBaseImponibleReembolso NUMERIC(18,5) NULL
		,totalImpuestoReembolso NUMERIC(18,5) NULL
		,totalSinImpuestos NUMERIC(18,5) NOT NULL
		,importeTotal NUMERIC(18,5) NOT NULL
	)

	DECLARE @tblTaxes AS TABLE(
		uniqueIdDoc UNIQUEIDENTIFIER NOT NULL,
		codImpuestoDocSustento TINYINT NOT NULL,
		codigoPorcentaje VARCHAR(4) NOT NULL,
		baseImponible  NUMERIC(18,5),
		tarifa NUMERIC(18,5) NULL,
		valorImpuesto  NUMERIC(18,5)
	)

	DECLARE @tblRetenciones AS TABLE(
		uniqueIdDoc UNIQUEIDENTIFIER NOT NULL 
		,codigo TINYINT NOT NULL
		,codigoRetencion VARCHAR(5) NOT NULL
		,baseImponible NUMERIC(18,5) NULL
		,porcentajeRetener NUMERIC(18,5) NULL
		,valorRetenido NUMERIC(18,5) NULL
		,fechaPagoDiv DATE NULL
		,imRentaSoc NUMERIC(18,5) NULL
		,ejerFisUtDiv INT NULL
		,numCajBan INT NULL
		,precCajBan NUMERIC(18,5) NULL
		
	)

	DECLARE @tblPayments AS TABLE(
			uniqueIdDoc UNIQUEIDENTIFIER NOT NULL 
		,formaPago VARCHAR(2) NOT NULL
		,total NUMERIC(18,5) NOT NULL
	)
	DECLARE @tblAddInfo AS TABLE(
		nombre VARCHAR(100) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

	INSERT INTO @tblInfoCompRet(codEstab, estab, ptoEmi, fechaEmision, contribuyentEspecial, obligadoContabilidad, tipoIdentificacionSujetoRetenido, tipoSujetoRetenido, parteRel, idCliente, razonSocialSujetoRetenido, identificacionSujetoRetenido, periodoFiscal)
			SELECT codEstab, estab, ptoEmi, fechaEmision, contribuyentEspecial, obligadoContabilidad, tipoIdentificacionSujetoRetenido, tipoSujetoRetenido, parteRel, idCliente, razonSocialSujetoRetenido, identificacionSujetoRetenido, periodoFiscal
			FROM OPENJSON(@infoCompRet) WITH(
								codEstab VARCHAR(25) '$.codEstab'
					,estab VARCHAR(5) '$.estab'
					,ptoEmi VARCHAR(5) '$.ptoEmi'
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

			INSERT INTO @tblDocs(uniqueIdDoc, codSustento, codDocSustento, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable, numAutDocSustento, pagoLocExt, tipoRegi, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis, totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal)
			SELECT uniqueIdDoc, codSustento, codDocSustento, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable, numAutDocSustento, pagoLocExt, tipoRegi, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis, totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal
			FROM OPENJSON(@docsSust) WITH(
					uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc'
				,codSustento VARCHAR(2) '$.codSustento'
				,codDocSustento VARCHAR(2) '$.codDocSustento'
				,numDocSustento VARCHAR(15) '$.numDocSustento'
				,fechaEmisionDocSustento DATETIME '$.fechaEmisionDocSustento'
				,fechaRegistroContable DATETIME '$.fechaRegistroContable'
				,numAutDocSustento VARCHAR(49) '$.numAutDocSustento'
				,pagoLocExt VARCHAR(2) '$.pagoLocExt'
				,tipoRegi VARCHAR(2) '$.tipoRegi'
				,paisEfecPago VARCHAR(3) '$.paisEfecPago'
				,aplicConvDobTrib VARCHAR(2) '$.aplicConvDobTrib'
				,pagExtSujRetNorLeg VARCHAR(2) '$.pagExtSujRetNorLeg'
				,pagoRegFis VARCHAR(2) '$.pagoRegFis'
				,totalComprobantesReembolso NUMERIC(18,5) '$.totalComprobantesReembolso'
				,totalBaseImponibleReembolso NUMERIC(18,5) '$.totalBaseImponibleReembolso'
				,totalImpuestoReembolso NUMERIC(18,5) '$.totalImpuestoReembolso'
				,totalSinImpuestos NUMERIC(18,5) '$.totalSinImpuestos'
				,importeTotal NUMERIC(18,5) '$.importeTotal'
			)

			INSERT INTO @tblTaxes(uniqueIdDoc, codImpuestoDocSustento, codigoPorcentaje, baseImponible, tarifa, valorImpuesto)
			SELECT uniqueIdDoc, codImpuestoDocSustento, codigoPorcentaje, baseImponible, tarifa, valorImpuesto
			FROM OPENJSON(@impuestos)
			WITH(
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc',
				codImpuestoDocSustento TINYINT '$.codImpuestoDocSustento',
				codigoPorcentaje VARCHAR(4) '$.codigoPorcentaje',
				baseImponible  NUMERIC(18,5) '$.baseImponible',
				tarifa NUMERIC(18,5) '$.tarifa',
				valorImpuesto  NUMERIC(18,5) '$.valorImpuesto' 
			)

			INSERT INTO @tblRetenciones(uniqueIdDoc, codigo, codigoRetencion, baseImponible, porcentajeRetener, valorRetenido, fechaPagoDiv, imRentaSoc, ejerFisUtDiv, numCajBan, precCajBan)
			SELECT uniqueIdDoc, codigo, codigoRetencion, baseImponible, porcentajeRetener, valorRetenido, fechaPagoDiv, imRentaSoc, ejerFisUtDiv, numCajBan, precCajBan
			FROM OPENJSON(@retenciones) 
			WITH(
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc'
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
			)

			INSERT INTO @tblPayments(uniqueIdDoc, formaPago, total) 
			SELECT uniqueIdDoc, formaPago, total
			FROM OPENJSON(@payments)
			WITH(
				uniqueIdDoc UNIQUEIDENTIFIER '$.uniqueIdDoc'
				,formaPago VARCHAR(2) '$.formaPago'
				,total NUMERIC(18,5) '$.total'
			)


			INSERT INTO @tblAddInfo(nombre, valor)
			SELECT nombre, valor
			FROM OPENJSON(@infoAdicional)
			WITH(
				nombre VARCHAR(100) '$.nombre'
				,valor VARCHAR(300) '$.valor'
			)

			IF NOT EXISTS (SELECT 1 FROM @tblDocs)
				BEGIN
					SELECT '0' code, 'Debe agregar al menos un documento de sustento' as 'message'
					RETURN
				END

			IF NOT EXISTS (SELECT 1 FROM @tblTaxes)
				BEGIN
					SELECT '0' code, 'Debe agregar al menos un impuesto a los documentos de sustento' as 'message'
					RETURN
				END

			IF NOT EXISTS (SELECT 1 FROM @tblRetenciones)
				BEGIN
					SELECT '0' code, 'Debe agregar al menos una retencion al documento de sustento' as 'message'
					RETURN
				END

	IF EXISTS (SELECT 1 FROM FactElect.RetAtsDocSustento rds WITH(NOLOCK)
						INNER JOIN @tblDocs t ON LTRIM(RTRIM(rds.numDocSustento)) = LTRIM(RTRIM(t.numDocSustento)))
		BEGIN
			SELECT '0' code, 'Este documento de sustento ya pertenece a una retención' as 'message'
			RETURN
		END

	DECLARE @idRetencionAts INT
			,@ambiente nvarchar(1)
			,@tipoEmision TINYINT
			,@idEntidad INT 
			,@idPuntoEmision INT
			,@idTipoDocumento INT
			,@secuencial VARCHAR(15)
			,@fechaEmision DATE
			,@ruc VARCHAR(15)
			,@claveAcceso VARCHAR(49)
			,@idUsuario INT
			,@idProveedor INT
			
			SET @ambiente = 1
			SET @tipoEmision = 1

			SELECT @idEntidad = idEntidad 
 			,@idUsuario = idUsuario
			FROM App.UsuarioRol WHERE idUsuarioRol = @idRol
 
			SET @ruc = (SELECT RUC FROM Entidad WHERE idEntidad = @idEntidad)

			SELECT TOP 1  @idPuntoEmision = idPuntoEmision, @ambiente = ambiente FROM PuntoEmision p INNER JOIN @tblInfoCompRet t ON p.codEstab = t.codEstab


			SET @idProveedor = ISNULL((SELECT idProveedor FROM Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND LTRIM(RTRIM(numeroIdentificacion)) = (SELECT LTRIM(RTRIM(identificacionSujetoRetenido))  FROM @tblInfoCompRet)),0)
		
			IF (@idProveedor IS NULL OR @idProveedor = 0)
				BEGIN
					SELECT '0' code, 'No se encontro proveedor' as 'message'
					RETURN
				END
 
			SELECT TOP 1 @secuencial = ultimaSecuencia
			FROM ConfiguracionDocumento cd
			INNER JOIN dbo.TipoDocumento td ON cd.idTipoDocumento = td.idTipoDocumento
			WHERE cd.idPuntoEmision = @idPuntoEmision 
			AND td.codigoSri = '07'
			
			SET @fechaEmision = (SELECT fechaEmision FROM @tblInfoCompRet)
	
			SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(estab)   
			 ,'07'
												   ,CAST(@ambiente as nvarchar)
												   ,CAST(@tipoEmision as nvarchar)                         
			,dbo.AFTConvertDate(@fechaEmision)                
			,@ruc                                             
			,estab+ptoEmi                                                     
			,Helper.F_Auto_Sequential(@secuencial)) 
			 FROM @tblInfoCompRet

			 --SELECT '0' as code, (select *,  from @tblInfoCompRet for json path) as 'message'
			 --return
			--RETENCION ATS
			
			IF @claveAcceso IS NULL
				BEGIN
					SELECT '0' as code, 'Error al generar clave acceso ' as 'message' 
					RETURN
				END

	BEGIN TRY
		BEGIN TRAN
			

			INSERT INTO FactElect.RetencionAts(ambiente, tipoEmision, codEstab, claveAcceso,
			codDoc, estab, ptoEmi, secuencial, fechaEmision, contribuyentEspecial, obligadoContabilidad
			, tipoIdentificacionSujetoRetenido, tipoSujetoRetenido, parteRel, idCliente
			, razonSocialSujetoRetenido, identificacionSujetoRetenido, periodoFiscal
			,fechaRegistro, idUsuario, idProveedor)
			SELECT cast(@ambiente as tinyint), @tipoEmision, codEstab, @claveAcceso
			,'07',estab,ptoEmi,@secuencial,fechaEmision,contribuyentEspecial,obligadoContabilidad
			,tipoIdentificacionSujetoRetenido,tipoSujetoRetenido,parteRel,idCliente
			,razonSocialSujetoRetenido,identificacionSujetoRetenido,periodoFiscal
			,dbo.ufnGetDateEcuador(),@idUsuario, @idProveedor
			FROM @tblInfoCompRet

			SET @idRetencionAts = @@IDENTITY

			--Documentos de Sustento

			INSERT INTO FactElect.RetAtsDocSustento(idRetencionAts, uniqueIdDoc, codSustento, codDocSustento
			, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable
			, numAutDocSustento, pagoLocExt, tipoRegi, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis
			, totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal)
			SELECT @idRetencionAts, uniqueIdDoc, codSustento, codDocSustento
			, numDocSustento, fechaEmisionDocSustento, fechaRegistroContable
			,numAutDocSustento, pagoLocExt, tipoRegi, paisEfecPago, aplicConvDobTrib, pagExtSujRetNorLeg, pagoRegFis
			,totalComprobantesReembolso, totalBaseImponibleReembolso, totalImpuestoReembolso, totalSinImpuestos, importeTotal
			FROM @tblDocs

			--IMPUESTOS

			INSERT INTO FactElect.RetAtsImpDocSustento(idRetencionAts, uniqueIdDoc, codImpuestoDocSustento
			, codigoPorcentaje, baseImponible, tarifa, valorImpuesto)
			SELECT @idRetencionAts, uniqueIdDoc, codImpuestoDocSustento
			,codigoPorcentaje, baseImponible, tarifa, valorImpuesto
			FROM @tblTaxes

			UPDATE tax SET tax.idRetAtsDocSustento = ds.idRetAtsDocSustento
			FROM FactElect.RetAtsImpDocSustento tax WITH(NOLOCK)
			JOIN (SELECT idRetencionAts, uniqueIdDoc, idRetAtsDocSustento FROM FactElect.RetAtsDocSustento
				  WHERE idRetencionAts = @idRetencionAts) ds ON ds.uniqueIdDoc = tax.uniqueIdDoc

			UPDATE fc SET fc.retencion = 1
			FROM FacturaCompra fc
			JOIN (
				SELECT numAutDocSustento, numDocSustento FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts
			) AS t ON fc.nroAutorizacion = t.numAutDocSustento AND  REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) = t.numDocSustento

			--RETENCIONES
			INSERT INTO FactElect.RetencionAtsRet(idRetencionAts, uniqueIdDoc, codigo, codigoRetencion
			, baseImponible, porcentajeRetener, valorRetenido, fechaPagoDiv, imRentaSoc, ejerFisUtDiv
			, numCajBan, precCajBan)
			SELECT @idRetencionAts, uniqueIdDoc, codigo, codigoRetencion
			, baseImponible, porcentajeRetener, valorRetenido, fechaPagoDiv, imRentaSoc, ejerFisUtDiv
			, numCajBan, precCajBan
			FROM @tblRetenciones

			UPDATE ret SET ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			FROM FactElect.RetencionAtsRet ret WITH(NOLOCK)
			JOIN (SELECT idRetencionAts, uniqueIdDoc, idRetAtsDocSustento FROM FactElect.RetAtsDocSustento 
			WHERE idRetencionAts = @idRetencionAts) ds ON ds.uniqueIdDoc = ret.uniqueIdDoc

			--REEMBOLSOS

			--PAGOS

			INSERT INTO FactElect.RetencionAtsPago (idRetencionAts, uniqueIdDoc, formapago, total)
			SELECT @idRetencionAts, uniqueIdDoc, formapago, total
			FROM @tblPayments

			UPDATE p SET p.idRetAtsDocSustento = ds.idRetAtsDocSustento
			FROM FactElect.RetencionAtsPago p WITH(NOLOCK)
			JOIN (SELECT idRetencionAts, uniqueIdDoc, idRetAtsDocSustento FROM FactElect.RetAtsDocSustento
			WHERE idRetencionAts = @idRetencionAts) ds ON ds.uniqueIdDoc = p.uniqueIdDoc

			--INFORMACION ADICIONAL
			
			IF EXISTS (SELECT 1 FROM @tblAddInfo)
				BEGIN
					INSERT INTO FactElect.RetAtsInfoAdicional(idRetencionAts, nombre, valor)	
					SELECT @idRetencionAts, nombre, valor FROM @tblAddInfo
				END


			--DocumentoElectronico
			DECLARE @isAutomatic INT = 0
			set @isAutomatic = (SELECT isAutomatic FROM factElect.Config_Comprob_Elect WHERE codEstab = (SELECT TOP 1 codEstab FROM @tblInfoCompRet))

			INSERT INTO dbo.DocumentoElectronico(ambiente,codDoc, idDocumento,nroDocumento,idPuntoEmision,numEstab,ptoEmision,claveAcceso,versionComp,isAutomatic,fechaEmision,codigoAutorizacion,idUsuario,idEntidad, codEstado, ruc, numeroIdentificacion, codEstab, idContribuyente)
			SELECT @ambiente,'07',@idRetencionAts,CONVERT(bigint,@secuencial), @idPuntoEmision,estab,ptoEmi,@claveAcceso,'2.0.0',@isAutomatic,@fechaEmision,@claveAcceso,@idUsuario,@idEntidad, 1, @ruc, identificacionSujetoRetenido, codEstab, @idProveedor FROM @tblInfoCompRet
			
			--secuencia
			UPDATE cd SET 
			cd.ultimaSecuencia = cd.ultimaSecuencia + 1 
			FROM ConfiguracionDocumento cd
			INNER JOIN dbo.TipoDocumento td ON cd.idTipoDocumento = td.idTipoDocumento
			WHERE cd.idPuntoEmision = @idPuntoEmision 
			AND td.codigoSri = '07'
			SELECT '1' code, 'Retencion generada con exito'  as 'message'
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
