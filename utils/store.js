export {
    updateOne,
    refreshCollection,
    deleteOne,
    getQuery
}

const getQuery = function (data) {
    if (!data) return ''
    return encodeURI(Object.keys(data).map(key => `${key}=${data[key]}`).join('&'))
}

const updateOne = function (stateItems, value) {
    let items = JSON.parse(JSON.stringify(stateItems))
    items[value._id] = value

    let collection = Object.keys(items).map(key => items[key])
    
    return { collection, items }
}

const refreshCollection = function (values) {
    let items = {}
    values.forEach(value => items[value._id] = value)

    let collection = Object.keys(items).map(key => items[key])

    return { collection, items }
}

const deleteOne = function (collection, value) {
    let items = collection.slice()
    items = items.filter(item => item != value)

    collection = Object.keys(items).map(key => items[key])

    return { collection, items }
}