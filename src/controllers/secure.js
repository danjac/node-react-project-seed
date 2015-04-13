export function* isSecure(next) {
    if (!this.isAuthenticated()) {
        this.throw(401, "You must be signed in to do this!");
    }
    yield* next;
}
