USE AcontPlus

IF OBJECT_ID('FactElect.Doc_Elect_Get_Data_Form') IS NOT NULL
	DROP PROCEDURE FactElect.Doc_Elect_Get_Data_Form
GO

CREATE PROCEDURE  FactElect.Doc_Elect_Get_Data_Form @idUsuarioRol INT
AS
BEGIN
	SET NOCOUNT ON;
	SET LANGUAGE SPANISH;

	SELECT descripcion, codigo FROM FactElect.EstadoServicio WHERE estado = 1

	SELECT ea.codEstab_Asig, ea.predeterminado, e.*
	FROM Config.Estab_Asig ea WITH (NOLOCK) 
	INNER JOIN Sri.Establecimiento e WITH (NOLOCK)  ON ea.codEstab = e.codEstab
	WHERE idUsuarioRol = @idUsuarioRol 

	SELECT pa.idPtoEmi_asig, ea.codEstab_Asig, pe.idPuntoEmision, pe.ptoEmi, pa.predeterminado, pa.estado
	FROM Config.PtoEmi_Asig pa  WITH (NOLOCK) 
	INNER JOIN  Config.Estab_Asig ea WITH (NOLOCK)  ON ea.codEstab_Asig = pa.codEstab_Asig
	INNER JOIN PuntoEmision pe On pa.idPuntoEmision = pe.idPuntoEmision
	WHERE ea.idUsuarioRol = @idUsuarioRol 

END 