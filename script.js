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

// License: MIT - https://opensource.org/licenses/MIT
// Author: Michele Locati <michele@locati.it>
// Source: https://gist.github.com/mlocati/7210513
function perc2color(perc) {
	var r, g, b = 0;
	if(perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	}
	else {
		g = 255;
		r = Math.round(510 - 5.10 * perc);
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
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
    widget.backgroundColor = new Color("#1A1A1A");

    // Fear and Greed Index
    const fearAndGreedColor = perc2color(parseInt(fearAndGreedData.value));
    createStyledText(widget, 'Fear and Greed Index:', 20, 'bold', '#34D399');
    createStyledText(widget, `${fearAndGreedData.value} ${fearAndGreedData.valueText}`, 32, 'bold', fearAndGreedColor);
    widget.addSpacer();

    Script.setWidget(widget);
    Script.complete();
    widget.presentSmall();
}

main();