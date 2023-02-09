use AcontPlus
ALTER TABLE DocumentoElectronicoError ADD idDocumentoElectronico INT NULL
ALTER TABLE DocumentoElectronicoError ALTER COLUMN claveAcceso VARCHAR(49) NULL
ALTER TABLE DocumentoElectronicoError ALTER COLUMN mensaje VARCHAR(MAX) NULL