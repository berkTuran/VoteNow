$(document).ready(() => {
    let candidates = [];
    let uploadFile;

    function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

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
    });

    $("#create-candidate-button").on("click", () => {
        if ($("#candName").val() !== "" && $("#candPhoto").val() !== "" && $("#candDesc").val() !== "") {
            candidates.push({
                candidateName: $("#candName").val(),
                photo: {
                    name: uuidv4(),
                    file: uploadFile,
                    path: null,
                },
                description: $("#candDesc").val(),
            });

            $("#candName").val(null);
            $("#candPhoto").val(null);
            $("#candDesc").val(null);
        }
    });

    $("span.close").on("click", () => {
        var storageRef = firebase.storage().ref();
        if (candidates.length > 0) {
            for (let i of candidates) {
                var pathRef = storageRef.child("/media/candidateImages/" + uuidv4() + i.photo.file.name);
                pathRef.put(i.photo.file).then(function() {
                    pathRef.getDownloadURL().then(e => {
                        i.photo.path = e;
                    });
                });
            }
        }
    });

    $("#createElectionBtn").on("click", async() => {
        if (candidates.length > 0) {
            let model = {};
            model.electionName = $("#elecName").val();
            model.electionDiscription = $("#elecDesc").val();
            model.startDate = $("#start").val();
            model.endDate = $("#end").val();
            model.candidates = [];
            model.capacity = 100;
            console.log(model);

            for (let i of candidates) {
                model.candidates.push({
                    candidateName: i.candidateName,
                    bio: i.description,
                    profileImageUrl: i.photo.path,
                });
            }
            console.log(model);

            let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/createElection", model);
            console.log(result);
            if (!result.error)
                alert(result.error.message);
            else {
                alert("Election create was successful!");
                location.reload();
            }
        } else {
            alert("First you need to add candidates.");
        }
    });
});