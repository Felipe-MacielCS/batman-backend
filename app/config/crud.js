const sequelize = require('./db');
const User = require('../models/user')
const Pokemon = require('../models/pokemon');

(async () => {
    try {
        await sequelize.sync();

        // Create
        const squirtle = await Pokemon.create({ name: 'Squirtle', type: 'Water' });
        const charmander = await Pokemon.create({ name: 'Charmander', type: 'Fire' });
        const bulbasaur = await Pokemon.create({ name: 'Bulbasaur', type: 'Grass' });

        const user1 = await User.create({ username: 'Felipe', email: 'felipe@email.com', favoritePokemonId: charmander.id });
        const user2 = await User.create({ username: 'Ash', email: 'ash@email.com', favoritePokemonId: charmander.id });
        const user3 = await User.create({ username: 'Axel', email: 'axel@email.com', favoritePokemonId: bulbasaur.id });

        // Read

        const users = await User.findAll({ include: Pokemon });
        console.log(JSON.stringify(users, null, 2));

        // Update

        await user2.update({ favoritePokemonId: squirtle.id });
        console.log('User updated');
        
        // Delete

        await User.destroy({ where: {id:1}});
        console.log('User deleted');

        console.log('CRUD Caught!');
    } catch(err) {
        console.error('Error', err);
    } finally {
        await sequelize.close();
    }
})();