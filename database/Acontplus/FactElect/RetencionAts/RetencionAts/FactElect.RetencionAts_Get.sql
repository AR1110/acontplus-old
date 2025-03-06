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
                SET @tableNames = 'tiposIdentificacion,sujetoRetenido,documentoSustento,sustentoTributario,tiposPago,tiposRegimen,countries,paraisosFiscales,taxes,tarifasImpuesto,impuestosRetencion,porcentajesRetIva,codigosRetencion,formasPago,estabs,infoAdicional';
			    
                SELECT * FROM TipoIdentificacion WITH (NOLOCK) 

			    SELECT * FROM Sri.SujetoRetenido WITH (NOLOCK) 

			    SELECT * FROM Sri.DocumentoSustento WITH (NOLOCK) 

			    SELECT dst.codDocSustento, st.codSustento, st.descripcion  FROM Sri.SustentoTributario st  WITH (NOLOCK)
			    INNER JOIN Sri.DocumentoSustentoTrib dst  WITH (NOLOCK) ON st.codSustento = dst.codSustento
			
                SELECT * FROM Sri.TipoPago WITH (NOLOCK) 

			    SELECT * FROM Sri.TipoRegimenFE WITH (NOLOCK) 

			    SELECT * FROM Sri.Pais WITH (NOLOCK)  

			    SELECT * FROM Sri.ParaisoFiscal WITH (NOLOCK) 

			    SELECT * FROM Sri.Impuesto WITH (NOLOCK) 

			    SELECT * FROM Sri.TarifaImpuesto WITH (NOLOCK) 

			    SELECT * FROM Sri.ImpuestoRetencion  WITH (NOLOCK)

			    SELECT * FROM Sri.PorcentajeRetIva  WITH (NOLOCK)

			    SELECT idCodigoRetencion, codigo, concepto descripcion, porcentajeMin porcentaje, estado FROM Sri.CodigoRetencion  WITH (NOLOCK)
			
                SELECT * FROM Sri.FormaPago WITH (NOLOCK) WHERE estado = 1 

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
				idDocumento INT, 
                documentName VARCHAR(100),
                numDocSustento VARCHAR(50) NOT NULL,
				fechaEmisionDocSustento VARCHAR(25),
                numAutDocSustento VARCHAR(50) NOT NULL,
                importeTotal NUMERIC(18,2),
				isAutomatic BIT
			);

			INSERT INTO @docsFounded(idDocumento, documentName, numDocSustento,
            fechaEmisionDocSustento, numAutDocSustento, importeTotal, isAutomatic)
			SELECT fc.idFacturaCompra,'Factura Física',(fc.puntoEmision + '-' +RIGHT('000000000'+convert(varchar(9), fc.nroDocumento),9))
            ,fc.fechaEmision,fc.nroAutorizacion,fc.total,CAST(0 AS BIT)
			FROM dbo.FacturaCompra       fc WITH (NOLOCK)
			INNER JOIN dbo.Proveedor     pr WITH (NOLOCK) ON pr.idProveedor = fc.idProveedor
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id          = pr.CustomerId
			WHERE fc.idEntidad = @idEntidad
			  AND fc.estado = 1
              AND cu.IDCard = @idCard 
			  AND fc.retencion = 0
              AND MONTH(fc.fechaEmision) = MONTH(GETDATE())
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
            

			INSERT INTO @docsFounded(idDocumento, documentName, numDocSustento, fechaEmisionDocSustento, numAutDocSustento, importeTotal, isAutomatic)
			SELECT dr.idDocumento
			,CASE 
							WHEN dr.codDoc = '01' THEN 'Factura'
							WHEN dr.codDoc = '04' THEN 'Nota de Crédito'
							WHEN dr.codDoc = '06' THEN 'Guía de Remisión'
							WHEN dr.codDoc = '07' THEN 'Comprobante de Retención'
						 END
			,dr.serieComprobante
			,dr.fechaEmision
            ,dr.claveAcceso
            ,ISNULL(dr.importeTotal, 0)
			,CAST(1 AS BIT)
 			FROM Recepcion.DocumentoRecibido dr  WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento   e ON e.idEstablecimiento = dr.idEstablecimiento
 			WHERE e.idEntidad = @idEntidad
			  AND dr.estado = 1
              AND dr.rucEmisor = @idCard
              AND dr.codDoc = '01'
              AND MONTH(dr.fechaEmision) = MONTH(GETDATE())
			  AND REPLACE(dr.serieComprobante, '-', '') 
			    NOT IN (
                    
                        SELECT rd.numDocSustento
					    FROM FactElect.RetencionAts             ra WITH (NOLOCK)
                        INNER JOIN dbo.DocumentoElectronico     de WITH (NOLOCK) ON de.idDocumentoElectronico = ra.idDocumentoElectronico
                        INNER JOIN dbo.Proveedor                pr WITH (NOLOCK) ON pr.idProveedor            = ra.idProveedor
					    INNER JOIN FactElect.RetAtsDocSustento  rd WITH (NOLOCK) ON rd.idRetencionAts         = ra.idRetencionAts
					    INNER JOIN dbo.PuntoEmision             pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                        INNER JOIN sri.Establecimiento          es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
                        INNER JOIN Customer.Customer            cu WITH (NOLOCK) ON cu.Id                     = pr.CustomerId
					    WHERE es.idEntidad = @idEntidad 
                          AND cu.IDCard = dr.rucEmisor
                          AND ra.anuladaSri = 0
			           )
              
			SELECT * FROM @docsFounded ORDER BY fechaEmisionDocSustento DESC
		END
    
    -->For retetenciones ats
	IF @tipo = 5
			BEGIN
                DECLARE @documentId INT,
                    @isAutomatic BIT;

                SET @tableNames = 'data';

                SELECT @documentId = documentId, @isAutomatic = isAutomatic FROM OPENJSON(@json) WITH (documentId INT, isAutomatic BIT)

				DECLARE @table TABLE 
				(
					codDoc VARCHAR(2),
					xmlComp XML
				)
				DECLARE @docSustento AS TABLE(
					idDocumento INT
					,isAutomatic BIT
					,codDocSustento VARCHAR(2)
					,fechaEmisionDocSustento DATETIME
					,numDocSustento VARCHAR(25)
					,numAutDocSustento VARCHAR(49)
					,totalSinImpuestos NUMERIC(18,2)
					,importeTotal NUMERIC(18,2)
				)
				DECLARE @taxes TABLE
				(
					codigo VARCHAR(5) NOT NULL
				   ,codigoPorcentaje VARCHAR(5) NOT NULL
				   ,baseImponible NUMERIC(18,2)NOT NULL 
				   ,valor NUMERIC(18,2)NOT NULL
				)
				DECLARE @tblPagos AS TABLE(
					formaPago varchar(2)
					,total NUMERIC (18,2)
				)

				IF (@isAutomatic = 1)
					BEGIN
						INSERT INTO @table (codDoc, xmlComp)
						SELECT ci.codDoc, xmlComp = CONVERT(xml,dbo.f_sanitize_xml(CONVERT(VARCHAR(MAX), CONVERT(XML, DECOMPRESS(ci.xmlCompressed)).query('/autorizacion/comprobante'))))
						FROM Recepcion.DocumentoRecibido ci
						WHERE idDocumento = @documentId

						INSERT INTO @docSustento(idDocumento, isAutomatic, codDocSustento, fechaEmisionDocSustento, numDocSustento, numAutDocSustento, totalSinImpuestos, importeTotal)
						SELECT dr.idDocumento idDocumento
						,1 isAutomatic
						,dr.codDoc codDocSustento
						,CONVERT(DATETIME, dr.fechaEmision, 103) fechaEmisionDocSustento
						,REPLACE(dr.serieComprobante,'-', '') numDocSustento
						,dr.claveAcceso numAutDocSustento
						,totalSinImpuestos = ISNULL((SELECT xmlComp.query('//comprobante/factura/infoFactura').value('(/infoFactura/totalSinImpuestos)[1]', 'NUMERIC(18,2)') FROM @table),0)
						,dr.importeTotal
						FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
						WHERE dr.idDocumento = @documentId

						INSERT INTO @taxes (codigo,codigoPorcentaje,baseImponible,valor)
						SELECT
							 codigo           = x.y.value('(codigo)[1]','VARCHAR(5)')
							,codigoPorcentaje = x.y.value('(codigoPorcentaje)[1]','VARCHAR(5)')
							,baseImponible    = x.y.value('(baseImponible)[1]','NUMERIC(18,2)')
							,valor            = x.y.value('(valor)[1]','NUMERIC(18,2)')
						FROM @table t
						CROSS APPLY t.xmlComp.nodes('//comprobante/factura/infoFactura/totalConImpuestos/totalImpuesto') x(y)

						INSERT INTO @tblPagos(formaPago, total)
						SELECT
							 formaPago           = x.y.value('(formaPago)[1]','VARCHAR(2)')
							,total = x.y.value('(total)[1]','numeric(18,2)')
						FROM @table t
						CROSS APPLY t.xmlComp.nodes('//comprobante/factura/infoFactura/pagos/pago') x(y)

						IF NOT EXISTS (SELECT 1 FROM @tblPagos)
							BEGIN
						        INSERT INTO @tblPagos(formapago, total)
						        SELECT '20' formaPago, importeTotal 
                                FROM Recepcion.DocumentoRecibido ci 
                                WHERE idDocumento = @documentId
                            END

					END
				ELSE
					BEGIN
						INSERT INTO @docSustento(idDocumento, isAutomatic, codDocSustento, fechaEmisionDocSustento, numDocSustento, numAutDocSustento, totalSinImpuestos, importeTotal)
						SELECT fc.idFacturaCompra idDocumento
						,ISNULL(fc.isAutomatic, 0) isAutomatic
						,'01' codDocSustento
						,fc.fechaEmision fechaEmisionDocSustento
						,(fc.puntoEmision + '-' +RIGHT('000000000'+convert(varchar(9), fc.nroDocumento),9)) numDocSustento
						,fc.nroAutorizacion numAutDocSustento
						,fc.subTotalSinImpuestos totalSinImpuestos
						,fc.total importeTotal
						FROM FacturaCompra fc WITH (NOLOCK)
						WHERE fc.idFacturaCompra = @documentId

						INSERT INTO @taxes (codigo,codigoPorcentaje,baseImponible,valor)
						SELECT im.codigo, ti.codigoPorcentaje, CAST(ROUND( sum(fci.TaxBase),2,1) AS numeric(18,2)), CAST(ROUND( sum(fci.TaxValue),2,1) AS numeric(18,2)) 
						FROM Compra.FacturaImpuesto fci
                        INNER JOIN dbo.TipoIva ti ON ti.idTipoIva = fci.TaxPercentId
                        INNER JOIN dbo.Impuesto im ON im.idImpuesto = fci.TaxId 
						WHERE fci.FacturaCompraId = @documentId
						GROUP BY ti.codigoPorcentaje ,im.codigo

						INSERT INTO @tblPagos(formapago, total)
                        SELECT formaPago, total FROM Compra.FormaPago WHERE idDocumento = @documentId  
					END

				SELECT doc   = (SELECT * FROM @docSustento FOR JSON PATH)
				      ,taxes = (SELECT 
								        impuesto = i.descripcion 
							           ,codImpuestoDocSustento = fci.codigo
							           ,porcentaje = ti.descripcion
							           ,codigoPorcentaje = fci.codigoPorcentaje
							           ,baseImponible = fci.baseImponible
							           ,ti.porcentaje tarifa
							           ,valorImpuesto = fci.valor
							    FROM @taxes fci
							    LEFT JOIN Sri.Impuesto i ON fci.codigo = i.codigo
							    LEFT JOIN Sri.TarifaImpuesto ti ON fci.codigo = ti.codImpuesto AND fci.codigoPorcentaje = ti.codigo
							    WHERE fci.baseImponible > 0 
							    FOR JSON PATH
						        )

				        ,payments = (SELECT * FROM @tblPagos FOR JSON PATH)

				RETURN
			END
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES('RetencionAts/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
        THROW;
    END CATCH
END
GO
