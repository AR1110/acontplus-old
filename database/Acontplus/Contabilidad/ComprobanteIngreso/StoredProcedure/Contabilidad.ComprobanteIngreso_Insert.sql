USE [AcontPlus]
GO
/****** Object:  StoredProcedure [GestFinanc].[ComprobanteIngreso_Insert]    Script Date: 12/7/2022 9:05:27 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Alexis Ramirez
-- Create date: 2022-18-01
-- Description:	SP para registra los comprobantes de ingreso con sus cobros y detalles 
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteIngreso_Insert @userRoleId INT ,@json VARCHAR(MAX) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT ,@payload VARCHAR(MAX) 

    --> Data Json
	DECLARE @comprobante NVARCHAR(MAX) ,@cobros NVARCHAR(MAX) ,@cobroDetalle NVARCHAR(MAX) ,@historial NVARCHAR(MAX) ,@cuenta VARCHAR(MAX) ,@cuota VARCHAR(MAX)

    --> Comprobante
	DECLARE @idComprobanteIngreso INT ,@codEstab VARCHAR(50) ,@secuencial INT ,@idCaja INT ,@idControlCaja INT ,@idEstablecimiento INT ,@idCliente INT, @CustomerId INT

	DECLARE @documento AS TABLE(
		 idCliente INT NOT NULL
		,total NUMERIC(18,5) NOT NULL
		,abono NUMERIC(18,5) NOT NULL
		,codEstab VARCHAR(20) NOT NULL
        ,observacion VARCHAR(300) NULL
	)

	DECLARE @payment AS TABLE (
		 idEntidadFinanciera INT NOT NULL
		,idSubEntidadFinanciera INT NOT NULL
		,idBanco INT NULL
		,idCuentaPorCobrar INT NULL
		,fechaEmision DATETIME2 NOT NULL
		,valor NUMERIC (18,5) NOT NULL
		,abono NUMERIC (18,5) NOT NULL
		,posfechado BIT NOT NULL
		,secuencial INT NOT NULL
		,cobro BIT NOT NULL
		,infoCobro VARCHAR(MAX) NULL
		,controlCaja BIT NOT NULL
	)


	DECLARE @history AS TABLE (
		 idCuentaPorCobrar INT NOT NULL
        ,secuencial INT NOT NULL
		,saldo NUMERIC(18,5) NOT NULL
        ,abono NUMERIC(18,5) NOT NULL
        ,mora NUMERIC(15,5) NOT NULL
		,diasMora INT NOT NULL
	)

    DECLARE @paymentDetail AS TABLE(
		 idCuotaPorCobrar INT NOT NULL
		,saldo NUMERIC(15,5) NOT NULL
        ,abono NUMERIC(15,5) NOT NULL
		,interes NUMERIC(15,5) NOT NULL
		,mora NUMERIC(15,5) NOT NULL
		,diasMora INT NOT NULL
		,secuencial INT NOT NULL
	)

    DECLARE @tbCuenta AS TABLE(
        idCuentaPorCobrar INT NOT NULL UNIQUE
       ,idEstadoPago INT NOT NULL
       ,abono NUMERIC(18,5) NOT NULL
       ,mora NUMERIC(18,5) NOT NULL
       ,diasMora INT NOT NULL
    )

    DECLARE @tbCuota AS TABLE(
        idCuotaPorCobrar INT NOT NULL UNIQUE
       ,idEstadoPago INT NOT NULL
       ,abono NUMERIC(18,5) NOT NULL
       ,mora NUMERIC(18,5) NOT NULL
       ,diasMora INT NOT NULL
    )

	BEGIN TRY 
        --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

  	    --> obtener Datos de los Json
		SELECT @comprobante  = comprobante
              ,@cobros       = cobros
              ,@cobroDetalle = cobroDetalle
              ,@historial    = historial
              ,@cuenta       = cuenta
              ,@cuota        = cuota
        FROM OPENJSON(@json) WITH 
        (
            comprobante  NVARCHAR(MAX) AS JSON
		   ,cobros       NVARCHAR(MAX) AS JSON
		   ,cobroDetalle NVARCHAR(MAX) AS JSON
		   ,historial    NVARCHAR(MAX) AS JSON
           ,cuenta       NVARCHAR(MAX) AS JSON
           ,cuota        NVARCHAR(MAX) AS JSON

		) as dt 

        INSERT INTO @documento
              (idCliente,total,abono,codEstab,observacion)
		SELECT idCliente,total,abono,codEstab,observacion
		FROM OPENJSON(@comprobante) WITH 
        (
             idCliente   INT          
		    ,total       NUMERIC(18,5) 
		    ,abono       NUMERIC(18,5) 
		    ,codEstab    VARCHAR(20) 
            ,observacion VARCHAR(300)
		)
		
		INSERT INTO @payment
			  (idSubEntidadFinanciera,idEntidadFinanciera,idBanco,idCuentaPorCobrar,fechaEmision,valor,posfechado,secuencial,cobro,infoCobro,abono,controlCaja)
		SELECT idSubEntidadFinanciera,idEntidadFinanciera,idBanco,idCuentaPorCobrar,fechaEmision,valor,posfechado,secuencial,cobro,infoCobro,abono,controlCaja
		FROM OPENJSON(@cobros)WITH 
        (     
             idSubEntidadFinanciera INT 
		    ,idEntidadFinanciera    INT 
		    ,idBanco                INT 
		    ,idCuentaBancaria       INT 
		    ,idTipoDocumento        INT 
		    ,idCuentaPorCobrar      INT '$.idComprobante' 
		    ,fechaEmision           DATETIME2 
		    ,valor                  NUMERIC(15,5)
		    ,posfechado             BIT 
            ,cobro                  BIT
		    ,secuencial             INT 
		    ,infoCobro              NVARCHAR(MAX)
		    ,abono                  NUMERIC(15,5) 
		    ,controlCaja            BIT 
        )
		AS dt

		INSERT INTO @paymentDetail
              (idCuotaPorCobrar,saldo,abono,interes,diasMora,mora,secuencial)
	    SELECT idCuotaPorCobrar,saldo,abono,interes,diasMora,mora,secuencial 
        FROM OPENJSON(@cobroDetalle) WITH 
        (                          
             idCuotaPorCobrar INT           
		    ,saldo            NUMERIC(15,5) 
		    ,abono            NUMERIC(15,5) 
		    ,interes          NUMERIC(15,5) 
		    ,diasMora         INT           
		    ,mora             NUMERIC(15,5) 
		    ,secuencial       INT          

        ) AS dt
		

		INSERT INTO @history
              (idCuentaPorCobrar,saldo,abono,secuencial,diasMora,mora)
		SELECT idCuentaPorCobrar,saldo,abono,secuencial,diasMora,mora 
        FROM OPENJSON(@historial) WITH 
        (                    
             idCuentaPorCobrar INT           
            ,saldo             NUMERIC(18,5) 
            ,abono             NUMERIC(18,5) 
            ,secuencial        INT
            ,mora              NUMERIC(18,5)
            ,diasMora          INT

        ) AS dt

        INSERT INTO @tbCuenta
              (idCuentaPorCobrar,idEstadoPago,abono,mora,diasMora)
        SELECT idCuentaPorCobrar,idEstadoPago,abono,mora,diasMora
        FROM OPENJSON(@cuenta) WITH 
        (
            idCuentaPorCobrar INT
           ,idEstadoPago      INT
           ,abono             NUMERIC(18,5)
           ,mora              NUMERIC(18,5)
           ,diasMora          INT
        )

        INSERT INTO @tbCuota
              (idCuotaPorCobrar,idEstadoPago,abono,mora,diasMora)
        SELECT idCuotaPorCobrar,idEstadoPago,abono,mora,diasMora
        FROM OPENJSON(@cuota) WITH 
        (
            idCuotaPorCobrar INT
           ,idEstadoPago     INT
           ,abono            NUMERIC(18,5)
           ,mora             NUMERIC(18,5)
           ,diasMora         INT
        )

		--> Obteniendo variables 
		SELECT TOP 1 @codEstab = codEstab ,@idCliente = idCliente FROM @documento 

        SELECT TOP 1 @idEstablecimiento = idEstablecimiento FROM Sri.Establecimiento WITH (NOLOCK) WHERE codEstab = @codEstab

        SELECT TOP 1 @CustomerId = ISNULL(CustomerId,0) FROM dbo.Cliente WITH (NOLOCK) WHERE idCliente = @idCliente

		SELECT @secuencial = COUNT(*)+1 FROM dbo.ComprobanteIngreso WITH(NOLOCK) WHERE idEstablecimiento = @idEstablecimiento

		SELECT TOP 1 @idCaja =  idCaja FROM AsignacionCaja WITH (NOLOCK) WHERE idUsuario = @idUsuario AND idEntidad = @idEntidad

		SELECT TOP 1 @idControlCaja = idControlCaja FROM ControlCaja WITH (NOLOCK) WHERE idCaja = @idCaja AND estado = 1

		--> Validacion de datos
        IF NOT EXISTS(SELECT 1 FROM @documento)
			BEGIN
				SELECT '0'code,'Error en la informacion del comprobante de ingreso ' as 'message'
				RETURN 
			END 

		IF NOT EXISTS(SELECT 1 FROM @payment)
			BEGIN
				SELECT '0'code,'Error en la informacion de los pagos ' as 'message'
				RETURN 
			END

		IF NOT EXISTS(SELECT 1 FROM @paymentDetail)
			BEGIN
				SELECT '0'code,'Error en la informacion en los detalles de los pagos' as 'message'
				RETURN 
			END

		IF NOT EXISTS(SELECT 1 FROM @history)
			BEGIN
				SELECT '0'code,'Error en la informacion del historial del pago' as 'message'
				RETURN 
			END

        IF NOT EXISTS(SELECT 1 FROM @tbCuenta)  
            BEGIN
                SELECT '0'code,'Error en la informacion de las cuentas' as 'message'
				RETURN 
            END
            
         IF NOT EXISTS(SELECT 1 FROM @tbCuota)  
            BEGIN
                SELECT '0'code,'Error en la informacion de las cuotas' as 'message'
				RETURN 
            END

		IF @secuencial IS NULL
			BEGIN
				SELECT '0' code,'Error en el secuencial de documento' as 'message'
				RETURN
			END 

		IF EXISTS (SELECT 1 FROM dbo.ComprobanteIngreso WHERE idEstablecimiento = @idEstablecimiento AND nroDocumento = @secuencial)
			BEGIN
				SELECT '0' code,'Este secuencial ya se encuentra registrado' as 'message'
				RETURN
			END

		IF @idCaja IS NULL
			BEGIN
				SELECT '0' code,'No tienes asginada ninguna caja no puedes realizar comprobantes' as 'message'
				RETURN
			END 

		IF @idControlCaja IS NULL
			BEGIN
				SELECT '0' code,'Para realizar gestiones financieras debes aperturar caja obligatoriamente' as 'message'
				RETURN
			END 

		BEGIN TRAN 
            --> Comprobante
			INSERT INTO dbo.ComprobanteIngreso 
				   (CustomerId,total,abono,observacion,nroDocumento,idUsuario,idEntidad,fechaRegistro,idControlCaja,idEstablecimiento)
		    SELECT @CustomerId,total,abono,observacion,@secuencial,@idUsuario,@idEntidad,dbo.ufnGetDateEcuador(),@idControlCaja,@idEstablecimiento
			FROM @documento

			SET @idComprobanteIngreso = @@IDENTITY 

            --> Cobros
			INSERT INTO dbo.Cobro WITH(ROWLOCK)
				   (idComprobanteIngreso,idEntidadFinanciera,idSubEntidadFinanciera,idBanco,idCuentaPorCobrar,fechaEmision,valor,abono,posfechado,secuencial,cobro,infoCobro,controlCaja)
			SELECT @idComprobanteIngreso,idEntidadFinanciera,idSubEntidadFinanciera,idBanco,idCuentaPorCobrar,fechaEmision,valor,abono,posfechado,secuencial,cobro,infoCobro,controlCaja
			FROM @payment

            --> Detalle de abono por cuotas
			INSERT INTO dbo.CobroDetalle 
                  (idCobro,idCuotaPorCobrar,saldo,abono,interes,diasMora,mora)
			SELECT idCobro,idCuotaPorCobrar,saldo,dt.abono,interes,diasMora,mora 
            FROM @paymentDetail dt 
            INNER JOIN dbo.Cobro c WITH (NOLOCK) ON c.secuencial = dt.secuencial 
            WHERE c.idComprobanteIngreso = @idComprobanteIngreso
            ORDER BY c.secuencial ASC

            --> Detalle de abono por cuentas 
			INSERT INTO Contabilidad.Historial_Cobro 
                   (idComprobanteIngreso,idCuentaPorCobrar,idCobro,saldo,abono,diasMora,mora) 
			SELECT @idComprobanteIngreso,h.idCuentaPorCobrar,idCobro,h.saldo,h.abono,diasMora,mora
            FROM @history h 
            INNER JOIN dbo.Cobro c WITH (NOLOCK) ON c.secuencial = h.secuencial 
            WHERE c.idComprobanteIngreso = @idComprobanteIngreso
            ORDER BY c.secuencial ASC

            --> Edicion de estado de las cuentas aplicadas por cobro tipo Documento (Devoluciones,Retenciones,Anticipos)
            IF EXISTS (SELECT 1 FROM @payment WHERE idCuentaPorCobrar > 0)
                BEGIN
                    DECLARE @idEstadoPago INT

                    SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'APL'

                    UPDATE Contabilidad.CuentaPorCobrar 
                       SET idEstadoPago = @idEstadoPago
                    WHERE idCuentaPorCobrar IN (SELECT idCuentaPorCobrar FROM @payment WHERE idCuentaPorCobrar > 0)
                END 

		    --> Editar Estados de las Cuenta
            UPDATE cc SET
                   cc.idEstadoPago = tc.idEstadoPago
                  ,cc.abono        = cc.abono    + tc.abono
                  ,cc.diasMora     = cc.diasMora + tc.diasMora
                  ,cc.mora         = cc.mora     + tc.mora
            FROM Contabilidad.CuentaPorCobrar cc WITH (ROWLOCK)
            INNER JOIN @tbCuenta              tc ON tc.idCuentaPorCobrar = cc.idCuentaPorCobrar

            --> Editar Estados de la cuota
            UPDATE cx SET 
                   cx.idEstadoPago = tc.idEstadoPago
                  ,cx.abono        = cx.abono    + tc.abono
                  ,cx.diasMora     = cx.diasMora + tc.diasMora
                  ,cx.mora         = cx.mora     + tc.mora
            FROM Contabilidad.CuotaPorCobrar cx WITH (ROWLOCK)
            INNER JOIN @tbCuota              tc ON tc.idCuotaPorCobrar = cx.idCuotaPorCobrar
		
		COMMIT TRAN 
		SELECT '1' code ,'Registrado Correctamente' as 'message', payload = @payload
	END TRY

	BEGIN CATCH 
		IF @@TRANCOUNT > 0 
		    BEGIN
			    ROLLBACK TRAN; 
		    END

        INSERT INTO ErroresSistema
		       (token,method,errorNumber,errorSeverity ,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ComprobanteIngreso/Insert',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario
	
        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
    END CATCH 

END
