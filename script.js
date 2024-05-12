async function fetchBitcoinPrice() {
    try {
        let request = new Request("https://api.coindesk.com/v1/bpi/currentprice/BTC.json");
        let response = await request.loadJSON();
        return {
          rate: response.bpi.USD.rate,
          updatedTimeLocal: response.time.updatedISO,
        };
    } catch (error) {
        console.error("Failed to fetch Bitcoin price:", error);
        return { rate: "Not available", updatedTime: "" };
    }
}

function reformatRate(rateString) {
    const options = {
        style: 'decimal',
        maximumFractionDigits: 0,
    };
    return Number(rateString.replaceAll(',', '')).toLocaleString(undefined, options);
}

function formatLocalDateTime(isoDateString, options) {
    const d = new Date(isoDateString);
    return d.toLocaleString('en-US', options);
}

function toLocalDateString(isoDateString) {
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    };
    return formatLocalDateTime(isoDateString, options);
}

function toLocalTimeString(isoDateString) {
    const options = {
        hourCycle: 'h24',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short',
    };
    return formatLocalDateTime(isoDateString, options);
}

async function fetchFearAndGreedIndex() {
    try {
        let request = new Request("https://api.alternative.me/fng/");
        let response = await request.loadJSON();
        return {
          value: response.data[0].value,
          valueText: response.data[0].value_classification
        };
    } catch (error) {
        console.error("Failed to fetch Fear and Greed Index:", error);
        return { value: "Not available", valueText: "" };
    }
}

function perc2color(perc) {
    var r, g, b = 0;
    const colorScaleCap = 200;
    const half = 50;
    if(perc < 50) {
        r = colorScaleCap;
        g = Math.round(colorScaleCap / half * perc);
    }
    else {
        g = colorScaleCap;
        r = Math.round((colorScaleCap / half * 100) - (colorScaleCap / half) * perc);
    }
    var h = r * 0x10000 + g * 0x100 + b * 0x1;
    return '#' + ('000000' + h.toString(16)).slice(-6);
}

function createStyledText(widget, text, size, color = '#ffffff') {
    let textElement = widget.addText(text);
    textElement.textColor = new Color(color);
    textElement.font = new Font('Sarabun', size);
    return textElement;
}

async function main() {
    const [bitcoinPriceData, fearAndGreedData] = await Promise.allSettled([fetchBitcoinPrice(), fetchFearAndGreedIndex()])
	    .then(results => results.map(r => r.value));

    let widget = new ListWidget();
    let startColor = new Color("#000000");
    let endColor = new Color("#1c2d61");
    let gradient = new LinearGradient();
    gradient.colors = [startColor, endColor];
    gradient.locations = [0, 1];
    widget.backgroundGradient = gradient;

    // Fear and Greed Index
    const fearAndGreedColor = perc2color(parseInt(fearAndGreedData.value));
    createStyledText(widget, 'FnG Index:', 14, '#ffffff');
    createStyledText(widget, `${fearAndGreedData.value} ${fearAndGreedData.valueText}`, 24, fearAndGreedColor);
    // Bitcoin Price
    createStyledText(widget, 'BTC price:', 14, '#ffffff');
    createStyledText(widget, `$ ${reformatRate(bitcoinPriceData.rate)}`, 18, '#F2A900');
    createStyledText(widget, toLocalDateString(bitcoinPriceData.updatedTimeLocal), 12, '#F2A900');
    createStyledText(widget, toLocalTimeString(bitcoinPriceData.updatedTimeLocal), 12, '#F2A900');

    Script.setWidget(widget);
    Script.complete();
    widget.presentSmall();
}

main();
