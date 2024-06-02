USE AcontPlus;

IF OBJECT_ID('Config.Sistema_Get')IS NOT NULL
	DROP PROCEDURE Config.Sistema_Get
GO


-- =============================================
-- Author:		Ramirez Alexis.
-- Create date: 5/09/2023 11:57 AM
-- Description:	GET para traer la configuracion del sistema
-- =============================================

CREATE OR ALTER PROCEDURE Config.Sistema_Get 
    @userRoleId INT
   ,@json VARCHAR(MAX)
   ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

	DECLARE @idEntidad INT, @codConfig VARCHAR(5)

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
	
	SELECT @codConfig = codConfig FROM OPENJSON(@json) WITH (codConfig VARCHAR(5))

    --> Config. Venta
	IF @codConfig = 'cv'
		BEGIN

            SET @tableNames = 'data,formasPagoSri'

            SELECT dt.idSistema
                  ,IIF(dt.idCliente  IS NULL,CAST(0 AS BIT),CAST(1 AS BIT)) as customerDefault
                  ,IIF(dt.idArticulo IS NULL,CAST(0 AS BIT),CAST(1 AS BIT)) as articleDefault
                  ,IIF(dt.cc         IS NULL,CAST(0 AS BIT),CAST(1 AS BIT)) as configCc
                  ,dt.cc
                  ,dt.printerAutomatic           
				  ,dt.payAutomatic
				  ,dt.multipleVendedor
                  ,dt.detailDuplicate
				  ,dt.configDeuda     
				  ,dt.tipoConfig 
				  ,dt.interes
                  ,dt.idFormaPagoSri
                  ,dt.idArticulo
                  ,dt.idCliente 
				  ,cl.nombreFiscal
				  ,cl.numeroIdentificacion
                  ,ar.descripcion
				  ,ar.codigo
            FROM Config.v_Sistema_Ventas dt WITH (NOLOCK)  
            LEFT JOIN dbo.Cliente        cl WITH (NOLOCK) ON cl.idCliente  = dt.idCliente
			LEFT JOIN dbo.Articulo       ar WITH (NOLOCK) ON ar.idArticulo = dt.idArticulo
            WHERE dt.idEntidad = @idEntidad

            SELECT idFormaPagoSri, descripcion, codigo FROM dbo.FormaPagoSri WHERE estado = 1

            RETURN 
		END 

    --> Config. Inventario
	IF @codConfig = 'CI'
		BEGIN

            SET @tableNames = 'data,metodosValoracion'

			SELECT dt.idMetodoValoracion
			      ,dt.idSistema                                             
				  ,dt.codMetodoValoracion                                 as codMetodoValoracion
			      ,IIF(dt.inventory = 'SI',CAST(1 AS BIT),CAST(0 AS BIT)) as llevaInventario
			FROM Config.v_Sistema_Inventario dt WITH (NOLOCK)
            WHERE dt.idEntidad = @idEntidad

			SELECT idMetodoValoracion , descripcion, codMetodoValoracion = codigo FROM Inventario.MetodoValoracion WITH (NOLOCK) WHERE estado = 1
			
            RETURN 
		END 
    
    --> Config. Decimales
	IF @codConfig = 'CD'
		BEGIN
            SET @tableNames = 'data'

			SELECT dt.*
			FROM Config.v_Sistema_Decimal dt
            WHERE dt.idEntidad = @idEntidad

            RETURN 
		END 
    
    --> Config. Notificaciones
	IF @codConfig = 'CS'
		BEGIN
            
            SET @tableNames = 'notificaciones'

            SELECT vs.estado
                  ,ns.descripcion as notificacion
                  ,vs.idSistema
                  ,ns.codigo 
                  ,vs.idNotificacionSistema
            FROM Config.v_Sistema_Notificacion    vs WITH (NOLOCK)
            INNER JOIN Config.NotificacionSistema ns WITH (NOLOCK) ON ns.idNotificacionSistema = vs.idNotificacionSistema
            WHERE idEntidad = @idEntidad

            RETURN 
		END 
END
GO
