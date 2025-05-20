USE [AcontPlus]
GO 
-- ================================================
-- Template generated from Template Explorer using:
-- Create Procedure (New Menu).SQL
--
-- Use the Specify Values for Template Parameters 
-- command (Ctrl-Shift-M) to fill in the parameter 
-- values below.
--
-- This block of comments will not be included in
-- the definition of the procedure.
-- ================================================
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE OR ALTER PROCEDURE Contabilidad.CuotaPorCobrar_Update @userRoleId INT, @json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    --> Json
    DECLARE @cuotas  VARCHAR(MAX)
           ,@cuenta  VARCHAR(MAX)
           ,@payload VARCHAR(MAX)

	DECLARE @idUsuario INT ,@idCuentaPorCobrar INT ,@idEstadoPago INT


    DECLARE @tbCuenta AS TABLE(
        idCuentaPorCobrar INT NOT NULL
       ,idTiempoCredito INT NOT NULL
       ,fechaVencimiento DATETIME2 NOT NULL
    )

	DECLARE @tbCuotas AS TABLE (
		idCuotaPorCobrar INT UNIQUE NOT NULL
	   ,nroCuota INT UNIQUE NOT NULL
       ,entrada BIT NOT NULL
       ,fechaVencimiento DATETIME NOT NULL
	   ,interes NUMERIC(18,5) NOT NULL
	   ,cuota NUMERIC(18,5) NOT NULL
	   ,mora NUMERIC(18,5) NOT NULL
	   ,diasMora INT NOT NULL
       ,estado BIT NOT NULL
	)

	BEGIN TRY
        --> Json
		SELECT @cuenta = cuenta
              ,@cuotas = cuotas 
		FROM OPENJSON(@json) WITH 
        (
             cuenta NVARCHAR(MAX) AS JSON            
            ,cuotas NVARCHAR(MAX) AS JSON             
		)

        INSERT INTO @tbCuenta
              (idCuentaPorCobrar,idTiempoCredito,fechaVencimiento)
        SELECT idCuentaPorCobrar,idTiempoCredito,fechaVencimiento
        FROM OPENJSON(@cuenta) WITH 
        (
            idCuentaPorCobrar INT
           ,idTiempoCredito   INT
           ,fechaVencimiento  DATETIME2
        )

		INSERT INTO @tbCuotas 
              (idCuotaPorCobrar,fechaVencimiento,interes,cuota,mora,diasMora)
		SELECT idCuotaPorCobrar,fechaVencimiento,interes,cuota,mora,diasMora
		FROM OPENJSON(@cuotas) WITH 
        (
             idCuotaPorCobrar INT 
            ,fechaVencimiento DATETIME 
            ,cuota            NUMERIC(18,5)
            ,interes          NUMERIC(18,5)
            ,mora             NUMERIC(18,5)
            ,diasMora         INT
		)

	    --> recuperar variables
		SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

		--> validación de datos
        IF NOT EXISTS(SELECT 1 FROM @tbCuotas)  
			BEGIN
				SELECT '0'code,'Error en la informacion de las cuotas' as 'message'
				RETURN 
			END

		IF NOT EXISTS(SELECT 1 FROM @tbCuotas)
			BEGIN
				SELECT '0'code,'Error en la informacion de las cuotas' as 'message'
				RETURN 
			END 

		BEGIN TRAN 
            --> Cuenta
            UPDATE cc SET
                   cc.idTiempoCredito  = tc.idTiempoCredito
                  ,cc.fechaVencimiento = tc.fechaVencimiento
            FROM Contabilidad.CuentaPorCobrar cc WITH (NOLOCK)
            INNER JOIN @tbCuenta              tc ON tc.idCuentaPorCobrar = cc.idCuentaPorCobrar

            --> Cuotas
			UPDATE cx SET 
				cx.fechaVencimiento  = tb.fechaVencimiento
	           ,cx.cuota             = tb.cuota
	           ,cx.interes           = tb.interes
			   ,cx.mora              = tb.mora
	           ,cx.diasMora          = tb.diasMora
               ,cx.estado            = tb.estado
			FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
			INNER JOIN @tbCuotas             tb ON tb.idCuotaPorCobrar = cx.idCuotaPorCobrar

            INSERT INTO Contabilidad.CuotaPorCobrar
                   (idCuentaPorCobrar,idEstadoPago ,nroCuota,fechaVencimiento,cuota,entrada)
	        SELECT @idCuentaPorCobrar,@idEstadoPago,nroCuota,fechaVencimiento,cuota,entrada 
            FROM @tbCuotas
            WHERE idCuotaPorCobrar = 0

			SET @payload = (
                                SELECT cx.idCuotaPorCobrar
			                          ,cx.nroCuota
								      ,cx.interes
								      ,cx.cuota
								      ,cx.diasMora
								      ,cx.abono
								      ,cx.saldo
								      ,cx.mora
								      ,FORMAT(cx.fechaVencimiento,'MM/dd/yyyy') as fechaVencimiento
								      ,ep.descripcion                           as estado
								      ,ep.codigo                                as codEstado
			                    FROM Contabilidad.CuotaPorCobrar cx WITH (NOLOCK)
							    INNER JOIN dbo.EstadoPago        ep WITH (NOLOCK) ON ep.idEstadoPago = cx.idEstadoPago
							    WHERE cx.idCuentaPorCobrar = @idCuentaPorCobrar 
                                  AND cx.estado = 1
                                ORDER BY cx.nroCuota ASC
						        FOR JSON PATH
                           )

		COMMIT TRAN 
		SELECT '1'code,'Actualizado Correctamente' as 'message', @payload as payload
	END TRY 

	BEGIN CATCH 
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/CuotaPorCobrar/Update',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento ' as 'message'
	END CATCH
END
GO
