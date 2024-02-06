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

	DECLARE @comprobante NVARCHAR(MAX)
	DECLARE @cobros NVARCHAR(MAX)
	DECLARE @cobroDetalle NVARCHAR(MAX)
	DECLARE @historial NVARCHAR(MAX)

	DECLARE @idComprobanteIngreso AS INT 
	DECLARE @codEstab AS VARCHAR(50)
	DECLARE @idEntidad INT
	DECLARE @idUsuario INT
	DECLARE @idTipoDocumento INT
	DECLARE @secuencial AS INT 
	DECLARE @idCaja INT
	DECLARE @idControlCaja INT 
	DECLARE @payload VARCHAR(MAX)
	DECLARE @idCuotaPorCobrar INT 
	DECLARE @idCuentaPorCobrar AS INT

	DECLARE @documento AS TABLE(
		 idTipoPersona INT NOT NULL
		,idCliente INT NOT NULL
		,total NUMERIC(18,5) NOT NULL
		,abono NUMERIC(18,5) NOT NULL
		,codEstab VARCHAR(20) NOT NULL
		,codTipoPersona VARCHAR(5) DEFAULT 'CL' 
		,nroIdentificacion VARCHAR(20) NOT NULL
		,nombreFiscal VARCHAR(180) NOT NULL
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
		 idCuentaPorCobrar INT NOT NULL UNIQUE
		,saldo NUMERIC(18,5) NOT NULL
        ,abono NUMERIC(18,5) NOT NULL
		,mora NUMERIC(15,5) NOT NULL
		,diasMora INT NOT NULL
	)

	BEGIN TRY 

  	    --====================================obtener Datos de los Json============================================
		SELECT @comprobante  = comprobante
              ,@cobros       = cobros
              ,@cobroDetalle = cobroDetalle
              ,@historial    = historial 
        FROM OPENJSON(@json) WITH 
        (
            comprobante  NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS '$.comprobante'   AS JSON
		   ,cobros       NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS '$.cobros'        AS JSON
		   ,cobroDetalle NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS '$.cobroDetalle'  AS JSON
		   ,historial    NVARCHAR(MAX) COLLATE SQL_Latin1_General_CP1_CI_AS '$.historial'     AS JSON

		) as dt 


		INSERT INTO @documento(idTipoPersona,idCliente,total,abono,codEstab,nroIdentificacion,nombreFiscal)
		SELECT idTipoPersona = (SELECT TOP 1 idTipoPersona FROM TipoPersona tp WITH (NOLOCK) WHERE tp.codigo = 'CL')
		     ,idCliente,total,abono,codEstab,nroIdentificacion,nombreFiscal
		FROM OPENJSON(@comprobante)
		WITH (idCliente                 INT '$.idCliente'
			 ,total           NUMERIC(18,5) '$.total'
			 ,abono           NUMERIC(18,5) '$.abono'
			 ,codEstab          VARCHAR(20) '$.codEstab'
			 ,nroIdentificacion VARCHAR(20) '$.numeroIdentificacion'
			 ,nombreFiscal     VARCHAR(200) '$.nombreFiscal'
			 )
		AS dt 
		
		INSERT INTO @payment
			(idSubEntidadFinanciera
			,idEntidadFinanciera
			,idBanco
			,idTipoDocumento
			,idComprobante
			,fechaEmision
			,valor
			,posfechado
			,secuencial
			,cobro
			,infoCobro
			,abono
			,controlCaja)
		SELECT 
			 CASE WHEN  idSubEntidadFinanciera = 0 THEN NULL ELSE idSubEntidadFinanciera END 
			,idEntidadFinanciera
			,CASE WHEN idBanco = 0 THEN NULL ELSE idBanco END
			,CASE WHEN idTipoDocumento = 0 THEN NULL ELSE idTipoDocumento END
			,CASE WHEN idComprobante = 0 THEN NULL ELSE idComprobante END
			,fechaEmision
			,valor
			,posfechado
			,secuencial 
			,CASE WHEN posfechado = 1 THEN  0 ELSE 1 END 
			,infoCobro
			,abono
			,controlCaja
		FROM OPENJSON(@cobros)	
		WITH (idSubEntidadFinanciera INT '$.idSubEntidadFinanciera'
			 ,idEntidadFinanciera    INT '$.idEntidadFinanciera'
			 ,idBanco                INT '$.idBanco'
			 ,idCuentaBancaria       INT '$.idCuentaBancaria'
			 ,idTipoDocumento        INT '$.idTipoDocumento'
			 ,idComprobante          INT '$.idComprobante'
			 ,fechaEmision     DATETIME2 '$.fechaEmision'
			 ,valor        NUMERIC(15,5) '$.valor' 
			 ,posfechado             BIT '$.posfechado'
			 ,secuencial             INT '$.secuencial'
			 ,infoCobro    NVARCHAR(MAX) '$.infoCobro'
			 ,abono        NUMERIC(15,5) '$.abono'
			 ,controlCaja            BIT '$.controlCaja')
		AS dt

		INSERT INTO @paymentDetail
              (idCuotaPorCobrar,saldo,abono,interes,diasMora,mora,secuencial)
	    SELECT idCuotaPorCobrar,saldo,abono,interes,diasMora,mora,secuencial 
        FROM OPENJSON(@cobroDetalle) WITH 
        (                          
             idCuotaPorCobrar INT           '$.idCuotaPorCobrar'
		    ,saldo            NUMERIC(15,5) '$.saldo'
		    ,abono            NUMERIC(15,5) '$.abono'
		    ,interes          NUMERIC(15,5) '$.interes'
		    ,diasMora         INT           '$.diasMora'
		    ,mora             NUMERIC(15,5) '$.mora'
		    ,secuencial       INT           '$.secuencial'

        ) AS dt
		

		INSERT INTO @history
              (idCuentaPorCobrar,saldo,abono,diasMora,mora)
		SELECT idCuentaPorCobrar,saldo,abono,diasMora,mora 
        FROM OPENJSON(@historial) WITH 
        (                    
             idCuentaPorCobrar INT           '$.idCuentaPorCobrar'
            ,saldo             NUMERIC(18,5) '$.saldo'
            ,abono             NUMERIC(18,5) '$.abono'
            ,diasMora          INT           '$.diasMora'
            ,mora              NUMERIC(15,5) '$.mora'

        ) AS dt

		
		--======================================Obteniendo variables ============================================================

		SELECT @codEstab = codEstab FROM @documento 

		SELECT @secuencial = COUNT(*)+1 FROM dbo.ComprobanteIngreso WITH(NOLOCK) WHERE codEstab = @codEstab

		SELECT TOP 1 @idEntidad = idEntidad,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @idUsuarioRol

		SELECT TOP 1 @idTipoDocumento = td.idTipoDocumento FROM TipoDocumento td WITH (NOLOCK) WHERE td.codigo = 'CI'

		SELECT TOP 1 @idCaja =  idCaja FROM AsignacionCaja WITH (NOLOCK) WHERE idUsuario = @idUsuario AND idEntidad = @idEntidad

		SELECT TOP 1 @idControlCaja = idControlCaja FROM ControlCaja WITH (NOLOCK) WHERE idCaja = @idCaja AND estado = 1

		--======================================Validacion de datos============================================================
		IF (SELECT COUNT(*) FROM @documento) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion del comprobante de ingreso: '+ISNULL(@comprobante,'Sin Dato') as 'message'
				RETURN 
			END 

		IF (SELECT COUNT(*) FROM @payment) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion de los pagos: '+ISNULL(@cobros,'Sin Dato') as 'message'
				RETURN 
			END

		IF (SELECT COUNT(*) FROM @paymentDetail) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion en los detalles de los pagos: '+ISNULL(@cobroDetalle,'Sin Dato') as 'message'
				RETURN 
			END

		IF (SELECT COUNT(*) FROM @history) = 0
			BEGIN
				SELECT '0'code,'Error en la informacion del historial del pago : '+ISNULL(@historial,'Sin Dato') as 'message'
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
				   (idTipoDocumento,idPersona,idTipoPersona,total,abono,nroDocumento,idUsuario,idEntidad,codEstab,fechaRegistro,idControlCaja,codTipoPersona,nroIdentificacion,nombreFiscal)
		    SELECT @idTipoDocumento,idCliente,idTipoPersona,total,abono,@secuencial,@idUsuario,@idEntidad,codEstab,dbo.ufnGetDateEcuador(),@idControlCaja,codTipoPersona,nroIdentificacion,nombreFiscal
			FROM @documento

			SET @idComprobanteIngreso = @@IDENTITY 

			INSERT INTO dbo.Cobro WITH(ROWLOCK)
				   (idComprobanteIngreso,idEntidadFinanciera,idSubEntidadFinanciera,idBanco,idTipoDocumento,idComprobante,fechaEmision,valor,abono,posfechado,secuencial,cobro,infoCobro,controlCaja)
			SELECT @idComprobanteIngreso,idEntidadFinanciera,idSubEntidadFinanciera,idBanco,idTipoDocumento,idComprobante,fechaEmision,valor,abono,posfechado,secuencial,cobro,infoCobro,controlCaja
			FROM @payment

			INSERT INTO dbo.CobroDetalle WITH(ROWLOCK) 
                  (idCobro,idCuotaPorCobrar,saldo,abono,interes,diasMora,mora)
			SELECT idCobro,idCuotaPorCobrar,saldo,dt.abono,interes,diasMora,mora 
            FROM @paymentDetail dt 
            INNER JOIN dbo.Cobro c WITH (NOLOCK) ON c.secuencial = dt.secuencial 
            WHERE c.idComprobanteIngreso = @idComprobanteIngreso

			INSERT INTO Contabilidad.Historial_Cobro WITH(ROWLOCK)
                   (idComprobanteIngreso,idCuentaPorCobrar,saldo,abono,diasMora,mora) 
			SELECT @idComprobanteIngreso,idCuentaPorCobrar,saldo,abono,diasMora,mora FROM @history

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
