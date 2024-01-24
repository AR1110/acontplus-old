USE [AcontPlus]
GO 

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
-- Author:		Alexis Ramirez
-- Create date: 03/16/2023
-- Description:	SP para listar las compras que no tiene documento validado por el sri.
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Documento_Ingreso_Get 
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	DECLARE @typeList INT ,@idEntidad INT 

    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

	DECLARE @idPuntoEmision INT ,@id INT ,@pageIndex INT ,@pageSize INT

    --> Filter
    DECLARE @codEstab VARCHAR(20) ,@idProveedor INT ,@codEstado VARCHAR(10) ,@dateStart DATETIME2 ,@dateEnd DATETIME2  ,@ckFecha BIT ,@secuencial VARCHAR(100)
	
	SELECT @typeList = typeList FROM OPENJSON(@json) WITH(typeList INT)

	SELECT TOP 1 @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

	--> Get 
	IF @typeList = 1
		BEGIN
            
            SET @tableNames = 'documentos'

			SET @sql  = 'SELECT idDocumento as id
		                       ,serieComprobante
		                       ,FORMAT(fechaEmision, ''dd/MM/yyyy HH:mm'')     as fechaEmision
		                       ,razonSocialProveedor
		                       ,importeTotal
		                       ,estado
		                       ,usuario
		                       ,IIF(codEstado = ''A'', ''table-danger'','''')  as colorRow 
                               ,codEstado
                               ,COUNT(*) OVER()                                as totalRecods
	                     FROM v_CuentaPorPagar 
	                     WHERE codDoc = ''DH''
                          AND idEntidad = @idEntidad '

			SET @params = '@idEntidad      INT
						  ,@codEstab       VARCHAR(100)
                          ,@idPuntoEmision INT
						  ,@dateStart      DATETIME2
						  ,@dateEnd        DATETIME2
						  ,@idProveedor    INT
						  ,@codEstado      VARCHAR(10)
						  ,@secuencial     VARCHAR(100)
                          ,@pageIndex      INT 
                          ,@pageSize       INT'

			SELECT @codEstab       = codEstab
                  ,@idPuntoEmision = idPuntoEmision
				  ,@idProveedor    = idProveedor
				  ,@dateStart      = dateStart
				  ,@dateEnd        = dateEnd
				  ,@codEstado      = codEstado
				  ,@secuencial     = LTRIM(TRIM(secuencial))
                  ,@ckFecha        = ckFecha
                  ,@pageIndex      = pageIndex
                  ,@pageSize       = pageSize
			FROM OPENJSON(@json) WITH 
            (
                 codEstab       VARCHAR(20) 
			    ,idProveedor    INT 
			    ,dateStart      DATETIME2 
			    ,dateEnd        DATETIME2 
			    ,codEstado	    VARCHAR(5)
                ,idPuntoEmision INT
			    ,secuencial     VARCHAR(100)
                ,ckFecha        BIT
                ,pageIndex      INT
                ,pageSize       INT

			) as dt
 
			 
            IF @ckFecha = 1
                BEGIN
                    SET @sql = @sql + 'AND CAST(fechaEmision as date) BETWEEN CAST(@dateStart as date) AND CAST(@dateEnd as date) '
                END 

            IF @codEstab IS NOT NULL
                BEGIN
                    SET @sql = @sql + 'AND codEstab = @codEstab '
                END 

            IF @idPuntoEmision > 0
                BEGIN
                    SET @sql = @sql + 'AND idPuntoEmision = @idPuntoEmision '
                END

			IF @secuencial IS NOT NULL
				BEGIN 
					SET @sql = @sql + 'AND secuencial BETWEEN ' + REPLACE(@secuencial,'-',' AND ')
				END 
			
			IF @idProveedor > 0 
				BEGIN
					SET @sql = @sql + 'AND idProveedor = @idProveedor  '
				END 

			IF @codEstado IS NOT NULL
				BEGIN
					SET @sql = @sql + 'AND codEstado = @codEstado '
				END 

			SET @sql = @sql + 'ORDER BY idDocumento DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

			EXEC sp_executesql @sql
			                  ,@params 
			                  ,@idEntidad      = @idEntidad
				              ,@codEstab       = @codEstab
                              ,@idPuntoEmision = @idPuntoEmision
				              ,@dateStart      = @dateStart
				              ,@dateEnd        = @dateEnd
				              ,@idProveedor    = @idProveedor
				              ,@codEstado      = @codEstado
				              ,@secuencial     = @secuencial
                              ,@pageIndex      = @pageIndex
                              ,@pageSize       = @pageSize
            RETURN 
		END 

    --> DataForm
	IF @typeList = 2
		BEGIN
            SET @tableNames = 'configDecimales,impuestos,tiempoCredito,ptoEmi,estab'

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
                  ,idPuntoEmision
                  ,ptoEmi + '-' + estab as ptoEmi
                  ,defaultEstab
                  ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idEstablecimiento
                  ,nombreComercial
                  ,codEstab
                  ,idBodega
                  ,bodega
                  ,defaultEstab
                  ,defaultBodega 
            FROM v_Bodega_Asign WITH(NOLOCK) 
            WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            RETURN 
		END 

	--> SerieComprobante
	IF @typeList = 3
		BEGIN
            
            SET @tableNames = 'serieComprobante'

			SELECT @idPuntoEmision = idPuntoEmision FROM OPENJSON(@json) WITH (idPuntoEmision INT)

			SELECT @secuencial = COUNT(*) + 1 FROM Compra.Documento_Ingreso WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision

			SELECT es.estab+'-'+pe.ptoEmi+'-'+Helper.F_Auto_Sequential(@secuencial) as serieComprobante
			FROM dbo.PuntoEmision pe WITH (NOLOCK)
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab = pe.codEstab
			WHERE pe.idPuntoEmision = @idPuntoEmision
		END 
	
	--> Get Id
	IF @typeList = 4
		BEGIN
            
            SET @tableNames = 'comprobante,proveedor,detalles,infoAdicional,cuentaPorPagar,cuotas'

			SELECT @id = id FROM OPENJSON(@json) WITH (id INT )

			SELECT di.idDocumentoIngreso
				  ,es.idEstablecimiento
				  ,pe.idPuntoEmision
				  ,pe.codEstab
				  ,ptoEmi = es.estab+'-'+pe.ptoEmi
				  ,es.nombreComercial
				  ,Helper.F_Auto_Sequential(di.secuencial) as secuencial
				  ,di.fechaEmision
				  ,di.totalSinImpuestos                    as subTotalSinImpuestos
				  ,di.descuento 
				  ,total = di.importeTotal
                  ,di.observacion
			FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
			INNER JOIN dbo.PuntoEmision    pe WITH (NOLOCK) ON pe.idPuntoEmision = di.idPuntoEmision
			INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pe.codEstab
			WHERE di.idDocumentoIngreso = @id

			SELECT di.idProveedor
				  ,nombreComercial = ISNULL(pr.nombreComercial,'')
				  ,nombreFiscal = ISNULL(pr.nombreFiscal,'')
				  ,direccion = ISNULL(pr.direccion,'')
				  ,pr.numeroIdentificacion
			FROM Compra.Documento_Ingreso di WITH (NOLOCK)
			INNER JOIN dbo.Proveedor      pr WITH (NOLOCK) ON pr.idProveedor = di.idProveedor
			WHERE di.idDocumentoIngreso = @id

			SELECT idDetalle = dt.idDocumentoIngresoDetail 
				  ,dt.idDocumentoIngresoDetail
				  ,dt.idArticulo
				  ,dt.idMedida
				  ,dt.idBodega
                  ,dt.idTipoIva
				  ,ti.idImpuesto
                  ,ar.codigo 
                  ,dt.descripcion
				  ,dt.cantidad
				  ,dt.precioUnitario
				  ,dt.descuento
				  ,dt.precioTotalSinImpuesto
				  ,dt.codigoPorcentaje
				  ,dt.tarifa
                  ,dt.valorImpuesto
				  ,ar.datosAdicionales
                  ,ar.llevaInventario
                  ,dt.estado
                  ,ISNULL
                   ((
                        SELECT me.idMedida
                              ,me.descripcion as medida
                              ,af.precioCostoFraccionado as precioCostoFraccionado
                              ,af.conversion
                        FROM ArticuloFraccionado af WITH (NOLOCK) 
                        INNER JOIN Medida        me WITH (NOLOCK) ON me.idMedida = af.idMedida 
                        WHERE af.idArticulo = dt.idArticulo FOR JSON PATH

                    ),'[]') as fraccionado 
                  ,(
                        SELECT me.idMedida 
                              ,me.descripcion as medida
                              ,a.precioCosto 
                              ,1 as conversion
                        FROM Articulo      a WITH (NOLOCK) 
                        INNER JOIN Medida me WITH (NOLOCK) ON me.idMedida = a.idMedida 
                        WHERE a.idArticulo = dt.idArticulo FOR JSON PATH

                   ) as principal
                   ,ISNULL
                   ((
                        SELECT et.idEtiqueta ,et.descripcion, et.etiquetas
                        FROM Inventario.Etiqueta et WITH (NOLOCK)
                        INNER JOIN dbo.Articulo  ar WITH (NOLOCK) ON ar.idEtiqueta = et.idEtiqueta
                        WHERE ar.idArticulo = dt.idArticulo FOR JSON PATH

                   ),'[]') as etiqueta
			FROM Compra.Documento_Ingreso_Detail dt WITH (NOLOCK)
			INNER JOIN dbo.TipoIva               ti WITH (NOLOCK) ON ti.idTipoIva  = dt.idTipoIva
			INNER JOIN dbo.Articulo              ar WITH (NOLOCK) ON ar.idArticulo = dt.idArticulo
			WHERE dt.idDocumentoIngreso = @id
            ORDER BY dt.idDocumentoIngresoDetail ASC

			SELECT * FROM Compra.InfoAdicional  WHERE uniqueId = (SELECT uniqueId FROM Compra.Documento_Ingreso WHERE idDocumentoIngreso = @id)

            SELECT cp.idTiempoCredito
                  ,cp.fechaVencimiento
                  ,tc.diasCredito
                  ,tc.numeroCuota
                  ,tc.entrada
            FROM Contabilidad.CuentaPorPagar cp WITH (NOLOCK)
            INNER JOIN dbo.TiempoCredito     tc WITH (NOLOCK) ON tc.idTiempoCredito = cp.idTiempoCredito 
            WHERE idDocumento = @id 
              AND codDoc = 'DH'

            SELECT cc.idCuotaPorPagar
                  ,cc.nroCuota
                  ,cc.fechaVencimiento
                  ,cc.cuota
                  ,cc.entrada 
            FROM Contabilidad.CuotaPorPagar cc WITH (NOLOCK)
            INNER JOIN Contabilidad.CuentaPorPagar cp WITH (NOLOCK) ON cp.idCuentaPorPagar = cc.idCuentaPorPagar 
            WHERE cp.idDocumento = @id 
              AND cp.codDoc = 'DH' 
              AND cc.estado = 1

            RETURN 
		END 

    -->Filter 
    IF @typeList = 5
        BEGIN
            
            SET @tableNames = 'ptoEmision,estadoDocumento'

            SELECT idEstablecimiento
                    ,nombreComercial
                    ,codEstab
                    ,idPuntoEmision
                    ,estab + '-' + ptoEmi as ptoEmi
                    ,defaultEstab
                    ,defaultPtoEmi 
            FROM v_PtoEmi_Asign WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId ORDER BY defaultEstab DESC

            SELECT idEstadoPago,descripcion,codigo FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo IN ('PFC','PA','NPA','A')

            RETURN
        END 

    --> Ver Documento
    IF @typeList = 6 
        BEGIN
            
            SET @tableNames = 'comprobante,proveedor,detalles,impuestos'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT di.idDocumentoIngreso
                  ,es.nombreComercial
                  ,di.fechaEmision
                  ,di.totalSinImpuestos
		          ,es.estab
		          ,pt.ptoEmi
		          ,di.secuencial
		          ,di.descuento
		          ,di.porcentajeDescuento
		          ,di.importeTotal
		          ,ISNULL(di.observacion,'') as observacion
            FROM Compra.Documento_Ingreso  di WITH (NOLOCK)
            INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision = di.idPuntoEmision
            INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.codEstab       = pt.codEstab
            WHERE di.idDocumentoIngreso = @id

            SELECT di.idProveedor
				  ,nombreComercial = ISNULL(pr.nombreComercial,'')
				  ,nombreFiscal = ISNULL(pr.nombreFiscal,'')
				  ,direccion = ISNULL(pr.direccion,'')
				  ,pr.numeroIdentificacion
			FROM Compra.Documento_Ingreso di WITH (NOLOCK)
			INNER JOIN dbo.Proveedor      pr WITH (NOLOCK) ON pr.idProveedor = di.idProveedor
			WHERE di.idDocumentoIngreso = @id

            SELECT dd.idDocumentoIngresoDetail
                  ,ar.codigo
		          ,dd.descripcion
		          ,dd.cantidad
		          ,dd.precioUnitario
		          ,dd.descuento
                  ,dd.precioTotalSinImpuesto
                  ,dd.codigoPorcentaje
		          ,dd.tarifa
                  ,dd.valorImpuesto
                  ,bo.descripcion as bodega
                  ,ti.descripcion as tipoIva
                  ,me.descripcion as medida 
            FROM Compra.Documento_Ingreso_Detail dd WITH (NOLOCK)
            INNER JOIN dbo.Articulo              ar WITH (NOLOCK) ON ar.idArticulo = dd.idArticulo
            INNER JOIN dbo.TipoIva               ti WITH (NOLOCK) ON ti.idTipoIva  = dd.idTipoIva
            INNER JOIN dbo.Medida                me WITH (NOLOCK) ON me.idMedida   = dd.idMedida
            INNER JOIN dbo.Bodega                bo WITH (NOLOCK) ON bo.idBodega   = dd.idBodega
            WHERE dd.idDocumentoIngreso = @id
            ORDER BY dd.idDocumentoIngresoDetail ASC

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
