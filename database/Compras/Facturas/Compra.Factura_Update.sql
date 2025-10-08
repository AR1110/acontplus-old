USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Factura_Update]    Script Date: 12/9/2022 10:29:03 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez 
-- Create date: 2021-12-02-- Description: Sp para actualizar las facturas de compra

-- =============================================
CREATE OR ALTER PROCEDURE Compra.Factura_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 
	
    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    --> Data Json
    DECLARE @infoFactura VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@artInfoAdicionales VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

	--> Datos Factura
	DECLARE @nroDocumento INT ,@idProveedor INT ,@puntoEmision VARCHAR(10) ,@nroAutorizacion VARCHAR(50) ,@fechaEmision DATETIME2 ,@codEstab VARCHAR(50)
           ,@secuencial INT ,@uniqueId VARCHAR(100) ,@importeTotal AS NUMERIC(18,5),
           @subcategoryId INT

	--> DATOS DE VALIDACION
	DECLARE @retencion BIT
	
	--> DATOS CONTABILIDAD
	DECLARE @fechaVencimiento DATETIME2

    --> Customer
    DECLARE @CustomerId INT ,@serieComprobante VARCHAR(30)

    DECLARE @tbComprobante AS TABLE (
	    idFacturaCompra INT NOT NULL UNIQUE
       ,idProveedor INT NOT NULL
	   ,idTiempoCredito INT NOT NULL
       ,idSustentoTributario INT NOT NULL
       ,codEstab VARCHAR(100) NOT NULL
       ,nroDocumento INT NOT NULL
       ,puntoEmision VARCHAR(50) NOT NULL
       ,nroAutorizacion VARCHAR(49) NOT NULL
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
       ,subcategoryId INT
	)

	DECLARE @tblDetails AS TABLE (
		 idFacturaCompraDetalle INT NOT NULL
        ,orderIndex INT NOT NULL
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
        ,estado BIT NOT NULL
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
		idInfoAdicional INT NOT NULL
		,idArticulo INT  NOT NULL		
		,idEtiqueta INT  NOT NULL
		,jsonAdicional NVARCHAR(MAX)  NULL
		
	)

    DECLARE @tbCuotas AS TABLE(
	    idCuotaPorPagar INT UNIQUE NOT NULL
       ,nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)

	BEGIN TRY 
        SELECT '0'code,'Fuera de Funcionamiento'[message]
        RETURN

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
		      (idFacturaCompra,idSustentoTributario,idProveedor,idTiempoCredito,codEstab,nroDocumento,puntoEmision,nroAutorizacion,
              fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion, subcategoryId)
		SELECT @id,idSustentoTributario,idProveedor,idTiempoCredito,codEstab,nroDocumento,puntoEmision,nroAutorizacion,
        fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion, subcategoryId
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
            ,subcategoryId          INT
		) AS js

		INSERT INTO @tblDetails
              (idFacturaCompraDetalle,orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado,estado)
		SELECT idFacturaCompraDetalle,orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado,estado 
		FROM OPENJSON (@detalles) WITH 
        (
		     idFacturaCompraDetalle INT
            ,orderIndex             INT
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
		    ,precioTotalSinImpuesto NUMERIC(15,5)
		    ,nota                   VARCHAR(100)
		    ,descripcion            VARCHAR(255)
            ,llevaInventario        BIT 
            ,cantidadTransaccion    NUMERIC(15,5)
            ,precioCosto            NUMERIC(15,5)
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
            ,estado                 BIT
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
              (idCuotaPorPagar,nroCuota,fechaVencimiento,cuota,entrada)
        SELECT idCuotaPorPagar,nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            idCuotaPorPagar  INT
           ,nroCuota         INT
	       ,fechaVencimiento DATE 
	       ,cuota            NUMERIC(18,5) 
	       ,entrada          BIT 
        )

        --> Recuperando Datos
		SELECT TOP 1 @idTipoDocumento = idTipoDocumento FROM dbo.TipoDocumento WHERE codigo = 'FC'

		SELECT TOP 1 @uniqueId = fc.uniqueId FROM FacturaCompra fc WITH (NOLOCK) WHERE fc.idFacturaCompra = @id

		SELECT @nroDocumento     = nroDocumento
			  ,@idProveedor      = idProveedor
			  ,@puntoEmision     = puntoEmision
			  ,@importeTotal     = total
			  ,@codEstab         = codEstab
			  ,@nroAutorizacion  = nroAutorizacion
			  ,@fechaEmision     = fechaEmision
              ,@fechaVencimiento = fechaVencimiento
              ,@serieComprobante = puntoEmision + '-' + [Helper].[F_Auto_Sequential](nroDocumento)
              ,@subcategoryId    = subcategoryId
		FROM @tbComprobante

		SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor

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

		IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = 'FC' AND codEstado != 'PE' AND idDocumento = @id)
            BEGIN
                SELECT '0'code,'El Documento tiene movimientos financieros o esta Anulado'[message]
                RETURN 
            END

        IF EXISTS (SELECT 1 FROM FacturaCompra WITH (NOLOCK) WHERE idFacturaCompra = @id AND retencion = 1)
            BEGIN
                SELECT '0'code,'El Documento tiene aplicada una retencion'[message]
                RETURN 
            END

		IF EXISTS(SELECT 1 FROM FacturaCompra WHERE nroDocumento = @nroDocumento AND idProveedor = @idProveedor AND puntoEmision = @puntoEmision AND estado = 1 AND idFacturaCompra !=  @id)
			BEGIN
				SELECT '0'code,'Este comprobante ya se encuentra registrado'[message]
				RETURN  
			END

		BEGIN TRAN 
			--> InfoFactura
			UPDATE f SET 
				   f.puntoEmision         = jf.puntoEmision
				  ,f.nroDocumento         = jf.nroDocumento
                  ,f.nroAutorizacion      = jf.nroAutorizacion
                  ,f.idProveedor          = jf.idProveedor
                  ,f.fechaEmision         = jf.fechaEmision
                  ,f.idSustentoTributario = jf.idSustentoTributario
                  ,f.subTotalSinImpuestos = jf.subTotalSinImpuestos
                  ,f.totalDescuento       = jf.totalDescuento
                  ,f.porcentajeDescuento  = jf.porcentajeDescuento
                  ,f.propina              = jf.propina
                  ,f.recargo              = jf.recargo
                  ,f.transporte           = jf.transporte
                  ,f.total                = jf.total
                  ,f.observacion          = jf.observacion
                  ,f.lastChange           = dbo.ufnGetDateEcuador()
			FROM FacturaCompra f WITH (ROWLOCK)
			INNER JOIN @tbComprobante as jf ON f.idFacturaCompra = jf.idFacturaCompra

            --> Detalles
			UPDATE fcd SET
				   fcd.idBodega               = js.idBodega
				  ,fcd.idMedida               = js.idMedida
				  ,fcd.idTipoIva              = js.idTipoIva
				  ,fcd.descripcion            = js.descripcion
				  ,fcd.cantidad               = js.cantidad
				  ,fcd.precioUnitario         = js.precioUnitario
				  ,fcd.porcentajeDescuento    = js.porcentajeDescuento
				  ,fcd.valorDescuento         = js.valorDescuento
				  ,fcd.nota                   = js.nota
				  ,fcd.precioTotalSinImpuesto = js.precioTotalSinImpuesto
				  ,fcd.estado                 = js.estado
                  ,fcd.codigoPorcentaje       = js.codigoPorcentaje
				  ,fcd.tarifa                 = js.tarifa
				  ,fcd.valorImpuesto          = js.valorImpuesto
				  ,fcd.ice                    = js.ice
			FROM FacturaCompraDetalle fcd WITH (ROWLOCK)
			INNER JOIN @tblDetails js ON fcd.idFacturaCompraDetalle = js.idFacturaCompraDetalle

		    --> FORMA DE PAGO
			UPDATE Compra.FormaPago SET total = @importeTotal WHERE idDocumento = @id AND codDoc = '01'
			
            --> Contabilidad
			UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
               SET idProveedor      = @idProveedor
				  ,fechaEmision     = @fechaEmision
                  ,fechaVencimiento = @fechaVencimiento
				  ,importeTotal     = @importeTotal
				  ,serieComprobante = @serieComprobante
                  ,subcategoryId    = @subcategoryId
			WHERE idDocumento = @id
              AND codDoc = 'FC'

            UPDATE cp SET 
                   cp.fechaVencimiento = tc.fechaVencimiento
                  ,cp.cuota            = tc.cuota
            FROM Contabilidad.CuotaPorPagar cp WITH (ROWLOCK)
            INNER JOIN @tbCuotas            tc ON tc.idCuotaPorPagar = cp.idCuotaPorPagar

			--> Detalles

            DELETE FROM dbo.FacturaCompraDetalle WHERE idFacturaCompra = @id AND estado = 0

			INSERT INTO FacturaCompraDetalle
			       (idFacturaCompra,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,ice,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto)
			SELECT @id             ,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,ice,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto
			FROM @tblDetails 
            WHERE idFacturaCompraDetalle = 0 
            ORDER BY orderIndex ASC

            --> Impuestos

            DELETE FROM Compra.FacturaImpuesto WHERE FacturaCompraId = @id

            INSERT INTO Compra.FacturaImpuesto
                   (FacturaCompraId,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount)
            SELECT @id             ,TaxId,TaxPercentId,TaxBase,[Percent],TaxValue,Discount FROM @tbTaxes

			--> InfoAdicional
			UPDATE Compra.InfoAdicional SET estado = 0 WHERE uniqueId = @uniqueId

			UPDATE  infoAdd SET infoAdd.idEtiqueta =  temp.idEtiqueta, infoAdd.jsonAdicional = temp.jsonAdicional, infoAdd.estado = 1 
			FROM  Compra.InfoAdicional infoAdd WITH(NOLOCK) 
			INNER JOIN @artInfoAdicional temp ON temp.idInfoAdicional = infoAdd.idInfoAdicional

			INSERT INTO  Compra.InfoAdicional (uniqueId, idArticulo, idEtiqueta, jsonAdicional)
			SELECT @uniqueId, idArticulo, idEtiqueta, jsonAdicional FROM @artInfoAdicional WHERE idInfoAdicional = 0;

			DELETE FROM Compra.InfoAdicional WHERE estado = 0  AND uniqueId = @uniqueId

			--> Inventario
			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN
                    
                    DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                    SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FF'

                    SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

                    SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = @idTipoDocumentoIv AND idDocumento = @id

                    --> Transaccion
                    UPDATE Inventario.Transaccion WITH (ROWLOCK)
                       SET fechaEmision     = @fechaEmision
                          ,CustomerId       = @customerId
                          ,serieComprobante = @serieComprobante
                    WHERE idTransaccion = @idTransaccion

                    UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

                    IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
				        BEGIN
                             INSERT INTO Inventario.TransaccionDetalle
                                    (idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total)
			                 SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,precioTotalSinImpuesto 
                             FROM @tblDetails 
                             WHERE llevaInventario = 1
                               AND estado = 1 

                             EXEC dbo.Transaccion_Handler_Init 'E', 'FF', @id, DEFAULT
                        END
				END

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Exitosamente'[message]
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
			BEGIN
				ROLLBACK TRAN; 
			END

		INSERT INTO ErroresSistema
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/FacturaCompra/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento de actualizar ' [message]
	END CATCH 



END
