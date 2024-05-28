import { Notification } from 'electron';

class NotificationManager {
  notifications: Map<number, Notification> = new Map();
  lastId = 1;

  showNotification({ title, body }: { title: string; body: string }) {
    const id = this.lastId;
    const notification = new Notification({
      title,
      body,
    });
    notification.on('click', () => {
      this.notifications.delete(id);
    });
    notification.on('close', () => {
      this.notifications.delete(id);
    });
    notification.show();

    this.notifications.set(id, notification);
    this.lastId++;

    return notification;
  }
}

export const notificationManager = new NotificationManager();
