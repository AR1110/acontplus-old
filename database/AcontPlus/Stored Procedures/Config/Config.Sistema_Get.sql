USE AcontPlus;

IF OBJECT_ID('Config.Sistema_Get')IS NOT NULL
	DROP PROCEDURE Config.Sistema_Get
GO


-- =============================================
-- Author:		Ramirez Alexis.
-- Create date: 5/09/2023 11:57 AM
-- Description:	GET para traer la configuracion del sistema
-- =============================================

CREATE PROCEDURE Config.Sistema_Get @idUsuarioRol INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @idEntidad AS INT
	DECLARE @codConfig AS VARCHAR(5)
	DECLARE @jsonConfig AS VARCHAR(MAX)
	DECLARE @idSistema AS INT

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol
	
	SELECT @codConfig = codConfig FROM OPENJSON(@json) WITH (codConfig VARCHAR(5) '$.codConfig')

	SELECT TOP 1 @jsonConfig = jsonConfig, @idSistema = idSistema FROM Config.Sistema WITH (NOLOCK) WHERE idEntidad = @idEntidad AND codConfig = @codConfig

	IF @codConfig = 'cv'
		BEGIN
			SELECT dt.*
			      ,idSistema = @idSistema
				  ,cl.nombreFiscal
				  ,cl.numeroIdentificacion
				  ,ar.descripcion
				  ,ar.codigo
				  ,customerDefault = IIF(dt.idCliente IS NULL ,CAST(0 AS BIT),CAST(1 AS BIT))
	              ,articleDefault  = IIF(dt.idArticulo IS NULL,CAST(0 AS BIT),CAST(1 AS BIT))
				  ,configDeuda     = IIF(dt.porcentajeInteres IS NULL,CAST(0 AS BIT),CAST(1 AS BIT))
				  ,dt.diasGracia     
				  ,dt.porcentajeInteres     
			FROM OPENJSON(@jsonConfig)
			WITH (idCliente        INT '$.idCliente'
			    ,idArticulo        INT '$.idArticulo'
				,searchCode        BIT '$.searchCode'
				,printerAutomatic  BIT '$.printerAutomatic'
				,payAutomatic      BIT '$.payAutomatic'
				,diasGracia        INT '$.diasGracia'
				,porcentajeInteres NUMERIC(18,5) '$.porcentajeInteres') as dt
			LEFT JOIN dbo.Cliente  cl WITH (NOLOCK) ON cl.idCliente  = dt.idCliente
			LEFT JOIN dbo.Articulo ar WITH (NOLOCK) ON ar.idArticulo = dt.idArticulo
		END 

	IF @codConfig = 'CI'
		BEGIN
			SELECT dt.idMetodoValoracion
			      ,idSistema = @idSistema
				  ,codMetodoValoracion = dt.codMetodoValoracion
			      ,llevaInventario = IIF(dt.llevaInventario = 'SI',CAST(1 AS BIT),CAST(0 AS BIT))
			FROM OPENJSON(@jsonConfig)
			WITH (idMetodoValoracion INT        '$.idMetodoValoracion'
				,llevaInventario     VARCHAR(5) '$.llevaInventario'
				,codMetodoValoracion VARCHAR(5) '$.codMetodoValoracion') as dt

			SELECT idMetodoValoracion , descripcion, codMetodoValoracion = codigo FROM Inventario.MetodoValoracion WHERE estado = 1
			
		END 

	IF @codConfig = 'CD'
		BEGIN
			SELECT dt.*,idSistema = @idSistema
			FROM OPENJSON(@jsonConfig)
			WITH (codTransaccion      VARCHAR(5) '$.codTransaccion'
			     ,nroPrecio                  INT '$.nroPrecio'
				 ,nroCantidad                INT '$.nroCantidad'
				 ,nroIva                     INT '$.nroIva'
				 ,nroDescuentoDetalle        INT '$.nroDescuentoDetalle'
				 ,nroTotalDetalle            INT '$.nroTotalDetalle'
				 ,nroTotalSubTotal           INT '$.nroTotalSubTotal'
				 ,nroDescuento               INT '$.nroDescuento'
				 ,nroIce                     INT '$.nroIce') as dt
		END 

	IF @codConfig = 'CS'
		BEGIN
			SELECT dt.*,notificacion = ns.descripcion,idSistema = @idSistema
			FROM OPENJSON(@jsonConfig)
			WITH (idNotificacionSistema INT '$.idNotificacionSistema'
			     ,codigo         VARCHAR(5) '$.codigo'
				 ,estado                BIT '$.estado') as dt
			INNER JOIN Config.NotificacionSistema ns WITH (NOLOCK) ON ns.idNotificacionSistema = dt.idNotificacionSistema
		END 
END
GO
