$(document).ready(() => {
    if (localStorage.getItem("id") != null) {
        location.href = "/main.html";
    }
    $("#submit-button").click(async () => {
        let model = {};
        model.email = $("input#email").val();
        model.password = $("input#password").val();
        if (model.email === "" || model.password === "") {
            alert("Required value can't be left blank.");
        }

        let result = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/signIn", model);
        console.log(result);
        if (result.error != undefined) {
            alert("HATA! Bilgilerinizi gözden geçiriniz!");
        } else {
            localStorage.setItem("id", result.result.user.uid);
            localStorage.setItem("token", result.result.user.stsTokenManager.accessToken);
            location.href = "/profile.html";
        }

    })
});