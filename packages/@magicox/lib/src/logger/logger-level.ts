export enum LoggerLevel {
  OFF,
  PANIC,
  ERROR,
  WARN,
  INFO,
  DEBUG,
  ALL
}

interface withLevel {
  level: number;
}

// define level metadata of logger
export function Level(level: LoggerLevel): MethodDecorator {
  return (
    _target: Object,
    _propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ): TypedPropertyDescriptor<any> | void => ({
    ...descriptor,
    value(...infos: any[]) {
      const that = this as withLevel;

      // logger level guard
      if (level > that.level) {
        return;
      }

      descriptor.value.call(that, ...infos);
    }
  });
}
