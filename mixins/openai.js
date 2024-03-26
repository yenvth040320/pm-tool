import { Configuration, OpenAIApi } from 'openai'

const CURRENT_USED_MODEL = 'gpt-3.5-turbo-1106'

export default {
  methods: {
    async chatAssistant(messageContent) {
      try {
        const openai = new OpenAIApi(new Configuration({
          apiKey: process.env.OPENAI_API_KEY
        }))
        const response = await openai.createChatCompletion({
          messages: [{ role: 'user', content: messageContent }],
          model: CURRENT_USED_MODEL
        })
        return response.data.choices[0].message.content
      } catch (e) {
        this.$notification.error({
          message: this.$t('text.something_wrong')
        })
        console.error(e.response)
      }
    }
  }
}
