// assets/js/main.js

// --- Importações de Módulos ---
import { GAME_CONSTANTS, REAL_WORLD_TANKS } from './Module/constants.js';
import { DOCTRINES, COMPONENTS, CREW_ROLES } from './Module/gameDataStructures.js';
import { cleanAndParseFloat, calculateEffectiveArmor, calculateTankPerformance, getVehicleCategory, numericalAttributeRanges, calculateNumericalRanges } from './Module/utils.js';
import { loadGameDataFromSheets, populateCountryDropdown } from './Module/sheetsLoader.js';
import { updateUI } from './Module/uiUpdater.js';

// --- Objeto Global de Dados do Jogo ---
// gameData.countries será preenchido dinamicamente por sheetsLoader.js
const gameData = {
    countries: {}, 
    doctrines: DOCTRINES,
    components: COMPONENTS,
    crew_roles: CREW_ROLES,
    constants: GAME_CONSTANTS
};

// --- FUNÇÃO PRINCIPAL DE CÁLCULO E ATUALIZAÇÃO DA UI ---
function updateCalculations() {
    // --- Variáveis de Saída e Modificadores ---
    let baseUnitCost = 0;
    let baseMetalCost = 0;
    let totalWeight = 0;
    let totalPower = 0;
    let effectiveArmorFront = 0;
    let effectiveArmorSide = 0;
    let totalReliability = gameData.constants.base_reliability; // Começa em 1.0 (100%)
    let crewComfort = gameData.constants.crew_comfort_base; // Começa em 100
    let maxRangeModifier = 1;

    // Multiplicadores (inicializados em 1)
    let speedRoadMultiplier = 1;
    let speedOffroadMultiplier = 1;
    let armorEffectiveMultiplier = 1;
    let maneuverabilityMultiplier = 1;
    let fuelConsumptionMultiplier = 1;
    let overallReliabilityMultiplier = 1;
    let internalSpaceMultiplier = 1;
    let gunDepressionModifier = 0;
    let silhouetteModifier = 0;

    // Variáveis de Doutrina e Slider de Qualidade/Produção
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
    let doctrineProductionQualitySliderBias = 0; // Deslocamento do slider pela doutrina

    // --- Entradas do Usuário (coletadas uma vez) ---
    const vehicleName = document.getElementById('vehicle_name').value || 'Blindado Sem Nome';
    const quantity = parseInt(document.getElementById('quantity').value) || 1;
    let numCrewmen = parseInt(document.getElementById('num_crewmen').value) || 0;
    const selectedCountryName = document.getElementById('country_doctrine').value;
    const selectedTankDoctrine = document.getElementById('tank_doctrine').value;
    const vehicleType = document.getElementById('vehicle_type').value;
    const mobilityType = document.getElementById('mobility_type').value.split('(')[0].trim();
    const suspensionType = document.getElementById('suspension_type').value.split('(')[0].trim();
    const engineType = document.getElementById('engine_type').value.split('(')[0].trim();
    const enginePower = parseInt(document.getElementById('engine_power').value) || 0;
    const fuelType = document.getElementById('fuel_type').value;
    const engineDisposition = document.getElementById('engine_disposition').value;
    const transmissionType = document.getElementById('transmission_type').value.split('(')[0].trim();
    const armorProductionType = document.getElementById('armor_production_type').value;
    const armorFront = parseInt(document.getElementById('armor_front').value) || 0;
    const armorFrontAngle = parseInt(document.getElementById('armor_front_angle').value) || 0;
    const armorSide = parseInt(document.getElementById('armor_side').value) || 0;
    const armorTurret = parseInt(document.getElementById('armor_turret').value) || 0;
    let mainArmamentCaliber = parseInt(document.getElementById('main_gun_caliber').value) || 0;
    const mainGunLength = document.getElementById('main_gun_length').value;
    const reloadMechanism = document.getElementById('reload_mechanism').value;
    const totalAmmoCapacityInput = document.getElementById('total_ammo_capacity');
    const productionQualitySliderValue = parseInt(document.getElementById('production_quality_slider').value) || 50;

    // --- Referências a Elementos UI (coletadas uma vez) ---
    const uiElements = {
        countryBonusNoteEl: document.getElementById('country_bonus_note'),
        doctrineNoteEl: document.getElementById('doctrine_note'),
        suspensionNoteEl: document.getElementById('suspension_note'),
        engineNoteEl: document.getElementById('engine_power_note'),
        fuelNoteEl: document.getElementById('fuel_note'),
        armorProductionNoteEl: document.getElementById('armor_production_note'),
        mainGunLengthNoteEl: document.getElementById('main_gun_length_note'),
        reloadMechanismNoteEl: document.getElementById('reload_mechanism_note'),
        totalAmmoCapacityNoteEl: document.getElementById('total_ammo_capacity_note'),
        ammoQtyNoteEl: document.getElementById('ammo_qty_note'),
        crewNoteEl: document.getElementById('crew_note'),
        metalBalanceStatusEl: document.getElementById('metal_balance_status'),
        statusEl: document.getElementById('status'),
        productionQualityNoteEl: document.getElementById('production_quality_note'),
        displayTypeEl: document.getElementById('display_type'),
        displayDoctrineEl: document.getElementById('display_doctrine'),
        numCrewmenInput: document.getElementById('num_crewmen'),
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
        totalCostLabelEl: document.getElementById('total_cost_label')
    };

    // --- Dados do Tanque para Retorno ---
    let tankDataOutput = {};

    // --- Sub-funções de Processamento (declaradas aqui para acessar o escopo de updateCalculations) ---

    function processBasicInfoAndDoctrine() {
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

            // Novos modificadores de doutrina
            armorCostWeightReduction = doctrineData.armor_cost_weight_reduction_percent || 0;
            durabilityBonus = doctrineData.durability_bonus || 0;
            engineCostWeightReduction = doctrineData.engine_cost_weight_reduction_percent || 0;
            armorCostWeightIncrease = doctrineData.armor_cost_weight_increase_percent || 0;
            maxMainGunCaliberLimit = doctrineData.max_main_gun_caliber_limit || Infinity;
            secondaryArmamentLimitPenalty = doctrineData.secondary_armament_limit_penalty || 0;
            advancedComponentCostIncrease = doctrineData.advanced_component_cost_increase || 0;
            complexComponentReliabilityPenalty = doctrineData.complex_component_reliability_penalty || 0;
            doctrineProductionQualitySliderBias = doctrineData.production_quality_slider_bias || 0;
            
            crewComfort *= (1 - (doctrineData.base_comfort_penalty || 0)); // Penalidade base de conforto
            
            if (selectedTankDoctrine === 'blitzkrieg') {
                if (document.getElementById('radio_equipment').checked) {
                    overallReliabilityMultiplier += (doctrineData.optics_radio_bonus_multiplier || 0);
                    crewComfort += (doctrineData.optics_radio_bonus_multiplier || 0) * gameData.constants.crew_comfort_base;
                }
                if (document.getElementById('improved_optics').checked) {
                    overallReliabilityMultiplier += (doctrineData.optics_radio_bonus_multiplier || 0);
                    crewComfort += (doctrineData.optics_radio_bonus_multiplier || 0) * gameData.constants.crew_comfort_base;
                }
            }
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

    function processChassisAndMobility() {
        let currentMaxCrew = 0;
        let typeData = null;
        let vehicleTypeName = '-';

        if (vehicleType && gameData.components.vehicle_types[vehicleType.split('(')[0].trim()]) {
            typeData = gameData.components.vehicle_types[vehicleType.split('(')[0].trim()];
            baseUnitCost += typeData.cost;
            baseMetalCost += typeData.metal_cost || 0;
            totalWeight += typeData.weight;
            currentMaxCrew = typeData.max_crew; 
            vehicleTypeName = typeData.name;
            uiElements.displayTypeEl.textContent = typeData.name;
            uiElements.displayDoctrineEl.textContent = doctrineName;
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

            if (suspensionType === 'torsion_bar' && suspensionData.requires_stabilizer_cost) {
                baseUnitCost += suspensionData.requires_stabilizer_cost;
                totalWeight += suspensionData.requires_stabilizer_weight;
            }
        } else {
            uiElements.suspensionNoteEl.textContent = '';
        }

        tankDataOutput.vehicleTypeName = vehicleTypeName;
        tankDataOutput.mobilityTypeName = mobilityTypeName;
        tankDataOutput.suspensionTypeName = suspensionTypeName;
        tankDataOutput.suspensionDescription = suspensionDescription;

        return { typeData, mobilityData, suspensionData }; // Retorna dados para uso posterior
    }

    function processEngineAndPropulsion(currentEngineData) {
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

                // Aplica modificador de doutrina para custo/peso do motor
                engineComponentCost *= (1 - engineCostWeightReduction);
                engineMetalComponentCost *= (1 - engineCostWeightReduction);

                // Aplica aumento de custo para componentes avançados (Blitzkrieg)
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
            if (currentEngineData.data) { // Ensure engineData is valid
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

            // Aplica aumento de custo para componentes avançados (Blitzkrieg)
            if (transmissionData.complex && advancedComponentCostIncrease > 0) {
                transmissionComponentCost *= (1 + advancedComponentCostIncrease);
                transmissionMetalComponentCost *= (1 + advancedComponentCostIncrease);
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

        return { currentEngineData: currentEngineData.data, transmissionData }; // Retorna dados para uso posterior
    }

    function processArmor() {
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
            // Aplica aumento de custo para componentes avançados (Blitzkrieg)
            if (armorProductionData.complex && advancedComponentCostIncrease > 0) {
                currentArmorCost *= (1 + advancedComponentCostIncrease);
                currentMetalArmorCost *= (1 + advancedComponentCostIncrease);
            }
            // Aplica penalidade de confiabilidade para componentes complexos (Deep Battle)
            if (armorProductionData.complex && complexComponentReliabilityPenalty > 0) {
                overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
            }
        }

        // Aplica modificador de doutrina para custo/peso da blindagem (redução ou aumento)
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

        document.querySelectorAll('.form-section:nth-of-type(4) .item-row input[type="checkbox"]:checked').forEach(checkbox => {
            const armorId = checkbox.id;
            const armorData = gameData.components.armor_materials_and_additions[armorId]; 
            if (armorData) {
                let additionalArmorCost = armorData.cost;
                let additionalArmorMetalCost = armorData.metal_cost || 0;

                // Aplica aumento de custo para componentes avançados (Blitzkrieg)
                if (armorData.complex && advancedComponentCostIncrease > 0) {
                    additionalArmorCost *= (1 + advancedComponentCostIncrease);
                    additionalArmorMetalCost *= (1 + additionalArmorMetalCost);
                }
                // Aplica penalidade de confiabilidade para componentes complexos (Deep Battle)
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

    function processArmaments() {
        let mainArmamentText = 'N/A';
        let mainGunLengthDescription = '';

        // Limita o calibre máximo do canhão principal pela doutrina
        if (mainArmamentCaliber > maxMainGunCaliberLimit) {
            mainArmamentCaliber = maxMainGunCaliberLimit;
            document.getElementById('main_gun_caliber').value = mainArmamentCaliber;
        }

        const gunLengthData = gameData.components.gun_lengths[mainGunLength]; 
        let mainGunCost = 0;
        let mainGunWeight = 0;

        if (mainArmamentCaliber > 0) {
            mainGunCost = mainArmamentCaliber * 1000;
            mainGunWeight = mainArmamentCaliber * 15;

            if (gunLengthData) {
                mainGunCost *= gunLengthData.cost_mod;
                mainGunWeight *= gunLengthData.weight_mod;
                uiElements.mainGunLengthNoteEl.textContent = gunLengthData.description;
                mainGunLengthDescription = gunLengthData.name;
                maneuverabilityMultiplier *= gunLengthData.turret_maneuver_mod;
                // Aplica aumento de custo para componentes avançados (Blitzkrieg)
                if (gunLengthData.complex && advancedComponentCostIncrease > 0) {
                    mainGunCost *= (1 + advancedComponentCostIncrease);
                }
                // Aplica penalidade de confiabilidade para componentes complexos (Deep Battle)
                if (gunLengthData.complex && complexComponentReliabilityPenalty > 0) {
                    overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
                }
            }
            mainArmamentText = `${mainArmamentCaliber}mm ${gunLengthData ? gunLengthData.name : ''} Canhão`;
        } else {
            uiElements.mainGunLengthNoteEl.textContent = 'Insira um calibre de canhão principal válido.';
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

            // Aplica aumento de custo para componentes avançados (Blitzkrieg)
            if (reloadMechanismData.complex && advancedComponentCostIncrease > 0) {
                reloadMechanismComponentCost *= (1 + advancedComponentCostIncrease);
                reloadMechanismMetalCost *= (1 + reloadMechanismMetalCost);
            }
            // Aplica penalidade de confiabilidade para componentes complexos (Deep Battle)
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
            maxAmmoForCaliber = Math.max(15, Math.round(5000 / mainArmamentCaliber - 10)); 
        }
        totalAmmoCapacityInput.max = maxAmmoForCaliber;
        let totalAmmoCapacity = parseInt(totalAmmoCapacityInput.value) || 0;
        totalAmmoCapacity = Math.min(totalAmmoCapacity, maxAmmoForCaliber); 
        totalAmmoCapacityInput.value = totalAmmoCapacity; 

        if (mainArmamentCaliber > 0) {
            uiElements.totalAmmoCapacityNoteEl.textContent = `Capacidade máxima para ${mainArmamentCaliber}mm: ${maxAmmoForCaliber} projéteis.`;
        } else {
            uiElements.totalAmmoCapacityNoteEl.textContent = 'Selecione um calibre de canhão principal para definir a capacidade máxima de munição.';
        }

        let currentTotalAmmoQty = 0;
        const ammoQuantities = {};
        ['ap', 'aphe', 'he', 'apcr'].forEach(ammoType => {
            const checkbox = document.getElementById(`ammo_${ammoType}_checkbox`);
            const qtyInput = document.getElementById(`ammo_${ammoType}_qty`);
            let qty = parseInt(qtyInput ? qtyInput.value : 0) || 0;

            if (checkbox.checked) {
                ammoQuantities[ammoType] = qty;
                currentTotalAmmoQty += qty;
            } else {
                qtyInput.value = 0;
                ammoQuantities[ammoType] = 0;
            }
        });

        if (currentTotalAmmoQty > totalAmmoCapacity) {
            uiElements.ammoQtyNoteEl.textContent = `⚠️ A quantidade total de munição (${currentTotalAmmoQty}) excede a capacidade máxima (${totalAmmoCapacity})! Por favor, reduza a quantidade de algum tipo de munição.`;
            uiElements.ammoQtyNoteEl.className = 'text-sm status-warning';
        } else if (mainArmamentCaliber > 0 && totalAmmoCapacity > 0) {
            uiElements.ammoQtyNoteEl.textContent = `Munição alocada: ${currentTotalAmmoQty}/${totalAmmoCapacity} projéteis.`;
            uiElements.ammoQtyNoteEl.className = 'text-sm status-ok';
        } else {
            uiElements.ammoQtyNoteEl.textContent = '';
            uiElements.ammoQtyNoteEl.className = '';
        }

        const selectedAmmoTypes = [];
        ['ap', 'aphe', 'he', 'apcr'].forEach(ammoType => {
            const qty = ammoQuantities[ammoType];
            if (qty > 0) {
                const ammoData = gameData.components.ammo_types[ammoType];
                baseUnitCost += ammoData.cost_per_round * qty;
                baseMetalCost += (ammoData.weight_per_round * 0.1) * qty;
                totalWeight += ammoData.weight_per_round * qty;
                selectedAmmoTypes.push(`${ammoData.name} (${qty})`);
            }
        });

        const selectedSecondaryArmaments = [];
        let secondaryArmamentCount = 0; // Contador para aplicar penalidade de doutrina
        document.querySelectorAll('.form-section:nth-of-type(5) .item-row input[type="checkbox"]').forEach(checkbox => {
            const armamentId = checkbox.id.replace('_checkbox', ''); 
            const qtyInput = document.getElementById(armamentId + '_qty');
            const qty = checkbox.checked ? (parseInt(qtyInput ? qtyInput.value : 1) || 0) : 0;

            if (qty > 0 && gameData.components.armaments[armamentId]) { 
                const armamentData = gameData.components.armaments[armamentId];
                let armamentComponentCost = armamentData.cost * qty;
                let armamentMetalCost = (armamentData.metal_cost || 0) * qty;

                // Aplica aumento de custo para componentes avançados (Blitzkrieg)
                if (armamentData.complex && advancedComponentCostIncrease > 0) {
                    armamentComponentCost *= (1 + advancedComponentCostIncrease);
                    armamentMetalCost *= (1 + armamentMetalCost);
                }
                // Aplica penalidade de confiabilidade para componentes complexos (Deep Battle)
                if (armamentData.complex && complexComponentReliabilityPenalty > 0) {
                    overallReliabilityMultiplier *= (1 - complexComponentReliabilityPenalty);
                }

                baseUnitCost += armamentComponentCost;
                baseMetalCost += armamentMetalCost;
                totalWeight += armamentData.weight * qty;
                selectedSecondaryArmaments.push(`${armamentData.name} (${qty}x)`);
                secondaryArmamentCount += qty;

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

        // Aplica penalidade de doutrina para armamentos secundários
        if (secondaryArmamentLimitPenalty > 0 && secondaryArmamentCount > 0) {
            overallReliabilityMultiplier *= (1 - (secondaryArmamentLimitPenalty * secondaryArmamentCount * 0.05)); // Ex: 5% de penalidade por cada armamento extra
        }


        tankDataOutput.mainArmamentCaliber = mainArmamentCaliber;
        tankDataOutput.mainArmamentText = mainArmamentText;
        tankDataOutput.mainGunLengthDescription = mainGunLengthDescription;
        tankDataOutput.reloadMechanismName = reloadMechanismName;
        tankDataOutput.reloadMechanismDescription = reloadMechanismDescription;
        tankDataOutput.totalAmmoCapacity = totalAmmoCapacity;
        tankDataOutput.currentTotalAmmoQty = currentTotalAmmoQty;
        tankDataOutput.selectedAmmoTypes = selectedAmmoTypes;
        tankDataOutput.selectedSecondaryArmaments = selectedSecondaryArmaments;
    }

    function processExtraEquipment() {
        const selectedExtraEquipment = [];
        document.querySelectorAll('.form-section:nth-of-type(6) .item-row input[type="checkbox"]:checked').forEach(checkbox => {
            const equipmentId = checkbox.id;
            if (gameData.components.equipment[equipmentId]) { 
                const equipmentData = gameData.components.equipment[equipmentId];
                let equipmentComponentCost = equipmentData.cost;
                let equipmentMetalCost = equipmentData.metal_cost || 0;

                // Aplica aumento de custo para componentes avançados (Blitzkrieg)
                if (equipmentData.complex && advancedComponentCostIncrease > 0) {
                    equipmentComponentCost *= (1 + advancedComponentCostIncrease);
                    equipmentMetalCost *= (1 + equipmentMetalCost);
                }
                // Aplica penalidade de confiabilidade para componentes complexos (Deep Battle)
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
                
                if (equipmentId === 'improved_optics' && gameData.doctrines[selectedTankDoctrine] && gameData.doctrines[selectedTankDoctrine].optics_radio_bonus_multiplier) {
                    overallReliabilityMultiplier += gameData.doctrines[selectedTankDoctrine].optics_radio_bonus_multiplier;
                    crewComfort += gameData.doctrines[selectedTankDoctrine].optics_radio_bonus_multiplier * gameData.constants.crew_comfort_base;
                }
                if (equipmentId === 'radio_equipment' && gameData.doctrines[selectedTankDoctrine] && gameData.doctrines[selectedTankDoctrine].optics_radio_bonus_multiplier) {
                    overallReliabilityMultiplier += gameData.doctrines[selectedTankDoctrine].optics_radio_bonus_multiplier;
                    crewComfort += gameData.doctrines[selectedTankDoctrine].optics_radio_bonus_multiplier * gameData.constants.crew_comfort_base;
                }

                if (equipmentData.reliability_mod) overallReliabilityMultiplier *= (1 + equipmentData.reliability_mod);
                if (equipmentData.cost_mod) baseUnitCost *= equipmentData.cost_mod;
                if (equipmentData.weight_mod) totalWeight *= equipmentData.weight_mod;
                if (equipmentData.speed_mod) { speedRoadMultiplier *= equipmentData.speed_mod; speedOffroadMultiplier *= equipmentData.speed_mod; }
                if (equipmentData.maneuver_mod) maneuverabilityMultiplier *= equipmentData.maneuver_mod;
            }
        });
        tankDataOutput.selectedExtraEquipment = selectedExtraEquipment;
    }

    function processCrew() {
        crewComfort -= numCrewmen * gameData.constants.crew_comfort_penalty_per_crewman;
        let crewNoteText = '';
        if (numCrewmen < 3 && vehicleType !== 'tankette' && vehicleType !== 'armored_car') {
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

    function applyProductionQualitySlider() {
        let sliderNormalizedValue = ((productionQualitySliderValue - 50) / 100) + doctrineProductionQualitySliderBias;
        sliderNormalizedValue = Math.max(-0.5, Math.min(0.5, sliderNormalizedValue));

        overallReliabilityMultiplier *= (1 - (sliderNormalizedValue * 0.2));

        countryProductionCapacity *= (1 + (sliderNormalizedValue * 0.5));

        if (sliderNormalizedValue > 0.1) {
            uiElements.productionQualityNoteEl.textContent = `Priorizando Produção: Maior capacidade, menor confiabilidade.`;
            uiElements.productionQualityNoteEl.style.color = '#dc3545';
        } else if (sliderNormalizedValue < -0.1) {
            uiElements.productionQualityNoteEl.textContent = `Priorizando Qualidade: Maior confiabilidade, menor capacidade.`;
            uiElements.productionQualityNoteEl.style.color = '#28a745';
        } else {
            uiElements.productionQualityNoteEl.textContent = `Equilíbrio entre confiabilidade e capacidade de produção.`;
            uiElements.productionQualityNoteEl.style.color = '#6c757d';
        }
    }

    function calculateFinalPerformance(typeData, mobilityData, currentEngineData, transmissionData) {
        let finalUnitCost = baseUnitCost * doctrineCostModifier * (1 - countryCostReductionFactor);

        const doctrineData = gameData.doctrines[selectedTankDoctrine];
        if (doctrineData && doctrineData.extreme_design_cost_increase) {
            if (typeData && typeData.name === 'Tanque Super Pesado' || mainArmamentCaliber > 100) {
                finalUnitCost *= (1 + doctrineData.extreme_design_cost_increase);
            }
        }

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
                efficiency: transmissionDataForCalc.efficiency || 0.85, 
                gearRatios: transmissionDataForCalc.gear_ratios || [1.0], 
                finalDriveRatio: transmissionDataForCalc.final_drive_ratio || 8.5, 
                max_speed_road_limit: transmissionDataForCalc.max_speed_road_limit || Infinity,
                max_speed_offroad_limit: transmissionDataForCalc.max_speed_offroad_limit || Infinity
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

        const roadPerformance = calculateTankPerformance(tankStats);
        let finalSpeedRoad = roadPerformance.topSpeedKmh;

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

        let finalReliability = Math.max(0.05, Math.min(1, totalReliability * overallReliabilityMultiplier)); 

        let totalFuelCapacity = gameData.constants.base_fuel_capacity_liters;
        if (document.getElementById('extra_fuel').checked) {
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
        tankDataOutput.producibleUnits = 'N/A'; // Será calculado no updateUI
        tankDataOutput.countryProductionCapacity = countryProductionCapacity.toLocaleString('pt-BR');
        tankDataOutput.countryMetalBalance = countryMetalBalance.toLocaleString('pt-BR');
    }


    // --- Fluxo Principal de Cálculos ---
    processBasicInfoAndDoctrine();
    const { typeData, mobilityData } = processChassisAndMobility();
    const { currentEngineData, transmissionData } = processEngineAndPropulsion({}); // Passa um objeto vazio para ser preenchido
    processArmor();
    processArmaments();
    processExtraEquipment();
    processCrew();
    applyProductionQualitySlider(); // Aplica o slider APÓS todos os outros cálculos de confiabilidade e capacidade
    calculateFinalPerformance(typeData, mobilityData, currentEngineData, transmissionData);
    updateUI(tankDataOutput, uiElements, gameData, vehicleType, engineType, mobilityType, transmissionType, countryProductionCapacity, countryMetalBalance);

    return tankDataOutput;
}

// --- INICIALIZAÇÃO ---
window.onload = function() {
    // Calcula os ranges numéricos uma vez na inicialização
    calculateNumericalRanges(); // Agora usa REAL_WORLD_TANKS de constants.js

    // Carrega os dados das planilhas primeiro, passando gameData e o callback
    loadGameDataFromSheets(gameData, updateCalculations);

    // Adiciona o updateCalculations ao escopo global para que os eventos oninput/onchange no HTML possam chamá-lo
    window.updateCalculations = updateCalculations;

    // Adiciona um listener para o painel de resumo para gerar a ficha
    const summaryPanel = document.querySelector('.summary-panel');
    if (summaryPanel) {
        summaryPanel.style.cursor = 'pointer'; // Indica que é clicável
        summaryPanel.title = 'Clique para gerar a ficha detalhada do blindado'; // Tooltip
        summaryPanel.addEventListener('click', () => {
            const tankData = updateCalculations(); 
            // Salva os dados do tanque do jogador E a lista de tanques reais no localStorage
            localStorage.setItem('tankSheetData', JSON.stringify(tankData));
            localStorage.setItem('realWorldTanksData', JSON.stringify(REAL_WORLD_TANKS)); // Passa a lista de tanques reais
            window.open('ficha.html', '_blank'); // Abre a nova página em uma nova aba
        });
    }
};
