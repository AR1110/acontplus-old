USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Update]    Script Date: 1/28/2023 12:32:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Ventas.NotaCredito_Update @userRoleId INT ,@id BIGINT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	-- GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    -- Data Json
    DECLARE @infoNotaCredito VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

    -- Devolucion
    DECLARE @idFactura INT ,@idCliente INT ,@idPuntoEmision INT ,@importeTotal NUMERIC(18,5)

    --Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME2 ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@claveAcceso NVARCHAR(50) ,@isAutomatic INT ,@secuencial INT
           ,@idEstadoServicio INT ,@idDocumentoElectronico INT

    --> Inventario
    DECLARE @CustomerId INT 

    DECLARE @tbComprobante AS TABLE (
	    idNotaCredito INT NOT NULL
       ,idCliente INT NOT NULL
       ,idFactura INT NOT NULL
	   ,fechaEmision DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	)

		
	DECLARE @tblDetails AS TABLE (
		 orderIndex INT
        ,idNotaCreditoDetalle INT NOT NULL
	    ,idArticulo INT NOT NULL
	    ,idTarifa INT NOT NULL
	    ,idBodega INT NOT NULL
	    ,idMedida INT NULL
	    ,idTipoIva INT NOT NULL
	    ,ice NUMERIC (18,5) NOT NULL 
	    ,cantidad NUMERIC (18,5) NOT NULL
	    ,precioUnitario NUMERIC (18,5) NOT NULL
	    ,precioCosto NUMERIC (18,5) NOT NULL  
	    ,valorDescuento  NUMERIC (18,5) NOT NULL
	    ,porcentajeDescuento NUMERIC (18,5) NOT NULL
	    ,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(18,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
	    ,nota VARCHAR(100) NULL
	    ,descripcion VARCHAR(255) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,estado BIT NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
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

    DECLARE @tblInfoAdicional AS TABLE (
		 nombre VARCHAR(300) NOT NULL
		,valor VARCHAR(300) NOT NULL
	)


	BEGIN TRY
        SELECT TOP 1 @idUsuario = idUsuario, @idEntidad = idEntidad FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

         --> Data Json 
        SELECT @infoNotaCredito       = infoNotaCredito
              ,@detalles              = detalles
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
        FROM OPENJSON(@json) WITH 
        (
             infoNotaCredito       NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json 
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idNotaCredito,idCliente,idFactura,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion)
		SELECT @id          ,idCliente,idFactura,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion
		FROM OPENJSON(@infoNotaCredito) WITH
        (
			 idCliente               INT 
            ,idFactura               INT
			,fechaEmision            DATETIME2
			,subTotalSinImpuestos    NUMERIC(18,5) 
			,totalDescuento          NUMERIC(18,5)
			,porcentajeDescuento     NUMERIC(18,5)
			,propina                 NUMERIC(18,5)
			,total                   NUMERIC(18,5)
			,observacion             VARCHAR(500)
		) AS js


        INSERT INTO @tblDetails
              (idNotaCreditoDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,estado,conversion,precioCostoFraccionado)
		SELECT idNotaCreditoDetalle,orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion *-1,estado,conversion,precioCostoFraccionado 
		FROM OPENJSON (@detalles) WITH 
        (
			 orderIndex             INT
			,idNotaCreditoDetalle   INT
            ,idArticulo             INT
			,idTarifa               INT
			,idBodega               INT
			,idMedida               INT
			,ice                    NUMERIC(10,5)
			,cantidad               NUMERIC(15,5)
			,precioCosto            NUMERIC(15,5)
			,precioUnitario         NUMERIC(15,5)
			,valorDescuento         NUMERIC(15,5)
			,porcentajeDescuento    NUMERIC(15,5)
			,precioTotalSinImpuesto NUMERIC(15,5)
            ,codigoPorcentaje       VARCHAR(5)
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5)
			,nota                   NVARCHAR(100)
			,descripcion            NVARCHAR(255)
			,idTipoIva              INT
            ,llevaInventario        BIT
            ,cantidadTransaccion    NUMERIC(15,5)
            ,estado                 BIT
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

        INSERT INTO @tblInfoAdicional 
              (nombre,valor) 
        SELECT nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
             nombre VARCHAR(300)
            ,valor  VARCHAR(300)
        )

        --> Variables
		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT TOP 1 @idFactura = idFactura,@fechaEmision = fechaEmision ,@idCliente = idCliente ,@importeTotal = total FROM @tbComprobante

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

		SELECT @idTipoDocumento        = de.idTipoDocumento
              ,@idDocumentoElectronico = de.idDocumentoElectronico
              ,@secuencial             = de.nroDocumento
              ,@idPuntoEmision         = de.idPuntoEmision
              ,@ptoEmi                 = pe.ptoEmi
			  ,@ambiente               = pe.ambiente
			  ,@estab                  = es.estab
		FROM dbo.NotaCredito                nc WITH (NOLOCK)
        INNER JOIN dbo.DocumentoElectronico de WITH (NOLOCK) ON de.idDocumentoElectronico = nc.idDocumentoElectronico
		INNER JOIN dbo.PuntoEmision         pe WITH (NOLOCK) ON pe.idPuntoEmision         = de.idPuntoEmision 
        INNER JOIN Sri.Establecimiento      es WITH (NOLOCK) ON es.idEstablecimiento      = pe.idEstablecimiento
		WHERE nc.idNotaCredito = @id

        SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
													   ,'04'
													   ,@ambiente
													   ,'1'
													   ,dbo.AFTConvertDate(@fechaEmision)
													   ,@ruc
													   ,@estab+@ptoEmi
													   ,dbo.AFTAutoComplete(@secuencial))
		
		
		
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante) 
            BEGIN
                SELECT '0' code,'Error en la info NotaCredito' AS 'message'
				RETURN
            END 

        IF NOT EXISTS(SELECT 1 FROM @tblDetails) 
            BEGIN
                SELECT '0' code,'Error en los detalles' AS 'message'
				RETURN
            END
           
        IF NOT EXISTS(SELECT 1 FROM @tbTaxes) 
            BEGIN
                SELECT '0' code,'Error en los impuestos' AS 'message'
				RETURN
            END
        
		IF EXISTS (SELECT 1 FROM DocumentoElectronico WHERE claveAcceso = @claveAcceso AND idDocumentoElectronico != @idDocumentoElectronico)
			BEGIN
				SELECT '0'code,'Error critico esta clave de acceso ya existe.' as 'message',''  as titleSms
			
				RETURN
			END 

        IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE idDocumentoElectronico = @idDocumentoElectronico AND isAutomatic = 1)
            BEGIN
                SELECT '0'code, 'El Documento tiene un proceso en el Sri' as 'message'
                RETURN 
            END

        IF EXISTS (SELECT 1 FROM Ventas.v_NotaCredito WITH (NOLOCK) WHERE idNotaCredito = @id AND codServicio IN (4,3,6,8))
            BEGIN
                SELECT '0'code, 'El Documento tiene un proceso en el Sri' as 'message'
                RETURN 
            END

		IF EXISTS (SELECT 1 FROM Ventas.v_NotaCredito WITH (NOLOCK) WHERE codCuenta NOT IN('PE') AND idNotaCredito = @id)
            BEGIN
                SELECT '0'code, 'El Documento tiene movimientos financieros o esta Anulado' as 'message'
                RETURN 
            END

		BEGIN TRAN 
            --> Info Tributaria
            UPDATE DocumentoElectronico WITH (ROWLOCK)
                SET claveAcceso     = @claveAcceso
                  ,fechaEmision     = @fechaEmision
                  --,customerId       = @CustomerId
                  ,idEstadoServicio = @idEstadoServicio
            WHERE idDocumentoElectronico = @idDocumentoElectronico

            --> InfoNotaCredito
            --UPDATE f SET f.notaCredito = 0  FROM Factura f JOIN Notacredito nc ON nc.idFactura = f.idFactura  WHERE nc.idNotaCredito = @id

            UPDATE nc WITH (ROWLOCK) set
               --SET nc.idCliente            = jc.idCliente
               --   ,nc.idFactura            = jc.idFactura
               --   ,nc.subTotalSinImpuestos = jc.subTotalSinImpuestos
               --   ,nc.totalDescuento       = jc.totalDescuento
               --   ,nc.porcentajeDescuento  = jc.porcentajeDescuento
               --   ,nc.propina              = jc.propina
               --   ,nc.total                = jc.total
                 nc.observacion          = jc.observacion
                ,nc.lastChange = GETDATE()
                ,nc.idUsuario = @idUsuario
            FROM NotaCredito nc
            INNER JOIN @tbComprobante jc ON nc.idNotaCredito = jc.idNotaCredito

            --UPDATE Factura SET notaCredito = 1 WHERE idFactura = @idFactura

            --> Detalles 
            --UPDATE nd WITH (ROWLOCK)
            --   SET nd.idTarifa               = jd.idTarifa
            --      ,nd.idBodega               = jd.idBodega
            --      ,nd.idMedida               = jd.idMedida
            --      ,nd.ice                    = jd.ice
            --      ,nd.cantidad               = jd.cantidad
            --      ,nd.porcentajeDescuento    = jd.porcentajeDescuento
            --      ,nd.valorDescuento         = jd.valorDescuento
            --      ,nd.precioUnitario         = jd.precioUnitario
            --      ,nd.precioTotalSinImpuesto = jd.precioTotalSinImpuesto
            --      ,nd.codigoPorcentaje       = jd.codigoPorcentaje
            --      ,nd.tarifa                 = jd.tarifa
            --      ,nd.valorImpuesto          = jd.valorImpuesto
            --      ,nd.nota                   = jd.nota
            --      ,nd.descripcion            = jd.descripcion
            --      ,nd.idTipoIva              = jd.idTipoIva
            --      ,nd.estado                 = jd.estado
            --FROM NotaCreditoDetalle nd
            --INNER JOIN @tblDetails  jd ON jd.idNotaCreditoDetalle = nd.idNotaCreditoDetalle

            --INSERT INTO NotaCreditoDetalle 
            --      (idNotaCredito,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto)
            --SELECT @id,          idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto
            --FROM @tblDetails
            --WHERE idNotaCreditoDetalle = 0
            --ORDER BY orderIndex ASC

            -->Impuestos
            --UPDATE Ventas.NotaCreditoImpuesto WITH (ROWLOCK) SET [Enabled]  = 0 WHERE NotaCreditoId = @id

            --INSERT INTO Ventas.NotaCreditoImpuesto
            --    (NotaCreditoId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            --SELECT @id        ,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

            --> informacion Adiciomal
            UPDATE dbo.InfoAdicionalDoc WITH (ROWLOCK) SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor) SELECT @id,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

            --> Contabilidad 
            UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK)
               SET fechaEmision     = @fechaEmision
            WHERE idDocumento = @id
              AND codDoc = '04'

            --> Inventario 
         --   IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
         --       BEGIN
                       
         --           DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

         --           SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NC'

         --           SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

         --           SELECT TOP 1 @idTransaccion = idTransaccion FROM Inventario.Transaccion WHERE idTipoTransaccion = @idTipoTransaccion AND idTipoDocumento = @idTipoDocumentoIv AND idDocumento = @id

         --           --> Transaccion
         --           UPDATE Inventario.Transaccion WITH (ROWLOCK)
         --               SET fechaEmision = @fechaEmision
         --                  ,CustomerId   = @customerId
         --           WHERE idTransaccion = @idTransaccion

         --           UPDATE Inventario.TransaccionDetalle WITH (ROWLOCK) SET estado = 0 WHERE idTransaccion = @idTransaccion

         --           IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1 AND estado = 1)
					    --BEGIN
         --                   --> Detalle
         --                   INSERT INTO Inventario.TransaccionDetalle 
         --                          (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			      --          SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,precioTotalSinImpuesto 
         --                   FROM @tblDetails 
         --                   WHERE llevaInventario = 1
         --                     AND estado = 1

         --                   EXEC dbo.Transaccion_Handler_Init @idTransaccion
         --               END 
         --       END

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message','' as titleSms
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END

		INSERT INTO ErroresSistema
			(token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/NotaCredito/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0'code,'Info: Error en el procedimiento'as 'message' ,'' as titleSms
	END CATCH 


END
