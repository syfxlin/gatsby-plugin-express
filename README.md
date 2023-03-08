# Gatsby Plugin Express

## Introduction

Gatsby plugin for easy integration with Express. `gatsby-plugin-express` gives you a way to integrate your Gatsby site
with a Node.js server using Fastify. Use to serve a standard Gatsby.js site normally - the plugin will take care of
everything:

- Serving [Static files](https://www.gatsbyjs.com/docs/caching/#static-files)
- Serving [Gatsby functions](https://www.gatsbyjs.com/docs/reference/functions/)
- Serving [DSG](https://www.gatsbyjs.com/docs/reference/rendering-options/deferred-static-generation/)/[SSR](https://www.gatsbyjs.com/docs/reference/rendering-options/server-side-rendering/)
routes
- Serving [Client-only routes](https://www.gatsbyjs.com/docs/how-to/routing/client-only-routes-and-user-authentication)
- Serving [404 page](https://www.gatsbyjs.com/docs/how-to/adding-common-features/add-404-page/)
- Serving [500 page](https://www.gatsbyjs.com/docs/how-to/adding-common-features/add-500-page/)
- Serving [Gatsby redirects](https://www.gatsbyjs.com/docs/reference/config-files/actions/#createRedirect)
- Serving [Gatsby reverse proxy](https://support.gatsbyjs.com/hc/en-us/articles/1500003051241-Working-with-Redirects-and-Rewrites) (
limited support)
- Path prefix, Etags, and more.

# Installation

Install the plugin using npm or yarn

```sh
npm i @syfxlin/gatsby-plugin-express express
```

And add it to your `gatsby-config.js`

```js
module.exports = {
    /* Site config */
    plugins: [
        {
            resolve: `@syfxlin/gatsby-plugin-express`,
        },
    ],
};
```

# Serving your site

This plugin implements a server that's ready to go. To use this you can configure a `start`(or whatever you prefer)
command in your `package.json`:

```json
{
  "scripts": {
    "start": "gserve"
  }
}
```
