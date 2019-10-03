var noteId = '';

    $("#scrape").on("click", function (e) {
        e.preventDefault();
        $.ajax({
            method: "GET",
           url: "/scrape"
        })
            .then(function () {
                window.location.replace("/");
            })
    });

    $("#clear").on("click", function (e) {
        e.preventDefault();
        $.ajax({
            method: "GET",
            url: "/clear"
        })
            .then(function () {
                window.location.replace("/");
            })
    });

    colorBg = item => {
        if (item.saved) {
          $(this).addClass("saved");
        } else {
          $(this).removeClass("saved")
        }
      }

    $(".save-article").on("click", function (e) {
        e.preventDefault();
        var thisId = $(this).parents(".card").data("id");
        $.ajax({
            method: "GET",
            url: "/save/" + thisId,
        })
            .then(function () {
                $("#" + thisId).children("div.card-body").addClass("saved");
                $("#" + thisId).children("div.card-body").children(".save-article").addClass("disabled");
                $("#" + thisId).children("div.card-body").children(".unsave-article").removeClass("disabled");
            })
    });

    $(".unsave-article").on("click", function (e) {
        e.preventDefault();
        var thisId = $(this).parents(".card").data("id");
        $.ajax({
            method: "GET",
            url: "/unsave/" + thisId,
        })
            .then(function () {
                $("#" + thisId).children("div.card-body").removeClass("saved");
                $("#" + thisId).children("div.card-body").children(".save-article").addClass("disabled");
                $("#" + thisId).children("div.card-body").children(".unsave-article").removeClass("disabled");
            })
    });

    $(".note-button").on("click", function (e) {
        e.preventDefault();
        noteId = $(this).parents(".card").data("id");
        console.log(noteId);
        var noteFields = $(this).parents(".card-body").children(".submitNote");

        $(this).parents(".card-body").children(".card-text").addClass("hidden");
        $(this).parents(".card-body").children(".save-article").addClass("hidden");
        $(this).parents(".card-body").children(".unsave-article").removeClass("hidden");
        $(".note-button").addClass("disabled");

        $.ajax({
            method: "GET",
            url: "/articles/" + noteId,
        })
            .then(function (data) {
                console.log(data);
                var note = data.note.note;
                var title = data.note.title;

                noteFields.children("textarea#title-input").text(title);
                noteFields.children("textarea#note-input").text(note);

            });
    });

    $(".submit-note").on("click", function (e) {
        e.preventDefault();
        var noteTitle = $(this).parents("div.submitNote").children("textarea#title-input").val();
        var noteNote = $(this).parents("div.submitNote").children("textarea#title-input").val();

        $(this).parents(".card-body").children(".card-text").addClass("hidden");
        $(this).parents(".card-body").children(".button-area").addClass("hidden");
        $(this).parents(".card-body").children(".submitNote").addClass("hidden");
        $(".note-button").removeClass("disabled");

        console.log(noteTitle);
        console.log(noteNote);
        console.log(noteId);

        $.ajax({
            mathood: "POST",
            url: "/articles/" + noteId,
            data: {
                title: noteTitle,
                note: noteNote,
                article: noteId
            }
        })
            .then(function (data) {
                console.log(data);
        });
    });
