const API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false&locale=en';
const tableBody = document.getElementById('table-body');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');


const coinsPerPage = 6;
let currentPage = 1;
let allCoins = [];


document.addEventListener('DOMContentLoaded', () => {

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      allCoins = data;
      displayPage(currentPage);
      updatePaginationButtons()
    })
    .catch(error => console.error('Data not found:', error));
});

function displayPage(page) {
  const coinsStart = (page - 1) * coinsPerPage;
  const coinsEnd = coinsStart + coinsPerPage;
  const coinsToDisplay = allCoins.slice(coinsStart, coinsEnd);

  nextBtn.addEventListener('click', () => {
    page++;
    currentPage = page;
    console.log(currentPage);
    displayPage(page);
    updatePaginationButtons();
  });

  prevBtn.addEventListener('click', () => {
    page--;
    currentPage = page;
    console.log(currentPage);
    displayPage(page);
    updatePaginationButtons();
  });

  tableBody.innerHTML = '';
  const headerRow = createTableHeader();
  tableBody.appendChild(headerRow);

  coinsToDisplay.forEach(coin => {
    const row = createTableRow(coin);
    tableBody.appendChild(row);
  });
}

function updatePaginationButtons() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage * coinsPerPage >= allCoins.length;
}



function createTableHeader() {
  const headerRow = document.createElement('tr');
  const coinHeader = document.createElement('th');
  coinHeader.textContent = 'Coin';
  const priceHeader = document.createElement('th');
  priceHeader.textContent = 'Price(USD)';
  const marketCapHeader = document.createElement('th');
  marketCapHeader.textContent = 'Market Cap(USD)';
  headerRow.appendChild(coinHeader);
  headerRow.appendChild(priceHeader);
  headerRow.appendChild(marketCapHeader);
  return headerRow;
}

function createTableRow(tableRow) {
  const row = document.createElement('tr');

  const coinCell = document.createElement('td');
  coinCell.classList.add('coin-cell');
  coinCell.innerHTML = `
    <img src="${tableRow.image}" alt="${tableRow.name}">
    <div class="coin-container">
      <span class="coin-symbol">${tableRow.symbol}</span>
      <span class="coin-name">${tableRow.name}</span>
    </div>
  `;
  const priceCell = document.createElement('td');
  priceCell.classList.add('price-cell');
  priceCell.innerHTML = `
    <span>${tableRow.current_price}</span>
    <div class="price-change-H-L">
      <span class="price-change-H">H: ${tableRow.high_24h}</span>
      <span class="price-change-L">L: ${tableRow.low_24h}</span>
    </div>
  `;
  const marketCapCell = document.createElement('td');
  marketCapCell.classList.add('market-cap-cell');
  const formattedMarketCap = tableRow.market_cap.toLocaleString();
  marketCapCell.textContent = formattedMarketCap;

  row.appendChild(coinCell);
  row.appendChild(priceCell);
  row.appendChild(marketCapCell);
  return row;
}