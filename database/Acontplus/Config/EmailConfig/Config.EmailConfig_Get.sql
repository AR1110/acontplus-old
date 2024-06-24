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
	DECLARE @tipo INT 

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
            DECLARE @codDoc VARCHAR(10), @id INT

            SELECT @id = id, @codDoc = codDoc FROM OPENJSON(@json) WITH (id INT, codDoc VARCHAR(5))

            --> Factura Eletronica
            IF @codDoc = '01'
                BEGIN
                    SELECT TOP 1 fe.correo
                                ,fe.telefono
                    FROM Ventas.v_Factura fe WITH (NOLOCK) 
                    WHERE fe.idFactura = @id

                END 

            --> Liquidacion
            IF @codDoc = '03'
                BEGIN
                    SELECT TOP 1 pr.correo  
                                ,pr.telefono
                    FROM dbo.LiquidacionCompra lc WITH (NOLOCK)
                    INNER JOIN dbo.Proveedor   pr WITH (NOLOCK) ON pr.idProveedor = lc.idProveedor
                    WHERE lc.idLiquidacionCompra = @id
                END 

            --> Devolucion
            IF @codDoc = '04'
                BEGIN
                    SELECT TOP 1 cl.correo 
                                ,cl.telefono
                    FROM dbo.NotaCredito   nc WITH (NOLOCK) 
                    INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = nc.idCliente
                    WHERE nc.idNotaCredito = @id
                END 

            --> Devolucion
            IF @codDoc = '06'
                BEGIN
                    SELECT TOP 1 cl.correo 
                                ,cl.telefono
                    FROM dbo.GuiaRemision  gr WITH (NOLOCK) 
                    INNER JOIN dbo.Cliente cl WITH (NOLOCK) ON cl.idCliente = gr.idCliente
                    WHERE gr.idGuiaRemision = @id
                END 

            --> Rentecion
            IF @codDoc = '07'
                BEGIN
                    SELECT TOP 1 pr.correo  
                                ,pr.telefono
                    FROM FactElect.RetencionAts rt WITH (NOLOCK)
                    INNER JOIN dbo.Proveedor    pr WITH (NOLOCK) ON pr.idProveedor = rt.idProveedor
                    WHERE rt.idRetencionAts = @id
                END

            RETURN 
        END
END
