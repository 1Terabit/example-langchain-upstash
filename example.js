const axios = require("axios");
const { Redis } = require("@upstash/redis");

// Lass credenciales de Langchain
const langchainApiKey = "tu-api-key-de-langchain";
const langchainModelId = "tu-id-de-modelo-en-langchain";

// Las credenciales de Upstash
const redis = new Redis({
  url: "UPSTASH_REDIS_REST_URL",
  token: "UPSTASH_REDIS_REST_TOKEN",
});

// Genero el texto con Langchain
async function generateText() {
  try {
    const response = await axios.post(
      "https://api.langchain.com/generate",
      {
        model_id: langchainModelId,
        prompt: "Escribe aquí tu prompt para generar texto",
        length: 100, // Longitud del texto
      },
      {
        headers: {
          Authorization: `Bearer ${langchainApiKey}`,
        },
      }
    );

    console.log("Texto generado:", response.data.text);
    return response.data.text;
  } catch (error) {
    console.error("Error al generar texto:", error);
    throw error;
  }
}

// almaceno el texto generado en Upstash
async function storeText(text) {
  try {
    await redis.set("key", text);
    console.log("Texto almacenado en Upstash con éxito.");
  } catch (error) {
    console.error("Error al almacenar el texto en Upstash:", error);
    throw error;
  }
}

// Usa LRANGE para obtener los mensajes del historial
async function readHistory() {
  try {
    const messages = await redis.lrange("historial", 0, 99);
    console.log(messages);
  } catch (error) {
    console.error(error);
  }
}
