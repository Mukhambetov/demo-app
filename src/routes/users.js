const service = require('../services/user');
const crud = require('./crud');

module.exports = (router) => {
    crud(service, router, 'users', 'userId');
    router.get('/profile', async (ctx) => {
        const { user } = ctx.state;
        const userProfile = await service.get(user.id, user.id);
        ctx.status = 200;
        ctx.body = {
            data: userProfile,
            status: 'SUCCESS'
        };
    });
};
