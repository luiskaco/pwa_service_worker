### NOTIFICACIONES PUSH 

#### web push

```npm install web-push --save```

[Enlace](https://www.npmjs.com/package/web-push)

Nota: Nos permite generar rapido vapikeys 

Nota: al Generar una nueva vapid todos los usuarios suscrito dejan de funcionar

Nota: La vapid keys por lo general se genera una sola vez

##### Configurasr vapidkey cuando se necesite dentro del package json

###### Definiendolo en comando

```generate-vapid":"./node_modules/web-push/src/cli.js```

###### Convieriendolo en json

```"generate-vapid":"node ./node_modules/web-push/src/cli.js generate-vapid-keys --json "```

###### Guardandolo en un fichero
```"generate-vapid":"node ./node_modules/web-push/src/cli.js generate-vapid-keys --json > server/vapid.json"```


#### obsertvacion

##### Para que nodemon ignore

##### pasamos  ```--ignore 'server/*.json'```

##### Quedando asi:

 ```"dev": "node ./node_modules/nodemon/bin/nodemon.js server/server --ignore 'server/*.json' ",```


#### urlsafe-base64

```npm install urlsafe-base64```

https://www.npmjs.com/package/urlsafe-base64

Nota: usado para recrear codigo del objeto windows en node


#### paqiete web push 

``` npm install web-push --save ```


nota: usado para enviar notificaciones


#### PATRONES DE NOTIFICACION

[Enlace](https://web.dev/push-notifications-display-a-notification/)

##### Patrones de vibration navigator

[Enlace](https://gearside.com/custom-vibration-patterns-mobile-devices/)

# Notas:

Este es un pequeño servidor de express listo para ejecutarse y servir la carpeta public en la web.

Recuerden que deben de reconstruir los módulos de node con el comando

```
npm install
```

Luego, para correr en producción
```
npm start
```

Para correr en desarrollo
```
npm run dev
```
