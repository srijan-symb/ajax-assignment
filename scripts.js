async function getCountries() {
    const response = await fetch('https://restcountries.com/v3.1/all');
    const countries = await response.json();
    displayCountries(countries);
}

function getCurrentTimeByUtcOffset(utcOffset) {
    try {
        const now = new Date();
        const hoursOffset = parseInt(utcOffset.split(':')[0].replace('UTC', ''));
        const minutesOffset = parseInt(utcOffset.split(':')[1]) || 0;

        now.setHours(now.getUTCHours() + hoursOffset);
        now.setMinutes(now.getUTCMinutes() + minutesOffset);

        return formatDateTime(now);
    } catch (error) {
        console.error("Error calculating time for UTC offset: ", utcOffset, error);
        return 'N/A';
    }
}

function formatDateTime(date) {
    const day = date.getDate();
    const dayWithSuffix = day + getDaySuffix(day);
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${dayWithSuffix} ${month} ${year}, ${hours}:${minutes}`;
}

function getDaySuffix(day) {
    if (day > 3 && day < 21) return 'th'; 
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function displayCountries(countries) {
    const countryList = document.getElementById('countryList');
    countryList.innerHTML = '';

    countries.forEach((country) => {
        const timezone = country.timezones[0]; 
        const currentTime = getCurrentTimeByUtcOffset(timezone);

        const countryDiv = document.createElement('div');
        countryDiv.className = 'country-card';
        countryDiv.innerHTML = `
      <img src="${country.flags.png}" alt="${country.name.common} flag" class="country-flag" />
      <div class="country-info">
        <h3>${country.name.common}</h3>
        <p>Currency: ${Object.values(country.currencies)[0]?.name || 'N/A'}</p>
        <p>Current date and time: ${currentTime}</p>
        <div class="country-actions">
          <button onclick="showMap('${country.maps.googleMaps}')">Show Map</button>
          <button onclick="showDetails('${country.cca3}')">Detail</button>
        </div>
      </div>
    `;
        countryList.appendChild(countryDiv);
    });
}

function showMap(mapUrl) {
    window.open(mapUrl, '_blank');
}

function showDetails(countryCode) {
    window.location.href = `detail.html?country=${countryCode}`;
}

function filterCountries() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const countryCards = document.querySelectorAll('.country-card');
    countryCards.forEach((card) => {
        const countryName = card.querySelector('h3').innerText.toLowerCase();
        if (countryName.includes(searchInput)) {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

getCountries();
