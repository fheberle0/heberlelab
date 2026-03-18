---
layout: page
title: News
permalink: /news/
description: Latest news from the Heberle Lab
nav: false
nav_order: 4
banner: banner-news.webp
---

{% assign news = site.news | sort: "date" | reverse %}
{% for item in news %}
  <div class="news-item mb-4">
    <span class="text-muted">{{ item.date | date: "%B %d, %Y" }}</span>
    <h5>{{ item.title }}</h5>
    {{ item.content }}
  </div>
  <hr>
{% endfor %}
