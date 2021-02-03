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
        model.question = $("input#surveyQuestion").val();
        model.surveyName = $("input#surveyName").val();
        model.surveyDesc = $("input#surveyDesc").val();
        //  model.answer = $("input#answer").val(); -- ARRAYDE TUTULMALI AYRI FONKSİYON!!!!! + İÇİNDE EN AZ 2 SEÇENEK OLMALI ( ELECTİONDAKİ CANDİDATE GİBİ)
        model.startDate = $("input#startS").val();
        model.endDate = $("input#endS").val();

         if (model.question === "" || model.surveyName === "" || model.surveyDesc === "" || model.startDate === "" || model.endDate === "") {
            alert("Required value can't be left blank.");
        } else {
            let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/createSurvey", model);

            if (!!result.error.message) {
                alert(result.error.message);
            } else {
                alert("Register successful");
                location.href = "/signin.html";
            }


        }

});

}

);