import { CollectionConfig } from 'payload/types';
import UserPageDescription from '../components/User/UserPageDescription';
import CreateUser from '../components/User/CreateUser';

const Users: CollectionConfig = {
    slug: 'users',
    auth: { tokenExpiration: 7 * 24 * 60 * 60 },
    admin: {
        useAsTitle: 'name',
        defaultColumns: ['name', 'email'],
        description: UserPageDescription,
        components: { views: { Edit: CreateUser } },
    },
    fields: [{ name: 'name', type: 'text' }],
};

export default Users;
