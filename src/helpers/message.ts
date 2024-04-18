import { t } from 'i18next';
import AppHelper from './app';

interface IContentBoxItem {
  id: string;
  contentBox: HTMLDivElement;
  onClose: any;
}
const dom = document.createElement('div');
dom.classList.add('app-message');
let currentContentBoxes: IContentBoxItem[] = [];
window.onload = () => document.body.appendChild(dom);
document.onkeydown = (evt) => {
  const event = evt || window.event;
  if (event.keyCode === 27) {
    currentContentBoxes.forEach((e) => {
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      AppMessage.hide(e);
    });
  }
};

class AppMessage {
  private static _count = 0;
  static hide(contentBoxItem: IContentBoxItem) {
    if (!currentContentBoxes.some((e) => e.id === contentBoxItem.id)) return;
    dom.removeChild(contentBoxItem.contentBox);
    currentContentBoxes = currentContentBoxes.filter((e) => e.id !== contentBoxItem.id);
    const boxs: any = document.querySelectorAll('.app-content-box');
    for (let i = 0; i < boxs.length; i++) {
      boxs[i].style.top = `${parseInt(boxs[i].style.top, 10) - 50}px`;
    }
    this._count--;
    if (typeof contentBoxItem.onClose === 'function') contentBoxItem.onClose();
  }
  private static _show(content: string, duration = 3000, type = 'info', onClose = Function.prototype) {
    const contentBox = document.createElement('div');
    const contentDom = document.createElement('span');
    const id = AppHelper.generateUniqueId();
    const icon = document.createElement('i');
    icon.classList.add(type);
    icon.classList.add('app-message-icon');
    contentDom.innerText = content;
    contentBox.classList.add('app-content-box');
    contentBox.classList.add('animate-in');
    contentBox.classList.add(type);
    contentBox.appendChild(icon);
    contentBox.appendChild(contentDom);
    contentBox.style.top = `${this._count * 65}px`;
    dom.appendChild(contentBox);
    const contentBoxItem = { id, contentBox, onClose };
    currentContentBoxes.push(contentBoxItem);
    this._count++;
    setTimeout(() => {
      contentBox.classList.add('animate-out');
      setTimeout(() => {
        this.hide(contentBoxItem);
      }, 300);
    }, duration);
  }
  static showError(params: { message?: string; duration?: number }) {
    let message = params.message?.replace(/undefined/g, '') ?? '';
    message = !message || message.length < 4 ? t('global.somethingWentWrong') : message;
    AppMessage._show(message, params?.duration ?? 5000, 'error');
  }
  static showWarning(params: { message?: string; duration?: number }) {
    let message = params.message?.replace(/undefined/g, '') ?? '';
    message = !message || message.length < 4 ? t('global.somethingWentWrong') : message;
    AppMessage._show(message, params?.duration ?? 5000, 'warn');
  }
  static showSuccess(params?: { message?: string; duration?: number }) {
    let message = params?.message?.replace(/undefined/g, '') ?? '';
    message = !message || message.length < 4 ? t('global.transactionSuccessfull') : message;
    AppMessage._show(message, params?.duration ?? 5000, 'success');
  }
}

export default AppMessage;
