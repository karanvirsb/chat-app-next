import pipe from ".";

describe("Pipe async tests", () => {
    const sumAsync = pipe(
        (x: number) => x + 1,
        async (x: number) => (await (x + 1)) + 3
    );
    it.skip("Test async addition", () => {
        sumAsync(5)
            .then((result) => expect(result).toBe(9))
            .catch(() => console.log);
    });
});
