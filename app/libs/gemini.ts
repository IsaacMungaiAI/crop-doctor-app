import axios from "axios";

const apiKey = 'AIzaSyB6wdJU5rbxTBHzu5IXRoNYAOGIgp8XWHQ'; // Store securely in prod


const context= `You are a helpful assistant for diagnosing crop diseases.
You will provide follow-up questions to the user to help them understand the diagnosis better.
Keep the chat context in sync with the user so that they can ask follow-up questions.
Do not provide any information that is not related to the crop image provided.
Do not provide any information that is not related to the diagnosis of the crop disease.`;

export default async function getGeminiResponse(userInput: string): Promise<string> {
    console.log(apiKey)
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              { text: `${context}. ${userInput}` }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'chat-app/1.0'
        }
      }
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error('Gemini error:', error);
    return "There was an error getting the response. Try again later.";
  }
};
