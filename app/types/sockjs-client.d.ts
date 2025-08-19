declare module 'sockjs-client' {
  export default class SockJS {
    constructor(url: string, _reserved?: any, options?: {
      transports?: string[];
      sessionId?: number | (() => string);
    });
    
    readyState: number;
    
    onopen: ((e: Event) => void) | null;
    onmessage: ((e: MessageEvent) => void) | null;
    onclose: ((e: CloseEvent) => void) | null;
    onerror: ((e: Event) => void) | null;
    
    send(data: string): void;
    close(code?: number, reason?: string): void;
    
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
  }
}