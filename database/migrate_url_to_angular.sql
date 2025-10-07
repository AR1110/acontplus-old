USE ACONTPLUS 
--CONFIGURACION 
--SELECT * FROM AcontplusAdmin.Config.Menu WHERE Code='CFG'
--SELECT mm.* FROM AcontplusAdmin.Config.Menu m
--INNER JOIN AcontplusAdmin.Config.Menu mm ON mm.ParentId = m.Id
--WHERE m.Code='CFG'

--PARENT CONFIG
UPDATE AcontplusAdmin.Config.Menu SET Url='config' WHERE  Code='CFG'

--CHILDREN
UPDATE AcontplusAdmin.Config.Menu SET Url='general-config' WHERE Code='CONG'
UPDATE AcontplusAdmin.Config.Menu SET Url='doc-config' WHERE Code='COND'
UPDATE AcontplusAdmin.Config.Menu SET Url='user-customer' WHERE Code='USU'
UPDATE AcontplusAdmin.Config.Menu SET Url='establishment' WHERE Code='SUC'
UPDATE AcontplusAdmin.Config.Menu SET Url='company' WHERE Code='ENT'
UPDATE AcontplusAdmin.Config.Menu SET Url='printer' WHERE Code='CI'
UPDATE AcontplusAdmin.Config.Menu SET Url='credit-time' WHERE Code='TIE'
UPDATE AcontplusAdmin.Config.Menu SET Url='electronic-signature' WHERE Code='FIR'
UPDATE AcontplusAdmin.Config.Menu SET Url='warehouse' WHERE Code='BOD'
--UPDATE AcontplusAdmin.Config.Menu SET Url='shift' WHERE Code='FIR'
