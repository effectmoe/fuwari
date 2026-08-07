/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`)
  process.exit(1) // Terminate the script and return error code 1
}

let fileName = args[0]

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, fileName)

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: "${args[0]}"
published: ${getDate()}
description: ""
image: "./cover.jpg"
thumbnail: "./thumb.jpg"
imageAlt: ""
tags: ["AI", "LLMO", "SEO"]
category: "AI"
service: ""
course: ""
relatedLinks:
  - label: ""
    href: "/posts/"
  - label: ""
    href: "/posts/"
faq:
  - q: ""
    a: ""
  - q: ""
    a: ""
draft: false
---

> **この記事の要点**
>
> -

<!--
SEO/LLMO guardrails:
- image と thumbnail は別アスペクト比で作成し、imageAlt を具体的に書く。
- 外部出典リンクを1件以上、内部リンクを2件以上入れる。
- FAQは2問以上。記事末の ArticleFAQ が FAQPage JSON-LD になります。
- 自社商品は記事の結論後に自然な導線として置き、本文全体を商品紹介だけにしない。
- 公開前に pnpm run audit:posts と pnpm build を通す。
-->
`

fs.writeFileSync(path.join(targetDir, fileName), content)

console.log(`Post ${fullPath} created`)
