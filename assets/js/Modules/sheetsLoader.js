// js/modules/sheetsLoader.js

import { COUNTRY_STATS_URL, METAIS_URL, VEICULOS_URL, REAL_WORLD_TANKS, GAME_CONSTANTS } from './constants.js';
import { cleanAndParseFloat, calculateNumericalRanges } from './utils.js';
import { populateCountryDropdown } from './uiUpdater.js'; // Importa populateCountryDropdown para uso interno

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

/**
 * Carrega dados das planilhas do Google Sheets e popula o objeto gameData.countries.
 * @param {object} gameDataRef - Referência ao objeto gameData principal para modificar gameData.countries.
 * @param {function} updateCalculationsCallback - Callback para chamar updateCalculations após o carregamento.
 */
export async function loadGameDataFromSheets(gameDataRef, updateCalculationsCallback) {
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
                console.log(`Raw data for ${countryName} from General tab: Tec='${row['Tec']}', Urbanização='${row['Urbanização']}'`);
                console.log(`Parsed data for ${countryName}: tech_civil=${tempCountries[countryName].tech_civil}, urbanization=${tempCountries[countryName].urbanization}`);
            } else {
                console.warn(`Linha ignorada na aba Geral por falta de nome de país:`, row);
            }
        });

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

        metaisRaw.forEach(row => {
            const countryName = row['País'] ? row['País'].trim() : ''; 
            if (countryName && tempCountries[countryName]) { 
                tempCountries[countryName].metal_balance = cleanAndParseFloat(row['Saldo']); 
            } else if (countryName) {
                console.warn(`País "${countryName}" da aba Metais não encontrado na base de países (aba Geral) para mesclagem. Linha:`, row);
            }
        });
        
        tempCountries["Genérico / Padrão"] = tempCountries["Genérico / Padrão"] || {};
        tempCountries["Genérico / Padrão"].production_capacity = tempCountries["Genérico / Padrão"].production_capacity || 100000000;
        tempCountries["Genérico / Padrão"].metal_balance = tempCountries["Genérico / Padrão"].metal_balance || 5000000;
        tempCountries["Genérico / Padrão"].tech_level_vehicles = tempCountries["Genérico / Padrão"].tech_level_vehicles || 50;
        tempCountries["Genérico / Padrão"].tech_civil = tempCountries["Genérico / Padrão"].tech_civil || 50;
        tempCountries["Genérico / Padrão"].urbanization = tempCountries["Genérico / Padrão"].urbanization || 50;

        gameDataRef.countries = tempCountries; // Atualiza a referência passada
        console.log("Objeto gameData.countries final:", gameDataRef.countries);
        console.log("Dados do Reino Unido após carregamento:", gameDataRef.countries["Reino Unido"]);

        populateCountryDropdown(gameDataRef.countries); // Passa os países para a função de UI
        countryDropdown.disabled = false;
        updateCalculationsCallback(); // Chama os cálculos iniciais após o carregamento dos dados

    } catch (error) {
        console.error("Erro fatal ao carregar dados das planilhas:", error);
        countryDropdown.innerHTML = '<option value="error">Erro ao carregar dados</option>';
        countryDropdown.disabled = true;
        
        // Fallback para dados genéricos se o carregamento falhar
        gameDataRef.countries = { "Genérico / Padrão": { production_capacity: 100000000, metal_balance: 5000000, tech_level_vehicles: 50, tech_civil: 50, urbanization: 50 } };
        populateCountryDropdown(gameDataRef.countries);
        countryDropdown.disabled = false;
        updateCalculationsCallback();

        document.getElementById('status').textContent = `Erro ao carregar dados externos: ${error.message}. Por favor, verifique os URLs das planilhas e se estão 'Publicadas na web' como CSV.`;
        document.getElementById('status').className = "status-indicator status-error";
    }
}

// Popula o dropdown de países com base nos dados do gameData.countries
export function populateCountryDropdown(countriesData) {
    const dropdown = document.getElementById('country_doctrine');
    dropdown.innerHTML = ''; // Limpa as opções existentes
    const sortedCountries = Object.keys(countriesData).sort();
    sortedCountries.forEach(countryName => {
        const option = document.createElement('option');
        option.value = countryName;
        option.textContent = countryName;
        dropdown.appendChild(option);
    });
    if (countriesData["Genérico / Padrão"]) {
        dropdown.value = "Genérico / Padrão";
    }
}
