USE Acontplus
GO
INSERT INTO Config.EstablecimientoLogo(EstablecimientoId, Content, ContentType, [FileName], [Enabled], CreatedAt)
SELECT e.idEstablecimiento, imagen, mimeType, nombreImagen, el.estado, el.fechaRegistro 
FROM Config.Estab_Logo el
	INNER JOIN Sri.Establecimiento e ON el.codEstab = e.codEstab

GO
ALTER TABLE Config.EstablecimientoLogo ADD CONSTRAINT fk_estab_logo_Establecimiento FOREIGN KEY (EstablecimientoId) REFERENCES Sri.Establecimiento(idEstablecimiento)

GO

DROP PROCEDURE IF EXISTS Config.Estab_Logo_Insert
GO

DROP PROCEDURE IF EXISTS Config.Estab_Logo_Delete

GO

--VERIFICAR Config.Estab_Logo before drop