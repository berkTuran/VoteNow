$(document).ready(() => {
    if (localStorage.getItem("id") == null) {
        location.href = "/signin.html";


    }
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



    $("#createSurveyBtn").click(async () => {
        let model = {}; 
        model.surveyName = $("input#surveyName").val();
        model.question = $("input#surveyQuestion").val();
        model.desrciption = $("input#surveyDescription").val();
        var optionValues = [];
        $('select#answerList').each(function() {
            optionValues.push($(this).val());
        });
        model.answers = optionValues
        model.startDate = $("input#startS").val();
        model.endDate = $("input#endS").val();
        model.isOpen = true
        console.log(model)
        if (model.question === "" || model.surveyName === "" || model.desrciption === "" || model.startDate === "" || model.startDate === "" || model.answers === []) {
            alert("Required value can't be left blank.");
        } else {
            let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/createSurvey", model);

            if (!!result.error.message) {
                alert(result.error.message);
            } else {
                alert("Survey is created.");
                location.href = "/surveyList.html";
            }

        }



    })
}










);