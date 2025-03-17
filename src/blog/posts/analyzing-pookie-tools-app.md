---
title: Analyzing the "Pookie Tools" app
description: Retrocast tries to steal API tokens from terrible AI app "made by Hailey Welch" for 2 hours straight.
date: 1742174686233
tags: ['AI', 'reverse-engineering']
---

So, uhh, the first actual blog post on here, hi!
After seeing a YouTube video about that app, I decided to do a little investigation myself, since I do not believe that the person behind one of the cringiest memes in existence can actually make a good app.
Or any app, for that matter.

# Getting the app

_"Well, let's begin"_, I said, as I opened Aurora Store on my phone and typed _"Pookie Tools"_ into the search bar.
And of course, I got no results, because the app is iOS-only. Who even makes iOS-only apps? That's a _total misplay_!

Checking the App Store page revealed that the app was made by _Vego Pictures L.L.C._.
A quick [DuckDuckGo search](https://duckduckgo.com/?q=Vego+Pictures+L.L.C.&ia=web) showed that their `vegopictures.com` website had expired and was originally hosted on Squarespace. A tech company with a broken website hosted on a website builder? Seems like a red flag to me.

The only other app developed by them is _Ultimate AI_, which looks like yet another UI for the OpenAI API.
To be perfectly honest, even _this_ app seems like a UI for the OpenAI API (_foreshadowing????_).

Anyway, since I don't have an Apple device, I had to visit some of the sketchiest websites known to mankind to obtain the `.ipa` file, which is just a ~~glorified~~ normal `.zip` archive.
But in the end, I managed to get it.

## Analysis

First, a disclaimer.
**This is my first time working with iOS apps (I usually deal with Android), so someone way more professional, like [Bryce Bostwick](https://bryce.co/), could probably do what I did in two minutes, with their eyes closed, and in a much less barbaric way.**

Alright, we're in.
Let's start with something simple to test the waters.

```ansi title="Bash"
[01;32m[/tmp/garbage] [34m$[00m [32mstrings[00m [04;32m/Payload/Runner.app/Frameworks/App.framework/App[00m [34m|[00m [32mrg[00m -i openai
https://api.[31mopenai[0m.com/v1
https://api.[31mopenai[0m.com/v1/
```

**GOTTEM.**
I was right, the app is a mere wrapper for OpenAI API.
As you're reading this, I'm probably using API key stolen from them to make AI play _Inscryption_.
That's the price they should pay for not bothering to build a proper backend (and for being affiliated with one of the cringiest memes in existence).

They're actually very lucky that the app is iOS-only and no one gives a fuck about it. Otherwise, the API key would've been stolen the day they released it.

Next, I wanted to extract the prompts.
Searching for a few obvious keywords revealed a single prompt, but it was the only one I could find.
Most likely, the rest of the prompts are loaded from a remote server, and judging by how easy it was to find OpenAI references, I assume the other URLs are also not obfuscated.

Here's the list of everything that matched the `https?://` regex (with irrelevant entries removed):

```txt title="other-urls.txt"
https://sites.google.com/view/pookie-ai/privacy-policy
https://development.make-ai-apps.com/api/v2/categories
https://sites.google.com/view/pookie-ai/contact-us
https://development.make-ai-apps.com/api/v2/sub-categories
https://api-test.make-ai-apps.com/api/counter
https://sites.google.com/view/pookie-ai/terms-and-conditions
https://development.make-ai-apps.com
https://development.make-ai-apps.com/api/v2/assistant-app?app=Pookie&sort=rank:asc
```

First of all, they were too lazy to go to Squarespace this time and instead made their website on **Google Sites**. _Yikes._
Second, we see the `development.make-ai-apps.com` domain with some interesting API endpoints.

Visiting the root domain just returns an empty 200 response, while visiting the root of the `development` subdomain reveals it's powered by **Strapi**.
From what I can tell, there's no proper way to enumerate endpoints in Strapi, and the only interesting thing good ol' `dirb` could find was a password-protected `/admin`. So, the endpoints found in the app are the only ones we have.

- `/api/v2/categories` returns a basic JSON list containing `name`, `id`, `rank`, and creation/update/publish dates for categories such as _Writing_, _Content_, and _Dating_.
  These categories are exactly the same as in the _Ultimate AI_ app.
  **Presumably, the API is shared between the two apps.**
- `/api/v2/sub-categories` returns a list of AIs such as _Book Suggestor_ or _Apology Writer_, along with their prompts.
  Each AI has an `App` property, and while most are set to `null`, some are actually `"Ultimate AI"` or `"Pookie"`.
  **Yeah, the API is shared between the two apps.**
- `/api/v2/assistant-app?app=Pookie` is our target since it returns info in the same format as the previous endpoint but filtered to only include AIs from the `"Pookie"` app.
  Notably, a few AIs from the previous endpoint are still here, like _Roast Me!_ and the infamous _Height Detector_ (which, according to the prompts, mostly just guesses randomly).

If, for some reason, you want to see the _terrible_ prompt engineering behind this app, feel free to go to the last URL yourself and grab all the data you want before the company goes bankrupt.

Time to release a **free, libre, open-source Android port** of this app! /j

## Afterword

At the beginning of the post I actually thought app was free to use with additional features in premium subscription, but no.
App simply doesn't work unless you pay for weekly ($5/$7) or annual ($40/$50) subscription.
**What a ripoff!**

But seriously, why would anyone pay for it?
Simply going to https://chatgpt.com and typing a prompt does _exactly_ what this app does, except it's not iOS-only, actually free, and you can actually change the prompt if you want.
Or, if you have some spare money, pay $5+ for an actual OpenAI API and get couple millions of tokens (that will probably be enough for couple of months).

But actually, why would anyone do this at all, regardless of the "client" used?
Isn't the whole purpose of "dating" to find someone **you** love?
**YOU**, not some soulless program spitting out random-ish responses.
Do people who use AI for dating really expect something decent from it, if they don't even have enough respect to give human answers to their potential partner?

Or maybe I just don't understand something. I'm ace, after all. **XD**

Thanks for reading and see ya next time in (hopefully more professional) ~~OpenAI API key stealing~~ reverse engineering posts!
If I suddenly disappear after writing this post, you know which **limited liability company** to blame.
