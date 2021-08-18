const hashLocation = {
    '#live-chat': () => liveChat(),
    '#settings': () => setting(),
    '#new-document': () => newDocument(),
}

function setting() {
    $("#content").html('<h1>Coming Soon</h1>');
}

function liveChat() {
    $.post("/x/live-chat", {
        username: '{{data.curuser.username}}',
        workspacename: '{{data.workspace.name}}',
    }, (data, status) => {
        $("#content").html(data);
    })
}

function newDocument() {
    $.post("/x/new-document", {
        ObjectId: $(".brand-logo").attr("id"),
        workspacename: $(".brand-logo>a").text()
    }, function (data, status) {
        $("#content").html(data);
        M.Sidenav.getInstance(document.getElementById('slide-file')).close();
    });
}

function fileDashboard() {
    $.post("/x/file-dashboard", {
        ObjectId: $(".brand-logo").attr("id"),
        workspacename: document.querySelector(".brand-logo").innerText,
    }, function (data, status) {
        $("#content").html(data);
        M.Sidenav.getInstance(document.getElementById('slide-file')).close();
    });
}

function documentDetail(id) {
    $.post("http://localhost/x/document-details", {
        id: id,
        workspacename: $(".brand-logo>a").text(),
    }, function (data, status) {
        window.location.hash = `#file-id=${id}`;
        window.history.replaceState({ state: window.location.hash }, "", window.location.hash);
        $("#content").html(data);
    });
}