
import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, RoadmapResponse } from "../types";

// The API key must be obtained exclusively from the environment variable process.env.API_KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `You are Anna, an AI Roadmap Planner. Your role is to create customized 7-step action plans for users who want to learn profitable AI skills without coding.

Guidelines:
1. Always start by greeting the user by name.
2. Provide a brief encouraging intro.
3. Based on the skill and user input, generate a custom 7-step action plan.
4. Each step must have:
   - A clear title
   - A concise, actionable description
   - Practical tips, tools, or examples
5. Steps should guide the user from learning the skill to building projects, applying it in the real world, improving, and scaling.
6. Keep tone friendly, beginner-friendly, and encouraging.
7. You MUST output exactly 7 steps.
8. Customize each step based on the user's selected skill and context.`;

export async function generateRoadmap(prefs: UserPreferences): Promise<RoadmapResponse> {
  const prompt = `Hi Anna, my name is ${prefs.name}. I want to learn ${prefs.skill}. I'm a ${prefs.experience} and my goal is: ${prefs.goal}. Please generate my 7-step roadmap.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            greeting: { type: Type.STRING },
            intro: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  tips: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  }
                },
                required: ["title", "description", "tips"]
              }
            }
          },
          required: ["greeting", "intro", "steps"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    const result = JSON.parse(text.trim());
    return result as RoadmapResponse;
  } catch (error) {
    console.error("Error generating roadmap:", error);
    throw error;
  }
}
