---
layout: default-nowrap
---
{% assign sorted = (site.generative_art | sort: 'date') | reverse %}
{% for concept in sorted %}
 {{ concept.content | markdownify }}
{% endfor %}

