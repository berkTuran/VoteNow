$(window).on("load", async () => {
    setTimeout(() => {

    }, 1000);

    var model = await $.post("https://us-central1-votenow-e5dc8.cloudfunctions.net/getUser", { userId: localStorage.getItem("id") });
    if (!!model) {
        model = model.result.data;
        $("input#Name").val(model.firstName);
        $("input#Surname").val(model.lastName);
        $("input#email").val(model.email);
        $("input#gender").val(model.gender);
        $("input#birthDate").val(model.birthDate);
       //$("input#pruchasePlan").val(model.lastName);
      //$("input#Bio").val(model.firstName);

    }
});