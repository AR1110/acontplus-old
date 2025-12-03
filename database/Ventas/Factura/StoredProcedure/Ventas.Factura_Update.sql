USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[Factura_Update]    Script Date: 12/8/2022 4:59:51 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-11-25
-- Description:	SP para actualizar la factura
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.Factura_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	--Global 
    DECLARE @idUsuario INT ,@idEntidad INT ,@idTipoDocumento INT

    -- Data Json
    DECLARE @infoFactura VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@formaPago VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

    --> Venta 
	DECLARE @idPuntoEmision INT

    --Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME2 ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@claveAcceso NVARCHAR(50) ,@secuencial INT
           ,@idEstadoServicio INT ,@idDocumentoElectronico INT

    -- Contabilidad -- 
	DECLARE @importeTotal NUMERIC(18,5) ,@fechaVencimiento DATETIME2  ,@serieComprobante VARCHAR(30)

    -- Cliente
	DECLARE @idCliente INT ,@customerId INT 

	
	DECLARE @tbComprobante AS TABLE (
	    idFactura INT NOT NULL UNIQUE
       ,idCliente INT NOT NULL
	   ,idTiempoCredito INT NOT NULL
	   ,idPuntoEmision INT NOT NULL
	   ,idUsuario INT NOT NULL
	   ,fechaEmision DATETIME NOT NULL
	   ,fechaVencimiento DATETIME NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	   ,placa VARCHAR(100) NULL
	   ,identificacionComprador VARCHAR(300) NULL
	   ,razonSocialComprador VARCHAR(300) NULL
	   ,direccionComprador VARCHAR(300) NULL
	   ,email VARCHAR(300) NULL
	   ,telefono VARCHAR(300) NULL

	)

	DECLARE @tblDetails AS TABLE (
		 orderIndex INT NOT NULL
		,idFacturaDetalle INT NOT NULL
		,idArticulo INT NOT NULL
		,idTarifa INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,5) NOT NULL
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,nota VARCHAR(300)  NULL
		,descripcion VARCHAR(300) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,precioCosto NUMERIC (18,5)  NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
        ,estado BIT NOT NULL
        ,uuid VARCHAR(300) NOT NULL
	)

    DECLARE @payment AS TABLE (
        idFormaPagoFactura INT UNIQUE NOT NULL
       ,idFormaPagoSri INT NOT NULL
       ,idTiempoCredito INT NOT NULL
       ,total NUMERIC(18,5) NOT NULL
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
		 idInfoAdicional INT NULL
        ,nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)

    DECLARE @tbCuotas AS TABLE(
	    idCuotaPorCobrar INT UNIQUE NOT NULL
       ,nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)

	DECLARE @historyInfoAdicional AS TABLE(
		 idHistoryInfoAdicional INT NOT NULL  
        ,idInfoAdicional INT NOT NULL
	    ,estado INT NOT NULL
        ,uuid VARCHAR(300) NOT NULL
        
	)

	BEGIN TRY
        --> Data Json 
        SELECT @infoFactura           = infoFactura
              ,@detalles              = detalles
              ,@formaPago             = formaPago
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@infoAdicionalArticulo = infoAdicionalArticulo
              ,@cuotas                = cuotas
        FROM OPENJSON(@json) WITH 
        (
             infoFactura           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json 
            ,impuestos             NVARCHAR(MAX) as json
            ,formaPago             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,infoAdicionalArticulo NVARCHAR(MAX) as json
            ,cuotas                NVARCHAR(MAX) as json
        )

		INSERT INTO @tbComprobante
		      (idFactura,idCliente,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa)
		SELECT @id      ,idCliente,idTiempoCredito,idPuntoEmision,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,placa
		FROM OPENJSON(@infoFactura) 
		WITH
        (
			 idCliente            INT 
			,idTiempoCredito      INT 
			,idPuntoEmision       INT 
			,idUsuario            INT 
			,fechaEmision         DATETIME2
			,fechaVencimiento     DATETIME2 
			,subTotalSinImpuestos NUMERIC(18,5)
			,totalDescuento       NUMERIC(18,5)
			,porcentajeDescuento  NUMERIC(18,5)
			,propina              NUMERIC(18,5)
			,recargo			  NUMERIC(18,5)
			,transporte           NUMERIC(18,5)
			,total                NUMERIC(18,5) 
			,observacion          VARCHAR(500) 
			,placa                VARCHAR(100) 

         ) AS js
		
		INSERT INTO @tblDetails
              (idFacturaDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,llevaInventario,cantidadTransaccion,conversion,precioCostoFraccionado,estado,uuid)
		SELECT idFacturaDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,llevaInventario,cantidadTransaccion *-1,conversion,precioCostoFraccionado,estado,uuid 
		FROM OPENJSON (@detalles) WITH 
        (
             orderIndex             INT 
			,idFacturaDetalle       INT 
			,idArticulo             INT 
			,idTarifa               INT 
			,idBodega               INT 
			,idMedida               INT 
            ,idTipoIva              INT 
			,ice                    NUMERIC(10,5) 
			,cantidad               NUMERIC(15,5) 
			,precioUnitario         NUMERIC(15,5) 
			,precioCosto            NUMERIC(15,5) 
			,valorDescuento         NUMERIC(15,5) 
			,precioTotalSinImpuesto NUMERIC(15,5) 
			,porcentajeDescuento    NUMERIC(15,5)
			,precioTotalSinImpuesto NUMERIC(15,5) 
            ,codigoPorcentaje       VARCHAR(5) 
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5) 
			,nota                   VARCHAR(300)
			,descripcion            VARCHAR(300)
            ,llevaInventario        BIT 
            ,cantidadTransaccion    NUMERIC(15,5) 
            ,estado                 BIT 
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
            ,uuid                   VARCHAR(300)
		)

        INSERT INTO @payment
              (idFormaPagoFactura,idFormaPagoSri,idTiempoCredito,total)
        SELECT idFormaPagoFactura,idFormaPagoSri,idTiempoCredito,total
        FROM OPENJSON(@formaPago) WITH 
        (
            idFormaPagoFactura INT
           ,idFormaPagoSri     INT 
           ,idTiempoCredito    INT 
           ,total              NUMERIC(18,5) 
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

		-->InfoAdicional
		INSERT INTO @tblInfoAdicional 
              (idInfoAdicional,nombre,valor) 
        SELECT idInfoAdicional,nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            idInfoAdicional INT
           ,nombre          VARCHAR(300) 
           ,valor           VARCHAR(300) 
        )

		INSERT INTO @historyInfoAdicional 
              (idHistoryInfoAdicional,idInfoAdicional,estado,uuid)
        SELECT idHistoryInfoAdicional,idInfoAdicional,estado,uuid FROM OPENJSON(@infoAdicionalArticulo) WITH
        (
            idHistoryInfoAdicional INT
           ,idInfoAdicional        INT
           ,uuid                   VARCHAR(300)
           ,estado                 INT
        )

        INSERT INTO @tbCuotas
              (idCuotaPorCobrar,nroCuota,fechaVencimiento,cuota,entrada)
        SELECT idCuotaPorCobrar,nroCuota,fechaVencimiento,cuota,entrada
        FROM OPENJSON(@cuotas) WITH 
        (
            idCuotaPorCobrar INT
           ,nroCuota         INT
	       ,fechaVencimiento DATE 
	       ,cuota            NUMERIC(18,5) 
	       ,entrada          BIT 
        )
        ----------------------------------------- VARIABLES ----------------------------------------------------------------------------------------

		SELECT TOP 1 @idUsuario = idUsuario,@idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

        SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE codigoSri = '01'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

		SELECT @secuencial             = de.nroDocumento
              ,@idDocumentoElectronico = de.idDocumentoElectronico
              ,@idPuntoEmision         = de.idPuntoEmision
              ,@ambiente               = pe.ambiente
			  ,@ptoEmi                 = pe.ptoEmi
              ,@estab                  = es.estab
			  ,@ruc                    = en.ruc
		FROM dbo.Factura                    fa WITH (NOLOCK)
		INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = fa.idDocumentoElectronico
        INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision
        INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
        INNER JOIN dbo.Entidad              en WITH (NOLOCK) ON en.idEntidad              = es.idEntidad
		WHERE fa.idFactura = @id

		SELECT @importeTotal     = total
			  ,@idCliente        = idCliente
			  ,@fechaEmision     = fechaEmision
			  ,@fechaVencimiento = fechaVencimiento
		FROM @tbComprobante

		SELECT TOP 1 @customerId = ISNULL(CustomerId,0) FROM Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,'01'
													   ,@ambiente
													   ,'1'
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))

		SELECT @serieComprobante   = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial)

        --> Validacion de informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante) 
            BEGIN
                SELECT '0' code,'Error en la info Factura' AS 'message' RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SELECT '0' code,'Error en los detalles' AS 'message'
				RETURN
            END

        IF NOT EXISTS(SELECT 1 FROM @payment) 
            BEGIN
                SELECT '0' code,'Error en la forma de pago' AS 'message'
				RETURN
            END
           
        IF NOT EXISTS(SELECT 1 FROM @tbTaxes) 
            BEGIN
                SELECT '0' code,'Error en los impuestos' AS 'message'
				RETURN
            END

        IF NOT EXISTS(SELECT 1 FROM @tbCuotas) 
            BEGIN
                SELECT '0' code,'Error en las cuotas' AS 'message'
                RETURN
            END


		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE claveAcceso = @claveAcceso AND idDocumentoElectronico != @idDocumentoElectronico)
			BEGIN
				SELECT '0'code,'Error critico esta clave de acceso ya existe' as 'message'
				RETURN
			END 

		IF EXISTS (SELECT 1 FROM Ventas.v_Factura WITH (NOLOCK) WHERE codCuenta NOT IN ('PE') AND idFactura = @id)
            BEGIN
                SELECT '0'code, 'El Documento tiene movimientos financieros o esta Anulado' as 'message'
                RETURN 
            END 

        IF EXISTS (SELECT 1 FROM FactElect.v_DocElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico AND codEstado IN (4,3,6,8))
            BEGIN
                SELECT '0'code, 'El Documento tiene un proceso en el Sri' as 'message'
                RETURN 
            END

        -- Transaccion 
		BEGIN TRAN
             --> Info Tributaria
			UPDATE DocumentoElectronico WITH (ROWLOCK)
               SET claveAcceso      = @claveAcceso
                  --,customerId       = @customerId
                  ,fechaEmision     = @fechaEmision
                  ,idEstadoServicio = @idEstadoServicio
                  ,isAutomatic      = 1
            WHERE idDocumentoElectronico = @idDocumentoElectronico

            --> Info Factura
			UPDATE f SET 
				   f.observacion         = jf.observacion
				  ,f.lastChange          = dbo.ufnGetDateEcuador()
			FROM Factura               f WITH (ROWLOCK)
			INNER JOIN @tbComprobante jf ON f.idFactura = jf.idFactura

            --> Detalles
			--UPDATE fd SET 
			--	   fd.idTarifa               = js.idTarifa
			--	  ,fd.idBodega               = js.idBodega
			--	  ,fd.idMedida               = js.idMedida
			--	  ,fd.ice                    = js.ice
			--	  ,fd.cantidad               = js.cantidad
			--	  ,fd.precioUnitario         = js.precioUnitario
			--	  ,fd.valorDescuento         = js.valorDescuento
			--	  ,fd.porcentajeDescuento    = js.porcentajeDescuento
			--	  ,fd.precioTotalSinImpuesto = js.precioTotalSinImpuesto
			--	  ,fd.nota                   = js.nota
			--	  ,fd.descripcion            = js.descripcion
			--	  ,fd.idTipoIva              = js.idTipoIva
   --               ,fd.codigoPorcentaje       = js.codigoPorcentaje
   --               ,fd.tarifa                 = js.tarifa
   --               ,fd.valorImpuesto          = js.valorImpuesto
			--	  ,fd.estado                 = js.estado
			--FROM FacturaDetalle fd 
			--INNER JOIN @tblDetails js ON js.idFacturaDetalle = fd.idFacturaDetalle

			--INSERT INTO FacturaDetalle 
   --               (idFactura,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,precioCosto,uuid)
			--SELECT @id,      idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,valorImpuesto,codigoPorcentaje,tarifa,nota,descripcion,precioCosto,uuid
			--FROM @tblDetails  
			--WHERE idFacturaDetalle = 0 
   --         ORDER BY orderIndex ASC
            
            -->Forma Pago
            UPDATE fp WITH (ROWLOCK) 
               SET fp.idFormaPagoSri = py.idFormaPagoSri
            FROM dbo.FormaPagoFactura fp
            INNER JOIN @payment       py ON py.idFormaPagoFactura = fp.idFormaPagoFactura

            --> Contabilidad 
            UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK)
               SET fechaEmision     = @fechaEmision
                  ,fechaVencimiento = @fechaVencimiento
                  ,diasMora         = 0
                  ,mora             = 0
                  ,UpdatedAt        = NULL
            WHERE idDocumento = @id
              AND codDoc = '01'

            UPDATE cc 
               SET cc.fechaVencimiento = ct.fechaVencimiento
                  ,diasMora            = 0
                  ,mora                = 0
	        FROM Contabilidad.CuotaPorCobrar cc WITH (ROWLOCK)
	        INNER JOIN @tbCuotas             ct ON ct.idCuotaPorCobrar = cc.idCuotaPorCobrar
	       

            -->Impuestos
            --UPDATE Ventas.FacturaImpuesto SET [Enabled] = 0 WHERE FacturaId = @id

            --INSERT INTO Ventas.FacturaImpuesto
            --      (FacturaId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            --SELECT @id      ,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes


			--> Inventario
    --        IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
			 --   BEGIN
    --                DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

    --                SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'FE'

    --                SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

    --                SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WITH (NOLOCK) WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = @idTipoDocumentoIv AND idDocumento = @id
 
    --                IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1 AND cantidadTransaccion <> 0)
				--	    BEGIN
    --                        INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
    --                               (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			 --               SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,precioTotalSinImpuesto 
    --                        FROM @tblDetails
    --                        WHERE llevaInventario = 1
    --                          AND cantidadTransaccion <> 0

    --                        EXEC dbo.Transaccion_Handler_Init @idTransaccion
    --                    END 

    --                --> Servicios
    --                IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 0)
				--		BEGIN 
    --                        UPDATE Contabilidad.Servicio WITH (ROWLOCK) SET Estado = 0 WHERE TipoDocumentoId = @idTipoDocumentoIv AND DocumentoId = @id

    --                        INSERT INTO [Contabilidad].[Servicio] WITH (ROWLOCK)
    --                                 (TipoDocumentoId, PuntoEmisionId,ClienteId,UsuarioId,ArticuloId,TarifaId,MedidaId,TipoIvaId,BodegaId,DocumentoId,Secuencial,FechaEmision,Descripcion,Nota,Cantidad,PrecioUnitario,PrecioCosto,PrecioTotalSinImpuesto)
				--	        SELECT @idTipoDocumentoIv,@idPuntoEmision,@idCliente,@idUsuario,idArticulo,idTarifa,idMedida,idTipoIva,idBodega,@id,@secuencial,@fechaEmision,descripcion,nota,cantidadTransaccion,precioUnitario,precioCosto,precioTotalSinImpuesto
    --                        FROM @tblDetails 
    --                        WHERE llevaInventario = 0
    --                          AND estado = 1
    --                    END 
				--END
            
			--> informacion Adicional
			UPDATE dbo.InfoAdicionalDoc SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc (idComprobante,idTipoDocumento,idInfoAdicional,nombre,valor) SELECT @id,@idTipoDocumento,idInfoAdicional,nombre,valor FROM @tblInfoAdicional

            --> Manejo de InfoAdicional 
            IF EXISTS (SELECT 1 FROM @historyInfoAdicional)
                BEGIN 
                    UPDATE ia SET ia.estado = 0 
                    FROM Ventas.HistoryInfoAdicional ia WITH (NOLOCK) 
                    INNER JOIN @historyInfoAdicional hi ON hi.idHistoryInfoAdicional = ia.idHistoryInfoAdicional

                    INSERT INTO Ventas.HistoryInfoAdicional
                          (idInfoAdicional,idFacturaDetalle)
			        SELECT idInfoAdicional,idFacturaDetalle 
                    FROM @historyInfoAdicional    ia
                    INNER JOIN dbo.FacturaDetalle fd WITH (ROWLOCK) ON fd.uuid = ia.uuid
                    WHERE fd.idFactura = @id
                      AND fd.estado = 1
                      AND ia.estado = 2

			        UPDATE ia SET ia.estado = hi.estado
			        FROM Compra.InfoAdicional        ia WITH (NOLOCK)
			        INNER JOIN @historyInfoAdicional hi ON hi.idInfoAdicional = ia.idInfoAdicional
                END

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Exitosamente' as 'message'
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
		SELECT '0'code,'Info: Error en el procedimiento ' as 'message'

		INSERT INTO ErroresSistema
		        (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		VALUES (NEWID(),'/Factura/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario)
	END CATCH 


END
