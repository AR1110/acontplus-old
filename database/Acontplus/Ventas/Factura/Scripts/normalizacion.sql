USE ACONTPLUS 

--ALTER TABLE Ventas.HistoryInfoAdicional ADD idFacturaDetalle BIGINT CONSTRAINT fk_infoAdicional_Detalle FOREIGN KEY(idFacturaDetalle) REFERENCES dbo.FacturaDetalle(idFacturaDetalle)

--ALTER TABLE Ventas.HistoryInfoAdicional ADD idNotaEntregaDetalle BIGINT CONSTRAINT fk_infoAdicional_Detalle_Nota FOREIGN KEY(idNotaEntregaDetalle) REFERENCES dbo.NotaEntregaDetalle(idNotaEntregaDetalle)

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN estab

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN ptoEmi

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN secuencial

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN idDocumento

--ALTER TABLE Ventas.HistoryInfoAdicional DROP COLUMN codDoc

--SELECT * FROM Ventas.HistoryInfoAdicional  where idFacturaDetalle > 0

--ALTER TABLE InfoAdicionalDoc DROP COLUMN idArticuloInfoAdicional

--ALTER TABLE InfoAdicionalDoc DROP CONSTRAINT FK__InfoAdici__idArt__1D5C2FEB


--SELECT * FROM Compra.InfoAdicional

--> InfoAdicional

--ALTER TABLE InfoAdicionalDoc ADD idInfoAdicional INT CONSTRAINT fk_InfoAdicional_Compra FOREIGN KEY (idInfoAdicional) REFERENCES  Compra.InfoAdicional(idInfoAdicional)

--UPDATE FacturaDetalle set uuid = NEWID()

--ALTER TABLE FacturaDetalle ALTER COLUMN uuid UNIQUEIDENTIFIER NOT NULL

--ALTER TABLE FacturaDetalle ADD DEFAULT NEWID() FOR uuid


--UPDATE NotaEntregaDetalle set uuid = NEWID()

--ALTER TABLE NotaEntregaDetalle ALTER COLUMN uuid UNIQUEIDENTIFIER NOT NULL

--ALTER TABLE NotaEntregaDetalle ADD DEFAULT NEWID() FOR uuid

--ALTER TABLE Ventas.HistoryInfoAdicional ADD estado BIT 

--UPDATE Ventas.HistoryInfoAdicional SET estado = 0 

--ALTER TABLE Ventas.HistoryInfoAdicional ALTER COLUMN estado BIT NOT NULL

--ALTER TABLE Ventas.HistoryInfoAdicional ADD DEFAULT 1 FOR estado

select Top 10 * from Ventas.HistoryInfoAdicional 
