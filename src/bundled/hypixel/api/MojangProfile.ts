export type MojangProfileTextures = {
    timestamp: number,
    profileId: string,
    profileName: string,
    signatureRequired?: boolean,
    textures: {
        SKIN?: {
            url: string,
            metadata?: {
                model: "slim" | "classic"
            }
        },
        CAPE?: {
            url: string
        }
    }
}

export class MojangProfile {
    public readonly id: string
    public readonly name: string
    public readonly legacy?: boolean
    public readonly demo?: boolean
    public readonly textures?: MojangProfileTextures;
    public readonly profileActions: string[]

    public constructor(json: Record<string, any>) {
        this.id = json.id;
        this.name = json.name;
        this.legacy = json.legacy;
        this.demo = json.demo;
        this.profileActions = Object.freeze(json.profileActions);

        // Textures object is encoded base64 text within the properties array
        if(json.properties && Array.isArray(json.properties)) {
            const texturesProp = json.properties.find((prop: {name: string, value: string}) => prop.name === "textures");
            if(texturesProp) {
                this.textures = Object.freeze(JSON.parse(atob(texturesProp.value)));
            }
        }
    }

    public getCapeUrl(): string | null {
        return this.textures?.textures.CAPE?.url ?? null;
    }

    public getSkinUrl(): string | null {
        return this.textures?.textures.SKIN?.url ?? null;
    }

    public getSkinModelType(): "slim" | "classic" {
        return this.textures?.textures.SKIN?.metadata?.model ?? "classic";
    }
}
