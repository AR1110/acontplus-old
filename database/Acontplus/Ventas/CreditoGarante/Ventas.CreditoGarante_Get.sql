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

    --> Variables Globales
    DECLARE @tipo INT  

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH(tipo INT)

    --> Get
    IF @tipo = 1
        BEGIN 
            DECLARE @idCuentaPorCobrar INT 

            SELECT @idCuentaPorCobrar = idCuentaPorCobrar FROM OPENJSON(@json) WITH(idCuentaPorCobrar INT)

            SET @tableNames='guarantors'

	        SELECT cg.idCreditoGarante
				  ,cg.idCuentaPorCobrar
				  ,cl.idCliente
				  ,cu.TradeName    as razonSocialComprador
				  ,cu.BusinessName as nombreComercial
				  ,cu.IDCard       as identificacionComprador
				  ,cl.direccion
				  ,cl.correo
				  ,cl.telefono
                  ,tipoAccion = 'U'
	         FROM Ventas.CreditoGarante   cg WITH (NOLOCK)
			 INNER JOIN dbo.Cliente       cl WITH (NOLOCK) ON cl.idCliente  = cg.idCliente
             INNER JOIN Customer.Customer cu WITH (NOLOCK) ON cu.Id         = cl.CustomerId
	         WHERE cg.estado = 1 
               AND cg.idCuentaPorCobrar = @idCuentaPorCobrar

             RETURN
        END 
		 
		 
END
