$(document).ready(() => {
    if (localStorage.getItem("id") == null) {
        location.href = "/signin.html";
        alert("You need to login")
        
    }
    let answers = [];
    
    var dateFormat = "mm/dd/yy",
        from = $("#startS")
            .datepicker({
                defaultDate: "+1w",
                changeMonth: true,
                numberOfMonths: 1
            })
            .on("change", function () {
                to.datepicker("option", "minDate", getDate(this));
            }),
        to = $("#endS").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
            .on("change", function () {
                from.datepicker("option", "maxDate", getDate(this));
            });

    function getDate(element) {
        var date;
        try {
            date = $.datepicker.parseDate(dateFormat, element.value);
        } catch (error) {
            date = null;
        }

        return date;
    }

    $("#btnAdd").on("click", () => {
        if ($("#answer").val() !== "" ) {
            answers.push({
                answerName: $("#answer").val(),
               
            });

            $("#answer").val(null);
        }
    });


    $("#createSurveynBtn").on("click", async () => {
        if (answers.length > 0) {
            let model = {};
            model.surveyName = $("#surveyName").val();
            model.surveyDiscription = $("#surveyDesc").val();
            model.startDate = $("#start").val();
            model.endDate = $("#end").val();
            model.answers = [];
            model.capacity = 100;
            console.log(model);

            for (let i of answers) {
                model.answers.push({
                    answerName: i.answerName,
                });
            }
            console.log(model);

            let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/createSurvey", model);
            console.log(result);
            if (!result.error)
                alert(result.error.message);
            else {
                alert("Survey create was successful!");
                location.reload();
            }
        } else {
            alert("First you need to add surveys.");
        }
    });
}

);