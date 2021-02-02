$(document).ready(() => {
    let candidates = [];
    let uploadFile;

    if (localStorage.getItem("id") != null) {
        $("a#signUpButton .btn__text").text("PROFILE");
        $("a#signInButton .btn__text").text("SIGN OUT");
    }
    $("#signInButton").click(async() => {
        if (localStorage.getItem("id") != null) {
            localStorage.clear();
            location.href = "/signin.html";
        }
    });

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

        if ($("#firstName").val() !== "" &&
            $("#lastName").val() !== "" &&
            $("#birthDate").val() !== "" &&
            $("input[name='frequency']:checked").val() !== undefined &&
            $("#email").val() !== "" &&
            $("#candPhoto").val() !== "" &&
            $("#candDesc").val() !== ""
        ) {
            candidates.push({
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                email: $("#email").val(),
                birthDate: $("#birthDate").val(),
                gender: $("input[name='frequency']:checked").val(),
                bio: $("#candDesc").val(),
                photo: {
                    name: uuidv4(),
                    file: uploadFile,
                    path: null,
                },
            });

            $("#firstName").val("");
            $("#lastName").val("");
            $("#birthDate").val("");
            $("input[name='frequency']:checked").prop("checked", false);
            $("#email").val("");
            $("#candPhoto").val("");
            $("#candDesc").val("");
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
        if (candidates.length > 0 && $("#elecName").val() != "" && $("#elecDesc").val() != "" && $("#start").val() != "" && $("#end").val() != "" ) {
            let model = { election: {}, userId: "" }
            model.election.electionName = $("#elecName").val();
            model.election.electionDiscription = $("#elecDesc").val();
            model.election.startDate = $("#start").val();
            model.election.endDate = $("#end").val();
            model.election.candidates = [];
            model.election.capacity = 100;
            model.userId = localStorage.getItem("id");

            for (let i of candidates) {
                model.election.candidates.push({
                    firstName: i.firstName,
                    lastName: i.lastName,
                    email: i.email,
                    birthDate: i.birthDate,
                    gender: i.gender,
                    bio: i.bio,
                    profileImageUrl: i.photo.path,
                });
            }

            try {
                let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/createElection", model);
                if (!result.error)
                    alert(result.error.message);
                else {
                    alert("Election create was successful!");
                    location.href = "/electionList.html";
                }
            } catch (error) {
                alert("Election create was successful!");
                location.href = "/electionList.html";
            }
        } else {
            alert("There is a problem with your election. Please check your information.");
        }
    });
});