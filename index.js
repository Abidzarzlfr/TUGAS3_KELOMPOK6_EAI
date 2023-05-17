const express = require('express');

const { graphqlHTTP } = require('express-graphql');

const { 
    GraphQLObjectType, 
    GraphQLString, 
    GraphQLInt, 
    GraphQLNonNull, 
    GraphQLList, 
    GraphQLSchema 
} = require('graphql');

const app = express();

const PORT = 5001;


var Owners = [
    { id: 1, name: 'Asep Siomay' },
    { id: 2, name: 'Bola Boli' },
    { id: 3, name: 'Dadang Dangdut' }
]

var Cars = [
    { id: 1, name: 'Mitsubishi Lancer Evo', ownerId: 1 },
    { id: 2, name: 'Toyota Land Cruiser', ownerId: 2 },
    { id: 3, name: 'Lexus ES', ownerId: 3 },
    { id: 4, name: 'BMW M2 Sport', ownerId: 1 },
    { id: 5, name: 'Subaru WRX STI', ownerId: 2 },
    { id: 6, name: 'Volvo XC60', ownerId: 3},
    { id: 7, name: 'Hyundai Palisade', ownerId: 1 },
    { id: 8, name: 'Mercedes Benz G 63', ownerId: 2 }
]

const CarType = new GraphQLObjectType({
    name: 'Car',
    description: 'This represents a car made',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) }, 
        name: { type: GraphQLNonNull(GraphQLString) }, 
        ownerId: { type: GraphQLNonNull(GraphQLInt) },
    }),
});

const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    description: 'This represents a Owner',
    fields: () => ({
        id: { type: GraphQLNonNull(GraphQLInt) }, 
        name: { type: GraphQLNonNull(GraphQLString) } 
    }),
});

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        // menampilkan keseluruhan
        cars: {
            type: new GraphQLList(CarType),
            description: 'List of All Cars',
            // yang akan di return pada query
            resolve: () => Cars
        },
        owners: {
            type: new GraphQLList(OwnerType),
            description: 'List of All Owners',
            // yang akan di return pada query
            resolve: () => Owners
        },
        // menampilkan by id
        car: {
            type: CarType,
            description: 'A Single car',
            args: {
                id: { type: GraphQLInt }
            },
            // yang akan di return pada query
            resolve: (parent, args) => Cars.find(car => car.id === args.id)
        },
        owner: {
            type: OwnerType,
            description: 'A Single Owner',
            args: {
                id: { type: GraphQLInt }
            },
            // yang akan di return pada query
            resolve: (parent, args) => Owners.find(owner => owner.id === args.id)
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addCar: {
            type: CarType,
            description: 'Add a car',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) },
                ownerId: { type: GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const car = { 
                    id: Cars.length + 1, 
                    name: args.name, 
                    ownerId: args.ownerId 
                }
                Cars.push(car)
                return car
            }
        },
        removeCar: {
            type: CarType,
            description: 'Remove a Car',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                Cars = Cars.filter(car => car.id !== args.id)
                return Cars[args.id]
            }
        },
        addOwner: {
            type: OwnerType,
            description: 'Add an Owner',
            args: {
                name: { type: GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const owner = { id: Owners.length + 1, name: args.name }
                Owners.push(owner)
                return owner
            }
        },
        removeOwner: {
            type: OwnerType,
            description: 'Remove an Owner',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                Owners = Owners.filter(owner => owner.id !== args.id)
                return Owners[args.id]
            }
        },
        updateOwner: {
            type: OwnerType,
            description: 'Update an Owner',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                Owners[args.id - 1].name = args.name
                return Owners[args.id - 1]
            }
        },
        UpdateCar: {
            type: CarType,
            description: 'Update a car',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt) },
                name: { type: new GraphQLNonNull(GraphQLString) },
                ownerId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                Cars[args.id - 1].name = args.name
                Cars[args.id - 1].ownerId = args.ownerId
                return Cars[args.id - 1]
            }
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', graphqlHTTP({
    graphiql:true,
    schema:schema
}))

app.listen(PORT,() => {
    console.log(`App is listening on port ${PORT}`)
})