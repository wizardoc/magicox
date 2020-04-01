export function renderCustomLabel(
  source: string,
  labelName: string,
  replaceContent: string
) {
  return source.replace(
    new RegExp(
      `(?:<${labelName}\s*\/>|<${labelName}>[^<]*<\/\s*${labelName}>)`
    ),
    replaceContent
  )
}
