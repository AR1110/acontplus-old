USE [AcontPlus]
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2025-10-14
-- Description:	SP para listar datos de las ventas para un uso generico 
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.GetLookups 
     @userRoleId INT
    ,@json VARCHAR(MAX) = NULL
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
    DECLARE @idEntidad INT ,@idUsuario INT ,@existePoliticaVenta BIT=0, @codRol VARCHAR(50)

    SELECT TOP 1 @idEntidad = idEntidad , @idUsuario = idUsuario ,@codRol = codRol FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    BEGIN TRY
        SET @tableNames = 'taxes,fees,credit_times,default_item,default_customer_company,sales_configuration,users,stock_notification,emission_points,warehouses,payment_methods,identification_types,additional_config,document_status'

        --> Verificamos si se cumple la política de múltiple vendedor para el documento de venta
        IF EXISTS (SELECT 1 FROM Config.v_Sistema_Ventas WHERE idEntidad = @idEntidad AND multipleVendedor = 1 AND @codRol = 'VEN')
            BEGIN
                SET @existePoliticaVenta = 1;
            END;

        SELECT idTipoIva
              ,idImpuesto
              ,descripcion
              ,tarifa = porcentaje
              ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
        FROM dbo.TipoIva WITH (NOLOCK)
        WHERE estado = 1

        SELECT idTarifa
              ,descripcion
              ,predeterminada
              ,codigo
        FROM Tarifa WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND estado = 1

        SELECT idTiempoCredito
	          ,descripcion
	          ,diasCredito
	          ,numeroCuota 
              ,entrada
        FROM TiempoCredito WITH (NOLOCK)
        WHERE idEntidad = @idEntidad AND gestion = 1 AND estado = 1

        SELECT a.idArticulo
	          ,a.codigo
	          ,a.descripcion
        FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
        INNER JOIN Articulo           a WITH (NOLOCK) ON a.idArticulo = gs.idArticulo
        WHERE gs.idEntidad = @idEntidad

        SELECT cl.idCliente
              ,cl.FormaPagoSriId       as idFormaPagoSri
	          ,cu.IDCard               as numeroIdentificacion
	          ,cl.direccion
	          ,cl.correo
              ,cu.IdTypeId             as idTipoIdentificacion
              ,cu.TradeName            as nombreComercial       
	          ,cu.BusinessName         as nombreFiscal
              ,cu.IDCard               as identificacionComprador
              ,cu.BusinessName         as razonSocialComprador
              ,cl.direccion            as direccionComprador
              ,cl.correo               as email
        FROM Config.v_Sistema_Ventas gs WITH (NOLOCK)
        INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente = gs.idCliente
        INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id        = cl.CustomerId
        WHERE gs.idEntidad = @idEntidad

        SELECT CAST(searchCode       AS BIT) as searchCode
	          ,CAST(printerAutomatic AS BIT) as printerAutomatic
	          ,CAST(payAutomatic     AS BIT) as payAutomatic
	          ,CAST(multipleVendedor AS BIT) as multipleVendedor
              ,CAST(detailDuplicate  AS BIT) as detailDuplicate
              ,CAST(idFormaPagoSri   AS INT) as idFormaPagoSri
        FROM Config.v_Sistema_Ventas gs
        WHERE gs.idEntidad = @idEntidad

        SELECT u.idUsuario
              ,u.nombreUsuario
              ,u.nombreCompleto
              ,predeterminado = CAST(IIF(u.idUsuario = @idUsuario, 1, 0) AS BIT)
        FROM v_usuario u WITH (NOLOCK)
        WHERE u.idEntidad = @idEntidad
          AND u.estadoUsuario = 1
          AND (
                @existePoliticaVenta = 0 OR u.codRol NOT IN ('ADM')
              );

        SELECT TOP 1 estado as notificacionVenta FROM Config.v_Sistema_Notificacion WITH (NOLOCK) WHERE codigo = 'MMD' AND idEntidad = @idEntidad

        SELECT idEstablecimiento
              ,nombreComercial
              ,codEstab
              ,idPuntoEmision
              ,estab + '-' + ptoEmi as ptoEmi
              ,defaultEstab
              ,defaultPtoEmi
        FROM v_PtoEmi_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idEstablecimiento
              ,nombreComercial
              ,codEstab
              ,idBodega
              ,bodega
              ,defaultEstab
              ,defaultBodega
        FROM v_Bodega_Asign WITH(NOLOCK)
        WHERE idUsuarioRol = @userRoleId
        ORDER BY defaultEstab DESC

        SELECT idFormaPagoSri, descripcion, codigo FROM dbo.FormaPagoSri WHERE estado = 1

        SELECT idTipoIdentificacion, descripcion, codigoSri FROM dbo.TipoIdentificacion WHERE estado = 1 AND codigoSri IN ('04','05','06')

        SELECT cd.idPuntoEmision, cd.infoAdicional
        FROM dbo.ConfiguracionDocumento cd WITH (NOLOCK)
        INNER JOIN dbo.PuntoEmision     pe WITH (NOLOCK) ON pe.idPuntoEmision    = cd.idPuntoEmision
        INNER JOIN dbo.TipoDocumento    td WITH (NOLOCK) ON td.idTipoDocumento   = cd.idTipoDocumento
        INNER JOIN Sri.Establecimiento  es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
        WHERE es.idEntidad = @idEntidad
            AND td.codigo = 'NE'
            AND cd.infoAdicional IS NOT NULL

        SELECT idEstadoPago, descripcion, codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('NCBR','CBR','A','AC') AND estado = 1

        RETURN
    END TRY

    BEGIN CATCH 
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ApiVentas/Lookups',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),'Ventas.GetLookups',ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

	END CATCH
END
