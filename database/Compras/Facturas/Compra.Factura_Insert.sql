USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Factura_Insert]    Script Date: 12/8/2022 11:25:53 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Compra.Factura_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT,@idFacturaCompra INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    --> Data Json
    DECLARE @infoFactura VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@artInfoAdicionales VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

    --> Datos Factura
	DECLARE @nroDocumento INT ,@idProveedor INT ,@puntoEmision VARCHAR(10) ,@nroAutorizacion VARCHAR(50) ,@fechaEmision DATETIME ,@codEstab VARCHAR(50)
           ,@secuencial INT 
	
	--> Contabilidad
    DECLARE @importeTotal NUMERIC(18,5) ,@idEstablecimiento INT ,@idEstadoPago INT ,@uniqueId VARCHAR(20) ,@year VARCHAR(50)
           ,@idCuentaPorPagar INT 

    --> Customer
    DECLARE @CustomerId INT ,@serieComprobante VARCHAR(30)

    DECLARE @tbComprobante AS TABLE (
		idProveedor INT NOT NULL
	   ,idTiempoCredito INT NOT NULL
       ,idSustentoTributario INT NOT NULL
       ,subcategoryId INT NOT NULL
       ,codEstab VARCHAR(100) NOT NULL
       ,nroDocumento INT NOT NULL
       ,puntoEmision VARCHAR(50) NOT NULL
       ,nroAutorizacion VARCHAR(49) NOT NULL
	   ,codDoc VARCHAR(20) NOT NULL DEFAULT 'FC'
       ,fechaEmision DATETIME2 NOT NULL
	   ,fechaVencimiento DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	)
	
	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idArticulo INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
		,nota VARCHAR(100) NULL
		,descripcion VARCHAR(255) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCosto NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
	)

    DECLARE @tbTaxes AS TABLE (
        TaxId INT NOT NULL 
	   ,TaxPercentId INT NOT NULL 
	   ,[Percent] NUMERIC(18,5) NOT NULL
	   ,TaxBase NUMERIC(18,5) NOT NULL
	   ,TaxValue NUMERIC(18,5) NOT NULL
       ,Discount NUMERIC(18,5) NOT NULL
    )

	DECLARE @artInfoAdicional AS TABLE (
		 idArticulo INT NOT NULL		
		,idEtiqueta INT NOT NULL
		,jsonAdicional NVARCHAR(MAX) NULL
		
	)

    DECLARE @tbCuotas AS TABLE(
		nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)

	BEGIN TRY 
		
        --> Global 
        SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @infoFactura        = infoFactura
              ,@detalles           = detalles
              ,@impuestos          = impuestos
              ,@artInfoAdicionales = artInfoAdicionales
              ,@cuotas             = cuotas
        FROM OPENJSON(@json) WITH 
        (
             infoFactura        NVARCHAR(MAX) as json
            ,detalles           NVARCHAR(MAX) as json 
            ,impuestos          NVARCHAR(MAX) as json
            ,artInfoAdicionales NVARCHAR(MAX) as json
            ,cuotas             NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idSustentoTributario,idProveedor,idTiempoCredito,codEstab,nroDocumento,puntoEmision,nroAutorizacion,fechaEmision,
              fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion, subcategoryId)
		SELECT idSustentoTributario,idProveedor,idTiempoCredito,codEstab,nroDocumento,puntoEmision,nroAutorizacion,fechaEmision,
        fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion, subcategoryId
		FROM OPENJSON(@infoFactura) WITH
        (
			 idProveedor          INT
			,idTiempoCredito      INT
            ,idSustentoTributario INT
            ,codEstab             VARCHAR(100)
            ,nroDocumento         INT
            ,puntoEmision         VARCHAR(50)
            ,nroAutorizacion      VARCHAR(49)
			,fechaEmision         DATETIME2
			,fechaVencimiento     DATETIME2
			,subTotalSinImpuestos NUMERIC(18,5)
			,porcentajeDescuento  NUMERIC(18,5)
			,totalDescuento       NUMERIC(18,5)
			,propina              NUMERIC(18,5)
			,recargo			  NUMERIC(18,5)
			,transporte           NUMERIC(18,5)
			,total                NUMERIC(18,5)
			,observacion          VARCHAR(500)
            ,subcategoryId        INT

		) AS js

		INSERT INTO @tblDetails
              (orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado)
		SELECT orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado
		FROM OPENJSON (@detalles) WITH 
        (
		     orderIndex             INT
		    ,idArticulo             INT
		    ,idBodega               INT
		    ,idMedida               INT
            ,idTipoIva              INT
		    ,ice                    NUMERIC(10,5)
		    ,cantidad               NUMERIC(15,5)
		    ,precioUnitario         NUMERIC(15,5)
		    ,valorDescuento         NUMERIC(15,5)
		    ,precioTotalSinImpuesto NUMERIC(15,5)
		    ,porcentajeDescuento    NUMERIC(15,5)
            ,codigoPorcentaje       VARCHAR(5) 
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5)
		    ,nota                   VARCHAR(100)
		    ,descripcion            VARCHAR(255)
            ,llevaInventario        BIT
            ,cantidadTransaccion    NUMERIC(15,5)
            ,precioCosto            NUMERIC(15,5)
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
		)

        INSERT INTO @tbTaxes
              (TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
        SELECT TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount
        FROM OPENJSON(@impuestos) WITH 
        (
            taxId        INT 
	       ,taxPercentId INT
	       ,[percent]    NUMERIC(18,5)
	       ,taxBase      NUMERIC(18,5) 
	       ,taxValue     NUMERIC(18,5) 
           ,discount     NUMERIC(18,5)
        )

        INSERT INTO @artInfoAdicional  
              (idArticulo,idEtiqueta,jsonAdicional)
		SELECT idArticulo,idEtiqueta,jsonAdicional
		FROM OPENJSON(@artInfoAdicionales) WITH 
        (
		   idArticulo    INT
		  ,idEtiqueta    INT
		  ,jsonAdicional NVARCHAR(max) AS JSON		
		) 

        INSERT INTO @tbCuotas
              (nroCuota,fechaVencimiento,cuota,entrada)
        SELECT nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            nroCuota         INT
	       ,fechaVencimiento DATE 
	       ,cuota            NUMERIC(18,5) 
	       ,entrada          BIT 
        )

        --> Recuperando Datos
		SELECT @nroDocumento     = nroDocumento
			  ,@idProveedor      = idProveedor
			  ,@puntoEmision     = puntoEmision
			  ,@importeTotal     = total
			  ,@codEstab         = codEstab
			  ,@nroAutorizacion  = nroAutorizacion
			  ,@fechaEmision     = fechaEmision
              ,@serieComprobante = puntoEmision + '-' + [Helper].[F_Auto_Sequential](nroDocumento)
		FROM @tbComprobante

		SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FC'

		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM dbo.EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor
		
		SELECT TOP 1 @idEstablecimiento = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

	    SELECT @year =  DATEPART(YEAR,dbo.ufnGetDateEcuador())

		SELECT @secuencial =  COUNT(*)+1 FROM dbo.FacturaCompra WITH (NOLOCK) WHERE DATEPART(YEAR,fechaRegistro) = @year

		SELECT @uniqueId = 'F'+CAST(DATEPART(YEAR,@year) AS VARCHAR)+Helper.F_Auto_Sequential(@secuencial)


        --> Validacion de la informacion 
        IF (SELECT COUNT(*) FROM @tbComprobante) = 0 
            BEGIN
                SELECT '0'code,'Error en la info Factura'[message]
                RETURN
            END 

        IF (SELECT COUNT(*) FROM @tblDetails) = 0 
            BEGIN
                SELECT '0'code,'Error en los detalles'[message]
                RETURN
            END
           
        IF (SELECT COUNT(*) FROM @tbTaxes) = 0 
            BEGIN
                SELECT '0'code,'Error en los impuestos'[message]
                RETURN
            END

        IF (SELECT COUNT(*) FROM @tbCuotas) = 0 
            BEGIN
                SELECT '0'code,'Error en las cuotas'[message]
                RETURN
            END

		IF @uniqueId IS NULL
			BEGIN
				SELECT '0'code,'Error al generar el id unico del documento'[message]
				RETURN
			END 

		IF EXISTS (SELECT 1 FROM dbo.FacturaCompra WITH (NOLOCK) WHERE uniqueId = @uniqueId)
			BEGIN
				SELECT '0'code,'Este id ya se encuentra registrado'[message]
				RETURN
			END

		IF @fechaEmision IS NULL
			BEGIN
				SELECT '0'code,'por favor registre la fecha de emision'[message]
				RETURN 
			END

		IF EXISTS(SELECT 1 FROM FacturaCompra WHERE nroAutorizacion = @nroAutorizacion  AND idProveedor = @idProveedor AND puntoEmision= @puntoEmision AND nroDocumento = @nroDocumento AND estado = 1)
			BEGIN
				SELECT '0'code,'Este comprobante ya se encuentra registrado'[message]
				RETURN 
			END 

		IF LEN(@nroAutorizacion) > 10 
			BEGIN
				SELECT '0'code,'Los documentos fisicos deben tienen un nro.Autorizacion de 10 digitos'[message]
				RETURN 
			END 

		BEGIN TRAN 

		    --> InfoFactura
			INSERT INTO FacturaCompra 
				   (uniqueId, idTipoDocumento,idSustentoTributario,idProveedor,codEstab,nroDocumento,puntoEmision,nroAutorizacion,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,fechaRegistro,idUsuario,idEntidad)
			SELECT @uniqueId,@idTipoDocumento,idSustentoTributario,idProveedor,codEstab,nroDocumento,puntoEmision,nroAutorizacion,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,dbo.ufnGetDateEcuador(),@idUsuario,@idEntidad
			FROM @tbComprobante
			
			SET @idFacturaCompra = @@IDENTITY

            --> Detalles
			INSERT INTO FacturaCompraDetalle
			       (idFacturaCompra,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,ice,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto)
			SELECT @idFacturaCompra,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,ice,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto
			FROM @tblDetails 
            ORDER BY orderIndex ASC

            --> Impuestos
            INSERT INTO Compra.FacturaImpuesto
                   (FacturaCompraId,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount)
            SELECT @idFacturaCompra,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount FROM @tbTaxes

			---Datos Adicionales de articulo (etiquetas)
			IF EXISTS (SELECT 1 FROM @artInfoAdicional WHERE JSON_QUERY(jsonAdicional, '$') IS NOT NULL)
				BEGIN
					INSERT INTO Compra.InfoAdicional(uniqueId, idArticulo, idEtiqueta, jsonAdicional, fechaRegistro)
					SELECT @uniqueId, idArticulo, idEtiqueta, jsonAdicional, dbo.ufnGetDateEcuador() FROM @artInfoAdicional
				END
            
            --> Forma de Pago
			INSERT INTO Compra.FormaPago(idDocumento, codDoc, formaPago, total) 
			SELECT idFacturaCompra, '01', '20', total FROM FacturaCompra fc WHERE idFacturaCompra = @idFacturaCompra
            
            --> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
				        BEGIN
                            DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                            SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FF'

                            SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

                            --> Transaccion
                            INSERT INTO Inventario.Transaccion
                                   (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                            SELECT @idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idFacturaCompra,@CustomerId,@idUsuario,@idEntidad,@serieComprobante 
                            FROM @tbComprobante 

                            SET @idTransaccion = SCOPE_IDENTITY()

                            --> Detalles
                            INSERT INTO Inventario.TransaccionDetalle 
                                   (idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			                SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,precioTotalSinImpuesto 
                            FROM @tblDetails 
                            WHERE llevaInventario = 1

                            EXEC dbo.Transaccion_Handler_Init @idTransaccion

                            IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE codMetodoValoracion = 'UEPS' AND idEntidad = @idEntidad)
                                BEGIN
                                    UPDATE ar SET
                                           ar.fechaUltimoCosto = CASE WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.fechaUltimoCosto
                                                                                                                ELSE @fechaEmision
                                                                    END
                                          ,ar.precioCosto     =  CASE WHEN ar.fechaUltimoCosto >= @fechaEmision THEN ar.precioCosto
                                                                                                                ELSE IIF((SELECT TOP 1 MAX(td.precioUnitario) FROM @tblDetails td WHERE td.llevaInventario = 1 and td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida) >= (ar.precioCosto / 2)
                                                                                                                        ,(SELECT TOP 1 MAX(td.precioUnitario) FROM @tblDetails td WHERE td.llevaInventario = 1 and td.idArticulo = ar.idArticulo AND td.idMedida = ar.idMedida)
                                                                                                                        ,ar.precioCosto) 
                                                                                                                 
                                                                    END
                                    FROM dbo.Articulo ar WITH (ROWLOCK)
                                    WHERE ar.idArticulo IN (SELECT idArticulo FROM @tblDetails td WHERE td.llevaInventario = 1)  

                                    UPDATE pv SET
                                           pv.porcentajeUtilidad = ((pv.precioVenta / ar.precioCosto) * 100) - 100
                                    FROM dbo.ArticuloPvP    pv WITH (ROWLOCK)
                                    INNER JOIN dbo.Articulo ar WITH (ROWLOCK) ON ar.idArticulo = pv.idArticulo
                                    WHERE ar.idArticulo IN (SELECT idArticulo FROM @tblDetails td WHERE td.llevaInventario = 1)

                                END 
                        END
				END
            

			--> CONTABILIDAD 
			INSERT INTO Contabilidad.CuentaPorPagar
			       (idEstablecimiento,idProveedor,idTiempoCredito,codDoc,fechaEmision,fechaVencimiento, idEstadoPago, uniqueId, serieComprobante,importeTotal, idEntidad, idUsuario,idDocumento,subcategoryId)
		    SELECT @idEstablecimiento,idProveedor,idTiempoCredito,codDoc,fechaEmision,fechaVencimiento,@idEstadoPago,@uniqueId,@serieComprobante,@importeTotal,@idEntidad,@idUsuario,@idFacturaCompra,subcategoryId
            FROM @tbComprobante

            SELECT @idCuentaPorPagar = SCOPE_IDENTITY()

            INSERT INTO Contabilidad.CuotaPorPagar WITH (ROWLOCK)
                   (idCuentaPorPagar, idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada)
			SELECT @idCuentaPorPagar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada 
            FROM @tbCuotas 
            ORDER BY nroCuota ASC

            --> Payload 
			SET @payload = (SELECT idTipoDocumento = @idTipoDocumento ,idFacturaCompra = @idFacturaCompra FOR JSON PATH)

		COMMIT TRAN 
		SELECT '1'code,'Registrado Correctamente'[message],@payload as payload
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/FacturaCompra/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	    
        SELECT  '0'code,'Info: Error en el procedimiento'[message]
    END CATCH 
END
