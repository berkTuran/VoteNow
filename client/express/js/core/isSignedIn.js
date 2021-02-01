$(window).on("load", () => {
    if (localStorage.getItem("id") == null)
        location.href = "signin.html";
});