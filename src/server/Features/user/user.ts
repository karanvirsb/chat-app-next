type props = {
    sanitizeText: (text: string) => string;
};

export interface IUser {
    userId: string;
    username: string;
    status: string;
}
export default function buildUser({ sanitizeText }: props) {
    return function makeUser({ userId, username, status }: IUser) {
        if (userId.length <= 10) {
            throw new Error("User must have an Id greater than 10 characters");
        }
        let sanitizedText = sanitizeText(username).trim();
        if (sanitizedText.length < 1) {
            throw new Error("Username does not contain any valid characters");
        }

        if (sanitizedText.length < 3 || sanitizedText.length >= 30) {
            throw new Error(
                "Username must be greater than 3 characters but less than 30"
            );
        }

        if (!status) {
            throw new Error("Must have a valid status");
        }

        const deletedUsername = "Deleted :`(";
        return Object.freeze({
            getUserId: () => userId,
            getUsername: () => sanitizedText,
            getStatus: () => status,
            markDeleted: () => {
                sanitizedText = deletedUsername;
                userId = "deleted-" + userId;
            },
            isDeleted: () => sanitizedText === deletedUsername,
        });
    };
}
