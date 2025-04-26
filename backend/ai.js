import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";
import "dotenv/config";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const myfile = await ai.files.upload({
  file: path.join("public/data/uploads/", "uploaded_file-1745702883517.jpeg"),
  config: { mimeType: "image/jpeg" },
});
console.log("Uploaded file:", myfile);

const result = await ai.models.generateContent({
  model: "gemini-2.0-flash",
  contents: createUserContent([
    createPartFromUri(myfile.uri, myfile.mimeType),
    "\n\n",
    "Can you tell me about this photo?",
  ]),
});
console.log("result.text=", result.text);
