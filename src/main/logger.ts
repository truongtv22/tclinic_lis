class Logger {
  state: Record<string, [[string?, ...any[]]?]> = {};

  scope(scope: string) {
    const self = this;
    if (!this.state[scope]) this.state[scope] = [];
    return {
      getLogs() {
        return self.state[scope];
      },

      log(...args: any[]) {
        self.state[scope].push([new Date().toISOString(), ...args]);
      },

      clear() {},
    };
  }
}

// const logger = new Logger();

console.log("s".replaceAll(/\u0001/g, '<NUL>').replaceAll(/\u0002/g, '<STX>'))

// logger.scope('connection-1').log('Hello world');
// logger.scope('connection-1').log('Hello world', 123);

// console.log(JSON.stringify(logger.state,null, 2));
