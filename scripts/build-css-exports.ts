import fs from "fs/promises"
import path from "path"
import * as colors from "../src/colors"

const outputDirectory = path.resolve(process.cwd())

const allColors: Record<string, Record<string, string>> = colors

const sRgbColors = Object.entries(allColors).filter(
  ([name]) => !name.endsWith("P3")
)

const p3Colors = Object.entries(allColors).filter(([name]) =>
  name.endsWith("P3")
)

const cssContent = colorsToCssVariables(sRgbColors)

const p3CssContent = colorsToCssVariables(p3Colors, /*css*/ "      ")

await fs.writeFile(
  path.resolve(outputDirectory, "colors.css"),
  /*css*/ `:root,
.owly-light-theme {
${cssContent}
}

@supports (color: color(display-p3 1 1 1)) {
  @media (color-gamut: p3) {
    :root,
    .owly-light-theme {
${p3CssContent}
    }
  }
}
`
)

function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1)
}

function cssVariableName(name: string) {
  return name.replace("P3", "")
}

function colorsToCssVariables(
  colors: [string, Record<string, string>][],
  colorPrefix = "  "
) {
  return colors
    .map(([name, value], index) => {
      const tints = Object.entries(value).map(
        ([key, color]) =>
          `${colorPrefix}--${cssVariableName(
            name
          )}-${key}: ${color.toLowerCase()};`
      )

      if (index > 0) {
        tints.unshift(`\n${colorPrefix}/* ${capitalizeFirstLetter(name)} */\n`)
      }

      return tints.join("\n")
    })
    .join("\n")
}
