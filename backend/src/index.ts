import configProperties from './config/configProperties';
import { server } from './server';

server.run(configProperties.port);