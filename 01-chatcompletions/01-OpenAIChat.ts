import "dotenv/config"
import OpenAI from "openai"

//const { OPENAI_API_KEY } = process.env
//console.log(OPENAI_API_KEY)

const openai = new OpenAI(
  //{apiKey: OPENAI_API_KEY}
)

const completions = await openai.chat.completions.create({
  model: "gpt-4o-mini",
  messages: [
    { role: "system", content: "You are a helpful assistant." },
    {
        role: "user",
        content: "챗지피티와 대화할 때 주의할 점을 100자 미만으로 알려줘"
    }
  ]
})

console.log(completions.choices[0].message)