USE [AcontPlus]
GO
/****** Object:  StoredProcedure [Ventas].[NotaCredito_Insert]    Script Date: 12/8/2022 9:37:40 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Ventas.NotaCredito_Insert @userRoleId INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT,@idNotaCredito INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    --> Data Json
    DECLARE @infoNotaCredito VARCHAR(MAX) ,@detalles VARCHAR(MAX) ,@impuestos VARCHAR(MAX) ,@infoAdicional VARCHAR(MAX)

    --> Devolucion
    DECLARE @idFactura INT ,@idCliente INT ,@idPuntoEmision INT 

	-->Facturacion Electronica
	DECLARE @ruc NVARCHAR(100) ,@fechaEmision DATETIME ,@ambiente INT ,@estab VARCHAR(5) ,@ptoEmi VARCHAR(5),@claveAcceso NVARCHAR(50) ,@isAutomatic INT ,@secuencial INT
           ,@idEstadoServicio INT ,@idDocumentoElectronico INT

    --> Contabilidad 
    DECLARE @idEstadoPago INT

    --> Inventario
    DECLARE @serieComprobante VARCHAR(30) ,@CustomerId INT 

    DECLARE @tbComprobante AS TABLE (
		idCliente INT NOT NULL
	   ,idPuntoEmision INT NOT NULL
       ,idFactura INT NOT NULL
       ,idUsuario INT NOT NULL
	   ,codDoc VARCHAR(5) NOT NULL DEFAULT '04'
       ,versionComp VARCHAR(10) NOT NULL DEFAULT '1.1.0'
       ,fechaEmision DATETIME2 NOT NULL
	   ,subTotalSinImpuestos NUMERIC(18,5) NOT NULL 
	   ,totalDescuento NUMERIC(18,5) NOT NULL 
	   ,porcentajeDescuento NUMERIC(18,5) NOT NULL 
	   ,propina NUMERIC(18,5) NOT NULL
	   ,recargo NUMERIC(18,5) NOT NULL 
	   ,transporte NUMERIC(18,5) NOT NULL 
	   ,total NUMERIC(18,5) NOT NULL 
	   ,observacion VARCHAR(500) NULL
	)

		
	DECLARE @tblDetails AS TABLE (
		 orderIndex INT
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
        ,conversion NUMERIC(18,5) NOT NULL
        ,cantidadTransaccion NUMERIC(18,5) NOT NULL
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
		
        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

         --> Data Json 
        SELECT @infoNotaCredito = infoNotaCredito
              ,@detalles        = detalles
              ,@impuestos       = impuestos
              ,@infoAdicional   = infoAdicional
        FROM OPENJSON(@json) WITH 
        (
             infoNotaCredito NVARCHAR(MAX) as json
            ,detalles        NVARCHAR(MAX) as json 
            ,impuestos       NVARCHAR(MAX) as json
            ,infoAdicional   NVARCHAR(MAX) as json
        )

        INSERT INTO @tbComprobante
		      (idCliente,idFactura,idPuntoEmision,idUsuario,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion)
		SELECT idCliente,idFactura,idPuntoEmision,idUsuario,fechaEmision,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,recargo,transporte,total,observacion
		FROM OPENJSON(@infoNotaCredito) WITH
        (
			 idCliente               INT
			,idFactura               INT 
			,idPuntoEmision          INT 
			,idUsuario               INT 
			,fechaEmision            DATETIME2 
			,subTotalSinImpuestos    NUMERIC(18,5) 
			,totalDescuento          NUMERIC(18,5) 
			,porcentajeDescuento     NUMERIC(18,5) 
			,propina                 NUMERIC(18,5) 
			,recargo			     NUMERIC(18,5)
			,transporte              NUMERIC(18,5)
			,total                   NUMERIC(18,5)  
			,observacion             VARCHAR(500)
		) AS js


        INSERT INTO @tblDetails
              (orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion,conversion,precioCostoFraccionado)
		SELECT orderIndex,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,precioUnitario,precioCosto,valorDescuento,porcentajeDescuento,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,llevaInventario,cantidadTransaccion *-1,conversion,precioCostoFraccionado 
		FROM OPENJSON (@detalles) WITH 
        (
			 orderIndex             INT 
			,idArticulo             INT
			,idTarifa               INT
			,idBodega               INT
			,idMedida               INT
			,ice                    NUMERIC(10,5)
			,cantidad               NUMERIC(15,5)
			,precioCosto            NUMERIC(15,5)
			,precioUnitario         NUMERIC(15,5)
			,valorDescuento         NUMERIC(15,5) 
			,precioTotalSinImpuesto NUMERIC(15,5)
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

        --> Recuperando Varaibles 
		SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

		SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE td.codigoSri = '04'

        SELECT TOP 1 @idEstadoServicio = idEstadoServicio FROM FactElect.EstadoServicio WITH (NOLOCK) WHERE codigo = 1

		SELECT TOP 1 @ruc = ruc FROM dbo.Entidad WITH (NOLOCK) WHERE idEntidad = @idEntidad

		SELECT @idFactura      = js.idFactura
			  ,@idCliente      = js.idCliente
			  ,@idPuntoEmision = js.idPuntoEmision
			  ,@fechaEmision   = js.fechaEmision
              ,@idUsuario	   = IIF(js.idUsuario = 0, @idUsuario, js.idUsuario)
			  ,@estab          = es.estab
			  ,@ptoEmi         = pt.ptoEmi
			  ,@ambiente       = pt.ambiente
		FROM @tbComprobante            js 
		INNER JOIN dbo.PuntoEmision    pt WITH (NOLOCK) ON pt.idPuntoEmision    = js.idPuntoEmision
		INNER JOIN Sri.Establecimiento es WITH (NOLOCK) ON es.idEstablecimiento = pt.idEstablecimiento

        SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

        SELECT TOP 1 @secuencial = ultimaSecuencia, @isAutomatic = autoSriAuth  FROM Config.v_ConfigDocumento WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento
	    
        SELECT @serieComprobante   = @estab + '-' + @ptoEmi + '-' +  Helper.F_Auto_Sequential(@secuencial)

		SELECT @claveAcceso = dbo.ufnGeneraClaveAcceso(dbo.AFTDeleteCero(@estab)
														,'04'
														,@ambiente
														,'1'
														,dbo.AFTConvertDate(@fechaEmision)
														,@ruc
														,@estab+@ptoEmi
														,dbo.AFTAutoComplete(@secuencial))
            
        --> onValidate 
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

		IF EXISTS (SELECT 1 FROM Config.v_ConfigDocumento WITH (NOLOCK) WHERE idPuntoEmision = @idPuntoEmision AND codDocSri = '01' AND autoSriAuth = 1)
            BEGIN
                IF NOT EXISTS (SELECT 1 FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad)
                    BEGIN
				        SELECT '0' code,'No tienes configurada ninguna firma electrónica.' AS 'message'
				        RETURN
			        END

                IF (SELECT DATEDIFF(DAY, fechaCaducidad, GETDATE()) FROM dbo.FirmaElectronica WITH (NOLOCK) WHERE idEntidad = @idEntidad) = 0
                    BEGIN
                            SELECT '0' code,'Su firma ha caducado no puede realizar comprobantes electrónicos' AS 'message'
				            RETURN
                    END 
            END 

		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE claveAcceso = @claveAcceso)
			BEGIN
				SELECT '0'code,'Error critico esta clave de acceso ya existe' as 'message',''  as titleSms
				RETURN
			END 

		IF @secuencial IS NULL
			BEGIN
				SELECT '0'code,'No existe una configuracion de secuencial para este Punto de Emision' as 'message','' as titleSms
				RETURN
			END

		IF EXISTS (SELECT 1 FROM dbo.DocumentoElectronico WITH (NOLOCK) WHERE nroDocumento = @secuencial AND idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento)
			BEGIN 
				SELECT '0'code,'La Nora de Credito: ' + CAST(@secuencial as nvarchar) + ' ya se encuentra registrada' as 'message','' as titleSms
				RETURN 
			END 

		IF EXISTS (SELECT 1 FROM Factura WITH (NOLOCK) WHERE idFactura = @idFactura AND notaCredito = 1 )
			BEGIN
				SELECT '0'code,'La factura ya tiene registrada una nota de credito' as 'message','' as titleSms
				RETURN
			END 

		BEGIN TRAN 
			
             --> InfoTributaria 
			INSERT INTO dbo.DocumentoElectronico
                   (idTipoDocumento,idPuntoEmision,versionComp,fechaEmision, claveAcceso, isAutomatic,customerId,nroDocumento,idUsuario,idEstadoServicio,serieComprobante)
			SELECT @idTipoDocumento,idPuntoEmision,versionComp,fechaEmision,@claveAcceso,@isAutomatic,@customerId,@secuencial,@idUsuario,@idEstadoServicio,@serieComprobante
            FROM @tbComprobante

            SET @idDocumentoElectronico = SCOPE_IDENTITY()

            --> InfoNotaCredito
			INSERT INTO NotaCredito 
			      (idCliente,idFactura,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion,idUsuario,idDocumentoElectronico,fechaRegistro)
			SELECT idCliente,idFactura,subTotalSinImpuestos,totalDescuento,porcentajeDescuento,propina,total,observacion,@idUsuario,@idDocumentoElectronico,dbo.ufnGetDateEcuador()
			FROM @tbComprobante

			SET @idNotaCredito = SCOPE_IDENTITY()

			--> Detalles
			INSERT INTO NotaCreditoDetalle 
				   (idNotaCredito,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto)
			SELECT @idNotaCredito,idArticulo,idTarifa,idBodega,idMedida,idTipoIva,ice,cantidad,porcentajeDescuento,valorDescuento,precioUnitario,precioTotalSinImpuesto,codigoPorcentaje,tarifa,valorImpuesto,nota,descripcion,precioCosto
			FROM @tblDetails 
            ORDER BY orderIndex ASC

            -->Impuestos
            INSERT INTO Ventas.NotaCreditoImpuesto
                   (NotaCreditoId,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount)
            SELECT @idNotaCredito,TaxId,TaxPercentId,[Percent],TaxBase,TaxValue,Discount 
            FROM @tbTaxes

            --> informacion Adiciomal
			INSERT INTO dbo.InfoAdicionalDoc(idComprobante,idTipoDocumento,nombre,valor) SELECT @idNotaCredito,@idTipoDocumento,nombre,valor FROM @tblInfoAdicional

            --> Contabilidad
            INSERT INTO Contabilidad.CuentaPorCobrar
                  (idPuntoEmision,idCliente,codDoc,fechaEmision, idEstadoPago,idDocumento,secuencial ,serieComprobante,importeTotal, idEntidad, idUsuario,fechaRegistro)
	        SELECT idPuntoEmision,idCliente,codDoc,fechaEmision,@idEstadoPago,@idNotaCredito,@secuencial,@serieComprobante,total,@idEntidad,@idUsuario,dbo.ufnGetDateEcuador()
            FROM @tbComprobante

            --> Actualizar Ulitmo Secuencial
            UPDATE ConfiguracionDocumento SET ultimaSecuencia = ultimaSecuencia + 1 WHERE idPuntoEmision = @idPuntoEmision AND idTipoDocumento = @idTipoDocumento

            -->Actualizar Estado Fac.
            UPDATE Factura SET notaCredito = 1 WHERE idFactura = @idFactura

			IF EXISTS (SELECT 1 FROM Config.v_Sistema_Inventario WITH (NOLOCK) WHERE idEntidad = @idEntidad AND inventory = 'SI')
				BEGIN

                    IF EXISTS (SELECT 1 FROM @tblDetails WHERE llevaInventario = 1)
					    BEGIN 
                            
                            DECLARE @idTipoTransaccion  INT ,@idTipoDocumentoIv INT ,@idTransaccion INT

                            SELECT TOP 1 @idTipoDocumentoIv = idTipoDocumento FROM Inventario.TipoDocumento WITH (NOLOCK) WHERE codigo = 'NC'

                            SELECT TOP 1 @idTipoTransaccion = idTipoTransaccion FROM Inventario.TipoTransaccion WITH (NOLOCK) WHERE codigo = 'S'

                            --> Transaccion
                            INSERT INTO Inventario.Transaccion
                                   (idTipoTransaccion,fechaEmision,idTipoDocumento,idDocumento,CustomerId,idUsuario,idEntidad,serieComprobante)
                            SELECT @idTipoTransaccion,fechaEmision,@idTipoDocumentoIv,@idNotaCredito,@customerId,@idUsuario,@idEntidad,@serieComprobante 
                            FROM @tbComprobante 

                            SET @idTransaccion = SCOPE_IDENTITY()

                            -->Detalles
                            INSERT INTO Inventario.TransaccionDetalle WITH (ROWLOCK)
                                   (idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,total)
			                SELECT @idTransaccion,idArticulo,idBodega,idMedida,idTarifa,cantidad,conversion,cantidadTransaccion,precioUnitario,precioCosto,precioCostoFraccionado,precioTotalSinImpuesto 
                            FROM @tblDetails 
                            WHERE llevaInventario = 1
                            ORDER BY orderIndex ASC

                            EXEC dbo.Transaccion_Handler_Init @idTransaccion
					    END
				END

		COMMIT TRAN 
		SELECT '1'code,'Registrado Exitosamente' as 'message','' as titleSms
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END
		
		INSERT INTO ErroresSistema
			    (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/NotaCredito/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0'code,'Info: Error en el procedimiento' as 'message', 'Nota de Credito' as titleSms
	END CATCH 
    
END
