# How the blog works

The basic idea of the Remix Austin blog is that there is a second server running alongside the
Remix app when in development mode. This server is responsible for serving the blog content and
triggering auto-refreshes when blog content changes.

The reason for this is that Remix themselves recommend using `mdx-bundler` to compile `.mdx`
files, even though they support `.mdx` routes out of the box. We decided to go down that route.
However, it didn't take long before realizing that this approach would sacrifice many of the
nice-to-haves that come with having the `.mdx` files along with the rest of the code. Mainly
auto-refresh and live updating.

There were a few strategies explored for how to replicate this functionality while keeping
complexity under control. Eventually, we arrived at this point and we think it's working well
enough.

## Making your own post

The first step towards making and previewing your own post is to start the local app with
`npm run dev`. Then make a `.mdx` file under `/blog/posts`. Please use either dash case or
camel case in the name of your `.mdx` file, since the name will be used to make the URL slug.

Your post MUST have these front matter fields in order to appear in the `blog.tsx` route
of the Remix app.

- `title: string`
- `date: string` - Many date formats are accepted, but for the sake of consistency amongst people of all regions, we recommend something like `04 April 2023`
- `author: string`

The front matter is in YAML format and it must go at the top of the `.mdx` file.

Example:

```yaml
---
title: My first post!
author: Matt Hernandez
date: 04 April 2023
---
```

Once the required front matter is included in your post, go to the `blog.tsx` route in the Remix
app. You should see all blog posts ordered by most recent first. Your post should be here
with the front matter you included.

## Adding MDX goodies

We advise reading the [MDX docs](https://mdxjs.com/) to see what MDX adds on top of markdown.
`import` statements must go below the front matter section, but above all your content.

You're capable of adding whatever content and functionality you wish, with some rules in
place.

### For React components and Typescript

If you're creating a component to include in your post, or if you have a Typescript utility
file that you'll make use of in your post, make them under the `/blog/posts/components`
directory or the `/blog/posts/utils` directory.

Please keep these components and utils lean and avoid importing code from outside these folders.
Importing Typescript types or code from `node_modules` can be done sparingly. Otherwise,
including dependencies from outside these folders can bloat your final file and it's
possible your post may not even compile when run through `mdx-bundler`.

### For images

Include image files under the `/blog/posts/img` directory. If your images are large, we
recommended resizing them to a width of 700px max and also running them through
an image optimizer.

## Tailwind

All of your reliable Tailwind css classes are available to you in `.mdx` files and in your
React components under `/blog/posts/components`. You can even include JSX inline with your
markdown content for some added flair.

```markdown
Markdown content with <span className="text-xl">some JSX!</span>
```

## Auto-refreshing

When you make changes to any files under the `/blog` directory, you should see those changes
reflected in the app. This includes components, images, and utils.

## Now get to writing!

You should have everything you need to make your own blog post. Have fun!
