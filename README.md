# Personal experiment to get rid of NgRx

Check [this](https://github.com/r-park/soundcloud-ngrx) for original repo.


Quick Start
-----------

```shell
$ git clone https://github.com/r-park/soundcloud-ngrx.git
$ cd soundcloud-ngrx
$ npm install
$ npm start
```

To Do
-----

- Remove cache in memory.


NPM Commands
------------

|Command|Description|
|---|---|
|npm start|Start webpack development server @ **localhost:3000**|
|npm run build|Build production bundles to **./dist** directory; includes AOT compilation and tree-shaking|
|npm run server|Start express server @ **localhost:3000** to serve built artifacts from **./dist** directory|
|npm test|Lint and run tests; output coverage report to **./coverage**|
|npm run test:watch|Run tests; watch for changes to re-run tests|
