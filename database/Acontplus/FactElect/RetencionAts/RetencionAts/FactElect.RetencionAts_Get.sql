USE AcontPlus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2022-11-24
-- Description:	SP FOR GET DATA OVER RETENCIONES ATS
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_Get @userRoleId INT
,@json VARCHAR(MAX)
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT;

    --> Filters
	DECLARE @idEntidad INT,
        @userId INT;

    BEGIN TRY
        --> Data Json
	    SELECT @tipo =  tipo FROM OPENJSON(@json) WITH(tipo INT )

        --> Variables Globales 
        SELECT TOP 1 @idEntidad = idEntidad, @userId = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	    --> DataForm
	    IF @tipo = 2
		    BEGIN
                SET @tableNames = 'tiposIdentificacion,tiposIdentificacionProveedor,tiposComprobante,sustentosTributarios,tiposPago,tiposRegimen,countries,paraisosFiscales,taxes,tarifaImpuestos,impuestosRetencion,porcentajesRetIva,conceptosRetencionAir,formasPago,estabs,infoAdicional';
			    
                SELECT idTipoIdentificacion, codigo, codigoSri, descripcion FROM TipoIdentificacion WITH (NOLOCK) WHERE estado = 1 

			    SELECT Id, Codigo, Descripcion FROM Sri.TipoIdentificacionProveedor WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion FROM Sri.TipoComprobante WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT dst.Id, dst.TipoComprobanteId, st.Codigo, st.Descripcion
                FROM Sri.SustentoTributario st  WITH (NOLOCK)
			    INNER JOIN Sri.DocumentoSustentoTributario dst  WITH (NOLOCK) ON st.Id = dst.SustentoTributarioId
			    WHERE st.[Enabled] = CAST(1 AS BIT)

                SELECT Id, Codigo, Descripcion FROM Sri.TipoPago WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion FROM Sri.TipoRegimenFiscalExterior WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion FROM Sri.Pais WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT)   

			    SELECT Id, Codigo, Descripcion FROM Sri.ParaisoFiscal WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT * FROM Sri.Impuesto WITH (NOLOCK) WHERE estado = 1 

			    SELECT * FROM Sri.TarifaImpuesto WITH (NOLOCK) WHERE estado = 1

			    SELECT Id, Codigo, Descripcion FROM Sri.ImpuestoRetencion  WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion, Porcentaje FROM Sri.PorcentajeRetencionIva  WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT Id, Codigo, Descripcion, Porcentaje
                FROM Sri.ConceptoRetencionAir  WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT)
			
                SELECT Id, Codigo, Descripcion FROM Sri.FormaPago WITH (NOLOCK) WHERE [Enabled] = CAST(1 AS BIT) 

			    SELECT idEstablecimiento
                      ,nombreComercial
                      ,codEstab
                      ,idPuntoEmision
                      ,estab + '-' + ptoEmi as ptoEmi
                      ,defaultEstab
                      ,defaultPtoEmi 
                      ,estab
                      ,dirEstablecimiento
                      ,contribuyente
                      ,obligadoContabilidad
                FROM v_PtoEmi_Asign WITH(NOLOCK) 
                WHERE idUsuarioRol = @userRoleId 
                ORDER BY defaultEstab DESC

                SELECT cd.idPuntoEmision
                      ,cd.infoAdicional 
                FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
                INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
                INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento 
                INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
                WHERE es.idEntidad = @idEntidad
                  AND td.codigoSri = '07'
                  AND cd.infoAdicional IS NOT NULL

			    RETURN
		    END
    
        --> GetById
	    IF @tipo = 3
		    BEGIN
                SET @tableNames = 'retencionAts,documentosSustento,taxes,retenciones,payments,infoAdicional';
			    DECLARE @idRetencionATS INT ,@idDoc INT 

                SELECT @idDoc = idDoc FROM OPENJSON(@json) WITH(idDoc BIGINT )

			    SELECT TOP 1 @idRetencionATS = idRetencionAts FROM FactElect.RetencionAts WITH (NOLOCK)  WHERE idDocumentoElectronico = @idDoc
			
			    --INFO RETENCION
			    SELECT ra.*
                      ,pe.idPuntoEmision
                      ,sb.descripcion    as subContribuyente 
                      ,es.codEstab 
                      ,cu.IDCard         as identificacionSujetoRetenido
                      ,cu.BusinessName   as razonSocialSujetoRetenido
                      ,ti.codigoSri      as tipoIdentificacionSujetoRetenido
                FROM FactElect.RetencionAts         ra WITH (NOLOCK) 
                INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = ra.idDocumentoElectronico
                INNER JOIN Proveedor                pr WITH (NOLOCK) ON pr.idProveedor            = ra.idProveedor
                INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
                INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = pr.CustomerId
			     LEFT JOIN SubContribuyente         sb WITH (NOLOCK) ON sb.idSubContribuyente     = pr.idSubContribuyente
                INNER JOIN dbo.TipoIdentificacion   ti WITH (NOLOCK) ON ti.idTipoIdentificacion   = cu.IdTypeId
			    WHERE idRetencionAts = @idRetencionATS
			
			    --DOCUMENTOS DE SUSTENTOS
			    SELECT rads.*
			    ,idDocumento =  ISNULL((SELECT TOP 1 idDocumento FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                                                                 WHERE dr.claveAcceso = rads.numAutDocSustento),
                                       (SELECT TOP 1 fc.idFacturaCompra FROM FacturaCompra fc WITH (NOLOCK)
																	    WHERE REPLACE(puntoEmision,'-','')+Helper.F_Auto_Sequential(nroDocumento) = rads.numDocSustento))
			    ,isAutomatic = ISNULL((SELECT TOP 1 fc.isAutomatic FROM FacturaCompra fc WITH (NOLOCK)
																    WHERE REPLACE(puntoEmision,'-','')+Helper.F_Auto_Sequential(nroDocumento) = rads.numDocSustento), 
																    1
																    )
			    FROM FactElect.RetAtsDocSustento rads WITH (NOLOCK)
			    WHERE idRetencionAts = @idRetencionATS

			    --IMPUESTOS DEL DOCUMENTO DE SUSTENTO
			    SELECT * FROM FactElect.RetAtsImpDocSustento WITH (NOLOCK) WHERE idRetencionAts = @idRetencionATS

			    --RETENCIONES DEL DOCUMENTO DE SUSTENTO
			    SELECT * FROM FactElect.RetencionAtsRet WITH (NOLOCK)  WHERE idRetencionAts = @idRetencionATS

			    --FORMAS DE PAGO DEL DOCUMENTO DE SUSTENTO
			    SELECT * FROM FactElect.RetencionAtsPago WITH (NOLOCK)  WHERE idRetencionAts = @idRetencionATS

			    --INFO ADICIONAL DE LA RETENCION
			    SELECT * FROM FactElect.RetAtsInfoAdicional WITH (NOLOCK)  WHERE idRetencionAts = @idRetencionATS

			    RETURN
		    END

        --> FOR EMIT RETENCION ATS
	IF @tipo = 4
		BEGIN
			DECLARE @idCard VARCHAR(25);

            SET @tableNames = 'documents';

            SELECT @idCard = idCard FROM OPENJSON(@json) WITH (idCard VARCHAR(25));

            DECLARE @docsFounded AS TABLE(
				idDocumento INT NOT NULL,
                codDocSustento VARCHAR(2) NOT NULL,
                documentName VARCHAR(100),
                numDocSustento VARCHAR(50) NOT NULL,
				fechaEmisionDocSustento VARCHAR(25),
                numAutDocSustento VARCHAR(50) NOT NULL,
                importeTotal NUMERIC(18,2),
				isAutomatic BIT
			);

			INSERT INTO @docsFounded(idDocumento, codDocSustento, documentName, numDocSustento,
            fechaEmisionDocSustento, numAutDocSustento, importeTotal, isAutomatic)
			SELECT fc.idFacturaCompra, '01' ,'Factura Física',(fc.puntoEmision + '-' +RIGHT('000000000'+convert(varchar(9), fc.nroDocumento),9))
            ,CONVERT(VARCHAR, fc.fechaEmision, 23),fc.nroAutorizacion,fc.total,CAST(0 AS BIT)
			FROM dbo.FacturaCompra       fc WITH (NOLOCK)
			INNER JOIN dbo.Proveedor     pr WITH (NOLOCK) ON pr.idProveedor = fc.idProveedor
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id          = pr.CustomerId
			WHERE fc.idEntidad = @idEntidad
			  AND fc.estado = 1
              AND cu.IDCard = @idCard 
			  AND fc.retencion = 0
              AND MONTH(fc.fechaEmision) = MONTH(GETDATE())
              AND YEAR(fc.fechaEmision) = YEAR(GETDATE())
			  AND REPLACE(fc.puntoEmision,'-','')+Helper.F_Auto_Sequential(fc.nroDocumento) 
			    NOT IN 
                (
                        SELECT rd.numDocSustento
					    FROM FactElect.RetencionAts            ra WITH (NOLOCK)
                        INNER JOIN dbo.DocumentoElectronico    de WITH (NOLOCK) ON de.idDocumentoElectronico = ra.idDocumentoElectronico
					    INNER JOIN FactElect.RetAtsDocSustento rd WITH (NOLOCK) ON ra.idRetencionAts         = rd.idRetencionAts
					    INNER JOIN dbo.PuntoEmision            pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                        INNER JOIN sri.Establecimiento         es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
					    WHERE es.idEntidad   = @idEntidad 
                          AND ra.idProveedor = pr.idProveedor
                          AND ra.anuladaSri  = 0
			    ) 
            

			INSERT INTO @docsFounded(idDocumento, codDocSustento, documentName, numDocSustento, fechaEmisionDocSustento, numAutDocSustento, importeTotal, isAutomatic)
			SELECT 
            dr.idDocumento,
            dr.codDoc,
            CASE 
                WHEN dr.codDoc = '01' THEN 'Factura'
                WHEN dr.codDoc = '04' THEN 'Nota de Crédito'
                WHEN dr.codDoc = '06' THEN 'Guía de Remisión'
                WHEN dr.codDoc = '07' THEN 'Comprobante de Retención'
            END,
            dr.serieComprobante,
            FORMAT(CAST(dr.fechaEmision AS DATE), 'yyyy-MM-dd'),
            dr.claveAcceso,
            COALESCE(dr.importeTotal, 0),
            CAST(1 AS BIT)
            FROM 
                Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                INNER JOIN Sri.Establecimiento e WITH (NOLOCK)
                    ON e.idEstablecimiento = dr.idEstablecimiento
            WHERE 
                e.idEntidad = @idEntidad
                AND dr.estado = 1
                AND dr.rucEmisor = @idCard
                AND dr.codDoc = '01'
                AND MONTH(CAST(dr.fechaEmision AS DATE)) = MONTH(GETDATE())
                AND YEAR(CAST(dr.fechaEmision AS DATE)) = YEAR(GETDATE())
                AND NOT EXISTS (
                    SELECT 1
                    FROM FactElect.RetencionAts ra WITH (NOLOCK)
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK)
                        ON de.idDocumentoElectronico = ra.idDocumentoElectronico
                    INNER JOIN dbo.Proveedor pr WITH (NOLOCK)
                        ON pr.idProveedor = ra.idProveedor
                    INNER JOIN FactElect.RetAtsDocSustento rd WITH (NOLOCK)
                        ON rd.idRetencionAts = ra.idRetencionAts
                    INNER JOIN dbo.PuntoEmision pe WITH (NOLOCK)
                        ON pe.idPuntoEmision = de.idPuntoEmision
                    INNER JOIN sri.Establecimiento es WITH (NOLOCK)
                        ON es.idEstablecimiento = pe.idEstablecimiento
                    INNER JOIN Customer.Customer cu WITH (NOLOCK)
                        ON cu.Id = pr.CustomerId
                    WHERE 
                        es.idEntidad = @idEntidad
                        AND cu.IDCard = dr.rucEmisor
                        AND ra.anuladaSri = 0
                        AND rd.numDocSustento = REPLACE(dr.serieComprobante, '-', '')
                );
			SELECT * FROM @docsFounded ORDER BY fechaEmisionDocSustento DESC
		END
 
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES('RetencionAts/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
        THROW;
    END CATCH
END
GO
