import { moderateName } from "./index";
describe("santiziing text", () => {
    it.skip("Contains profanity", () => {
        const name = "bullshit";
        moderateName(name).then((r) => expect(r).toBe(true));
    });
    it.skip("Does not contain profanity", () => {
        const name = "JohnB";
        moderateName(name).then((result) => expect(result).toBe(false));
    });
});
