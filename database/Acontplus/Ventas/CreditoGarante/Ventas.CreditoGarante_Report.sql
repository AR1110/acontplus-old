USE [Acontplus]
go  
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
 
CREATE OR ALTER PROCEDURE Ventas.CreditoGarante_Report 
     @userRoleId INT
    ,@json VARCHAR(MAX)
	,@tableNames VARCHAR(500) OUTPUT
AS
BEGIN
    
    SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@usuario VARCHAR(150) ,@idUsuario INT

    --> Sql
    DECLARE @sql NVARCHAR(MAX) ,@params NVARCHAR(MAX)

    --> Filters
    DECLARE @idCuentaPorCobrar INT
			,@codEstab VARCHAR(100) 
            

    --> Variables
    SELECT TOP 1 @idEntidad = idEntidad ,@usuario = nombreUsuario FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo, @idCuentaPorCobrar=idCuentaPorCobrar, @codEstab = codEstab FROM OPENJSON(@json) WITH (tipo INT, idCuentaPorCobrar INT, codEstab VARCHAR(100))

 
    IF @tipo = 1
        BEGIN
            
            SET @tableNames = 'headerDs,creditoGaranteDs'
 

            SET @sql = 'SELECT *
                        FROM Ventas.CreditoGarante vcg WITH (NOLOCK)
                      '

            SET @params = '@idCuentaPorCobrar        INT'
                          


            

            SELECT en.razonSocial
                  ,es.nombreComercial
                  ,en.ruc
                  ,es.telefono
                  ,es.dirEstablecimiento
                  ,@usuario             as usuario  
                  ,'SOLICITUD CREDITO' as nombreReporte
            FROM Sri.Establecimiento es WITH (NOLOCK)
            INNER JOIN dbo.Entidad   en WITH (NOLOCK) ON en.idEntidad = es.idEntidad
            WHERE codEstab = @codEstab

            EXEC sp_executesql @sql
						      ,@params  
							  ,@idCuentaPorCobrar = @idCuentaPorCobrar

            RETURN 

        END 

     
END
GO
