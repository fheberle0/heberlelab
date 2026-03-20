---
layout: page
title: Calendar
permalink: /calendar/
nav: false
---

<div id="calendar-container"></div>

<script>
  const calId = "4h55f324htqe6di5iopa14mqdo%40group.calendar.google.com";
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/New_York";
  const src = `https://calendar.google.com/calendar/embed?src=${calId}&ctz=${encodeURIComponent(tz)}`;
  document.getElementById("calendar-container").innerHTML =
    `<iframe src="${src}" style="border:0" width="100%" height="600" frameborder="0" scrolling="no"></iframe>`;
</script>
