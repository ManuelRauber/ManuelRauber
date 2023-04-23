const Handlebars = require('handlebars');
const fs = require('fs');
const GhostContentAPI = require('@tryghost/content-api');

module.exports = async({ core }) => {
    const templateContent = fs.readFileSync('./src/template.md');
    const template = Handlebars.compile(templateContent);

    const ghostUrl = core.getInput('ghost-url');
    const apiKey = core.getInput('ghost-api-key');

    const api = new GhostContentAPI({
        url: ghostUrl,
        key: apiKey,
        version: 'v5.0'
    });

    const latestPosts = await api.posts.browse({ limit: 5, order: 'published_at DESC' });
    const templateVariables = {
        lastUpdate: new Date().toISOString().split('T')[0],
        posts: latestPosts.map(post => ({ title: post.title, url: post.url }))
    }

    const finalTemplate = template(templateVariables);

    fs.writeFileSync('./template.md', finalTemplate, { encoding: 'utf-8' });
}
