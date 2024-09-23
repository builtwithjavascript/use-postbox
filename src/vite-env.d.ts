/// <reference types="vite/client" />
import { IPostbox } from "./use-postbox/interfaces";

declare global {
  interface Window {
    _postbox: IPostbox;
    usePostbox: () => IPostbox;
  }
}
