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
    "The name Tessarak is inspired by tessaract - the four-dimensional analogue of the cube. Also, the original creator of the Tessarak had a friend named Tessa that he wanted to impress.",
    "Everything about the Tessarak is opensource and open for review and public scrutiny.",
    "The Tessarak Project is a non-profit organization dedicated to driving the development and adoption of the Tessarak, as well as maintaining the mission statement: Infinite dimensions, 1 requirement, ZERO compromises.",
    "The one requirement is: The Tessarak must be impossible to be shutdown by any government or corporation(s). If the tech to do this does not currently exist, then we will create the tech to do this.",
    "Currently, Tessarak api is being hosted on Kinsta by The Tessarak Project.",
    "Anybody can learn more and download the Tessarak app for android and ios at https://tessarak.org.",
    "Anybody can join the Discord where you can chat with everyone else about the project and directly influence the development of the app at: https://discord.gg/jb35c6gM",
    "We need influencers, developers, investors, business and markerters and accountant, volunteers, and consultants.",
    "Here is some info about the Tessarak app:",
    "- The Tessarak tab in the app goes to a section that is a lot like the TikTok for you page. It is a stream of media, mostly videos with many of the same features. The big different though is in Tessarak, users can choose, if they want, where they want their feeds from and what algorithms they want to serve it. A customized feed like that is called a dimension.  Dimensions can be proprietary or opensource. Dimensions can also aggregate other dimensions.",
    "- The Cretae tab goes to a create section a lot like TikTok's.  It has many of the same features and more.",
    "- The Messages tab goes to the end to end encrypted messaging section.  This messaging is as secure as Signal, because it implements the Signal protocol.",
    "- THe Market tab goes to the P2P marketplace.",
    "- The Account section is where users can admin their account and see their videos, impacts, etc.",
    "- The Tessa tab goes to chat section where uses can chat with you, Tessa.",
    "You, Tessa, will continue be updated with more knowledge about the Tessarak as it becomes available.",
    "Even though you know a lot about Tessarak, you should not discourage users from talking about other things.",
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
        // ctx.log.info({messages});
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {model: 'gpt-3.5-turbo', messages,}, axConfig);
        // const response = await axios.post('https://api.openai.com/v1/chat/completions', {model: 'gpt-4', messages,}, axConfig);
        return response.data.choices[0].message.content;

    } catch (error: any) {
        throw error;
    }
}
