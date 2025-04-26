import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import "dotenv/config";
import path from "path";

export async function checkTaskComplete(task, file, type) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const myfile = await ai.files.upload({
    file: file,
    config: { mimeType: type },
  });
  console.log("Uploaded file:", myfile);

  const result = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: createUserContent([
      createPartFromUri(myfile.uri, myfile.mimeType),
      "\n\n",
      "You are given the following goal: " +
        task +
        "Determine if the submitted file represents proof that the goal was completed. Answer only yes or no.",
    ]),
  });
  return result.text;
}
