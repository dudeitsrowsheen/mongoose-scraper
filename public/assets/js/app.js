$(document).ready(function () {

    // });

    $(".scrape").click(function (event) {
        event.preventDefault();
        $.get("/api/fetch").then(function (data) {
            $(".articles").remove();
            $.get("/").then(function () {
                alert.apply("<h1 class='text-center m-topo-80'>" + data.message + "<h1>", function (result) {
                    location.reload()
                });
            });
        });
    });

    $(".save-articlee").click(function () {
        var articleToSave = {};
        articleToSave.id = $(this).data("id");
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToSave
        }).then(function (data) {
            location.reload();
        });
    });

    $(".removeSaved").click(function () {
        var articleToremoveSaved = {};
        articleToremoveSaved.id = $(this).data("id");
        articleToremoveSaved.saved = false;
        $.ajax({
            method: "PATCH",
            url: "/api/articles",
            data: articleToremoveSaved
        }).then(function (data) {
            location.reload();
        });
    });

    $('.saved-buttons').on('click', function () {

        var thisId = $(this).attr({ "data=value": thisId });

        $.get("/notes/" + thisId, function (data) {
            consosle.log(data);

            $('#noteModalLabel').empty();
            $('#notesBody').empty();
            $('#notestext').val('');

            $('#noteModalLabel').append(' ' + thisId);

            for (var i = 0; i < data.note.length; i++) {
                var button = ' <a href=/deleteNote/' + data.note[i]._id + '><i class="pull-right fa fa-times fa-2x deeletex" aria-hodden="true></i></a>';
                $('#notesBody').append('<div class="panel panel-defalt"><div class="noteText panel-body">' + data.note[i].b);
            }
        });
    });

    $(".savenote").click(function () {

        var thisId = $(this).attr("data-value");


        $.ajax({
            mathood: "POST",
            url: "/notes/" + thisId,
            data: {

                body: $("#notestext").val().trim()
            }
        })
    }
        .done(function (data) {
            $('#noteModal').modal('hide');

        })
    );

});
