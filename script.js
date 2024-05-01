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

function getIndexNumberColor(value) {
    if (value >= 75) { // Greed
        return "#34D399"; // Green
    } else if (value <= 25) { // Fear
        return "#EF4444"; // Red
    } else {
        return "white"; // Neutral
    }
}

function createStyledText(widget, text, size, weight = 'regular', color = 'white') {
    let textElement = widget.addText(text);
    textElement.textColor = new Color(color);
    textElement.font = new Font(weight, size);
    return textElement;
}

async function main() {
    const fearAndGreedData = await fetchFearAndGreedIndex();

    let widget = new ListWidget();
    widget.backgroundColor = new Color("#1A1A1A");

    // Fear and Greed Index
    const fearAndGreedColor = getIndexNumberColor(parseInt(fearAndGreedData.value));
    createStyledText(widget, 'Fear and Greed Index:', 20, 'bold', '#34D399');
    createStyledText(widget, `${fearAndGreedData.value} ${fearAndGreedData.valueText}`, 32, 'bold', fearAndGreedColor);
    widget.addSpacer();

    Script.setWidget(widget);
    Script.complete();
    widget.presentSmall();
}

main();