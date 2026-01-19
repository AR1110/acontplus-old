USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaEntrega_Update]    Script Date: 12/9/2022 8:44:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2021-12-01
-- Description:	SP para actualizar las notas de entrega
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.NotaEntrega_Update @userRoleId INT ,@id INT  ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;
	SET DEADLOCK_PRIORITY LOW

    --Global 
    DECLARE @idUsuario INT ,@idEntidad INT ,@idTipoDocumento INT

    -- Data Json
    DECLARE @notaEntrega VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@infoAdicionalArticulo VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX) ,@cuotas VARCHAR(MAX)

    -- Venta 
	DECLARE @idPuntoEmision INT ,@fechaEmision DATETIME ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5) ,@secuencial INT 

    -- Contabilidad -- 
	DECLARE @importeTotal NUMERIC(18,5) ,@fechaVencimiento DATETIME 

	-- Cliente
	DECLARE @idCliente INT ,@CustomerId INT ,@serieComprobante VARCHAR(30)

     DECLARE @tbComprobante AS TABLE (
	    idNotaEntrega INT NOT NULL
       ,idCliente INT NOT NULL
	   ,idUsuario INT NOT NULL
	   ,fechaEmision DATETIME2 NOT NULL
	   ,fechaVencimiento DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	   ,identificacionComprador VARCHAR(300) NULL
	   ,razonSocialComprador VARCHAR(300) NULL
	   ,direccionComprador VARCHAR(300) NULL
	   ,email VARCHAR(300) NULL
	   ,telefono VARCHAR(300) NULL
	)


	DECLARE @tblDetails AS TABLE (
		 orderIndex INT 
        ,idNotaEntregaDetalle INT NOT NULL
		,idArticulo INT NOT NULL
		,idTarifa INT NOT NULL
		,idBodega INT NOT NULL
		,idMedida INT NULL
		,idTipoIva INT NOT NULL
		,ice NUMERIC (18,5) NOT NULL
		,cantidad NUMERIC (18,5) NOT NULL
		,precioUnitario NUMERIC (18,6) NOT NULL
        ,precioCosto NUMERIC (18,5)  NOT NULL
		,valorDescuento  NUMERIC (18,5) NOT NULL
		,porcentajeDescuento NUMERIC (18,5) NOT NULL
		,precioTotalSinImpuesto NUMERIC (18,5) NOT NULL
        ,codigoPorcentaje VARCHAR(5) NOT NULL
        ,tarifa NUMERIC(15,5) NOT NULL
        ,valorImpuesto NUMERIC(18,5) NOT NULL
		,nota VARCHAR(300)  NULL
		,descripcion VARCHAR(255) NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
        ,llevaInventario BIT NOT NULL
        ,estado BIT NOT NULL
        ,conversion NUMERIC(18,5) NOT NULL
        ,precioCostoFraccionado NUMERIC(18,5) NOT NULL
        ,uuid VARCHAR(300) NOT NULL
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
        ,idInfoAdicional INT NULL
	)

	DECLARE @historyInfoAdicional AS TABLE(
	    idHistoryInfoAdicional INT NOT NULL 
       ,idInfoAdicional INT NOT NULL
       ,estado INT NOT NULL
       ,uuid VARCHAR(300) NOT NULL
	)

    DECLARE @tbCuotas AS TABLE(
	    idCuotaPorCobrar INT UNIQUE NOT NULL
       ,nroCuota INT UNIQUE NOT NULL 
	   ,fechaVencimiento DATE NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,entrada BIT NOT NULL
	)
	

	BEGIN TRY 

        --> Data Json 
        SELECT @notaEntrega           = notaEntrega
              ,@detalles              = detalles
              ,@impuestos             = impuestos
              ,@infoAdicional         = infoAdicional
              ,@infoAdicionalArticulo = infoAdicionalArticulo
              ,@cuotas                = cuotas
        FROM OPENJSON(@json) WITH 
        (
             notaEntrega           NVARCHAR(MAX) as json
            ,detalles              NVARCHAR(MAX) as json
            ,impuestos             NVARCHAR(MAX) as json
            ,infoAdicional         NVARCHAR(MAX) as json
            ,infoAdicionalArticulo NVARCHAR(MAX) as json
            ,cuotas                NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		       (idNotaEntrega,idCliente,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,identificacionComprador,razonSocialComprador,direccionComprador,email,telefono)
		SELECT @id           ,idCliente,idUsuario,fechaEmision,fechaVencimiento,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion,identificacionComprador,razonSocialComprador,direccionComprador,email,telefono
		FROM OPENJSON(@notaEntrega) WITH
        (
			 idCliente               INT
			,idUsuario               INT
			,fechaEmision            DATETIME2
			,fechaVencimiento        DATETIME2
			,subTotalSinImpuestos    NUMERIC(18,5)
			,totalDescuento          NUMERIC(18,5) 
			,porcentajeDescuento     NUMERIC(18,5)
			,propina                 NUMERIC(18,5)
			,recargo			     NUMERIC(18,5) 
			,transporte              NUMERIC(18,5) 
			,total                   NUMERIC(18,5)
			,observacion             VARCHAR(500)
			,identificacionComprador VARCHAR(300)
	        ,razonSocialComprador    VARCHAR(300)
	        ,direccionComprador      VARCHAR(300)
	        ,email                   VARCHAR(300)
	        ,telefono                VARCHAR(300)

		) AS js


        INSERT INTO @tblDetails
              (orderIndex,idNotaEntregaDetalle,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,tarifa,codigoPorcentaje,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,conversion,precioCostoFraccionado,estado,uuid)
		SELECT orderIndex,idNotaEntregaDetalle,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,tarifa,codigoPorcentaje,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion*-1,conversion,precioCostoFraccionado,estado,uuid 
		FROM OPENJSON (@detalles) WITH 
        (
             orderIndex             INT 
            ,idNotaEntregaDetalle   INT 
            ,idArticulo             INT
            ,idTarifa               INT
            ,idBodega               INT
            ,idMedida               INT
            ,idTipoIva              INT
            ,ice                    NUMERIC(10,5)
            ,cantidad               NUMERIC(15,5)
            ,precioUnitario         NUMERIC(18,6)
            ,precioCosto            NUMERIC(15,5)
            ,valorDescuento         NUMERIC(15,5)
            ,precioTotalSinImpuesto NUMERIC(15,5)
            ,porcentajeDescuento    NUMERIC(15,5)
            ,codigoPorcentaje       VARCHAR(5)
            ,tarifa                 NUMERIC(15,5)
            ,valorImpuesto          NUMERIC(15,5)
            ,nota                   VARCHAR(300)
            ,descripcion            VARCHAR(255) 
            ,llevaInventario        BIT
            ,cantidadTransaccion    NUMERIC(15,5) 
            ,conversion             NUMERIC(15,5)
            ,precioCostoFraccionado NUMERIC(15,5)
            ,estado                 BIT
            ,uuid                   VARCHAR(300)
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

        INSERT INTO @tblInfoAdicional 
              (idInfoAdicional,nombre,valor)
		SELECT idInfoAdicional,nombre,valor FROM OPENJSON(@infoAdicional) WITH 
        (
            nombre          VARCHAR(300) 
           ,valor           VARCHAR(300)
           ,idInfoAdicional INT
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

        --> Variables 
		SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

		SELECT @idTipoDocumento = ne.idTipoDocumento
			  ,@secuencial      = ne.nroDocumento
              ,@idPuntoEmision  = ne.idPuntoEmision
			  ,@ptoEmi          = pe.ptoEmi
			  ,@estab           = es.estab
		FROM NotaEntrega               ne WITH (NOLOCK)
		INNER JOIN PuntoEmision        pe WITH (NOLOCK) ON pe.idPuntoEmision    = ne.idPuntoEmision
		INNER JOIN Sri.establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pe.idEstablecimiento
		WHERE ne.idNotaEntrega = @id
		
		SELECT @importeTotal     = js.total
		      ,@fechaEmision     = js.fechaEmision
		      ,@idCliente        = js.idCliente
		      ,@fechaVencimiento = js.fechaVencimiento
		FROM @tbComprobante js

        SELECT TOP 1 @customerId = ISNULL(CustomerId,0) FROM Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

        SELECT @serieComprobante   = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial)

		--> Validando Informacion 
        IF NOT EXISTS(SELECT 1 FROM @tbComprobante)
            BEGIN
                SELECT '0' code,'Error en la info Factura' AS 'message'
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

        IF NOT EXISTS(SELECT 1 FROM @tbCuotas) 
            BEGIN
                SELECT '0' code,'Error en las Cuotas' AS 'message'
                RETURN
            END

        IF EXISTS (SELECT 1 FROM v_CuentaPorCobrar WITH (NOLOCK) WHERE codDoc = 'NE' AND codEstado != 'PE' AND idDocumento = @id)
            BEGIN
                SELECT '0'code, 'El Documento tiene movimientos financieros o esta Anulado' as 'message'
                RETURN 
            END
            
		BEGIN TRAN 
            --> Comprobante
			UPDATE ne WITH (ROWLOCK)
               SET ne.fechaEmision         = jf.fechaEmision
				  ,ne.observacion          = jf.observacion
				  ,ne.lastChange           = dbo.ufnGetDateEcuador()
			FROM NotaEntrega ne
			INNER JOIN @tbComprobante jf ON ne.idNotaEntrega = jf.idNotaEntrega

			----> Detalles
			--UPDATE nd WITH (ROWLOCK)
   --            SET nd.idTarifa               = js.idTarifa
			--	  ,nd.idBodega               = js.idBodega
			--	  ,nd.idMedida               = js.idMedida
			--	  ,nd.ice                    = js.ice
			--	  ,nd.cantidad               = js.cantidad
			--	  ,nd.precioUnitario         = js.precioUnitario
			--	  ,nd.valorDescuento         = js.valorDescuento
			--	  ,nd.porcentajeDescuento    = js.porcentajeDescuento
			--	  ,nd.precioTotalSinImpuesto = js.precioTotalSinImpuesto
			--	  ,nd.nota                   = js.nota
			--	  ,nd.descripcion            = js.descripcion
			--	  ,nd.idTipoIva              = js.idTipoIva
			--	  ,nd.valorImpuesto          = js.valorImpuesto
   --               ,nd.codigoPorcentaje       = js.codigoPorcentaje
   --               ,nd.tarifa                 = js.tarifa
			--	  ,nd.estado                 = js.estado
			--FROM NotaEntregaDetalle nd 
			--INNER JOIN @tblDetails js ON js.idNotaEntregaDetalle = nd.idNotaEntregaDetalle


			--INSERT INTO NotaEntregaDetalle 
			--	  (idNotaEntrega,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,nota,descripcion,valorImpuesto,codigoPorcentaje,tarifa,precioCosto,uuid)
			--SELECT @id          ,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,nota,descripcion,valorImpuesto,codigoPorcentaje,tarifa,precioCosto,uuid
			--FROM @tblDetails js
			--WHERE js.idNotaEntregaDetalle = 0
   --         ORDER BY js.orderIndex ASC
            
   --          -->Impuestos
   --         UPDATE Ventas.NotaEntregaImpuesto WITH (ROWLOCK) SET [Enabled] = 0 WHERE NotaEntregaId = @id

   --         INSERT INTO Ventas.NotaEntregaImpuesto
   --               (NotaEntregaId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
   --         SELECT @id          ,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount FROM @tbTaxes

			--> Contabilidad 
            UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK)
               SET fechaEmision     = @fechaEmision
                  ,fechaVencimiento = @fechaVencimiento
                  ,diasMora         = 0
                  ,mora             = 0
                  ,UpdatedAt        = NULL
            WHERE idDocumento = @id
              AND codDoc = 'NE'

            UPDATE cc 
               SET cc.fechaVencimiento = ct.fechaVencimiento
                  ,diasMora            = 0
                  ,mora                = 0
	        FROM Contabilidad.CuotaPorCobrar cc WITH (ROWLOCK)
	        INNER JOIN @tbCuotas             ct ON ct.idCuotaPorCobrar = cc.idCuotaPorCobrar

            --> informacion Adiciomal
			UPDATE dbo.InfoAdicionalDoc SET estado = 0 WHERE idComprobante = @id AND idTipoDocumento = @idTipoDocumento

			INSERT INTO dbo.InfoAdicionalDoc (idComprobante,idTipoDocumento,idInfoAdicional,nombre,valor) SELECT @id,@idTipoDocumento,idInfoAdicional,nombre,valor FROM @tblInfoAdicional

            --> Manejo de InfoAdicional 
            IF EXISTS (SELECT 1 FROM @historyInfoAdicional)
                BEGIN 
                    
                    UPDATE ia SET ia.estado = 0 
                    FROM Ventas.HistoryInfoAdicional ia WITH (NOLOCK) 
                    INNER JOIN @historyInfoAdicional hi ON hi.idHistoryInfoAdicional = ia.idHistoryInfoAdicional

                    INSERT INTO Ventas.HistoryInfoAdicional
                          (idInfoAdicional,idNotaEntregaDetalle)
			        SELECT idInfoAdicional,idNotaEntregaDetalle 
                    FROM @historyInfoAdicional        ia
                    INNER JOIN dbo.NotaEntregaDetalle nd WITH (ROWLOCK) ON nd.uuid = ia.uuid
                    WHERE nd.idNotaEntrega = @id
                      AND nd.estado = 1
                      AND ia.estado = 2

			        UPDATE ia SET ia.estado = hi.estado
			        FROM Compra.InfoAdicional        ia WITH (NOLOCK)
			        INNER JOIN @historyInfoAdicional hi ON hi.idInfoAdicional = ia.idInfoAdicional
                END
		COMMIT TRAN 
		SELECT '1'code,'Actualizado Exitosamente' as 'message',''
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END

		INSERT INTO ErroresSistema
		      (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/NotaEntrega/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	    
        SELECT '0'code,'Info: Error en el procedimiento ' as 'message'
    END CATCH 

END
