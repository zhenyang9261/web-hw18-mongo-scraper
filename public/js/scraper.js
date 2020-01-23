// When Note button is clicked
$(document).on("click", "#note", function() {
  // Save the id
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the article note
  $.ajax({
    method: "GET",
    url: "/api/note/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      $("#note-label").text(`Note for article ${data._id}`);

      $(".modal-notes").empty();
      $(".modal-input").val("");

      // If there's a note in the article
      if (data.note) {
        for (let i = 0; i < data.note.length; i++) {
          let noteDiv = $("<div>");
          let note = $("<span>");
          note.text(data.note[i].body);
          let closeButton = $("<button>");
          closeButton.text("x");
          closeButton.attr("class", "remove");
          closeButton.attr("id", "remove-note");
          closeButton.attr("data-id", data.note[i]._id);
          noteDiv.append(note);
          noteDiv.append(closeButton);
          $(".modal-notes").append(noteDiv);
        }
      }

      // let textarea = $("<textarea>");
      // textarea.attr("class", "form-control");
      // textarea.attr("id", "new-note");
      // textarea.attr("rows", 3);
      // textarea.attr("data-id", data._id);
      // $(".modal-input").append(textarea);

      // let saveButton = $("<button>");
      // saveButton.text("Save Note");
      // saveButton.attr("class", "btn btn-primary");
      // saveButton.attr("id", "save-note");
      // saveButton.attr("data-id", data._id);
      // $(".modal-footer").append(saveButton);
      $("#save-note").attr("data-id", data._id);

      $("#note-modal").modal("show");
    });
});

// When Save Note button is clicked
$(document).on("click", "#save-note", function() {
  // Save the id
  let thisId = $(this).attr("data-id");
  console.log("save note id: " + thisId);

  let body = $("#new-note").val();
  if (body) {
    body = body.trim();
  }
  console.log("note body: " + body);

  //Now make an ajax call for the article note
  $.ajax({
    method: "POST",
    url: "/api/note/" + thisId,
    data: { body: body }
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log("create new note callback obj " + data);
      $("#note-modal").modal("hide");
    });
});

// When Delete Article button is clicked
$(document).on("click", "#delete-article", function() {
  // Save the id
  let thisId = $(this).attr("data-id");
  $.ajax("/api/article/" + thisId, {
    type: "DELETE"
  }).then(function() {
    // Reload the page to get the updated list
    console.log("reload");
    location.reload();
  });
});

// When Save Article button is clicked
$(document).on("click", "#save-article", function() {
  // Save the id
  let thisId = $(this).attr("data-id");
  let title = $(`#article-title-${thisId}`).text();
  let body = $(`#article-body-${thisId}`).text();
  let link = $(`#article-link-${thisId}`).attr("href");

  // Compose the object to send with POST request
  let article = {
    title: title,
    body: body,
    link: link
  };

  // Ajex call to save the article
  $.ajax({
    method: "POST",
    url: "api/article/",
    data: article
  }).then(function() {});
});
