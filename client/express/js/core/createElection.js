$(document).ready(() => {
    let candidates = [];
    let uploadFile;

    var dateFormat = "mm/dd/yy",
        from = $("#start")
        .datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
        .on("change", function() {
            to.datepicker("option", "minDate", getDate(this));
        }),
        to = $("#end").datepicker({
            defaultDate: "+1w",
            changeMonth: true,
            numberOfMonths: 1
        })
        .on("change", function() {
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

    $("#candPhoto").on("change", (e) => {
        uploadFile = e.target.files[0];
        // console.log(uploadFile);
    });

    $("#create-candidate-button").on("click", () => {
        if ($("#candName").val() !== "" && $("#candPhoto").val() !== "" && $("#candDesc").val() !== "") {
            candidates.push({
                candidateName: $("#candName").val(),
                photo: {
                    name: uploadFile.name,
                    path: null,
                },
                description: $("#candDesc").val(),
            });

            $("#candName").val(null);
            $("#candPhoto").val(null);
            $("#candDesc").val(null);

            console.log(candidates[candidates.length - 1]);
        }
    });

    // $("#createCandidate").click(async() => {
    //     let model = {};
    //     model.candName = $("input#candName").val();
    //     model.candPhoto = $("input#candPhoto").val();
    //     model.candDesc = $("input#candDesc").val();


    //     if (model.candDesc === "" || model.candName === "" || model.candPhoto === "") {
    //         alert("Required value can't be left blank.");
    //     }
    //     let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/createElection", model);
    //     if (!!result.error.message) {
    //         alert(result.error.message);
    //     } else {
    //         location.href = "/index.html";
    //         alert("SUCCESS!");
    //     }

    // });


});