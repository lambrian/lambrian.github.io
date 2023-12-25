---
layout: default
---

<div class="cover-container">

<img class="cover" src="/img/berlin/cover.jpg">
</div>
<div class="photo-essay-wrapper">
    <p class="essay-title">Berlin, Germany</p>
    <p class="essay-subtitle">November 23 &mdash; December 3, 2023</p>
    <div class="photoset">
        <img class="photo" src="/img/berlin/walk-1.jpg">
        <img class="photo" src="/img/berlin/walk-2.jpg">
        <img class="photo" src="/img/berlin/walk-3.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/walk-4.jpg">
        <img class="photo" src="/img/berlin/walk-5.jpg">
    </div>
    <div class="photoset">
        <img class="key" src="/img/berlin/hol-1.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/hol-2.jpg">
        <img class="photo" src="/img/berlin/hol-3.jpg">
        <img class="photo" src="/img/berlin/hol-4.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/jewish-1.jpg">
        <img class="photo" src="/img/berlin/jewish-2.jpg">
        <img class="photo" src="/img/berlin/jewish-3.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/syn-1.jpg">
        <img class="photo" src="/img/berlin/syn-2.jpg">
    </div>
    <div class="photoset">
        <img class="key" src="/img/berlin/ham-1.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/ham-0.jpg">
        <img class="photo" src="/img/berlin/ham-2.jpg">
        <img class="photo" src="/img/berlin/ham-3.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/ham-4.jpg">
        <img class="photo" src="/img/berlin/ham-5.jpg">
        <img class="photo" src="/img/berlin/ham-6.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/doner-1.jpg">
        <img class="photo" src="/img/berlin/doner-2.jpg">
        <img class="photo" src="/img/berlin/doner-3.jpg">
    </div>
    <div class="photoset grid-2">
        <img class="photo" src="/img/berlin/brian.jpg">
        <img class="photo" src="/img/berlin/danny.jpg">
    </div>
    <div class="photoset">
        <img class="photo" src="/img/berlin/group.jpg">
    </div>
</div>

<script>
const onresize = (event) => {
    const photosets = document.querySelectorAll(".photoset");
    for (photoset of photosets) {
        console.log(photoset.offsetWidth, photoset.children);
        const photos = [...photoset.children];
        const heights = photos.map(elem => elem.naturalHeight);
        const widths = photos.map(elem => elem.naturalWidth)
        const max_h = Math.max(...heights);
        const scales = heights.map((height) => max_h/height);
        const scaled_widths = widths.map((width, i) => width * scales[i]);
        const page_width = document.querySelector(".photo-essay-wrapper > .photoset").offsetWidth;

        const overall_scale = (page_width - ((heights.length - 1) * 12)) / (scaled_widths.reduce((sum, width) => sum + width, 0));

        const final_scaled_heights = heights.map((height, i) => Math.floor(height * scales[i] * overall_scale));
        const final_scaled_widths = widths.map((width, i) => Math.floor(width * scales[i] * overall_scale) - 1);
        console.log('w', widths, 'h', heights);
        console.log('scales', scales);
        console.log('w', final_scaled_widths, 'h', final_scaled_heights);

        for (let i = 0; i < photoset.children.length; i++) {
            photoset.children[i].style.width = `${final_scaled_widths[i]}px`;
            photoset.children[i].style.height = `${final_scaled_heights[i]}px`;
        }
    }
};
addEventListener("resize", onresize);
Promise.all(Array.from(document.images).filter(img => !img.complete).map(img => new Promise(resolve => { img.onload = img.onerror = resolve; }))).then(() => {
    console.log('images finished loading');
    onresize();
});

</script>