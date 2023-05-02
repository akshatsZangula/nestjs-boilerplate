# Instructions


## Table of Content

- [General info](#general-info)


## General info

Folder Structure

By default nest cli provides cmd to generate microservice ( folder ) for an object ( module, controller, services, entities, dto, spec, CRUD endpoints)

``` 
    nest g resource <object>
```

Validation Configration
 
```
    1. Its strict ( whiltelisted and transformed) , only decorated fields can pass till the request body and already transformed to its data type in dto
    2. All validation errors are under 422 error code
```

Async Tasks [ common/workers/ ]

We are using Bull for monitoring these tasks/runners

1. bull needs to get queues registered via module
2. defined processors [ consumers ] on the basis of queues registered
3. add message in the queue to register task to process


Middlewares [ common/middlewares/ ]

Middlewares can be created by just implementing the Base NestMiddleware and then placing it in the routes needed on the module level

Rate Limiting

Configured - NestJS inbuilt throttling module, which allows to apply rate limiter globally on all routes as well as on individual routes with different requests and time interval values by overriding decorators

Loggers 

We have the default nestjs logger configured. NestJS needs injectables to be used in the services etc. Therefore we are instantiating and using there itself, the configration of the logger remains global based on the env values ( logger levels to log in production )

Auth 

Earlier, our projects used routing-controllers, which exposed the @Authorized decorator automatically to link it to a guard function,  therefore this project also has a decorator created which essentially works the same

Role Based / Access Based Auth

@Role decorators and Access Guard allow this to happen easily with enums created and guard classes to bypass with verification or restrict


