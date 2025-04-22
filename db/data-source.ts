import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'sqlite',
    database: 'my_database.db',
    entities: [__dirname + '/../src/**/entities/*.entity.js'],
    migrations: [__dirname + '/migrations/*.js'], 
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;