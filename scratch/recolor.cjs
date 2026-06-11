const fs = require("fs");
const path = require("path");

const rootDirs = ["src/pages", "src/components", "src/admin"];

const colorMap = {
  "green-50": "primary-50",
  "green-100": "primary-100",
  "green-200": "primary-200",
  "green-300": "primary-300",
  "green-400": "amber-400",
  "green-500": "amber-500",
  "green-600": "amber-600",
  "green-700": "primary-700",
  "green-800": "primary-800",
  "green-900": "primary-900",
  
  "red-50": "primary-50",
  "red-100": "primary-100",
  "red-200": "primary-200",
  "red-300": "primary-300",
  "red-400": "amber-400",
  "red-500": "amber-500",
  "red-600": "amber-600",
  "red-700": "primary-700",
  "red-800": "primary-800",
  "red-900": "primary-900",
  
  "emerald-50": "primary-50",
  "emerald-100": "primary-100",
  "emerald-400": "amber-400",
  "emerald-500": "amber-500",
  "emerald-600": "amber-600",
  
  "purple-50": "primary-50",
  "purple-100": "primary-100",
  "purple-400": "primary-400",
  "purple-500": "primary-500",
  "purple-600": "primary-600",

  "indigo-50": "primary-50",
  "indigo-100": "primary-100",
  "indigo-400": "primary-400",
  "indigo-500": "primary-500",
  "indigo-600": "primary-600",
  
  "teal-50": "primary-50",
  "teal-100": "primary-100",
  "teal-400": "primary-400",
  "teal-500": "primary-500",
  "teal-600": "primary-600",
  
  "orange-50": "primary-50",
  "orange-100": "primary-100",
  "orange-400": "amber-400",
  "orange-500": "amber-500",
  "orange-600": "amber-600",
  
  "rose-50": "primary-50",
  "rose-100": "primary-100",
  "rose-400": "amber-400",
  "rose-500": "amber-500",
  "rose-600": "amber-600",
};

function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith(".jsx") || fullPath.endsWith(".js") || fullPath.endsWith(".tsx")) {
      // Exclude ChatBotWidget.jsx from this mass replacement because of the exception rule!
      if (fullPath.includes("ChatBotWidget.jsx") || fullPath.includes("chatbotService") || fullPath.includes("chatbotThemeService")) continue;
      
      let content = fs.readFileSync(fullPath, "utf8");
      let modified = false;
      
      for (const [oldColor, newColor] of Object.entries(colorMap)) {
        // match bg-, text-, border-, ring-, etc.
        const regex = new RegExp(`(bg|text|border|ring|from|via|to|shadow)-${oldColor}\\b`, "g");
        if (regex.test(content)) {
          content = content.replace(regex, `$1-${newColor}`);
          modified = true;
        }
      }
      
      if (modified) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

for (const dir of rootDirs) {
  processDirectory(dir);
}
console.log("Done");
