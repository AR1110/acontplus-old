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
CREATE OR ALTER PROCEDURE Contabilidad.ComprobanteIngreso_Update @userRoleId INT ,@id INT ,@json VARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

    --> Global
	DECLARE @idUsuario INT 

    --> DataJson
    DECLARE @cuenta VARCHAR(MAX) ,@cuota VARCHAR(MAX) ,@observacion VARCHAR(300)

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
        SELECT TOP 1 @idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

  	    --> obtener Datos de los Json
		SELECT @observacion = observacion
              ,@cuenta      = cuenta
              ,@cuota       = cuota
        FROM OPENJSON(@json) WITH 
        (
            observacion VARCHAR(500)
           ,cuenta      NVARCHAR(MAX) AS JSON
           ,cuota       NVARCHAR(MAX) AS JSON

		) as dt

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

        --> Validaciones
        IF EXISTS (SELECT 1 FROM ComprobanteIngreso WITH (NOLOCK) WHERE idComprobanteIngreso = @id AND movimiento = 0)
            BEGIN 
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
            END 

		IF EXISTS (SELECT 1 FROM ComprobanteIngreso WITH (NOLOCK) WHERE idComprobanteIngreso = @id AND estado = 0)
			BEGIN 
                SELECT '0' as code,'El Comprobante de Ingreso ya se encuentra anulado' as 'message'
				RETURN 
			END

        --> Transacciones
		BEGIN TRAN 
			UPDATE ComprobanteIngreso WITH (ROWLOCK)
               SET estado              = 0
                  ,observacion         = @observacion
                  ,fechaAnulada        = dbo.ufnGetDateEcuador() 
                  ,idUsuarioAnulado    = @idUsuario 
            WHERE idComprobanteIngreso = @id 
			
            --> Edicion de estado de las cuentas aplicadas por cobro tipo Documento (Devoluciones,Retenciones,Anticipos)
            IF EXISTS (SELECT 1 FROM dbo.Cobro WITH (NOLOCK) WHERE idCuentaPorCobrar > 0 AND idComprobanteIngreso = @id)
                BEGIN
                    DECLARE @idEstadoPago INT

                    SELECT TOP 1 @idEstadoPago = idEstadoPago FROM EstadoPago WITH (NOLOCK) WHERE codigo = 'PE'

                    UPDATE Contabilidad.CuentaPorCobrar WITH (ROWLOCK)
                       SET idEstadoPago = @idEstadoPago
                    WHERE idCuentaPorCobrar IN (SELECT idCuentaPorCobrar FROM dbo.Cobro WITH (NOLOCK) WHERE idCuentaPorCobrar > 0 AND idComprobanteIngreso = @id)
                END

            IF EXISTS (SELECT 1 FROM ComprobanteIngreso WITH (NOLOCK) WHERE idComprobanteIngreso = @id AND movimiento = 0)
                BEGIN 
                    --> Editar Estados de las Cuenta
                    UPDATE cc WITH (ROWLOCK) SET
                           cc.idEstadoPago = tc.idEstadoPago
                          ,cc.abono        = tc.abono
                          ,cc.mora         = cc.mora - tc.mora
                          ,cc.diasMora     = cc.diasMora - tc.diasMora
                    FROM Contabilidad.CuentaPorCobrar cc
                    INNER JOIN @tbCuenta              tc ON tc.idCuentaPorCobrar = cc.idCuentaPorCobrar

                    --> Editar Estados de la cuota
                    UPDATE cx WITH (ROWLOCK) SET 
                           cx.idEstadoPago = tc.idEstadoPago
                          ,cx.abono        = tc.abono
                          ,cx.mora         = tc.mora - tc.mora
                          ,cx.diasMora     = tc.diasMora - tc.diasMora
                    FROM Contabilidad.CuotaPorCobrar cx
                    INNER JOIN @tbCuota              tc ON tc.idCuotaPorCobrar = cx.idCuotaPorCobrar
                END
            ELSE 
                BEGIN
                    IF EXISTS (SELECT 1 FROM Anticipo WITH (NOLOCK) WHERE idComprobanteIngreso = @id)
                        BEGIN
                            UPDATE dbo.Anticipo WITH (ROWLOCK) SET estado = 0 WHERE idComprobanteIngreso = @id
                        END 

                    IF EXISTS (SELECT 1 FROM dbo.MovimientoCaja WITH (NOLOCK) WHERE idComprobanteIngreso = @id)
                        BEGIN
                            UPDATE dbo.MovimientoCaja WITH (ROWLOCK) SET estado = 0 WHERE idComprobanteIngreso = @id
                        END 
                END 


		COMMIT TRAN 
		SELECT '1' code ,'Anulado Correctamente' as 'message'
	END TRY 

	BEGIN CATCH
		IF @@TRANCOUNT > 0
		    BEGIN
			    ROLLBACK TRAN;
		    END

		INSERT INTO ErroresSistema WITH (ROWLOCK)
              (token,method,errorNumber,errorSeverity,errorState,errorProcedure,errorLine,errorMessage,errorDate,idUsuario)
		SELECT NEWID(),'/ComprobanteIngreso/Delete',ERROR_NUMBER(),ERROR_SEVERITY(),ERROR_STATE(),ERROR_PROCEDURE(),ERROR_LINE(),ERROR_MESSAGE(),GETDATE(),@idUsuario

        SELECT '0' code,'Info: Error en el procedimiento' as 'message'
	END CATCH 
END
GO
