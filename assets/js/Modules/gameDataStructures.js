// js/modules/gameDataStructures.js

export const DOCTRINES = {
    infantry_tank: {
        name: "Tanque de Infantaria",
        description: "Concebido para operar em estreita coordenação com a infantaria, priorizando blindagem pesada contra armas antitanque e metralhadoras. Velocidade sacrificada em prol da proteção. Ex: Matilda II.",
        cost_modifier: 1.30, // +30%
        speed_modifier: 0.60, // -40%
        armor_effectiveness_modifier: 1.15, // +15%
        reliability_modifier: 1.05, // +5%
        crew_comfort_modifier: 1.05, // +5%
        max_crew_mod: 0,
        // Novos modificadores da doutrina
        armor_cost_weight_reduction_percent: 0.10, // 10% de redução no custo/peso da blindagem
        durability_bonus: 0.05, // +5% durabilidade (afeta confiabilidade)
        infantry_moral_bonus: 0.10, // Bônus conceitual para infantaria aliada
        speed_penalty: 0.20, // Penalidade adicional de 20% na velocidade
        maneuverability_penalty: 0.10, // Penalidade de 10% na manobrabilidade
    },
    cruiser_tank: {
        name: "Tanque Cruzador",
        description: "Projetado para perseguição e exploração, exigindo alta velocidade e manobrabilidade. Tipicamente blindado de forma mais leve e equipado com armamento antitanque. Ex: Tanques Christie, Vickers Medium Mk II.",
        cost_modifier: 1.10, // +10%
        speed_modifier: 1.35, // +35%
        armor_effectiveness_modifier: 0.95, // -5%
        reliability_modifier: 0.95, // -5%
        maneuverability_modifier: 1.10, // +10%
        max_crew_mod: 0,
        // Novos modificadores da doutrina
        engine_cost_weight_reduction_percent: 0.15, // 15% de redução no custo/peso do motor
        range_bonus: 0.10, // +10% de alcance
        initiative_bonus: 0.15, // Bônus conceitual de iniciativa
        armor_cost_weight_increase_percent: 0.05, // 5% de aumento no custo/peso da blindagem
        offroad_speed_penalty: 0.05, // 5% de penalidade na velocidade off-road
    },
    light_tank_doctrine: {
        name: "Doutrina de Tanques Leves",
        description: "Primariamente destinado a funções de reconhecimento e constabularia, com o custo sendo o principal fator de design. Blindagem e armamento limitados. Ex: Vickers-Armstrong Light Tank.",
        cost_modifier: 0.75, // -25%
        speed_modifier: 1.15, // +15%
        armor_effectiveness_modifier: 0.85, // -15%
        reliability_modifier: 1.05, // +5%
        max_crew_mod: -2,
        // Novos modificadores da doutrina
        cost_reduction_percent: 0.15, // 15% de redução adicional no custo geral
        metal_efficiency_bonus: 0.10, // 10% de eficiência de metais
        production_speed_bonus: 0.10, // 10% de bônus na velocidade de produção (afeta unidades produzíveis)
        max_main_gun_caliber_limit: 75, // Limita o calibre máximo do canhão principal a 75mm
        secondary_armament_limit_penalty: 1, // Reduz em 1 o número máximo de armamentos secundários
    },
    blitzkrieg: {
        name: "Blitzkrieg (Alemanha)",
        description: "Filosofia operacional que prioriza mobilidade, coordenação e reação rápida. Enfatiza motores confiáveis, rádios e ópticas de alta qualidade. Ex: Panzer IV, T-34 (inspirado na mobilidade).",
        cost_modifier: 1.05, // +5%
        speed_modifier: 1.20, // +20%
        reliability_modifier: 1.10, // +10%
        crew_comfort_modifier: 1.05, // +5%
        armor_effectiveness_modifier: 0.98, // -2%
        optics_radio_bonus_multiplier: 0.02, // Bônus adicional se rádio/ópticas selecionadas
        max_crew_mod: 0,
        // Novos modificadores da doutrina
        advanced_component_cost_increase: 0.10, // 10% de aumento no custo de componentes avançados (motores V, transmissões complexas)
        quality_production_slider_bias: 0.10, // Desloca o slider 10% para qualidade
    },
    deep_battle: { // Nova doutrina: Batalha Profunda (Soviética)
        name: "Batalha Profunda (URSS)",
        description: "Foco na produção em massa, simplicidade e capacidade de avanço rápido. Prioriza quantidade e robustez operacional.",
        cost_modifier: 0.85, // -15%
        reliability_modifier: 0.95, // -5%
        country_production_capacity_bonus: 0.10, // +10% na capacidade de produção do país
        armor_effectiveness_modifier: 1.05, // +5%
        speed_modifier: 1.10, // +10%
        crew_comfort_modifier: 0.90, // -10%
        max_crew_mod: 0,
        // Novos modificadores da doutrina
        base_comfort_penalty: 0.10, // 10% de penalidade base no conforto
        complex_component_reliability_penalty: 0.15, // 15% de penalidade adicional na confiabilidade de componentes complexos
        production_quality_slider_bias: -0.10, // Desloca o slider 10% para produção
    },
    combined_arms: { // Nova doutrina: Armas Combinadas (Americana)
        name: "Armas Combinadas (EUA)",
        description: "Enfatiza versatilidade, conforto da tripulação e suporte logístico. Tanques equilibrados e fáceis de operar.",
        cost_modifier: 1.10, // +10%
        reliability_modifier: 1.05, // +5%
        crew_comfort_modifier: 1.15, // +15%
        speed_modifier: 1.10, // +10%
        range_modifier: 1.10, // +10% no alcance máximo
        country_production_capacity_bonus: 0.05, // +5% na capacidade de produção do país
        max_crew_mod: 0,
        // Novos modificadores da doutrina
        comfort_bonus: 0.10, // 10% de bônus adicional no conforto
        versatility_bonus: 0.05, // Bônus conceitual para flexibilidade
        extreme_design_cost_increase: 0.05, // 5% de aumento no custo para designs extremos (super-pesados, canhões > 100mm)
    }
};

export const COMPONENTS = {
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
        horstmann: { name: "Horstmann", cost: 12000, metal_cost: 1200, weight: 500, comfort_mod: 0.10, stability_mod: 0.05, reliability_mod: -0.05, description: "Distribuição de carga eficaz, maior curso, fácil manutenção em campo. Compacta." },
        torsion_bar: { name: "Barra de Torção", cost: 35000, weight: 700, metal_cost: 2000, comfort_mod: 0.15, stability_mod: 0.05, internal_space_mod: 0.05, reliability_mod: -0.10, requires_stabilizer_cost: 5000, requires_stabilizer_weight: 50, description: "Rodagem suave, durabilidade, pouco volume interno. Risco de quebra, exige estabilizador de canhão." },
        hydropneumatic: { name: "Hidropneumática", cost: 100000, weight: 800, metal_cost: 5000, comfort_mod: 0.20, stability_mod: 0.10, offroad_maneuver_mod: 0.15, reliability_mod: -0.25, description: "Grande agilidade, melhor tração, estabilização de armas. Muito cara, complexa, menor vida útil, super-engenharia para o período." },
    },
    engines: {
        i4: { name: "I4", cost: 8000, weight: 350, metal_cost: 1200, min_power: 50, max_power: 150, base_consumption: 0.75, fire_risk: 0.10, base_reliability: 1.0, max_rpm: 3000, complex: false },
        i6: { name: "I6", cost: 12000, weight: 450, metal_cost: 1800, min_power: 100, max_power: 250, base_consumption: 0.8, fire_risk: 0.12, base_reliability: 1.05, max_rpm: 3200, complex: false },
        v6: { name: "V6", cost: 18000, weight: 500, metal_cost: 2500, min_power: 150, max_power: 350, base_consumption: 0.85, fire_risk: 0.15, base_reliability: 1.0, max_rpm: 3500, complex: true },
        v8: { name: "V8", cost: 25000, weight: 650, metal_cost: 3800, min_power: 300, max_power: 600, base_consumption: 0.9, fire_risk: 0.20, base_reliability: 0.95, max_rpm: 3800, complex: true },
        v12: { name: "V12", cost: 35000, weight: 850, metal_cost: 5000, min_power: 500, max_power: 900, base_consumption: 1.0, fire_risk: 0.25, base_reliability: 0.95, max_rpm: 4000, complex: true }, 
        radial_9_cyl: { name: "Radial 9 Cilindros", cost: 20000, weight: 550, metal_cost: 2800, min_power: 250, max_power: 500, base_consumption: 0.7, fire_risk: 0.10, silhouette_mod: 0.05, base_reliability: 0.95, max_rpm: 2800, complex: true },
        radial_14_cyl: { name: "Radial 14 Cilindros", cost: 30000, weight: 700, metal_cost: 4000, min_power: 450, max_power: 700, base_consumption: 0.8, fire_risk: 0.12, silhouette_mod: 0.07, base_reliability: 0.90, max_rpm: 3000, complex: true },
        opposed_piston: { name: "Oposto-Pistão", cost: 40000, weight: 950, metal_cost: 6000, min_power: 150, max_power: 850, base_consumption: 0.55, fire_risk: 0.08, base_reliability: 1.10, max_rpm: 3600, complex: true },
    },
    fuel_types: {
        gasoline: { name: "Gasolina", cost_mod: 1.0, consumption_mod: 1.0, fire_risk_mod: 0.05, power_mod: 1.0, energy_density: 34.8, description: "Padrão. Alta potência, partida fácil, mas volátil e inflamável." },
        diesel: { name: "Diesel", cost_mod: 1.10, consumption_mod: 0.7, fire_risk_mod: 0.02, power_mod: 0.95, energy_density: 38.6, description: "Maior eficiência, alto torque, menor inflamabilidade. Mais pesado e caro inicialmente." },
        kerosene: { name: "Querosene", cost_mod: 0.95, consumption_mod: 1.05, fire_risk_mod: 0.07, power_mod: 0.9, energy_density: 37.6, description: "Menos volátil que gasolina, mas tóxico e menor potência." },
        alcohol: { name: "Álcool", cost_mod: 1.15, consumption_mod: 1.25, fire_risk_mod: 0.08, power_mod: 1.05, energy_density: 23.5, description: "Maior octanagem, pode ser produzido localmente. Baixa densidade energética, corrosivo, caro." },
        wood_gas: { name: "Gás de Madeira", cost_mod: 0.90, consumption_mod: 1.50, fire_risk: 0.01, power_mod: 0.7, weight_mod: 1.15, speed_mod: 0.9, energy_density: 10.0, description: "Recurso renovável, baixo custo. Baixa potência, equipamento pesado, ineficiente, reduz velocidade." },
    },
    engine_dispositions: {
        rear: { name: "Traseira", cost: 0, weight: 0, internal_space_mod: 0.05, silhouette_mod: -0.05, engine_vulnerability: 0.1, description: "Mais espaço para torre/combate, silhueta baixa, fácil manutenção. Menor proteção para motor." },
        front: { name: "Dianteira", cost: 0, weight: 0, internal_space_mod: -0.05, front_armor_bonus: 0.10, maneuverability_mod: -0.05, gun_depression_mod: -2, engine_vulnerability: 0.25, description: "Proteção adicional para tripulação (motor como blindagem). Dificulta manobrabilidade, maior chance de dano ao motor, limita depressão do canhão." },
        mid: { name: "Central", cost: 5000, weight: 100, internal_space_mod: -0.10, maneuverability_mod: 0.10, maintenance_cost_mod: 0.15, description: "Melhor distribuição de peso, manuseio e aceleração. Reduz espaço interno e dificulta manutenção." },
    },
    transmission_types: {
        basic_manual: { name: "Manual Básico (Caixa Seca)", cost: 0, weight: 0, speed_mod: 0.90, maneuver_mod: 0.85, reliability_mod: 0.05, comfort_mod: -0.10, fuel_efficiency_mod: 0.95, max_speed_road_limit: 30, max_speed_offroad_limit: 20, gear_ratios: [20.0, 14.0, 9.0, 5.0, 1.0], efficiency: 0.85, final_drive_ratio: 10.0, complex: false, description: "Simples e robusta. Trocas de marcha difíceis, perda de potência em curvas, alta fadiga do motorista. Comum em veículos iniciais." },
        synchronized_manual: { name: "Manual Sincronizada", cost: 15000, weight: 50, speed_mod: 1.0, maneuver_mod: 0.95, reliability_mod: 0, comfort_mod: 0, fuel_efficiency_mod: 1.0, max_speed_road_limit: 50, max_speed_offroad_limit: 35, gear_ratios: [18.0, 13.0, 9.5, 7.0, 5.0, 3.0, 1.8, 1.0], efficiency: 0.88, final_drive_ratio: 8.5, complex: false, description: "Melhora a facilidade e suavidade das trocas de marcha. Padrão para muitos veículos da Segunda Guerra Mundial." },
        wilson_preselector: { name: "Pré-seletora Wilson", cost: 50000, weight: 150, speed_mod: 1.05, maneuver_mod: 1.05, reliability_mod: -0.10, comfort_mod: 0.05, fuel_efficiency_mod: 0.92, max_speed_road_limit: 60, max_speed_offroad_limit: 40, gear_ratios: [16.0, 12.0, 8.5, 6.0, 4.0, 2.5, 1.5, 1.0], efficiency: 0.90, final_drive_ratio: 7.8, complex: true, description: "Permite pré-selecionar a próxima marcha. Trocas rápidas e suaves, reduz fadiga do motorista. Complexa e mais cara. Usada em tanques britânicos." },
        maybach_olvar: { name: "Maybach OLVAR (OG 40 12 16 B)", cost: 100000, weight: 300, speed_mod: 1.10, maneuver_mod: 1.10, reliability_mod: -0.15, comfort_mod: 0.10, fuel_efficiency_mod: 0.85, max_speed_road_limit: 70, max_speed_offroad_limit: 45, gear_ratios: [15.0, 11.5, 9.0, 7.0, 5.5, 4.0, 2.5, 1.0], efficiency: 0.92, final_drive_ratio: 7.0, complex: true, description: "Transmissão pré-seletora complexa com 8 marchas à frente. Usada em tanques alemães como o Tiger I/II. Oferece bom controle, mas é cara e exige manutenção." },
        merritt_brown: { name: "Merritt-Brown (TN.12)", cost: 150000, weight: 400, speed_mod: 1.15, maneuver_mod: 1.20, reliability_mod: -0.20, comfort_mod: 0.15, fuel_efficiency_mod: 0.95, max_speed_road_limit: 65, max_speed_offroad_limit: 50, gear_ratios: [14.0, 10.5, 8.0, 6.0, 4.5, 3.0, 1.8, 1.0], efficiency: 0.93, final_drive_ratio: 6.5, complex: true, description: "Sistema diferencial triplo com direção regenerativa. Permite curvas com potência total e giro no próprio eixo. Altamente manobrável, mas muito complexa e cara. Usada em tanques britânicos." },
    },
    armor_production_types: {
        cast: { name: "Fundida", cost_mod: 1.0, weight_mod: 1.0, effective_armor_factor: 0.95, reliability_mod: -0.05, complex: true, description: "Formas complexas/curvas, menos soldas. Menos resistente que RHA, difícil tratamento térmico." }, 
        rolled_homogeneous: { name: "Laminada Homogênea (RHA)", cost_mod: 1.0, weight_mod: 1.0, effective_armor_factor: 1.15, reliability_mod: 0, complex: false, description: "Padrão da indústria. Mais resistente, produção em massa. Resulta em designs mais 'quadrados', mais soldas." }, 
        welded: { name: "Soldada", cost_mod: 1.05, weight_mod: 1.0, effective_armor_factor: 1.05, reliability_mod: -0.05, complex: true, description: "Permite designs complexos/eficientes. Soldas podem ser pontos fracos (qualidade inicial), exige mão de obra qualificada." }, 
        riveted: { name: "Rebitada", cost_mod: 0.90, weight_mod: 1.10, effective_armor_factor: 0.85, reliability_mod: -0.05, complex: false, description: "Placas unidas por rebites. Mais barato, mas rebites criam pontos fracos e podem se soltar sob impacto. Risco de estilhaços internos." }, 
        bolted: { name: "Parafusada", cost_mod: 0.95, weight_mod: 1.08, effective_armor_factor: 0.90, reliability_mod: -0.02, complex: false, description: "Placas unidas por parafusos. Permite reparos mais fáceis, mas parafusos podem ser pontos fracos e se afrouxar. Menor risco de estilhaços que rebitada." }, 
    },
    armor_materials_and_additions: { // Grouped additional armor types
        face_hardened: { name: "Aço Carbonizado", cost: 3000, weight: 0, metal_cost: 0, effective_armor_mod: 1.0, internal_splinter_risk: 0.05, comfort_mod: -0.05, complex: true, description: "Superfície dura, núcleo macia. Boa resistência contra projéteis iniciais, mas propenso a estilhaços internos, perigoso para tripulação." },
        spaced_armor: { name: "Blindagem Espaçada", cost: 15000, weight: 200, metal_cost: 250, effective_armor_bonus: 0.05, complex: true, description: "Duas ou mais placas com espaço. Pode deformar projéteis cinéticos e detonar HEAT prematuramente. Adiciona peso e complexidade." }, 
        side_skirts: { name: "Saias Laterais (Schürzen)", cost: 5000, weight: 100, metal_cost: 100, effective_armor_bonus: 0.075, durability_mod: -0.5, complex: false, description: "Placas finas laterais para deter fuzis AT e estilhaços. Frágeis e adicionam peso." }, 
        improvised_armor: { name: "Blindagem Improvisada (Sacos de Areia/Esteiras)", cost: 500, weight: 150, metal_cost: 0, effective_armor_bonus: 0.025, speed_mod: 0.98, maneuver_mod: 0.98, suspension_reliability_mod: -0.05, complex: false, description: "Materiais como sacos de arena/elos de esteira. Proteção limitada contra projéteis leves/estilhaços. Peso adicional pode sobrecarregar suspensão e trem de força." } 
    },
    armaments: { // Base for main gun and secondary MGs
        coaxial_mg: { cost: 5000, weight: 15, metal_cost: 600, name: "Metralhadora Coaxial", main_gun_priority: 0, complex: false },
        bow_mg: { cost: 5000, weight: 15, metal_cost: 600, name: "Metralhadora de Casco", main_gun_priority: 0, armor_vulnerability_mod: 0.05, requires_crew_slot: true, complex: false },
        aa_mg: { cost: 8000, weight: 20, metal_cost: 1000, name: "Metralhadora Antiaérea", main_gun_priority: 0, crew_exposure_risk: 0.10, complex: false },
        smoke_dischargers: { cost: 4000, weight: 10, metal_cost: 112.5, name: "Lançadores de Fumaça", main_gun_priority: 0, complex: false },
        grenade_mortars: { cost: 7000, weight: 50, metal_cost: 200, name: "Lançadores de Granadas/Morteiros", main_gun_priority: 0, complex: false },
    },
    gun_lengths: {
        short: { name: "Curto", velocity_mod: 0.85, accuracy_long_range_mod: 0.90, turret_maneuver_mod: 1.05, weight_mod: 0.90, cost_mod: 0.90, complex: false, description: "Leve, manobrável, silhueta baixa. Baixa penetração, trajetória curva, flash alto. Melhor para suporte de infantaria e combate CQC." },
        medium: { name: "Médio", velocity_mod: 1.0, accuracy_long_range_mod: 1.0, turret_maneuver_mod: 1.0, weight_mod: 1.0, cost_mod: 1.0, complex: false, description: "Equilíbrio, versatilidade." },
        long: { name: "Longo", velocity_mod: 1.15, accuracy_long_range_mod: 1.10, turret_maneuver_mod: 0.95, weight_mod: 1.10, cost_mod: 1.10, complex: true, description: "Alta velocidade de saída, melhor penetração, trajetória plana. Pesado, longo, silhueta alta, exige mais tempo de mira. Melhor para combate antitanque a longa distância." },
    },
    reload_mechanisms: {
        manual: { name: "Manual", cost: 0, weight: 0, rpm_modifier: 1.0, crew_burden: 1.0, reliability_mod: 0, complex: false, description: "Simples, barato, leve. Cadência de tiro depende da tripulação e calibre, fadiga." },
        autoloader: { name: "Autoloader", cost: 75000, weight: 750, rpm_modifier: 1.5, crew_burden: 0, reliability_mod: -0.30, complex: true, description: "Cadência de tiro consistente e alta, reduz tripulação. Muito caro, pesado, complexo, propenso a falhas (para o período)." }, // Higher cost/weight for early WWII context
    },
    ammo_types: {
        ap: { name: "AP", cost_per_round: 150, weight_per_round: 10, description: "Projétil sólido de aço endurecido para penetrar blindagem por energia cinética." },
        aphe: { name: "APHE", cost_per_round: 200, weight_per_round: 12, description: "Projétil AP com pequena carga explosiva interna que detona após a penetração." },
        he: { name: "HE", cost_per_round: 100, weight_per_round: 15, description: "Projétil com grande carga explosiva, eficaz contra infantaria e fortificações." },
        apcr: { name: "APCR/HVAP", cost_per_round: 300, weight_per_round: 8, description: "Projétil com núcleo de alta densidade disparado em alta velocidade. Excelente penetração a curta/média distância." },
    },
    equipment: {
        radio_equipment: { cost: 20000, weight: 25, metal_cost: 600, name: "Rádio", coordination_bonus: 0.10, complex: true, description: "Melhora drasticamente a coordenação tática e a comunicação. Ocupa espaço." },
        extra_fuel: { cost: 1500, weight: 300, metal_cost: 75, name: "Tanques Extras de Combustível", range_bonus_percent: 0.50, external_fire_risk: 0.05, complex: false, description: "Aumenta significativamente o raio de ação. Vulneráveis a fogo inimigo, podem vazar ou pegar fogo externamente." },
        dispenser_minas: { cost: 4500, weight: 200, metal_cost: 225, name: "Dispenser de Minas", complex: false, description: "Permite a colocação rápida de campos minados para defesa ou armadilha." },
        terraformacao: { cost: 50000, weight: 5000, metal_cost: 1500, name: "Ferramentas de Engenharia (Terraformação)", complex: true, description: 'Capacidades de engenharia como \'cavar trincheiras\' ou \'remover obstáculos\'.' },
        dozer_blades: { cost: 10000, weight: 1000, metal_cost: 500, name: "Lâminas de Escavadeira", front_armor_bonus: 0.05, complex: false, description: "Permite limpeza de obstáculos e criação de posições defensivas. Proteção frontal adicional. Adiciona peso significativo." },
        floatation_wading_gear: { cost: 40000, weight: 2000, metal_cost: 1000, name: "Flutuadores/Wading Gear", amphibious_capability: true, water_speed_penalty: 0.5, system_vulnerability: 0.20, complex: true, description: "Habilita capacidade anfíbia. Adiciona peso e volume massivos, tornando o tanque lento na água e vulnerável." },
        mine_flails: { cost: 30000, weight: 1500, metal_cost: 750, name: "Equipamento de Limpeza de Minas", operation_speed_penalty: 0.7, driver_visibility_penalty: 0.15, engine_overheat_risk: 0.10, complex: true, description: "Limpa campos minados. Lento, ruidoso, pode cegar motorista e superaquecer motor." },
        APU: { cost: 10000, weight: 80, metal_cost: 350, name: "Unidade de Potência Auxiliar (APU)", idle_fuel_consumption_reduction: 0.5, thermal_signature_reduction: 0.05, complex: true, description: "Pequeno motor secundário. Reduz consumo de combustível e assinatura IR em modo estacionário. Adiciona complexidade." },
        improved_optics: { cost: 15000, weight: 10, metal_cost: 400, name: "Ópticas Melhoradas", accuracy_bonus: 0.05, target_acquisition_bonus: 0.10, complex: true, description: "Sistemas de mira e observação de alta qualidade. Melhoram aquisição de alvos, precisão e consciência situacional." },
    }
};

export const CREW_ROLES = {
    commander: { name: "Comandante", base_efficiency: 1.0 },
    gunner: { name: "Artilheiro", base_efficiency: 1.0 },
    loader: { name: "Municiador", base_efficiency: 1.0 },
    driver: { name: "Motorista", base_efficiency: 1.0 },
    radio_operator_bow_gunner: { name: "Operador de Rádio/Metralhador de Casco", base_efficiency: 1.0 },
};
