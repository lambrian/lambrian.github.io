---
layout: default
---
<div class="home">
  <ul class="post-list">
    {% for post in site.posts %}
      <li>
        <div class="post-link">
          <a class="post-link-title" href="{{ post.url | prepend: site.baseurl }}">
            {{ post.date | date: "%B %-d" }}
          </a>
        </div>
      </li>
    {% endfor %}
  </ul>
</div>