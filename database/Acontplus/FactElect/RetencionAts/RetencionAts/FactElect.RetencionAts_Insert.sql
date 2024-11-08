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
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_Insert @idRol INT
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
    SET LANGUAGE SPANISH;
    SET XACT_ABORT ON;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT

    --> Contabilidad
    DECLARE @importeTotal NUMERIC(18,5),
        @idEstablecimiento INT,
        @idEstadoPago INT,
        @serieComprobante VARCHAR(20);

    --> Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@claveAcceso NVARCHAR(50) ,@isAutomatic INT ,@uniqueId VARCHAR(150) ,@secuencial INT
           ,@idEstadoServicio INT ,@CustomerId INT ,@idDocumentoElectronico INT

    --> RetencionAts
	DECLARE @idRetencionAts INT,
        @tipoEmision TINYINT = 1,
        @idPuntoEmision INT,
        @idTipoDocumento INT,
        @idProveedor INT; 

	DECLARE @tblInfoCompRet AS TABLE(
		 fechaEmision DATETIME2 NOT NULL
        ,idPuntoEmision INT NOT NULL
		,contribuyentEspecial VARCHAR(13) NULL
		,obligadoContabilidad VARCHAR(2) NULL
		,codDoc VARCHAR(10) NOT NULL DEFAULT '07' 
        ,versionComp VARCHAR(10) NOT NULL DEFAULT '2.0.0'
        ,tipoIdentificacionSujetoRetenido VARCHAR(2) NULL
		,tipoSujetoRetenido VARCHAR(2) NULL
		,parteRel VARCHAR(2) NOT NULL
		,idCliente INT NULL
		,razonSocialSujetoRetenido VARCHAR(300) NULL
		,identificacionSujetoRetenido VARCHAR(13) NULL
		,periodoFiscal VARCHAR(8) NULL
	);

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


	BEGIN TRY
        
        --> Informacion General
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

        --> Info Json
        INSERT INTO @tblInfoCompRet
              (idPuntoEmision,fechaEmision,contribuyentEspecial,obligadoContabilidad,tipoIdentificacionSujetoRetenido,tipoSujetoRetenido,parteRel,idCliente,razonSocialSujetoRetenido,identificacionSujetoRetenido,periodoFiscal)
		SELECT idPuntoEmision,fechaEmision,contribuyentEspecial,obligadoContabilidad,tipoIdentificacionSujetoRetenido,tipoSujetoRetenido,parteRel,idCliente,razonSocialSujetoRetenido,identificacionSujetoRetenido,periodoFiscal
		FROM OPENJSON(@infoCompRet) WITH
        (
             idPuntoEmision                     INT
            ,fechaEmision                     DATETIME2
            ,contribuyentEspecial             VARCHAR(13)
            ,obligadoContabilidad             VARCHAR(2)
            ,tipoIdentificacionSujetoRetenido VARCHAR(2)
            ,tipoSujetoRetenido               VARCHAR(2)
            ,parteRel                         VARCHAR(2)
            ,idCliente                        INT 
            ,razonSocialSujetoRetenido        VARCHAR(300)
            ,identificacionSujetoRetenido     VARCHAR(13) 
            ,periodoFiscal                    VARCHAR(8) 
		)

        INSERT INTO @tblDocs
              (uniqueIdDoc,codSustento,codDocSustento,numDocSustento,fechaEmisionDocSustento,fechaRegistroContable,numAutDocSustento,pagoLocExt,tipoRegi,paisEfecPago,aplicConvDobTrib,pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,totalImpuestoReembolso,totalSinImpuestos,importeTotal)
	    SELECT uniqueIdDoc,codSustento,codDocSustento,numDocSustento,fechaEmisionDocSustento,fechaRegistroContable,numAutDocSustento,pagoLocExt,tipoRegi,paisEfecPago,aplicConvDobTrib,pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,totalImpuestoReembolso,totalSinImpuestos,importeTotal
	    FROM OPENJSON(@docsSust) WITH
        (
		     uniqueIdDoc                 UNIQUEIDENTIFIER 
	        ,codSustento                 VARCHAR(2) 
	        ,codDocSustento              VARCHAR(2) 
	        ,numDocSustento              VARCHAR(15) 
	        ,fechaEmisionDocSustento     DATETIME 
	        ,fechaRegistroContable       DATETIME 
	        ,numAutDocSustento           VARCHAR(49) 
	        ,pagoLocExt                  VARCHAR(2) 
	        ,tipoRegi                    VARCHAR(2) 
	        ,paisEfecPago                VARCHAR(3) 
	        ,aplicConvDobTrib            VARCHAR(2) 
	        ,pagExtSujRetNorLeg          VARCHAR(2) 
	        ,pagoRegFis                  VARCHAR(2) 
	        ,totalComprobantesReembolso  NUMERIC(18,5) 
	        ,totalBaseImponibleReembolso NUMERIC(18,5) 
	        ,totalImpuestoReembolso      NUMERIC(18,5)
	        ,totalSinImpuestos           NUMERIC(18,5) 
	        ,importeTotal                NUMERIC(18,5)
		)

        INSERT INTO @tblTaxes
              (uniqueIdDoc,codImpuestoDocSustento,codigoPorcentaje,baseImponible,tarifa,valorImpuesto)
	    SELECT uniqueIdDoc,codImpuestoDocSustento,codigoPorcentaje,baseImponible,tarifa,valorImpuesto
	    FROM OPENJSON(@impuestos)WITH
        (
		    uniqueIdDoc            UNIQUEIDENTIFIER 
		   ,codImpuestoDocSustento TINYINT
		   ,codigoPorcentaje       VARCHAR(4) 
		   ,baseImponible          NUMERIC(18,5) 
		   ,tarifa                 NUMERIC(18,5) 
		   ,valorImpuesto          NUMERIC(18,5) 
		)

        INSERT INTO @tblRetenciones
              (uniqueIdDoc,codigo,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido,fechaPagoDiv,imRentaSoc,ejerFisUtDiv,numCajBan,precCajBan)
	    SELECT uniqueIdDoc,codigo,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido,fechaPagoDiv,imRentaSoc,ejerFisUtDiv,numCajBan,precCajBan
	    FROM OPENJSON(@retenciones) WITH
        (
             uniqueIdDoc       UNIQUEIDENTIFIER 
            ,codigo            TINYINT 
            ,codigoRetencion   VARCHAR(5) 
            ,baseImponible     NUMERIC(18,5) 
            ,porcentajeRetener NUMERIC(18,5) 
            ,valorRetenido     NUMERIC(18,5) 
            ,fechaPagoDiv      DATE
            ,imRentaSoc        NUMERIC(18,5) 
            ,ejerFisUtDiv      INT 
            ,numCajBan         INT
            ,precCajBan        NUMERIC(18,5)
		)


        INSERT INTO @tblPayments
              (uniqueIdDoc,formaPago,total) 
	    SELECT uniqueIdDoc,formaPago,total
		FROM OPENJSON(@payments) WITH
        (
             uniqueIdDoc UNIQUEIDENTIFIER 
            ,formaPago   VARCHAR(2) 
            ,total       NUMERIC(18,5) 
		)


		INSERT INTO @tblAddInfo
              (nombre,valor)
		SELECT nombre,valor
		FROM OPENJSON(@infoAdicional)WITH
        (
             nombre VARCHAR(100) 
            ,valor  VARCHAR(300) 
		)

        --> Recuperacion de Varialbles
        SELECT TOP 1 @ruc = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri = '07'

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

        SELECT TOP 1 @idPuntoEmision = tb.idPuntoEmision
                    ,@ambiente       = pe.ambiente 
                    ,@fechaEmision   = tb.fechaEmision
        FROM @tblInfoCompRet           tb 
        INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK) ON tb.idPuntoEmision = pe.idPuntoEmision

        SELECT TOP 1 @idEstablecimiento = idEstablecimiento FROM dbo.PuntoEmision WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

        SELECT @importeTotal = SUM(valorRetenido) FROM @tblRetenciones 

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

        SELECT TOP 1 @CustomerId = Id FROM Customer.Customer WITH (NOLOCK) WHERE IDCard = (SELECT LTRIM(RTRIM(identificacionSujetoRetenido))  FROM @tblInfoCompRet)

        SELECT TOP 1 @idProveedor = idProveedor FROM dbo.Proveedor WITH (NOLOCK) WHERE idEntidad = @idEntidad AND CustomerId = @CustomerId

        SELECT TOP 1 @isAutomatic = autoSriAuth FROM  Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = (SELECT TOP 1 codEstab FROM @tblInfoCompRet)

        SELECT TOP 1 @secuencial = ultimaSecuencia
	    FROM ConfiguracionDocumento  cd WITH (NOLOCK)
	    INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON cd.idTipoDocumento = td.idTipoDocumento
	    WHERE cd.idPuntoEmision = @idPuntoEmision 
	      AND td.codigoSri = '07'

        SELECT TOP 1 @claveAcceso = dbo.ufnGeneraClaveAcceso (
                                                                dbo.AFTDeleteCero(es.estab)   
			                                                   ,'07'
												               ,CAST(@ambiente as nvarchar)
												               ,CAST(@tipoEmision as nvarchar)                         
			                                                   ,dbo.AFTConvertDate(@fechaEmision)                
			                                                   ,@ruc                                             
			                                                   ,es.estab + pe.ptoEmi                                                     
			                                                   ,Helper.F_Auto_Sequential(@secuencial)
                                                             ) 
                   ,@serieComprobante = estab + '-' +  ptoEmi  + '-' + Helper.F_Auto_Sequential(@secuencial)
		FROM @tblInfoCompRet           tb
        INNER JOIN dbo.PuntoEmision        pe WITH (NOLOCK) ON tb.idPuntoEmision = pe.idPuntoEmision
        INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON pe.idEstablecimiento = es.idEstablecimiento

        --> Validaciones
        IF NOT EXISTS (SELECT 1 FROM @tblInfoCompRet)
			BEGIN
				SELECT '0' code, 'Debe agregar al menos un documento de sustento' as 'message'
				RETURN
			END

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

        IF NOT EXISTS (SELECT 1 FROM @tblPayments)
			BEGIN
				SELECT '0' code, 'Debe agregar al menos una retencion al documento de sustento' as 'message'
				RETURN
			END

        IF @idProveedor IS NULL OR @idProveedor = 0
		    BEGIN
			    SELECT '0' code, 'No se encontro proveedor' as 'message'
			    RETURN
		    END

        IF @secuencial IS NULL
            BEGIN
                SELECT '0' code, 'Por configure el número de secuencia para este documento' as 'message'
                RETURN
            END


        IF EXISTS (SELECT 1 FROM @tblInfoCompRet WHERE tipoIdentificacionSujetoRetenido = '04' AND LEN(LTRIM(RTRIM(identificacionSujetoRetenido))) != 13)
		    BEGIN
			    SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
			    RETURN
		    END

		IF EXISTS (SELECT 1 FROM @tblInfoCompRet WHERE tipoIdentificacionSujetoRetenido = '05' AND LEN(LTRIM(RTRIM(identificacionSujetoRetenido))) != 10)
			BEGIN
				SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
				RETURN
			END

        IF EXISTS (SELECT 1 
                        FROM FactElect.RetAtsDocSustento   rds WITH(NOLOCK)
						INNER JOIN @tblDocs                 t1             ON LTRIM(RTRIM(rds.numAutDocSustento)) = LTRIM(RTRIM(t1.numAutDocSustento)) 
						INNER JOIN @tblDocs                 t2             ON LTRIM(RTRIM(rds.numDocSustento))    = LTRIM(RTRIM(t2.numDocSustento))
						INNER JOIN FactElect.RetencionAts ret WITH(NOLOCK) ON rds.idRetencionAts                  = ret.idRetencionats 
						WHERE ret.idProveedor = @idProveedor
						  AND ret.anuladaSri = 0)
		    BEGIN
			    SELECT '0' code, 'Este documento de sustento ya pertenece a una retención' as 'message'
			    RETURN
		    END
               

        IF @claveAcceso IS NULL
		    BEGIN
			    SELECT '0' as code, 'Error al generar clave acceso '   as 'message' 
			    RETURN
		    END

        IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE claveAcceso = @claveAcceso)
			BEGIN
				SELECT '0' code,'Error critico esta clave de acceso ya se encuentra registrada' AS 'message'
				RETURN
			END


		BEGIN TRAN
			--> DocumentoElectronico
			INSERT INTO dbo.DocumentoElectronico
                   (idTipoDocumento,versionComp,fechaEmision,nroDocumento,idPuntoEmision,claveAcceso,isAutomatic,idUsuario,CustomerId,idEstadoServicio,serieComprobante)
			SELECT @idTipoDocumento,versionComp,fechaEmision,@secuencial,@idPuntoEmision,@claveAcceso,@isAutomatic,@idUsuario,@CustomerId,@idEstadoServicio,@serieComprobante
            FROM @tblInfoCompRet

            SET @idDocumentoElectronico = SCOPE_IDENTITY()

            --> InfoComprobanteRetencion
			INSERT INTO FactElect.RetencionAts
                  (tipoSujetoRetenido,parteRel,idCliente,periodoFiscal, tipoEmision,fechaRegistro,idUsuario,idProveedor,idDocumentoElectronico)
			SELECT tipoSujetoRetenido,parteRel,idCliente,periodoFiscal,@tipoEmision,dbo.ufnGetDateEcuador(),@idUsuario, @idProveedor,@idDocumentoElectronico
			FROM @tblInfoCompRet

			SET @idRetencionAts = SCOPE_IDENTITY()

			--> Documentos de Sustento
			INSERT INTO FactElect.RetAtsDocSustento
                   (idRetencionAts,uniqueIdDoc,codSustento,codDocSustento,numDocSustento,fechaEmisionDocSustento,fechaRegistroContable,numAutDocSustento,pagoLocExt,tipoRegi,paisEfecPago,aplicConvDobTrib,pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,totalImpuestoReembolso,totalSinImpuestos,importeTotal)
			SELECT @idRetencionAts,uniqueIdDoc,codSustento,codDocSustento,numDocSustento,fechaEmisionDocSustento,fechaRegistroContable,numAutDocSustento,pagoLocExt,tipoRegi,paisEfecPago,aplicConvDobTrib,pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,totalImpuestoReembolso,totalSinImpuestos,importeTotal
			FROM @tblDocs

			--> Impuestos
			INSERT INTO FactElect.RetAtsImpDocSustento
                   (idRetencionAts,uniqueIdDoc,codImpuestoDocSustento,codigoPorcentaje,baseImponible,tarifa,valorImpuesto)
			SELECT @idRetencionAts,uniqueIdDoc,codImpuestoDocSustento,codigoPorcentaje,baseImponible,tarifa,valorImpuesto
			FROM @tblTaxes

            --> Retenciones
			INSERT INTO FactElect.RetencionAtsRet
                   (idRetencionAts,uniqueIdDoc,codigo,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido,fechaPagoDiv,imRentaSoc,ejerFisUtDiv,numCajBan,precCajBan)
			SELECT @idRetencionAts,uniqueIdDoc,codigo,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido,fechaPagoDiv,imRentaSoc,ejerFisUtDiv,numCajBan,precCajBan
			FROM @tblRetenciones


            --> Pagos
			INSERT INTO FactElect.RetencionAtsPago 
                   (idRetencionAts,uniqueIdDoc,formapago,total)
			SELECT @idRetencionAts,uniqueIdDoc,formapago,total
			FROM @tblPayments

            --> Informacion adicional
			IF EXISTS (SELECT 1 FROM @tblAddInfo)
				BEGIN
					INSERT INTO FactElect.RetAtsInfoAdicional
                           (idRetencionAts,nombre,valor)	
					SELECT @idRetencionAts,nombre,valor 
                    FROM @tblAddInfo
				END

            --> CONTABILIDAD 
			INSERT INTO Contabilidad.CuentaPorPagar
			      (codDoc,fechaEmision, idEstablecimiento, idProveedor, idEstadoPago, uniqueId, serieComprobante, importeTotal, idEntidad, idUsuario,idDocumento)
		    SELECT codDoc,fechaEmision,@idEstablecimiento,@idProveedor,@idEstadoPago,@claveAcceso,@serieComprobante,@importeTotal,@idEntidad,@idUsuario,@idRetencionAts
            FROM @tblInfoCompRet

			UPDATE tax SET tax.idRetAtsDocSustento = ds.idRetAtsDocSustento
			FROM FactElect.RetAtsImpDocSustento tax WITH (ROWLOCK)
			JOIN (SELECT idRetencionAts, uniqueIdDoc, idRetAtsDocSustento FROM FactElect.RetAtsDocSustento
				  WHERE idRetencionAts = @idRetencionAts) ds ON ds.uniqueIdDoc = tax.uniqueIdDoc

			UPDATE fc SET fc.retencion = 1
			FROM FacturaCompra fc
			JOIN (
				SELECT numAutDocSustento, numDocSustento FROM FactElect.RetAtsDocSustento WHERE idRetencionAts = @idRetencionAts
			) AS t ON fc.nroAutorizacion = t.numAutDocSustento AND  REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) = t.numDocSustento


			UPDATE ret SET ret.idRetAtsDocSustento = ds.idRetAtsDocSustento
			FROM FactElect.RetencionAtsRet ret WITH(NOLOCK)
			JOIN (SELECT idRetencionAts, uniqueIdDoc, idRetAtsDocSustento FROM FactElect.RetAtsDocSustento 
			WHERE idRetencionAts = @idRetencionAts) ds ON ds.uniqueIdDoc = ret.uniqueIdDoc


			UPDATE p SET p.idRetAtsDocSustento = ds.idRetAtsDocSustento
			FROM FactElect.RetencionAtsPago p WITH(NOLOCK)
			JOIN (SELECT idRetencionAts, uniqueIdDoc, idRetAtsDocSustento FROM FactElect.RetAtsDocSustento
			WHERE idRetencionAts = @idRetencionAts) ds ON ds.uniqueIdDoc = p.uniqueIdDoc

			
			--secuencia
			UPDATE cd WITH (ROWLOCK)
               SET cd.ultimaSecuencia = cd.ultimaSecuencia + 1 
			FROM ConfiguracionDocumento  cd
			INNER JOIN dbo.TipoDocumento td ON cd.idTipoDocumento = td.idTipoDocumento
			WHERE cd.idPuntoEmision = @idPuntoEmision 
			  AND td.codigoSri = '07'
			
		COMMIT TRAN
        SELECT '1' code, 'Retencion generada con exito'  as 'message'
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/RetencionAts/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH
END
GO
