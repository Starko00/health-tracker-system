export type UserExtended = {
    name: string;
    email: string;
    image: string;
    picture: string;
    sub: string;
    id: string;
    iat: number;
    exp: number;
    workspace_name: string | null;
    jti: string;
    role: string | null;
    workspaceId: string | null;
}