-- Seed data for El Coca Barber Shop Studio Loyalty System
-- Assumes CompanyId = 1 for the barbershop

-- 1. Loyalty Program
INSERT INTO [Loyalty].[LoyaltyProgram] 
([CompanyId], [Name], [Description], [ProgramType], [StartDate], [EndDate], [BirthdayRewardsEnabled], [BirthdayDiscountPercentage], [BirthdayDiscountMaxAmount], [BirthdayValidityDays], [PointsEnabled], [PointsPerUnit], [PointsCalculationType], [CreatedAt], [IsActive])
VALUES 
(1, 'Club Coca VIP', 'Programa de lealtad para clientes frecuentes de El Coca Barber Shop Studio', 4, '2024-01-01', NULL, 1, 15.00, 20.00, 7, 1, 1.0000, 1, GETDATE(), 1);

-- 2. Loyalty Tiers
INSERT INTO [Loyalty].[LoyaltyTier] 
([CompanyId], [LoyaltyProgramId], [Name], [Description], [RequiredPoints], [RequiredTransactions], [RequiredSpending], [OrderIndex], [Color], [Icon], [CreatedAt], [IsActive])
VALUES 
(1, 1, 'Bronce', 'Nivel inicial para nuevos clientes', 0, 0, 0.00, 1, '#CD7F32', 'bronze-medal', GETDATE(), 1),
(1, 1, 'Plata', 'Nivel intermedio para clientes regulares', 100, 5, 100.00, 2, '#C0C0C0', 'silver-medal', GETDATE(), 1),
(1, 1, 'Oro', 'Nivel avanzado para clientes frecuentes', 300, 12, 300.00, 3, '#FFD700', 'gold-medal', GETDATE(), 1),
(1, 1, 'Platino', 'Nivel premium para clientes VIP', 600, 25, 600.00, 4, '#E5E4E2', 'crown', GETDATE(), 1);

-- 3. Loyalty Tier Benefits
INSERT INTO [Loyalty].[LoyaltyTierBenefit] 
([LoyaltyTierId], [Name], [Description], [BenefitType], [Value], [MaxValue], [MaxUsagesPerPeriod], [UsagePeriod], [Conditions], [CreatedAt], [IsActive])
VALUES 
-- Bronze Benefits
(1, 'Puntos por Compra', 'Gana 1 punto por cada dólar gastado', 4, 1.0000, NULL, NULL, NULL, NULL, GETDATE(), 1),

-- Silver Benefits  
(2, 'Puntos Dobles', 'Gana 2 puntos por cada dólar gastado', 4, 2.0000, NULL, NULL, NULL, NULL, GETDATE(), 1),
(2, 'Descuento Miércoles', '10% de descuento los miércoles', 1, 10.0000, 15.00, 1, 2, '{"day_of_week": 3}', GETDATE(), 1),

-- Gold Benefits
(3, 'Puntos Triple', 'Gana 3 puntos por cada dólar gastado', 4, 3.0000, NULL, NULL, NULL, NULL, GETDATE(), 1),
(3, 'Descuento VIP', '15% de descuento en todos los servicios', 1, 15.0000, 25.00, 2, 3, NULL, GETDATE(), 1),
(3, 'Servicio Gratis Mensual', 'Un corte básico gratis al mes', 2, 15.0000, NULL, 1, 3, '{"service_type": "corte_basico"}', GETDATE(), 1),

-- Platinum Benefits
(4, 'Máximos Puntos', 'Gana 4 puntos por cada dólar gastado', 4, 4.0000, NULL, NULL, NULL, NULL, GETDATE(), 1),
(4, 'Descuento Premium', '20% de descuento en todos los servicios', 1, 20.0000, 50.00, 4, 3, NULL, GETDATE(), 1),
(4, 'Servicios Premium Gratis', 'Dos servicios premium gratis al mes', 2, 35.0000, NULL, 2, 3, '{"service_type": "premium"}', GETDATE(), 1),
(4, 'Atención Prioritaria', 'Servicio sin cita previa', 5, 1.0000, NULL, NULL, NULL, NULL, GETDATE(), 1);

-- 4. Loyalty Rules
INSERT INTO [Loyalty].[LoyaltyRule] 
([CompanyId], [LoyaltyProgramId], [Name], [Description], [RuleType], [TriggerConditions], [Actions], [Priority], [StartDate], [EndDate], [CreatedAt], [IsActive])
VALUES 
(1, 1, 'Puntos por Compra', 'Otorgar puntos basados en el gasto del cliente', 1, 
'{"trigger_type": "purchase", "min_amount": 1}', 
'{"action_type": "award_points", "calculation": "amount_based", "multiplier": "tier_based"}', 
1, NULL, NULL, GETDATE(), 1),

(1, 1, 'Bono Cumpleaños', 'Recompensa especial en el mes de cumpleaños', 3, 
'{"trigger_type": "birthday_month", "days_before": 7, "days_after": 7}', 
'{"action_type": "create_reward", "reward_type": "discount", "value": 15, "max_amount": 20}', 
2, NULL, NULL, GETDATE(), 1),

(1, 1, 'Cliente Nuevo', 'Bono de bienvenida para nuevos clientes', 4, 
'{"trigger_type": "first_visit"}', 
'{"action_type": "award_points", "points": 20, "create_reward": true, "reward_value": 5}', 
3, NULL, NULL, GETDATE(), 1),

(1, 1, 'Referido Amigo', 'Bono por referir nuevos clientes', 4, 
'{"trigger_type": "referral", "min_referred_visits": 1}', 
'{"action_type": "award_points", "points": 50, "create_reward": true, "reward_value": 10}', 
4, NULL, NULL, GETDATE(), 1),

(1, 1, 'Promoción Fin de Semana', 'Puntos extra los fines de semana', 4, 
'{"trigger_type": "weekend_purchase", "days": [6, 7]}', 
'{"action_type": "award_points", "multiplier": 1.5}', 
5, NULL, NULL, GETDATE(), 1);

-- 5. Sample Company Customers (assuming these customers exist)
-- Note: This assumes Customer IDs 1-5 exist in the Customer table
INSERT INTO [Core].[CompanyCustomer] 
([CompanyId], [CustomerId], [LocalCustomerNumber], [FirstVisitDate], [LastVisitDate], [TotalTransactions], [CurrentLoyaltyPoints], [TotalSpent], [AverageTransactionValue], [CurrentTierId], [TierAchievedDate], [CreatedAt], [IsActive])
VALUES 
(1, 1, 'CC001', '2024-01-15', '2024-11-20', 8, 150, 180.00, 22.50, 2, '2024-10-01', GETDATE(), 1),
(1, 2, 'CC002', '2024-02-10', '2024-11-18', 15, 320, 375.00, 25.00, 3, '2024-11-01', GETDATE(), 1),
(1, 3, 'CC003', '2024-03-05', '2024-11-22', 3, 45, 60.00, 20.00, 1, '2024-03-05', GETDATE(), 1),
(1, 4, 'CC004', '2024-01-20', '2024-11-19', 28, 650, 700.00, 25.00, 4, '2024-09-15', GETDATE(), 1),
(1, 5, 'CC005', '2024-04-12', '2024-11-21', 6, 90, 120.00, 20.00, 2, '2024-08-10', GETDATE(), 1);

-- 6. Sample Loyalty Transactions
INSERT INTO [Loyalty].[LoyaltyTransaction] 
([CompanyId], [CompanyCustomerId], [TransactionNumber], [TransactionDate], [TransactionType], [PointsEarned], [PointsUsed], [PointsBalance], [TransactionAmount], [DiscountAmount], [SourceModule], [SourceTransactionId], [Description], [CreatedAt], [IsActive])
VALUES 
-- Customer 1 transactions
(1, 1, 'LT-2024-001', '2024-11-20', 1, 20, 0, 150, 20.00, 0.00, 'POS', 'POS-001', 'Corte de cabello clásico', GETDATE(), 1),
(1, 1, 'LT-2024-002', '2024-11-10', 1, 25, 0, 130, 25.00, 0.00, 'POS', 'POS-002', 'Corte + Barba', GETDATE(), 1),

-- Customer 2 transactions  
(1, 2, 'LT-2024-003', '2024-11-18', 1, 30, 0, 320, 25.00, 5.00, 'POS', 'POS-003', 'Servicio premium con descuento', GETDATE(), 1),
(1, 2, 'LT-2024-004', '2024-11-05', 1, 35, 0, 290, 35.00, 0.00, 'POS', 'POS-004', 'Tratamiento capilar', GETDATE(), 1),

-- Customer 4 transactions
(1, 4, 'LT-2024-005', '2024-11-19', 1, 40, 0, 650, 30.00, 6.00, 'POS', 'POS-005', 'Corte premium con descuento platino', GETDATE(), 1),
(1, 4, 'LT-2024-006', '2024-11-01', 5, 20, 0, 610, 0.00, 0.00, 'SYSTEM', 'BIRTHDAY-001', 'Bono de cumpleaños', GETDATE(), 1);

-- 7. Sample Loyalty Rewards
INSERT INTO [Loyalty].[LoyaltyReward] 
([CompanyCustomerId], [LoyaltyTransactionId], [RewardName], [Description], [RewardType], [RewardValue], [EarnedDate], [ExpiryDate], [Status], [CreatedAt], [IsActive])
VALUES 
(1, NULL, 'Descuento de Bienvenida', '$5 de descuento en tu próxima visita', 1, 5.00, '2024-01-15', '2024-12-31', 1, GETDATE(), 1),
(2, NULL, 'Corte Gratis - Oro', 'Un corte básico gratis por alcanzar nivel Oro', 2, 15.00, '2024-11-01', '2024-12-01', 1, GETDATE(), 1),
(4, 6, 'Bono Cumpleaños', 'Descuento especial de cumpleaños', 1, 15.00, '2024-11-01', '2024-11-08', 2, GETDATE(), 1),
(3, NULL, 'Cliente Nuevo', 'Bienvenido a El Coca Barber Shop', 1, 5.00, '2024-03-05', '2025-03-05', 1, GETDATE(), 1),
(4, NULL, 'Servicio Premium Gratis', 'Tratamiento capilar gratis - Beneficio Platino', 2, 35.00, '2024-11-01', '2024-12-01', 1, GETDATE(), 1);