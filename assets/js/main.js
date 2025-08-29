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

// --- DADOS DO JOGO (GUERRA FRIA) ---
const gameData = {
    countries: {}, // Será preenchido dinamicamente
    doctrines: {
        qualitative_doctrine: {
            name: "Qualitativa (OTAN)",
            description: "Foco em proteção, tecnologia avançada e poder de fogo. Tanques mais caros, complexos e pesados. Ex: M1 Abrams, Leopard 2.",
            cost_modifier: 1.25, // +25%
            speed_modifier: 0.95, // -5%
            armor_effectiveness_modifier: 1.20, // +20%
            reliability_modifier: 1.10, // +10%
            crew_comfort_modifier: 1.15, // +15%
            max_crew_mod: 0,
            advanced_component_cost_increase: 0.15,
            quality_production_slider_bias: -0.15, // Desloca para qualidade
        },
        quantitative_doctrine: {
            name: "Quantitativa (Pacto de Varsóvia)",
            description: "Prioriza simplicidade, produção em massa e baixo custo. Tanques mais leves, de menor silhueta, mas com menos proteção para a tripulação. Ex: T-72.",
            cost_modifier: 0.85, // -15%
            speed_modifier: 1.05, // +5%
            armor_effectiveness_modifier: 0.95, // -5%
            reliability_modifier: 0.95, // -5%
            crew_comfort_modifier: 0.90, // -10%
            max_crew_mod: -1,
            complex_component_reliability_penalty: 0.20,
            production_quality_slider_bias: 0.15, // Desloca para produção
        },
        regional_defense_doctrine: {
            name: "Defesa Regional (Neutros)",
            description: "Enfatiza a versatilidade, facilidade de manutenção e adaptabilidade a conflitos de menor escala. Foco na segurança da tripulação. Ex: Merkava.",
            cost_modifier: 1.10, // +10%
            reliability_modifier: 1.05, // +5%
            crew_comfort_modifier: 1.10, // +10%
            speed_modifier: 1.0, 
            range_modifier: 1.15, // +15% no alcance
            advanced_component_cost_increase: 0.05,
            quality_production_slider_bias: 0.0, // Equilibrado
        }
    },
    components: {
        vehicle_types: { 
            main_battle_tank: { name: "Carro de Combate Principal", cost: 1200000, weight: 45000, metal_cost: 20000, base_speed_road: 60, base_speed_offroad: 40, base_armor: 150, max_crew: 4, frontal_area_m2: 3.5, drag_coefficient: 0.8 },
            infantry_fighting_vehicle: { name: "Veículo de Combate de Infantaria", cost: 850000, weight: 25000, metal_cost: 12000, base_speed_road: 70, base_speed_offroad: 50, base_armor: 80, max_crew: 3, frontal_area_m2: 2.8, drag_coefficient: 0.85 },
            armored_personnel_carrier: { name: "Veículo de Transporte de Pessoal", cost: 600000, weight: 15000, metal_cost: 8000, base_speed_road: 80, base_speed_offroad: 55, base_armor: 50, max_crew: 2, frontal_area_m2: 2.5, drag_coefficient: 0.9 },
            tank_destroyer: { name: "Caça-Tanques", cost: 900000, weight: 30000, metal_cost: 15000, base_speed_road: 75, base_speed_offroad: 50, base_armor: 100, max_crew: 3, frontal_area_m2: 3.0, drag_coefficient: 0.8 },
            self_propelled_artillery: { name: "Artilharia Autopropulsada", cost: 1100000, weight: 40000, metal_cost: 18000, base_speed_road: 60, base_speed_offroad: 35, base_armor: 70, max_crew: 5, frontal_area_m2: 3.8, drag_coefficient: 0.95 },
            self_propelled_anti_aircraft: { name: "AA Autopropulsada", cost: 950000, weight: 30000, metal_cost: 14000, base_speed_road: 70, base_speed_offroad: 45, base_armor: 60, max_crew: 3, frontal_area_m2: 3.0, drag_coefficient: 0.85 },
            armored_car: { name: "Carro Blindado", cost: 750000, weight: 10000, metal_cost: 6000, base_speed_road: 95, base_speed_offroad: 60, base_armor: 40, max_crew: 3, frontal_area_m2: 2.2, drag_coefficient: 0.75 },
            light_armored_vehicle: { name: "Veículo Blindado Leve", cost: 500000, weight: 8000, metal_cost: 4000, base_speed_road: 90, base_speed_offroad: 55, base_armor: 30, max_crew: 2, frontal_area_m2: 2.0, drag_coefficient: 0.8 },
        },
        mobility_types: {
            esteiras: { name: "Esteiras", cost: 1000000, weight: 5000, metal_cost: 15000, speed_road_mult: 1.0, speed_offroad_mult: 1.0, armor_mult: 1.0, maintenance_mod: 0.05, durability: 1.0, drive_sprocket_radius_m: 0.45, rolling_resistance_coeff_road: 0.015, rolling_resistance_coeff_offroad: 0.08 },
            rodas_blindadas: { name: "Rodas Blindadas", cost: 800000, weight: 3500, metal_cost: 10000, speed_road_mult: 1.2, speed_offroad_mult: 0.7, armor_mult: 0.8, maintenance_mod: 0.02, durability: 0.95, drive_sprocket_radius_m: 0.35, rolling_resistance_coeff_road: 0.01, rolling_resistance_coeff_offroad: 0.09 },
            semi_lagartas: { name: "Semi-lagartas", cost: 650000, weight: 4000, metal_cost: 12000, speed_road_mult: 1.1, speed_offroad_mult: 0.85, armor_mult: 0.9, maintenance_mod: 0.08, durability: 0.9, drive_sprocket_radius_m: 0.4, rolling_resistance_coeff_road: 0.012, rolling_resistance_coeff_offroad: 0.085 },
        },
        suspension_types: {
            torsion_bar: { name: "Barra de Torção", cost: 40000, weight: 800, metal_cost: 3000, comfort_mod: 0.15, offroad_maneuver_mod: 0.10, stability_mod: 0.05, reliability_mod: 0.0, description: "A rodagem mais comum da era moderna, oferece um bom equilíbrio entre desempenho e conforto." },
            christie: { name: "Christie", cost: 30000, weight: 650, metal_cost: 2000, speed_offroad_mult: 1.15, comfort_mod: 0.10, offroad_maneuver_mod: 0.10, stability_mod: 0, reliability_mod: -0.10, description: "Excelente velocidade cross-country, mas manutenção mais complexa." },
            hydropneumatic: { name: "Hidropneumática", cost: 120000, weight: 1200, metal_cost: 8000, comfort_mod: 0.25, offroad_maneuver_mod: 0.20, stability_mod: 0.20, reliability_mod: -0.20, description: "Oferece o maior conforto e estabilidade, mas é extremamente cara e complexa para o período." },
            coil_spring: { name: "Mola Helicoidal", cost: 10000, weight: 500, metal_cost: 1000, comfort_mod: 0.05, offroad_maneuver_mod: 0.05, stability_mod: 0, reliability_mod: 0.05, description: "Opção mais simples e barata. Menos eficaz que a barra de torção." },
        },
        engines: {
            v12_diesel: { name: "V12 Diesel", cost: 150000, weight: 1200, metal_cost: 8000, min_power: 600, max_power: 1000, base_consumption: 0.55, fire_risk: 0.05, base_reliability: 1.10, max_rpm: 3000, complex: true },
            v8_diesel: { name: "V8 Diesel", cost: 120000, weight: 1000, metal_cost: 6000, min_power: 450, max_power: 800, base_consumption: 0.6, fire_risk: 0.06, base_reliability: 1.15, max_rpm: 3200, complex: true },
            gas_turbine: { name: "Turbina a Gás", cost: 250000, weight: 800, metal_cost: 15000, min_power: 1000, max_power: 1500, base_consumption: 1.5, fire_risk: 0.15, base_reliability: 0.90, max_rpm: 25000, complex: true },
            i6_gasoline: { name: "I6 Gasolina", cost: 90000, weight: 700, metal_cost: 5000, min_power: 300, max_power: 600, base_consumption: 0.8, fire_risk: 0.1, base_reliability: 1.0, max_rpm: 3500, complex: false },
        },
        fuel_types: {
            diesel: { name: "Diesel", cost_mod: 1.10, consumption_mod: 0.7, fire_risk_mod: 0.02, power_mod: 0.95, energy_density: 38.6, description: "Maior eficiência, alto torque, menor inflamabilidade." },
            gasoline: { name: "Gasolina", cost_mod: 1.0, consumption_mod: 1.0, fire_risk_mod: 0.05, power_mod: 1.0, energy_density: 34.8, description: "Padrão. Alta potência, partida fácil, mas volátil e inflamável." },
            multi_fuel: { name: "Multi-combustível", cost_mod: 1.20, consumption_mod: 0.9, fire_risk_mod: 0.04, power_mod: 0.98, energy_density: 36.5, description: "Permite usar vários tipos de combustível. Mais complexo e caro, mas flexível." },
        },
        engine_dispositions: {
            rear: { name: "Traseira", cost: 0, weight: 0, internal_space_mod: 0.05, silhouette_mod: -0.05, engine_vulnerability: 0.1, description: "Mais espaço para torre/combate, silhueta baixa, fácil manutenção." },
            front: { name: "Dianteira", cost: 50000, weight: 200, internal_space_mod: -0.05, front_armor_bonus: 0.10, maneuverability_mod: -0.05, gun_depression_mod: -2, engine_vulnerability: 0.25, description: "Proteção adicional para tripulação (motor como blindagem). Dificulta manobrabilidade, maior chance de dano ao motor." },
        },
        transmission_types: {
            mechanical: { name: "Mecânica", cost: 0, weight: 0, speed_mod: 0.95, maneuver_mod: 0.95, reliability_mod: 0, comfort_mod: 0, fuel_efficiency_mod: 1.0, max_speed_road_limit: 50, max_speed_offroad_limit: 35, gear_ratios: [18.0, 13.0, 9.5, 7.0, 5.0, 3.0, 1.8, 1.0], efficiency: 0.88, final_drive_ratio: 8.5, complex: false, description: "Transmissão manual padrão. Confiável, mas menos eficiente e mais complexa para o motorista." },
            hydromechanical: { name: "Hidromecânica", cost: 200000, weight: 500, speed_mod: 1.05, maneuver_mod: 1.05, reliability_mod: -0.10, comfort_mod: 0.10, fuel_efficiency_mod: 0.90, max_speed_road_limit: 70, max_speed_offroad_limit: 50, gear_ratios: [12.0, 9.0, 6.5, 4.0, 2.5, 1.0], efficiency: 0.92, final_drive_ratio: 7.0, complex: true, description: "Melhora o manuseio e o conforto. Trocas de marcha automáticas ou semi-automáticas. Aumenta a complexidade e custo." },
            cross_drive: { name: "Cross-drive", cost: 300000, weight: 800, speed_mod: 1.10, maneuver_mod: 1.15, reliability_mod: -0.15, comfort_mod: 0.15, fuel_efficiency_mod: 0.85, max_speed_road_limit: 80, max_speed_offroad_limit: 60, gear_ratios: [10.0, 7.5, 5.0, 3.0, 1.5, 1.0], efficiency: 0.95, final_drive_ratio: 6.0, complex: true, description: "Combina transmissão, direção e freios em um único sistema. Oferece excelente manobrabilidade e facilidade de operação, mas é muito cara." },
        },
        armor_production_types: {
            rolled_homogeneous: { name: "Aço Laminado Homogêneo (RHA)", cost_mod: 1.0, weight_mod: 1.0, effective_armor_factor: 1.0, reliability_mod: 0, complex: false, description: "Padrão da indústria do pós-guerra. Ótima proteção contra projéteis cinéticos." }, 
            cast: { name: "Aço Fundido", cost_mod: 1.10, weight_mod: 1.15, effective_armor_factor: 0.90, reliability_mod: -0.05, complex: true, description: "Permite formas curvas e complexas, mas é mais pesado e menos resistente que o RHA para a mesma espessura." }, 
            composite: { name: "Blindagem Composta", cost_mod: 3.0, weight_mod: 1.5, effective_armor_factor: 1.5, reliability_mod: -0.20, complex: true, description: "Combina materiais como cerâmica e aço para proteção superior contra munições HEAT e APFSDS." },
        },
        armor_materials_and_additions: { 
            explosive_reactive_armor: { name: "Blindagem Reativa (ERA)", cost: 50000, weight: 500, metal_cost: 2000, effective_armor_bonus: 0.30, reliability_mod: -0.10, complex: true, description: "Blocos explosivos que detonam para neutralizar ogivas HEAT. Eficaz, mas adiciona peso e complexidade." },
            spaced_armor: { name: "Blindagem Espaçada", cost: 20000, weight: 300, metal_cost: 500, effective_armor_bonus: 0.10, complex: false, description: "Placas com espaço para deformar projéteis ou detonar ogivas prematuramente. Adiciona peso e complexidade." }, 
            bar_armor: { name: "Bar Armor", cost: 15000, weight: 250, metal_cost: 400, effective_armor_bonus: 0.05, complex: false, description: "Grade de metal que impede a ativação de ogivas HEAT em pontos específicos do veículo. Leve, mas menos eficaz que outros tipos de blindagem adicional." }, 
        },
        armaments: { 
            coaxial_mg: { cost: 15000, weight: 20, metal_cost: 800, name: "Metralhadora Coaxial", main_gun_priority: 0, complex: false },
            aa_mg: { cost: 25000, weight: 30, metal_cost: 1200, name: "Metralhadora Antiaérea", main_gun_priority: 0, crew_exposure_risk: 0.05, complex: false },
            smoke_dischargers: { cost: 10000, weight: 15, metal_cost: 200, name: "Lançadores de Fumaça", main_gun_priority: 0, complex: false },
            grenade_mortars: { cost: 20000, weight: 60, metal_cost: 300, name: "Lançadores de Granadas/Morteiros", main_gun_priority: 0, complex: false },
        },
        gun_types: {
            rifled: { name: "Alma Raiada (Rifled)", cost_mod: 1.0, weight_mod: 1.0, accuracy_long_range_mod: 1.1, velocity_mod: 1.0, complex: false, description: "O cano raiado faz o projétil girar, aumentando a estabilidade e a precisão. Ideal para munição HE e HEAT." },
            smoothbore: { name: "Alma Lisa (Smoothbore)", cost_mod: 1.2, weight_mod: 1.2, accuracy_long_range_mod: 0.9, velocity_mod: 1.2, complex: true, description: "Cano sem raias, ideal para disparar projéteis APFSDS a altíssima velocidade. Menos preciso com munições não-estabilizadas." },
        },
        reload_mechanisms: {
            manual: { name: "Manual", cost: 0, weight: 0, rpm_modifier: 1.0, crew_burden: 1.0, reliability_mod: 0, complex: false, description: "Simples, barato e leve. A cadência de tiro depende da tripulação." },
            autoloader: { name: "Autoloader", cost: 150000, weight: 1000, rpm_modifier: 1.5, crew_burden: 0, reliability_mod: -0.20, complex: true, description: "Carregador automático. Garante cadência de tiro consistente e reduz a tripulação, mas é caro, pesado e propenso a falhas." },
        },
        ammo_types: {
            apfsds: { name: "APFSDS", cost_per_round: 2500, weight_per_round: 15, penetration_mod: 2.0, description: "Projétil de energia cinética. Excelente penetração contra blindagem RHA e composta." },
            heat: { name: "HEAT", cost_per_round: 2000, weight_per_round: 20, penetration_mod: 1.5, description: "Ogiva explosiva antitanque. A perfuração não é afetada pelo alcance." },
            he: { name: "HE", cost_per_round: 1500, weight_per_round: 30, penetration_mod: 0.5, description: "Projétil de alto explosivo. Efetivo contra alvos leves e infantaria." },
            atgm: { name: "ATGM", cost_per_round: 5000, weight_per_round: 25, penetration_mod: 2.5, description: "Míssil guiado. Alta precisão e perfuração contra a maioria dos alvos." },
        },
        equipment: {
            laser_rangefinder: { cost: 80000, weight: 5, metal_cost: 1500, name: "Telêmetro a Laser", accuracy_bonus: 0.15, complex: true, description: "Aumenta drasticamente a precisão de tiro em longa distância." },
            thermal_sights: { cost: 150000, weight: 10, metal_cost: 3000, name: "Miras Térmicas", target_acquisition_bonus: 0.20, complex: true, description: "Permite a detecção de alvos em qualquer condição de luz." },
            fire_control_system: { cost: 200000, weight: 20, metal_cost: 5000, name: "Sistema de Controle de Tiro", accuracy_bonus: 0.25, complex: true, description: "Calcula automaticamente a solução de tiro para o artilheiro, melhorando a precisão e velocidade do engajamento." },
            stabilizer: { cost: 70000, weight: 50, metal_cost: 1000, name: "Estabilizador de Canhão", accuracy_on_move_bonus: 0.30, complex: true, description: "Permite atirar com precisão em movimento. Essencial para a mobilidade-fogo." },
            NBC_protection: { cost: 50000, weight: 100, metal_cost: 2000, name: "Proteção NBC", crew_comfort_mod: 0.05, complex: true, description: "Sistema de pressurização para proteger a tripulação de agentes nucleares, biológicos e químicos." },
            dozer_blades: { cost: 30000, weight: 1500, metal_cost: 500, name: "Lâminas de Escavadeira", front_armor_bonus: 0.05, complex: false, description: "Permite limpeza de obstáculos e criação de posições defensivas." },
            extra_fuel: { cost: 10000, weight: 400, metal_cost: 150, name: "Tanques Extras de Combustível", range_bonus_percent: 0.50, complex: false, description: "Aumenta significativamente o raio de ação. Vulneráveis a fogo inimigo." },
            radio_equipment: { cost: 40000, weight: 25, metal_cost: 600, name: "Rádio", coordination_bonus: 0.10, complex: true, description: "Melhora drasticamente a coordenação tática e a comunicação." },
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
        armor_cost_per_mm: 500, 
        armor_metal_cost_per_mm: 20,
        armor_weight_per_mm_per_sqm: 7.85, 
        avg_hull_surface_area_sqm: { 
            front: 2.5,
            side: 6.0,
            rear: 2.0,
            top: 10.0,
            bottom: 10.0,
            turret_base: 4.0 
        },
        default_armor_rear_mm: 50,
        default_armor_top_mm: 25,
        default_armor_bottom_mm: 20,
        default_armor_side_angle: 45, 
        default_armor_rear_angle: 30, 
        default_armor_turret_angle: 60, 

        crew_comfort_base: 100, 
        crew_comfort_penalty_per_crewman: 8, 
        crew_comfort_penalty_per_armor_volume: 0.0001, 
        power_to_weight_speed_factor_road: 3.5, 
        power_to_weight_speed_factor_offroad: 2.5, 
        base_fuel_capacity_liters: 1200, 
        fuel_capacity_per_extra_tank: 500, 
        base_fuel_efficiency_km_per_liter: 0.015, 
        fuel_consumption_per_hp_per_kg_factor: 1.5, 
        hp_reliability_penalty_threshold: 800, 
        hp_reliability_penalty_factor: 0.00008, 
        base_reliability: 1.0, 
        
        base_max_crew_by_type: {
            main_battle_tank: 4,
            infantry_fighting_vehicle: 3,
            armored_personnel_carrier: 2,
            tank_destroyer: 3,
            self_propelled_artillery: 5,
            self_propelled_anti_aircraft: 3,
            armored_car: 3,
            light_armored_vehicle: 2,
        },
        max_tech_civil_level: 200, 
        max_urbanization_level: 100, 
        civil_tech_cost_reduction_factor: 0.35, 
        urbanization_cost_reduction_factor: 0.35 
    }
};

// --- DADOS DE TANQUES REAIS (GUERRA FRIA) ---
const realWorldTanks = [
    // --- Tanques de 1ª Geração ---
    { id: 'm48_patton', name: 'M48 Patton', image_url: 'https://placehold.co/400x200/cccccc/333333?text=M48+Patton', type: 'main_battle_tank', min_weight_kg: 45000, max_weight_kg: 50000, main_gun_caliber_mm: 90, armor_front_mm: 120, speed_road_kmh: 48, mobility_type: 'esteiras', engine_power_hp: 810, doctrine_affinity: ['qualitative_doctrine', 'regional_defense_doctrine'] },
    { id: 't-54', name: 'T-54', image_url: 'https://placehold.co/400x200/cccccc/333333?text=T-54', type: 'main_battle_tank', min_weight_kg: 35000, max_weight_kg: 37000, main_gun_caliber_mm: 100, armor_front_mm: 100, speed_road_kmh: 50, mobility_type: 'esteiras', engine_power_hp: 520, doctrine_affinity: ['quantitative_doctrine'] },
    { id: 'centurion', name: 'Centurion', image_url: 'https://placehold.co/400x200/cccccc/333333?text=Centurion', type: 'main_battle_tank', min_weight_kg: 50000, max_weight_kg: 52000, main_gun_caliber_mm: 105, armor_front_mm: 150, speed_road_kmh: 35, mobility_type: 'esteiras', engine_power_hp: 650, doctrine_affinity: ['qualitative_doctrine', 'regional_defense_doctrine'] },

    // --- Tanques de 2ª Geração ---
    { id: 'm60_patton', name: 'M60 Patton', image_url: 'https://placehold.co/400x200/cccccc/333333?text=M60+Patton', type: 'main_battle_tank', min_weight_kg: 52000, max_weight_kg: 54000, main_gun_caliber_mm: 105, armor_front_mm: 120, speed_road_kmh: 48, mobility_type: 'esteiras', engine_power_hp: 750, doctrine_affinity: ['qualitative_doctrine'] },
    { id: 't-62', name: 'T-62', image_url: 'https://placehold.co/400x200/cccccc/333333?text=T-62', type: 'main_battle_tank', min_weight_kg: 37000, max_weight_kg: 40000, main_gun_caliber_mm: 115, armor_front_mm: 110, speed_road_kmh: 50, mobility_type: 'esteiras', engine_power_hp: 580, doctrine_affinity: ['quantitative_doctrine'] },
    { id: 't-72', name: 'T-72', image_url: 'https://placehold.co/400x200/cccccc/333333?text=T-72', type: 'main_battle_tank', min_weight_kg: 41000, max_weight_kg: 43000, main_gun_caliber_mm: 125, armor_front_mm: 200, speed_road_kmh: 60, mobility_type: 'esteiras', engine_power_hp: 780, doctrine_affinity: ['quantitative_doctrine'] },
    { id: 'leopard_1', name: 'Leopard 1', image_url: 'https://placehold.co/400x200/cccccc/333333?text=Leopard+1', type: 'main_battle_tank', min_weight_kg: 40000, max_weight_kg: 42000, main_gun_caliber_mm: 105, armor_front_mm: 70, speed_road_kmh: 65, mobility_type: 'esteiras', engine_power_hp: 830, doctrine_affinity: ['qualitative_doctrine'] },

    // --- Tanques de 3ª Geração ---
    { id: 'm1_abrams', name: 'M1 Abrams', image_url: 'https://placehold.co/400x200/cccccc/333333?text=M1+Abrams', type: 'main_battle_tank', min_weight_kg: 55000, max_weight_kg: 60000, main_gun_caliber_mm: 105, armor_front_mm: 400, speed_road_kmh: 72, mobility_type: 'esteiras', engine_power_hp: 1500, doctrine_affinity: ['qualitative_doctrine'] },
    { id: 'leopard_2', name: 'Leopard 2', image_url: 'https://placehold.co/400x200/cccccc/333333?text=Leopard+2', type: 'main_battle_tank', min_weight_kg: 55000, max_weight_kg: 60000, main_gun_caliber_mm: 120, armor_front_mm: 500, speed_road_kmh: 68, mobility_type: 'esteiras', engine_power_hp: 1500, doctrine_affinity: ['qualitative_doctrine'] },
    { id: 'challenger_2', name: 'Challenger 2', image_url: 'https://placehold.co/400x200/cccccc/333333?text=Challenger+2', type: 'main_battle_tank', min_weight_kg: 60000, max_weight_kg: 62000, main_gun_caliber_mm: 120, armor_front_mm: 600, speed_road_kmh: 56, mobility_type: 'esteiras', engine_power_hp: 1200, doctrine_affinity: ['qualitative_doctrine'] },
    { id: 'merkava_mk1', name: 'Merkava Mk. 1', image_url: 'https://placehold.co/400x200/cccccc/333333?text=Merkava+Mk.1', type: 'main_battle_tank', min_weight_kg: 60000, max_weight_kg: 63000, main_gun_caliber_mm: 105, armor_front_mm: 200, speed_road_kmh: 46, mobility_type: 'esteiras', engine_power_hp: 900, doctrine_affinity: ['regional_defense_doctrine'] },
];

// --- FUNÇÕES AUXILIARES ---

// Função auxiliar para limpar e parsear float
function cleanAndParseFloat(value) {
    if (typeof value !== 'string') {
        return parseFloat(value) || 0; 
    }
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
            return [];
        }

        const headerLine = lines[0];
        const rawHeaders = [];
        let inQuote = false;
        let currentHeader = '';
        for (let i = 0; i < headerLine.length; i++) {
            const char = headerLine[i];
            if (char === '"') {
                inQuote = !inQuote;
                currentHeader += char;
            } else if (char === ',' && !inQuote) {
                rawHeaders.push(currentHeader.trim());
                currentHeader = '';
            } else {
                currentHeader += char;
            }
        }
        rawHeaders.push(currentHeader.trim());

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
                    currentValue += char;
                } else if (char === ',' && !inQuote) {
                    values.push(currentValue.trim());
                    currentValue = '';
                } else {
                    currentValue += char;
                }
            }
            values.push(currentValue.trim());

            const cleanedValues = values.map(val => {
                if (val.startsWith('"') && val.endsWith('"') && val.length > 1) {
                    return val.substring(1, val.length - 1).replace(/""/g, '"');
                }
                return val;
            });

            if (cleanedValues.length >= headers.length) {
                const row = {};
                for (let j = 0; j < headers.length; j++) {
                    row[headers[j]] = cleanedValues[j];
                }
                data.push(row);
            } else {
                console.warn(`Skipping malformed row in ${url} (line ${i + 1}): Expected at least ${headers.length} columns, got ${cleanedValues.length}. Raw Line: "${lines[i]}"`);
            }
        }
        console.log(`Parsed ${data.length} rows from ${url}. First row example:`, data[0]);
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
        const [countryStatsRaw, veiculosRaw, metaisRaw] = await Promise.all([ 
            parseCSV(COUNTRY_STATS_URL),
            parseCSV(VEICULOS_URL),
            parseCSV(METAIS_URL)
        ]);

        console.log("Dados brutos da aba Geral (Country Stats):", countryStatsRaw);
        console.log("Dados brutos da aba Veiculos:", veiculosRaw);
        console.log("Dados brutos da aba Metais:", metaisRaw);

        const tempCountries = {};

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
            }
        });

        veiculosRaw.forEach(row => {
            const countryName = row['País'] ? row['País'].trim() : ''; 
            if (countryName && tempCountries[countryName]) { 
                tempCountries[countryName].production_capacity = cleanAndParseFloat(row['Capacidade de produção']);
                tempCountries[countryName].tech_level_vehicles = cleanAndParseFloat(row['Nível Veiculos']);
            }
        });

        metaisRaw.forEach(row => {
            const countryName = row['País'] ? row['País'].trim() : ''; 
            if (countryName && tempCountries[countryName]) { 
                tempCountries[countryName].metal_balance = cleanAndParseFloat(row['Saldo']); 
            }
        });
        
        tempCountries["Genérico / Padrão"] = tempCountries["Genérico / Padrão"] || {};
        tempCountries["Genérico / Padrão"].production_capacity = tempCountries["Genérico / Padrão"].production_capacity || 100000000;
        tempCountries["Genérico / Padrão"].metal_balance = tempCountries["Genérico / Padrão"].metal_balance || 5000000;
        tempCountries["Genérico / Padrão"].tech_level_vehicles = tempCountries["Genérico / Padrão"].tech_level_vehicles || 50;
        tempCountries["Genérico / Padrão"].tech_civil = tempCountries["Genérico / Padrão"].tech_civil || 50;
        tempCountries["Genérico / Padrão"].urbanization = tempCountries["Genérico / Padrão"].urbanization || 50;

        gameData.countries = tempCountries;
        populateCountryDropdown();
        countryDropdown.disabled = false;
        updateCalculations(); 

    } catch (error) {
        console.error("Erro fatal ao carregar dados das planilhas:", error);
        countryDropdown.innerHTML = '<option value="error">Erro ao carregar dados</option>';
        countryDropdown.disabled = true;
        gameData.countries = { "Genérico / Padrão": { production_capacity: 100000000, metal_balance: 5000000, tech_level_vehicles: 50, tech_civil: 50, urbanization: 50 } };
        populateCountryDropdown();
        countryDropdown.disabled = false;
        updateCalculations();
        const statusEl = document.getElementById('status');
        if (statusEl) {
            statusEl.textContent = `Erro ao carregar dados externos. Por favor, verifique os URLs das planilhas e se estão 'Publicadas na web' como CSV.`;
            statusEl.className = "pill err";
        }
    }
}

// Popula o dropdown de países com base nos dados do gameData.countries
function populateCountryDropdown() {
    const dropdown = document.getElementById('country_doctrine');
    dropdown.innerHTML = '';
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

// Calcula a blindagem efetiva com base na espessura e ângulo
function calculateEffectiveArmor(thickness, angle) {
    if (thickness <= 0) return 0;
    const angleRad = angle * (Math.PI / 180);
    return thickness / Math.cos(angleRad);
}

function calculateTankPerformance(stats) {
    const G = 9.81;
    const HP_TO_WATTS = 745.7;
    const KMH_TO_MS = 1 / 3.6;

    const massKg = stats.weightTonnes * 1000;
    const weightN = massKg * G;
    const enginePowerWatts = stats.engine.powerHp * HP_TO_WATTS;
    const effectivePowerWatts = enginePowerWatts * stats.transmission.efficiency;

    const getTotalResistanceForce = (v_ms) => {
        const slopeRadians = (stats.environment.slopeDegrees || 0) * (Math.PI / 180);
        const gradeResistanceN = weightN * Math.sin(slopeRadians);
        const rollingResistanceN = stats.environment.rollingResistanceCoeff * weightN * Math.cos(slopeRadians);
        const dragResistanceN = 0.5 * (stats.environment.airDensity || 1.225) * stats.chassis.frontalAreaM2 * stats.chassis.dragCoefficient * Math.pow(v_ms, 2);
        return rollingResistanceN + dragResistanceN + gradeResistanceN;
    };
    
    let equilibriumVelocity_ms = 0;
    let high = 100 * KMH_TO_MS;
    let low = 0;
    let mid;

    for (let i = 0; i < 100; i++) {
        mid = (high + low) / 2;
        if (mid < 0.001) {
            equilibriumVelocity_ms = 0;
            break; 
        }
        
        const resistivePower = getTotalResistanceForce(mid) * mid;

        if (resistivePower > effectivePowerWatts) {
            high = mid;
        } else {
            low = mid;
        }
        equilibriumVelocity_ms = low;
    }
    
    const topGearRatio = stats.transmission.gearRatios.reduce((min, current) => Math.min(min, current), Infinity); 
    
    const maxWheelRpm = stats.engine.maxRpm / (topGearRatio * stats.transmission.finalDriveRatio);
    const maxWheelRps = maxWheelRpm / 60;
    const sprocketCircumferenceM = 2 * Math.PI * stats.chassis.driveSprocketRadiusM;
    const mechanicalTopSpeed_ms = maxWheelRps * sprocketCircumferenceM;

    let finalTopSpeed_ms = Math.min(equilibriumVelocity_ms, mechanicalTopSpeed_ms);
    let finalTopSpeed_kmh = finalTopSpeed_ms * 3.6;

    if (stats.transmission.max_speed_road_limit && stats.environment.rollingResistanceCoeff < 0.05) {
        finalTopSpeed_kmh = Math.min(finalTopSpeed_kmh, stats.transmission.max_speed_road_limit);
    }
    if (stats.transmission.max_speed_offroad_limit && stats.environment.rollingResistanceCoeff >= 0.05) {
        finalTopSpeed_kmh = Math.min(finalTopSpeed_kmh, stats.transmission.max_speed_offroad_limit);
    }

    const effectiveHpPerTonne = (stats.engine.powerHp * stats.transmission.efficiency) / stats.weightTonnes;
    const terrainResistanceFactor = 1 + stats.environment.rollingResistanceCoeff * 10;
    const accelerationScore = effectiveHpPerTonne / terrainResistanceFactor;

    return {
        topSpeedKmh: finalTopSpeed_kmh,
        theoreticalEquilibriumSpeedKmh: equilibriumVelocity_ms * 3.6,
        mechanicalLimitSpeedKmh: mechanicalTopSpeed_ms * 3.6,
        powerToWeightRatio: stats.engine.powerHp / stats.weightTonnes,
        accelerationScore: accelerationScore,
    };
}

function getVehicleCategory(playerVehicleTypeName, totalWeight) {
    switch (playerVehicleTypeName) {
        case 'Carro de Combate Principal': return 'main_battle_tank';
        case 'Veículo de Combate de Infantaria': return 'infantry_fighting_vehicle';
        case 'Veículo de Transporte de Pessoal': return 'armored_personnel_carrier';
        case 'Caça-Tanques': return 'tank_destroyer';
        case 'Artilharia Autopropulsada': return 'self_propelled_artillery';
        case 'AA Autopropulsada': return 'self_propelled_anti_aircraft';
        case 'Carro Blindado': return 'armored_car';
        case 'Veículo Blindado Leve': return 'light_armored_vehicle';
        default:
            if (totalWeight < 10000) return 'light_armored_vehicle';
            if (totalWeight >= 10000 && totalWeight < 30000) return 'infantry_fighting_vehicle';
            return 'main_battle_tank';
    }
}

let numericalAttributeRanges = {};

function calculateNumericalRanges() {
    const numericalAttributes = [
        'min_weight_kg', 'max_weight_kg', 'main_gun_caliber_mm', 
        'armor_front_mm', 'speed_road_kmh', 'engine_power_hp'
    ];

    numericalAttributes.forEach(attr => {
        let minVal = Infinity;
        let maxVal = -Infinity;
        realWorldTanks.forEach(tank => {
            if (tank[attr] !== undefined && tank[attr] !== null) {
                const value = (attr === 'min_weight_kg' || attr === 'max_weight_kg') ? (tank.min_weight_kg + tank.max_weight_kg) / 2 : tank[attr];
                if (value < minVal) minVal = value;
                if (value > maxVal) maxVal = value;
            }
        });
        numericalAttributeRanges[attr] = { min: minVal, max: maxVal, range: maxVal - minVal };
    });
}

function calculateGowerDistance(tank1, tank2, weights, ranges) {
    let totalWeightedDistance = 0;
    let totalWeightSum = 0;

    const numericalAttrs = [
        { name: 'totalWeight', realAttr: ['min_weight_kg', 'max_weight_kg'], weightKey: 'total_weight_weight' },
        { name: 'mainGunCaliber', realAttr: 'main_gun_caliber_mm', weightKey: 'main_gun_caliber_weight' },
        { name: 'effectiveArmorFront', realAttr: 'armor_front_mm', weightKey: 'armor_front_weight' },
        { name: 'speedRoad', realAttr: 'speed_road_kmh', weightKey: 'speed_road_weight' },
        { name: 'enginePower', realAttr: 'engine_power_hp', weightKey: 'engine_power_weight' }
    ];

    numericalAttrs.forEach(attrConfig => {
        const playerVal = tank1[attrConfig.name];
        let realVal;
        if (Array.isArray(attrConfig.realAttr)) { 
            realVal = (tank2[attrConfig.realAttr[0]] + tank2[attrConfig.realAttr[1]]) / 2;
        } else {
            realVal = tank2[attrConfig.realAttr];
        }

        const weight = weights[attrConfig.weightKey] || 1;
        totalWeightSum += weight;

        if (playerVal !== undefined && realVal !== undefined && ranges[attrConfig.realAttr] && ranges[attrConfig.realAttr].range > 0) {
            const diff = Math.abs(playerVal - realVal);
            const normalizedDiff = diff / ranges[attrConfig.realAttr].range;
            totalWeightedDistance += normalizedDiff * weight;
        } else if (playerVal !== undefined && realVal !== undefined) {
             const diff = (playerVal === realVal) ? 0 : 1;
             totalWeightedDistance += diff * weight;
        } else {
            totalWeightedDistance += 1 * weight;
        }
    });

    const categoricalAttrs = [
        { name: 'vehicleCategory', realAttr: 'type', weightKey: 'type_weight' },
        { name: 'mobilityTypeName', realAttr: 'mobility_type', weightKey: 'mobility_type_weight' },
        { name: 'doctrineName', realAttr: 'doctrine_affinity', weightKey: 'doctrine_weight' }
    ];

    categoricalAttrs.forEach(attrConfig => {
        const playerVal = tank1[attrConfig.name];
        const realVal = tank2[attrConfig.realAttr];
        const weight = weights[attrConfig.weightKey] || 1;
        totalWeightSum += weight;

        let diff = 1;
        if (attrConfig.realAttr === 'doctrine_affinity') {
            if (playerVal && Array.isArray(realVal) && realVal.includes(playerVal.toLowerCase().replace(/ /g, '_'))) {
                diff = 0; 
            }
        } else {
            if (playerVal && realVal && playerVal.toLowerCase() === realVal.toLowerCase()) {
                diff = 0; 
            }
        }
        totalWeightedDistance += diff * weight;
    });

    return totalWeightSum > 0 ? totalWeightedDistance / totalWeightSum : 0;
}

function findBestMatchingTank(playerTank) {
    let bestMatch = null;
    let minGowerDistance = Infinity;

    const weights = {
        type_weight: 5.0, 
        main_gun_caliber_weight: 4.0, 
        armor_front_weight: 3.5, 
        speed_road_weight: 2.5, 
        total_weight_weight: 2.0, 
        engine_power_weight: 2.0,
        mobility_type_weight: 1.5,
        doctrine_weight: 1.0
    };

    const playerTankData = {
        vehicleCategory: getVehicleCategory(playerTank.vehicleTypeName, playerTank.totalWeight),
        totalWeight: playerTank.totalWeight,
        mainGunCaliber: playerTank.mainArmamentCaliber,
        effectiveArmorFront: playerTank.effectiveArmorFront,
        speedRoad: playerTank.speedRoad,
        mobilityTypeName: playerTank.mobilityTypeName,
        enginePower: playerTank.totalPower,
        doctrineName: playerTank.doctrineName
    };

    for (const realTank of realWorldTanks) {
        const realTankAdjusted = {
            ...realTank,
            totalWeight: (realTank.min_weight_kg + realTank.max_weight_kg) / 2
        };
        
        const distance = calculateGowerDistance(playerTankData, realTankAdjusted, weights, numericalAttributeRanges);

        if (distance < minGowerDistance) {
            minGowerDistance = distance;
            bestMatch = realTank;
        }
    }
    return bestMatch;
}

function updateCalculations() {
    let baseUnitCost = 0;
    let baseMetalCost = 0;
    let totalWeight = 0;
    let totalPower = 0;
    let effectiveArmorFront = 0;
    let effectiveArmorSide = 0;
    let totalReliability = gameData.constants.base_reliability;
    let crewComfort = gameData.constants.crew_comfort_base;
    let maxRangeModifier = 1;

    let speedRoadMultiplier = 1;
    let speedOffroadMultiplier = 1;
    let armorEffectiveMultiplier = 1;
    let maneuverabilityMultiplier = 1;
    let fuelConsumptionMultiplier = 1;
    let overallReliabilityMultiplier = 1;
    let internalSpaceMultiplier = 1;
    let gunDepressionModifier = 0;
    let silhouetteModifier = 0;
    
    let doctrineCostModifier = 1;
    let doctrineMaxCrewMod = 0;
    let doctrineName = '-';
    let countryCostReductionFactor = 0;
    let countryProductionCapacity = 0;
    let countryMetalBalance = 0;
    let countryTechLevelVehicles = 50;
    let armorCostWeightReduction = 0;
    let durabilityBonus = 0;
    let engineCostWeightReduction = 0;
    let armorCostWeightIncrease = 0;
    let maxMainGunCaliberLimit = Infinity;
    let secondaryArmamentLimitPenalty = 0;
    let advancedComponentCostIncrease = 0;
    let complexComponentReliabilityPenalty = 0;
    let doctrineProductionQualitySliderBias = 0;

    const vehicleName = document.getElementById('vehicle_name').value || 'Blindado Sem Nome';
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    let numCrewmen = parseInt(document.getElementById('num_crewmen').value) || 0;
    const selectedCountryName = document.getElementById('country_doctrine').value;
    const selectedTankDoctrine = document.getElementById('tank_doctrine').value;
    const vehicleType = document.getElementById('vehicle_type').value;
    const mobilityType = document.getElementById('mobility_type').value;
    const suspensionType = document.getElementById('suspension_type').value;
    const engineType = document.getElementById('engine_type').value;
    const enginePower = parseInt(document.getElementById('engine_power').value) || 0;
    const fuelType = document.getElementById('fuel_type').value;
    const engineDisposition = document.getElementById('engine_disposition').value;
    const transmissionType = document.getElementById('transmission_type').value;
    const armorProductionType = document.getElementById('armor_production_type').value;
    const armorFront = parseInt(document.getElementById('armor_front').value) || 0;
    const armorFrontAngle = parseInt(document.getElementById('armor_front_angle').value) || 0;
    const armorSide = parseInt(document.getElementById('armor_side').value) || 0;
    const armorTurret = parseInt(document.getElementById('armor_turret').value) || 0;
    let mainArmamentCaliber = parseInt(document.getElementById('main_gun_caliber').value) || 0;
    const gunType = document.getElementById('gun_type').value;
    const reloadMechanism = document.getElementById('reload_mechanism').value;
    const totalAmmoCapacityInput = document.getElementById('total_ammo_capacity');
    const productionQualitySliderValue = parseInt(document.getElementById('production_quality_slider').value) || 50;

    const uiElements = {
        countryBonusNoteEl: document.getElementById('country_bonus_note'),
        doctrineNoteEl: document.getElementById('doctrine_note'),
        suspensionNoteEl: document.getElementById('suspension_note'),
        engineNoteEl: document.getElementById('engine_power_note'),
        fuelNoteEl: document.getElementById('fuel_note'),
        armorProductionNoteEl: document.getElementById('armor_production_note'),
        reloadMechanismNoteEl: document.getElementById('reload_mechanism_note'),
        totalAmmoCapacityNoteEl: document.getElementById('total_ammo_capacity_note'),
        ammoQtyNoteEl: document.getElementById('ammo_qty_note'),
        crewNoteEl: document.getElementById('crew_note'),
        statusPillsEl: document.getElementById('status_pills'),
        statusEl: document.getElementById('status'),
        productionQualityNoteEl: document.getElementById('production_quality_note'),
        displayTypeEl: document.getElementById('display_type'),
        displayDoctrineEl: document.getElementById('display_doctrine'),
        numCrewmenInput: document.getElementById('num_crewmen'),
        displayFuelTypeEl: document.getElementById('fuel_type'), 
        displayEngineDispositionNoteEl: document.getElementById('engine_disposition_note'),
        displayTransmissionNoteEl: document.getElementById('transmission_note'),
        displayMainArmamentEl: document.getElementById('main_armament'),
        displayUnitCostEl: document.getElementById('unit_cost'),
        displayTotalProductionCostEl: document.getElementById('total_production_cost'),
        displayTotalMetalCostEl: document.getElementById('total_metal_cost'),
        displayTotalWeightEl: document.getElementById('total_weight'),
        displayTotalPowerEl: document.getElementById('total_power'),
        displaySpeedRoadEl: document.getElementById('speed_road'),
        displaySpeedOffroadEl: document.getElementById('speed_offroad'),
        displayEffectiveArmorFrontEl: document.getElementById('effective_armor_front_display'),
        displayEffectiveArmorSideEl: document.getElementById('effective_armor_side_display'),
        displayMaxRangeEl: document.getElementById('max_range'),
        displayCrewComfortEl: document.getElementById('crew_comfort_display'),
        displayReliabilityEl: document.getElementById('reliability_display'),
        displayCountryProductionCapacityEl: document.getElementById('country_production_capacity'),
        displayProducibleUnitsEl: document.getElementById('producible_units'),
        displayCountryMetalBalanceEl: document.getElementById('country_metal_balance'),
        totalCostLabelEl: document.getElementById('total_cost_label'),
        displayNameEl: document.getElementById('display_name')
    };

    let tankDataOutput = {};

    function processBasicInfoAndDoctrine(uiElements) {
        const countryData = gameData.countries[selectedCountryName];
        if (countryData) {
            countryProductionCapacity = parseFloat(countryData.production_capacity) || 0;
            countryMetalBalance = parseFloat(countryData.metal_balance) || 0;
            countryTechLevelVehicles = parseFloat(countryData.tech_level_vehicles) || 50;
            
            const civilTechLevel = Math.min(parseFloat(countryData.tech_civil) || 0, gameData.constants.max_tech_civil_level);
            const urbanizationLevel = Math.min(parseFloat(countryData.urbanization) || 0, gameData.constants.max_urbanization_level);

            let civilTechReduction = (civilTechLevel / gameData.constants.max_tech_civil_level) * gameData.constants.civil_tech_cost_reduction_factor;
            let urbanizationReduction = (urbanizationLevel / gameData.constants.max_urbanization_level) * gameData.constants.urbanization_cost_reduction_factor;

            countryCostReductionFactor = Math.min(0.75, civilTechReduction + urbanizationReduction); 
            
            uiElements.countryBonusNoteEl.textContent = `Bônus de ${selectedCountryName}: Tec Veículos ${countryTechLevelVehicles}, Tec Civil ${civilTechLevel}, Urbanização ${urbanizationLevel}. Redução de Custo total: ${(countryCostReductionFactor * 100).toFixed(1)}%.`;
        } else {
            uiElements.countryBonusNoteEl.textContent = '';
        }

        const doctrineData = gameData.doctrines[selectedTankDoctrine]; 
        if (doctrineData) {
            doctrineCostModifier = doctrineData.cost_modifier;
            speedRoadMultiplier *= (doctrineData.speed_modifier || 1);
            speedOffroadMultiplier *= (doctrineData.speed_modifier || 1);
            armorEffectiveMultiplier *= (doctrineData.armor_effectiveness_modifier || 1);
            overallReliabilityMultiplier *= (doctrineData.reliability_modifier || 1);
            crewComfort *= (doctrineData.crew_comfort_modifier || 1);
            maneuverabilityMultiplier *= (doctrineData.maneuverability_modifier || 1);
            maxRangeModifier *= (doctrineData.range_modifier || 1);
            
            doctrineMaxCrewMod = doctrineData.max_crew_mod || 0;
            doctrineName = doctrineData.name;
            uiElements.doctrineNoteEl.textContent = `Doutrina de ${doctrineData.name}: ${doctrineData.description}`;

            armorCostWeightReduction = doctrineData.armor_cost_weight_reduction_percent || 0;
            durabilityBonus = doctrineData.durability_bonus || 0;
            engineCostWeightReduction = doctrineData.engine_cost_weight_reduction_percent || 0;
            armorCostWeightIncrease = doctrineData.armor_cost_weight_increase_percent || 0;
            maxMainGunCaliberLimit = doctrineData.max_main_gun_caliber_limit || Infinity;
            secondaryArmamentLimitPenalty = doctrineData.secondary_armament_limit_penalty || 0;
            advancedComponentCostIncrease = doctrineData.advanced_component_cost_increase || 0;
            complexComponentReliabilityPenalty = doctrineData.complex_component_reliability_penalty || 0;
            doctrineProductionQualitySliderBias = doctrineData.production_quality_slider_bias || 0;
            
            crewComfort *= (1 - (doctrineData.base_comfort_penalty || 0)); 
            
            if (doctrineData.country_production_capacity_bonus) {
                countryProductionCapacity *= (1 + doctrineData.country_production_capacity_bonus);
            }
            if (doctrineData.cost_reduction_percent) {
                doctrineCostModifier *= (1 - doctrineData.cost_reduction_percent);
            }
            if (doctrineData.metal_efficiency_bonus) {
                baseMetalCost *= (1 - doctrineData.metal_efficiency_bonus);
            }
        } else {
            uiElements.doctrineNoteEl.textContent = '';
        }

        tankDataOutput.vehicleName = vehicleName;
        tankDataOutput.quantity = quantity;
        tankDataOutput.selectedCountryName = selectedCountryName;
        tankDataOutput.doctrineName = doctrineName;
    }

    function processChassisAndMobility(uiElements) {
        let currentMaxCrew = 0;
        let typeData = null;
        let vehicleTypeName = '-';

        if (vehicleType && gameData.components.vehicle_types[vehicleType]) {
            typeData = gameData.components.vehicle_types[vehicleType];
            baseUnitCost += typeData.cost;
            baseMetalCost += typeData.metal_cost || 0;
            totalWeight += typeData.weight;
            currentMaxCrew = typeData.max_crew; 
            vehicleTypeName = typeData.name;
            uiElements.displayTypeEl.textContent = typeData.name;
            uiElements.displayDoctrineEl.textContent = doctrineName;
            uiElements.displayNameEl.textContent = vehicleName;
        } else {
            uiElements.displayTypeEl.textContent = '-';
            uiElements.displayDoctrineEl.textContent = '-';
        }
        
        currentMaxCrew += doctrineMaxCrewMod;
        currentMaxCrew = Math.max(2, currentMaxCrew); 

        numCrewmen = Math.min(numCrewmen, currentMaxCrew);
        uiElements.numCrewmenInput.value = numCrewmen;
        uiElements.numCrewmenInput.max = currentMaxCrew;

        let mobilityData = null; 
        let mobilityTypeName = '-';
        if (mobilityType && gameData.components.mobility_types[mobilityType]) { 
            mobilityData = gameData.components.mobility_types[mobilityType];
            baseUnitCost += mobilityData.cost;
            baseMetalCost += mobilityData.metal_cost || 0;
            totalWeight += mobilityData.weight;
            speedRoadMultiplier *= mobilityData.speed_road_mult;
            speedOffroadMultiplier *= mobilityData.speed_offroad_mult;
            overallReliabilityMultiplier *= (1 - mobilityData.maintenance_mod);
            mobilityTypeName = mobilityData.name;
        }

        let suspensionData = null; 
        let suspensionTypeName = '-';
        let suspensionDescription = '';
        if (suspensionType && gameData.components.suspension_types[suspensionType]) { 
            suspensionData = gameData.components.suspension_types[suspensionType];
            baseUnitCost += suspensionData.cost;
            baseMetalCost += suspensionData.metal_cost || 0;
            totalWeight += suspensionData.weight;
            crewComfort += suspensionData.comfort_mod * gameData.constants.crew_comfort_base;
            speedOffroadMultiplier *= (suspensionData.speed_offroad_mult || 1);
            maneuverabilityMultiplier *= (1 + (suspensionData.offroad_maneuver_mod || 0));
            overallReliabilityMultiplier *= (1 + (suspensionData.reliability_mod || 0));
            uiElements.suspensionNoteEl.textContent = suspensionData.description;
            suspensionTypeName = suspensionData.name;
            suspensionDescription = suspensionData.description;

        } else {
            uiElements.suspensionNoteEl.textContent = '';
        }

        tankDataOutput.vehicleTypeName = vehicleTypeName;
        tankDataOutput.mobilityTypeName = mobilityTypeName;
        tankDataOutput.suspensionTypeName = suspensionTypeName;
        tankDataOutput.suspensionDescription = suspensionDescription;

        return { typeData, mobilityData, suspensionData };
    }

    function processEngineAndPropulsion(uiElements, currentEngineData) {
        let engineTypeName = '-';
        let enginePowerNote = '';
        if (engineType && gameData.components.engines[engineType]) { 
            currentEngineData.data = gameData.components.engines[engineType];
            engineTypeName = currentEngineData.data.name;
            if (enginePower < currentEngineData.data.min_power || enginePower > currentEngineData.data.max_power) {
                enginePowerNote = `Potência deve estar entre ${currentEngineData.data.min_power} e ${currentEngineData.data.max_power} HP para ${currentEngineData.data.name}.`;
                totalPower = 0;
            } else {
                enginePowerNote = `Potência min/max: ${currentEngineData.data.min_power}/${currentEngineData.data.max_power} HP. Consumo base: ${currentEngineData.data.base_consumption.toFixed(2)} L/HP.`;
                let engineComponentCost = currentEngineData.data.cost;
                let engineMetalComponentCost = currentEngineData.data.metal_cost || 0;

                engineComponentCost *= (1 - engineCostWeightReduction);
                engineMetalComponentCost *= (1 - engineCostWeightReduction);

                if (currentEngineData.data.complex && advancedComponentCostIncrease > 0) {
                    engineComponentCost *= (1 + advancedComponentCostIncrease);
                    engineMetalComponentCost *= (1 + advancedComponentCostIncrease);
                }

                baseUnitCost += engineComponentCost;
                baseMetalCost += engineMetalComponentCost;
                totalWeight += currentEngineData.data.weight;
                totalPower = enginePower;
                overallReliabilityMultiplier *= currentEngineData.data.base_reliability;

                if (enginePower > gameData.constants.hp_reliability_penalty_threshold) {
                    const hpExcess = enginePower - gameData.constants.hp_reliability_penalty_threshold;
                    overallReliabilityMultiplier -= hpExcess * gameData.constants.hp_reliability_penalty_factor;
                }
            }
            uiElements.engineNoteEl.textContent = enginePowerNote;
        } else {
            uiElements.engineNoteEl.textContent = 'Selecione um tipo de motor válido.';
        }

        let fuelData = null; 
        let fuelTypeName = '-';
        let fuelTypeDescription = '';
        if (fuelType && gameData.components.fuel_types[fuelType]) { 
            fuelData = gameData.components.fuel_types[fuelType];
            fuelTypeName = fuelData.name;
            fuelTypeDescription = fuelData.description;
            if (currentEngineData.data) {
                baseUnitCost += (currentEngineData.data.cost * (fuelData.cost_mod - 1));
                baseMetalCost += (currentEngineData.data.metal_cost || 0) * (fuelData.cost_mod - 1);
            }
            
            fuelConsumptionMultiplier *= fuelData.consumption_mod;
            totalPower *= fuelData.power_mod;
            overallReliabilityMultiplier *= (1 - fuelData.fire_risk_mod); 
            if (fuelData.weight_mod) totalWeight *= fuelData.weight_mod;
            if (fuelData.speed_mod) {
                speedRoadMultiplier *= fuelData.speed_mod;
                speedOffroadMultiplier *= fuelData.speed_mod;
            }
            uiElements.fuelNoteEl.textContent = fuelData.description;
        }

        let dispositionData = null; 
        let engineDispositionName = '-';
        let engineDispositionDescription = '';
        if (engineDisposition && gameData.components.engine_dispositions[engineDisposition]) { 
            dispositionData = gameData.components.engine_dispositions[engineDisposition];
            baseUnitCost += dispositionData.cost;
            totalWeight += dispositionData.weight;
            internalSpaceMultiplier *= (1 + (dispositionData.internal_space_mod || 0));
            maneuverabilityMultiplier *= (1 + (dispositionData.maneuverability_mod || 0));
            silhouetteModifier += (dispositionData.silhouette_mod || 0);
            gunDepressionModifier += (dispositionData.gun_depression_mod || 0);
            overallReliabilityMultiplier *= (1 - (dispositionData.engine_vulnerability || 0));
            engineDispositionName = dispositionData.name;
            engineDispositionDescription = dispositionData.description;
            uiElements.displayEngineDispositionNoteEl.textContent = dispositionData.description;
        }

        let transmissionData = null; 
        let transmissionTypeName = '-';
        let transmissionDescription = '';
        if (transmissionType && gameData.components.transmission_types[transmissionType]) { 
            transmissionData = gameData.components.transmission_types[transmissionType];
            let transmissionComponentCost = transmissionData.cost;
            let transmissionMetalComponentCost = transmissionData.metal_cost || 0;

            if (transmissionData.complex && advancedComponentCostIncrease > 0) {
                transmissionComponentCost *= (1 + advancedComponentCostIncrease);
                transmissionMetalComponentCost *= (1 + advancedComponentCostIncrease);
            }
            if (transmissionData.complex && complexComponentReliabilityPenalty > 0) {
                overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
            }

            baseUnitCost += transmissionComponentCost;
            baseMetalCost += transmissionMetalComponentCost;
            totalWeight += transmissionData.weight;
            speedRoadMultiplier *= transmissionData.speed_mod;
            speedOffroadMultiplier *= transmissionData.speed_mod;
            maneuverabilityMultiplier *= transmissionData.maneuver_mod;
            overallReliabilityMultiplier *= (1 + (transmissionData.reliability_mod || 0));
            crewComfort += transmissionData.comfort_mod * gameData.constants.crew_comfort_base;
            fuelConsumptionMultiplier *= (1 + (1 - transmissionData.fuel_efficiency_mod));
            uiElements.displayTransmissionNoteEl.textContent = transmissionData.description;
            transmissionTypeName = transmissionData.name;
            transmissionDescription = transmissionData.description;
        } else {
            uiElements.displayTransmissionNoteEl.textContent = '';
        }

        tankDataOutput.engineTypeName = engineTypeName;
        tankDataOutput.enginePower = enginePower;
        tankDataOutput.fuelTypeName = fuelTypeName;
        tankDataOutput.fuelTypeDescription = fuelTypeDescription;
        tankDataOutput.engineDispositionName = engineDispositionName;
        tankDataOutput.engineDispositionDescription = engineDispositionDescription;
        tankDataOutput.transmissionTypeName = transmissionTypeName;
        tankDataOutput.transmissionDescription = transmissionDescription;

        return { currentEngineData: currentEngineData.data, transmissionData }; 
    }

    function processArmor(uiElements) {
        let armorProductionData = null; 
        let armorProductionTypeName = '-';
        let armorProductionDescription = '';
        if (armorProductionType && gameData.components.armor_production_types[armorProductionType]) { 
            armorProductionData = gameData.components.armor_production_types[armorProductionType];
            armorEffectiveMultiplier *= armorProductionData.effective_armor_factor;
            overallReliabilityMultiplier *= (1 + (armorProductionData.reliability_mod || 0));
            uiElements.armorProductionNoteEl.textContent = armorProductionData.description;
            armorProductionTypeName = armorProductionData.name;
            armorProductionDescription = armorProductionData.description;

            if (armorProductionData.complex && advancedComponentCostIncrease > 0) {
                baseUnitCost *= (1 + advancedComponentCostIncrease);
                baseMetalCost *= (1 + advancedComponentCostIncrease);
            }
            if (armorProductionData.complex && complexComponentReliabilityPenalty > 0) {
                overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
            }
        } else {
            uiElements.armorProductionNoteEl.textContent = '';
        }

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
            currentArmorCost *= (armorProductionData.cost_mod || 1);
            currentMetalArmorCost *= (armorProductionData.cost_mod || 1);
        }

        currentArmorCost *= (1 - armorCostWeightReduction);
        currentMetalArmorCost *= (1 - armorCostWeightReduction);
        currentArmorCost *= (1 + armorCostWeightIncrease);
        currentMetalArmorCost *= (1 + armorCostWeightIncrease);

        baseUnitCost += currentArmorCost;
        baseMetalCost += currentMetalArmorCost;
        totalWeight += currentArmorWeight;

        effectiveArmorFront = calculateEffectiveArmor(armorFront, armorFrontAngle) * armorEffectiveMultiplier;
        effectiveArmorSide = calculateEffectiveArmor(armorSide, armorSideAngle) * armorEffectiveMultiplier;

        let general_armor_effective_bonus = 0;
        const selectedAdditionalArmor = [];

        document.querySelectorAll('.form-section .item-row input[type="checkbox"]:checked').forEach(checkbox => {
            const armorId = checkbox.id;
            const armorData = gameData.components.armor_materials_and_additions[armorId]; 
            if (armorData) {
                let additionalArmorCost = armorData.cost;
                let additionalArmorMetalCost = armorData.metal_cost || 0;

                if (armorData.complex && advancedComponentCostIncrease > 0) {
                    additionalArmorCost *= (1 + advancedComponentCostIncrease);
                    additionalArmorMetalCost *= (1 + additionalArmorMetalCost);
                }
                if (armorData.complex && complexComponentReliabilityPenalty > 0) {
                    overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
                }

                baseUnitCost += additionalArmorCost;
                totalWeight += armorData.weight;
                baseMetalCost += additionalArmorMetalCost; 
                selectedAdditionalArmor.push(armorData.name);
                
                if (armorData.effective_armor_bonus) {
                    general_armor_effective_bonus += armorData.effective_armor_bonus;
                }
            }
        });

        effectiveArmorFront *= (1 + general_armor_effective_bonus);
        effectiveArmorSide *= (1 + general_armor_effective_bonus);

        crewComfort -= (totalWeight / 1000) * gameData.constants.crew_comfort_penalty_per_armor_volume;

        tankDataOutput.armorProductionTypeName = armorProductionTypeName;
        tankDataOutput.armorProductionDescription = armorProductionDescription;
        tankDataOutput.armorFront = armorFront;
        tankDataOutput.armorFrontAngle = armorFrontAngle;
        tankDataOutput.armorSide = armorSide;
        tankDataOutput.armorTurret = armorTurret;
        tankDataOutput.selectedAdditionalArmor = selectedAdditionalArmor;
    }

    function processArmaments(uiElements) {
        let mainArmamentText = 'N/A';
        let mainGunLengthDescription = '';

        if (mainArmamentCaliber > maxMainGunCaliberLimit) {
            mainArmamentCaliber = maxMainGunCaliberLimit;
            document.getElementById('main_gun_caliber').value = mainArmamentCaliber;
        }

        const gunTypeData = gameData.components.gun_types[gunType]; 
        let mainGunCost = 0;
        let mainGunWeight = 0;

        if (mainArmamentCaliber > 0) {
            mainGunCost = mainArmamentCaliber * 5000;
            mainGunWeight = mainArmamentCaliber * 25;

            if (gunTypeData) {
                mainGunCost *= gunTypeData.cost_mod;
                mainGunWeight *= gunTypeData.weight_mod;
                mainArmamentText = `${mainArmamentCaliber}mm Canhão de ${gunTypeData.name}`;
                overallReliabilityMultiplier *= (1 + (gunTypeData.reliability_mod || 0));
                if (gunTypeData.complex && advancedComponentCostIncrease > 0) {
                    mainGunCost *= (1 + advancedComponentCostIncrease);
                }
                if (gunTypeData.complex && complexComponentReliabilityPenalty > 0) {
                    overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
                }
            }
        } else {
            mainArmamentText = 'N/A';
        }
        baseUnitCost += mainGunCost;
        baseMetalCost += mainGunWeight * 0.2;
        totalWeight += mainGunWeight;

        const reloadMechanismData = gameData.components.reload_mechanisms[reloadMechanism]; 
        let reloadMechanismName = '-';
        let reloadMechanismDescription = '';
        if (reloadMechanismData) {
            let reloadMechanismComponentCost = reloadMechanismData.cost;
            let reloadMechanismMetalCost = reloadMechanismData.metal_cost || 0;

            if (reloadMechanismData.complex && advancedComponentCostIncrease > 0) {
                reloadMechanismComponentCost *= (1 + advancedComponentCostIncrease);
                reloadMechanismMetalCost *= (1 + reloadMechanismMetalCost);
            }
            if (reloadMechanismData.complex && complexComponentReliabilityPenalty > 0) {
                overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
            }

            baseUnitCost += reloadMechanismComponentCost;
            baseMetalCost += reloadMechanismMetalCost;
            totalWeight += reloadMechanismData.weight;
            overallReliabilityMultiplier *= (1 + (reloadMechanismData.reliability_mod || 0));
            uiElements.reloadMechanismNoteEl.textContent = reloadMechanismData.description;
            reloadMechanismName = reloadMechanismData.name;
            reloadMechanismDescription = reloadMechanismData.description;
            if (reloadMechanism === 'autoloader') {
                let currentMaxCrew = parseInt(uiElements.numCrewmenInput.max);
                currentMaxCrew = Math.max(2, currentMaxCrew - 1); 
                uiElements.numCrewmenInput.max = currentMaxCrew;
                numCrewmen = Math.min(numCrewmen, currentMaxCrew); 
                uiElements.numCrewmenInput.value = numCrewmen;
            }
        } else {
            uiElements.reloadMechanismNoteEl.textContent = '';
        }

        let maxAmmoForCaliber = 0;
        if (mainArmamentCaliber > 0) {
            maxAmmoForCaliber = Math.max(15, Math.round(15000 / mainArmamentCaliber));
        }
        if (totalAmmoCapacityInput) {
             totalAmmoCapacityInput.max = maxAmmoForCaliber;
             let totalAmmoCapacity = parseInt(totalAmmoCapacityInput.value) || 0;
             totalAmmoCapacity = Math.min(totalAmmoCapacity, maxAmmoForCaliber); 
             totalAmmoCapacityInput.value = totalAmmoCapacity; 
             if (uiElements.totalAmmoCapacityNoteEl) {
                uiElements.totalAmmoCapacityNoteEl.textContent = `Capacidade máxima para ${mainArmamentCaliber}mm: ${maxAmmoForCaliber} projéteis.`;
             }
        }
        if (mainArmamentCaliber <= 0 && uiElements.totalAmmoCapacityNoteEl) {
            uiElements.totalAmmoCapacityNoteEl.textContent = 'Selecione um calibre de canhão principal para definir a capacidade máxima de munição.';
        }


        let currentTotalAmmoQty = 0;
        const ammoQuantities = {};
        const selectedAmmoTypes = [];
        ['apfsds', 'heat', 'he', 'atgm'].forEach(ammoType => {
            const checkbox = document.getElementById(`ammo_${ammoType}_checkbox`);
            const qtyInput = document.getElementById(`ammo_${ammoType}_qty`);
            let qty = (checkbox && checkbox.checked) ? (parseInt(qtyInput ? qtyInput.value : 1) || 0) : 0;
            if (qty > 0) {
                ammoQuantities[ammoType] = qty;
                currentTotalAmmoQty += qty;
                selectedAmmoTypes.push(`${gameData.components.ammo_types[ammoType].name} (${qty})`);
            } else if(qtyInput) {
                qtyInput.value = 0;
            }
        });

        if (currentTotalAmmoQty > totalAmmoCapacityInput.value) {
            if (uiElements.ammoQtyNoteEl) {
                uiElements.ammoQtyNoteEl.textContent = `⚠️ A quantidade total de munição (${currentTotalAmmoQty}) excede a capacidade máxima (${totalAmmoCapacityInput.value})! Por favor, reduza a quantidade de algum tipo de munição.`;
                uiElements.ammoQtyNoteEl.className = 'muted warn';
            }
        } else if (mainArmamentCaliber > 0 && totalAmmoCapacityInput.value > 0) {
            if (uiElements.ammoQtyNoteEl) {
                uiElements.ammoQtyNoteEl.textContent = `Munição alocada: ${currentTotalAmmoQty}/${totalAmmoCapacityInput.value} projéteis.`;
                uiElements.ammoQtyNoteEl.className = 'muted ok';
            }
        } else {
            if (uiElements.ammoQtyNoteEl) {
                uiElements.ammoQtyNoteEl.textContent = '';
                uiElements.ammoQtyNoteEl.className = '';
            }
        }

        ['apfsds', 'heat', 'he', 'atgm'].forEach(ammoType => {
            const qty = ammoQuantities[ammoType];
            if (qty > 0) {
                const ammoData = gameData.components.ammo_types[ammoType];
                baseUnitCost += ammoData.cost_per_round * qty;
                baseMetalCost += (ammoData.weight_per_round * 0.1) * qty;
                totalWeight += ammoData.weight_per_round * qty;
            }
        });

        const selectedSecondaryArmaments = [];
        let secondaryArmamentCount = 0; 
        document.querySelectorAll('.form-section .item-row input[type="checkbox"]').forEach(checkbox => {
            const armamentId = checkbox.id.replace('_checkbox', ''); 
            const qtyInput = document.getElementById(armamentId + '_qty');
            const qty = checkbox.checked ? (parseInt(qtyInput ? qtyInput.value : 1) || 0) : 0;

            if (qty > 0 && gameData.components.armaments[armamentId]) { 
                const armamentData = gameData.components.armaments[armamentId];
                let armamentComponentCost = armamentData.cost * qty;
                let armamentMetalCost = (armamentData.metal_cost || 0) * qty;

                if (armamentData.complex && advancedComponentCostIncrease > 0) {
                    armamentComponentCost *= (1 + advancedComponentCostIncrease);
                    armamentMetalCost *= (1 + armamentMetalCost);
                }
                if (armamentData.complex && complexComponentReliabilityPenalty > 0) {
                    overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
                }

                baseUnitCost += armamentComponentCost;
                baseMetalCost += armamentMetalCost;
                totalWeight += armamentData.weight * qty;
                selectedSecondaryArmaments.push(`${armamentData.name} (${qty}x)`);
                secondaryArmamentCount += qty;
            }
        });

        tankDataOutput.mainArmamentCaliber = mainArmamentCaliber;
        tankDataOutput.mainArmamentText = mainArmamentText;
        tankDataOutput.mainGunLengthDescription = gunType;
        tankDataOutput.reloadMechanismName = reloadMechanismName;
        tankDataOutput.reloadMechanismDescription = reloadMechanismDescription;
        tankDataOutput.totalAmmoCapacity = totalAmmoCapacityInput ? parseInt(totalAmmoCapacityInput.value) : 0;
        tankDataOutput.currentTotalAmmoQty = currentTotalAmmoQty;
        tankDataOutput.selectedAmmoTypes = selectedAmmoTypes;
        tankDataOutput.selectedSecondaryArmaments = selectedSecondaryArmaments;
    }

    function processExtraEquipment(uiElements) {
        const selectedExtraEquipment = [];
        document.querySelectorAll('.form-section .item-row input[type="checkbox"]:checked').forEach(checkbox => {
            const equipmentId = checkbox.id;
            if (gameData.components.equipment[equipmentId]) { 
                const equipmentData = gameData.components.equipment[equipmentId];
                let equipmentComponentCost = equipmentData.cost;
                let equipmentMetalCost = equipmentData.metal_cost || 0;

                if (equipmentData.complex && advancedComponentCostIncrease > 0) {
                    equipmentComponentCost *= (1 + advancedComponentCostIncrease);
                    equipmentMetalCost *= (1 + equipmentMetalCost);
                }
                if (equipmentData.complex && complexComponentReliabilityPenalty > 0) {
                    overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
                }

                baseUnitCost += equipmentComponentCost;
                baseMetalCost += equipmentMetalCost;
                totalWeight += equipmentData.weight;
                selectedExtraEquipment.push(equipmentData.name);

                if (equipmentData.range_bonus_percent) fuelConsumptionMultiplier *= (1 - equipmentData.range_bonus_percent);
                if (equipmentData.front_armor_bonus) effectiveArmorFront *= (1 + equipmentData.front_armor_bonus);
                if (equipmentData.thermal_signature_reduction) silhouetteModifier -= equipmentData.thermal_signature_reduction;
                
                if (equipmentData.reliability_mod) overallReliabilityMultiplier *= (1 + equipmentData.reliability_mod);
            }
        });
        tankDataOutput.selectedExtraEquipment = selectedExtraEquipment;
    }

    function processCrew(uiElements) {
        crewComfort -= numCrewmen * gameData.constants.crew_comfort_penalty_per_crewman;
        let crewNoteText = '';
        if (numCrewmen < 3 && vehicleType !== 'light_armored_vehicle' && vehicleType !== 'armored_car' && vehicleType !== 'infantry_fighting_vehicle') {
            crewNoteText = 'Tripulação muito pequena para um veículo deste tipo. Isso impactará o desempenho!';
            crewComfort *= 0.7;
            overallReliabilityMultiplier *= 0.8;
        } else {
            crewNoteText = '';
        }
        uiElements.crewNoteEl.textContent = crewNoteText;
        crewComfort = Math.max(0, Math.min(100, crewComfort));
        tankDataOutput.numCrewmen = numCrewmen;
        tankDataOutput.crewNoteText = crewNoteText;
    }

    function applyProductionQualitySlider(uiElements) {
        let sliderNormalizedValue = ((productionQualitySliderValue - 50) / 100) + doctrineProductionQualitySliderBias;
        sliderNormalizedValue = Math.max(-0.5, Math.min(0.5, sliderNormalizedValue)); 

        overallReliabilityMultiplier *= (1 - (sliderNormalizedValue * 0.2)); 
        countryProductionCapacity *= (1 + (sliderNormalizedValue * 0.5)); 

        if (sliderNormalizedValue > 0.1) {
            uiElements.productionQualityNoteEl.textContent = `Priorizando Produção: Maior capacidade, menor confiabilidade.`;
            uiElements.productionQualityNoteEl.style.color = 'var(--accent-warsaw)'; 
        } else if (sliderNormalizedValue < -0.1) {
            uiElements.productionQualityNoteEl.textContent = `Priorizando Qualidade: Maior confiabilidade, menor capacidade.`;
            uiElements.productionQualityNoteEl.style.color = 'var(--accent)'; 
        } else {
            uiElements.productionQualityNoteEl.textContent = `Equilíbrio entre confiabilidade e capacidade de produção.`;
            uiElements.productionQualityNoteEl.style.color = 'var(--muted)';
        }
    }

    function calculateFinalPerformance(uiElements, typeData, mobilityData, currentEngineData, transmissionData) {
        let finalUnitCost = baseUnitCost * doctrineCostModifier * (1 - countryCostReductionFactor);
        
        const currentTypeData = typeData || {}; 
        const currentMobilityData = mobilityData || {};
        const engineDataForCalc = currentEngineData || {};
        const transmissionDataForCalc = transmissionData || {};

        const tankStats = {
            weightTonnes: totalWeight / 1000, 
            engine: {
                powerHp: totalPower,
                maxRpm: engineDataForCalc.max_rpm || 3000 
            },
            transmission: {
                efficiency: transmissionDataForCalc.efficiency || 0.88, 
                gearRatios: transmissionDataForCalc.gear_ratios || [1.0], 
                finalDriveRatio: transmissionDataForCalc.final_drive_ratio || 8.5, 
                max_speed_road_limit: transmissionDataForCalc.max_speed_road_limit || Infinity,
                max_speed_offroad_limit: transmissionDataForCalc.max_speed_offroad_limit || Infinity
            },
            chassis: {
                driveSprocketRadiusM: currentMobilityData.drive_sprocket_radius_m || 0.45, 
                frontalAreaM2: currentTypeData.frontal_area_m2 || 3.5, 
                dragCoefficient: currentTypeData.drag_coefficient || 0.8 
            },
            environment: {
                rollingResistanceCoeff: currentMobilityData.rolling_resistance_coeff_road || 0.015, 
                slopeDegrees: 0,
                airDensity: 1.225 
            }
        };

        const roadPerformance = calculateTankPerformance(tankStats);
        let finalSpeedRoad = roadPerformance.topSpeedKmh;

        tankStats.environment.rollingResistanceCoeff = currentMobilityData.rolling_resistance_coeff_offroad || 0.08; 
        const offRoadPerformance = calculateTankPerformance(tankStats);
        let finalSpeedOffroad = offRoadPerformance.topSpeedKmh;
        
        let finalReliability = Math.max(0.05, Math.min(1, totalReliability * overallReliabilityMultiplier)); 

        let totalFuelCapacity = gameData.constants.base_fuel_capacity_liters;
        if (document.getElementById('extra_fuel')?.checked) {
            totalFuelCapacity += gameData.constants.fuel_capacity_per_extra_tank;
        }

        let consumptionPer100km = (totalPower / 100) * (totalWeight / 1000) * gameData.constants.fuel_consumption_per_hp_per_kg_factor;
        consumptionPer100km *= fuelConsumptionMultiplier;
        consumptionPer100km = Math.max(1, consumptionPer100km); 

        let maxRange = (totalFuelCapacity / consumptionPer100km) * 100;
        maxRange *= maxRangeModifier;

        tankDataOutput.finalUnitCost = Math.round(finalUnitCost).toLocaleString('pt-BR');
        tankDataOutput.totalProductionCost = Math.round(finalUnitCost * quantity).toLocaleString('pt-BR');
        tankDataOutput.totalMetalCost = Math.round(baseMetalCost * quantity).toLocaleString('pt-BR');
        tankDataOutput.totalWeight = Math.round(totalWeight).toLocaleString('pt-BR') + ' kg';
        tankDataOutput.totalPower = Math.round(totalPower).toLocaleString('pt-BR') + ' hp';
        tankDataOutput.speedRoad = Math.round(finalSpeedRoad).toLocaleString('pt-BR') + ' km/h';
        tankDataOutput.speedOffroad = Math.round(finalSpeedOffroad).toLocaleString('pt-BR') + ' km/h';
        tankDataOutput.effectiveArmorFront = Math.round(effectiveArmorFront).toLocaleString('pt-BR') + ' mm';
        tankDataOutput.effectiveArmorSide = Math.round(effectiveArmorSide).toLocaleString('pt-BR') + ' mm'; 
        tankDataOutput.maxRange = Math.round(maxRange).toLocaleString('pt-BR') + ' km';
        tankDataOutput.crewComfort = Math.round(crewComfort) + '%';
        tankDataOutput.reliability = (finalReliability * 100).toFixed(1) + '%';
        tankDataOutput.producibleUnits = 'N/A'; 
        tankDataOutput.countryProductionCapacity = countryProductionCapacity.toLocaleString('pt-BR');
        tankDataOutput.countryMetalBalance = countryMetalBalance.toLocaleString('pt-BR');
    }

    function updateUI(uiElements) {
        uiElements.displayNameEl.textContent = tankDataOutput.vehicleName;
        uiElements.displayTypeEl.textContent = tankDataOutput.vehicleTypeName;
        uiElements.displayDoctrineEl.textContent = tankDataOutput.doctrineName;

        uiElements.displayUnitCostEl.textContent = tankDataOutput.finalUnitCost;
        uiElements.displayTotalWeightEl.textContent = tankDataOutput.totalWeight;
        uiElements.displayTotalPowerEl.textContent = tankDataOutput.totalPower;
        uiElements.displaySpeedRoadEl.textContent = tankDataOutput.speedRoad;
        uiElements.displayEffectiveArmorFrontEl.textContent = tankDataOutput.effectiveArmorFront;
        uiElements.displayMainArmamentEl.textContent = tankDataOutput.mainArmamentText;
        uiElements.displayReliabilityEl.textContent = tankDataOutput.reliability;
        uiElements.displayCrewComfortEl.textContent = tankDataOutput.crewComfort;
        
        let statusMessage = "Selecione o tipo de veículo e motor para começar";
        let statusClass = "warn";
        if (vehicleType && engineType && totalPower > 0) {
            const P_TO_W_THRESHOLD_GOOD = 20; 
            const P_TO_W_THRESHOLD_OK = 15;
            const currentTotalWeight = parseFloat(tankDataOutput.totalWeight.replace(' kg', '').replace(/\./g, '').replace(',', '.'));
            const currentTotalPower = parseFloat(tankDataOutput.totalPower.replace(' hp', '').replace(/\./g, '').replace(',', '.'));
            const powerToWeightRatio = currentTotalPower / (currentTotalWeight / 1000);
            
            const currentSpeedRoad = parseFloat(tankDataOutput.speedRoad.replace(' km/h', '').replace(/\./g, '').replace(',', '.'));
            const currentEffectiveArmorFront = parseFloat(tankDataOutput.effectiveArmorFront.replace(' mm', '').replace(/\./g, '').replace(',', '.'));
            const currentCrewComfort = parseFloat(tankDataOutput.crewComfort.replace('%', '').replace(',', '.'));
            const currentReliability = parseFloat(tankDataOutput.reliability.replace('%', '').replace(',', '.')) / 100;
            
            if (powerToWeightRatio >= P_TO_W_THRESHOLD_GOOD && currentSpeedRoad >= 60) {
                statusMessage = "Força industrial";
                statusClass = "ok";
            } else if (powerToWeightRatio >= P_TO_W_THRESHOLD_OK && currentSpeedRoad >= 50) {
                statusMessage = "Equilíbrio";
                statusClass = "ok";
            } else if (currentSpeedRoad < 40) {
                statusMessage = "Mobilidade baixa";
                statusClass = "warn";
            } else if (currentReliability < 0.7) {
                statusMessage = "Confiabilidade baixa";
                statusClass = "err";
            } else if (currentCrewComfort < 60) {
                statusMessage = "Conforto baixo";
                statusClass = "warn";
            } else {
                statusMessage = "Configuração ok";
                statusClass = "ok";
            }
        }
        if (uiElements.statusEl) {
            uiElements.statusEl.className = `inline`;
            const pills = uiElements.statusEl.querySelectorAll('.pill');
            pills.forEach(pill => pill.style.display = 'none');
            const targetPill = uiElements.statusEl.querySelector(`.pill.${statusClass}`);
            if (targetPill) {
                targetPill.style.display = 'inline-block';
                targetPill.textContent = statusMessage;
            }
        }
        tankDataOutput.statusMessage = statusMessage;
        tankDataOutput.statusClass = statusClass;
    }

    const generateFicha = () => {
        const tankData = tankDataOutput; 
        localStorage.setItem('tankSheetData', JSON.stringify(tankData));
        localStorage.setItem('realWorldTanksData', JSON.stringify(realWorldTanks)); 
        window.open('ficha.html', '_blank'); 
    };
    window.generateFicha = generateFicha;


    processBasicInfoAndDoctrine(uiElements);
    const { typeData, mobilityData } = processChassisAndMobility(uiElements);
    const { currentEngineData, transmissionData } = processEngineAndPropulsion(uiElements, {}); 
    processArmor(uiElements);
    processArmaments(uiElements);
    processExtraEquipment(uiElements);
    processCrew(uiElements);
    applyProductionQualitySlider(uiElements); 
    calculateFinalPerformance(uiElements, typeData, mobilityData, currentEngineData, transmissionData);
    updateUI(uiElements);

    return tankDataOutput;
}

window.onload = function() {
    loadGameDataFromSheets(); 
    calculateNumericalRanges(); 

    window.updateCalculations = updateCalculations;
    document.querySelectorAll('input, select').forEach(el => {
      el.addEventListener('change', updateCalculations);
      el.addEventListener('input', updateCalculations);
    });

    const summaryPanel = document.querySelector('.summary-panel');
    if (summaryPanel) {
        summaryPanel.style.cursor = 'pointer'; 
        summaryPanel.title = 'Clique para gerar a ficha detalhada do blindado'; 
        summaryPanel.addEventListener('click', generateFicha);
    }
};
