module.exports = class Manager {
    static regist (fetcher, plugin) {
        plugin.enter(fetcher)
    }
}