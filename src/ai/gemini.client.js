import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateResponse = async (prompt) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const generationConfig = {
            temperature: 0.2,
            maxOutputTokens: 1000,
        };

        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig,
        });

        const response = await result.response;
        return response.text();
    } catch (err) {
        console.error("🔥 GEMINI AI ERROR:", err.message);
        throw new Error("AI Service Unavailable");
    }
};
