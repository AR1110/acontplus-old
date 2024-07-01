USE [AcontPlus]
GO 
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO 
 
CREATE OR ALTER PROCEDURE Sri.Establishment_Get @userRoleId INT,@json VARCHAR(MAX), @tableNames VARCHAR(MAX) OUTPUT
AS
BEGIN
	 
	SET NOCOUNT ON; 
	DECLARE @tipo INT
    DECLARE @id INT 
    DECLARE @idEntidad INT

	SELECT @idEntidad= idEntidad FROM v_usuario WITH (NOLOCK) WHERE idUsuarioRol = @userRoleId
 

	SELECT 
		@tipo = tipo,
        @id = id
	FROM OPENJSON(@json)
	WITH(	
			tipo INT ,
            id INT 
		)

        -- lista general 
	IF @tipo=1
		BEGIN 
			SET @tableNames='estabs'
			SELECT 
				e.idEstablecimiento
				,e.codEstab
				,e.estab
				,e.nombreComercial
				,e.dirEstablecimiento
				,estado 
                
			FROM Sri.Establecimiento e
			WHERE e.idEntidad = @idEntidad
			ORDER BY e.idEstablecimiento DESC
		    RETURN 
		END 
    --data form
    IF @tipo =2
        BEGIN 
            SET @tableNames = 'cantones,actividadesEconomica,agentesRetencion,contribuyentes,ambientes'
            SELECT codigo,descripcion FROM Catalogo.Canton WHERE estado = 1

	        SELECT codigo,descripcion,grupo FROM Sri.ActividadEconomica WHERE estado = 1

	        SELECT resolucion,descripcion FROM Sri.AgenteRetencion WHERE estado = 1

	        SELECT codigo,descripcion,contribuyenteRimpe FROM Sri.Contribuyente WHERE estado = 1

	        SELECT ambiente = codigo, descripcion FROM Sri.Ambiente WHERE estado = 1
            RETURN 
        END 

    --editar 
    IF @tipo = 3
        BEGIN 
            SET @tableNames = 'data,puntosEmision'
            SELECT 
		         se.idEstablecimiento
		        ,se.codEstab
		        ,se.canton
		        ,se.actividad
		        ,se.agenteRetencion
		        ,se.contribuyente
		        ,ruc = e.ruc
		        ,se.estab
		        ,se.contribuyenteEspecial
		        ,se.obligadoContabilidad
		        ,se.nombreComercial
		        ,se.dirEstablecimiento
		        ,se.telefono
		        ,se.contribuyenteRimpe
		        ,se.correo
		        ,se.estado
                ,se.autoSriAuth
	        FROM Sri.Establecimiento se 
            INNER JOIN dbo.Entidad e WITH(NOLOCK) ON e.idEntidad = se.idEntidad 
	        WHERE idEstablecimiento = @id

             SELECT idPuntoEmision
					,pe.ambiente
					,pe.ptoEmi 
					,descripcion = a.descripcion
					,pe.estado
			FROM dbo.PuntoEmision pe
			INNER JOIN Sri.Ambiente a ON a.codigo = pe.ambiente
			WHERE pe.idEstablecimiento =  @id
            RETURN 
        END 

     


END
GO