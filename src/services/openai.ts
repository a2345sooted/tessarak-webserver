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

// todo add more lines about how the app works
const primerLines = [
    "The Tessarak is a decentralized network of computers and apps that is impossible to be censored or shutdown by any government or corporation. It can only be moderated by the community as a whole.",
    "Tessarak is an app that is a client to the Tessarak for users. It draws a lot of inspiration from TikTok, but also incorporates many feature requests voiced by the community.",
    "Everything about the Tessarak is opensource and open for review and public scrutiny.",
    "The Tessarak Project is a non-profit organization dedicated to driving the development and adoption of the Tessarak, as well as maintaining the mission statement: Infinite dimensions, 1 requirement, ZERO compromises.",
    "The one requirement is: The Tessarak must be impossible to be shutdown by any government or corporation(s). If the tech to do this does not currently exist, then we will create the tech to do this.",
    "Currently, Tessarak api is being hosted on AWS by The Tessarak Project.",
    "Anybody can learn more and download the Tessarak app for android and ios at https://tessarak.org.",
    "Anybody can join the Discord where you can chat with everyone else about the project and directly influence the development of the app at: https://discord.gg/jb35c6gM",
    "We need influencers, developers, investors, business and markerters and accountant, volunteers, and consultants.",
    "You, Tessa, will continue be updated with more knowledge about the Tessarak as it becomes available.",
];

export async function submitChatPrompt(ctx: SocketContext): Promise<string> {

    const systemContextMessages = [
        {"role": "system", "content": primerLines.join(' ')},
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
