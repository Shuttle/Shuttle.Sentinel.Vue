import Permissions from '../permissions';

var map = [
    {
        to: '/dashboard',
        text: 'dashboard',
        permission: Permissions.View.Dashboard
    },
    {
        to: '/endpoints',
        text: 'endpoints',
        permission: Permissions.View.Monitoring
    },
    {
        text: 'message-types',
        items: [
            {
                to: '/message-types/associations',
                text: 'associations',
                permission: Permissions.Manage.Monitoring
            },
            {
                to: '/messagetypesdispatched',
                text: 'dispatched',
                permission: Permissions.Manage.Monitoring
            },
            {
                to: '/messagetypeshandled',
                text: 'handled',
                permission: Permissions.Manage.Monitoring
            }
        ]
    },
    {
        text: 'messages-text',
        items: [
            {
                to: '/messages',
                text: 'manage',
                permission: Permissions.Manage.Messages
            },
            {
                to: '/sendmessage',
                text: 'send',
                permission: Permissions.Manage.Messages
            },
            {
                to: '/messageheaders',
                text: 'headers',
                permission: Permissions.Manage.Messages
            }
        ]
    },
    {
        to: '/subscriptions',
        text: 'subscriptions',
        permission: Permissions.View.Subscriptions
    },
    {
        to: '/datastores',
        text: 'data-stores',
        permission: Permissions.View.DataStores
    },
    {
        to: '/queues',
        text: 'queues',
        permission: Permissions.View.Queues
    },
    {
        to: '/schedules',
        text: 'schedules',
        permission: Permissions.View.Schedules
    }
];

export default map;