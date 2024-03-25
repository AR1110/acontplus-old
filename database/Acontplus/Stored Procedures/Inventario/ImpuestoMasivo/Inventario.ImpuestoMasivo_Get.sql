USE AcontPlus
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
-- Author:		Ivan Paz
-- Create date: 2023-05-16
-- Description:	SP FOR GET ALL PRICES OF ARTICLES
-- =============================================
CREATE OR ALTER PROCEDURE Inventario.ImpuestoMasivo_Get
     @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	SET NOCOUNT ON;
    SET LANGUAGE SPANISH;

     --> Global
	DECLARE @tipo INT ,@idEntidad INT

    --> Sql
	DECLARE @params NVARCHAR(MAX) ,@sql NVARCHAR(MAX)

    --> Filter
    DECLARE @TaxId INT

    --> Informacion
	SELECT @idEntidad = idEntidad FROM App.UsuarioRol WHERE idUsuarioRol = @userRoleId

	SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get
	IF @tipo = 1
		BEGIN
            
            SET @tableNames = 'history'

			SELECT th.Id
                  ,th.Obs
                  ,th.Quantity
                  ,FORMAT(th.CreateAt,'dd/MM/yyyy HH:mm') as CreateAt
                  ,us.nombreUsuario as [user]
            FROM Seguridad.TransactionHistory th  WITH (NOLOCK) 
            INNER JOIN App.UsuarioRol ur WITH (NOLOCK) ON ur.idUsuarioRol = th.UserRoleId
            INNER JOIN dbo.Usuario    us WITH (NOLOCK) ON us.idUsuario    = ur.idUsuario
            WHERE ur.idEntidad = @idEntidad

            RETURN 
		END

    --> Cantidad de datos
    IF @tipo = 2
        BEGIN
            SET @tableNames = 'quantity'

            SELECT @TaxId = taxId FROM OPENJSON(@json) WITH (taxId INT)

            SELECT COUNT(*) as quantity
            FROM dbo.Articulo WITH (NOLOCK) 
            WHERE idEntidad = @idEntidad
              AND estado = 1 
              AND idTipoIva = @TaxId

            RETURN 
        END 

    --> DataForm
    IF @tipo = 3
        BEGIN
            
            SET @tableNames = 'taxes'
                
            SELECT idTipoIva,descripcion,codigoPorcentaje FROM dbo.TipoIva WITH (NOLOCK) WHERE estado = 1 ORDER BY codigoPorcentaje ASC

            RETURN 
        END 

END
GO
