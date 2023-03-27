import { getOpenAIConfig } from '../config';

import axios from 'axios';
import { GptMessage, SocketContext } from '../controllers/chat';

const openAIConfig = getOpenAIConfig();

export async function initOpenAI(): Promise<void> {
}

const axConfig = {
    headers: { Authorization: `Bearer ${openAIConfig.apiKey}`}
};

function getEffectiveRecentMessages(contextNumTokens: number, allMessages: GptMessage[]): GptMessage[] {
    if (allMessages.length < 1) {
        throw new Error('single message plus context is too big');
    }
    const estimatedTokens = allMessages.join(' ').split(' ').length;
    if (contextNumTokens + estimatedTokens > 3500) {
        allMessages.shift();
        return getEffectiveRecentMessages(contextNumTokens, allMessages);
    }
    return allMessages;
}

export async function submitChatPrompt(ctx: SocketContext): Promise<string> {

    const systemContextMessages = [
        {"role": "system", "content": "Your name is Tessa, you also go by Tessy and Tess. You are an advanced AI meant to help make using AI easy."},
    ];
    const contextEstimatedTokens = systemContextMessages.join(' ').split(' ').length;

    try {
        const effectiveMessages = getEffectiveRecentMessages(contextEstimatedTokens, ctx.recentMessages);
        ctx.recentMessages = effectiveMessages;
        const messages = systemContextMessages.concat(effectiveMessages);
        ctx.log.info({messages});
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {model: 'gpt-3.5-turbo', messages,}, axConfig);
        return response.data.choices[0].message.content;

    } catch (error: any) {
        throw error;
    }
}
