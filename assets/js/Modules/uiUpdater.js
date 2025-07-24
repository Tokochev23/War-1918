// js/modules/uiUpdater.js

// Importa funções necessárias para o status e cálculos de performance
import { calculateTankPerformance } from './utils.js';

/**
 * Atualiza a interface do usuário com os resultados calculados.
 * @param {object} tankDataOutput - Objeto contendo todos os dados calculados do tanque.
 * @param {object} uiElements - Referências aos elementos da UI.
 * @param {object} gameData - Objeto gameData completo para acessar componentes.
 * @param {string} vehicleType - Tipo de veículo selecionado.
 * @param {string} engineType - Tipo de motor selecionado.
 * @param {string} mobilityType - Tipo de mobilidade selecionado.
 * @param {string} transmissionType - Tipo de transmissão selecionado.
 * @param {number} countryProductionCapacity - Capacidade de produção do país (já modificada pelo slider).
 * @param {number} countryMetalBalance - Saldo de metais do país.
 */
export function updateUI(tankDataOutput, uiElements, gameData, vehicleType, engineType, mobilityType, transmissionType, countryProductionCapacity, countryMetalBalance) {
    uiElements.displayUnitCostEl.textContent = tankDataOutput.finalUnitCost;
    uiElements.displayTotalProductionCostEl.textContent = tankDataOutput.totalProductionCost;
    uiElements.displayTotalMetalCostEl.textContent = tankDataOutput.totalMetalCost;
    uiElements.totalCostLabelEl.textContent = `Custo Total (${tankDataOutput.quantity}x):`;

    uiElements.displayTotalWeightEl.textContent = tankDataOutput.totalWeight;
    uiElements.displayTotalPowerEl.textContent = tankDataOutput.totalPower;
    uiElements.displaySpeedRoadEl.textContent = tankDataOutput.speedRoad;
    uiElements.displaySpeedOffroadEl.textContent = tankDataOutput.speedOffroad;
    uiElements.displayEffectiveArmorFrontEl.textContent = tankDataOutput.effectiveArmorFront;
    uiElements.displayEffectiveArmorSideEl.textContent = tankDataOutput.effectiveArmorSide;
    uiElements.displayMainArmamentEl.textContent = tankDataOutput.mainArmamentText;
    uiElements.displayMaxRangeEl.textContent = tankDataOutput.maxRange;
    uiElements.displayCrewComfortEl.textContent = tankDataOutput.crewComfort;
    uiElements.displayReliabilityEl.textContent = tankDataOutput.reliability;

    uiElements.displayCountryProductionCapacityEl.textContent = countryProductionCapacity.toLocaleString('pt-BR');
    
    let producibleUnits = 'N/A';
    const currentFinalUnitCost = parseFloat(tankDataOutput.finalUnitCost.replace(/\./g, '').replace(',', '.'));
    if (currentFinalUnitCost > 0) {
        producibleUnits = Math.floor(countryProductionCapacity / currentFinalUnitCost).toLocaleString('pt-BR');
    }
    uiElements.displayProducibleUnitsEl.textContent = producibleUnits;
    tankDataOutput.producibleUnits = producibleUnits;

    uiElements.displayCountryMetalBalanceEl.textContent = countryMetalBalance.toLocaleString('pt-BR');
    
    let metalBalanceStatusText = '';
    let metalBalanceStatusClass = '';
    const currentTotalMetalCost = parseFloat(tankDataOutput.totalMetalCost.replace(/\./g, '').replace(',', '.'));
    if (currentTotalMetalCost > 0) {
        if (currentTotalMetalCost > countryMetalBalance) { 
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
    uiElements.metalBalanceStatusEl.textContent = metalBalanceStatusText;
    uiElements.metalBalanceStatusEl.className = metalBalanceStatusClass;
    tankDataOutput.metalBalanceStatusText = metalBalanceStatusText;
    tankDataOutput.metalBalanceStatusClass = metalBalanceStatusClass;

    let statusMessage = "Selecione o tipo de veículo e motor para começar";
    let statusClass = "status-warning";

    const currentSpeedRoad = parseFloat(tankDataOutput.speedRoad.replace(' km/h', '').replace(/\./g, '').replace(',', '.'));
    const currentTotalPower = parseFloat(tankDataOutput.totalPower.replace(' hp', '').replace(/\./g, '').replace(',', '.'));
    const currentEffectiveArmorFront = parseFloat(tankDataOutput.effectiveArmorFront.replace(' mm', '').replace(/\./g, '').replace(',', '.'));
    const currentCrewComfort = parseFloat(tankDataOutput.crewComfort.replace('%', '').replace(',', '.'));
    const currentReliability = parseFloat(tankDataOutput.reliability.replace('%', '').replace(',', '.')) / 100;


    if (vehicleType && engineType && currentTotalPower > 0) {
        const P_TO_W_THRESHOLD_GOOD = 12; 
        const P_TO_W_THRESHOLD_OK = 8;    

        const roadPerformance = calculateTankPerformance({
            weightTonnes: parseFloat(tankDataOutput.totalWeight.replace(' kg', '').replace(/\./g, '').replace(',', '.')) / 1000,
            engine: { powerHp: currentTotalPower, maxRpm: gameData.components.engines[engineType].max_rpm || 3000 },
            transmission: { efficiency: gameData.components.transmission_types[transmissionType].efficiency || 0.85, gearRatios: gameData.components.transmission_types[transmissionType].gear_ratios || [1.0], finalDriveRatio: gameData.components.transmission_types[transmissionType].final_drive_ratio || 8.5, max_speed_road_limit: gameData.components.transmission_types[transmissionType].max_speed_road_limit || Infinity, max_speed_offroad_limit: gameData.components.transmission_types[transmissionType].max_speed_offroad_limit || Infinity },
            chassis: { driveSprocketRadiusM: gameData.components.mobility_types[mobilityType].drive_sprocket_radius_m || 0.4, frontalAreaM2: gameData.components.vehicle_types[vehicleType.split('(')[0].trim()].frontal_area_m2 || 3.0, dragCoefficient: gameData.components.vehicle_types[vehicleType.split('(')[0].trim()].drag_coefficient || 1.0 },
            environment: { rollingResistanceCoeff: gameData.components.mobility_types[mobilityType].rolling_resistance_coeff_road || 0.02, slopeDegrees: 0, airDensity: 1.225 }
        });


        if (roadPerformance.powerToWeightRatio >= P_TO_W_THRESHOLD_GOOD && currentSpeedRoad >= 40) {
            statusMessage = "💪 Blindado de alta performance!";
            statusClass = "status-ok";
        } else if (roadPerformance.powerToWeightRatio >= P_TO_W_THRESHOLD_OK && currentSpeedRoad >= 30) {
            statusMessage = "✅ Configuração bem equilibrada.";
            statusClass = "status-ok";
        } else if (currentSpeedRoad < 25 && vehicleType !== 'super_pesado' && vehicleType !== 'artilharia_simples') {
            statusMessage = "⚠️ Veículo um pouco lento, pode ter problemas de mobilidade.";
            statusClass = "status-warning";
        } else if (currentReliability < 0.6) {
            statusMessage = "🔥 Confiabilidade baixa: Propenso a avarias!";
            statusClass = "status-error";
        } else if (currentCrewComfort < 50) {
            statusMessage = "😓 Conforto da tripulação muito baixo! Afetará desempenho em combate.";
            statusClass = "status-warning";
        } else {
            statusMessage = "✅ Configuração básica ok.";
            statusClass = "status-ok";
        }
    }
    uiElements.statusEl.textContent = statusMessage;
    uiElements.statusEl.className = `status-indicator ${statusClass}`;
    tankDataOutput.statusMessage = statusMessage;
    tankDataOutput.statusClass = statusClass;
}
