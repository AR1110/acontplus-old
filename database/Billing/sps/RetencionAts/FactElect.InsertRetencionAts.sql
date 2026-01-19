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
CREATE OR ALTER PROCEDURE FactElect.InsertRetencionAts
     @userRoleId INT
    ,@json NVARCHAR(MAX)
    ,@errorCode INT = 0 OUTPUT
    ,@errorMessage NVARCHAR(MAX) = '' OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;
    SET XACT_ABORT ON;

    --> GLOBAL
	DECLARE @idUsuario INT, @idEntidad INT ,@code VARCHAR(50) ,@message VARCHAR(300)

    --> Control de transacciones
    DECLARE @startedTransaction BIT = 0;

    --> Datajson 
    DECLARE @documentosSustento NVARCHAR(MAX) ,@taxes NVARCHAR(MAX) ,@retenciones NVARCHAR(MAX) ,@payments NVARCHAR(MAX) ,@infoAdicional NVARCHAR(MAX)

    --> RetencionAts
	DECLARE @idRetencionAts INT ,@idProveedor INT

	DECLARE @tblInfoCompRet AS TABLE( 
         idDocumentoElectronico INT NOT NULL
        ,parteRel VARCHAR(2) NOT NULL
        ,idProveedor INT NOT NULL
        ,periodoFiscal VARCHAR(25) NOT NULL
		,tipoSujetoRetenido VARCHAR(2) NULL
        ,fechaRegistro DATETIME2 NOT NULL DEFAULT GETDATE()
        ,tipoEmision TINYINT NOT NULL DEFAULT 1
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
		uniqueIdDoc UNIQUEIDENTIFIER NOT NULL
       ,idTarifaImpuesto INT NOT NULL
       ,baseImponible  NUMERIC(18,5) NOT NULL
       ,valorImpuesto  NUMERIC(18,5) NOT NULL
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
        --> Informacion General
        SELECT TOP 1 @idEntidad = idEntidad, @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
        
        --> Info Json
        SELECT @documentosSustento = documentosSustento
              ,@taxes              = taxes
              ,@retenciones        = retenciones
              ,@payments           = payments
              ,@infoAdicional      = infoAdicional
        FROM OPENJSON(@json) WITH
        (
            documentosSustento NVARCHAR(MAX) '$.documentosSustento'             AS JSON
           ,taxes              NVARCHAR(MAX) '$.documentosSustento.taxes'       AS JSON
           ,retenciones        NVARCHAR(MAX) '$.documentosSustento.retenciones' AS JSON
           ,payments           NVARCHAR(MAX) '$.documentosSustento.payments'    AS JSON
           ,infoAdicional      NVARCHAR(MAX) '$.infoAdicional'                  AS JSON
        );

        INSERT INTO @tblInfoCompRet
              (idProveedor,tipoSujetoRetenido,parteRel)
		SELECT idProveedor,tipoSujetoRetenido,parteRel
		FROM OPENJSON(@json) WITH
        (
             idProveedor INT
            ,tipoSujetoRetenido               VARCHAR(2)
            ,parteRel                         VARCHAR(2)
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

        INSERT INTO @tblPayments
              (uniqueIdDoc,formaPagoId,total) 
	    SELECT uniqueIdDoc,formaPagoId,total
		FROM OPENJSON(@payments) WITH
        (
             uniqueIdDoc UNIQUEIDENTIFIER 
            ,formaPagoId INT
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

        -->Recuperando Informacion
        SELECT TOP 1 idProveedor = idProveedor FROM @tblInfoCompRet

        --> Validacion de informacion
        IF NOT EXISTS (SELECT 1 FROM @tblInfoCompRet)
			BEGIN
                SET @message = 'Datos de retencion no validos';
			END

        IF NOT EXISTS (SELECT 1 FROM @tblDocs)
			BEGIN
                SET @message = 'Debe agregar al menos un documento de sustento';
			END

        IF NOT EXISTS (SELECT 1 FROM @tblTaxes)
			BEGIN
                SET @message = 'Debe agregar al menos un impuesto a los documentos de sustento';
			END

         IF NOT EXISTS (SELECT 1 FROM @tblRetenciones)
			BEGIN
                SET @message = 'Debe agregar al menos una retencion al documento de sustento'
			END

        IF NOT EXISTS (SELECT 1 FROM @tblPayments)
			BEGIN
                SET @message = 'Debe agregar al menos una retencion al documento de sustento';
			END

        IF EXISTS (SELECT 1 
                        FROM FactElect.RetAtsDocSustento rds WITH(NOLOCK)
						    INNER JOIN @tblDocs t1  ON LTRIM(RTRIM(rds.numAutDocSustento)) = LTRIM(RTRIM(t1.numAutDocSustento)) 
						    INNER JOIN @tblDocs t2  ON LTRIM(RTRIM(rds.numDocSustento))    = LTRIM(RTRIM(t2.numDocSustento))
						    INNER JOIN FactElect.RetencionAts ret WITH(NOLOCK) ON rds.idRetencionAts = ret.idRetencionats 
						WHERE ret.idProveedor = @idProveedor
						  AND ret.anuladaSri = 0)
		    BEGIN
                SET @message = 'Este documento de sustento ya pertenece a una retención'
		    END

        IF @message IS NOT NULL
            BEGIN;
                THROW 50002, @message, 1;
            END

		--> Transaccion Principal.
        IF @@TRANCOUNT = 0
            BEGIN
                BEGIN TRANSACTION;
                SET @startedTransaction = 1;
            END

            --> InfoComprobanteRetencion
			INSERT INTO FactElect.RetencionAts
                  (tipoSujetoRetenido,parteRel,periodoFiscal,tipoEmision,fechaRegistro,idProveedor,idDocumentoElectronico, idUsuario)
			SELECT tipoSujetoRetenido,parteRel,periodoFiscal,tipoEmision,fechaRegistro,idProveedor,idDocumentoElectronico,@idUsuario
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

		IF (@@ROWCOUNT > 0)
			    BEGIN
				    SET @code = '0';
				    SET @message = 'Registrado Exitosamente';
			    END
		    ELSE
			    BEGIN
				    SET @code = '50001';
				    SET @errorCode = 5001
                    SET @errorMessage = 'No se pudo registrar'
				    SET @message = @errorMessage;
			    END
 
	    IF (@startedTransaction = 1)
		    BEGIN
			    COMMIT;
			    SELECT @code as code, @message as 'message';
		    END
	END TRY

	BEGIN CATCH
		IF @startedTransaction = 1 
            BEGIN
                ROLLBACK TRANSACTION;
                -- Log error details
                INSERT INTO dbo.ErroresSistema
                (
                    [method]
                   ,[errorNumber]
                   ,[errorSeverity]
                   ,[errorState]
                   ,[errorProcedure]
                   ,[errorLine]
                   ,[errorMessage]
                   ,[idUsuario]
                )
                VALUES
                (
                    'RetencionAts/Insert'
                   ,ERROR_NUMBER()
                   ,ERROR_SEVERITY()
                   ,ERROR_STATE()
                   ,ERROR_PROCEDURE()
                   ,ERROR_LINE()
                   ,ERROR_MESSAGE()
                   ,@idUsuario
                );

                SELECT '50001' Code, 'Error en el procedimiento: ' as Message;
				THROW;
            END
        ELSE
			BEGIN
				SET @ErrorCode = ERROR_NUMBER()
				SET @ErrorMessage = ERROR_MESSAGE()
			END
	END CATCH
END
GO
