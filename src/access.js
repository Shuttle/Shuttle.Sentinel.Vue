import configuration from './configuration';
import Access from 'shuttle-access';

const access = new Access(configuration.accessUrl);

export default access;