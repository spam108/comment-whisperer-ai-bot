
export async function testOpenAIKey(apiKey: string): Promise<boolean> {
  try {
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${apiKey}`
      }
    });
    
    if (response.ok) {
      console.log("OpenAI API key is valid");
      return true;
    } else {
      console.error("Invalid OpenAI API key");
      return false;
    }
  } catch (error) {
    console.error("Error testing OpenAI API key:", error);
    return false;
  }
}

export async function testTelegramToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
    const data = await response.json();
    
    if (data.ok) {
      console.log("Telegram bot token is valid");
      return true;
    } else {
      console.error("Invalid Telegram bot token");
      return false;
    }
  } catch (error) {
    console.error("Error testing Telegram bot token:", error);
    return false;
  }
}
