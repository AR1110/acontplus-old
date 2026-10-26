USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Compra].[Liquidacion_Update]    Script Date: 12/9/2022 10:55:20 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-12-06
-- Description:	SP para actualizar las liqidacioenes de compra
-- =============================================
CREATE OR ALTER PROCEDURE Compra.Liquidacion_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

     --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@idTipoDocumento INT

    -- Data Json
    DECLARE @infoLiquidacion VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

     --> Liquidacion
    DECLARE @idProveedor INT ,@importeTotal NUMERIC(18,5)

    --> Facturacion Electronica 
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5)
	       ,@claveAcceso VARCHAR(50) ,@secuencial INT
           ,@idEstadoServicio INT ,@idDocumentoElectronico INT

    --> DATOS CONTABILIDAD
	DECLARE @fechaVencimiento DATETIME2
           ,@subcategoryId INT

    --> Customer
    DECLARE @CustomerId INT

    DECLARE @tbComprobante AS TABLE (
	    idLiquidacionCompra INT UNIQUE NOT NULL
       ,idProveedor INT NOT NULL
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
		 orderIndex INT NOT NULL
		,idLiquidacionCompraDetalle INT NOT NULL
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

    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

    DECLARE @tbCuotas AS TABLE(
	    idCuotaPorPagar INT UNIQUE NOT NULL
       ,nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)

	BEGIN TRY 
        --> Global
		SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        --> Data Json 
        SELECT @infoLiquidacion = infoLiquidacion
              ,@detalles        = detalles
              ,@impuestos       = impuestos
              ,@infoAdicional   = infoAdicional
              ,@cuotas          = cuotas
        FROM OPENJSON(@json) WITH 
        (
             infoLiquidacion NVARCHAR(MAX) as json
            ,detalles        NVARCHAR(MAX) as json 
            ,impuestos       NVARCHAR(MAX) as json
            ,infoAdicional   NVARCHAR(MAX) as json
            ,cuotas          NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idLiquidacionCompra,idProveedor,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion, subcategoryId)
		SELECT @id                ,idProveedor,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion, subcategoryId
		FROM OPENJSON(@infoLiquidacion) WITH
        (
			 idProveedor          INT
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
            ,subcategoryId       INT
		) AS js


		INSERT INTO @tblDetails
              (idLiquidacionCompraDetalle,orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado,estado)
		SELECT idLiquidacionCompraDetalle,orderIndex,idArticulo,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,codigoPorcentaje,tarifa,valorImpuesto,precioTotalSinImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,precioCosto,conversion,precioCostoFraccionado,estado 
		FROM OPENJSON (@detalles) WITH 
        (
		     idLiquidacionCompraDetalle INT 
            ,orderIndex                 INT
		    ,idArticulo                 INT 
		    ,idBodega                   INT 
		    ,idMedida                   INT 
            ,idTipoIva                  INT  
		    ,ice                        NUMERIC(10,5) 
		    ,cantidad                   NUMERIC(15,5)
		    ,precioUnitario             NUMERIC(15,5) 
		    ,valorDescuento             NUMERIC(15,5)
		    ,precioTotalSinImpuesto     NUMERIC(15,5)
		    ,porcentajeDescuento        NUMERIC(15,5)
            ,codigoPorcentaje           VARCHAR(5)
            ,tarifa                     NUMERIC(15,5) 
            ,valorImpuesto              NUMERIC(15,5) 
		    ,precioTotalSinImpuesto     NUMERIC(15,5) 
		    ,nota                       VARCHAR(100) 
		    ,descripcion                VARCHAR(255) 
            ,llevaInventario            BIT
            ,cantidadTransaccion        NUMERIC(15,5) 
            ,precioCosto                NUMERIC(15,5)
            ,conversion                 NUMERIC(15,5)
            ,precioCostoFraccionado     NUMERIC(15,5)
            ,estado                     BIT
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

		INSERT INTO @tblInfoAdicional 
              (nombre,valor) 
        SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre VARCHAR(300) 
           ,valor  VARCHAR(300)
        )


        --> Variables 
		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

		SELECT @idTipoDocumento        = de.idTipoDocumento
			  ,@idDocumentoElectronico = lc.idDocumentoElectronico
              ,@secuencial             = de.nroDocumento
			  ,@ambiente               = pt.ambiente
			  ,@ptoEmi                 = pt.ptoEmi
              ,@estab                  = es.estab
		FROM dbo.LiquidacionCompra          lc WITH (NOLOCK) 
        INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = lc.idDocumentoElectronico
		INNER JOIN dbo.PuntoEmision         pt WITH (NOLOCK) ON pt.idPuntoEmision         = de.idPuntoEmision
		INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pt.idEstablecimiento
		WHERE lc.idLiquidacionCompra = @id

		SELECT @idProveedor  = idProveedor
			  ,@fechaEmision = js.fechaEmision
              ,@fechaVencimiento = js.fechaVencimiento
              ,@importeTotal = js.total
              ,@subcategoryId = subcategoryId
		FROM @tbComprobante js

        SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Proveedor WITH (NOLOCK) WHERE idProveedor = @idProveedor

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,'03'
													   ,CAST(@ambiente as nvarchar)
													   ,'1'
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))

		
        --> Validaciones 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante) 
            BEGIN
                SELECT '0'code,'Error en la info Factura'[message]
                RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SELECT '0'code,'Error en los detalles'[message]
                RETURN
            END
           
        IF NOT EXISTS(SELECT 1 FROM @tbTaxes) 
            BEGIN
                SELECT '0'code,'Error en los impuestos'[message]
                RETURN
            END

        IF NOT EXISTS(SELECT 1 FROM @tbCuotas) 
            BEGIN
                SELECT '0'code,'Error en las cuotas'[message]
                RETURN
            END

        IF EXISTS (SELECT 1 FROM [FactElect].[v_DocElectronico] WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico AND codEstado IN (4,3,6,8))
            BEGIN
                SELECT '0'code,'El Documento tiene un proceso en el Sri'[message]
                RETURN 
            END

		IF @claveAcceso IS NULL
			BEGIN
				SELECT '0'code,'La clave de acceso no se genero correctamente'[message]
				RETURN 
			END

		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE claveAcceso = @claveAcceso AND idDocumentoElectronico != @idDocumentoElectronico)
			BEGIN
				SELECT '0'code,'Error critico esta clave de acceso ya existe.'[message]
				RETURN 
			END

        IF EXISTS (SELECT 1 FROM v_CuentaPorPagar WITH (NOLOCK) WHERE codDoc = '03' AND codEstado != 'PE' AND idDocumento = @id)
            BEGIN
                SELECT '0'code,'El Documento tiene movimientos financieros o esta Anulado'[message]
                RETURN 
            END

       IF DATEDIFF(DAY, @fechaEmision, GETDATE()) > 0
            BEGIN
                SELECT '0' AS code, 'El documento encuentra fuera de la fecha permitida por el SRI' AS message;
                RETURN;
            END

		BEGIN TRAN 
            --> InfoTributaria
			UPDATE dbo.DocumentoElectronico WITH (ROWLOCK)
                SET claveAcceso      = @claveAcceso
				   ,fechaEmision     = @fechaEmision
				   --,customerId       = @CustomerId
                   ,idEstadoServicio = @idEstadoServicio
			WHERE idDocumentoElectronico = @idDocumentoElectronico

            --> InfoLiquidacion 
			UPDATE lc 
               SET lc.observacion          = jlc.observacion
				  ,lc.lastChange           = dbo.ufnGetDateEcuador()
			FROM LiquidacionCompra     lc WITH (ROWLOCK)
			INNER JOIN @tbComprobante jlc ON lc.idLiquidacionCompra = jlc.idLiquidacionCompra

            --> Forma pago
            --UPDATE FormaPagoLiquidacion SET abono = @importeTotal WHERE idLiquidacionCompra = @id

            --> Detalles 
			--UPDATE lcd WITH (ROWLOCK)
   --            SET lcd.idBodega               = js.idBodega
			--	  ,lcd.idMedida               = js.idMedida
			--	  ,lcd.idTipoIva              = js.idTipoIva
			--	  ,lcd.descripcion            = js.descripcion
			--	  ,lcd.cantidad               = js.cantidad
			--	  ,lcd.precioUnitario         = js.precioUnitario
			--	  ,lcd.porcentajeDescuento    = js.porcentajeDescuento
			--	  ,lcd.valorDescuento         = js.valorDescuento
			--	  ,lcd.nota                   = js.nota
			--	  ,lcd.precioTotalSinImpuesto = js.precioTotalSinImpuesto
   --               ,lcd.codigoPorcentaje       = js.codigoPorcentaje
   --               ,lcd.tarifa                 = js.tarifa
   --               ,lcd.valorImpuesto          = js.valorImpuesto
			--	  ,lcd.estado                 = js.estado
			--FROM LiquidacionCompraDetalle lcd 
			--INNER JOIN @tblDetails         js ON lcd.idLiquidacionCompraDetalle = js.idLiquidacionCompraDetalle

   --         --> Detalles  
			--INSERT INTO LiquidacionCompraDetalle
			--	   (idLiquidacionCompra,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,ice)
			--SELECT @id                 ,idBodega,idArticulo,idMedida,idTipoIva,descripcion,cantidad,precioUnitario,porcentajeDescuento,valorDescuento,nota,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,ice
			--FROM @tblDetails
   --         WHERE idLiquidacionCompraDetalle = 0
   --         ORDER BY orderIndex ASC

            --> Contabilidad
            UPDATE Contabilidad.CuentaPorPagar WITH (ROWLOCK)
                SET fechaEmision     = @fechaEmision
                   ,fechaVencimiento = @fechaVencimiento
                   ,subcategoryId    = @subcategoryId
            WHERE idDocumento = @id 
              AND codDoc = '03'

            UPDATE cp SET 
                   cp.fechaVencimiento = tc.fechaVencimiento
            FROM Contabilidad.CuotaPorPagar cp WITH (ROWLOCK)
            INNER JOIN @tbCuotas            tc ON tc.idCuotaPorPagar = cp.idCuotaPorPagar

            --> Impuestos
            --UPDATE Compra.LiquidacionImpuesto WITH (ROWLOCK) SET [Enabled] = 0 WHERE LiquidacionId = @id

            --INSERT INTO Compra.LiquidacionImpuesto
            --       (LiquidacionId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            --SELECT @id,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes
			
            --> informacion Adicional
			UPDATE dbo.InfoAdicionalDoc WITH(ROWLOCK) SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc (idComprobante,idTipoDocumento,nombre,valor) SELECT @id,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

   --         --> Inventario
			--IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
		 --       BEGIN
   --                 DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

   --                 SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'LC'

   --                 SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'E'

   --                 SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = @idTipoDocumentoIv AND idDocumento = @id

   --                 --> Transaccion
   --                 UPDATE Inventario.Transaccion WITH (ROWLOCK)
   --                    SET fechaEmision = @fechaEmision
   --                       ,CustomerId   = @customerId
   --                 WHERE idTransaccion = @idTransaccion

   --                 UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

   --                 IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
			--	        BEGIN
   --                         INSERT INTO Inventario.TransaccionDetalle
   --                                (idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,total)
			--                SELECT @idTransaccion,idArticulo,idBodega,idMedida,cantidad,cantidadTransaccion,precioUnitario,precioCosto,conversion,precioCostoFraccionado,precioTotalSinImpuesto 
   --                         FROM @tblDetails 
   --                         WHERE llevaInventario = 1
   --                           AND estado = 1

   --                         EXEC dbo.Transaccion_Handler_Init 'E', 'LC', @id ,2
   --                     END 
			--	END
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
		SELECT NEWID(),'/Liquidacion/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	    
        SELECT '0'code,'Info: Error en el procedimiento'[message]
    END CATCH 
END
