$(function() {
  $(document).ajaxError(function(event, jqxhr, settings, error) {
    $("#loading").hide()

    var msg = settings.type + " " + settings.url + " Error!"

    $(".alert").removeClass("hide").find("p").text(msg)
  })

  var renderTableRow = _.template($("#table-row-template").html())
  var renderHistory  = _.template($("#history-template").html())

  $.getJSON("/api/channels", function(channels) {
    $("#loading").hide()

    $.each(channels, function(_, channel) {
      $("#channels tbody").append(renderTableRow(channel))

      $(".container").append(renderHistory(channel))
    })
  })
})
