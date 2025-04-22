# NestJS Proof of Concept app
### This application is a proof of concept app that uses NestJS framework to build a REST API that provides CRUD Controllers for two entities: users and cats.
### A sqlite3 database along with TypeORM are integrated to persist data long term.

## Controllers
- `nest g controller [resource]`
## Services 
- `nest g services [resource]`
## Modules 
- `nest g module [resource]`
## Or create the CRUD alttogether
= `nest g resource [resource]`

## Run TypeORM migrations
### Generate the new migration
- `npm run migration:generate -- db/migrations/new-migration-name`
### And then apply the changes
- `npm run migration:run`

## Run app
- `npm run start:dev` or `npm start`