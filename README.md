# ts-i18n

Simple i18n implementation with TypeScript.

# How to run

```bash
$ npm i
$ npm run build
$ npm start

# visit http://localhost:9000
```

The page accepts two query parameters, 'name' and 'unread' (http://localhost:9000?name=kimamula&unread=1, for example).

See what happens when you switch the primary language of your browser between English and Japanese and reload the page.

# Key points

## Messages are defined in TypeScript, not JSON.

[src/messages/en.ts](./src/messages/en.ts):

```ts
export const messages = {
  title: 'Simple i18n implementation with TypeScript',
  greeting: (name = 'John Doe') => `Hello, ${name}.`,
  unreadNotification: (unread: number) => `You have ${unread === 0 ? 'no' : unread} unread message${unread === 1 ? '' : 's'}.`
};
```

* Typo of the keys and the arguments for the messages results in a compilation error. The arguments are treated in a type-safe manner.
* Any inconsistency of the keys and the arguments between messages for the different languages also results in a compilation error.
* No special syntax is required for complex formatting of numbers, dates, plural/singular, etc. Just write TypeScript to achieve them (as you do wherever else).

## The implementation is fairly simple and does not require dependency on any i18n library.

### On the server side

Messages are dynamically required depending on the request's language.

[src/messages/index.ts](./src/messages/index.ts):

```ts
import * as path from 'path';
import * as glob from 'glob';
import { messages as en } from './en';

export const messages = en;

export namespace Server {
  // Languages for which messages are defined under this dir are acceptable
  export const acceptableLanguages = glob.sync(`${__dirname}/*.js`)
    .map((file) => path.basename(file, '.js'))
    .filter((language) => language !== 'index');

  // require messages for each language and cache
  const map = acceptableLanguages.reduce((acc, language) => {
    acc[language] = require(`./${language}`).messages;
    return acc;
  }, {} as {[language: string]: typeof messages});

  /**
   * Returns a messages object for the specified language
   */
  export function messagesOf(language: string): typeof messages {
    return map[language];
  }
}
```

Then you can get a messages object as follows (using Express `req.acceptsLanguages`, for example):

```ts
import * as express from 'express';
import { Server } from './messages';

const
  app = express(),
  DEFAULT_LANGUAGE = 'en';

app.get('/', (req: express.Request, res: express.Response) => {
  const
    language = (req.acceptsLanguages(Server.acceptableLanguages) || DEFAULT_LANGUAGE) as string,
    messages = Server.messagesOf(language);

  // ...
});
```

### On the client side

`require('./path/to/messages')` is converted to `require('./path/to/messages/{language}')` for each language in the build time by `webpack.NormalModuleReplacementPlugin`.

[webpack.config.js](./webpack.config.js):

```js
const webpack = require('webpack');
const { Server } = require('./src/messages');

module.exports = Server.acceptableLanguages.map((language) => ({
  entry: './src/client.js',
  output: {
    path: './build',
    filename: `bundle_${language}.js` // outputs bundled JS for each language
  },
  plugins: [
    new webpack.NormalModuleReplacementPlugin(/^\..*\/messages$/, (result) => result.request += `/${language}`)
  ]
}));
```

Assign appropriate bundled JS for each request in the server side template:

```
const language = (req.acceptsLanguages(Server.acceptableLanguages) || DEFAULT_LANGUAGE) as string;

// ...

<script type='text/javascript' charSet='utf-8' src={`bundle_${language}.js`}></script>
```

Then you can get a messages object on the client side as follows:

```ts
import { messages } from './path/to/messages';
```

### Server side and client side rendering

You cannot directly import/require a messages object from within components that are rendered on both the server side and the client side, as they are using different messages resolving strategies.

Instead, define a function which accepts a messages object as an argument and returns the top level component for your application.

[React example](./src/component.tsx):

```ts
import * as React from 'react';
import { messages } from './messages';

export const createApp = (_messages: typeof messages) =>
  class extends React.Component<{ name?: string; unread?: number; }, void> {
    render(): JSX.Element { 
      return <div> 
        <h1>{_messages.title}</h1> 
        <p>{_messages.greeting(this.props.name)}</p> 
        <p>{_messages.unreadNotification(this.props.unread)}</p> 
      </div>; 
    } 
  }
;
```

Then, call the function with a messages object that are resolved in either of the server side and client side ways to obtain the top level component.

The descendants components can access to the messages via props or contexts (or any other mechanism depending on your view library) that are propagated from the top level component.
