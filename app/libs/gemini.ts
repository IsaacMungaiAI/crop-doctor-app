import axios from "axios";

const apiKey = 'AIzaSyB6wdJU5rbxTBHzu5IXRoNYAOGIgp8XWHQ'; // Store securely in prod


const context = `You are a helpful assistant for diagnosing crop diseases.
You will provide follow-up questions to the user to help them understand the diagnosis better.
Keep the chat context in sync with the user so that they can ask follow-up questions.
Do not provide any information that is not related to the crop image provided.
Do not provide any information that is not related to the diagnosis of the crop disease.`;

export default async function getGeminiResponse(userInput: string): Promise<string> {
  console.log(apiKey)
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemma-3-27b-it:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            role: "user",
            parts: [
              { text: `${context}. ${userInput}` }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'crop-doctor/1.0'
        }
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Gemini error:', error);
    return "There was an error getting the response. Try again later.";
  }
};


// To run this code you need to install the following dependencies:
// npm install @google/genai mime
// npm install -D @types/node

/*import {
  GoogleGenAI,
} from '@google/genai';

async function main() {
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });
  const config = {
  };
  const model = 'gemma-3-27b-it';
  const contents = [
    {
      role: 'user',
      parts: [
        {
          text: `INSERT_INPUT_HERE`,
        },
      ],
    },
  ];

  const response = await ai.models.generateContentStream({
    model,
    config,
    contents,
  });
  let fileIndex = 0;
  for await (const chunk of response) {
    console.log(chunk.text);
  }
}

main();*/

