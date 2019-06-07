---
layout: post
title: What I Listened to in March
date: 2016-04-21 00:00:01 -0800
category: [Projects]
---

<img src="/img/charts/march-2016.png" />
Music in March is the second of my monthly recap infographics.

I wanted to do something that would be tracked automatically without any additional effort because that was the only way I could guarantee the data would be accurate. I chose music after deciding there were interesting possibilities for the data and verifying that methods for collecting the data automatically existed. I followed the same process as Places in February - ideation, setup, data collection and analysis, and design iteration.

### Ideation: Insights to Surface

The information I was interested in fell into two groups: my listening habits and my choice and preference in music.

#### Music Habits

1. Number of listens
2. Number of unique songs
3. Number of unique artists
4. Longest streak of continuous music
5. Longest one-song streak
6. Longest one-artist streak
7. Patterns to when I listen to music

#### Music preferences

1. Genres - concentration in a few genres, temporal clustering of genres (soft music during the work day and electronic on the weekends, maybe), flow between genres
2. Male vs. female singers
3. Solo artists vs. bands

#### Thoughts and Hypotheses

I had some suspicions about what the data would look like:

1. I put on the same playlists very often when I'm working because the familiarity does not distract me while also drowning out surrounding noise. Because of this, I expected to see a “low” number of unique songs for the month, but I didn't know what would count as low.
2. When I hear a song that I like for the first time, I put it on repeat, and it stays on repeat for a long time. So, if I heard a song I really liked during the month, I would see a drop in the number of unique songs the day of or day after hearing the song for the first time.
3. When I'm walking (which is all the time in San Francisco), I listen to music that I can sing along to. This isn't a small category, but it ruled out almost all pure instrumental music.

### Setting Up Data Collection

Since I use Spotify to listen to music, I needed access to the logs of my listens. I learned that while the Spotify API does not expose listening history, Spotify offers Last.fm integration, where all your listens are logged to your Last.fm account. Last.fm then exposes this log via their API. I didn't realize this integration needed to be enabled on all devices individually, and my usage on my personal phone was not logged on the first day of the month.

I wanted to be proactive with my data collection and avoid having to set up getting the data from Last.fm programmatically, so I set up an IFTTT recipe that copied all Last.fm logs to a Google spreadsheet. This ultimately didn't work because IFTTT removed Last.fm support on March 23, but until that point, checking in on the spreadsheet every few days was a helpful sanity check that the data was still being  collected. 

### End of the Month Data Collection

Once the month was over, my plan was:

1. Get the full listening log from Last.fm
2. For each song in the log, get detailed track information from Spotify
3. Aggregate information

To pull from the Last.fm API, I used Postman instead of setting something up programmatically. Since Postman is designed for debugging API calls, it is perfect for my one-off call.

The most frustrating part of the data collection process was making the jump from a track in the Last.fm log to getting detailed track information from Spotify. This is because the Spotify API's track information endpoint requires a unique Spotify-specific track ID, and Last.fm only logs the song's name, album name, and artist name. The solution that I came up with to bridge this gap was to use the Spotify search endpoint. The new plan was, therefore:

1. Get the full listening log from Last.fm
2. For each song in the log, search Spotify using the song title, artist, and album name to get the Spotify track ID
3. For each Spotify track ID, get detailed track information from Spotify
4. Aggregate information

Getting the track ID was non-obvious and required a few iterations to get right.

#### Iteration 1: Naive Solution

I queried for tracks with the concatenated song , artist, and album name as the search term and took the first result.

*Issue 1*: The search results were not accurate for tracks whose name matched their album name, opting to show the most popular song on that album as the first result instead of the correct result. For example, Lana Del Rey's song Honeymoon on her album Honeymoon (Query: Honeymoon+Lana+Del+Rey+Honeymoon) returned as the top result High by the Beach, the first single on that album.

*Issue 2*: The search query was sometimes too specific, causing the query to return with no results. For example, compilation albums with multiple artists did not do well with this search query.

#### Iteration 2: Smarter Search Result Selection

To fix the incorrect top result issue, I queried the top 10 results and chose the result whose name matched the song title being queried.

Issue: Names with special characters seemed to be logged to Last.fm a little differently than saved in Spotify's backend, making a perfect match sometimes impossible. To fix this, I only compared the longest starting substring of non-special characters in both the song title and the search result title.

#### Iteration 3: Search Term Restructuring

To fix the no results issue, if an initial query had no results, I retried with just the song and artist name, and then finally just then name, performing the name match each time to verify results.

Since Spotify's track information didn't provide satisfying metadata about the track's genre or artists, I would have to dive into ambiguous territory of querying external databases for that information. Instead, I narrowed the scope of my project to my personal listening habits; the data I now had available was already interesting, and I was not prepared to multiple the complexity of the project. 

### Design Iteration

Since I want to print these on the Risograph, I designed with the constraints of that medium in mind; tabloid print size (11 x 17 in) with a safe half inch margin and minimal color variety.

<img src="/img/making-march/march-music-1.png"/>
<p class="caption">First test of the “uniques” graph, this was produced with the number of unique songs in the last 50 played.</p>

<div class="img-group">
<div><img src="/img/making-march/march-music-2.png"/></div>
<div><img src="/img/making-march/march-music-3.png"/></div>
</div>
<p class="caption">Drafting the callouts for the drops in the uniques line graph</p>


<img src="/img/making-march/march-music-4.png"/>
<p class="caption">Playing around with working in concurrent events</p>


#### Total Listens chart

<img height="300px" src="/img/making-march/march-music-5.png"/>
<p class="caption">Fast and dirty in HTML with very basic styling</p>


Since I was plotting each listen by time and song length, it was beyond doing it by hand. Instead, I wrote some JS that draws the chart in HTML. I used an online tool that converts HTML to SVG, which can be imported into Illustrator.


#### Statistics

<div class="img-group">
	<div><img src="/img/making-march/march-music-6.png"/></div>
	<div><img src="/img/making-march/march-music-7.png"/></div>
	<div><img src="/img/making-march/march-music-8.png"/></div>
</div>
<p class="caption">Iterating on statistic styling</p>

### Coming Together

<img src="/img/making-march/march-music-9.png"/>
<p class="caption">First full draft</p>

In the context of the graphs, the statistics were an afterthought, and it definitely showed. I felt that there was something fundamentally not quite right about the whole layout. I decided that it was because there was no logical or visual hierarchy to the chart; the statistics on the right had little relation to the graphs on the right, but their positioning suggested something of a legend or caption to the graphs, and that was misleading, and visually, the font sizes and margins were not consistent or structured, leaving no implication of flow or hierarchy. Probably the strongest example of this is how the statistics on the side were several times larger than the the title.

<img src="/img/making-march/march-music-10.png"/>
<p class="caption">First draft of the vertical layout</p>

The vertical layout made each section more independent. I rethought the sizing and styling to reflect the hierarchy of the information that I was presenting.

### Lessons Learned

In the data collection phase, the technical limitations of Last.fm and Spotify challenged me as an engineer to get the data that I wanted. The limitations of Spotify's track information forced me to think carefully about what kind of information I wanted to show, what narrative I wanted to tell with the data I was collecting, and evaluate the costs of getting that data. In my case, I chose to cut out a whole facet of what interested me in order to present a clearer focus, reduce the complexity of the project without sacrificing completeness, and maintain the fidelity of the data.



### Tools used

- [Spotify logged to Last.fm](https://support.spotify.com/us/learn-more/faq/#!/article/scrobble-to-last-fm)
- IFTTT to log Last.fm logs to Google Sheet __(Support Removed)__
- [Illustrator + Chartwell font to create line graphs](https://www.fontfont.com/fonts/chartwell (Not free, but an amazing tool))
- [HTML to SVG converter (online tool)](http://www.hiqpdf.com/demo/ConvertHtmlToSvg.aspx)
- [Node.js and Moment.js module](http://momentjs.com/)
- [Spotify Search Endpoint](https://developer.spotify.com/web-api/search-item/)
- [Spotify Track Information API Endpoint](https://developer.spotify.com/web-api/get-track/)
- [Last.fm API](http://www.last.fm/api/show/user.getRecentTracks)
- [Postman](https://www.getpostman.com/)
