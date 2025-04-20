const CORS_PROXY = 'https://corsproxy.io/?url=';
const API_URLs = {
    'symbols': 'https://api.frontendexpert.io/api/fe/stock-symbols',
    'prices': 'https://api.frontendexpert.io/api/fe/stock-prices',
    'marketCaps': 'https://api.frontendexpert.io/api/fe/stock-market-caps',
}

const corsAPIs = Object.fromEntries(
    Object.entries(API_URLs).map(([key, url]) => [key, CORS_PROXY + url])
);

const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.json();
    return data;
}

async function getStockData() {
    try {
        const symbols = await fetchData(corsAPIs.symbols);
        const symbolsArray = symbols.map(sym => sym.symbol);
        const encodedSymbols = encodeURIComponent(JSON.stringify(symbolsArray));

        const [prices, marketCaps] = await Promise.all([
            fetchData(corsAPIs.prices + '?symbols=' + encodedSymbols),
            fetchData(corsAPIs.marketCaps)
        ]);

        const mappedData = symbols.map(symbol => {
            const priceData = prices.find(price => price.symbol === symbol.symbol);
            const marketData = marketCaps.find(market => market.symbol === symbol.symbol);
            return {
                '52-week-low': priceData['52-week-low'],
                '52-week-high': priceData['52-week-high'],
                'market-cap': marketData['market-cap'],
                name: symbol.name,
                price: priceData.price,
                symbol: symbol.symbol,
            };
        });


        return mappedData;
    } catch (error) {
        console.error('Error fetching stock data:', error);
        throw error;
    }
}

async function trendingStocks(n) {
    const stockData = await getStockData();
    return stockData
        .sort((a, b) => b['market-cap'] - a['market-cap'])
        .slice(0, n);
}