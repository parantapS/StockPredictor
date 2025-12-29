import dotenv from "dotenv";
import { OpenAI } from "openai";

export async function processStockData(data) {
  // Process the stock data here
  const messages = [
    { 
      role: "system", 
      content: "You are an expert financial analyst. Given data on share prices over the past 3 days, write a report of no more than 150 words describing the stocks performance and recommending whether to buy, hold or sell." 
    },
    {
      role: "user",
      content: `Analyze the following stock data and provide a summary of trends and insights:\n${JSON.stringify(data)}`
    }
  ]
  try {
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    console.log("Sending data to OpenAI for processing...");

    // Sending data to OpenAI for processing
    const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: messages
        })
    return response.choices[0].message.content;

    // return "Sample report: The stocks showed a steady increase over the past three days, indicating positive market sentiment. It is recommended to hold or buy more shares based on this trend.";
  } catch (error) {
      console.log("Error processing stock data with OpenAI:", error);
      return "Error processing stock data.";
  }
}