$(window).on("load", () => {
    if (localStorage.getItem("electionId") == null)
        location.href = "/finished.html";
});

$(document).on("ready", async() => {
    let candidates = [];
    setTimeout(async() => {
        let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getStats", { electionId: localStorage.getItem("electionId") });
    }, 1000);

    // let candidateResult = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getCandidate", { candidateId: });

    google.charts.load("current", {
        packages: ['corechart']
    });
    google.charts.setOnLoadCallback(drawChart);

    function drawChart() {
        var data = google.visualization.arrayToDataTable([
            ["Element", "Density", {
                role: "style"
            }],
            ["Elector 1", 8.94, "red"],
            ["Elector 2", 10.49, "blue"],
            ["Elector 3", 19.30, "yellow"],
            ["Elector 4", 21.45, "green"],
            ["Elector 5", 17.75, "purple"],
            ["Elector 6", 16.85, "orange"],
            ["Elector 7", 4.75, "pink"],
        ]);


        var view = new google.visualization.DataView(data);
        view.setColumns([0, 1, {
                calc: "stringify",
                sourceColumn: 1,
                type: "string",
                role: "annotation",
                position: "center"
            },
            2
        ]);

        var options = {
            width: 750,
            height: 400,
            bar: {
                groupWidth: "95%"
            },
            legend: {
                position: "none"
            },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
        chart.draw(view, options);
    }
});