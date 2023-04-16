export interface APTag {
    name: string;
    href: string;
    type: string;
}

export interface TkTag {
    name: string;
    url: string;
}

export interface TkActor {
    id: string;
    name: string;
    domain: string;
    username: string;
    preferredUsername: string;
    avatar: string;
    profile: string;
}

export interface TkComments {
    latest: any[];
    more: string;
}

export interface TkShare {
}

export interface TkSound {
    url: string;
}

export interface TkContent {
    id: string;
    type: string;
    actor: TkActor;
    published: string;
    comments: TkComments;
    share: TkShare;
    liked: boolean;
    bookmarked: boolean;
    sound: TkSound;
    content: any;
    attachments: any[];
    tags: TkTag[];
}

export interface TkContentResponse {
    items: TkContent[];
}

export interface ProfileComponents {
    domain: string;
    username: string;
}
export function getProfileComponents(id: string): ProfileComponents {
    const s1 = id.split('//');
    const s2 = s1[1].split('/');
    return {domain: s2[0], username: s2[2]};
}
