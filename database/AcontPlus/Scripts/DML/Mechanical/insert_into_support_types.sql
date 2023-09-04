USE [Acontplus]
GO 

INSERT INTO Mechanical.SupportType ([Description],[Code],[CreatedAt],[Enabled])
VALUES ('Correctivo','CR',GETDATE(),1)
      ,('Preventivo','PV',GETDATE(),1)
