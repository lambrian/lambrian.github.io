---
layout: default-nowrap
---
{% assign sorted = (site.generative_art | sort: 'date') | reverse %}
{% for concept in site.generative_art %}
 {{ concept.content | markdownify }}
{% endfor %}

