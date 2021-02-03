$(window).on("load", () => {
    if (localStorage.getItem("electionId") == null)
        location.href = "/finished.html";
});

