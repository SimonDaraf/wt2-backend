CREATE TABLE countries (
	id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE countries_data (
	id INT AUTO_INCREMENT PRIMARY KEY,
    country_id INT NOT NULL,
    year INT NOT NULL,
    population BIGINT,
    gdp FLOAT,
    biofuel_cons_per_capita FLOAT,
    coal_cons_per_capita FLOAT,
    energy_per_capita FLOAT,
    fossil_energy_per_capita FLOAT,
    gas_energy_per_capita FLOAT,
    hydro_energy_per_capita FLOAT,
    low_carbon_energy_per_capita FLOAT,
    nuclear_energy_per_capita FLOAT,
    oil_energy_per_capita FLOAT,
    other_renewables_energy_per_capita FLOAT,
    renewables_energy_per_capita FLOAT,
    solar_energy_per_capita FLOAT,
    wind_energy_per_capita FLOAT,
    FOREIGN KEY (country_id) REFERENCES countries(id)
);