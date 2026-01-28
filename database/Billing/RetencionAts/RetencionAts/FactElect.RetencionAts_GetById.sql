USE AcontPlus
GO
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Ivan Paz
-- Create date: 2025-04-18
-- Description:	SP FOR GET DATA Id OVER RETENCIONES ATS
-- =============================================
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_GetById @userRoleId INT
,@id INT
,@tableNames VARCHAR(500) OUT
AS
BEGIN
	SET NOCOUNT ON;
    SET XACT_ABORT ON;

    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT;

    --> Filters
	DECLARE @idEntidad INT,
        @userId INT;

    BEGIN TRY 
                SET @tableNames = 'retencionAts';
 
			    --INFO RETENCION
			    SELECT ra.*
                      ,pe.idPuntoEmision
                      ,sb.descripcion    as subContribuyente 
                      ,es.codEstab 
                      ,cu.IDCard         as identificacionSujetoRetenido
                      ,cu.BusinessName   as razonSocialSujetoRetenido
                      ,ti.codigoSri      as tipoIdentificacionSujetoRetenido
                      ,de.fechaEmision
                      ,documentosSustento = (
                      
                      			    SELECT rads.*
                                        ,dst.tipoComprobanteId
                                        ,dst.sustentoTributarioId
			                            ,idDocumento =  ISNULL((SELECT TOP 1 idDocumento FROM Recepcion.DocumentoRecibido dr WITH (NOLOCK)
                                                                                         WHERE dr.claveAcceso = rads.numAutDocSustento),
                                                               (SELECT TOP 1 fc.idFacturaCompra FROM FacturaCompra fc WITH (NOLOCK)
																	                            WHERE REPLACE(puntoEmision,'-','')+Helper.F_Auto_Sequential(nroDocumento) = rads.numDocSustento))
			                            ,isAutomatic = ISNULL((SELECT TOP 1 fc.isAutomatic FROM FacturaCompra fc WITH (NOLOCK)
																                            WHERE REPLACE(puntoEmision,'-','')+Helper.F_Auto_Sequential(nroDocumento) = rads.numDocSustento), 
																                            1
																                            )
                                        ,taxes = (SELECT t.*, ti.idImpuesto FROM FactElect.RetAtsImpDocSustento t WITH (NOLOCK)
                                                    INNER JOIN Sri.TarifaImpuesto ti WITH(NOLOCK) ON t.idTarifaImpuesto = ti.idTarifaImpuesto
                                                    WHERE t.idRetencionAts = ra.idRetencionAts
                                                    AND t.idRetAtsDocSustento = rads.idRetAtsDocSustento
                                                    FOR JSON PATH
                                            )
                                        ,retenciones = (
                                                             SELECT * FROM FactElect.RetencionAtsRet r WITH (NOLOCK) 
                                                             WHERE r.idRetencionAts = ra.idRetencionAts AND r.idRetAtsDocSustento = rads.idRetAtsDocSustento
                                                        FOR JSON PATH)
                                        ,payments = (
                    			                            SELECT * FROM FactElect.RetencionAtsPago rp WITH (NOLOCK)  WHERE rp.idRetencionAts = ra.idRetencionAts
                                                             AND rp.idRetAtsDocSustento = rads.idRetAtsDocSustento  FOR JSON PATH
                                            )
			                    FROM FactElect.RetAtsDocSustento rads WITH (NOLOCK)
                                    INNER JOIN Sri.DocumentoSustentoTributario dst ON rads.documentoSustentoTributarioId = dst.Id
			                    WHERE rads.idRetencionAts = ra.idRetencionAts FOR JSON PATH
                                )
                ,InfoAdicional = (
                SELECT * FROM FactElect.RetAtsInfoAdicional WITH (NOLOCK)  WHERE idRetencionAts = ra.idRetencionAts FOR JSON PATH)
                FROM FactElect.RetencionAts         ra WITH (NOLOCK) 
                INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = ra.idDocumentoElectronico
                INNER JOIN Proveedor                pr WITH (NOLOCK) ON pr.idProveedor            = ra.idProveedor
                INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
                INNER JOIN Customer.Customer        cu WITH (NOLOCK) ON cu.Id                     = pr.CustomerId
			    LEFT JOIN SubContribuyente         sb WITH (NOLOCK) ON sb.idSubContribuyente     = pr.idSubContribuyente
                INNER JOIN dbo.TipoIdentificacion   ti WITH (NOLOCK) ON ti.idTipoIdentificacion   = cu.IdTypeId
			    WHERE ra.idRetencionAts = @id	    
    END TRY
    BEGIN CATCH
        INSERT INTO dbo.ErroresSistema([method], [errorNumber], [errorSeverity], [errorState], [errorProcedure], [errorLine], [errorMessage], [idUsuario])
        VALUES('RetencionAts/Get', ERROR_NUMBER(), ERROR_SEVERITY(), ERROR_STATE(), ERROR_PROCEDURE(), ERROR_LINE(), ERROR_MESSAGE(), @userId);
        THROW;
    END CATCH
END
GO
