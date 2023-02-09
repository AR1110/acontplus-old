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
-- Create date: 2022-11-24
-- Description:	SP FOR GET DATA OVER RETENCIONES ATS
-- =============================================
USE AcontPlus
IF OBJECT_ID(N'FactElect.RetencionAts_Get', N'P') IS NOT NULL
DROP PROCEDURE FactElect.RetencionAts_Get 
GO
CREATE PROCEDURE FactElect.RetencionAts_Get @idRol INT
,@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @idEntidad INT
	,@idSucursal INT
	,@dirEstablecimiento VARCHAR(300)

	DECLARE @params AS TABLE(
		tipo INT NOT NULL
	
	)

	--SELECT @idEntidad = idEntidad, @idSucursal = idSucursal FROM AFTDataRol(@idRol)
	--SET @dirEstablecimiento = (SELECT direccion FROM Sucursal WHERE idSucursal = @idSucursal)
	INSERT INTO @params(tipo)
	SELECT tipo FROM OPENJSON(@json) WITH(tipo INT '$.tipo')
	--1 FORMULARIO
	IF EXISTS(SELECT 1 FROM @params WHERE tipo = 1)
		BEGIN
			SELECT * FROM TipoIdentificacion WITH (NOLOCK) 
			SELECT * FROM Sri.SujetoRetenido WITH (NOLOCK) 
			SELECT * FROM Sri.DocumentoSustento WITH (NOLOCK) 
			SELECT dst.codDocSustento, st.codSustento, st.descripcion  FROM Sri.SustentoTributario st  WITH (NOLOCK)
			INNER JOIN Sri.DocumentoSustentoTrib dst  WITH (NOLOCK) ON st.codSustento = dst.codSustento
			SELECT * FROM Sri.TipoPago WITH (NOLOCK) 
			SELECT * FROM Sri.TipoRegimenFE WITH (NOLOCK) 
			SELECT * FROM Sri.Pais WITH (NOLOCK)  
			SELECT * FROM Sri.ParaisoFiscal WITH (NOLOCK) 
			SELECT * FROM Sri.Impuesto WITH (NOLOCK) 
			SELECT * FROM Sri.TarifaImpuesto WITH (NOLOCK) 
			SELECT * FROM Sri.ImpuestoRetencion  WITH (NOLOCK)
			SELECT * FROM Sri.PorcentajeRetIva  WITH (NOLOCK)
			SELECT idCodigoRetencion, codigo, concepto descripcion, porcentajeMin porcentaje, estado 
			FROM Sri.CodigoRetencion  WITH (NOLOCK)
			SELECT * FROM Sri.FormaPago  WITH (NOLOCK)
 
			SELECT ea.codEstab_Asig,
			e.*
			FROM Config.Estab_Asig ea WITH (NOLOCK) 
			INNER JOIN Sri.Establecimiento e WITH (NOLOCK)  ON ea.codEstab = e.codEstab
			WHERE idUsuarioRol = @idRol

			SELECT pa.*
			FROM Config.PtoEmi_Asig pa  WITH (NOLOCK) 
			INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
 			WHERE ea.idUsuarioRol = @idRol

			RETURN
		END
END
GO
