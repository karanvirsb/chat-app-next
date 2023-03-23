function pipe<Type>(...fns: any[]) {
    return async (param: any): Promise<Awaited<Type>> =>
        fns.reduce(
            (result, fn) => (result.then && result.then(fn)) || fn(result),
            param
        );
}

export default pipe;
