export const messages = {
  title: 'Simple i18n implementation with TypeScript',
  greeting: (name = 'John Doe') => `Hello, ${name}.`,
  unreadNotification: (unread: number) => `You have ${unread === 0 ? 'no' : unread} unread message${unread === 1 ? '' : 's'}.`
};