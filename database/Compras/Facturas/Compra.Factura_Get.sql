USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Factura_Get]    Script Date: 11/21/2022 2:56:48 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-12-03
-- Description:	SP para listar las facturas de compra 
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Factura_Get
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
    SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
		
    --> Global
    DECLARE @tipo INT ,@idEntidad INT 
		
    --> Filters
    DECLARE @checkBoxFecha BIT ,@idProveedor INT,@codEstadoDoc VARCHAR(20) ,@idUsuario INT ,@fechaInicio DATETIME2 ,@fechaFin DATETIME2

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX) ,@pageIndex INT ,@pageSize INT
		
    --> Filter
    DECLARE @codEstab VARCHAR(150)
	       ,@ruc VARCHAR(20)
	       ,@id BIGINT
	       ,@textSearch VARCHAR(50)
	       ,@isAutomatic BIT
           ,@subcategoryId INT

    --> Variables
    SELECT TOP 1 @idEntidad  = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get
    IF @tipo = 1
        BEGIN
                
            SET @tableNames = 'facturas'

            SET @params = '@idEntidad     INT
                          ,@idProveedor   INT
                          ,@idUsuario     INT
                          ,@codEstab      VARCHAR(50)
                          ,@fechaInicio   DATETIME2
                          ,@fechaFin      DATETIME2
                          ,@codEstadoDoc  VARCHAR(25)
                          ,@pageIndex     INT
                          ,@pageSize      INT
                          ,@subcategoryId INT'

            SET @sql = 'SELECT idDocumento                                  as id
                              ,FORMAT(fechaEmision, ''dd/MM/yyyy HH:mm'') as fechaEmision
	                          ,FORMAT(fechaVencimiento, ''dd/MM/yyyy'')   as fechaVencimiento
	                          ,serieComprobante
	                          ,identificacionProveedor
	                          ,razonSocialProveedor
	                          ,importeTotal
	                          ,abono
	                          ,saldo
	                          ,estado
	                          ,usuario
                              ,CASE codEstado WHEN ''A'' THEN ''table-danger''  ELSE '''' END as style
                              ,COUNT(*) OVER()                                                as totalRecords
                        FROM v_CuentaPorPagar
                        WHERE codDoc = ''FC''
                          AND idEntidad = @idEntidad '

            SELECT @codEstab       = codEstab
				  ,@checkBoxFecha  = checkBoxFecha     
                  ,@fechaInicio    = fechaInicio 
                  ,@fechaFin       = fechaFin
                  ,@codEstadoDoc   = codEstadoDoc
				  ,@idProveedor    = idProveedor
                  ,@idUsuario      = idUsuario
                  ,@pageSize       = pageSize
				  ,@pageIndex      = pageIndex
                  ,@subcategoryId  = subcategoryId
			FROM OPENJSON(@json) WITH
            (
                 codEstab      VARCHAR(100) 
				,checkBoxFecha BIT   
                ,fechaInicio   DATETIME2  
                ,fechaFin      DATETIME2 
                ,codEstadoDoc  VARCHAR(5) 
                ,idProveedor   INT 
                ,idUsuario     INT
                ,pageSize      INT
                ,pageIndex     INT
                ,subcategoryId INT
			)

            IF @codEstab IS NOT NULL
                BEGIN  
                    SET @sql = @sql + 'AND codEstab = @codEstab ' 
                END 

            IF @idProveedor > 0 
                BEGIN
                    SET @sql = @sql + 'AND idProveedor = @idProveedor '
                END 

            IF @idUsuario > 0
                BEGIN
                    SET @sql = @sql + 'AND idUsuario = @idUsuario '
                END 

            IF @checkBoxFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(fechaEmision as date) BETWEEN CAST(@fechaInicio as date) AND CAST(@fechaFin as date) ' 
                END 

            IF @codEstadoDoc IS NOT NULL
				BEGIN
					IF @codEstadoDoc = 'NPA'  
						BEGIN
							SET @sql = @sql + 'AND codEstado IN (''PE'',''PP'') '
						END
					ELSE 
						BEGIN
							SET @sql = @sql + 'AND codEstado = @codEstadoDoc '
						END 
				END

            IF @subcategoryId > 0
                BEGIN
                    SET @sql = @sql + 'AND subcategoryId = @subcategoryId '
                END 

            SET @sql = @sql + 'ORDER BY idDocumento DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
			                  ,@params 
				              ,@idProveedor   = @idProveedor
                              ,@subcategoryId = @subcategoryId
				              ,@idEntidad     = @idEntidad
                              ,@fechaInicio   = @fechaInicio
				              ,@fechaFin      = @fechaFin
				              ,@codEstadoDoc  = @codEstadoDoc
				              ,@codEstab      = @codEstab
                              ,@pageIndex     = @pageIndex
                              ,@pageSize      = @pageSize
                              ,@idUsuario     = @idUsuario

            RETURN 
        END 
        
    --> DataForm
    IF @tipo = 2
        BEGIN
                
            SET @tableNames = 'configDecimales,impuestos,tiempoCredito,bodegas,categoriasCompra,sustentosTributario,subcategories'

            SELECT nroPrecio
	              ,nroCantidad
	              ,nroIva
	              ,nroDescuentoDetalle
	              ,nroTotalDetalle
	              ,nroTotalSubTotal
	              ,nroDescuento
	              ,nroIce
	              ,ISNULL(importeTotal,2) as importeTotal
            FROM Config.v_Sistema_Decimal WITH (NOLOCK)
            WHERE codTrasaccion = 'C' AND idEntidad = @idEntidad

            SELECT idTipoIva
                  ,idImpuesto
	              ,descripcion
	              ,tarifa = porcentaje
	              ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
                  ,estado 
            FROM dbo.TipoIva WITH (NOLOCK) 
            WHERE estado = 1
			
			SELECT idTiempoCredito,descripcion,diasCredito,numeroCuota,entrada FROM TiempoCredito WITH (NOLOCK) WHERE idEntidad = @idEntidad AND gestion = 0 AND estado = 1

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idBodega
                  ,bodega
                  ,defaultEstab
                  ,defaultBodega 
            FROM v_Bodega_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idCategoriaCompra
		          ,descripcion
	        FROM dbo.CategoriaCompra 
	        WHERE idEntidad = @idEntidad AND estado = 1
	        ORDER BY idCategoriaCompra DESC
            
            SELECT Id as idSustentoTributario, Codigo + ' - ' + Descripcion  as descripcion FROM Sri.SustentoTributario WITH (NOLOCK) WHERE [Enabled] = 1

            SELECT * FROM Contabilidad.Subcategory WITH (NOLOCK) WHERE CompanyId = @idEntidad AND [Enabled] = 1

            RETURN 
        END 

    --> Filters
    IF @tipo = 3
        BEGIN
                
            SET @tableNames = 'ptoEmision,estadoDocumento,subcategories'

            SELECT idEstablecimiento
                    ,nombreComercial
                    ,codEstab
                    ,idPuntoEmision
                    ,estab + '-' + ptoEmi as ptoEmi
                    ,defaultEstab
                    ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idEstadoPago,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('PFC','PA','NPA') AND estado = 1

            SELECT * FROM Contabilidad.subcategory  WITH (NOLOCK) WHERE companyId = @idEntidad AND Enabled = 1

            RETURN
        END 

    --> SerieComprobante
    IF @tipo = 4
        BEGIN
            
            SET @tableNames = 'serieComprobante'

            SELECT puntoEmision + '-' + [Helper].[F_Auto_Sequential](nroDocumento) as serieComprobante
            FROM OPENJSON(@json) WITH 
            (
                puntoEmision VARCHAR(50)
               ,nroDocumento INT
            )

            RETURN 
        END 

    --> Ver Documento
    IF @tipo = 5
        BEGIN
            
            SET @tableNames = 'infoFactura,proveedor,detalles,infoAdicional,tiempoCredito,impuestos'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT fc.idFacturaCompra
                  ,cc.descripcion as categoriaCompra
                  ,st.descripcion as sustentoTributario
                  ,es.nombreComercial
		          ,fc.nroDocumento
		          ,fc.nroAutorizacion
		          ,fc.fechaEmision
		          ,fc.subTotalSinImpuestos
		          ,fc.totalDescuento
		          ,fc.porcentajeDescuento
		          ,fc.propina
		          ,fc.recargo
		          ,fc.transporte
		          ,fc.total
		          ,fc.observacion
		          ,fc.puntoEmision
                  ,ISNULL(cpp.subcategoryId, 0) subcategoryId
                  ,ISNULL(cpp.subcategoryName, '') subcategoryName
	        FROM dbo.FacturaCompra            fc WITH (NOLOCK)
            LEFT JOIN dbo.CategoriaCompra    cc WITH (NOLOCK) ON cc.idCategoriaCompra    = fc.idCategoriaCompra 
            INNER JOIN Sri.SustentoTributario st WITH (NOLOCK) ON st.Id = fc.idSustentoTributario
            INNER JOIN Sri.Establecimiento    es WITH (NOLOCK) ON es.codEstab             = fc.codEstab
            LEFT JOIN v_CuentaPorPagar cpp ON fc.idFacturaCompra = cpp.idDocumento AND cpp.codDoc = '03'

	        WHERE fc.idFacturaCompra = @id
            
            SELECT fc.idProveedor
		          ,cu.BusinessName as nombreFiscal
		          ,cu.IDCard       as numeroIdentificacion
		          ,pr.correo
		          ,pr.direccion
	        FROM dbo.FacturaCompra       fc WITH (NOLOCK) 
	        INNER JOIN dbo.Proveedor     pr WITH (NOLOCK) ON pr.idProveedor = fc.idProveedor
            INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id          = pr.CustomerId
	        WHERE fc.idFacturaCompra = @id

            SELECT fcd.idFacturaCompraDetalle
		          ,ar.codigo
                  ,fcd.descripcion
		          ,fcd.cantidad
		          ,fcd.precioUnitario
		          ,fcd.porcentajeDescuento
		          ,fcd.valorDescuento
                  ,fcd.ice
		          ,fcd.precioTotalSinImpuesto
                  ,fcd.codigoPorcentaje
                  ,fcd.tarifa
                  ,fcd.valorImpuesto
                  ,fcd.nota
                  ,me.descripcion as medida
                  ,ti.descripcion as tipoIva
                  ,bo.descripcion as bodega
	        FROM FacturaCompraDetalle fcd WITH (NOLOCK) 
	        INNER JOIN dbo.Articulo    ar WITH (NOLOCK) ON ar.idArticulo = fcd.idArticulo
	        INNER JOIN dbo.Medida      me WITH (NOLOCK) ON me.idMedida   = fcd.idMedida
	        INNER JOIN dbo.TipoIva     ti WITH (NOLOCK) ON ti.idTipoIva  = fcd.idTipoIva
            INNER JOIN dbo.Bodega      bo WITH (NOLOCK) ON bo.idBodega   = fcd.idBodega
	        WHERE fcd.idFacturaCompra = @id AND fcd.estado = 1

            SELECT * FROM Compra.InfoAdicional WHERE uniqueId = (SELECT TOP 1 uniqueId FROM FacturaCompra WITH (NOLOCK) WHERE idFacturaCompra = @id)

            SELECT tiempoCredito,fechaVencimiento FROM v_CuentaPorPagar WITH (NOLOCK) WHERE idDocumento = @id AND codDoc = 'FC'

            SELECT idTipoIva
                  ,idImpuesto
	              ,descripcion
	              ,tarifa = porcentaje
	              ,codigoPorcentaje = CAST(codigoPorcentaje as varchar)
                  ,estado 
            FROM dbo.TipoIva WITH (NOLOCK) 
            WHERE estado = 1

            RETURN 
        END
END
GO
