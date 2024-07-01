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
-- Author:		Alexis Ramirez	
-- Create date: 2023/04/01
-- Description:	SP para traer los datos de los establecimientos.
-- =============================================

CREATE OR ALTER PROCEDURE Sri.Establecimiento_Get_Id @json VARCHAR(MAX) 
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	DECLARE @codEstab VARCHAR(50)
	DECLARE @id INT 
	DECLARE @typeList INT

	SELECT @id = id, @typeList = typeList FROM OPENJSON(@json) WITH (id INT '$.id', typeList INT '$.typeList')

	SELECT @codEstab = codEstab FROM Sri.Establecimiento WHERE idEstablecimiento = @id

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

	IF @typeList = 1
		BEGIN 
			SELECT idPuntoEmision
					,pe.ambiente
					,pe.ptoEmi 
					,descripcion = a.descripcion
					,pe.estado
			FROM dbo.PuntoEmision pe
			INNER JOIN Sri.Ambiente a ON a.codigo = pe.ambiente
			WHERE pe.idEstablecimiento = @id
		END 
END
GO
