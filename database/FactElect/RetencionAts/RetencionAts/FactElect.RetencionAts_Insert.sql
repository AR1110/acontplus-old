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
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_Insert @userRoleId INT
,@json NVARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;
    SET XACT_ABORT ON;

    --> GLOBAL
	DECLARE @idUsuario INT,
        @idEntidad INT,
        @documentosSustento NVARCHAR(MAX),
        @taxes NVARCHAR(MAX),
        @retenciones NVARCHAR(MAX),
        @payments NVARCHAR(MAX),
        @infoAdicional NVARCHAR(MAX);

    --> Contabilidad
    DECLARE @importeTotal NUMERIC(18,5),
        @idEstablecimiento INT,
        @idEstadoPago INT,
        @serieComprobante VARCHAR(20); 

    --> Facturacion Electronica
	DECLARE @ruc NVARCHAR(100),
        @fechaEmision DATETIME,
        @ambiente INT,
        @estab VARCHAR(5),
        @ptoEmi VARCHAR(5),
        @claveAcceso NVARCHAR(50),
        @uniqueId VARCHAR(150),
        @secuencial INT,
        @idEstadoServicio INT,
        @customerId INT,
        @idDocumentoElectronico INT;

    --> RetencionAts
	DECLARE @idRetencionAts INT,
        @tipoEmision TINYINT = 1,
        @idPuntoEmision INT,
        @idTipoDocumento INT,
        @idProveedor INT,
        @codDoc VARCHAR(2) = '07'; 

	DECLARE @tblInfoCompRet AS TABLE( 
         idPuntoEmision INT NOT NULL
        ,versionComp VARCHAR(10) NOT NULL DEFAULT '2.0.0'
        ,parteRel VARCHAR(2) NOT NULL
        ,idProveedor INT NOT NULL
		,tipoSujetoRetenido VARCHAR(2) NULL
        ,fechaEmision DATETIME2 NOT NULL
        ,isAutomatic BIT DEFAULT 0
	);

	DECLARE @tblDocs AS TABLE(
		 uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
		,documentoSustentoTributarioId INT NOT NULL
		,numDocSustento VARCHAR(15) NOT NULL
		,fechaEmisionDocSustento DATETIME2 NOT NULL
		,fechaRegistroContable DATETIME2
		,numAutDocSustento VARCHAR(49) NOT NULL
		,pagoLocExt VARCHAR(2)
		,tipoRegimenFiscalExteriorId INT NOT NULL
		,paisEfecPago VARCHAR(3)
		,aplicConvDobTrib VARCHAR(2)
		,pagExtSujRetNorLeg VARCHAR(2)
		,pagoRegFis VARCHAR(2)
		,totalComprobantesReembolso NUMERIC(18,5)
		,totalBaseImponibleReembolso NUMERIC(18,5)
		,totalImpuestoReembolso NUMERIC(18,5)
		,totalSinImpuestos NUMERIC(18,5) NOT NULL
		,importeTotal NUMERIC(18,5) NOT NULL
        
	);

	DECLARE @tblTaxes AS TABLE(
		uniqueIdDoc UNIQUEIDENTIFIER NOT NULL,
        idTarifaImpuesto INT NOT NULL,
		baseImponible  NUMERIC(18,5) NOT NULL,
		valorImpuesto  NUMERIC(18,5) NOT NULL
	);

	DECLARE @tblRetenciones AS TABLE(
		 uniqueIdDoc UNIQUEIDENTIFIER NOT NULL 
		,impuestoRetencionId INT NOT NULL
		,codigoRetencion VARCHAR(5) NOT NULL
		,baseImponible NUMERIC(18,5) NOT NULL
		,porcentajeRetener NUMERIC(18,5) NOT NULL
		,valorRetenido NUMERIC(18,5) NOT NULL
	);

	DECLARE @tblPayments AS TABLE(
	     uniqueIdDoc UNIQUEIDENTIFIER NOT NULL 
		,formaPagoId INT NOT NULL
		,total NUMERIC(18,5) NOT NULL
	);

	DECLARE @tblAddInfo AS TABLE(
		 nombre VARCHAR(100) NOT NULL
		,valor VARCHAR(300) NOT NULL
	);

	BEGIN TRY
        --> Info Json
        INSERT INTO @tblInfoCompRet
              (idPuntoEmision,fechaEmision,idProveedor,tipoSujetoRetenido,parteRel)
		SELECT idPuntoEmision,fechaEmision,idProveedor,tipoSujetoRetenido,parteRel
		FROM OPENJSON(@json) WITH
        (
             idPuntoEmision                   INT
            ,fechaEmision                     DATETIME2
            ,idProveedor INT
            ,tipoSujetoRetenido               VARCHAR(2)
            ,parteRel                         VARCHAR(2)
		);
        
        --> Validaciones
        IF NOT EXISTS (SELECT 1 FROM @tblInfoCompRet)
			BEGIN
				SELECT '0' code, 'Datos de retencion no validos' as 'message'
				RETURN
			END

        SELECT  @idProveedor = idProveedor
            ,@documentosSustento = documentosSustento
            ,@infoAdicional = infoAdicional
        FROM OPENJSON(@json) WITH (
                                    idProveedor INT,
                                    documentosSustento NVARCHAR(MAX) AS JSON,
                                    infoAdicional NVARCHAR(MAX) AS JSON
                                    );

        SELECT @taxes = taxes
            ,@retenciones = retenciones
            ,@payments = payments
        FROM OPENJSON (@documentosSustento) WITH (
                                                    taxes NVARCHAR(MAX) AS JSON,
                                                    retenciones NVARCHAR(MAX) AS JSON, 
                                                    payments NVARCHAR(MAX) AS JSON
                                                  );

        INSERT INTO @tblDocs
              (uniqueIdDoc,documentoSustentoTributarioId,numDocSustento,fechaEmisionDocSustento,fechaRegistroContable,numAutDocSustento,pagoLocExt,tipoRegimenFiscalExteriorId,paisEfecPago,aplicConvDobTrib,pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,totalImpuestoReembolso,totalSinImpuestos,importeTotal)
	    SELECT uniqueIdDoc,documentoSustentoTributarioId,REPLACE(numDocSustento, '-', ''),fechaEmisionDocSustento,fechaRegistroContable,numAutDocSustento,pagoLocExt,tipoRegimenFiscalExteriorId,paisEfecPago,aplicConvDobTrib,pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,totalImpuestoReembolso,totalSinImpuestos,importeTotal
	    FROM OPENJSON(@documentosSustento) WITH
        (
		     uniqueIdDoc                 UNIQUEIDENTIFIER 
	        ,documentoSustentoTributarioId                INT
	        ,numDocSustento              VARCHAR(17) 
	        ,fechaEmisionDocSustento     DATETIME2 
	        ,fechaRegistroContable       DATETIME2 
	        ,numAutDocSustento           VARCHAR(49) 
	        ,pagoLocExt                  VARCHAR(2) 
	        ,tipoRegimenFiscalExteriorId INT
	        ,paisEfecPago                VARCHAR(3) 
	        ,aplicConvDobTrib            VARCHAR(2) 
	        ,pagExtSujRetNorLeg          VARCHAR(2) 
	        ,pagoRegFis                  VARCHAR(2) 
	        ,totalComprobantesReembolso  NUMERIC(18,5) 
	        ,totalBaseImponibleReembolso NUMERIC(18,5) 
	        ,totalImpuestoReembolso      NUMERIC(18,5)
	        ,totalSinImpuestos           NUMERIC(18,5) 
	        ,importeTotal                NUMERIC(18,5)
		);

        IF NOT EXISTS (SELECT 1 FROM @tblDocs)
			BEGIN
				SELECT '0' code, 'Debe agregar al menos un documento de sustento' as 'message'
				RETURN
			END

        INSERT INTO @tblTaxes
              (uniqueIdDoc,idTarifaImpuesto,baseImponible,valorImpuesto)
	    SELECT uniqueIdDoc,idTarifaImpuesto,baseImponible,valorImpuesto
	    FROM OPENJSON(@taxes)WITH
        (
		    uniqueIdDoc             UNIQUEIDENTIFIER 
		   ,idTarifaImpuesto        INT
		   ,baseImponible           NUMERIC(18,5)
		   ,valorImpuesto           NUMERIC(18,5) 
		);
        
		IF NOT EXISTS (SELECT 1 FROM @tblTaxes)
			BEGIN
				SELECT '0' code, 'Debe agregar al menos un impuesto a los documentos de sustento' as 'message'
				RETURN
			END

        INSERT INTO @tblRetenciones
              (uniqueIdDoc,impuestoRetencionId,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido)
	    SELECT uniqueIdDoc,impuestoRetencionId,LTRIM(RTRIM(codigoRetencion)),baseImponible,porcentajeRetener,valorRetenido
	    FROM OPENJSON(@retenciones) WITH
        (
             uniqueIdDoc                    UNIQUEIDENTIFIER 
            ,impuestoRetencionId            INT 
            ,codigoRetencion                VARCHAR(5) 
            ,baseImponible                  NUMERIC(18,5) 
            ,porcentajeRetener              NUMERIC(18,5) 
            ,valorRetenido                  NUMERIC(18,5)
		);

        IF NOT EXISTS (SELECT 1 FROM @tblRetenciones)
			BEGIN
				SELECT '0' code, 'Debe agregar al menos una retencion al documento de sustento' as 'message'
				RETURN
			END

        INSERT INTO @tblPayments
              (uniqueIdDoc,formaPagoId,total) 
	    SELECT uniqueIdDoc,formaPagoId,total
		FROM OPENJSON(@payments) WITH
        (
             uniqueIdDoc UNIQUEIDENTIFIER 
            ,formaPagoId INT
            ,total       NUMERIC(18,5) 
		)

        
        IF NOT EXISTS (SELECT 1 FROM @tblPayments)
			BEGIN
				SELECT '0' code, 'Debe agregar al menos una retencion al documento de sustento' as 'message'
				RETURN
			END

		INSERT INTO @tblAddInfo
              (nombre,valor)
		SELECT nombre,valor
		FROM OPENJSON(@infoAdicional)WITH
        (
             nombre VARCHAR(100) 
            ,valor  VARCHAR(300) 
		)

        
        --> Informacion General
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Recuperacion de Varialbles
        SELECT TOP 1 @ruc = ruc FROM Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

        SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigoSri = '07'

        SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

        SELECT TOP 1 @idPuntoEmision    = pe.idPuntoEmision
                    ,@ambiente          = pe.ambiente 
                    ,@idEstablecimiento = pe.idEstablecimiento
                    ,@fechaEmision      = tb.fechaEmision
        FROM @tblInfoCompRet           tb
        INNER JOIN PuntoEmision        pe WITH (NOLOCK) ON pe.idPuntoEmision = tb.idPuntoEmision

        SELECT @importeTotal = SUM(valorRetenido) FROM @tblRetenciones 

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

        SELECT TOP 1 @customerId = Id 
        FROM Customer.Customer c WITH (NOLOCK) 
            INNER JOIN dbo.Proveedor p ON c.Id = p.CustomerId
            INNER JOIN @tblInfoCompRet r ON p.idProveedor = r.idProveedor


        SELECT TOP 1 @secuencial = ultimaSecuencia
	    FROM ConfiguracionDocumento  cd WITH (NOLOCK)
	    INNER JOIN dbo.TipoDocumento td WITH (NOLOCK) ON cd.idTipoDocumento = td.idTipoDocumento
	    WHERE cd.idPuntoEmision = @idPuntoEmision 
	      AND td.codigoSri = @codDoc

        SELECT TOP 1 @claveAcceso = dbo.ufnGeneraClaveAcceso (
                                                                dbo.AFTDeleteCero(es.estab)   
			                                                   ,@codDoc
												               ,CAST(@ambiente as nvarchar)
												               ,CAST(@tipoEmision as nvarchar)                         
			                                                   ,dbo.AFTConvertDate(@fechaEmision)                
			                                                   ,@ruc                                             
			                                                   ,es.estab + pe.ptoEmi                                                     
			                                                   ,Helper.F_Auto_Sequential(@secuencial)
                                                             ) 
                   ,@serieComprobante = estab + '-' +  ptoEmi  + '-' + Helper.F_Auto_Sequential(@secuencial)
		FROM @tblInfoCompRet           tb
        INNER JOIN PuntoEmision        pe WITH (NOLOCK) ON pe.idPuntoEmision    = tb.idPuntoEmision
        INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento

        IF @secuencial IS NULL
            BEGIN
                SELECT '0' code, 'Por configure el número de secuencia para este documento' as 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM Customer.Customer c
                INNER JOIN dbo.TipoIdentificacion ti ON c.IdTypeId = ti.idTipoIdentificacion
                WHERE Id = @customerId
                    AND ti.codigoSri = '04'
                    AND LEN(LTRIM(RTRIM(IdCard))) != 13)
		    BEGIN
			    SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
			    RETURN
		    END

		IF EXISTS (SELECT 1 FROM Customer.Customer c  
                INNER JOIN dbo.TipoIdentificacion ti ON c.IdTypeId = ti.idTipoIdentificacion
                WHERE Id = @customerId
                    AND ti.codigoSri = '05'
                    AND LEN(LTRIM(RTRIM(IdCard))) != 10)
			BEGIN
				SELECT '0' code, 'Revise el numero de identificación del proveedor' as 'message'
				RETURN
			END

        IF EXISTS (SELECT 1 
                        FROM FactElect.RetAtsDocSustento rds WITH(NOLOCK)
						    INNER JOIN @tblDocs t1  ON LTRIM(RTRIM(rds.numAutDocSustento)) = LTRIM(RTRIM(t1.numAutDocSustento)) 
						    INNER JOIN @tblDocs t2  ON LTRIM(RTRIM(rds.numDocSustento)) = LTRIM(RTRIM(t2.numDocSustento))
						    INNER JOIN FactElect.RetencionAts ret WITH(NOLOCK) ON rds.idRetencionAts = ret.idRetencionats 
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
                   (idTipoDocumento,versionComp,fechaEmision,nroDocumento,idPuntoEmision,claveAcceso,idUsuario,CustomerId,idEstadoServicio,serieComprobante,isAutomatic)
			SELECT @idTipoDocumento,versionComp,fechaEmision,@secuencial,idPuntoEmision,@claveAcceso,@idUsuario,@customerId,@idEstadoServicio,@serieComprobante,isAutomatic
            FROM @tblInfoCompRet

            SET @idDocumentoElectronico = SCOPE_IDENTITY()

            --> InfoComprobanteRetencion
			INSERT INTO FactElect.RetencionAts
                  (tipoSujetoRetenido,parteRel,periodoFiscal, tipoEmision,fechaRegistro,idUsuario,idProveedor,idDocumentoElectronico)
			SELECT tipoSujetoRetenido,parteRel,FORMAT(fechaEmision, 'MM/yyyy'),@tipoEmision,dbo.ufnGetDateEcuador(),@idUsuario, @idProveedor,@idDocumentoElectronico
			FROM @tblInfoCompRet

			SET @idRetencionAts = SCOPE_IDENTITY()

			--> Documentos de Sustento
			INSERT INTO FactElect.RetAtsDocSustento
                   (idRetencionAts,uniqueIdDoc,documentoSustentoTributarioId,numDocSustento,fechaEmisionDocSustento,
                   fechaRegistroContable,numAutDocSustento,pagoLocExt,tipoRegimenFiscalExteriorId,paisEfecPago,
                   aplicConvDobTrib,pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,
                   totalImpuestoReembolso,totalSinImpuestos,importeTotal,idUsuario)
			SELECT @idRetencionAts,uniqueIdDoc,documentoSustentoTributarioId,numDocSustento,fechaEmisionDocSustento,
            fechaRegistroContable,numAutDocSustento,pagoLocExt,IIF(tipoRegimenFiscalExteriorId = 0, NULL, tipoRegimenFiscalExteriorId),paisEfecPago,aplicConvDobTrib,
            pagExtSujRetNorLeg,pagoRegFis,totalComprobantesReembolso,totalBaseImponibleReembolso,totalImpuestoReembolso,
            totalSinImpuestos,importeTotal, @idUsuario
			FROM @tblDocs

			--> Impuestos
			INSERT INTO FactElect.RetAtsImpDocSustento
                   (idRetencionAts,uniqueIdDoc,idTarifaImpuesto,baseImponible,valorImpuesto,idUsuario)
			SELECT @idRetencionAts,uniqueIdDoc,idTarifaImpuesto,baseImponible,valorImpuesto,@idUsuario
			FROM @tblTaxes

            --> Retenciones
			INSERT INTO FactElect.RetencionAtsRet
                   (idRetencionAts,uniqueIdDoc,impuestoRetencionId,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido,idUsuario)
			SELECT @idRetencionAts,uniqueIdDoc,impuestoRetencionId,codigoRetencion,baseImponible,porcentajeRetener,valorRetenido,@idUsuario
			FROM @tblRetenciones


            --> Pagos
			INSERT INTO FactElect.RetencionAtsPago 
                   (idRetencionAts,uniqueIdDoc,formaPagoId,total,idUsuario)
			SELECT @idRetencionAts,uniqueIdDoc,formaPagoId,total,@idUsuario
			FROM @tblPayments

            --> Informacion adicional
			IF EXISTS (SELECT 1 FROM @tblAddInfo)
				BEGIN
					INSERT INTO FactElect.RetAtsInfoAdicional
                           (idRetencionAts,nombre,valor,idUsuario)	
					SELECT @idRetencionAts,nombre,valor,@idUsuario
                    FROM @tblAddInfo
				END

            --> CONTABILIDAD 
			INSERT INTO Contabilidad.CuentaPorPagar
			      (codDoc,fechaEmision, idEstablecimiento, idProveedor, idEstadoPago, uniqueId, serieComprobante, importeTotal, idUsuario,idDocumento,idEntidad)
		    SELECT @codDoc,fechaEmision,@idEstablecimiento, @idProveedor,@idEstadoPago,@claveAcceso,@serieComprobante,@importeTotal,@idUsuario,@idRetencionAts,@idEntidad
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
			  AND td.codigoSri = @codDoc
			
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
