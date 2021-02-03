$(document).ready(() => {
    let candidates = [];
    let candidate = {};

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

    $("button#myBtn").on("click", () => {
        $("div#myModal").fadeIn();

        $("#candPhoto").on("input", (e) => {
            if (e == undefined)
                return;

            candidate.photo = {
                name: uuidv4(),
                file: e.target.files[0],
                path: null
            };
            var storageRef = firebase.storage().ref();
            var pathRef = storageRef.child("/media/candidateImages/" + candidate.photo.name + e.target.files[0].name);
            pathRef.put(e.target.files[0]).then(function() {
                pathRef.getDownloadURL().then(y => {
                    console.log(y);
                    candidate.photo.path = y;
                });
            });
        });
    });

    $("span.close").on("click", () => {
        $("div#myModal").fadeOut();
    });

    function validateEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    $("#create-candidate-button").on("click", async() => {
        if ($("#firstName").val() !== "" &&
            $("#lastName").val() !== "" &&
            $("#birthDate").val() !== "" &&
            $("input[name='frequency']:checked").val() !== undefined &&
            $("#email").val() !== "" &&
            $("#candPhoto").val() !== "" &&
            $("#candDesc").val() !== ""
        ) {
            if (!candidate.photo) {
                alert("Photo is uploading please wait and try again later.");
                return;
            }

            let mail = $("#email").val();
            if (!validateEmail(mail)) {
                alert("E-Mail format is invalid");
                return;
            }
            let mailResult = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/isEmailUsed", { email: mail });
            if (mailResult.result) {
                alert("The e-mail address is used.");
                return;
            }

            candidates.push({
                firstName: $("#firstName").val(),
                lastName: $("#lastName").val(),
                email: $("#email").val(),
                birthDate: $("#birthDate").val(),
                gender: $("input[name='frequency']:checked").val(),
                bio: $("#candDesc").val(),
                photo: candidate.photo,
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

    $("#createElectionBtn").on("click", async() => {
        if (candidates.length >= 2 && $("#elecName").val() != "" && $("#elecDesc").val() != "" && $("#start").val() != "" && $("#end").val() != "") {
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

            console.log(model);
            console.log(JSON.stringify(model));
            let result;
            await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/createElection", model)
                .then(e => {
                    result = e;
                })
                .catch(e => {
                    alert(e);
                });

            console.log(result);
            if (!!result.result) {
                alert("Election create was successful!");
                location.href = "/electionList.html";
            } else {
                alert("An error has occurred!");
            }
        } else if (candidates.length < 2) {
            alert("To create an election, at least two candidate must be defined.");
            return;
        } else {
            alert("There is a problem with your election. Please check your information.");
        }
    });
});