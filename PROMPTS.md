# AI Prompt Engineering & Analysis

This document outlines the prompt iterations used for the core AI features in Pahadi CropSathi, comparing variations and explaining why the final prompts were selected.

## 1. Plant Image Analysis (POST /api/ai/analyse)

**Goal:** Accurately identify plant species, detect diseases/pests, suggest treatments, and recommend soil types based on user-uploaded images. Output must match the JSON schema.

### Variation A: Basic Prompt
```text
Analyze this image. What plant is it? Is it healthy? If not, what is the disease and how to treat it? Answer in {lang}.
```
* **Result:** Often produced incomplete JSON. The model struggled to map free-form answers to the strict JSON schema required (e.g., missing `soilTypeRecommendation` or `recommendedCrops`).

### Variation B: Schema-heavy Prompt
```text
Analyze this image in {lang}. Return a JSON object exactly matching this schema: {plantName, diseaseName, confidence, severity, treatments, isHealthy, soilTypeRecommendation, recommendedCrops}. Do not hallucinate.
```
* **Result:** Better JSON formatting, but the model became too cautious, often returning generic "Unknown" values for soil types or crops because the prompt sounded too restrictive.

### Variation C: Structured Task Prompt (Selected)
```text
Analyze this agricultural image in {lang} language. 1. Identify the plant in {lang}. 2. Detect diseases and specific pests (list names) in {lang}. 3. Treatments in {lang}. 4. Soil analysis in {lang}.
```
* **Result:** **Best Performance.** By combining this concise instruction with the `responseSchema` configuration in the `@google/genai` SDK, the model understood its tasks clearly while the SDK enforced the output structure. It reliably produced detailed treatments and accurate soil data.

---

## 2. AgriBot Chat (POST /api/ai/chat)

**Goal:** Provide an interactive, context-aware agricultural assistant.

### Variation A: Generic Assistant
```text
You are a helpful assistant. Answer the user's question: {message}
```
* **Result:** Too verbose. Used complex words and ignored the context of the currently analyzed plant.

### Variation B: Persona-based
```text
You are an expert Agricultural Advisor. Answer in {lang}. The user says: {message}
```
* **Result:** Good tone, but failed to reference the plant the user just uploaded, leading to a disjointed experience.

### Variation C: Context-Aware Persona (Selected)
```text
You are an expert AI Agricultural Advisor. Answer in {lang} language only. Keep answers concise, simple, and easy to understand for farmers. Use bullet points. The user is currently looking at a {plantName} which is {healthStatus}. Disease: {diseaseName}. Soil: {soilType}.
```
* **Result:** **Best Performance.** The model acts as a highly specialized advisor. It uses simple formatting (bullet points), respects the language constraint strongly, and seamlessly integrates the context of the user's current plant analysis into its advice.

---

## 3. Feature Summarisation (POST /api/ai/summarise)

**Goal:** Generate brief, actionable reports for specific feature cards (Weather, Watering, Market, etc.).

### Variation A: Broad Instruction
```text
Write a report about {featureName} for {plantName} in {lang}.
```
* **Result:** Generated long, generic essays that were difficult to read quickly on a mobile device.

### Variation B: Strict Length Constraints
```text
Write a 50-word report about {featureName} for {plantName} in {lang}.
```
* **Result:** The model often cut off sentences midway to meet the word count or omitted crucial details like the actual weather prediction.

### Variation C: Feature-Specific Prompts (Selected)
```javascript
const baseInstruction = `You are generating a report for a farmer in ${lang} language. Keep the language simple, concise, and actionable. Avoid jargon.`;

// Example for Watering Guide (Feature ID: 2)
`${baseInstruction} Create a simple watering guide for ${plant} on ${soil} soil. Tell the farmer exactly when to water (morning/evening) and how to check if the soil needs water.`
```
* **Result:** **Best Performance.** By creating a `promptMap` where each feature ID gets a highly specific instruction (e.g., "Tell the farmer exactly when..."), the model generates perfectly tailored, highly actionable content that fits the UI beautifully.
