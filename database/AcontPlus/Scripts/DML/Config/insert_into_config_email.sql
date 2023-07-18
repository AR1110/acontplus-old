USE [AcontPlus]
GO

INSERT INTO [Config].[Email_Config]
           ([enableSsl]
           ,[from]
           ,[host]
           ,[password]
           ,[port])
     VALUES
           ('1'
           ,'envio.comprobantes@acontplus.com.ec'
           ,'smtp.gmail.com'
           ,'xmhlwbiibinctuvn'
           ,587)
GO


