import { messages as index } from './index';

export const messages: typeof index = {
  title: 'TypeScript によるシンプルな i18n 実装',
  greeting: (name = '名無しの権兵衛') => `こんにちは、 ${name} さん`,
  unreadNotification: (unread: number) => `未読メッセージ${unread === 0 ? 'はありません' : `が ${unread} 通あります`}`
};