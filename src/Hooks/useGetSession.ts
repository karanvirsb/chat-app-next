import { useEffect, useState } from "react";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

type IUseGetSession = {
    sessionInfo: {
        doesSessionExist: boolean;
        userId: string;
        accessTokenPayload: any;
    } | null;
}

export default function useGetSession(): IUseGetSession {
    const [sessionInfo, setSessionInfo] = useState<{
        doesSessionExist: boolean;
        userId: string;
        accessTokenPayload: any;
    } | null>(null);
    const session = useSessionContext();

    useEffect(() => {
        if (!session.loading) {
            const { doesSessionExist, userId, accessTokenPayload } = session;
            setSessionInfo({
                doesSessionExist,
                userId,
                accessTokenPayload,
            });
        }
    }, [session, session.loading]);

    return { sessionInfo };
}
