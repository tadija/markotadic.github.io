+++
title = 'Make Website Using Hugo'
date = 2024-01-05T21:31:09+01:00
url = '/blog/make-website-using-hugo'
+++

## Intro

This site is made using [Hugo](https://gohugo.io) and it's deployed on [GitHub Pages](https://pages.github.com), automatically from [this repository](https://github.com/tadija/tadija.github.io). Anyone can do it!

In this post, we're gonna:
- [Start creating site](#start-creating-site)
- [Make .gitignore file](#make-gitignore-file)
- [Add initial content](#add-inital-content)
- [Setup automatic deployment](#setup-automatic-deployment)
- [Publish website](#publish-website)

Hugo is a static site generator (written in [Go](https://go.dev)) that claims it makes building websites fun again, and I have to admit there is some truth to it. I'm not a big fan of wrangling web frontend code (been there, done that) so my goal here was obviously to avoid that as much as possible and just focus on writing content, using [Markdown](https://en.wikipedia.org/wiki/Markdown).

There are other similar tools too. For example, I've used [Jekyll](https://jekyllrb.com) before (written in [Ruby](https://www.ruby-lang.org)) and played around with [Astro](https://astro.build) ([JS](https://en.wikipedia.org/wiki/JavaScript)-based framework) - which seems powerful + I loved their [tutorial](https://docs.astro.build/en/tutorial/0-introduction/). I'd like to try out [Eleventy](https://www.11ty.dev) (JS) sometimes and of course [Publish](https://github.com/JohnSundell/Publish) (powered by [Swift](https://www.swift.org) 🧡).

Why Hugo, you ask? Well:
- Speed, simplicity, and love for `.md` files (on steroids)
- Hugo's templating / Go syntax annoys me just enough to keep me focused on content creation

You see, sometimes I have a habit of going down the rabbit hole when I research stuff. For example, when I decided to start with Hugo, I realized that my favorite IDE [Xcode](https://developer.apple.com/xcode/) was not fit for this kind of web development, so I went researching which [IDE](https://en.wikipedia.org/wiki/Integrated_development_environment) to use for this purpose. I was (once again) trying out some classic code editors for macOS like [Sublime Text](https://www.sublimetext.com), [TextMate](https://macromates.com), and [BBEdit](https://www.barebones.com/products/bbedit/). I even tried the alpha release of [CodeEdit](https://www.codeedit.app) (impressive, but still very early on). To my surprise I finally settled with [Visual Studio Code](https://code.visualstudio.com) - it just ticked all my boxes, and more. These days, I even use it to [SSH](https://en.wikipedia.org/wiki/Secure_Shell) into my [Digital Ocean](https://www.digitalocean.com) droplet and edit [nginx](https://nginx.org/en/) config - but wait, that's another story...

Why are we here again? Ah yes, to make a website.

## Start creating site

That's the easy part, after [installing Hugo](https://gohugo.io/installation/) on your machine, follow these simple steps (I'll just open up a new [tmux](https://tmux.github.io/) pane in my [Terminal](https://en.wikipedia.org/wiki/Terminal_(macOS)) to follow along):

```bash
hugo new site my-website
cd my-website
git init
git submodule add https://github.com/theNewDynamic/gohugo-theme-ananke.git themes/ananke
echo "theme = 'ananke'" >> hugo.toml
hugo server
```

See Hugo's [quick start guide](https://gohugo.io/getting-started/quick-start/), which explains running each of these 6 commands (or just do it!). In short, we create a new git repository with a Hugo site using the default [Ananke](https://github.com/theNewDynamic/gohugo-theme-ananke) theme, then start a local web server so the site is available at the given localhost address:

```bash
Built in 28 ms
Environment: "development"
Serving pages from memory
Running in Fast Render Mode. For full rebuilds on change: hugo server --disableFastRender
Web Server is available at http://localhost:1313/ (bind address 127.0.0.1) 
Press Ctrl+C to stop
```

The site is up and running locally in no time, that was quick!

Since our site is also a Git repo, let's open it using a Git client app, for example, I 💙 [Fork](https://fork.dev), but there are other popular apps for this, like [Sourcetree](https://www.sourcetreeapp.com), [Tower](https://www.git-tower.com/mac), [GitKraken](https://www.gitkraken.com), [GitHub Desktop](https://desktop.github.com), [Sublime Merge](https://www.sublimemerge.com), etc.

## Make .gitignore file

I noticed the absence of the [`.gitignore`](https://git-scm.com/docs/gitignore) file, which I think should be there by default, but for some reason, it's not. So, let's create one ourselves: press Ctrl + C in Terminal to stop Hugo’s development server, then make this file and edit it:

```bash
touch .gitignore && code .
```

Copy this code block to the new `.gitignore` file and hit save:

```bash
# Generated files by hugo
/public/
/resources/_gen/
/assets/jsconfig.json
hugo_stats.json

# Executable may be added to repository
hugo.exe
hugo.darwin
hugo.linux

# Temporary lock file while building
/.hugo_build.lock
```

If we go back to our git client and unstage / stage all files again, there should be fewer files to commit now. Nice, we're ready to add some content:

## Add initial content

Create new content easily using [CLI](https://en.wikipedia.org/wiki/Command-line_interface):

```bash
hugo new content posts/my-first-post.md
```

This will generate a new `.md` file in the `content` directory, which contains a [front matter](https://gohugo.io/content-management/front-matter/) header, and Markdown content, like this:

```md
+++
title = 'My First Post'
date = 2023-12-26T23:43:19+01:00
draft = true
+++

## Introduction

This is **bold** text, and this is *emphasized* text.

Visit the [Hugo](https://gohugo.io) website!
```

Feel free to write your first post, or just update `hugo.toml` ([site config](https://gohugo.io/getting-started/configuration/)) with custom title or any other settings, then start the local web server again (with -D parameter to show draft posts):
```bash
hugo server -D
```

There's now a site title from `hugo.toml` + Markdown file from the `content` dir, displayed in the browser. That sounds like progress, well done!

## Setup automatic deployment

There is one more thing I'd like us to take care of, before making the "Initial commit". There are [many ways](https://gohugo.io/hosting-and-deployment/) to host and deploy a Hugo website, but since we chose GitHub Pages (explained in detail [here](https://gohugo.io/hosting-and-deployment/hosting-on-github/)) - create a new file at the given path and copy this code:

```yaml { title=".github/workflows/hugo.yaml" }
# Sample workflow for building and deploying a Hugo site to GitHub Pages
name: Deploy Hugo site to Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches:
      - main

  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
# However, do NOT cancel in-progress runs as we want to allow these production deployments to complete.
concurrency:
  group: "pages"
  cancel-in-progress: false

# Default to bash
defaults:
  run:
    shell: bash

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    env:
      HUGO_VERSION: 0.121.0
    steps:
      - name: Install Hugo CLI
        run: |
          wget -O ${{ runner.temp }}/hugo.deb https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb \
          && sudo dpkg -i ${{ runner.temp }}/hugo.deb          
      - name: Install Dart Sass
        run: sudo snap install dart-sass
      - name: Checkout
        uses: actions/checkout@v4
        with:
          submodules: recursive
          fetch-depth: 0
      - name: Setup Pages
        id: pages
        uses: actions/configure-pages@v4
      - name: Install Node.js dependencies
        run: "[[ -f package-lock.json || -f npm-shrinkwrap.json ]] && npm ci || true"
      - name: Build with Hugo
        env:
          # For maximum backward compatibility with Hugo modules
          HUGO_ENVIRONMENT: production
          HUGO_ENV: production
        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"          
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v2
        with:
          path: ./public

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v3
```

That's the [YAML](https://yaml.org) workflow for [GitHub Actions](https://github.com/features/actions) which makes automatic build and deployment of our Hugo site to the GitHub Pages. 

## Publish website

Commit all changes locally then let's prepare for the next step - to test this in practice and publish the site from localhost to the web, by simply pushing our git changes to the origin.

[Create a new repository on GitHub](https://github.com/new) and GitHub Pages will serve it at `username.github.io/repo-name`. To create a user site simply use `username.github.io` as the repository name and that's it.

Now, before pushing local changes, go to the new repository settings on GitHub, section "Pages" and switch the "Build and deployment" / Source option from "Deploy from a branch" to "GitHub Actions". This will trigger our custom workflow with the initial push (and each new push afterward).

Whenever you're ready, **make the push** then quickly check the "Actions" tab on GitHub and confirm that our workflow is running. A few moments later, our site will be published online. Easy, right?

> Note that "My First Post" which we made earlier is not displayed online, although it was there on our localhost. That's because its front matter contains `draft = true` - making it available only in development mode.

## Recap

What have we done so far:

- used [Hugo](https://gohugo.io) to generate a site based on our [Markdown](https://en.wikipedia.org/wiki/Markdown) content ☑️
- configured [GitHub Actions](https://github.com/features/actions) to build & deploy our website ☑️
- published the initial version of our site online ☑️
- realized that this is a completely free DIY solution (no custom domain or hosting required) ☑️

If you enjoyed the journey so far, join me also for [the 2nd part](/blog/hugo-site-tips-and-tricks) where I'll be sharing which steps I took next, while building this very website.
