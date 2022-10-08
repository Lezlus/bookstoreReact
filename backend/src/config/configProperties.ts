import convict from "convict";

const config = convict({
  env: {
    doc: 'The application enviorment',
    format: ['local', 'test-docker'],
    default: 'local',
    env: 'NODE_ENV',
  },
  port: {
    doc: "The port to bind.",
    format: 'port',
    default: 8080,
    env: 'PORT',
  },
  db: {
    host: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'localhost',
      env: 'DB_HOST',
    },
    name: {
      doc: 'Database name',
      format: String,
      default: 'test-node-with-docker',
      env: 'DB_NAME'
    },
    user: {
      doc: 'Database user',
      format: String,
      default: 'testuser',
      env: 'DB_USER',
    },
    port: {
      doc: 'Database port',
      format: 'port',
      default: 5432,
      env: 'DB_PORT',
    },
    password: {
      doc: 'Database password',
      format: '*',
      default: undefined,
      env: 'DB_PASSWORD',
    },
  },
});

const env = config.get('env');
config.loadFile(`${process.cwd()}/src/config/configData/${env}.json`)
config.validate({allowed: 'strict'});

const configProperties = config.getProperties();

export default configProperties