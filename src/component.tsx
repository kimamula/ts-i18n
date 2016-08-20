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
