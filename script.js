const apiURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";

async function getEarthquakes() {

    document.querySelector("#refresh-button").disabled = true;

    try {
        const response = await fetch(apiURL);

        if (!response.ok) {
            throw new Error("Request failed");
        }
        const data = await response.json();

        console.log(data);

        const earthquakes = data.features;

        document.querySelector("#count").textContent =
            earthquakes.length;

        if (earthquakes.length === 0) {

            document.querySelector("#magnitude").textContent = "0";

            document.querySelector("#location").textContent =
                "No earthquakes reported";

            document.querySelector("#time").textContent = "";

            document.querySelector("#message").textContent =
                "No earthquakes reported in the past 24 hours.";

            document.querySelector("#magnitude-bar").style.width = "0%";

            document.body.className = "";

        } else {

            let strongest = earthquakes[0];

            for (let i = 1; i < earthquakes.length; i++) {

                if (earthquakes[i].properties.mag > strongest.properties.mag) {
                    strongest = earthquakes[i];
                }

            }

            let magnitude = strongest.properties.mag;
            let location = strongest.properties.place;
            let time = new Date(strongest.properties.time).toLocaleString();

            // Step 5: Display data on the webpage

            document.querySelector("#magnitude").textContent =
                magnitude.toFixed(1);

            document.querySelector("#location").textContent =
                location || "Location unknown";

            document.querySelector("#time").textContent =
                "Earthquake time: " + time;

            let barWidth = Math.max(0, Math.min(magnitude * 10, 100));

            document.querySelector("#magnitude-bar").style.width =
                barWidth + "%";

            if (magnitude < 3) {

                document.body.className = "";

                document.querySelector("#message").textContent =
                    "Low magnitude detected.";

            } else if (magnitude < 5) {

                document.body.className = "moderate";

                document.querySelector("#message").textContent =
                    "Moderate magnitude detected.";

            } else {

                document.body.className = "strong";

                document.querySelector("#message").textContent =
                    "High magnitude detected.";

            }

        }

        document.querySelector("#updated").textContent =
            "Last refreshed: " + new Date().toLocaleTimeString();

    } catch (error) {

        console.error("Error:", error);

        document.querySelector("#message").textContent =
            "Could not load earthquake data. Please try again.";

    }

    document.querySelector("#refresh-button").disabled = false;

}

document.querySelector("#refresh-button").addEventListener(
    "click",
    getEarthquakes
);

getEarthquakes();
