var Permissions = {
    Manage: {
        Messages: 'sentinel://messages/manage',
        Monitoring: 'sentinel://monitoring/manage',
        Queues: 'sentinel://queues/manage',
        Schedules: 'sentinel://schedules/manage',
        Subscriptions: 'sentinel://subscriptions/manage'
    },
    View: {
        Dashboard: 'sentinel://dashboard/view',
        Monitoring: 'sentinel://monitoring/view',
        Queues: 'sentinel://queues/view',
        Schedules: 'sentinel://schedules/view',
        Subscriptions: 'sentinel://subscriptions/view'
    }
};

export default Permissions;