import type {
  IPostbox,
  IPostboxMessage,
  IPostboxMessageBody,
} from "./interfaces";

class Postbox implements IPostbox {
  async pub<T = unknown>(
    topic: string,
    body: IPostboxMessageBody<T>,
  ): Promise<boolean> {
    const message: IPostboxMessage<T> = {
      topic,
      body,
    };
    if (document && document.location) {
      const targetOrigin = document.location.href;
      top?.postMessage(message, targetOrigin);
      return true;
    } else {
      return false;
    }
  }

  sub<T = unknown>(topic: string, handler: (params?: T) => any): boolean {
    if (
      top &&
      top.addEventListener &&
      handler &&
      typeof handler === "function"
    ) {
      top?.addEventListener(
        "message",
        (e) => {
          if (e.data.topic === topic) {
            handler(e.data.body);
          }
        },
        false,
      );
      return true;
    }
    return false;
  }
}

let _instance: IPostbox

export const usePostbox = (): IPostbox => {
  if (_instance) {
    _instance= new Postbox();
  }
  return _instance as IPostbox;
}

// we add a hook called usePostbox directly on the window object:
if (top && !top.usePostbox) {
  top.usePostbox = (): IPostbox => {
    if (top && !top._postbox) {
      top._postbox = new Postbox();
    }
    return top?._postbox as IPostbox;
  };
}
