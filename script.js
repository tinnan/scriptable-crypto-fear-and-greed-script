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
  console.log("h: ", h, "r: ", r * 0x10000, "g: ", 0x100 + b, "b: ", b * 0x1);
	return '#' + ('000000' + h.toString(16)).slice(-6);
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
    let startColor = new Color("#000000");
    let endColor = new Color("#1c2d61");
    let gradient = new LinearGradient();
    gradient.colors = [startColor, endColor];
    gradient.locations = [0, 1];
    widget.backgroundGradient = gradient;

    // Fear and Greed Index
    const fearAndGreedColor = perc2color(parseInt(fearAndGreedData.value));
    createStyledText(widget, 'Fear and Greed Index:', 18, 'bold', 'white');
    createStyledText(widget, `${fearAndGreedData.value} ${fearAndGreedData.valueText}`, 28, 'bold', fearAndGreedColor);
    widget.addSpacer();

    Script.setWidget(widget);
    Script.complete();
    widget.presentSmall();
}

main();