$(document).ready(() => {
    if (localStorage.getItem("id") == null) {
        location.href = "/signin.html";
    }
    $.get("https://us-central1-votenow-e5dc8.cloudfunctions.net/getUser").then(e => {
        let row = $("#election-list");
        for (let i of e.result) {
            
            row.append(`<div class="boxed boxed--border bg--secondary boxed--lg box-shadow mx-auto" style='overflow-wrap: break-word;'>

                <h5>${i.data.firstName}</h5>
                <h5>${i.data.lastName}</h5>
                <h5>${i.data.email}</h5>
                <h5>${i.data.password}</h5>
                <h5>${i.data.birthDate}</h5>
                <h5>${i.data.gender}</h5>
                <h5>${i.id}</h5>


        </div>`);
        }
    });
});
