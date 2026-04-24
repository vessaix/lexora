# Lexora AI – Product Spec

## Core Feature
AI content generator with:
- Topic input
- Content type (Blog, SEO, Ads, Rewrite)
- Tone + Length
- Output panel with structured content

## Tech Stack
- Vue 3 + UnoCSS
- NestJS backend
- PostgreSQL
- Groq API

## Pages
- Dashboard
- Generate Content (main)
- History

## Core Flow
User input → backend → Groq API → formatted response → UI

## Rules
- Clean SaaS UI (not chatbot)
- Dark/light mode
- Structured output