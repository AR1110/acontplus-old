USE [AcontPlus]
GO
/****** Object:  StoredProcedure [dbo].[aspCajaGet]    Script Date: 24/5/2023 9:01:39 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE OR ALTER PROCEDURE Contabilidad.Caja_Get 
	 @userRoleId INT
    ,@json VARCHAR(MAX)
    ,@tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

    --> Global
    DECLARE @tipo INT ,@idEntidad INT ,@idUsuario INT

    --> Sql
	DECLARE @params nvarchar(MAX) ,@sql nvarchar(MAX) ,@pageIndex INT ,@pageSize INT

    -->Filters 
    DECLARE @id INT

    --> Permision 
    DECLARE @verOtrasCajas BIT
    
    --> Recuperando Variables
    SELECT TOP 1 @idEntidad  = idEntidad ,@idUsuario = idUsuario FROM App.UsuarioRol WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId

    SELECT @tipo = tipo FROM OPENJSON(@json) WITH (tipo INT)

    --> Get 
    IF @tipo = 1
        BEGIN 
            
            SET @tableNames = 'cajas'

            SELECT @pageSize  = pageSize
				  ,@pageIndex = pageIndex
			FROM OPENJSON(@json) WITH
            (
                 pageSize      INT
                ,pageIndex     INT
			)

            SELECT TOP 1 @verOtrasCajas = verOtrasCajas FROM Config.v_User_Permission_CashAccounting where idUsuarioRol = @userRoleId

            SET @params = '@idEntidad INT
                          ,@idUsuario INT
                          ,@pageSize  INT
                          ,@pageIndex INT'
            
            SET @sql = 'SELECT ca.idCaja
		                      ,ca.descripcion 
		                      ,ca.estado 
		                      ,IIF(ca.actividad = 1,''APERTURADA'',''CERRADA'') as actividad
                              ,ISNULL(UPPER(cu.BusinessName),'''')              as usuario
		                      ,ISNULL(UPPER(tu.descripcion),'''')               as turno
		                      ,ISNULL(tu.idTurno,0)                             as idTurno
		                      ,us.idUsuario
                              ,COUNT(*) OVER()                                  as totalRecords
	                    FROM Caja                    ca WITH (NOLOCK)
	                    LEFT JOIN dbo.AsignacionCaja ac WITH (NOLOCK) ON ac.idCaja    = ca.idCaja
	                    LEFT JOIN dbo.Usuario        us WITH (NOLOCK) ON us.idUsuario = ac.idUsuario
	                    LEFT JOIN Turno              tu WITH (NOLOCK) ON tu.idTurno   = ac.idTurno
						LEFT JOIN Customer.Customer  cu WITH (NOLOCK) ON cu.Id        = us.customerId
	                    WHERE ca.idEntidad = @idEntidad 
                          AND ca.estado = 1 '

            IF @verOtrasCajas = 0
                BEGIN
                    SET @sql = @sql + 'AND us.idUsuario = @idUsuario '
                END 

            SET @sql = @sql + 'ORDER BY ca.idCaja DESC OFFSET @pageSize * (@pageIndex -1 ) ROWS FETCH NEXT @pageSize ROWS ONLY '

            EXEC sp_executesql @sql
			                  ,@params 
				              ,@idEntidad = @idEntidad
                              ,@idUsuario = @idUsuario
                              ,@pageIndex = @pageIndex
                              ,@pageSize  = @pageSize

            RETURN 
        END 
    
    --> DataForm
    IF @tipo = 2
        BEGIN 
            
            SET @tableNames = 'usuarios,turnos'

            SELECT idUsuario,nombreUsuario,nroIdentificacion FROM v_usuario WITH (NOLOCK) WHERE idEntidad = @idEntidad

            SELECT idTurno,descripcion FROM dbo.Turno WITH (NOLOCK) WHERE idEntidad = @idEntidad

            RETURN 
        END

    --> Get Id
    IF @tipo = 3
        BEGIN
            
            SET @tableNames = 'caja,asignaciones'

            SELECT @id = id FROM OPENJSON(@json) WITH (id INT)

            SELECT idCaja, descripcion,estado FROM Caja WITH (NOLOCK) WHERE idCaja = @id

            SELECT idAsignacionCaja, idTurno,idUsuario,idCaja FROM dbo.AsignacionCaja WITH (NOLOCK) WHERE idCaja = @id

            RETURN 
        END 
END
