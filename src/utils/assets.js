const _getProp = (asset, propName) => {
  return asset.properties.find((prop) => prop.name === propName)
}


const typeToString = {
  1: "bytes",
  2: "string",
  3: "boolean",
  4: "number",
  5: "enum",
  6: "location"
}

const getPropertyValue = (asset, propName, defaultValue = null) => {
  let prop = _getProp(asset, propName)
  console.log(prop);
  if (prop && prop[typeToString[prop.type] + "_value"]) {
    return prop[typeToString[prop.type] + "_value"]
  } else {
    return defaultValue
  }
}

export {
  getPropertyValue
}