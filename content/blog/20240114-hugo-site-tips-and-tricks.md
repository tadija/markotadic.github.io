+++
title = 'Hugo Site - Tips and Tricks'
date = 2024-01-14T21:19:18+01:00
url = '/blog/hugo-site-tips-and-tricks'
+++

## Intro

Just after making the "Initial commit" (from the [previous post](/blog/make-website-using-hugo)), we published our website online, but it's still quite empty. Obviously, it's missing some [content](https://gohugo.io/content-management/organization/). Let's create some!

Get ready, throughout this post, we're going to make a:

- [Home page](#home-page)
- [Contact page](#contact-page)
- [Site config](#site-config)
- [Main menu](#main-menu)
- [Media shortcode](#media-shortcode)
- [Custom CSS & JS](#custom-css--js)
- [Breadcrumb navigation](#breadcrumb-navigation)
- [Heading links](#heading-links)
- [Custom syntax highlighting](#custom-syntax-highlighting)
- [Copy code button](#add-a-copy-button-to-each-code-block)

## Home page

I've started with a simple [index page](https://gohugo.io/content-management/organization/#index-pages-_indexmd) in the `content` dir, like this:

```md { title="_index.md" }
+++
title = 'Marko Tadić'
description = 'Software Architect |  iOS Engineer'
+++

Hi, I've been making software since 2005.

[Let me know](/contact) if you need any help with that.
```

- [Front matter](https://gohugo.io/content-management/front-matter/) contains a title and description
- [Markdown](https://daringfireball.net/projects/markdown/syntax) content links to a `/contact` page

## Contact page

To continue, I've made a new file for the `/contact` page and used the [default theme's](https://github.com/theNewDynamic/gohugo-theme-ananke#activate-the-contact-form) [shortcode](https://gohugo.io/content-management/shortcodes/) for contact forms:

```md { title="contact.md" }
+++
title = 'Contact Me'
+++

{{</* form-contact action="https://formspree.io/your-form-id" */>}}
```

> [formspree.io](https://formspree.io) is a service where you can make a contact form like [this](/contact) and they will route your emails. Convenient!

That's already something going on now! Let's switch to the site config to add more stuff:

## Site config

Hugo supports splitting [site config](https://gohugo.io/getting-started/configuration/) into multiple files by putting them in the `config/_default` directory. Note that file names should be based on the [root configuration keys](https://gohugo.io/getting-started/configuration/#configuration-directory). I've started with these:

- Main config file with the [general settings](https://gohugo.io/getting-started/configuration/#all-configuration-settings):

```toml { title="config/_default/hugo.toml" }
title = "Marko Tadić"
baseURL = "https://markotadic.com/"
languageCode = "en-us"
theme = "ananke"

paginate = 25
pluralizeListTitles = false
```

- custom [theme params](https://github.com/theNewDynamic/gohugo-theme-ananke#social-follow--share):

```toml { title="config/_default/params.toml" }
author = "Marko Tadić"
mainSections = ['apps', 'blog', 'portfolio']

site_logo = "img/memoji.png"
images = [ "img/memoji.png" ]

background_color_class = "bg-near-black"
body_classes = "avenir bg-near-white"
post_content_classes = "avenir bg-near-white"

ananke_socials = [
    { name = "stackoverflow", url = "https://stackoverflow.com/users/2165585/tadija" },
    { name = "github", url = "https://github.com/tadija" },
    { name = "linkedin", url = "https://www.linkedin.com/in/tadija" },
]
```

> in order to add static resources (available from any page) like [`img/memoji.png`](/img/memoji.png), put them in the `static` directory

- syntax highlighting style - I went with Hugo's default at first: [chroma](https://github.com/alecthomas/chroma) - here's a preview for [all supported styles](https://xyproto.github.io/splash/docs/all.html):

```toml { title="config/_default/markup.toml" }
[highlight]
    style = 'monokai'
```

- [main menu](https://gohugo.io/content-management/menus/) items for the site sections:

```toml { title="config/_default/menu.toml" }
[[main]]
    name = "Apps"
    url = "/apps"
    weight = 10

[[main]]
    name = "Blog"
    url = "/blog"
    weight = 20

[[main]]
    name = "Portfolio"
    url = "/portfolio"
    weight = 30
```

With these additions, the site header contains a `site_logo` image, `ananke_socials` link to other profiles, plus we got a chance to set a custom font, background and foreground colors, or even syntax highlighting style. Let's now switch to the main menu:

## Main menu

It's up to you to define any `content` directory structure. I've started with these directories, each with its own [Index page](https://gohugo.io/content-management/organization/#index-pages-_indexmd): 

[apps](/apps) | [blog](/blog) | [portfolio](/portfolio)

Here's how I made those, plus a few hints:

### Apps

The page may be empty or contain only front matter, like this one:

```md { title="apps/_index.md" }
+++
title = 'Apps'
description = 'my hobby projects'
+++
```

### Blog

The front matter can also have custom theme settings, like `show_reading_time` in my Blog section. [RSS feed](https://gohugo.io/templates/rss/) is a feature that Hugo provides out of the box.

```md { title="blog/_index.md" }
+++
title = 'Blog'
description = 'thoughts unsorted'
show_reading_time = true
+++

[RSS Feed](https://markotadic.com/blog/index.xml)
```

### Portfolio

Nested content is possible too, as long as each directory has its own `_index.md` file. For example in the `portfolio` dir, I've nested [companies](/portfolio/companies), [projects](/portfolio/projects) and [skills](/portfolio/skills) directories.

```md { title="portfolio/_index.md" }
+++
title = 'Portfolio'
description = 'work in progress'
+++

## TLDR;
[My Resume](/cv) (open as [PDF](/doc/marko.tadic-cv.pdf))

## More Details
[Companies](companies) | [Projects](projects) | [Skills](skills)
```

Another content idea is to also include a [resume](/cv) in Markdown. I've exported mine to PDF (using [MacDown](https://macdown.uranusjr.com)) and made it available as a static resource.

## Media shortcode

While writing posts for my [Apps](/apps) section, I realized I'm gonna be adding some images and videos often, so I've made myself this [shortcode](https://gohugo.io/content-management/shortcodes/) with support for both images and videos:

``` { title="layouts/shortcodes/media.html" }
{{ $kind := .Get "kind" | default "image" }}
{{ $path := .Get "path" | default "../media/" }}
{{ $file := .Get "file" }}
{{ $alt := .Get "alt" | default ""}}
{{ $style := .Get "style" | default "" }}

{{ $src := printf "%s%s" $path $file }}

{{ if eq $kind "image" }}
    <a href="{{ $src }}">
        <img class="media" 
            src="{{ $src }}" alt="{{ $alt }}" 
            style="{{ $style | safeCSS }}" 
            decoding="async" loading="lazy" 
        />
    </a>
{{ else if eq $kind "video" }}
    <video class="media" controls width=100% style="{{ $style | safeCSS }}">
        <source src="{{ $src }}" type="video/mp4">
        Your browser does not support the video tag.
    </video>
{{ else }}
    Unknown media kind
{{ end }}
```

With that, by putting image or video files inside a `media` directory within any section directory, I can use them in posts like this:

- for images, just the file name is enough:
```
{{</* media file="yacht-timer-icon.png" */>}}
```

- but we can also add custom parameters, like alt or style:
```
{{</* media file="yacht-timer-icon.png" alt="App icon" style="width: 350px;" */>}}
```

- for a video, we just need to define a kind beside the file name:
```
{{</* media kind="video" file="touch-league-spark.mp4" */>}}
```

### Bonus hint: optimize resources
To optimize media resources, we may want to convert or resize our media files. Command line comes to the rescue with [ImageMagick](https://www.imagemagick.org/) for images, and [FFmpeg](https://ffmpeg.org) for videos:

- batch convert png files to jpg:
```bash
mogrify -format jpg -quality 88 *.png
```

- resize image:
```bash
convert input.jpg -resize 1600x1200 output.jpg
```

- convert / resize video:
```bash
ffmpeg -i input.m4v -s 1280x720 -vcodec h264 -acodec copy -y output.mp4
```

## Custom CSS & JS

Eventually, we're gonna need to add some custom [CSS](https://css-tricks.com) and [JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript) - start by making 2 new empty files at these paths:

- *`static/css/custom.css`*
- *`static/js/custom.js`*

Next, we'll define them in our [config](https://gohugo.io/getting-started/configuration/) params too:

```toml { title="config/_default/params.toml" }
custom_css = [ "css/custom.css" ]
custom_js = [ "js/custom.js" ]
```

Finally, we can use this [partial](https://gohugo.io/templates/partials/) to make the head additions:

```html { title="layouts/partials/head-additions.html" }
<!-- custom css -->
{{ range .Site.Params.custom_css }}
    <link rel="stylesheet" href="{{ . | absURL }}">
{{- end }}

<!-- custom js -->
{{ range .Site.Params.custom_js }}
    <script type="text/javascript" src="{{ . | absURL }}"></script>
{{- end }}
```

This code will read config params and include CSS / JS files at given paths. We're now ready to continue!

## Breadcrumb navigation

At some point, I wanted to have a [breadcrumb navigation](https://en.wikipedia.org/wiki/Breadcrumb_navigation) too. Based on [this add-on](https://hugocodex.org/add-ons/breadcrumbs/) I've made a slightly modified version:

``` { title="layouts/partials/breadcrumb.html" }
<ul class="breadcrumb">
    {{ range .Ancestors.Reverse }}
        <li><a href="{{ .RelPermalink }}">
            {{ if .IsHome }} Home {{ else }} {{ .Title }} {{ end }}
        </a></li>
    {{ end }}
    <li><a href="{{ .RelPermalink }}">{{ .Title }}</a></li>
</ul>
```

To use it, just add this [partial](https://gohugo.io/templates/partials/) somewhere, I did it in the header of:

``` { title="layouts/_default/single.html" }
{{ partial "breadcrumb.html" . }}
```

To make it look better, we should start adding custom [CSS](https://en.wikipedia.org/wiki/CSS):

```css { title="static/css/custom.css" }
ul.breadcrumb {
    list-style: none;
}

ul.breadcrumb li {
    display: inline;
    font-size: small;
}

ul.breadcrumb li:not(:last-child)::after {
    content: "/";
    margin: 0 0.4rem;
}

ul.breadcrumb li a {
    color: grey;
    text-decoration: none;
}

ul.breadcrumb li a:hover {
    color: darkslategray;
    text-decoration: underline;
}
```

That's it for the breadcrumbs! Next, let's make the headings linkable:

## Heading links

To make all headings linkable, we can use a [render hook](https://gohugo.io/templates/render-hooks/#heading-link-example) when parsing the content and intercept it for customization at the path:

``` { title="layouts/_default/_markup/render-heading.html" }
<a class="heading" href="#{{ .Anchor | safeURL }}">
    <h{{ .Level }} id="{{ .Anchor | safeURL }}">{{ .Text | safeHTML }}</h{{ .Level }}>
</a>
```

This will wrap each heading in a link element using its [Anchor](https://gohugo.io/templates/render-hooks/#context-passed-to-render-heading) property, along with some more custom CSS:

```css { title="static/css/custom.css" }
a.heading {
    color: #555;
    text-decoration: none;
}

a.heading:hover {
    color: #333;
    text-decoration: underline;
}
```

With that done, let's give some love to the code blocks:

## Custom syntax highlighting

I didn't like how [chroma](https://github.com/alecthomas/chroma) renders [Swift](https://www.swift.org) code, so I've decided to integrate [highlight.js](https://highlightjs.org) and use that instead. It worked so well, that I never went to try others, like [prism](https://prismjs.com) for example.

- in 3 lines [choose a theme](https://highlightjs.org/demo), [include the library](https://highlightjs.org/#usage) and run it:

```html { title="layouts/partials/head-additions.html" }
<!-- syntax highglighting -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github-dark-dimmed.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
```

- add a custom [render hook](https://gohugo.io/templates/render-hooks/#render-hooks-for-code-blocks) for code blocks:

``` { title="layouts/_default/_markup/render-codeblock.html" }
{{ $lang := .Attributes.lang | default .Type }}

<pre class="codeblock">
    <code class="language-{{ $lang }}">{{ .Inner }}</code>
</pre>
```

- plus a bit of custom CSS:

```css { title="static/css/custom.css" }
.codeblock pre {
    border-radius: 12px;
}

.codeblock code {
    font-family: monospace;
    max-height: 700px;
}
```

- and to make sure it looks good on mobile too, try using a [CSS media query](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries), like in this example:

```css { title="static/css/custom.css" }
@media only screen and (max-width: 640px) {
    .codeblock {
        margin-left: -1rem;
        margin-right: -1rem;
    }

    .codeblock pre {
        border-radius: 0;
    }
}
```
> Here I wanted full-width no-round-corners code blocks on mobile in portrait, so I had to compensate for the default theme's horizontal margins.

That's all it takes! Just a quick test for some basic [SwiftUI](https://developer.apple.com/xcode/swiftui/) code:

```swift
import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack {
            Image(systemName: "globe")
                .imageScale(.large)
                .foregroundStyle(.tint)
            Text("Hello, world!")
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
```

Yep, it works! Back to the topic...

## Add a copy button to each code block

Another thing I wanted to have is a copy button on all the code blocks. I liked the one from the GitHub comments section so I've decided to make a replica excluding the tooltip part.

First, here's a refined render hook for code blocks. This one uses [Ordinal](https://gohugo.io/templates/render-hooks/#render-hooks-for-code-blocks) to generate unique IDs for each code block, plus adds a title and a copy button contained in our `codeblock` div:

``` { title="layouts/_default/_markup/render-codeblock.html" }
{{ $lang := .Attributes.lang | default .Type }}
{{ $title := .Attributes.title | default "" }}
{{ $id := .Ordinal }}

<div class="codeblock">
    <p id="title-{{ $id }}" class="code-title">{{ $title | safeHTML }}</p>
    <pre>
        <code id="code-{{ $id }}" class="language-{{ $lang }}" tabindex="0">{{ .Inner }}</code>
        <button id="button-{{ $id }}" class="copy-button" onclick="copyToClipboard('{{ $id }}')"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 464H288c8.8 0 16-7.2 16-16V384h48v64c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h64v48H64c-8.8 0-16 7.2-16 16V448c0 8.8 7.2 16 16 16zM224 304H448c8.8 0 16-7.2 16-16V64c0-8.8-7.2-16-16-16H224c-8.8 0-16 7.2-16 16V288c0 8.8 7.2 16 16 16zm-64-16V64c0-35.3 28.7-64 64-64H448c35.3 0 64 28.7 64 64V288c0 35.3-28.7 64-64 64H224c-35.3 0-64-28.7-64-64z"/></svg></button>
    </pre>
</div>
```

Copy button is made out of [SVG](https://en.wikipedia.org/wiki/SVG) and it calls a `copyToClipboard` function while passing `$id` parameter. We're gonna add some [JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript#) code to get this button going:

```js { title="static/js/custom.js" }
function copyToClipboard(id) {
    let code = document.getElementById('code-' + id).innerText;
    let button = document.getElementById('button-' + id);
    let title = document.getElementById('title-' + id);

    // store initial values
    let titleText = title.innerText;
    let buttonHTML = button.innerHTML;

    button.disabled = true

    navigator.clipboard.writeText(code)
        .then(function () {
            // set success icon and title
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>'
            button.classList.add('success');
            title.innerText = 'copied!'
        })
        .catch(function (err) {
            // set error icon and title
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>'
            button.classList.add('error');
            title.innerText = 'error!'
        })
        .finally(function () {
            // revert initial values + remove classes
            setTimeout(function () {
                button.disabled = false;
                button.innerHTML = buttonHTML;
                button.classList.remove('success', 'error');
                title.innerText = titleText;
            }, 1600);
        });
}
```

This function will find code and button elements by their `id`, copy the code block content into [clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API) and temporarily change the button's icon and style, [using](https://fontawesome.com/icons/clone?f=classic&s=regular) [these](https://fontawesome.com/icons/check?f=classic&s=solid) [icons](https://fontawesome.com/icons/xmark?f=classic&s=solid).

Now, for all of this to work, we do need to add some more CSS:

```css { title="static/css/custom.css" }
.codeblock {
    display: flex;
    flex-direction: column;
}

.codeblock .code-title {
    color: #22272e;
    padding: 0 8px 0 8px;
    font-weight: bold;
    font-style: italic;
    font-size: large;
    text-align: right;
}

.codeblock .copy-button {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 40px;
    height: 40px;
    padding: 0;
    background-color: #21262d;
    border: 1px solid #444a52;
    border-radius: 8px;
    cursor: pointer;
    transition: 200ms;
}

.codeblock .copy-button svg {
    fill: #848d97;
    padding: 11px;
}

.codeblock .copy-button:hover {
    background-color: #30363d;
    border: 1px solid #8b949e;
}
.codeblock .copy-button:active {
    background-color: #282e33;
}

.codeblock .copy-button.success {
    border: 1px solid #238636;
}
.codeblock .copy-button.success svg {
    fill: #40b951;
}

.codeblock .copy-button.error {
    border: 1px solid #BF3131;
}
.codeblock .copy-button.error svg {
    fill: #C70039;
}
```

### Bonus hint: hide the copy code button while scrolling

Sometimes, our copy code button may cover the code, so we want to hide it while scrolling and show it again when the scroll ends. For this purpose, we want to run some JS code when the content loads:

```html { title="layouts/partials/head-additions.html" }
<!-- on content load -->
<script>
    document.addEventListener("DOMContentLoaded", (event) => {
        window["configureCodeBlocks"]();
    });
</script>
```

Along with the implementation of this function in our custom JS:

```js { title="static/js/custom.js" }
function configureCodeBlocks() {
    let codeBlocks = document.querySelectorAll('[id^="code-"]');
    console.log("found " + codeBlocks.length + " code blocks");

    codeBlocks.forEach((code) => {
        let buttonID = "button-" + code.id.split("-").pop();
        let button = document.getElementById(buttonID);

        let hideButton = function() { button.style.display = "none"; }
        let showButton = function() { button.style.display = "block"; }

        if ("onscrollend" in window) {
            code.onscroll = hideButton;
            code.onscrollend = showButton;
        } else {
            code.onscroll = event => {
                hideButton();
                clearTimeout(window.scrollEndTimer);
                window.scrollEndTimer = setTimeout(showButton, 1600);
            }
        }
    });
}
```

This code will find all code blocks by their IDs, and for each of those find their respective buttons and subscribe them to ["scroll"](https://developer.mozilla.org/en-US/docs/Web/API/Document/scroll_event) and ["scrollend"](https://developer.mozilla.org/en-US/docs/Web/API/Document/scrollend_event) events of the code block, to hide and show the button as needed. This solution includes a [workaround for Safari](https://developer.chrome.com/blog/scrollend-a-new-javascript-event) since it currently [lacks support](https://developer.mozilla.org/en-US/docs/Web/API/Document/scrollend_event#browser_compatibility) for the "scrollend" event.

## Conclusion

I require no more functionality here for now, but Hugo has a lot more to offer, so make sure to check out their [docs](https://gohugo.io/documentation/)!

Next, I plan to add some content for the structure I've made out of empty posts, while also writing some random posts here, without any schedule or regularity.

I hope you enjoyed the journey into the world of [Hugo](https://gohugo.io) or perhaps learned some new tricks along the way. Until next time!
