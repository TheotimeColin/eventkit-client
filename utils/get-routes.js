const axios = require('axios')

module.exports = async function getAppRoutes() {
    let routes = []

    const api = axios.create({
        baseURL: process.env.NUXT_ENV_API_URL
    })

    let response = await api.get('/articles')

    let blogRoutes = response.data.articles.map(a => ({
        url: `/blog/${a.slug}`,
        priority: 1,
        lastmod: a.modifiedDate
    }))

    routes = [
        ...blogRoutes,
        {
            url: '/blog',
            priority: 0.8,
            changefreq: 'daily'
        }
    ]


    return routes
}