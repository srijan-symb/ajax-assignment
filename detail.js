async function getCountryDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const countryCode = urlParams.get('country');
    const response = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
    const country = await response.json();
    displayCountryDetails(country[0]);
}

function displayCountryDetails(country) {
    const countryDetail = document.getElementById('countryDetail');
    const neighboursContainer = document.getElementById('neighbours');

    document.getElementById('countryName').innerText = country.name.common;
    countryDetail.innerHTML = `
    <img src="${country.flags.png}" alt="${country.name.common} flag" class="detail-country-flag" />
    <div class="content">
    <p>Native Name: ${Object.values(country.name.nativeName)[0].official}</p>
    <p>Capital: ${country.capital[0]}</p>
    <p>Population: ${country.population}</p>
    <p>Region: ${country.region}</p>
    <p>Sub-region: ${country.subregion}</p>
    <p>Area: ${country.area} Km²</p>
    <p>Country Code: +${country.idd.root}${country.idd.suffixes[0]}</p>
    <p>Languages: ${Object.values(country.languages).join(' and ')}</p>
    <p>Currencies: ${Object.values(country.currencies)[0].name}</p>
    <p>Timezones: ${country.timezones[0]}</p>
    </div>
  `;

    const neighbourCodes = country.borders || [];
    neighbourCodes.forEach(async (code) => {
        const neighbourResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
        const neighbour = await neighbourResponse.json();
        neighboursContainer.innerHTML += `
      <img src="${neighbour[0].flags.png}" alt="${neighbour[0].name.common}" />
    `;
    });
}

getCountryDetails();
