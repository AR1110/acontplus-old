USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[ASPFirmaElectronicaGet]    Script Date: 7/17/2023 10:46:45 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2023-07-17
-- Description:	sp para guardar listar las firmas
-- =============================================
--ASPFirmaElectronicaGet 1
CREATE OR ALTER PROCEDURE Config.EmailConfig_Get @idUsuarioRol INT, @json VARCHAR(MAX) 
AS
BEGIN 
	SET NOCOUNT ON;   
    SET LANGUAGE SPANISH;

    --> Global
	DECLARE @tipo INT 

    --> Filter
    DECLARE @codDoc VARCHAR(10), @id INT

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get
	IF @tipo = 1
		BEGIN
			SELECT [idEmailConfig]
				  ,[enableSsl]
				  ,[from]
				  ,[host]
				  ,[password]
				  ,[port]
			FROM Config.Email_Config

            RETURN 
		END 

	--> Config. Envio Comprobantes
    IF @tipo = 2
        BEGIN
            DECLARE @idTipoDocumento INT

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @id

            SELECT TOP 1 @codDoc = codigoSri FROM TipoDocumento WITH (NOLOCK) WHERE idTipoDocumento = @idTipoDocumento

            --> Factura Eletronica
            IF @codDoc = '01'
                BEGIN
                    SELECT TOP 1 fe.idFactura as idDocumento 
                                ,cl.correo
                                ,cl.telefono
                                ,telefonoEstab = se.telefono
                                ,correoEstab   = se.correo 
                                ,nombreEstab   = se.nombreComercial 
                    FROM dbo.Factura                    fe WITH (NOLOCK) 
                    INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = fe.idCliente
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fe.idDocumentoElectronico
                    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                    INNER JOIN Sri.Establecimiento      se WITH (NOLOCK) ON se.idEstablecimiento      = pe.idEstablecimiento
                    WHERE fe.idDocumentoElectronico = @id

                END 

            --> Liquidacion
            IF @codDoc = '03'
                BEGIN
                    SELECT TOP 1 lc.idLiquidacionCompra as idDocumento 
                                ,pr.correo  
                                ,pr.telefono
                                ,telefonoEstab = se.telefono
                                ,correoEstab   = se.correo 
                                ,nombreEstab   = se.nombreComercial 
                    FROM dbo.LiquidacionCompra          lc WITH (NOLOCK)
                    INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor            = lc.idProveedor
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = lc.idDocumentoElectronico
                    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                    INNER JOIN Sri.Establecimiento      se WITH (NOLOCK) ON se.idEstablecimiento      = pe.idEstablecimiento
                    WHERE lc.idDocumentoElectronico = @id
                END 

            --> Devolucion
            IF @codDoc = '04'
                BEGIN
                    SELECT TOP 1 nc.idNotaCredito as idDocumento 
                                ,cl.correo 
                                ,cl.telefono
                                ,telefonoEstab = se.telefono
                                ,correoEstab   = se.correo 
                                ,nombreEstab   = se.nombreComercial 
                    FROM dbo.NotaCredito                nc WITH (NOLOCK) 
                    INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = nc.idCliente
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = nc.idDocumentoElectronico
                    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                    INNER JOIN Sri.Establecimiento      se WITH (NOLOCK) ON se.idEstablecimiento      = pe.idEstablecimiento
                    WHERE nc.idDocumentoElectronico = @id
                END 

            --> Devolucion
            IF @codDoc = '06'
                BEGIN
                    SELECT TOP 1 gr.idGuiaRemision as idDocumento 
                                ,cl.correo 
                                ,cl.telefono
                                ,telefonoEstab = se.telefono
                                ,correoEstab   = se.correo 
                                ,nombreEstab   = se.nombreComercial 
                    FROM dbo.GuiaRemision               gr WITH (NOLOCK) 
                    INNER JOIN dbo.Cliente              cl WITH (NOLOCK) ON cl.idCliente              = gr.idCliente
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = gr.idDocumentoElectronico
                    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                    INNER JOIN Sri.Establecimiento      se WITH (NOLOCK) ON se.idEstablecimiento      = pe.idEstablecimiento
                    WHERE gr.idDocumentoElectronico = @id
                END 

            --> Rentecion
            IF @codDoc = '07'
                BEGIN
                    SELECT TOP 1 rt.idRetencionAts as idDocumento
                                ,pr.correo  
                                ,pr.telefono
                                ,telefonoEstab = se.telefono
                                ,correoEstab   = se.correo 
                                ,nombreEstab   = se.nombreComercial 
                    FROM FactElect.RetencionAts         rt WITH (NOLOCK)
                    INNER JOIN dbo.Proveedor            pr WITH (NOLOCK) ON pr.idProveedor            = rt.idProveedor
                    INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = rt.idDocumentoElectronico
                    INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
                    INNER JOIN Sri.Establecimiento      se WITH (NOLOCK) ON se.idEstablecimiento      = pe.idEstablecimiento
                    WHERE rt.idDocumentoElectronico = @id
                END

            RETURN 
        END
    
    --> Config. Envio Comprobantes Fisicos
    IF @tipo = 3
        BEGIN
            
            SELECT @id = id, @codDoc = codDoc FROM OPENJSON(@json) WITH (id INT, codDoc VARCHAR(5))

            --> Nota Entrega
            IF @codDoc = 'NE'
                BEGIN
                    SELECT TOP 1 cl.correo 
                                ,cl.telefono
                                ,telefonoEstab = se.telefono
                                ,correoEstab   = se.correo 
                                ,nombreEstab   = se.nombreComercial 
                    FROM dbo.NotaEntrega   ne WITH (NOLOCK) 
                    INNER JOIN dbo.Cliente cl WITH (NOLOCK)        ON cl.idCliente         = ne.idCliente
                    INNER JOIN dbo.PuntoEmision pe WITH(NOLOCK)    ON pe.idPuntoEmision    = ne.idPuntoEmision
                    INNER JOIN Sri.Establecimiento se WITH(NOLOCK) ON se.idEstablecimiento = pe.idEstablecimiento
                    WHERE ne.idNotaEntrega = @id
                END 

            RETURN 
        END 

END
