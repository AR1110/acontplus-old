USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPRetencionCompraReport]    Script Date: 12/8/2022 2:49:11 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
--Author: Emilio Senguana
--Date: 22 de abril del 2022
--Description: procedure for report Retencion Compra
--exec ReporteCompras.RetencionCompra 38,[{ "idRetencionCompra": 18}]

IF OBJECT_ID(N'ReporteCompras.RetencionCompra', N'P') IS NOT NULL
DROP PROCEDURE ReporteCompras.RetencionCompra
GO

--exec ReporteCompras.RetencionCompra '{"id":20, "versionComp": "2.0.0"}'
CREATE PROCEDURE ReporteCompras.RetencionCompra	@json NVARCHAR(MAX)
AS
BEGIN
 SET NOCOUNT  ON;
 SET LANGUAGE SPANISH;

 DECLARE @idTipoAmbiente INT 
 DECLARE @idRetencionCompra BIGINT
 DECLARE @idEntidad INT
 DECLARE @idTipoDocumento BIGINT 
 DECLARE @codEstab VARCHAR(50)
 DECLARE @imagen VARBINARY(MAX)
 DECLARE @mimeType VARCHAR(150)
 DECLARE @rdlcParams VARCHAR(MAX)
 DECLARE @headerDs VARCHAR(MAX)
 DECLARE @detailDs VARCHAR(MAX)
 DECLARE @infoAdditionalDs VARCHAR(MAX)
 DECLARE @normativeDs VARCHAR(MAX)
 DECLARE @dataSources VARCHAR(MAX)
 DECLARE @claveAcceso VARCHAR(50)
 DECLARE @nroDoc VARCHAR(20)
 DECLARE @fecha VARCHAR(100)
 DECLARE @cliente VARCHAR(150)
 DECLARE @importeTotal VARCHAR(150)
 DECLARE @razonSocial VARCHAR(200)
 DECLARE @telefono VARCHAR(50) 
 DECLARE @subject VARCHAR(100)
 DECLARE @email VARCHAR(50) = 'envio.comprobantes@acontplus.com.ec'
 DECLARE @password VARCHAR(50) = 'rmdodmyvosnwxzwt'
 DECLARE @nameDoc VARCHAR(150)
 DECLARE @dataMail VARCHAR(MAX)
 DECLARE @cc VARCHAR(100)
 DECLARE @versionComp VARCHAR(10)
 DECLARE @fechaAutorizacion DATETIME



	SELECT @idRetencionCompra = idRetencionCompra
	,@rdlcParams = rdlcParams 
	,@versionComp = versionComp
	FROM OPENJSON(@json)
	WITH (idRetencionCompra INT '$.id'
	,rdlcParams VARCHAR(MAX) '$.rdlcParams'
	,versionComp VARCHAR(MAX) '$.versionComp'
	) AS dt 
	
	SELECT @fechaAutorizacion = fechaAutorizacion FROM DocumentoElectronico WITH (NOLOCK) WHERE idDocumento = @idRetencionCompra AND codDoc = '07' AND versionComp = @versionComp
	PRINT @versionComp
	IF @versionComp = '1.0.0'
		BEGIN
			SELECT 
				@idTipoDocumento = rc.idTipoDocumento,
				@codEstab        = pe.codEstab,
				@claveAcceso     = claveAcceso,
				@idEntidad       = rc.idEntidad,
				@subject         = 'Comprobante Electrónico - Acontplus N°: '+ s.estab+'-'+pe.ptoEmi+'-'+dbo.AFTAutoComplete(rc.nroDocumento),
				@cliente         = pr.nombreFiscal,
				@importeTotal    = CAST(rc.total AS DECIMAL(15,2)),
				@telefono        = e.telefono,
				@razonSocial     = e.razonSocial,
				@nroDoc          = dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,rc.nroDocumento),
				@fecha           = CONVERT(NVARCHAR,FORMAT(rc.fechaEmision, 'dd/MM/yyyy HH:mm')),
				@nameDoc         = 'Retención'+'-'+dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,rc.nroDocumento),
				@cc              = e.email
			FROM dbo.RetencionCompra      rc WITH (NOLOCK)
			INNER JOIN dbo.PuntoEmision   pe WITH (NOLOCK) ON pe.idPuntoEmision  = rc.idPuntoEmision
			INNER JOIN Sri.Establecimiento s WITH (NOLOCK) ON s.codEstab         = pe.codEstab
			INNER JOIN dbo.Proveedor      pr WITH (NOLOCK) ON pr.idProveedor     = rc.idProveedor
			INNER JOIN dbo.Entidad         e WITH (NOLOCK) ON e.idEntidad        = rc.idEntidad
			WHERE idRetencionCompra = @idRetencionCompra;

			SELECT @imagen = imagen, @mimeType = mimeType FROM Config.Estab_Logo WHERE codEstab = @codEstab

			SET @headerDs = (
								SELECT
									 rc.idRetencionCompra
									,dbo.AFTGenerarNroDocumento(s.estab+pe.ptoEmi,rc.nroDocumento) nroDocumento
									,rc.claveAcceso  as nroAutorizacion
									,CONVERT(NVARCHAR, FORMAT(ISNULL(rc.fechaAutorizacionSri,rc.fechaEmision), 'dd/MM/yyyy hh:mm')) as fechaAutorizacion  
									,tipoDocumento = 'Retención'
									,ambiente = IIF(pe.ambiente='1','PRUEBA','PRODCCIÓN')
									,CASE WHEN rc.emision = '1' THEN 'NORMAL' ELSE '' END AS emision
									,e.razonSocial as razonSocialEntidad
									,s.nombreComercial as nombreComercialEntidad
									,e.ruc as rucEntidad
									,e.telefono as telefonoEntidad
									,e.email as emailEntidad											
									,e.direccion as direccionEntidad			
									,s.dirEstablecimiento 
									,rc.claveAcceso as  claveAcceso 
									,s.agenteRetencion
									,s.contribuyenteRimpe
									,obligadoLlevarContabilidad = s.obligadoContabilidad			 			
									,prov.numeroIdentificacion as nroIdentificacion
									,prov.nombreFiscal as nombreFiscalProveedor
									,ISNULL(prov.correo, 'S/N') as correoProveedor
									,ISNULL(prov.telefono, 'S/N') as telefonoProveedor
									,ISNULL(prov.direccion, 'S/N') as direccionProveedor								
									,CONVERT(NVARCHAR, FORMAT(rc.fechaEmision, 'dd/MM/yyyy hh:mm')) as fechaEmision 		
									,CAST((SELECT SUM(valorRetenido) FROM dbo.RetencionCompraDetalle WHERE idRetencionCompra = @idRetencionCompra) as numeric(15, 2)) as totalValorRetenido
								FROM dbo.RetencionCompra rc WITH (NOLOCK)
								INNER JOIN dbo.PuntoEmision       pe WITH (NOLOCK) ON pe.idPuntoEmision       = rc.idPuntoEmision 
								INNER JOIN Sri.Establecimiento     s WITH (NOLOCK) ON s.codEstab              = pe.codEstab
								INNER JOIN dbo.Proveedor        prov WITH (NOLOCK) ON prov.idProveedor        = rc.idProveedor
								INNER JOIN dbo.Entidad             e WITH (NOLOCK) ON e.idEntidad             = rc.idEntidad	
								WHERE rc.idRetencionCompra =  @idRetencionCompra
								FOR JSON PATH
							);


			SET @detailDs = (
								SELECT 
									 td.descripcion as comprobante
									,i.descripcion as impuesto
									,CASE WHEN i.codigo = 1 THEN (SELECT codigoAnexo FROM RetencionRenta WITH (NOLOCK) WHERE idRetencionRenta = rcd.idRetencion)
										  WHEN i.codigo = 2 THEN (SELECT codigoSri FROM RetencionIva WITH (NOLOCK) WHERE idRetencionIva = rcd.idRetencion)
									  END AS codigoRetencion
									,CONVERT(NVARCHAR, FORMAT(fc.fechaEmision, 'dd/MM/yyyy hh:mm:ss')) as fechaEmisionComprobante
									,dbo.AFTGenerarNroDocumento(fc.puntoEmision,fc.nroDocumento) nroFactura
									,CAST(rcd.porcentajeRetencion as numeric(15, 2)) as porcentajeRetencion
									,CAST(rcd.baseImponible AS numeric(15,2))  as baseImponible 
									,CAST(rcd.valorRetenido as numeric(15, 2)) as valorRetenido
								FROM dbo.RetencionCompraDetalle rcd WITH (NOLOCK)
								INNER JOIN dbo.Impuesto         i WITH (NOLOCK) ON i.idImpuesto         = rcd.idImpuesto 
								INNER JOIN dbo.RetencionCompra rc WITH (NOLOCK) ON rc.idRetencionCompra = rcd.idRetencionCompra
								INNER JOIN dbo.FacturaCompra   fc WITH (NOLOCK) ON fc.idFacturaCompra   = rc.idFacturaCompra	
								INNER JOIN dbo.TipoDocumento   td WITH (NOLOCK) ON td.idTipoDocumento   = fc.idTipoDocumento
								WHERE rcd.idRetencionCompra = @idRetencionCompra
								FOR JSON PATH
							)
		
			SET @infoAdditionalDs = (
										SELECT nombre,valor FROM InfoAdicionalDoc WITH (NOLOCK) WHERE idComprobante = @idRetencionCompra AND idTipoDocumento = @idTipoDocumento
										FOR JSON PATH
									)

			SET @dataMail = (   
								SELECT 'Retención Nro. '+@nroDoc documento, @fecha fechaEmision,  @cliente cliente, @importeTotal importeTotal,
								@razonSocial razonSocial,
								@telefono telefono
								FOR JSON path 
							)

			SET @dataSources = (SELECT RetencionCompraDs = @headerDs, RetencionCompraDetalleDs = @detailDs, InfoAdicionalDs = ISNULL(@infoAdditionalDs,'[]') FOR JSON PATH)

			SELECT  imagen = @imagen
			       ,mimeType = @mimeType
				   ,claveAcceso = @claveAcceso
				   ,rdlcParams = @rdlcParams
				   ,dataSources = @dataSources
				   ,ISNULL(@email,'') as 'from'
				   ,ISNULL(@password,'') as 'password'
				   ,ISNULL(@subject,'') as 'subject'
				   ,ISNULL(@cc,'') as 'cc'  
				   ,ISNULL(@nameDoc,'') as 'invoiceName'
				   ,'logoAcontPlus.jpg' logo
				   ,'smtp.gmail.com' host
				   ,587 as 'port'
				   ,1 EnableSsl
				   ,dataMail = @dataMail
		END
	ELSE
		BEGIN
			SELECT 
				@idTipoDocumento = td.idTipoDocumento,
				@imagen          = el.imagen,
				@claveAcceso     = d.claveAcceso,
				@idEntidad       = e.idEntidad,
				@subject         = 'Comprobante Electrónico - Acontplus N°: '+ s.estab+'-'+rc.ptoEmi+'-'+dbo.AFTAutoComplete(rc.secuencial),
				@cliente         = pr.nombreFiscal,
				--@importeTotal    = CAST(rc.total AS DECIMAL(15,2)),
				@telefono        = e.telefono,
				@razonSocial     = e.razonSocial,
				@nroDoc          = dbo.AFTGenerarNroDocumento(s.estab + rc.ptoEmi,rc.secuencial),
				@fecha           = CONVERT(NVARCHAR,FORMAT(rc.fechaEmision, 'dd/MM/yyyy HH:mm')),
				@nameDoc         = td.descripcion+'-'+dbo.AFTGenerarNroDocumento(s.estab+rc.ptoEmi,rc.secuencial),
				@cc              = e.email
			FROM FactElect.RetencionAts         rc WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento       s WITH (NOLOCK) ON s.codestab        = rc.codestab
			INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor    = rc.idProveedor
			INNER JOIN dbo.DocumentoElectronico d  WITH (NOLOCK) ON s.codEstab        = d.codEstab    AND 
			                                                        d.codDoc          = '07'          AND 
																	rc.idRetencionAts = d.idDocumento AND 
																	d.versionComp     = '2.0.0'
			INNER JOIN dbo.Entidad               e WITH(NOLOCK)  ON e.ruc        = d.ruc 
			INNER JOIN dbo.TipoDocumento        td WITH (NOLOCK) ON td.codigoSri = '07'
			INNER JOIN Config.Estab_Logo        el WITH (NOLOCK) ON s.codEstab   = el.codEstab
			WHERE idRetencionAts = @idRetencionCompra;
		
			PRINT CAST(@idRetencionCompra AS VARCHAR(20))
			PRINT CAST(@idEntidad AS VARCHAR(20))

			--SELECT FROM EntidadLogo WHERE idEntidad = @idEntidad

			SET @headerDs = (
								SELECT 
									 rc.idRetencionAts idRetencionCompra
									,dbo.AFTGenerarNroDocumento(s.estab+rc.ptoEmi,rc.secuencial) nroDocumento
									,rc.claveAcceso  as nroAutorizacion
									,CONVERT(NVARCHAR, FORMAT(ISNULL(@fechaAutorizacion,rc.fechaEmision), 'dd/MM/yyyy hh:mm')) as fechaAutorizacion  
									,tipoDocumento = UPPER(td.descripcion)
									,UPPER(rc.ambiente) as ambiente
									,CASE WHEN rc.tipoEmision = '1' THEN 'NORMAL' ELSE '' END AS emision
									,e.razonSocial as razonSocialEntidad
									,e.nombreComercial as nombreComercialEntidad
									,e.ruc as rucEntidad
									,e.telefono as telefonoEntidad
									,e.email as emailEntidad											
									,e.direccion as direccionEntidad
									,rc.claveAcceso as  claveAcceso 
									,td.codigoSri as codDoc	
									,s.contribuyenteEspecial
									,s.obligadoContabilidad 	
									,s.dirEstablecimiento  
									,s.agenteRetencion
									,s.contribuyenteRimpe
									,prov.numeroIdentificacion as nroIdentificacion
									,prov.nombreFiscal as nombreFiscalProveedor
									,ISNULL(prov.correo, 'S/N') as correoProveedor
									,ISNULL(prov.telefono, 'S/N') as telefonoProveedor
									,ISNULL(prov.direccion, 'S/N') as direccionProveedor								
									,CONVERT(NVARCHAR, FORMAT(rc.fechaEmision, 'dd/MM/yyyy hh:mm')) as fechaEmision 		
									,CAST((SELECT SUM(valorRetenido) FROM dbo.RetencionCompraDetalle WHERE idRetencionCompra = @idRetencionCompra) as numeric(15, 2)) as totalValorRetenido
								FROM FactElect.RetencionAts        rc WITH (NOLOCK)
								INNER JOIN Sri.Establecimiento      s WITH (NOLOCK) ON s.codEstab              = rc.codEstab
								INNER JOIN dbo.TipoDocumento       td WITH (NOLOCK) ON td.codigoSri            = '07'
								INNER JOIN dbo.Proveedor         prov WITH (NOLOCK) ON prov.idProveedor        = rc.idProveedor
								INNER JOIN dbo.TipoIdentificacion  ti WITH (NOLOCK) ON ti.idTipoIdentificacion = prov.idTipoIdentificacion		
								INNER JOIN dbo.DocumentoElectronico d WITH (NOLOCK) ON s.codEstab              = d.codEstab
								AND d.codDoc = '07' 
								AND rc.idRetencionAts = d.idDocumento
								AND d.versionComp = '2.0.0'
								INNER JOIN Entidad e WITH(NOLOCK) ON e.ruc = d.ruc 								
 								WHERE rc.idRetencionAts =  @idRetencionCompra
								FOR JSON PATH
							);


			SET @detailDs = (
								SELECT 
									ds.codDocSustento as comprobante
									,i.descripcion as impuesto
									,ret.codigoRetencion
									,rcd.fechaEmisionDocSustento as fechaEmisionComprobante
									,rcd.numDocSustento nroFactura
									,CAST(ret.porcentajeRetener as numeric(15, 2)) as porcentajeRetencion
									,CAST(ret.baseImponible AS numeric(15,2))  as baseImponible 
									,CAST(ret.valorRetenido as numeric(15, 2)) as valorRetenido
								FROM FactElect.RetAtsDocSustento rcd WITH (NOLOCK)
								INNER JOIN Sri.DocumentoSustento      ds WITH (NOLOCK) ON rcd.codDocSustento      = ds.codDocSustento
								INNER JOIN FactElect.RetencionAtsRet ret WITH (NOLOCK) ON rcd.idRetAtsDocSustento = ret.idRetAtsDocSustento
								INNER JOIN Sri.ImpuestoRetencion       i WITH (NOLOCK) ON ret.codigo              = i.codigo
								WHERE rcd.idRetencionAts = @idRetencionCompra
								FOR JSON PATH
							)

			SET @importeTotal = (SELECT CAST(SUM(ret.valorRetenido) AS numeric(18,2)) FROM FactElect.RetAtsDocSustento rcd  WITH (NOLOCK) 								
			INNER JOIN FactElect.RetencionAtsRet ret WITH (NOLOCK) ON rcd.idRetAtsDocSustento = ret.idRetAtsDocSustento
					WHERE rcd.idRetencionAts = @idRetencionCompra )
		
			SET @infoAdditionalDs = (
										SELECT nombre,valor FROM FactElect.RetAtsInfoAdicional WITH (NOLOCK) WHERE idRetencionAts = @idRetencionCompra
										FOR JSON PATH
									)

			SET @dataMail = (   
								SELECT 'Retención Nro. '+@nroDoc documento, @fecha fechaEmision,  @cliente cliente, @importeTotal importeTotal,
								@razonSocial razonSocial,
								@telefono telefono
								FOR JSON path 
							)

			SET @dataSources = (SELECT RetencionCompraDs = @headerDs, RetencionCompraDetalleDs = @detailDs, InfoAdicionalDs = ISNULL(@infoAdditionalDs,'[]') FOR JSON PATH)

			SELECT  imagen = @imagen
		           ,mimeType = @mimeType
				   ,claveAcceso = @claveAcceso
				   ,rdlcParams = @rdlcParams
				   ,dataSources = @dataSources
				   ,ISNULL(@email,'') as 'from'
				   ,ISNULL(@password,'') as 'password'
				   ,ISNULL(@subject,'') as 'subject'
				   ,ISNULL(@cc,'') as 'cc'  
				   ,ISNULL(@nameDoc,'') as 'invoiceName'
				   ,'logoAcontPlus.jpg' logo
				   ,'smtp.gmail.com' host
				   ,587 as 'port'
				   ,1 EnableSsl
				   ,dataMail = @dataMail
		END
END 

