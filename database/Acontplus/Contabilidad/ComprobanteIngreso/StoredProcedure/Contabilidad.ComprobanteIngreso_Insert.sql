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
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteIngreso_Insert @idUsuarioRol INT ,@json VARCHAR(MAX) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> GLOBAL
	DECLARE @idUsuario INT,@idEntidad INT,@idFactura INT ,@payload VARCHAR(MAX) ,@idTipoDocumento INT

    --> Data Json
	DECLARE @comprobante NVARCHAR(MAX) ,@cobros NVARCHAR(MAX) ,@cobroDetalle NVARCHAR(MAX) ,@historial NVARCHAR(MAX)

    --> Comprobante
	DECLARE @idComprobanteIngreso INT ,@codEstab VARCHAR(50) ,@secuencial INT ,@idCaja INT ,@idControlCaja INT ,@idCuotaPorCobrar INT ,@idCuentaPorCobrar INT
           ,@idTipoPersona INT

	DECLARE @documento AS TABLE(
		 idCliente INT NOT NULL
		,total NUMERIC(18,5) NOT NULL
		,abono NUMERIC(18,5) NOT NULL
		,codEstab VARCHAR(20) NOT NULL
		,codTipoPersona VARCHAR(5) DEFAULT 'CL' 
		,nroIdentificacion VARCHAR(20) NOT NULL
		,nombreFiscal VARCHAR(180) NOT NULL
        ,observacion VARCHAR(300) NULL
	)

	DECLARE @payment AS TABLE (
		 idEntidadFinanciera INT NOT NULL
		,idSubEntidadFinanciera INT NOT NULL
		,idBanco INT NULL
		,idTipoDocumento INT NULL 
		,idComprobante INT NULL
		,fechaEmision DATETIME2 NOT NULL
		,valor NUMERIC (18,5) NOT NULL
		,abono NUMERIC (18,5) NOT NULL
		,posfechado BIT NOT NULL
		,secuencial INT NOT NULL
		,cobro BIT NOT NULL
		,infoCobro VARCHAR(MAX) NULL
		,controlCaja BIT NOT NULL
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

	DECLARE @history AS TABLE (
		 idCuentaPorCobrar INT NOT NULL
        ,secuencial INT NOT NULL
		,saldo NUMERIC(18,5) NOT NULL
        ,abono NUMERIC(18,5) NOT NULL
		,mora NUMERIC(18,5) NOT NULL
		,diasMora INT NOT NULL
	)

	BEGIN TRY 
         --> Variables Globales
        SELECT TOP 1 @idEntidad = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

  	    --> obtener Datos de los Json
		SELECT @comprobante  = comprobante
              ,@cobros       = cobros
              ,@cobroDetalle = cobroDetalle
              ,@historial    = historial 
        FROM OPENJSON(@json) WITH 
        (
            comprobante  NVARCHAR(MAX) AS JSON
		   ,cobros       NVARCHAR(MAX) AS JSON
		   ,cobroDetalle NVARCHAR(MAX) AS JSON
		   ,historial    NVARCHAR(MAX) AS JSON

		) as dt 

        INSERT INTO @documento
              (idCliente,total,abono,codEstab,nroIdentificacion,nombreFiscal,observacion)
		SELECT idCliente,total,abono,codEstab,nroIdentificacion,nombreFiscal,observacion
		FROM OPENJSON(@comprobante) WITH 
        (
             idCliente         INT          
		    ,total             NUMERIC(18,5) 
		    ,abono             NUMERIC(18,5) 
		    ,codEstab          VARCHAR(20) 
		    ,nroIdentificacion VARCHAR(20)  '$.numeroIdentificacion'
		    ,nombreFiscal      VARCHAR(200)
            ,observacion       VARCHAR(300)
		)
		
		INSERT INTO @payment
			  (idSubEntidadFinanciera,idEntidadFinanciera,idBanco,idTipoDocumento,idComprobante,fechaEmision,valor,posfechado,secuencial,cobro,infoCobro,abono,controlCaja)
		SELECT idSubEntidadFinanciera,idEntidadFinanciera,idBanco,idTipoDocumento,idComprobante,fechaEmision,valor,posfechado,secuencial,cobro,infoCobro,abono,controlCaja
		FROM OPENJSON(@cobros)WITH 
        (     
             idSubEntidadFinanciera INT 
		    ,idEntidadFinanciera    INT 
		    ,idBanco                INT 
		    ,idCuentaBancaria       INT 
		    ,idTipoDocumento        INT 
		    ,idComprobante          INT 
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
              (idCuentaPorCobrar,saldo,abono,diasMora,mora,secuencial)
		SELECT idCuentaPorCobrar,saldo,abono,diasMora,mora,secuencial 
        FROM OPENJSON(@historial) WITH 
        (                    
             idCuentaPorCobrar INT           
            ,saldo             NUMERIC(18,5) 
            ,abono             NUMERIC(18,5) 
            ,diasMora          INT           
            ,mora              NUMERIC(15,5) 
            ,secuencial        INT

        ) AS dt

		--======================================Obteniendo variables ============================================================

		SELECT @codEstab = codEstab FROM @documento 

        SELECT TOP 1 @idTipoPersona =  idTipoPersona FROM TipoPersona WITH (NOLOCK) WHERE codigo = 'CL'

		SELECT @secuencial = COUNT(*)+1 FROM dbo.ComprobanteIngreso WITH(NOLOCK) WHERE codEstab = @codEstab

		SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE td.codigo = 'CI'

		SELECT TOP 1 @idCaja =  idCaja FROM AsignacionCaja WITH (NOLOCK) WHERE idUsuario = @idUsuario AND idEntidad = @idEntidad

		SELECT TOP 1 @idControlCaja = idControlCaja FROM ControlCaja WITH (NOLOCK) WHERE idCaja = @idCaja AND estado = 1

		--======================================Validacion de datos============================================================

        IF (SELECT COUNT(*) FROM @documento) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion del comprobante de ingreso ' as 'message'
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @payment) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion de los pagos ' as 'message'
				RETURN 
			END

		IF (SELECT COUNT(*) FROM @paymentDetail) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion en los detalles de los pagos' as 'message'
				RETURN 
			END

		IF (SELECT COUNT(*) FROM @history) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion del historial del pago' as 'message'
				RETURN 
			END

		IF @secuencial IS NULL
			BEGIN
				SELECT '0' code,'Error en el secuencial de documento' as 'message'
				RETURN
			END 

		IF EXISTS (SELECT 1 FROM dbo.ComprobanteIngreso WHERE codEstab = @codEstab AND nroDocumento = @secuencial)
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
			INSERT INTO dbo.ComprobanteIngreso WITH(ROWLOCK)
				   (idTipoDocumento,idPersona,idTipoPersona,total,abono,nroDocumento,idUsuario,idEntidad,codEstab,fechaRegistro,idControlCaja,codTipoPersona,nroIdentificacion,nombreFiscal,observacion)
		    SELECT @idTipoDocumento,idCliente,@idTipoPersona,total,abono,@secuencial,@idUsuario,@idEntidad,codEstab,dbo.ufnGetDateEcuador(),@idControlCaja,codTipoPersona,nroIdentificacion,nombreFiscal,observacion
			FROM @documento

			SET @idComprobanteIngreso = @@IDENTITY 

			INSERT INTO dbo.Cobro WITH(ROWLOCK)
				   (idComprobanteIngreso,idEntidadFinanciera,idSubEntidadFinanciera,idBanco,idTipoDocumento,idComprobante,fechaEmision,valor,abono,posfechado,secuencial,cobro,infoCobro,controlCaja)
			SELECT @idComprobanteIngreso,idEntidadFinanciera,idSubEntidadFinanciera,idBanco,idTipoDocumento,idComprobante,fechaEmision,valor,abono,posfechado,secuencial,cobro,infoCobro,controlCaja
			FROM @payment

			INSERT INTO dbo.CobroDetalle WITH (ROWLOCK) 
                  (idCobro,idCuotaPorCobrar,saldo,abono,interes,diasMora,mora)
			SELECT idCobro,idCuotaPorCobrar,saldo,dt.abono,interes,diasMora,mora 
            FROM @paymentDetail dt 
            INNER JOIN dbo.Cobro c WITH (NOLOCK) ON c.secuencial = dt.secuencial 
            WHERE c.idComprobanteIngreso = @idComprobanteIngreso
            ORDER BY c.secuencial ASC

			INSERT INTO Contabilidad.Historial_Cobro WITH (ROWLOCK)
                   (idComprobanteIngreso,idCuentaPorCobrar,idCobro,saldo,abono,diasMora,mora) 
			SELECT @idComprobanteIngreso,idCuentaPorCobrar,idCobro,saldo,h.abono,diasMora,mora 
            FROM @history h 
            INNER JOIN dbo.Cobro c WITH (NOLOCK) ON c.secuencial = h.secuencial 
            WHERE c.idComprobanteIngreso = @idComprobanteIngreso
            ORDER BY c.secuencial ASC

			DECLARE cursor_Cuotas CURSOR LOCAL FOR
			SELECT idCuotaPorCobrar FROM @paymentDetail
				
				OPEN cursor_Cuotas
				FETCH NEXT FROM cursor_Cuotas INTO @idCuotaPorCobrar
					WHILE @@FETCH_STATUS = 0
						BEGIN
							EXEC Contabilidad.CuotaPorCobrar_Update_Status @idCuotaPorCobrar
							FETCH NEXT FROM cursor_Cuotas INTO @idCuotaPorCobrar
						END
				CLOSE cursor_Cuotas

			DEALLOCATE cursor_Cuotas  


			DECLARE cursor_documentos CURSOR LOCAL FOR
			SELECT hi.idCuentaPorCobrar FROM @history hi 
				
				OPEN cursor_documentos
				FETCH NEXT FROM cursor_documentos INTO @idCuentaPorCobrar
					WHILE @@FETCH_STATUS = 0
						BEGIN
							EXEC Contabilidad.CuentaPorCobrar_Update_Status @idCuentaPorCobrar
							FETCH NEXT FROM cursor_documentos INTO @idCuentaPorCobrar
						END
				CLOSE cursor_documentos

			DEALLOCATE cursor_documentos  
		
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
