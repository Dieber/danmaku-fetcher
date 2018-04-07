module.exports = class Plugin {
    constructor (name, enter) {
        this.name = name
        this.enter = enter
    }
}