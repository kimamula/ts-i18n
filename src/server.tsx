import * as express from 'express';
import * as React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { createApp } from './component';
import { Server } from './messages';

const
  app = express(),
  port = process.env.PORT || 9000,
  DEFAULT_LANGUAGE = 'en';

app.use(express.static('build'));

app.get('/', (req: express.Request, res: express.Response) => {
  const
    props = {
      name: req.query.name,
      unread: Number(req.query.unread) || 0
    },
    language = (req.acceptsLanguages(Server.acceptableLanguages) || DEFAULT_LANGUAGE) as string,
    messages = Server.messagesOf(language),
    App = createApp(messages);

  res.send(`<!DOCTYPE html>${renderToStaticMarkup(
    <html>
    <head>
      <meta charSet='utf-8'/>
      <title>{messages.title}</title>
    </head>
    <body>

    <div id='app'
         data-props={JSON.stringify(props)}
         dangerouslySetInnerHTML={{__html: renderToString(<App {...props} />)}}
    >
    </div>

    <script type='text/javascript' charSet='utf-8' src={`bundle_${language}.js`}></script>
    </body>
    </html>
  )}`);
});

app.listen(port, () => console.log('listening...' + port));

