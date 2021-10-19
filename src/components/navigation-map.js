import Permissions from '../permissions';

var map = [
    {
        to: '/dashboard',
        text: 'navigation.dashboard',
        permission: Permissions.View.Dashboard
    },
    {
        to: '/endpoints',
        text: 'navigation.endpoints',
        permission: Permissions.View.Monitoring
    },
    {
        text: 'navigation.message-types.title',
        items: [
            {
                to: '/messagetypeassociations',
                text: 'navigation.message-types.associations',
                permission: Permissions.Manage.Monitoring
            },
            {
                to: '/messagetypesdispatched',
                text: 'navigation.message-types.dispatched',
                permission: Permissions.Manage.Monitoring
            },
            {
                to: '/messagetypeshandled',
                text: 'navigation.message-types.handled',
                permission: Permissions.Manage.Monitoring
            }
        ]
    },
    {
        text: 'navigation.messages.title',
        items: [
            {
                to: '/messages',
                text: 'navigation.messages.manage',
                permission: Permissions.Manage.Messages
            },
            {
                to: '/sendmessage',
                text: 'navigation.messages.send',
                permission: Permissions.Manage.Messages
            },
            {
                to: '/messageheaders',
                text: 'navigation.messages.headers',
                permission: Permissions.Manage.Messages
            }
        ]
    },
    {
        to: '/subscriptions',
        text: 'navigation.subscriptions',
        permission: Permissions.View.Subscriptions
    },
    {
        to: '/datastores',
        text: 'navigation.data-stores',
        permission: Permissions.View.DataStores
    },
    {
        to: '/queues',
        text: 'navigation.queues',
        permission: Permissions.View.Queues
    },
    {
        to: '/schedules',
        text: 'navigation.schedules',
        permission: Permissions.View.Schedules
    }
];

export default map;