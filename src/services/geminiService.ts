export async function editImageWithAI(
  imageBase64: string,
  prompt: string
): Promise<string | null> {
  console.log("AI called with prompt:", prompt);

  // TEMP: original image ही return कर दो
  return imageBase64;
}
