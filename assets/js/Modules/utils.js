// js/modules/utils.js

// Importa REAL_WORLD_TANKS e GAME_CONSTANTS para uso em funções de cálculo e correspondência
import { REAL_WORLD_TANKS, GAME_CONSTANTS } from './constants.js';

// Função auxiliar para limpar e parsear float
export function cleanAndParseFloat(value) {
    if (typeof value !== 'string') {
        return parseFloat(value) || 0; 
    }
    const cleanedValue = value.trim().replace('£', '').replace(/\./g, '').replace(',', '.').replace('%', ''); 
    return parseFloat(cleanedValue) || 0; 
}

// Obtém o texto da opção selecionada em um dropdown
export function getSelectedText(elementId) {
    const selectEl = document.getElementById(elementId);
    if (selectEl && selectEl.selectedIndex >= 0) {
        return selectEl.options[selectEl.selectedIndex].text;
    }
    return 'N/A';
}

// Calcula a blindagem efetiva com base na espessura e ângulo
export function calculateEffectiveArmor(thickness, angle) {
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
export function calculateTankPerformance(stats) {
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

/**
 * Maps a player-defined vehicle type name to a broader, standardized category.
 * @param {string} playerVehicleTypeName - The name of the vehicle type from the player's selection.
 * @param {number} totalWeight - The total calculated weight of the player's tank in kg.
 * @returns {string} A standardized category string (e.g., 'light_tank', 'medium_tank', 'heavy_tank', 'tank_destroyer', 'spg', 'armored_car', 'tankette', 'amphibious_vehicle', 'spaa', 'halftrack', 'super_heavy_tank').
 */
export function getVehicleCategory(playerVehicleTypeName, totalWeight) {
    // Prioritize direct type mapping
    switch (playerVehicleTypeName) {
        case 'Tankette': return 'tankette';
        case 'Carro Blindado': return 'armored_car';
        case 'Semi-lagarta': return 'halftrack';
        case 'Veículo de Transporte de Infantaria': return 'halftrack'; // Often halftrack based
        case 'Tanque Leve': return 'light_tank';
        case 'Tanque Médio': return 'medium_tank';
        case 'Tanque Pesado': return 'heavy_tank';
        case 'Tanque Super Pesado': return 'super_heavy_tank';
        case 'Tanque de Múltiplas Torres': return 'heavy_tank'; // Often heavy or super heavy
        case 'Caça-Tanques': return 'tank_destroyer';
        case 'Canhão de Assalto': return 'assault_gun'; // Specific category for assault guns
        case 'Artilharia Autopropulsada': return 'spg';
        case 'Artilharia Antiaérea': return 'spaa';
        case 'AA Autopropulsada': return 'spaa';
        // 'Carro de Combate' is ambiguous, let weight decide
        // 'Veículo de Comando' and 'Veículo de Engenharia/Recuperação' are utility,
        // might map to light/medium tank or halftrack based on weight/chassis.
        // For now, let's treat them as general purpose and rely on weight.
        default:
            // Fallback to weight-based categorization if direct type is ambiguous or not specific enough
            if (totalWeight < 5000) return 'tankette';
            if (totalWeight >= 5000 && totalWeight < 15000) return 'light_tank';
            if (totalWeight >= 15000 && totalWeight < 30000) return 'medium_tank';
            if (totalWeight >= 30000 && totalWeight < 50000) return 'heavy_tank';
            if (totalWeight >= 50000) return 'super_heavy_tank';
            return 'unknown';
    }
}

// Armazena os ranges para normalização numérica (calculado uma vez na inicialização)
export let numericalAttributeRanges = {};

/**
 * Calcula os ranges (min/max) para os atributos numéricos dos tanques reais.
 * Deve ser chamado uma vez na inicialização.
 */
export function calculateNumericalRanges() {
    const numericalAttributes = [
        'min_weight_kg', 'max_weight_kg', 'main_gun_caliber_mm', 
        'armor_front_mm', 'speed_road_kmh', 'engine_power_hp'
    ];

    numericalAttributes.forEach(attr => {
        let minVal = Infinity;
        let maxVal = -Infinity;
        REAL_WORLD_TANKS.forEach(tank => { // Usa REAL_WORLD_TANKS importado
            if (tank[attr] !== undefined && tank[attr] !== null) {
                // Para peso, use a média para calcular o range geral
                const value = (attr === 'min_weight_kg' || attr === 'max_weight_kg') ? (tank.min_weight_kg + tank.max_weight_kg) / 2 : tank[attr];
                if (value < minVal) minVal = value;
                if (value > maxVal) maxVal = value;
            }
        });
        numericalAttributeRanges[attr] = { min: minVal, max: maxVal, range: maxVal - minVal };
    });
    console.log("Ranges numéricos calculados:", numericalAttributeRanges);
}

/**
 * Calcula a Distância de Gower ponderada entre dois tanques.
 * @param {object} tank1 - O primeiro tanque (geralmente o tanque do jogador).
 * @param {object} tank2 - O segundo tanque (um tanque real da base de dados).
 * @param {object} weights - Um objeto com os pesos para cada atributo.
 * @param {object} ranges - Um objeto com os ranges (min/max/range) para atributos numéricos.
 * @returns {number} A distância de Gower ponderada.
 */
export function calculateGowerDistance(tank1, tank2, weights, ranges) {
    let totalWeightedDistance = 0;
    let totalWeightSum = 0;

    // Atributos Numéricos
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
        if (Array.isArray(attrConfig.realAttr)) { // Para atributos como peso (min/max)
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
             // Fallback if range is 0 or not found (e.g., single value attribute)
             // Treat as a binary match if no range or if range is 0
             const diff = (playerVal === realVal) ? 0 : 1;
             totalWeightedDistance += diff * weight;
        } else {
            // Se um dos valores for indefinido, contribui com a distância máxima ponderada
            totalWeightedDistance += 1 * weight;
        }
    });

    // Atributos Categóricos
    const categoricalAttrs = [
        { name: 'vehicleCategory', realAttr: 'type', weightKey: 'type_weight' }, // Mapeado de vehicleTypeName
        { name: 'mobilityTypeName', realAttr: 'mobility_type', weightKey: 'mobility_type_weight' },
        { name: 'doctrineName', realAttr: 'doctrine_affinity', weightKey: 'doctrine_weight' } // doctrine_affinity é um array no realTank
    ];

    categoricalAttrs.forEach(attrConfig => {
        const playerVal = tank1[attrConfig.name];
        const realVal = tank2[attrConfig.realAttr];
        const weight = weights[attrConfig.weightKey] || 1;
        totalWeightSum += weight;

        let diff = 1; // Assume diferente
        if (attrConfig.realAttr === 'doctrine_affinity') {
            // Para doctrine_affinity, verifica se a doutrina do jogador está no array do tanque real
            if (playerVal && Array.isArray(realVal) && realVal.includes(playerVal.toLowerCase().replace(/ /g, '_'))) {
                diff = 0; // Match
            }
        } else {
            if (playerVal && realVal && playerVal.toLowerCase() === realVal.toLowerCase()) {
                diff = 0; // Match
            }
        }
        totalWeightedDistance += diff * weight;
    });

    return totalWeightSum > 0 ? totalWeightedDistance / totalWeightSum : 0;
}


/**
 * Finds the best matching real-world tank based on player's custom tank specifications
 * using Weighted Gower's Distance.
 * @param {object} playerTank - The calculated properties of the player's tank.
 * @returns {object|null} The best matching real tank object, or null if no good match is found.
 */
export function findBestMatchingTank(playerTank) {
    let bestMatch = null;
    let minGowerDistance = Infinity;

    // Definição dos pesos para cada atributo (ajuste conforme o relatório)
    const weights = {
        type_weight: 5.0, // Categórico: Tipo de veículo (muito importante)
        main_gun_caliber_weight: 4.0, // Numérico: Calibre do canhão
        armor_front_weight: 3.5, // Numérico: Blindagem frontal
        speed_road_weight: 2.5, // Numérico: Velocidade em estrada
        total_weight_weight: 2.0, // Numérico: Peso total
        engine_power_weight: 2.0, // Numérico: Potência do motor
        mobility_type_weight: 1.5, // Categórico: Tipo de locomoção
        doctrine_weight: 1.0 // Categórico: Doutrina (influencia design, mas menos direto que stats)
    };

    // Prepara os dados do tanque do jogador para comparação
    const playerTankData = {
        vehicleCategory: getVehicleCategory(playerTank.vehicleTypeName, playerTank.totalWeight), // Mapeia para categoria padronizada
        totalWeight: playerTank.totalWeight,
        mainGunCaliber: playerTank.mainArmamentCaliber,
        effectiveArmorFront: playerTank.effectiveArmorFront,
        speedRoad: playerTank.speedRoad,
        mobilityTypeName: playerTank.mobilityTypeName,
        enginePower: playerTank.totalPower,
        doctrineName: playerTank.doctrineName
    };

    for (const realTank of REAL_WORLD_TANKS) { // Usa REAL_WORLD_TANKS importado
        // Para o peso do tanque real, usamos a média do min_weight_kg e max_weight_kg
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
    console.log("Melhor correspondência encontrada:", bestMatch ? bestMatch.name : "Nenhum");
    console.log("Distância de Gower mínima:", minGowerDistance);
    return bestMatch;
}
