import { isArray, isObject } from './typeof'

// extends default config
export function shallowExtends(config: any, defaultConfig: any) {
  return Object.keys(config).reduce((defaultConfig: any, cur: string) => {
    const curVal = config[cur] as unknown

    if (isArray(curVal)) {
      defaultConfig[cur] = curVal.slice()
    } else if (isObject(curVal)) {
      defaultConfig[cur] = shallowExtends(curVal, defaultConfig[cur])
    } else {
      defaultConfig[cur] = curVal
    }

    return defaultConfig
  }, defaultConfig)
}
