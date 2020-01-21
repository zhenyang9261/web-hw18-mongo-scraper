// When Note button is clicked
$(document).on("click", "#note", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button>"
      );

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
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
