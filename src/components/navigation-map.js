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
        to: '/logentries',
        text: 'log-entries',
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
                to: '/message-types/dispatched',
                text: 'dispatched',
                permission: Permissions.Manage.Monitoring
            },
            {
                to: '/message-types/handled',
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
        to: '/queues',
        text: 'queues',
        permission: Permissions.View.Queues
    },
];

export default map;