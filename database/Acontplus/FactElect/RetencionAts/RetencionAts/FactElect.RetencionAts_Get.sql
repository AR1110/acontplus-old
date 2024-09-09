USE AcontPlus
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
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
CREATE OR ALTER PROCEDURE FactElect.RetencionAts_Get @idRol INT ,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT

    --> Filters
	DECLARE @idEntidad INT

    --> Data Json
	SELECT @tipo =  tipo FROM OPENJSON(@json) WITH(tipo INT )

    --> Variables Globales 
    SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idRol

	--> DataForm
	IF @tipo = 1
		BEGIN
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
			
            SELECT * FROM Sri.FormaPago  WITH (NOLOCK)
 
			SELECT ea.codEstab_Asig, ea.predeterminado,
			e.*
			FROM Config.Estab_Asig ea WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento e WITH (NOLOCK)  ON ea.codEstab = e.codEstab
			WHERE idUsuarioRol = @idRol

			SELECT pa.idPtoEmi_asig, ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado, pa.estado
			FROM Config.PtoEmi_Asig pa  WITH (NOLOCK) 
			INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
			INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
 			WHERE ea.idUsuarioRol = @idRol

            SELECT cd.idPuntoEmision,cd.infoAdicional 
            FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
            INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento 
            INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
            WHERE es.idEntidad = @idEntidad
              AND td.codigoSri = '07'
              AND cd.infoAdicional IS NOT NULL

			RETURN
		END
    
    --> Get Id
	IF @tipo = 2
		BEGIN
			DECLARE @idRetencionATS INT ,@idDoc INT 

            SELECT @idDoc = idDoc FROM OPENJSON(@json) WITH(idDoc BIGINT )

			SELECT TOP 1 @idRetencionATS = idRetencionAts FROM FactElect.RetencionAts WITH (NOLOCK)  WHERE idDocumentoElectronico = @idDoc
			
			--INFO RETENCION
			SELECT ra.*
                  ,s.descripcion subContribuyente 
                  ,es.codEstab 
                  ,p.numeroIdentificacion as identificacionSujetoRetenido
                  ,p.nombreFiscal         as razonSocialSujetoRetenido
                  ,ti.codigoSri           as tipoIdentificacionSujetoRetenido
            FROM FactElect.RetencionAts         ra WITH (NOLOCK) 
            INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = ra.idDocumentoElectronico
            INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
            INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
			INNER JOIN Proveedor                 p WITH (NOLOCK) ON ra.idProveedor            = p.idProveedor
			 LEFT JOIN SubContribuyente          s WITH (NOLOCK) ON p.idSubContribuyente      = s.idSubContribuyente
             LEFT JOIN dbo.TipoIdentificacion   ti WITH (NOLOCK) ON ti.idTipoIdentificacion   = p.idTipoIdentificacion
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
END
GO
