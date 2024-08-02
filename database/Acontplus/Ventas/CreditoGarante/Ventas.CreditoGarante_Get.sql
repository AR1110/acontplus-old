USE [Acontplus]
GO 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE OR ALTER PROCEDURE Ventas.CreditoGarante_Get
	 @userRoleId INT
	,@json VARCHAR(700)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH 
	DECLARE @idCuentaPorCobrar INT 
    DECLARE @tipo INT  

    SELECT @tipo = tipo, @idCuentaPorCobrar=idCuentaPorCobrar FROM OPENJSON(@json) WITH(tipo INT, idCuentaPorCobrar INT)

    --> Get
    IF @tipo = 1
        BEGIN 
            SET @tableNames='guarantors'
	        SELECT  
                cg.idCreditoGarante
				,cg.idCuentaPorCobrar
				,c.idCliente
				,razonSocialComprador = cc.BusinessName
				,nombreComercial      = cc.TradeName
				,identificacionComprador = cc.IDCard
				,c.direccion
				,c.correo
				,c.telefono
                ,tipoAccion = 'U'
	         FROM Ventas.CreditoGarante cg WITH (NOLOCK)
			 INNER JOIN dbo.Cliente c WITH (NOLOCK) ON c.idCliente  = cg.idCliente
			 INNER JOIN Customer.Customer cc WITH (NOLOCK) ON cc.Id = c.customerId
	         WHERE cg.estado = 1 AND cg.idCuentaPorCobrar = @idCuentaPorCobrar
             RETURN
        END 
		 
		 
END
