(function() {
  "use strict";

  var loading  = $("#loading")
  var alertBox = $(".alert")

  $(document).ajaxError(function(event, jqxhr, settings, error) {
    loading.hide()

    var msg = settings.type + " " + settings.url + " Error!"

    alertBox.removeClass("hide").find("p").text(msg)
  })

  var channelsTable  = $("#channels tbody")
  var container      = $(".container")
  var renderTableRow = _.template($("#table-row-template").html())
  var renderHistory  = _.template($("#history-template").html())

  $.getJSON("/api/channels", function(channels) {
    loading.hide()

    $.each(channels, function(_, channel) {
      channelsTable.append(renderTableRow(channel))

      container.append(renderHistory(channel))
    })
  })
})()
