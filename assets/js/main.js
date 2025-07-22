// assets/js/main.js

// --- CONFIGURAÇÃO DA PLANILHA DO GOOGLE SHEETS ---
// ATENÇÃO: As URLs abaixo DEVEM ser geradas usando a função "Publicar na web" do Google Sheets
// e selecionar o formato "Valores separados por vírgulas (.csv)".
// As URLs fornecidas inicialmente não permitem acesso programático direto.
// Exemplo de URL correta: https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizBXBO/pub?gid=0&single=true&output=csv
// (Este é um exemplo, você precisará gerar o seu próprio URL PUBLISHED para cada aba)
// Por favor, substitua os URLs abaixo pelos URLs CSV PUBLISHED corretos das suas planilhas.
const COUNTRY_STATS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=0&single=true&output=csv';
const METAIS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=1505649898&single=true&output=csv';
const VEICULOS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=1616220418&single=true&output=csv';

// --- DADOS DO JOGO ---
const gameData = {
    countries: {}, // Será preenchido dinamicamente
    doctrines: {
        infantry_tank: {
            name: "Tanque de Infantaria",
            description: "Concebido para operar em estreita coordenação com a infantaria, priorizando blindagem pesada contra armas antitanque e metralhadoras. Velocidade sacrificada em prol da proteção. Ex: Matilda II.",
            cost_modifier: 1.25, // +25%
            speed_modifier: 0.70, // -30%
            max_crew_mod: -1 // Infantry tanks often have smaller crews due to heavy armor/internal space
        },
        cruiser_tank: {
            name: "Tanque Cruzador",
            description: "Projetado para perseguição e exploração, exigindo alta velocidade e manobrabilidade. Tipicamente blindado de forma mais leve e equipado com armamento antitanque. Ex: Tanques Christie, Vickers Medium Mk II.",
            cost_modifier: 1.15, // +15%
            speed_modifier: 1.30, // +30%
            max_crew_mod: 0
        },
        light_tank_doctrine: {
            name: "Doutrina de Tanques Leves",
            description: "Primariamente destinado a funções de reconhecimento e constabularia, com o custo sendo o principal fator de design. Blindagem e armamento limitados. Ex: Vickers-Armstrong Light Tank.",
            cost_modifier: 0.80, // -20%
            speed_modifier: 1.10, // +10%
            max_crew_mod: -2
        },
        blitzkrieg: {
            name: "Blitzkrieg (Alemanha)",
            description: "Filosofia operacional que prioriza mobilidade, coordenação e reação rápida. Enfatiza motores confiáveis, rádios e ópticas de alta qualidade. Ex: Panzer IV, T-34 (inspirado na mobilidade).",
            cost_modifier: 1.10, // +10%
            speed_modifier: 1.20, // +20%
            optics_bonus: 0.05, // Bônus em ópticas
            radio_bonus: 0.05, // Bônus em rádio
            max_crew_mod: 0
        }
    },
    components: {
        vehicle_types: { // Chassis base with adjusted weights for 1939/early WWII
            tankette: { name: "Tankette", cost: 10000, weight: 3000, metal_cost: 1000, base_speed_road: 50, base_speed_offroad: 30, base_armor: 10, max_crew: 2, frontal_area_m2: 1.5, drag_coefficient: 1.2 },
            armored_car: { name: "Carro Blindado", cost: 15000, weight: 4000, metal_cost: 1500, base_speed_road: 80, base_speed_offroad: 40, base_armor: 15, max_crew: 3, frontal_area_m2: 2.0, drag_coefficient: 1.1 },
            halftrack: { name: "Semi-lagarta", cost: 20000, weight: 6000, metal_cost: 2000, base_speed_road: 65, base_speed_offroad: 45, base_armor: 20, max_crew: 3, frontal_area_m2: 2.5, drag_coefficient: 1.1 },
            carro_combate: { name: "Carro de Combate", cost: 40000, metal_cost: 2700, weight: 8000, base_speed_road: 40, base_speed_offroad: 25, base_armor: 50, max_crew: 4, frontal_area_m2: 3.0, drag_coefficient: 1.0 },
            transporte_infantaria: { name: "Veículo de Transporte de Infantaria", cost: 35000, metal_cost: 2250, weight: 7000, base_speed_road: 50, base_speed_offroad: 35, base_armor: 30, max_crew: 3, frontal_area_m2: 2.8, drag_coefficient: 1.0 },
            tanque_leve: { name: "Tanque Leve", cost: 33000, weight: 10000, metal_cost: 3300, base_speed_road: 55, base_speed_offroad: 35, base_armor: 30, max_crew: 3, frontal_area_m2: 2.5, drag_coefficient: 1.0 },
            tanque_medio: { name: "Tanque Médio", cost: 60000, weight: 20000, metal_cost: 6000, base_speed_road: 40, base_speed_offroad: 25, base_armor: 50, max_crew: 5, frontal_area_m2: 3.5, drag_coefficient: 1.0 },
            tanque_pesado: { name: "Tanque Pesado", cost: 500000, weight: 48000, metal_cost: 12000, base_speed_road: 35, base_speed_offroad: 20, base_armor: 90, max_crew: 6, frontal_area_m2: 4.0, drag_coefficient: 1.1 }, 
            super_pesado: { name: "Tanque Super Pesado", cost: 800000, weight: 80000, metal_cost: 25000, base_speed_road: 15, base_speed_offroad: 10, base_armor: 150, max_crew: 6, frontal_area_m2: 5.0, drag_coefficient: 1.3 },
            multi_turret_tank: { name: "Tanque de Múltiplas Torres", cost: 150000, weight: 30000, metal_cost: 9000, base_speed_road: 30, base_speed_offroad: 20, base_armor: 70, max_crew: 6, frontal_area_m2: 4.2, drag_coefficient: 1.15 },
            tank_destroyer: { name: "Caça-Tanques", cost: 70000, weight: 25000, metal_cost: 5000, base_speed_road: 40, base_speed_offroad: 25, base_armor: 60, max_crew: 4, frontal_area_m2: 3.2, drag_coefficient: 0.95 },
            assault_gun: { name: "Canhão de Assalto", cost: 60000, weight: 20000, metal_cost: 4000, base_speed_road: 35, base_speed_offroad: 20, base_armor: 50, max_crew: 4, frontal_area_m2: 3.0, drag_coefficient: 1.0 },
            command_vehicle: { name: "Veículo de Comando", cost: 30000, weight: 8000, metal_cost: 3000, base_speed_road: 50, base_speed_offroad: 35, base_armor: 25, max_crew: 3, frontal_area_m2: 2.5, drag_coefficient: 1.0 },
            engineering_vehicle: { name: "Veículo de Engenharia/Recuperação", cost: 35000, weight: 10000, metal_cost: 3500, base_speed_road: 45, base_speed_offroad: 30, base_armor: 20, max_crew: 3, frontal_area_m2: 3.0, drag_coefficient: 1.05 },
            artilharia_simples: { name: "Artilharia Simples", cost: 7500, weight: 1500, metal_cost: 750, base_speed_road: 20, base_speed_offroad: 10, base_armor: 10, max_crew: 2, frontal_area_m2: 2.0, drag_coefficient: 1.2 },
            artilharia_autopropulsada: { name: "Artilharia Autopropulsada", cost: 50000, weight: 15000, metal_cost: 3750, base_speed_road: 35, base_speed_offroad: 20, base_armor: 40, max_crew: 4, frontal_area_m2: 3.5, drag_coefficient: 1.1 },
            artilharia_antiaerea: { name: "Artilharia Antiaérea", cost: 10500, weight: 1200, metal_cost: 1050, base_speed_road: 40, base_speed_offroad: 25, base_armor: 20, max_crew: 3, frontal_area_m2: 2.2, drag_coefficient: 1.0 },
            aa_autopropulsada: { name: "AA Autopropulsada", cost: 50000, weight: 5000, metal_cost: 3750, base_speed_road: 45, base_speed_offroad: 30, base_armor: 30, max_crew: 3, frontal_area_m2: 2.8, drag_coefficient: 0.9 },
        },
        mobility_types: {
            rodas: { name: "Rodas", cost: 0, weight: 0, metal_cost: 0, speed_road_mult: 1.0, speed_offroad_mult: 0.5, armor_mult: 1.0, maintenance_mod: 0, durability: 0.9, drive_sprocket_radius_m: 0.3, rolling_resistance_coeff_road: 0.015, rolling_resistance_coeff_offroad: 0.08 },
            esteiras: { name: "Esteiras", cost: 61875, weight: 2475, metal_cost: 6187.5, speed_road_mult: 0.7, speed_offroad_mult: 1.0, armor_mult: 1.5, maintenance_mod: 0.15, durability: 1.0, drive_sprocket_radius_m: 0.42, rolling_resistance_coeff_road: 0.02, rolling_resistance_coeff_offroad: 0.10 },
            semi_lagartas: { name: "Semi-lagartas", cost: 30000, weight: 1500, metal_cost: 3000, speed_road_mult: 0.85, speed_offroad_mult: 0.7, armor_mult: 1.1, maintenance_mod: 0.10, durability: 0.85, drive_sprocket_radius_m: 0.35, rolling_resistance_coeff_road: 0.018, rolling_resistance_coeff_offroad: 0.09 },
            esteiras_rodas: { name: "Esteiras + Rodas (Convertível)", cost: 49500, weight: 1320, metal_cost: 4950, speed_road_mult: 1.1, speed_offroad_mult: 0.9, armor_mult: 1.3, maintenance_mod: 0.20, durability: 0.75, drive_sprocket_radius_m: 0.38, rolling_resistance_coeff_road: 0.016, rolling_resistance_coeff_offroad: 0.095 },
            rodas_blindadas: { name: "Rodas Blindadas", cost: 29700, weight: 1650, metal_cost: 2970, speed_road_mult: 0.9, speed_offroad_mult: 0.6, armor_mult: 1.2, maintenance_mod: 0.05, durability: 0.95, drive_sprocket_radius_m: 0.32, rolling_resistance_coeff_road: 0.017, rolling_resistance_coeff_offroad: 0.085 },
        },
        suspension_types: {
            leaf_spring: { name: "Mola de Lâmina", cost: 5000, weight: 300, metal_cost: 500, comfort_mod: -0.10, offroad_maneuver_mod: -0.05, stability_mod: 0, reliability_mod: 0.05, description: "Durável, simples, barato, mas rodagem rígida e pouca articulação." },
            coil_spring: { name: "Mola Helicoidal", cost: 8000, weight: 400, metal_cost: 800, comfort_mod: 0.05, offroad_maneuver_mod: 0.05, stability_mod: 0, reliability_mod: 0, description: "Melhor conforto que lâmina, boa flexibilidade e controle. Mais cara." },
            christie: { name: "Christie", cost: 25000, weight: 600, metal_cost: 1500, speed_offroad_mult: 1.20, comfort_mod: 0.10, offroad_maneuver_mod: 0.10, stability_mod: 0, reliability_mod: -0.15, description: "Velocidade cross-country excepcional, boa mobilidade. Complexa, manutenção difícil, ocupa espaço interno." },
            horstmann: { name: "Horstmann", cost: 12000, weight: 500, metal_cost: 1200, comfort_mod: 0.10, stability_mod: 0.05, reliability_mod: -0.05, description: "Distribuição de carga eficaz, maior curso, fácil manutenção em campo. Compacta." },
            torsion_bar: { name: "Barra de Torção", cost: 35000, weight: 700, metal_cost: 2000, comfort_mod: 0.15, stability_mod: 0.05, internal_space_mod: 0.05, reliability_mod: -0.10, requires_stabilizer_cost: 5000, requires_stabilizer_weight: 50, description: "Rodagem suave, durabilidade, pouco volume interno. Risco de quebra, exige estabilizador de canhão." },
            hydropneumatic: { name: "Hidropneumática", cost: 100000, weight: 800, metal_cost: 5000, comfort_mod: 0.20, stability_mod: 0.10, offroad_maneuver_mod: 0.15, reliability_mod: -0.25, description: "Grande agilidade, melhor tração, estabilização de armas. Muito cara, complexa, menor vida útil, super-engenharia para o período." },
        },
        engines: {
            i4: { name: "I4", cost: 8000, weight: 350, metal_cost: 1200, min_power: 50, max_power: 150, base_consumption: 0.75, fire_risk: 0.10, base_reliability: 1.0, max_rpm: 3000 },
            i6: { name: "I6", cost: 12000, weight: 450, metal_cost: 1800, min_power: 100, max_power: 250, base_consumption: 0.8, fire_risk: 0.12, base_reliability: 1.05, max_rpm: 3200 },
            v6: { name: "V6", cost: 18000, weight: 500, metal_cost: 2500, min_power: 150, max_power: 350, base_consumption: 0.85, fire_risk: 0.15, base_reliability: 1.0, max_rpm: 3500 },
            v8: { name: "V8", cost: 25000, weight: 650, metal_cost: 3800, min_power: 300, max_power: 600, base_consumption: 0.9, fire_risk: 0.20, base_reliability: 0.95, max_rpm: 3800 },
            v12: { name: "V12", cost: 35000, weight: 850, metal_cost: 5000, min_power: 500, max_power: 900, base_consumption: 1.0, fire_risk: 0.25, base_reliability: 0.95, max_rpm: 4000 }, 
            radial_9_cyl: { name: "Radial 9 Cilindros", cost: 20000, weight: 550, metal_cost: 2800, min_power: 250, max_power: 500, base_consumption: 0.7, fire_risk: 0.10, silhouette_mod: 0.05, base_reliability: 0.95, max_rpm: 2800 },
            radial_14_cyl: { name: "Radial 14 Cilindros", cost: 30000, weight: 700, metal_cost: 4000, min_power: 450, max_power: 700, base_consumption: 0.8, fire_risk: 0.12, silhouette_mod: 0.07, base_reliability: 0.90, max_rpm: 3000 },
            opposed_piston: { name: "Oposto-Pistão", cost: 40000, weight: 950, metal_cost: 6000, min_power: 150, max_power: 850, base_consumption: 0.55, fire_risk: 0.08, base_reliability: 1.10, max_rpm: 3600 },
        },
        fuel_types: {
            gasoline: { name: "Gasolina", cost_mod: 1.0, consumption_mod: 1.0, fire_risk_mod: 0.05, power_mod: 1.0, energy_density: 34.8, description: "Padrão. Alta potência, partida fácil, mas volátil e inflamável." },
            diesel: { name: "Diesel", cost_mod: 1.10, consumption_mod: 0.7, fire_risk_mod: 0.02, power_mod: 0.95, energy_density: 38.6, description: "Maior eficiência, alto torque, menor inflamabilidade. Mais pesado e caro inicialmente." },
            kerosene: { name: "Querosene", cost_mod: 0.95, consumption_mod: 1.05, fire_risk_mod: 0.07, power_mod: 0.9, energy_density: 37.6, description: "Menos volátil que gasolina, mas tóxico e menor potência." },
            alcohol: { name: "Álcool", cost_mod: 1.15, consumption_mod: 1.25, fire_risk_mod: 0.08, power_mod: 1.05, energy_density: 23.5, description: "Maior octanagem, pode ser produzido localmente. Baixa densidade energética, corrosivo, caro." },
            wood_gas: { name: "Gás de Madeira", cost_mod: 0.90, consumption_mod: 1.50, fire_risk_mod: 0.01, power_mod: 0.7, weight_mod: 1.15, speed_mod: 0.9, energy_density: 10.0, description: "Recurso renovável, baixo custo. Baixa potência, equipamento pesado, ineficiente, reduz velocidade." },
        },
        engine_dispositions: {
            rear: { name: "Traseira", cost: 0, weight: 0, internal_space_mod: 0.05, silhouette_mod: -0.05, engine_vulnerability: 0.1, description: "Mais espaço para torre/combate, silhueta baixa, fácil manutenção. Menor proteção para motor." },
            front: { name: "Dianteira", cost: 0, weight: 0, internal_space_mod: -0.05, front_armor_bonus: 0.10, maneuverability_mod: -0.05, gun_depression_mod: -2, engine_vulnerability: 0.25, description: "Proteção adicional para tripulação (motor como blindagem). Dificulta manobrabilidade, maior chance de dano ao motor, limita depressão do canhão." },
            mid: { name: "Central", cost: 5000, weight: 100, internal_space_mod: -0.10, maneuverability_mod: 0.10, maintenance_cost_mod: 0.15, description: "Melhor distribuição de peso, manuseio e aceleração. Reduz espaço interno e dificulta manutenção." },
        },
        transmission_types: {
            basic_manual: { name: "Manual Básico (Caixa Seca)", cost: 0, weight: 0, speed_mod: 0.90, maneuver_mod: 0.85, reliability_mod: 0.05, comfort_mod: -0.10, fuel_efficiency_mod: 0.95, max_speed_road_limit: 30, max_speed_offroad_limit: 20, gear_ratios: [20.0, 14.0, 9.0, 5.0, 1.0], efficiency: 0.85, final_drive_ratio: 10.0, description: "Simples e robusta. Trocas de marcha difíceis, perda de potência em curvas, alta fadiga do motorista. Comum em veículos iniciais." },
            synchronized_manual: { name: "Manual Sincronizada", cost: 15000, weight: 50, speed_mod: 1.0, maneuver_mod: 0.95, reliability_mod: 0, comfort_mod: 0, fuel_efficiency_mod: 1.0, max_speed_road_limit: 50, max_speed_offroad_limit: 35, gear_ratios: [18.0, 13.0, 9.5, 7.0, 5.0, 3.0, 1.8, 1.0], efficiency: 0.88, final_drive_ratio: 8.5, description: "Melhora a facilidade e suavidade das trocas de marcha. Padrão para muitos veículos da Segunda Guerra Mundial." },
            wilson_preselector: { name: "Pré-seletora Wilson", cost: 50000, weight: 150, speed_mod: 1.05, maneuver_mod: 1.05, reliability_mod: -0.10, comfort_mod: 0.05, fuel_efficiency_mod: 0.92, max_speed_road_limit: 60, max_speed_offroad_limit: 40, gear_ratios: [16.0, 12.0, 8.5, 6.0, 4.0, 2.5, 1.5, 1.0], efficiency: 0.90, final_drive_ratio: 7.8, description: "Permite pré-selecionar a próxima marcha. Trocas rápidas e suaves, reduz fadiga do motorista. Complexa e mais cara. Usada em tanques britânicos." },
            maybach_olvar: { name: "Maybach OLVAR (OG 40 12 16 B)", cost: 100000, weight: 300, speed_mod: 1.10, maneuver_mod: 1.10, reliability_mod: -0.15, comfort_mod: 0.10, fuel_efficiency_mod: 0.85, max_speed_road_limit: 70, max_speed_offroad_limit: 45, gear_ratios: [15.0, 11.5, 9.0, 7.0, 5.5, 4.0, 2.5, 1.0], efficiency: 0.92, final_drive_ratio: 7.0, description: "Transmissão pré-seletora complexa com 8 marchas à frente. Usada em tanques alemães como o Tiger I/II. Oferece bom controle, mas é cara e exige manutenção." },
            merritt_brown: { name: "Merritt-Brown (TN.12)", cost: 150000, weight: 400, speed_mod: 1.15, maneuver_mod: 1.20, reliability_mod: -0.20, comfort_mod: 0.15, fuel_efficiency_mod: 0.95, max_speed_road_limit: 65, max_speed_offroad_limit: 50, gear_ratios: [14.0, 10.5, 8.0, 6.0, 4.5, 3.0, 1.8, 1.0], efficiency: 0.93, final_drive_ratio: 6.5, description: "Sistema diferencial triplo com direção regenerativa. Permite curvas com potência total e giro no próprio eixo. Altamente manobrável, mas muito complexa e cara. Usada em tanques britânicos." },
        },
        armor_production_types: {
            cast: { name: "Fundida", cost_mod: 1.0, weight_mod: 1.0, effective_armor_factor: 0.95, reliability_mod: -0.05, description: "Formas complexas/curvas, menos soldas. Menos resistente que RHA, difícil tratamento térmico." }, 
            rolled_homogeneous: { name: "Laminada Homogênea (RHA)", cost_mod: 1.0, weight_mod: 1.0, effective_armor_factor: 1.15, reliability_mod: 0, description: "Padrão da indústria. Mais resistente, produção em massa. Resulta em designs mais 'quadrados', mais soldas." }, 
            welded: { name: "Soldada", cost_mod: 1.05, weight_mod: 1.0, effective_armor_factor: 1.05, reliability_mod: -0.05, description: "Permite designs complexos/eficientes. Soldas podem ser pontos fracos (qualidade inicial), exige mão de obra qualificada." }, 
            riveted: { name: "Rebitada", cost_mod: 0.90, weight_mod: 1.10, effective_armor_factor: 0.85, reliability_mod: -0.05, description: "Placas unidas por rebites. Mais barato, mas rebites criam pontos fracos e podem se soltar sob impacto. Risco de estilhaços internos." }, 
            bolted: { name: "Parafusada", cost_mod: 0.95, weight_mod: 1.08, effective_armor_factor: 0.90, reliability_mod: -0.02, description: "Placas unidas por parafusos. Permite reparos mais fáceis, mas parafusos podem ser pontos fracos e se afrouxar. Menor risco de estilhaços que rebitada." }, 
        },
        armor_materials_and_additions: { // Grouped additional armor types
            face_hardened: { name: "Aço Carbonizado", cost: 3000, weight: 0, metal_cost: 0, effective_armor_mod: 1.0, internal_splinter_risk: 0.05, comfort_mod: -0.05, description: "Superfície dura, núcleo macio. Boa resistência contra projéteis iniciais, mas propenso a estilhaços internos, perigoso para tripulação." },
            spaced_armor: { name: "Blindagem Espaçada", cost: 15000, weight: 200, metal_cost: 250, effective_armor_bonus: 0.05, description: "Duas ou mais placas com espaço. Pode deformar projéteis cinéticos e detonar HEAT prematuramente. Adiciona peso e complexidade." }, 
            side_skirts: { name: "Saias Laterais (Schürzen)", cost: 5000, weight: 100, metal_cost: 100, effective_armor_bonus: 0.075, durability_mod: -0.5, description: "Placas finas laterais para deter fuzis AT e estilhaços. Frágeis e adicionam peso." }, 
            improvised_armor: { name: "Blindagem Improvisada (Sacos de Areia/Esteiras)", cost: 500, weight: 150, metal_cost: 0, effective_armor_bonus: 0.025, speed_mod: 0.98, maneuver_mod: 0.98, suspension_reliability_mod: -0.05, description: "Materiais como sacos de arena/elos de esteira. Proteção limitada contra projéteis leves/estilhaços. Peso adicional pode sobrecarregar suspensão e trem de força." } 
        },
        armaments: { // Base for main gun and secondary MGs
            coaxial_mg: { cost: 5000, weight: 15, metal_cost: 600, name: "Metralhadora Coaxial", main_gun_priority: 0 },
            bow_mg: { cost: 5000, weight: 15, metal_cost: 600, name: "Metralhadora de Casco", main_gun_priority: 0, armor_vulnerability_mod: 0.05, requires_crew_slot: true },
            aa_mg: { cost: 8000, weight: 20, metal_cost: 1000, name: "Metralhadora Antiaérea", main_gun_priority: 0, crew_exposure_risk: 0.10 },
            smoke_dischargers: { cost: 4000, weight: 10, metal_cost: 112.5, name: "Lançadores de Fumaça", main_gun_priority: 0 },
            grenade_mortars: { cost: 7000, weight: 50, metal_cost: 200, name: "Lançadores de Granadas/Morteiros", main_gun_priority: 0 },
        },
        gun_lengths: {
            short: { name: "Curto", velocity_mod: 0.85, accuracy_long_range_mod: 0.90, turret_maneuver_mod: 1.05, weight_mod: 0.90, cost_mod: 0.90, description: "Leve, manobrável, silhueta baixa. Baixa penetração, trajetória curva, flash alto. Melhor para suporte de infantaria e combate CQC." },
            medium: { name: "Médio", velocity_mod: 1.0, accuracy_long_range_mod: 1.0, turret_maneuver_mod: 1.0, weight_mod: 1.0, cost_mod: 1.0, description: "Equilíbrio, versatilidade." },
            long: { velocity_mod: 1.15, accuracy_long_range_mod: 1.10, turret_maneuver_mod: 0.95, weight_mod: 1.10, cost_mod: 1.10, description: "Alta velocidade de saída, melhor penetração, trajetória plana. Pesado, longo, silhueta alta, exige mais tempo de mira. Melhor para combate antitanque a longa distância." },
        },
        reload_mechanisms: {
            manual: { name: "Manual", cost: 0, weight: 0, rpm_modifier: 1.0, crew_burden: 1.0, reliability_mod: 0, description: "Simples, barato, leve. Cadência de tiro depende da tripulação e calibre, fadiga." },
            autoloader: { name: "Autoloader", cost: 75000, weight: 750, rpm_modifier: 1.5, crew_burden: 0, reliability_mod: -0.30, description: "Cadência de tiro consistente e alta, reduz tripulação. Muito caro, pesado, complexo, propenso a falhas (para o período)." }, // Higher cost/weight for early WWII context
        },
        ammo_types: {
            ap: { name: "AP", cost_per_round: 150, weight_per_round: 10, description: "Projétil sólido de aço endurecido para penetrar blindagem por energia cinética." },
            aphe: { name: "APHE", cost_per_round: 200, weight_per_round: 12, description: "Projétil AP com pequena carga explosiva interna que detona após a penetração." },
            he: { name: "HE", cost_per_round: 100, weight_per_round: 15, description: "Projétil com grande carga explosiva, eficaz contra infantaria e fortificações." },
            apcr: { name: "APCR/HVAP", cost_per_round: 300, weight_per_round: 8, description: "Projétil com núcleo de alta densidade disparado em alta velocidade. Excelente penetração a curta/média distância." },
        },
        equipment: {
            radio_equipment: { cost: 20000, weight: 25, metal_cost: 600, name: "Rádio", coordination_bonus: 0.10, description: "Melhora drasticamente a coordenação tática e a comunicação. Ocupa espaço." },
            extra_fuel: { cost: 1500, weight: 300, metal_cost: 75, name: "Tanques Extras de Combustível", range_bonus_percent: 0.50, external_fire_risk: 0.05, description: "Aumenta significativamente o raio de ação. Vulneráveis a fogo inimigo, podem vazar ou pegar fogo externamente." },
            dispenser_minas: { cost: 4500, weight: 200, metal_cost: 225, name: "Dispenser de Minas", description: "Permite a colocação rápida de campos minados para defesa ou armadilha." },
            terraformacao: { cost: 50000, weight: 5000, metal_cost: 1500, name: "Ferramentas de Engenharia (Terraformação)", description: 'Capacidades de engenharia como \'cavar trincheiras\' ou \'remover obstáculos\'.' },
            dozer_blades: { cost: 10000, weight: 1000, metal_cost: 500, name: "Lâminas de Escavadeira", front_armor_bonus: 0.05, description: "Permite limpeza de obstáculos e criação de posições defensivas. Proteção frontal adicional. Adiciona peso significativo." },
            floatation_wading_gear: { cost: 40000, weight: 2000, metal_cost: 1000, name: "Flutuadores/Wading Gear", amphibious_capability: true, water_speed_penalty: 0.5, system_vulnerability: 0.20, description: "Habilita capacidade anfíbia. Adiciona peso e volume massivos, tornando o tanque lento na água e vulnerável." },
            mine_flails: { cost: 30000, weight: 1500, metal_cost: 750, name: "Equipamento de Limpeza de Minas", operation_speed_penalty: 0.7, driver_visibility_penalty: 0.15, engine_overheat_risk: 0.10, description: "Limpa campos minados. Lento, ruidoso, pode cegar motorista e superaquecer motor." },
            APU: { cost: 10000, weight: 80, metal_cost: 350, name: "Unidade de Potência Auxiliar (APU)", idle_fuel_consumption_reduction: 0.5, thermal_signature_reduction: 0.05, description: "Pequeno motor secundário. Reduz consumo de combustível e assinatura IR em modo estacionário. Adiciona complexidade." },
            improved_optics: { cost: 15000, weight: 10, metal_cost: 400, name: "Ópticas Melhoradas", accuracy_bonus: 0.05, target_acquisition_bonus: 0.10, description: "Sistemas de mira e observação de alta qualidade. Melhoram aquisição de alvos, precisão e consciência situacional." },
        }
    },
    crew_roles: {
        commander: { name: "Comandante", base_efficiency: 1.0 },
        gunner: { name: "Artilheiro", base_efficiency: 1.0 },
        loader: { name: "Municiador", base_efficiency: 1.0 },
        driver: { name: "Motorista", base_efficiency: 1.0 },
        radio_operator_bow_gunner: { name: "Operador de Rádio/Metralhador de Casco", base_efficiency: 1.0 },
    },
    // Constants for calculations
    constants: {
        armor_cost_per_mm: 200, 
        armor_metal_cost_per_mm: 10,
        armor_weight_per_mm_per_sqm: 7.85, // kg per square meter per mm thickness
        avg_hull_surface_area_sqm: { // Approximate surface areas for average tank sizes (simplified)
            front: 2.0,
            side: 5.0,
            rear: 1.5,
            top: 8.0,
            bottom: 8.0,
            turret_base: 3.0 // For turret armor calculation base area
        },
        // Fixed default armor for simplified parts
        default_armor_rear_mm: 20,
        default_armor_top_mm: 15,
        default_armor_bottom_mm: 10,
        default_armor_side_angle: 30, // degrees from vertical
        default_armor_rear_angle: 0, // degrees from vertical
        default_armor_turret_angle: 45, // degrees from vertical

        crew_comfort_base: 100, // Base comfort score (out of 100)
        crew_comfort_penalty_per_crewman: 5, // Penalty per crewman (less space, more heat etc)
        crew_comfort_penalty_per_armor_volume: 0.0001, // Arbitrary penalty for internal armor volume
        power_to_weight_speed_factor_road: 4.0, // Aumentado para maior impacto na velocidade
        power_to_weight_speed_factor_offroad: 3.0, // Aumentado para maior impacto na velocidade
        base_fuel_capacity_liters: 500, // Adjusted to Tiger I ~530L
        fuel_capacity_per_extra_tank: 200, // Liters per extra fuel tank
        base_fuel_efficiency_km_per_liter: 0.01, // Base km per liter efficiency (very low to get high consumption)
        fuel_consumption_per_hp_per_kg_factor: 1.8, // Adjusted to get realistic L/100km for Tiger I
        hp_reliability_penalty_threshold: 400, // HP beyond this starts penalizing reliability
        hp_reliability_penalty_factor: 0.00005, 
        base_reliability: 1.0, // 100%
        tiger_i_target_cost: 721670.00, // Target cost for Tiger I equivalent

        // Base max crew for each vehicle type (can be overridden by specific vehicle type)
        base_max_crew_by_type: {
            tankette: 2,
            armored_car: 3,
            halftrack: 3,
            carro_combate: 4,
            transporte_infantaria: 3,
            tanque_leve: 3,
            tanque_medio: 5,
            tanque_pesado: 5, // Tiger I had 5 crew
            super_pesado: 6,
            multi_turret_tank: 6,
            tank_destroyer: 4,
            assault_gun: 4,
            command_vehicle: 3,
            engineering_vehicle: 3,
            artilharia_simples: 2,
            artilharia_autopropulsada: 4,
            artilharia_antiaerea: 3,
            aa_autopropulsada: 3,
        },
        // Factors for country cost reduction based on Civil Tech and Urbanization
        max_tech_civil_level: 200, // Max expected civil tech level (ajustado para 200)
        max_urbanization_level: 100, // Max expected urbanization level (ajustado para 100)
        // Ajustados para que Reino Unido (Tec Civil 165, Urbanização 60) tenha ~45% de bônus de custo
        civil_tech_cost_reduction_factor: 0.32, // Max 32% reduction from civil tech (ajustado)
        urbanization_cost_reduction_factor: 0.30 // Max 30% reduction from urbanization (ajustado)
    }
};

// --- FUNÇÕES AUXILIARES ---

// Função auxiliar para limpar e parsear float
function cleanAndParseFloat(value) {
    if (typeof value !== 'string') {
        return parseFloat(value) || 0; 
    }
    // Adicionado .trim() para remover espaços em branco extras
    // Remove o símbolo de libra, todos os pontos (separadores de milhar) e substitui vírgula por ponto (separador decimal)
    const cleanedValue = value.trim().replace('£', '').replace(/\./g, '').replace(',', '.').replace('%', ''); 
    return parseFloat(cleanedValue) || 0; 
}

// Função para parsear CSV e retornar um array de objetos
async function parseCSV(url) {
    console.log(`Attempting to fetch CSV from: ${url}`);
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Network response was not ok for ${url}: ${response.status} ${response.statusText}`, errorText);
            throw new Error(`Erro ao carregar CSV de ${url}: ${response.statusText}. Por favor, verifique se a planilha está 'Publicada na web' como CSV.`);
        }
        const csvText = await response.text();
        console.log(`CSV fetched successfully from ${url}. Raw text length: ${csvText.length}`);

        const lines = csvText.trim().split('\n');
        if (lines.length === 0) {
            console.warn(`CSV from ${url} has no data lines.`);
            return []; // Retorna um array vazio em vez de undefined
        }

        // Parse headers from the first line using a more robust approach
        const headerLine = lines[0];
        const rawHeaders = [];
        let inQuote = false;
        let currentHeader = '';
        for (let i = 0; i < headerLine.length; i++) {
            const char = headerLine[i];
            if (char === '"') {
                inQuote = !inQuote;
                currentHeader += char; // Keep the quote if it's part of the field (e.g., for `""` escape)
            } else if (char === ',' && !inQuote) {
                rawHeaders.push(currentHeader.trim());
                currentHeader = '';
            } else {
                currentHeader += char;
            }
        }
        rawHeaders.push(currentHeader.trim()); // Add the last header

        // Filter out empty headers to avoid issues with extra commas at the end of the header row in the sheet
        const headers = rawHeaders.filter(h => h !== ''); 
        console.log(`CSV Raw Headers for ${url}:`, rawHeaders);
        console.log(`CSV Cleaned Headers for ${url}:`, headers);

        const data = []; 
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i];
            const values = [];
            inQuote = false;
            let currentValue = '';
            for (let charIndex = 0; charIndex < line.length; charIndex++) {
                const char = line[charIndex];
                if (char === '"') {
                    inQuote = !inQuote;
                    currentValue += char; // Keep the quote if it's part of the field (e.g., for `""` escape)
                } else if (char === ',' && !inQuote) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue.trim()); // Add the last field

            // Clean up values: remove leading/trailing quotes if they were meant as delimiters
            const cleanedValues = values.map(val => {
                if (val.startsWith('"') && val.endsWith('"') && val.length > 1) {
                    return val.substring(1, val.length - 1).replace(/""/g, '"'); // Handle escaped quotes
                }
                return val;
            });

            // Ensure we have enough values for all *cleaned* headers
            if (cleanedValues.length >= headers.length) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    // Map values to headers. If values array is longer, extra values are ignored.
                    // If values array is shorter, remaining headers will be undefined, handled by cleanAndParseFloat
                    row[headers[j]] = cleanedValues[j];
                }
                data.push(row);
            } else {
                console.warn(`Skipping malformed row in ${url} (line ${i + 1}): Expected at least ${headers.length} columns, got ${cleanedValues.length}. Raw Line: "${lines[i]}"`);
            }
        }
        console.log(`Parsed ${data.length} rows from ${url}. First row example:`, data[0]);
        // Add a specific log for the UK data if it's in the parsed data
        const ukData = data.find(row => row['País'] === 'Reino Unido');
        if (ukData) {
            console.log(`Parsed UK data from ${url}:`, ukData);
        }
        return data;
    } catch (error) {
        console.error(`Erro na requisição de rede para ${url}:`, error);
        throw new Error(`Erro na requisição de rede para ${url}. Isso pode ser devido a problemas de conexão ou à planilha não estar 'Publicada na web' como CSV. Detalhes: ${error.message}`);
    }
}

// Carrega dados das planilhas do Google Sheets
async function loadGameDataFromSheets() {
    const countryDropdown = document.getElementById('country_doctrine');
    countryDropdown.innerHTML = '<option value="loading">Carregando dados...</option>';
    countryDropdown.disabled = true;

    try {
        // Carregar todas as planilhas em paralelo para melhor performance
        const [countryStatsRaw, veiculosRaw, metaisRaw] = await Promise.all([ 
            parseCSV(COUNTRY_STATS_URL),
            parseCSV(VEICULOS_URL),
            parseCSV(METAIS_URL)
        ]);

        console.log("Dados brutos da aba Geral (Country Stats):", countryStatsRaw);
        console.log("Dados brutos da aba Veiculos:", veiculosRaw);
        console.log("Dados brutos da aba Metais:", metaisRaw);

        const tempCountries = {};

        // 1. Processar dados da aba "Geral" (COUNTRY_STATS_URL) para popular os países base
        countryStatsRaw.forEach(row => {
            const countryName = row['País'] ? row['País'].trim() : ''; 
            if (countryName) {
                tempCountries[countryName] = {
                    tech_civil: cleanAndParseFloat(row['Tec']), 
                    urbanization: cleanAndParseFloat(row['Urbanização']), 
                    production_capacity: 0, 
                    tech_level_vehicles: 0,
                    metal_balance: 0
                };
                console.log(`Raw data for ${countryName} from General tab: Tec='${row['Tec']}', Urbanização='${row['Urbanização']}'`);
                console.log(`Parsed data for ${countryName}: tech_civil=${tempCountries[countryName].tech_civil}, urbanization=${tempCountries[countryName].urbanization}`);
            } else {
                console.warn(`Linha ignorada na aba Geral por falta de nome de país:`, row);
            }
        });

        // 2. Mesclar dados da aba "Veiculos"
        veiculosRaw.forEach(row => {
            const countryName = row['País'] ? row['País'].trim() : ''; 
            if (countryName && tempCountries[countryName]) { 
                tempCountries[countryName].production_capacity = cleanAndParseFloat(row['Capacidade de produção']);
                tempCountries[countryName].tech_level_vehicles = cleanAndParseFloat(row['Nível Veiculos']);
                console.log(`Raw data for ${countryName} from Veiculos tab: Capacidade de produção='${row['Capacidade de produção']}', Nível Veiculos='${row['Nível Veiculos']}'`);
                console.log(`Parsed data for ${countryName}: production_capacity=${tempCountries[countryName].production_capacity}, tech_level_vehicles=${tempCountries[countryName].tech_level_vehicles}`);
            } else if (countryName) {
                console.warn(`País "${countryName}" da aba Veiculos não encontrado na base de países (aba Geral) para mesclagem. Linha:`, row);
            }
        });

        // 3. Mesclar dados da aba "Metais"
        metaisRaw.forEach(row => {
            const countryName = row['País'] ? row['País'].trim() : ''; 
            if (countryName && tempCountries[countryName]) { 
                tempCountries[countryName].metal_balance = cleanAndParseFloat(row['Saldo']); 
            } else if (countryName) {
                console.warn(`País "${countryName}" da aba Metais não encontrado na base de países (aba Geral) para mesclagem. Linha:`, row);
            }
        });
        
        // Adiciona um país genérico/padrão caso não exista nos dados
        tempCountries["Genérico / Padrão"] = tempCountries["Genérico / Padrão"] || {};
        tempCountries["Genérico / Padrão"].production_capacity = tempCountries["Genérico / Padrão"].production_capacity || 100000000;
        tempCountries["Genérico / Padrão"].metal_balance = tempCountries["Genérico / Padrão"].metal_balance || 5000000;
        tempCountries["Genérico / Padrão"].tech_level_vehicles = tempCountries["Genérico / Padrão"].tech_level_vehicles || 50;
        tempCountries["Genérico / Padrão"].tech_civil = tempCountries["Genérico / Padrão"].tech_civil || 50;
        tempCountries["Genérico / Padrão"].urbanization = tempCountries["Genérico / Padrão"].urbanization || 50;

        gameData.countries = tempCountries;
        console.log("Objeto gameData.countries final:", gameData.countries);
        console.log("Dados do Reino Unido após carregamento:", gameData.countries["Reino Unido"]);


        populateCountryDropdown();
        countryDropdown.disabled = false;
        updateCalculations(); // Chama os cálculos iniciais após o carregamento dos dados

    } catch (error) {
        console.error("Erro fatal ao carregar dados das planilhas:", error);
        countryDropdown.innerHTML = '<option value="error">Erro ao carregar dados</option>';
        countryDropdown.disabled = true;
        // Fallback para dados genéricos se o carregamento falhar
        gameData.countries = { "Genérico / Padrão": { production_capacity: 100000000, metal_balance: 5000000, tech_level_vehicles: 50, tech_civil: 50, urbanization: 50 } };
        populateCountryDropdown();
        countryDropdown.disabled = false;
        updateCalculations();
        document.getElementById('status').textContent = `Erro ao carregar dados externos: ${error.message}. Por favor, verifique os URLs das planilhas e se estão 'Publicadas na web' como CSV.`;
        document.getElementById('status').className = "status-indicator status-error";
    }
}

// Popula o dropdown de países com base nos dados do gameData.countries
function populateCountryDropdown() {
    const dropdown = document.getElementById('country_doctrine');
    dropdown.innerHTML = ''; // Limpa as opções existentes
    const sortedCountries = Object.keys(gameData.countries).sort();
    sortedCountries.forEach(countryName => {
        const option = document.createElement('option');
        option.value = countryName;
        option.textContent = countryName;
        dropdown.appendChild(option);
    });
    if (gameData.countries["Genérico / Padrão"]) {
        dropdown.value = "Genérico / Padrão";
    }
}

// Obtém o texto da opção selecionada em um dropdown
function getSelectedText(elementId) {
    const selectEl = document.getElementById(elementId);
    if (selectEl && selectEl.selectedIndex >= 0) {
        return selectEl.options[selectEl.selectedIndex].text;
    }
    return 'N/A';
}

// Calcula a blindagem efetiva com base na espessura e ângulo
function calculateEffectiveArmor(thickness, angle) {
    if (thickness <= 0) return 0;
    const angleRad = angle * (Math.PI / 180);
    return thickness / Math.cos(angleRad);
}

/**
 * Calculates the detailed performance characteristics of a tank based on its physical and mechanical properties.
 * @param {object} stats - An object containing all the tank's specifications.
 * @param {number} stats.weightTonnes - The total combat weight of the tank in metric tonnes.
 * @param {object} stats.engine - Engine specifications.
 * @param {number} stats.engine.powerHp - The engine's gross horsepower.
 * @param {number} stats.engine.maxRpm - The engine's maximum revolutions per minute.
 * @param {object} stats.transmission - Transmission specifications.
 * @param {number} stats.transmission.efficiency - The drivetrain efficiency (e.g., 0.85 for 85%).
 * @param {number[]} stats.transmission.gearRatios - An array of gear ratios, from 1st gear upwards.
 * @param {number} stats.transmission.finalDriveRatio - The final drive ratio.
 * @param {object} stats.chassis - Chassis and dimensional specifications.
 * @param {number} stats.chassis.driveSprocketRadiusM - The radius of the drive sprocket in meters.
 * @param {number} stats.chassis.frontalAreaM2 - The frontal cross-sectional area in square meters.
 * @param {number} stats.chassis.dragCoefficient - The dimensionless aerodynamic drag coefficient.
 * @param {object} stats.environment - The environmental conditions for the calculation.
 * @param {number} stats.environment.rollingResistanceCoeff - The dimensionless rolling resistance coefficient for the terrain.
 * @param {number} stats.environment.slopeDegrees - The slope of the terrain in degrees (positive for uphill).
 * @param {number} stats.environment.airDensity - The density of air in kg/m^3.
 * @returns {object} A comprehensive performance profile.
 */
function calculateTankPerformance(stats) {
    // --- 1. Constants and Unit Conversions ---
    const G = 9.81; // Acceleration due to gravity (m/s^2)
    const HP_TO_WATTS = 745.7; // 1 HP = 745.7 Watts
    const KMH_TO_MS = 1 / 3.6; // 1 km/h = 1/3.6 m/s

    const massKg = stats.weightTonnes * 1000;
    const weightN = massKg * G;
    const enginePowerWatts = stats.engine.powerHp * HP_TO_WATTS;
    const effectivePowerWatts = enginePowerWatts * stats.transmission.efficiency;

    // --- 2. Calculate Resistive Forces as a function of velocity (v in m/s) ---
    const slopeRadians = (stats.environment.slopeDegrees || 0) * (Math.PI / 180);
    const gradeResistanceN = weightN * Math.sin(slopeRadians);

    // This function calculates the total resistive force for a given velocity.
    const getTotalResistanceForce = (v_ms) => {
        const rollingResistanceN = stats.environment.rollingResistanceCoeff * weightN * Math.cos(slopeRadians);
        const dragResistanceN = 0.5 * (stats.environment.airDensity || 1.225) * stats.chassis.frontalAreaM2 * stats.chassis.dragCoefficient * Math.pow(v_ms, 2);
        return rollingResistanceN + dragResistanceN + gradeResistanceN;
    };

    // --- 3. Solve for Equilibrium Velocity (Theoretical Top Speed) ---
    // We are solving for v where PropulsiveForce(v) = TotalResistanceForce(v)
    // PropulsiveForce = Power / v  =>  Power = TotalResistanceForce * v
    // effectivePowerWatts = (getTotalResistanceForce(v)) * v
    // This is a complex equation, so we use a numerical method (iterative search) to find the velocity.
    
    let equilibriumVelocity_ms = 0;
    let high = 70 * KMH_TO_MS; // Max possible speed in m/s (e.g., 70 km/h), a safe upper bound
    let low = 0;
    let mid;

    for (let i = 0; i < 100; i++) { // 100 iterations for high precision
        mid = (high + low) / 2;
        if (mid < 0.001) { // Break if velocity is very small to avoid infinite loops near zero
            equilibriumVelocity_ms = 0;
            break; 
        }
        
        const resistivePower = getTotalResistanceForce(mid) * mid;

        if (resistivePower > effectivePowerWatts) {
            high = mid; // Too fast, resistance is too high, lower the max speed
        } else {
            low = mid; // Can go faster, resistance is lower than available power
        }
        equilibriumVelocity_ms = low;
    }
    

    // --- 4. Calculate Mechanically-Limited Top Speed from Gearing ---
    // Assuming topGearRatio is the smallest numerical ratio for highest speed
    const topGearRatio = stats.transmission.gearRatios.reduce((min, current) => Math.min(min, current), Infinity); 
    
    const maxWheelRpm = stats.engine.maxRpm / (topGearRatio * stats.transmission.finalDriveRatio);
    const maxWheelRps = maxWheelRpm / 60;
    const sprocketCircumferenceM = 2 * Math.PI * stats.chassis.driveSprocketRadiusM;
    const mechanicalTopSpeed_ms = maxWheelRps * sprocketCircumferenceM;

    // --- 5. Determine Final Top Speed ---
    // The true top speed is the lesser of what is physically possible (equilibrium) and mechanically possible (gearing).
    let finalTopSpeed_ms = Math.min(equilibriumVelocity_ms, mechanicalTopSpeed_ms);
    let finalTopSpeed_kmh = finalTopSpeed_ms * 3.6;

    // Apply transmission speed limits
    if (stats.transmission.max_speed_road_limit && stats.environment.rollingResistanceCoeff < 0.05) { // Apply road limit only on low resistance
        finalTopSpeed_kmh = Math.min(finalTopSpeed_kmh, stats.transmission.max_speed_road_limit);
    }
    if (stats.transmission.max_speed_offroad_limit && stats.environment.rollingResistanceCoeff >= 0.05) { // Apply off-road limit on higher resistance
        finalTopSpeed_kmh = Math.min(finalTopSpeed_kmh, stats.transmission.max_speed_offroad_limit);
    }

    // --- 6. Calculate Acceleration Proxy (Effective Power-to-Weight) ---
    const effectiveHpPerTonne = (stats.engine.powerHp * stats.transmission.efficiency) / stats.weightTonnes;
    const terrainResistanceFactor = 1 + stats.environment.rollingResistanceCoeff * 10; // Heuristic factor for acceleration
    const accelerationScore = effectiveHpPerTonne / terrainResistanceFactor; // Higher is better

    return {
        topSpeedKmh: finalTopSpeed_kmh,
        theoreticalEquilibriumSpeedKmh: equilibriumVelocity_ms * 3.6,
        mechanicalLimitSpeedKmh: mechanicalTopSpeed_ms * 3.6,
        powerToWeightRatio: stats.engine.powerHp / stats.weightTonnes,
        accelerationScore: accelerationScore,
        // gearPerformance: gearPerformance // Removed for simplicity in this iteration, can be re-added
    };
}


// --- FUNÇÃO PRINCIPAL DE CÁLCULO E ATUALIZAÇÃO DA UI ---
// Esta função agora também retorna os dados calculados para serem salvos
function updateCalculations() {
    let baseUnitCost = 0; // Custo antes dos modificadores globais (país, doutrina)
    let baseMetalCost = 0; // Custo de metal antes dos modificadores globais
    let totalWeight = 0;
    let totalPower = 0;
    let effectiveArmorFront = 0;
    let effectiveArmorSide = 0;
    let totalReliability = gameData.constants.base_reliability; // Começa em 1.0 (100%)
    let crewComfort = gameData.constants.crew_comfort_base; // Começa em 100

    // Multiplicadores (inicializados em 1)
    let speedRoadMultiplier = 1;
    let speedOffroadMultiplier = 1;
    let armorEffectiveMultiplier = 1; // Para o tipo de produção da blindagem
    let maneuverabilityMultiplier = 1;
    let fuelConsumptionMultiplier = 1;
    let overallReliabilityMultiplier = 1;
    let internalSpaceMultiplier = 1; // Afeta o conforto da tripulação e potencialmente outras coisas
    let gunDepressionModifier = 0; // Graus
    let silhouetteModifier = 0; // Afeta visibilidade/chance de acerto

    let mainArmamentText = 'N/A';
    let mainArmamentCaliber = 0;
    let mainGunLengthDescription = ''; // Descrição do comprimento do canhão

    const vehicleName = document.getElementById('vehicle_name').value || 'Blindado Sem Nome';
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    let numCrewmen = parseInt(document.getElementById('num_crewmen').value) || 0;


    // --- 1. País de Origem / Doutrina ---
    const selectedCountryName = document.getElementById('country_doctrine').value;
    const countryData = gameData.countries[selectedCountryName];
    const countryBonusNoteEl = document.getElementById('country_bonus_note');
    let countryProductionCapacity = 0; 
    let countryMetalBalance = 0; 
    let countryTechLevelVehicles = 50; // Default
    let countryCostReductionFactor = 0; 

    if (countryData) {
        countryProductionCapacity = parseFloat(countryData.production_capacity) || 0;
        countryMetalBalance = parseFloat(countryData.metal_balance) || 0;
        countryTechLevelVehicles = parseFloat(countryData.tech_level_vehicles) || 50;
        
        const civilTechLevel = Math.min(parseFloat(countryData.tech_civil) || 0, gameData.constants.max_tech_civil_level);
        const urbanizationLevel = Math.min(parseFloat(countryData.urbanization) || 0, gameData.constants.max_urbanization_level);

        let civilTechReduction = (civilTechLevel / gameData.constants.max_tech_civil_level) * gameData.constants.civil_tech_cost_reduction_factor;
        let urbanizationReduction = (urbanizationLevel / gameData.constants.max_urbanization_level) * gameData.constants.urbanization_cost_reduction_factor;

        countryCostReductionFactor = Math.min(0.75, civilTechReduction + urbanizationReduction); 
        
        countryBonusNoteEl.textContent = `Bônus de ${selectedCountryName}: Tec Veículos ${countryTechLevelVehicles}, Tec Civil ${civilTechLevel}, Urbanização ${urbanizationLevel}. Redução de Custo total: ${(countryCostReductionFactor * 100).toFixed(1)}%.`;
    } else {
        countryBonusNoteEl.textContent = '';
    }

    const selectedTankDoctrine = document.getElementById('tank_doctrine').value;
    const doctrineData = gameData.doctrines[selectedTankDoctrine]; 
    const doctrineNoteEl = document.getElementById('doctrine_note');
    let doctrineCostModifier = 1; 
    let doctrineMaxCrewMod = 0;
    let doctrineName = '-';
    if (doctrineData) {
        doctrineCostModifier = doctrineData.cost_modifier;
        speedRoadMultiplier *= doctrineData.speed_modifier;
        speedOffroadMultiplier *= doctrineData.speed_modifier;
        doctrineMaxCrewMod = doctrineData.max_crew_mod || 0;
        doctrineName = doctrineData.name;
        doctrineNoteEl.textContent = `Doutrina de ${doctrineData.name}: ${doctrineData.description}`;
    } else {
        doctrineNoteEl.textContent = '';
    }


    // --- 2. Tipo de Veículo (Chassi) ---
    const vehicleType = document.getElementById('vehicle_type').value;
    let typeData = null; 
    let currentMaxCrew = 0; // Max crew for the current vehicle type
    let vehicleTypeName = '-';

    if (vehicleType && gameData.components.vehicle_types[vehicleType.split('(')[0].trim()]) { // Adjusted to get base name
        typeData = gameData.components.vehicle_types[vehicleType.split('(')[0].trim()]; // Adjusted to get base name
        baseUnitCost += typeData.cost;
        baseMetalCost += typeData.metal_cost || 0; // Added || 0
        totalWeight += typeData.weight;
        currentMaxCrew = typeData.max_crew; 
        vehicleTypeName = typeData.name;
        document.getElementById('display_type').textContent = typeData.name;
        document.getElementById('display_doctrine').textContent = doctrineData ? doctrineData.name : '-';
    } else {
        document.getElementById('display_type').textContent = '-';
        document.getElementById('display_doctrine').textContent = '-';
    }
    
    // Apply doctrine max crew modifier
    currentMaxCrew += doctrineMaxCrewMod;
    currentMaxCrew = Math.max(2, currentMaxCrew); 

    // Clamp numCrewmen to max allowed by vehicle type/doctrine
    numCrewmen = Math.min(numCrewmen, currentMaxCrew);
    document.getElementById('num_crewmen').value = numCrewmen;
    document.getElementById('num_crewmen').max = currentMaxCrew;


    // --- 3. Tipo de Locomoção ---
    const mobilityType = document.getElementById('mobility_type').value.split('(')[0].trim(); // Adjusted to get base name
    let mobilityData = null; 
    let mobilityTypeName = '-';
    if (mobilityType && gameData.components.mobility_types[mobilityType]) { 
        mobilityData = gameData.components.mobility_types[mobilityType];
        baseUnitCost += mobilityData.cost;
        baseMetalCost += mobilityData.metal_cost || 0; // Added || 0
        totalWeight += mobilityData.weight;
        speedRoadMultiplier *= mobilityData.speed_road_mult;
        speedOffroadMultiplier *= mobilityData.speed_offroad_mult;
        overallReliabilityMultiplier *= (1 - mobilityData.maintenance_mod);
        mobilityTypeName = mobilityData.name;
    }

    // --- 3.2 Suspensão ---
    const suspensionType = document.getElementById('suspension_type').value.split('(')[0].trim(); // Adjusted to get base name
    let suspensionData = null; 
    const suspensionNoteEl = document.getElementById('suspension_note');
    let suspensionTypeName = '-';
    let suspensionDescription = '';
    if (suspensionType && gameData.components.suspension_types[suspensionType]) { 
        suspensionData = gameData.components.suspension_types[suspensionType];
        baseUnitCost += suspensionData.cost;
        baseMetalCost += suspensionData.metal_cost || 0; // Added || 0
        totalWeight += suspensionData.weight;
        crewComfort += suspensionData.comfort_mod * gameData.constants.crew_comfort_base;
        speedOffroadMultiplier *= (suspensionData.speed_offroad_mult || 1);
        maneuverabilityMultiplier *= (1 + (suspensionData.offroad_maneuver_mod || 0));
        overallReliabilityMultiplier *= (1 + (suspensionData.reliability_mod || 0));
        suspensionNoteEl.textContent = suspensionData.description;
        suspensionTypeName = suspensionData.name;
        suspensionDescription = suspensionData.description;

        if (suspensionType === 'torsion_bar' && suspensionData.requires_stabilizer_cost) {
            baseUnitCost += suspensionData.requires_stabilizer_cost;
            totalWeight += suspensionData.requires_stabilizer_weight;
        }
    } else {
        suspensionNoteEl.textContent = '';
    }

    // --- 4. Motor e Propulsão ---
    const engineType = document.getElementById('engine_type').value.split('(')[0].trim(); // Adjusted to get base name
    const enginePower = parseInt(document.getElementById('engine_power').value) || 0;
    let engineData = null; 
    const engineNoteEl = document.getElementById('engine_power_note');
    let engineTypeName = '-';
    let enginePowerNote = '';
    if (engineType && gameData.components.engines[engineType]) { 
        engineData = gameData.components.engines[engineType];
        engineTypeName = engineData.name;
        if (enginePower < engineData.min_power || enginePower > engineData.max_power) {
            enginePowerNote = `Potência deve estar entre ${engineData.min_power} e ${engineData.max_power} HP para ${engineData.name}.`;
            totalPower = 0;
        } else {
            enginePowerNote = `${engineData.description} Potência min/max: ${engineData.min_power}/${engineData.max_power} HP. Consumo base: ${engineData.base_consumption.toFixed(2)} L/HP.`;
            baseUnitCost += engineData.cost;
            baseMetalCost += engineData.metal_cost || 0; // Added || 0
            totalWeight += engineData.weight;
            totalPower = enginePower;
            overallReliabilityMultiplier *= engineData.base_reliability;

            if (enginePower > gameData.constants.hp_reliability_penalty_threshold) {
                const hpExcess = enginePower - gameData.constants.hp_reliability_penalty_threshold;
                overallReliabilityMultiplier -= hpExcess * gameData.constants.hp_reliability_penalty_factor;
            }
        }
        engineNoteEl.textContent = enginePowerNote;
    } else {
        engineNoteEl.textContent = 'Selecione um tipo de motor válido.';
    }

    const fuelType = document.getElementById('fuel_type').value;
    let fuelData = null; 
    const fuelNoteEl = document.getElementById('fuel_note');
    let fuelTypeName = '-';
    let fuelTypeDescription = '';
    if (fuelType && gameData.components.fuel_types[fuelType]) { 
        fuelData = gameData.components.fuel_types[fuelType];
        fuelTypeName = fuelData.name;
        fuelTypeDescription = fuelData.description;
        // Ensure engineData is valid before using its properties for metal cost calculation
        if (engineData) { 
            baseUnitCost += (engineData.cost * (fuelData.cost_mod - 1));
            baseMetalCost += (engineData.metal_cost || 0) * (fuelData.cost_mod - 1); // Added || 0
        }
        
        fuelConsumptionMultiplier *= fuelData.consumption_mod;
        totalPower *= fuelData.power_mod;
        overallReliabilityMultiplier *= (1 - fuelData.fire_risk_mod); 
        if (fuelData.weight_mod) totalWeight *= fuelData.weight_mod;
        if (fuelData.speed_mod) {
            speedRoadMultiplier *= fuelData.speed_mod;
            speedOffroadMultiplier *= fuelData.speed_mod;
        }
        fuelNoteEl.textContent = fuelData.description;
    }

    const engineDisposition = document.getElementById('engine_disposition').value;
    let dispositionData = null; 
    let engineDispositionName = '-';
    let engineDispositionDescription = '';
    if (engineDisposition && gameData.components.engine_dispositions[engineDisposition]) { 
        dispositionData = gameData.components.engine_dispositions[engineDisposition];
        baseUnitCost += dispositionData.cost;
        // No metal_cost for engine disposition, so no change needed here
        totalWeight += dispositionData.weight;
        internalSpaceMultiplier *= (1 + (dispositionData.internal_space_mod || 0));
        maneuverabilityMultiplier *= (1 + (dispositionData.maneuverability_mod || 0));
        silhouetteModifier += (dispositionData.silhouette_mod || 0);
        gunDepressionModifier += (dispositionData.gun_depression_mod || 0);
        overallReliabilityMultiplier *= (1 - (dispositionData.engine_vulnerability || 0));
        engineDispositionName = dispositionData.name;
        engineDispositionDescription = dispositionData.description;
        document.getElementById('engine_disposition_note').textContent = dispositionData.description;
    }

    const transmissionType = document.getElementById('transmission_type').value.split('(')[0].trim(); // Adjusted to get base name
    let transmissionData = null; 
    const transmissionNoteEl = document.getElementById('transmission_note');
    let transmissionTypeName = '-';
    let transmissionDescription = '';
    if (transmissionType && gameData.components.transmission_types[transmissionType]) { 
        transmissionData = gameData.components.transmission_types[transmissionType];
        baseUnitCost += transmissionData.cost;
        baseMetalCost += transmissionData.metal_cost || 0; // Added || 0
        totalWeight += transmissionData.weight;
        speedRoadMultiplier *= transmissionData.speed_mod;
        speedOffroadMultiplier *= transmissionData.speed_mod;
        maneuverabilityMultiplier *= transmissionData.maneuver_mod;
        overallReliabilityMultiplier *= (1 + (transmissionData.reliability_mod || 0));
        crewComfort += transmissionData.comfort_mod * gameData.constants.crew_comfort_base;
        fuelConsumptionMultiplier *= (1 + (1 - transmissionData.fuel_efficiency_mod));
        transmissionNoteEl.textContent = transmissionData.description;
        transmissionTypeName = transmissionData.name;
        transmissionDescription = transmissionData.description;
    } else {
        transmissionNoteEl.textContent = '';
    }

    // --- 5. Blindagem ---
    const armorProductionType = document.getElementById('armor_production_type').value;
    let armorProductionData = null; 
    const armorProductionNoteEl = document.getElementById('armor_production_note');
    let armorProductionTypeName = '-';
    let armorProductionDescription = '';
    if (armorProductionType && gameData.components.armor_production_types[armorProductionType]) { 
        armorProductionData = gameData.components.armor_production_types[armorProductionType];
        armorEffectiveMultiplier = armorProductionData.effective_armor_factor; 
        overallReliabilityMultiplier *= (1 + (armorProductionData.reliability_mod || 0));
        armorProductionNoteEl.textContent = armorProductionData.description;
        armorProductionTypeName = armorProductionData.name;
        armorProductionDescription = armorProductionData.description;
    } else {
        armorProductionNoteEl.textContent = '';
    }

    const armorFront = parseInt(document.getElementById('armor_front').value) || 0;
    const armorFrontAngle = parseInt(document.getElementById('armor_front_angle').value) || 0;
    const armorSide = parseInt(document.getElementById('armor_side').value) || 0;
    const armorTurret = parseInt(document.getElementById('armor_turret').value) || 0;

    const armorRear = gameData.constants.default_armor_rear_mm;
    const armorRearAngle = gameData.constants.default_armor_rear_angle;
    const armorTop = gameData.constants.default_armor_top_mm;
    const armorBottom = gameData.constants.default_armor_bottom_mm;
    const armorSideAngle = gameData.constants.default_armor_side_angle; 
    const armorTurretAngle = gameData.constants.default_armor_turret_angle; 


    let currentArmorWeight = 0;
    let currentArmorCost = 0;
    let currentMetalArmorCost = 0;

    currentArmorWeight += armorFront * gameData.constants.armor_weight_per_mm_per_sqm * gameData.constants.avg_hull_surface_area_sqm.front * 0.5; 
    currentArmorCost += armorFront * gameData.constants.armor_cost_per_mm;
    currentMetalArmorCost += armorFront * gameData.constants.armor_metal_cost_per_mm * 0.5; 

    currentArmorWeight += armorSide * gameData.constants.armor_weight_per_mm_per_sqm * gameData.constants.avg_hull_surface_area_sqm.side * 0.5;
    currentArmorCost += (armorSide * gameData.constants.armor_cost_per_mm * 0.8);
    currentMetalArmorCost += (armorSide * gameData.constants.armor_metal_cost_per_mm * 0.8) * 0.5;

    currentArmorWeight += armorRear * gameData.constants.armor_weight_per_mm_per_sqm * gameData.constants.avg_hull_surface_area_sqm.rear * 0.5;
    currentArmorCost += (armorRear * gameData.constants.armor_cost_per_mm * 0.7);
    currentMetalArmorCost += (armorRear * gameData.constants.armor_metal_cost_per_mm * 0.7) * 0.5;

    currentArmorWeight += armorTop * gameData.constants.armor_weight_per_mm_per_sqm * gameData.constants.avg_hull_surface_area_sqm.top * 0.5;
    currentArmorCost += (armorTop * gameData.constants.armor_cost_per_mm * 0.5);
    currentMetalArmorCost += (armorTop * gameData.constants.armor_metal_cost_per_mm * 0.5) * 0.5;

    currentArmorWeight += armorBottom * gameData.constants.armor_weight_per_mm_per_sqm * gameData.constants.avg_hull_surface_area_sqm.bottom * 0.5;
    currentArmorCost += (armorBottom * gameData.constants.armor_cost_per_mm * 0.5);
    currentMetalArmorCost += (armorBottom * gameData.constants.armor_metal_cost_per_mm * 0.5) * 0.5;

    currentArmorWeight += armorTurret * gameData.constants.armor_weight_per_mm_per_sqm * gameData.constants.avg_hull_surface_area_sqm.turret_base * 0.5;
    currentArmorCost += armorTurret * gameData.constants.armor_cost_per_mm;
    currentMetalArmorCost += armorTurret * gameData.constants.armor_metal_cost_per_mm * 0.5;

    if (armorProductionData) {
        currentArmorCost *= (armorProductionData.cost_mod || 1); // Added || 1 for robustness
        currentMetalArmorCost *= (armorProductionData.cost_mod || 1); // Added || 1 for robustness
    }

    baseUnitCost += currentArmorCost;
    baseMetalCost += currentMetalArmorCost;
    totalWeight += currentArmorWeight;

    effectiveArmorFront = calculateEffectiveArmor(armorFront, armorFrontAngle) * armorEffectiveMultiplier;
    effectiveArmorSide = calculateEffectiveArmor(armorSide, armorSideAngle) * armorEffectiveMultiplier;

    // Initialize a bonus factor for additional armor types
    let general_armor_effective_bonus = 0;
    const selectedAdditionalArmor = []; // Para armazenar os nomes das blindagens adicionais

    // Blindagens Adicionais/Modificadoras
    document.querySelectorAll('.form-section:nth-of-type(4) .item-row input[type="checkbox"]:checked').forEach(checkbox => {
        const armorId = checkbox.id;
        const armorData = gameData.components.armor_materials_and_additions[armorId]; 
        if (armorData) {
            baseUnitCost += armorData.cost;
            totalWeight += armorData.weight;
            baseMetalCost += armorData.metal_cost || 0; 
            selectedAdditionalArmor.push(armorData.name);
            
            // Apply effective armor bonuses from additional armor types
            if (armorData.effective_armor_bonus) {
                general_armor_effective_bonus += armorData.effective_armor_bonus;
            }
            // Other modifiers (reliability, comfort, etc.) are already handled or can be added here
        }
    });

    // Apply the accumulated general effective armor bonus
    effectiveArmorFront *= (1 + general_armor_effective_bonus);
    effectiveArmorSide *= (1 + general_armor_effective_bonus);


    crewComfort -= (totalWeight / 1000) * gameData.constants.crew_comfort_penalty_per_armor_volume;


    // --- 6. Armamentos - Main Gun
    mainArmamentCaliber = parseInt(document.getElementById('main_gun_caliber').value) || 0;
    const mainGunLength = document.getElementById('main_gun_length').value;
    const gunLengthData = gameData.components.gun_lengths[mainGunLength]; 
    const mainGunLengthNoteEl = document.getElementById('main_gun_length_note');
    let mainGunCost = 0;
    let mainGunWeight = 0;

    if (mainArmamentCaliber > 0) {
        mainGunCost = mainArmamentCaliber * 1000;
        mainGunWeight = mainArmamentCaliber * 15;

        if (gunLengthData) {
            mainGunCost *= gunLengthData.cost_mod;
            mainGunWeight *= gunLengthData.weight_mod;
            mainGunLengthNoteEl.textContent = gunLengthData.description;
            mainGunLengthDescription = gunLengthData.name;
            maneuverabilityMultiplier *= gunLengthData.turret_maneuver_mod;
        }
        mainArmamentText = `${mainArmamentCaliber}mm ${gunLengthData ? gunLengthData.name : ''} Canhão`;
    } else {
        mainGunLengthNoteEl.textContent = 'Insira um calibre de canhão principal válido.';
    }
    baseUnitCost += mainGunCost;
    baseMetalCost += mainGunWeight * 0.2; // This is fine, mainGunWeight is always a number
    totalWeight += mainGunWeight;


    // Mecanismo de Recarga
    const reloadMechanism = document.getElementById('reload_mechanism').value;
    const reloadMechanismData = gameData.components.reload_mechanisms[reloadMechanism]; 
    const reloadMechanismNoteEl = document.getElementById('reload_mechanism_note');
    let reloadMechanismName = '-';
    let reloadMechanismDescription = '';
    if (reloadMechanismData) {
        baseUnitCost += reloadMechanismData.cost;
        baseMetalCost += reloadMechanismData.metal_cost || 0; // Added || 0
        totalWeight += reloadMechanismData.weight;
        overallReliabilityMultiplier *= (1 + (reloadMechanismData.reliability_mod || 0));
        reloadMechanismNoteEl.textContent = reloadMechanismData.description;
        reloadMechanismName = reloadMechanismData.name;
        reloadMechanismDescription = reloadMechanismData.description;
        if (reloadMechanism === 'autoloader') {
            currentMaxCrew = Math.max(2, currentMaxCrew - 1); 
            document.getElementById('num_crewmen').max = currentMaxCrew;
            numCrewmen = Math.min(numCrewmen, currentMaxCrew); 
            document.getElementById('num_crewmen').value = numCrewmen;
        }
    } else {
        reloadMechanismNoteEl.textContent = '';
    }

    // Capacidade Total de Munição (Calculada Dinamicamente)
    const totalAmmoCapacityInput = document.getElementById('total_ammo_capacity');
    let maxAmmoForCaliber = 0;
    if (mainArmamentCaliber > 0) {
        // Dynamic calculation: larger caliber, lower capacity. Minimum 15 rounds.
        maxAmmoForCaliber = Math.max(15, Math.round(5000 / mainArmamentCaliber - 10)); 
    }
    totalAmmoCapacityInput.max = maxAmmoForCaliber;
    let totalAmmoCapacity = parseInt(totalAmmoCapacityInput.value) || 0;
    totalAmmoCapacity = Math.min(totalAmmoCapacity, maxAmmoForCaliber); 
    totalAmmoCapacityInput.value = totalAmmoCapacity; 

    const totalAmmoCapacityNoteEl = document.getElementById('total_ammo_capacity_note');
    if (mainArmamentCaliber > 0) {
        totalAmmoCapacityNoteEl.textContent = `Capacidade máxima para ${mainArmamentCaliber}mm: ${maxAmmoForCaliber} projéteis.`;
    } else {
        totalAmmoCapacityNoteEl.textContent = 'Selecione um calibre de canhão principal para definir a capacidade máxima de munição.';
    }

    // Tipos de Munição e Quantidades
    let currentTotalAmmoQty = 0;
    const ammoQtyNoteEl = document.getElementById('ammo_qty_note');
    const selectedAmmoTypes = []; // Para armazenar os tipos de munição e quantidades

    // Store requested quantities first
    const ammoQuantities = {};
    ['ap', 'aphe', 'he', 'apcr'].forEach(ammoType => {
        const checkbox = document.getElementById(`ammo_${ammoType}_checkbox`);
        const qtyInput = document.getElementById(`ammo_${ammoType}_qty`);
        let qty = parseInt(qtyInput ? qtyInput.value : 0) || 0;

        if (checkbox.checked) {
            ammoQuantities[ammoType] = qty; // Store the user's requested quantity
            currentTotalAmmoQty += qty;
        } else {
            qtyInput.value = 0; // Clear if checkbox is unchecked
            ammoQuantities[ammoType] = 0;
        }
    });

    // Now, after collecting all requested quantities and summing them:
    if (currentTotalAmmoQty > totalAmmoCapacity) {
        ammoQtyNoteEl.textContent = `⚠️ A quantidade total de munição (${currentTotalAmmoQty}) excede a capacidade máxima (${totalAmmoCapacity})! Por favor, reduza a quantidade de algum tipo de munição.`;
        ammoQtyNoteEl.className = 'text-sm status-warning'; // Apply warning styling
    } else if (mainArmamentCaliber > 0 && totalAmmoCapacity > 0) {
        ammoQtyNoteEl.textContent = `Munição alocada: ${currentTotalAmmoQty}/${totalAmmoCapacity} projéteis.`;
        ammoQtyNoteEl.className = 'text-sm status-ok'; // Apply success styling
    } else {
        ammoQtyNoteEl.textContent = '';
        ammoQtyNoteEl.className = '';
    }

    // Apply costs and weights based on the user's input (even if it exceeds max capacity, the warning handles it)
    ['ap', 'aphe', 'he', 'apcr'].forEach(ammoType => {
        const qty = ammoQuantities[ammoType];
        if (qty > 0) {
            const ammoData = gameData.components.ammo_types[ammoType];
            baseUnitCost += ammoData.cost_per_round * qty;
            baseMetalCost += (ammoData.weight_per_round * 0.1) * qty; // Assuming metal cost is 10% of weight for ammo
            totalWeight += ammoData.weight_per_round * qty;
            selectedAmmoTypes.push(`${ammoData.name} (${qty})`);
        }
    });


    // Armamentos Secundários
    const selectedSecondaryArmaments = []; // Para armazenar os armamentos secundários
    document.querySelectorAll('.form-section:nth-of-type(5) .item-row input[type="checkbox"]').forEach(checkbox => {
        const armamentId = checkbox.id.replace('_checkbox', ''); 
        const qtyInput = document.getElementById(armamentId + '_qty');
        const qty = checkbox.checked ? (parseInt(qtyInput ? qtyInput.value : 1) || 0) : 0;

        if (qty > 0 && gameData.components.armaments[armamentId]) { 
            const armamentData = gameData.components.armaments[armamentId];
            baseUnitCost += armamentData.cost * qty;
            baseMetalCost += (armamentData.metal_cost || 0) * qty; // Added || 0
            totalWeight += armamentData.weight * qty;
            selectedSecondaryArmaments.push(`${armamentData.name} (${qty}x)`);

            if (armamentData.armor_vulnerability_mod) {
                effectiveArmorFront *= (1 - armamentData.armor_vulnerability_mod);
            }
            if (armamentData.crew_exposure_risk) {
                crewComfort -= (armamentData.crew_exposure_risk * gameData.constants.crew_comfort_base);
            }
            if (armamentData.requires_crew_slot) {
                    if (numCrewmen < 3) { 
                        crewComfort *= 0.8; 
                        overallReliabilityMultiplier *= 0.9;
                    }
            }
        }
    });


    // --- 7. Equipamentos Extras ---
    const selectedExtraEquipment = []; // Para armazenar os equipamentos extras
    document.querySelectorAll('.form-section:nth-of-type(6) .item-row input[type="checkbox"]:checked').forEach(checkbox => {
        const equipmentId = checkbox.id;
        if (gameData.components.equipment[equipmentId]) { 
            const equipmentData = gameData.components.equipment[equipmentId];
            baseUnitCost += equipmentData.cost;
            baseMetalCost += equipmentData.metal_cost || 0; // Added || 0
            totalWeight += equipmentData.weight;
            selectedExtraEquipment.push(equipmentData.name);

            if (equipmentData.range_bonus_percent) fuelConsumptionMultiplier *= (1 - equipmentData.range_bonus_percent);
            if (equipmentData.front_armor_bonus) effectiveArmorFront *= (1 + equipmentData.front_armor_bonus);
            if (equipmentData.thermal_signature_reduction) silhouetteModifier -= equipmentData.thermal_signature_reduction;
            
            if (equipmentId === 'improved_optics' && doctrineData && doctrineData.optics_bonus) {
                // Logic for optics bonus if needed, currently not modifying calculation directly
            }
            if (equipmentId === 'radio_equipment' && doctrineData && doctrineData.radio_bonus) {
                // Logic for radio bonus if needed, currently not modifying calculation directly
            }

            if (equipmentData.reliability_mod) overallReliabilityMultiplier *= (1 + equipmentData.reliability_mod);
            if (equipmentData.cost_mod) baseUnitCost *= equipmentData.cost_mod;
            if (equipmentData.weight_mod) totalWeight *= equipmentData.weight_mod;
            if (equipmentData.speed_mod) { speedRoadMultiplier *= equipmentData.speed_mod; speedOffroadMultiplier *= equipmentData.speed_mod; }
            if (equipmentData.maneuver_mod) maneuverabilityMultiplier *= equipmentData.maneuver_mod;
        }
    });

    // --- 8. Tripulação ---
    crewComfort -= numCrewmen * gameData.constants.crew_comfort_penalty_per_crewman;
    const crewNoteEl = document.getElementById('crew_note');
    let crewNoteText = '';
    if (numCrewmen < 3 && vehicleType !== 'tankette' && vehicleType !== 'armored_car') {
        crewNoteText = 'Tripulação muito pequena para um veículo deste tipo. Isso impactará o desempenho!';
        crewComfort *= 0.7;
        overallReliabilityMultiplier *= 0.8;
    } else {
        crewNoteText = '';
    }
    crewNoteEl.textContent = crewNoteText;
    crewComfort = Math.max(0, Math.min(100, crewComfort));


    // --- CÁLCULOS FINAIS DE PERFORMANCE ---
    // Aplica os modificadores de custo de país e doutrina ao custo unitário base
    let finalUnitCost = baseUnitCost * doctrineCostModifier * (1 - countryCostReductionFactor);

    // Preparar stats para a nova função calculateTankPerformance
    const currentTypeData = typeData || {}; 
    const currentMobilityData = mobilityData || {};
    const currentEngineData = engineData || {};
    const currentTransmissionData = transmissionData || {};

    const tankStats = {
        weightTonnes: totalWeight / 1000, 
        engine: {
            powerHp: totalPower,
            maxRpm: currentEngineData.max_rpm || 3000 
        },
        transmission: {
            efficiency: currentTransmissionData.efficiency || 0.85, 
            gearRatios: currentTransmissionData.gear_ratios || [1.0], 
            finalDriveRatio: currentTransmissionData.final_drive_ratio || 8.5, 
            max_speed_road_limit: currentTransmissionData.max_speed_road_limit || Infinity,
            max_speed_offroad_limit: currentTransmissionData.max_speed_offroad_limit || Infinity
        },
        chassis: {
            driveSprocketRadiusM: currentMobilityData.drive_sprocket_radius_m || 0.4, 
            frontalAreaM2: currentTypeData.frontal_area_m2 || 3.0, 
            dragCoefficient: currentTypeData.drag_coefficient || 1.0 
        },
        environment: {
            rollingResistanceCoeff: currentMobilityData.rolling_resistance_coeff_road || 0.02, 
            slopeDegrees: 0,
            airDensity: 1.225 
        }
    };

    // Calculate road performance
    const roadPerformance = calculateTankPerformance(tankStats);
    let finalSpeedRoad = roadPerformance.topSpeedKmh;

    // Calculate off-road performance
    tankStats.environment.rollingResistanceCoeff = currentMobilityData.rolling_resistance_coeff_offroad || 0.10; 
    const offRoadPerformance = calculateTankPerformance(tankStats);
    let finalSpeedOffroad = offRoadPerformance.topSpeedKmh;

    // Penalidades de peso (do relatório)
    if (totalWeight > 20000) {
        finalSpeedRoad *= 0.8;
        finalSpeedOffroad *= 0.8;
    }
    if (totalWeight < 5000 && effectiveArmorFront > 80) {
        effectiveArmorFront *= 0.7;
        effectiveArmorSide *= 0.7;
    }

    // Confiabilidade - Adicionado Math.max para garantir que não vá abaixo de um mínimo
    let finalReliability = Math.max(0.05, Math.min(1, totalReliability * overallReliabilityMultiplier)); 


    // Consumo de Combustível e Alcance
    let totalFuelCapacity = gameData.constants.base_fuel_capacity_liters;
    if (document.getElementById('extra_fuel').checked) {
        totalFuelCapacity += gameData.constants.fuel_capacity_per_extra_tank;
    }

    let consumptionPer100km = (totalPower / 100) * (totalWeight / 1000) * gameData.constants.fuel_consumption_per_hp_per_kg_factor;
    consumptionPer100km *= fuelConsumptionMultiplier;
    consumptionPer100km = Math.max(1, consumptionPer100km); 

    let maxRange = (totalFuelCapacity / consumptionPer100km) * 100;

    // --- ATUALIZAÇÃO DA UI ---
    document.getElementById('display_name').textContent = vehicleName;
    document.getElementById('unit_cost').textContent = Math.round(finalUnitCost).toLocaleString('pt-BR');
    document.getElementById('total_production_cost').textContent = Math.round(finalUnitCost * quantity).toLocaleString('pt-BR');
    document.getElementById('total_metal_cost').textContent = Math.round(baseMetalCost * quantity).toLocaleString('pt-BR');
    document.getElementById('total_weight').textContent = Math.round(totalWeight).toLocaleString('pt-BR') + ' kg';
    document.getElementById('total_power').textContent = Math.round(totalPower).toLocaleString('pt-BR') + ' hp';
    document.getElementById('speed_road').textContent = Math.round(finalSpeedRoad).toLocaleString('pt-BR') + ' km/h';
    document.getElementById('speed_offroad').textContent = Math.round(finalSpeedOffroad).toLocaleString('pt-BR') + ' km/h';
    document.getElementById('effective_armor_front_display').textContent = Math.round(effectiveArmorFront).toLocaleString('pt-BR') + ' mm';
    document.getElementById('effective_armor_side_display').textContent = Math.round(effectiveArmorSide).toLocaleString('pt-BR') + ' mm';
    document.getElementById('main_armament').textContent = mainArmamentText;
    document.getElementById('total_cost_label').textContent = `Custo Total (${quantity}x):`;
    document.getElementById('max_range').textContent = Math.round(maxRange).toLocaleString('pt-BR') + ' km';
    document.getElementById('crew_comfort_display').textContent = Math.round(crewComfort) + '%';
    document.getElementById('reliability_display').textContent = (finalReliability * 100).toFixed(1) + '%';


    // Capacidade de Produção e Unidades Produzíveis
    document.getElementById('country_production_capacity').textContent = countryProductionCapacity.toLocaleString('pt-BR');
    let producibleUnits = 'N/A';
    if (countryData && finalUnitCost > 0) {
        producibleUnits = Math.floor(countryProductionCapacity / finalUnitCost).toLocaleString('pt-BR');
    }
    document.getElementById('producible_units').textContent = producibleUnits;

    // Saldo de Metais e Status
    document.getElementById('country_metal_balance').textContent = countryMetalBalance.toLocaleString('pt-BR');
    const metalBalanceStatusEl = document.getElementById('metal_balance_status');
    let metalBalanceStatusText = '';
    let metalBalanceStatusClass = '';
    if (countryData && baseMetalCost * quantity > 0) {
        if (baseMetalCost * quantity > countryMetalBalance) { 
            metalBalanceStatusText = '⚠️ Saldo de metais insuficiente para esta produção!';
            metalBalanceStatusClass = 'status-warning'; 
        } else {
            metalBalanceStatusText = '✅ Saldo de metais suficiente.';
            metalBalanceStatusClass = 'status-ok'; 
        }
    } else {
        metalBalanceStatusText = '';
        metalBalanceStatusClass = '';
    }
    metalBalanceStatusEl.textContent = metalBalanceStatusText;
    metalBalanceStatusEl.className = metalBalanceStatusClass;

    // Status do Design - Ajustado para ser mais flexível
    const statusEl = document.getElementById('status');
    let statusMessage = "Selecione o tipo de veículo e motor para começar";
    let statusClass = "status-warning";

    if (vehicleType && engineType && totalPower > 0) {
        const P_TO_W_THRESHOLD_GOOD = 12; 
        const P_TO_W_THRESHOLD_OK = 8;    

        if (roadPerformance.powerToWeightRatio >= P_TO_W_THRESHOLD_GOOD && finalSpeedRoad >= 40) {
            statusMessage = "💪 Blindado de alta performance!";
            statusClass = "status-ok";
        } else if (roadPerformance.powerToWeightRatio >= P_TO_W_THRESHOLD_OK && finalSpeedRoad >= 30) {
            statusMessage = "✅ Configuração bem equilibrada.";
            statusClass = "status-ok";
        } else if (finalSpeedRoad < 25 && vehicleType !== 'super_pesado' && vehicleType !== 'artilharia_simples') {
            statusMessage = "⚠️ Veículo um pouco lento, pode ter problemas de mobilidade.";
            statusClass = "status-warning";
        } else if (finalReliability < 0.6) {
            statusMessage = "🔥 Confiabilidade baixa: Propenso a avarias!";
            statusClass = "status-error";
        } else if (crewComfort < 50) {
            statusMessage = "😓 Conforto da tripulação muito baixo! Afetará desempenho em combate.";
            statusClass = "status-warning";
        } else {
            statusMessage = "✅ Configuração básica ok.";
            statusClass = "status-ok";
        }
    }
    statusEl.textContent = statusMessage;
    statusEl.className = `status-indicator ${statusClass}`;

    // Retorna todos os dados calculados para serem usados na ficha
    return {
        vehicleName,
        quantity,
        selectedCountryName,
        doctrineName,
        vehicleTypeName,
        mobilityTypeName,
        suspensionTypeName,
        suspensionDescription,
        engineTypeName,
        enginePower,
        fuelTypeName,
        fuelTypeDescription,
        engineDispositionName,
        engineDispositionDescription,
        transmissionTypeName,
        transmissionDescription,
        armorProductionTypeName,
        armorProductionDescription,
        armorFront,
        armorFrontAngle,
        armorSide,
        armorTurret,
        selectedAdditionalArmor,
        mainArmamentCaliber,
        mainGunLengthDescription,
        reloadMechanismName,
        reloadMechanismDescription,
        totalAmmoCapacity,
        currentTotalAmmoQty,
        selectedAmmoTypes,
        selectedSecondaryArmaments,
        selectedExtraEquipment,
        numCrewmen,
        crewNoteText,
        finalUnitCost: Math.round(finalUnitCost).toLocaleString('pt-BR'),
        totalProductionCost: Math.round(finalUnitCost * quantity).toLocaleString('pt-BR'),
        totalMetalCost: Math.round(baseMetalCost * quantity).toLocaleString('pt-BR'),
        totalWeight: Math.round(totalWeight).toLocaleString('pt-BR') + ' kg',
        totalPower: Math.round(totalPower).toLocaleString('pt-BR') + ' hp',
        speedRoad: Math.round(finalSpeedRoad).toLocaleString('pt-BR') + ' km/h',
        speedOffroad: Math.round(finalSpeedOffroad).toLocaleString('pt-BR') + ' km/h',
        effectiveArmorFront: Math.round(effectiveArmorFront).toLocaleString('pt-BR') + ' mm',
        effectiveArmorSide: Math.round(effectiveArmorSide).toLocaleString('pt-BR') + ' mm',
        mainArmamentText,
        maxRange: Math.round(maxRange).toLocaleString('pt-BR') + ' km',
        crewComfort: Math.round(crewComfort) + '%',
        reliability: (finalReliability * 100).toFixed(1) + '%',
        countryProductionCapacity: countryProductionCapacity.toLocaleString('pt-BR'),
        producibleUnits,
        countryMetalBalance: countryMetalBalance.toLocaleString('pt-BR'),
        metalBalanceStatusText,
        statusMessage,
        statusClass
    };
}

// Função para gerar a ficha do tanque em uma nova página
function generateTankSheet() {
    // Garante que os cálculos estejam atualizados antes de salvar os dados
    const tankData = updateCalculations(); 
    localStorage.setItem('tankSheetData', JSON.stringify(tankData));
    window.open('ficha.html', '_blank'); // Abre a nova página em uma nova aba
}

// --- INICIALIZAÇÃO ---
window.onload = function() {
    loadGameDataFromSheets(); // Carrega os dados das planilhas primeiro

    // Adiciona o updateCalculations e generateTankSheet ao escopo global para que os eventos oninput/onchange no HTML possam chamá-lo
    window.updateCalculations = updateCalculations;
    window.generateTankSheet = generateTankSheet; // Expor a nova função
};
