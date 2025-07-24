// js/modules/constants.js

export const COUNTRY_STATS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=0&single=true&output=csv';
export const METAIS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=1505649898&single=true&output=csv';
export const VEICULOS_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vR5Pw3aRXSTIGMglyNAUNqLtOl7wjX9bMeFXEASkQYC34g_zDyDx3LE8Vm73FUoNn27UAlKLizQBXBO/pub?gid=1616220418&single=true&output=csv';

export const GAME_CONSTANTS = {
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
};

export const REAL_WORLD_TANKS = [
    // --- Estados Unidos ---
    { id: 'm2a4', name: 'Light Tank M2A4', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m2a4.png', type: 'light_tank', min_weight_kg: 10000, max_weight_kg: 12000, main_gun_caliber_mm: 37, armor_front_mm: 25, speed_road_kmh: 58, mobility_type: 'esteiras', engine_power_hp: 250, doctrine_affinity: ['light_tank_doctrine', 'combined_arms'] },
    { id: 'm3_stuart', name: 'Light Tank M3 Stuart', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m3_stuart.png', type: 'light_tank', min_weight_kg: 12000, max_weight_kg: 14000, main_gun_caliber_mm: 37, armor_front_mm: 38, speed_road_kmh: 58, mobility_type: 'esteiras', engine_power_hp: 250, doctrine_affinity: ['light_tank_doctrine', 'combined_arms'] },
    { id: 'm22_locust', name: 'Light Tank M22 Locust', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m22_locust.png', type: 'light_tank', min_weight_kg: 7000, max_weight_kg: 8000, main_gun_caliber_mm: 37, armor_front_mm: 25, speed_road_kmh: 64, mobility_type: 'esteiras', engine_power_hp: 162, doctrine_affinity: ['light_tank_doctrine', 'combined_arms'] },
    { id: 'm5a1_stuart', name: 'Light Tank M5A1 Stuart', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m5a1_stuart.png', type: 'light_tank', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 37, armor_front_mm: 64, speed_road_kmh: 58, mobility_type: 'esteiras', engine_power_hp: 280, doctrine_affinity: ['light_tank_doctrine', 'combined_arms'] },
    { id: 'm4_sherman', name: 'Medium Tank M4 Sherman', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m4_sherman.png', type: 'medium_tank', min_weight_kg: 30000, max_weight_kg: 32000, main_gun_caliber_mm: 75, armor_front_mm: 51, speed_road_kmh: 38, mobility_type: 'esteiras', engine_power_hp: 400, doctrine_affinity: ['cruiser_tank', 'combined_arms'] },
    { id: 'm4a1_sherman', name: 'Medium Tank M4A1 Sherman', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m4a1_1942_sherman.png', type: 'medium_tank', min_weight_kg: 30000, max_weight_kg: 32000, main_gun_caliber_mm: 75, armor_front_mm: 51, speed_road_kmh: 38, mobility_type: 'esteiras', engine_power_hp: 400, doctrine_affinity: ['cruiser_tank', 'combined_arms'] },
    { id: 'm4a2_sherman', name: 'Medium Tank M4A2 Sherman', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m4a2_sherman.png', type: 'medium_tank', min_weight_kg: 31000, max_weight_kg: 33000, main_gun_caliber_mm: 75, armor_front_mm: 64, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 410, doctrine_affinity: ['cruiser_tank', 'combined_arms'] },
    { id: 'm6a1', name: 'Heavy Tank M6A1', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m6a1.png', type: 'heavy_tank', min_weight_kg: 57000, max_weight_kg: 60000, main_gun_caliber_mm: 76, armor_front_mm: 102, speed_road_kmh: 35, mobility_type: 'esteiras', engine_power_hp: 960, doctrine_affinity: ['combined_arms'] },
    { id: 'm10_gmc', name: '3-inch Gun Motor Carriage M10', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m10.png', type: 'tank_destroyer', min_weight_kg: 28000, max_weight_kg: 30000, main_gun_caliber_mm: 76, armor_front_mm: 57, speed_road_kmh: 48, mobility_type: 'esteiras', engine_power_hp: 375, doctrine_affinity: ['combined_arms'] },
    { id: 'm18_hellcat', name: '76mm Gun Motor Carriage M18 "Hellcat"', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m18_hellcat.png', type: 'tank_destroyer', min_weight_kg: 17000, max_weight_kg: 19000, main_gun_caliber_mm: 76, armor_front_mm: 13, speed_road_kmh: 89, mobility_type: 'esteiras', engine_power_hp: 400, doctrine_affinity: ['cruiser_tank', 'combined_arms'] },
    { id: 'm36_jackson', name: '90mm Gun Motor Carriage M36', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m36.png', type: 'tank_destroyer', min_weight_kg: 29000, max_weight_kg: 31000, main_gun_caliber_mm: 90, armor_front_mm: 64, speed_road_kmh: 48, mobility_type: 'esteiras', engine_power_hp: 400, doctrine_affinity: ['combined_arms'] },
    { id: 'm8_hmc_scott', name: '75mm Howitzer Motor Carriage M8 "Scott"', image_url: 'https://static.encyclopedia.warthunder.com/images/us_m8_scott.png', type: 'spg', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 75, armor_front_mm: 44, speed_road_kmh: 56, mobility_type: 'esteiras', engine_power_hp: 250, doctrine_affinity: ['combined_arms'] },
    { id: 'lvt_a_1', name: 'Landing Vehicle Tracked (Armored) Mark 1', image_url: 'https://static.encyclopedia.warthunder.com/images/us_lvt_a_1.png', type: 'amphibious_vehicle', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 37, armor_front_mm: 12, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 250, doctrine_affinity: ['combined_arms'] },
    { id: 'lvt_a_4', name: 'Landing Vehicle Tracked (Armored) Mark 4', image_url: 'https://static.encyclopedia.warthunder.com/images/us_lvt_a_4.png', type: 'amphibious_vehicle', min_weight_kg: 17000, max_weight_kg: 18000, main_gun_caliber_mm: 75, armor_front_mm: 12, speed_road_kmh: 32, mobility_type: 'esteiras', engine_power_hp: 262, doctrine_affinity: ['combined_arms'] },

    // --- Alemanha ---
    { id: 'pzkpfw_ii_ausf_c_f', name: 'Panzerkampfwagen II Ausf. C/F', image_url: 'https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_ii_ausf_f.png', type: 'light_tank', min_weight_kg: 9000, max_weight_kg: 10000, main_gun_caliber_mm: 20, armor_front_mm: 30, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 140, doctrine_affinity: ['blitzkrieg'] },
    { id: 'pzkpfw_iii_e', name: 'Panzerkampfwagen III Ausf. E', image_url: 'https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_iii_ausf_e.png', type: 'medium_tank', min_weight_kg: 20000, max_weight_kg: 22000, main_gun_caliber_mm: 37, armor_front_mm: 30, speed_road_kmh: 68, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: ['blitzkrieg'] },
    { id: 'pzkpfw_iii_m', name: 'Panzerkampfwagen III Ausf. M', image_url: 'https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_iii_ausf_m.png', type: 'medium_tank', min_weight_kg: 22000, max_weight_kg: 24000, main_gun_caliber_mm: 50, armor_front_mm: 50, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: ['blitzkrieg'] },
    { id: 'pzkpfw_iv_ausf_h', name: 'Panzerkampfwagen IV Ausf. H', image_url: 'https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_iv_ausf_h.png', type: 'medium_tank', min_weight_kg: 25000, max_weight_kg: 27000, main_gun_caliber_mm: 75, armor_front_mm: 80, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: ['blitzkrieg'] },
    { id: 'panther_a', name: 'Panzerkampfwagen V Ausf. A (Panther A)', image_url: 'https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_v_ausf_a_panther.png', type: 'medium_tank', min_weight_kg: 44000, max_weight_kg: 46000, main_gun_caliber_mm: 75, armor_front_mm: 80, speed_road_kmh: 55, mobility_type: 'esteiras', engine_power_hp: 700, doctrine_affinity: ['blitzkrieg'] },
    { id: 'tiger_h1', name: 'Panzerkampfwagen VI Ausf. H1 (Tiger H1)', image_url: 'https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_vi_ausf_h1_tiger.png', type: 'heavy_tank', min_weight_kg: 56000, max_weight_kg: 58000, main_gun_caliber_mm: 88, armor_front_mm: 100, speed_road_kmh: 45, mobility_type: 'esteiras', engine_power_hp: 650, doctrine_affinity: ['blitzkrieg'] },
    { id: 'tiger_ii_b', name: 'Panzerkampfwagen VI Ausf. B (Tiger II)', image_url: 'https://static.encyclopedia.warthunder.com/images/germ_pzkpfw_vi_ausf_b_tiger_iih.png', type: 'heavy_tank', min_weight_kg: 68000, max_weight_kg: 70000, main_gun_caliber_mm: 88, armor_front_mm: 150, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 700, doctrine_affinity: ['blitzkrieg'] },
    { id: 'stug_iii_g', name: 'Sturmgeschütz III Ausf. G', image_url: null, type: 'assault_gun', min_weight_kg: 23000, max_weight_kg: 24000, main_gun_caliber_mm: 75, armor_front_mm: 80, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: ['infantry_tank'] },
    { id: 'stuh_42_g', name: 'Sturmhaubitze 42 Ausf. G', image_url: null, type: 'assault_gun', min_weight_kg: 23000, max_weight_kg: 24000, main_gun_caliber_mm: 105, armor_front_mm: 80, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: ['infantry_tank'] },
    { id: 'jagdpanzer_iv', name: 'Jagdpanzer IV', image_url: null, type: 'tank_destroyer', min_weight_kg: 24000, max_weight_kg: 26000, main_gun_caliber_mm: 75, armor_front_mm: 80, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: [] },
    { id: 'hetzer', name: 'Jagdpanzer 38(t) "Hetzer"', image_url: null, type: 'tank_destroyer', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 75, armor_front_mm: 60, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 150, doctrine_affinity: [] },
    { id: 'ferdinand_elefant', name: 'Ferdinand/Elefant', image_url: null, type: 'tank_destroyer', min_weight_kg: 65000, max_weight_kg: 68000, main_gun_caliber_mm: 88, armor_front_mm: 200, speed_road_kmh: 30, mobility_type: 'esteiras', engine_power_hp: 600, doctrine_affinity: [] },
    { id: 'jagdtiger', name: 'Jagdtiger', image_url: null, type: 'tank_destroyer', min_weight_kg: 70000, max_weight_kg: 72000, main_gun_caliber_mm: 128, armor_front_mm: 250, speed_road_kmh: 34, mobility_type: 'esteiras', engine_power_hp: 700, doctrine_affinity: [] },
    { id: 'jagdpanther_g1', name: 'Jagdpanther G1', image_url: null, type: 'tank_destroyer', min_weight_kg: 45000, max_weight_kg: 47000, main_gun_caliber_mm: 88, armor_front_mm: 80, speed_road_kmh: 55, mobility_type: 'esteiras', engine_power_hp: 700, doctrine_affinity: ['blitzkrieg'] },
    { id: 'wespe', name: 'Wespe', image_url: null, type: 'spg', min_weight_kg: 11000, max_weight_kg: 12000, main_gun_caliber_mm: 105, armor_front_mm: 30, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 140, doctrine_affinity: [] },
    { id: 'nashorn', name: 'Nashorn', image_url: null, type: 'spg', min_weight_kg: 24000, max_weight_kg: 25000, main_gun_caliber_mm: 88, armor_front_mm: 30, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: [] },
    { id: 'hummel', name: 'Hummel', image_url: null, type: 'spg', min_weight_kg: 24000, max_weight_kg: 25000, main_gun_caliber_mm: 150, armor_front_mm: 30, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: [] },
    { id: 'brummbär', name: 'Brummbär/Sturmpanzer IV', image_url: null, type: 'assault_gun', min_weight_kg: 28000, max_weight_kg: 30000, main_gun_caliber_mm: 150, armor_front_mm: 100, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: ['infantry_tank'] },
    { id: 'sdkfz_221', name: 'Sd.Kfz. 221', image_url: null, type: 'armored_car', min_weight_kg: 4000, max_weight_kg: 5000, main_gun_caliber_mm: 7.92, armor_front_mm: 14, speed_road_kmh: 90, mobility_type: 'rodas', engine_power_hp: 90, doctrine_affinity: ['blitzkrieg'] },
    { id: 'sdkfz_222', name: 'Sd.Kfz. 222', image_url: null, type: 'armored_car', min_weight_kg: 4500, max_weight_kg: 5500, main_gun_caliber_mm: 20, armor_front_mm: 14, speed_road_kmh: 80, mobility_type: 'rodas', engine_power_hp: 90, doctrine_affinity: ['blitzkrieg'] },
    { id: 'sdkfz_234_puma', name: 'Sd.Kfz. 234 Puma', image_url: null, type: 'armored_car', min_weight_kg: 11000, max_weight_kg: 12000, main_gun_caliber_mm: 50, armor_front_mm: 30, speed_road_kmh: 85, mobility_type: 'rodas', engine_power_hp: 210, doctrine_affinity: ['blitzkrieg'] },

    // --- União Soviética ---
    { id: 't-26', name: 'T-26', image_url: null, type: 'light_tank', min_weight_kg: 9000, max_weight_kg: 10000, main_gun_caliber_mm: 45, armor_front_mm: 15, speed_road_kmh: 30, mobility_type: 'esteiras', engine_power_hp: 90, doctrine_affinity: ['infantry_tank', 'deep_battle'] },
    { id: 'bt-7m', name: 'BT-7M', image_url: null, type: 'light_tank', min_weight_kg: 13000, max_weight_kg: 14000, main_gun_caliber_mm: 45, armor_front_mm: 22, speed_road_kmh: 86, mobility_type: 'esteiras_rodas', engine_power_hp: 500, doctrine_affinity: ['cruiser_tank', 'deep_battle'] },
    { id: 't-70', name: 'T-70', image_url: null, type: 'light_tank', min_weight_kg: 9000, max_weight_kg: 10000, main_gun_caliber_mm: 45, armor_front_mm: 60, speed_road_kmh: 45, mobility_type: 'esteiras', engine_power_hp: 140, doctrine_affinity: ['light_tank_doctrine', 'deep_battle'] },
    { id: 't-34_1940', name: 'T-34 (1940)', image_url: null, type: 'medium_tank', min_weight_kg: 26000, max_weight_kg: 28000, main_gun_caliber_mm: 76, armor_front_mm: 45, speed_road_kmh: 53, mobility_type: 'esteiras', engine_power_hp: 500, doctrine_affinity: ['blitzkrieg', 'cruiser_tank', 'deep_battle'] },
    { id: 't-34-85', name: 'T-34-85', image_url: null, type: 'medium_tank', min_weight_kg: 31000, max_weight_kg: 33000, main_gun_caliber_mm: 85, armor_front_mm: 45, speed_road_kmh: 54, mobility_type: 'esteiras', engine_power_hp: 500, doctrine_affinity: ['blitzkrieg', 'cruiser_tank', 'deep_battle'] },
    { id: 't-44', name: 'T-44', image_url: null, type: 'medium_tank', min_weight_kg: 31000, max_weight_kg: 32000, main_gun_caliber_mm: 85, armor_front_mm: 120, speed_road_kmh: 50, mobility_type: 'esteiras', engine_power_hp: 520, doctrine_affinity: ['blitzkrieg', 'cruiser_tank', 'deep_battle'] },
    { id: 'kv-1_l-11', name: 'KV-1 (L-11)', image_url: 'https://static.encyclopedia.warthunder.com/images/ussr_kv_1_l_11.png', type: 'heavy_tank', min_weight_kg: 43000, max_weight_kg: 45000, main_gun_caliber_mm: 76, armor_front_mm: 75, speed_road_kmh: 35, mobility_type: 'esteiras', engine_power_hp: 500, doctrine_affinity: ['infantry_tank', 'deep_battle'] },
    { id: 'kv-1s', name: 'KV-1S', image_url: null, type: 'heavy_tank', min_weight_kg: 42000, max_weight_kg: 44000, main_gun_caliber_mm: 76, armor_front_mm: 82, speed_road_kmh: 43, mobility_type: 'esteiras', engine_power_hp: 600, doctrine_affinity: ['cruiser_tank', 'deep_battle'] },
    { id: 'kv-2_1939', name: 'KV-2 (1939) "Rei do Derp"', image_url: null, type: 'heavy_tank', min_weight_kg: 52000, max_weight_kg: 54000, main_gun_caliber_mm: 152, armor_front_mm: 75, speed_road_kmh: 35, mobility_type: 'esteiras', engine_power_hp: 500, doctrine_affinity: ['infantry_tank', 'deep_battle'] },
    { id: 'is-2', name: 'IS-2', image_url: null, type: 'heavy_tank', min_weight_kg: 45000, max_weight_kg: 47000, main_gun_caliber_mm: 122, armor_front_mm: 120, speed_road_kmh: 37, mobility_type: 'esteiras', engine_power_hp: 600, doctrine_affinity: ['infantry_tank', 'deep_battle'] },
    { id: 'zis-30', name: 'ZiS-30', image_url: null, type: 'tank_destroyer', min_weight_kg: 4000, max_weight_kg: 5000, main_gun_caliber_mm: 57, armor_front_mm: 10, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 50, doctrine_affinity: ['light_tank_doctrine', 'deep_battle'] },
    { id: 'su-76m', name: 'SU-76M', image_url: null, type: 'spg', min_weight_kg: 10000, max_weight_kg: 11000, main_gun_caliber_mm: 76, armor_front_mm: 35, speed_road_kmh: 45, mobility_type: 'esteiras', engine_power_hp: 170, doctrine_affinity: ['deep_battle'] },
    { id: 'su-100', name: 'SU-100', image_url: null, type: 'tank_destroyer', min_weight_kg: 31000, max_weight_kg: 32000, main_gun_caliber_mm: 100, armor_front_mm: 75, speed_road_kmh: 50, mobility_type: 'esteiras', engine_power_hp: 500, doctrine_affinity: ['blitzkrieg', 'deep_battle'] },
    { id: 'su-152', name: 'SU-152 "Zveroboy"', image_url: null, type: 'spg', min_weight_kg: 45000, max_weight_kg: 46000, main_gun_caliber_mm: 152, armor_front_mm: 75, speed_road_kmh: 43, mobility_type: 'esteiras', engine_power_hp: 600, doctrine_affinity: ['infantry_tank', 'deep_battle'] },

    // --- Reino Unido ---
    { id: 'churchill_iii', name: 'Tank, Infantry, Mk IV (A22) Churchill III', image_url: 'https://static.encyclopedia.warthunder.com/images/uk_a_22b_mk_3_churchill_1942.png', type: 'infantry_tank', min_weight_kg: 38000, max_weight_kg: 40000, main_gun_caliber_mm: 57, armor_front_mm: 102, speed_road_kmh: 28, mobility_type: 'esteiras', engine_power_hp: 350, doctrine_affinity: ['infantry_tank'] },
    { id: 'churchill_vii', name: 'Tank, Infantry, Mk VII Churchill VII', image_url: null, type: 'infantry_tank', min_weight_kg: 39000, max_weight_kg: 41000, main_gun_caliber_mm: 75, armor_front_mm: 152, speed_road_kmh: 20, mobility_type: 'esteiras', engine_power_hp: 350, doctrine_affinity: ['infantry_tank'] },
    { id: 'cromwell_v', name: 'Tank, Cruiser, Mk VIII, Cromwell V (A27M)', image_url: null, type: 'cruiser_tank', min_weight_kg: 27000, max_weight_kg: 29000, main_gun_caliber_mm: 75, armor_front_mm: 76, speed_road_kmh: 64, mobility_type: 'esteiras', engine_power_hp: 600, doctrine_affinity: ['cruiser_tank'] },
    { id: 'comet_i', name: 'Tank, Cruiser, Mk VIII, Comet I (A34)', image_url: null, type: 'cruiser_tank', min_weight_kg: 32000, max_weight_kg: 34000, main_gun_caliber_mm: 77, armor_front_mm: 102, speed_road_kmh: 50, mobility_type: 'esteiras', engine_power_hp: 600, doctrine_affinity: ['cruiser_tank'] },
    { id: 'valentine', name: 'Tank, Infantry, Mk III Valentine', image_url: null, type: 'infantry_tank', min_weight_kg: 16000, max_weight_kg: 17000, main_gun_caliber_mm: 40, armor_front_mm: 60, speed_road_kmh: 24, mobility_type: 'esteiras', engine_power_hp: 131, doctrine_affinity: ['infantry_tank'] },
    { id: 'matilda_iii', name: 'Tank, Infantry, Mk II Matilda II (A12)', image_url: null, type: 'infantry_tank', min_weight_kg: 26000, max_weight_kg: 28000, main_gun_caliber_mm: 40, armor_front_mm: 78, speed_road: 24, mobility_type: 'esteiras', engine_power_hp: 174, doctrine_affinity: ['infantry_tank'] },
    { id: 'crusader', name: 'Tank, Cruiser, Mk VI Crusader', image_url: null, type: 'cruiser_tank', min_weight_kg: 19000, max_weight_kg: 20000, main_gun_caliber_mm: 40, armor_front_mm: 40, speed_road_kmh: 43, mobility_type: 'esteiras', engine_power_hp: 340, doctrine_affinity: ['cruiser_tank'] },
    { id: 'achilles', name: 'Tank Destroyer, M10 Achilles (17-pdr)', image_url: null, type: 'tank_destroyer', min_weight_kg: 29000, max_weight_kg: 31000, main_gun_caliber_mm: 76, armor_front_mm: 57, speed_road_kmh: 48, mobility_type: 'esteiras', engine_power_hp: 375, doctrine_affinity: [] },
    { id: 'archer', name: 'Tank Destroyer, Self Propelled, Archer', image_url: null, type: 'tank_destroyer', min_weight_kg: 16000, max_weight_kg: 17000, main_gun_caliber_mm: 76, armor_front_mm: 14, speed_road_kmh: 32, mobility_type: 'esteiras', engine_power_hp: 131, doctrine_affinity: [] },
    { id: 'challenger', name: 'Tank, Cruiser, Challenger (A30)', image_url: null, type: 'cruiser_tank', min_weight_kg: 33000, max_weight_kg: 34000, main_gun_caliber_mm: 76, armor_front_mm: 63, speed_road_kmh: 52, mobility_type: 'esteiras', engine_power_hp: 600, doctrine_affinity: ['cruiser_tank'] },

    // --- Japão ---
    { id: 'type_97_chi_ha', name: 'Type 97 Medium Tank Chi-Ha', image_url: 'https://static.encyclopedia.warthunder.com/images/jp_type_97_chi_ha.png', type: 'medium_tank', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 57, armor_front_mm: 25, speed_road_kmh: 38, mobility_type: 'esteiras', engine_power_hp: 170, doctrine_affinity: [] },
    { id: 'type_97_chi_ha_kai', name: 'Type 97 Medium Tank Chi-Ha Kai', image_url: null, type: 'medium_tank', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 47, armor_front_mm: 25, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 170, doctrine_affinity: [] },
    { id: 'type_3_chi_nu', name: 'Type 3 Chi-Nu', image_url: null, type: 'medium_tank', min_weight_kg: 18000, max_weight_kg: 19000, main_gun_caliber_mm: 75, armor_front_mm: 50, speed_road_kmh: 39, mobility_type: 'esteiras', engine_power_hp: 240, doctrine_affinity: [] },
    { id: 'type_95_ha_go', name: 'Type 95 Light Tank Ha-Go', image_url: null, type: 'light_tank', min_weight_kg: 7000, max_weight_kg: 8000, main_gun_caliber_mm: 37, armor_front_mm: 12, speed_road_kmh: 45, mobility_type: 'esteiras', engine_power_hp: 120, doctrine_affinity: ['light_tank_doctrine'] },
    { id: 'type_98_ke_ni', name: 'Type 98 Light Tank Ke-Ni', image_url: null, type: 'light_tank', min_weight_kg: 9000, max_weight_kg: 10000, main_gun_caliber_mm: 37, armor_front_mm: 16, speed_road_kmh: 50, mobility_type: 'esteiras', engine_power_hp: 130, doctrine_affinity: ['light_tank_doctrine'] },
    { id: 'type_2_ka_mi', name: 'Type 2 Amphibious Tank Ka-Mi', image_url: 'https://static.encyclopedia.warthunder.com/images/jp_type_2_ka_mi.png', type: 'amphibious_vehicle', min_weight_kg: 12000, max_weight_kg: 13000, main_gun_caliber_mm: 37, armor_front_mm: 50, speed_road_kmh: 37, mobility_type: 'esteiras', engine_power_hp: 120, doctrine_affinity: [] },
    { id: 'type_1_ho_ni_i', name: 'Type 1 Self-Propelled Gun Ho-Ni I', image_url: null, type: 'spg', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 75, armor_front_mm: 50, speed_road_kmh: 38, mobility_type: 'esteiras', engine_power_hp: 170, doctrine_affinity: [] },
    { id: 'type_3_ho_ni_iii', name: 'Type 3 Tank Destroyer Ho-Ni III', image_url: null, type: 'tank_destroyer', min_weight_kg: 16000, max_weight_kg: 17000, main_gun_caliber_mm: 75, armor_front_mm: 50, speed_road_kmh: 39, mobility_type: 'esteiras', engine_power_hp: 170, doctrine_affinity: [] },
    { id: 'type_4_ho_ro', name: 'Type 4 Ho-Ro', image_url: null, type: 'spg', min_weight_kg: 16000, max_weight_kg: 17000, main_gun_caliber_mm: 150, armor_front_mm: 25, speed_road_kmh: 38, mobility_type: 'esteiras', engine_power_hp: 170, doctrine_affinity: ['infantry_tank'] },
    { id: 'type_98_ta_se', name: 'Type 98 Self-Propelled Anti-Aircraft Gun Ta-Se', image_url: null, type: 'spaa', min_weight_kg: 4000, max_weight_kg: 5000, main_gun_caliber_mm: 20, armor_front_mm: 12, speed_road_kmh: 45, mobility_type: 'esteiras', engine_power_hp: 120, doctrine_affinity: [] },

    // --- Itália ---
    { id: 'l3_33_cc', name: 'L3/33 CC (Carro Veloce)', image_url: 'https://static.encyclopedia.warthunder.com/images/it_l3_cc.png', type: 'tankette', min_weight_kg: 3000, max_weight_kg: 4000, main_gun_caliber_mm: 20, armor_front_mm: 12, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 43, doctrine_affinity: ['light_tank_doctrine'] },
    { id: 'l6_40', name: 'L6/40', image_url: 'https://static.encyclopedia.warthunder.com/images/it_l6.png', type: 'light_tank', min_weight_kg: 6000, max_weight_kg: 7000, main_gun_caliber_mm: 20, armor_front_mm: 30, speed_road_kmh: 42, mobility_type: 'esteiras', engine_power_hp: 70, doctrine_affinity: ['light_tank_doctrine'] },
    { id: 'm13_40', name: 'M13/40 (I)', image_url: null, type: 'medium_tank', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 47, armor_front_mm: 40, speed_road_kmh: 30, mobility_type: 'esteiras', engine_power_hp: 125, doctrine_affinity: [] },
    { id: 'p40', name: 'P40 (P26/40)', image_url: null, type: 'medium_tank', min_weight_kg: 26000, max_weight_kg: 27000, main_gun_caliber_mm: 75, armor_front_mm: 50, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 330, doctrine_affinity: [] },
    { id: 'semovente_75_18_m41', name: 'Semovente da 75/18 M41', image_url: null, type: 'spg', min_weight_kg: 15000, max_weight_kg: 16000, main_gun_caliber_mm: 75, armor_front_mm: 50, speed_road_kmh: 32, mobility_type: 'esteiras', engine_power_hp: 125, doctrine_affinity: ['infantry_tank'] },
    { id: 'autoblinda_41', name: 'Autoblinda 41', image_url: null, type: 'armored_car', min_weight_kg: 7000, max_weight_kg: 8000, main_gun_caliber_mm: 20, armor_front_mm: 14, speed_road_kmh: 78, mobility_type: 'rodas', engine_power_hp: 80, doctrine_affinity: [] },

    // --- França ---
    { id: 'r_35', name: 'Renault R.35 (SA38)', image_url: null, type: 'light_tank', min_weight_kg: 10000, max_weight_kg: 11000, main_gun_caliber_mm: 37, armor_front_mm: 40, speed_road_kmh: 20, mobility_type: 'esteiras', engine_power_hp: 82, doctrine_affinity: ['infantry_tank'] },
    { id: 'h_39', name: 'Hotchkiss H.39', image_url: null, type: 'light_tank', min_weight_kg: 12000, max_weight_kg: 13000, main_gun_caliber_mm: 37, armor_front_mm: 45, speed_road_kmh: 36, mobility_type: 'esteiras', engine_power_hp: 120, doctrine_affinity: ['infantry_tank'] },
    { id: 'fcm_36', name: 'FCM.36', image_url: null, type: 'light_tank', min_weight_kg: 11000, max_weight_kg: 12000, main_gun_caliber_mm: 37, armor_front_mm: 40, speed_road_kmh: 24, mobility_type: 'esteiras', engine_power_hp: 91, doctrine_affinity: ['infantry_tank'] },
    { id: 'somua_s_35', name: 'SOMUA S.35', image_url: null, type: 'medium_tank', min_weight_kg: 19000, max_weight_kg: 20000, main_gun_caliber_mm: 47, armor_front_mm: 55, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 190, doctrine_affinity: ['cruiser_tank'] },
    { id: 'char_b1_bis', name: 'Char B1 bis', image_url: null, type: 'heavy_tank', min_weight_kg: 31000, max_weight_kg: 32000, main_gun_caliber_mm: 75, armor_front_mm: 60, speed_road_kmh: 28, mobility_type: 'esteiras', engine_power_hp: 300, doctrine_affinity: ['infantry_tank'] },
    { id: 'char_2c', name: 'Char 2C', image_url: null, type: 'super_heavy_tank', min_weight_kg: 68000, max_weight_kg: 70000, main_gun_caliber_mm: 75, armor_front_mm: 45, speed_road_kmh: 12, mobility_type: 'esteiras', engine_power_hp: 500, doctrine_affinity: ['infantry_tank'] },
    { id: 'sau_40', name: 'SOMUA SAu 40', image_url: null, type: 'spg', min_weight_kg: 18000, max_weight_kg: 20000, main_gun_caliber_mm: 75, armor_front_mm: 35, speed_road_kmh: 40, mobility_type: 'esteiras', engine_power_hp: 190, doctrine_affinity: [] },
];
