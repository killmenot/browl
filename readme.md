# browl

[![Build Status](https://travis-ci.org/killmenot/browl.svg?branch=master)](https://travis-ci.org/killmenot/browl) [![Coverage Status](https://coveralls.io/repos/github/killmenot/browl/badge.svg?branch=master)](https://coveralls.io/github/killmenot/browl?branch=master) [![Dependency Status](https://david-dm.org/killmenot/browl.svg)](https://david-dm.org/killmenot/browl) [![npm version](https://img.shields.io/npm/v/browl.svg)](https://www.npmjs.com/package/browl)

A remote server automation and deployment tool written on Node.js


## Table of content

1. [Usage](#usage)
2. [CLI](#cli)
3. [API](#api)
4. [License](#license)


## Usage

### Simple deploy example
```js
const browl = require('browl');
browl('repo', 'branch', options);
```

### Bulk deploy example
```js
const browl = require('browl').bulk;
browl.bulk('repo', ['master', 'develop'], options);
```

### Options
#### list
Display a list of deployed instances
#### delete
Delete the instance
#### start
Start the instance(s)
#### stop
Stop the instance(s)
#### restart
Restart the instance(s)
#### startall
Start all instances
#### stopall
Stop all instances
#### restartall
Restart all instances
#### all
Allows the command to be applied for all branches in the repo
#### force
Allows some commands to run in forced mode


## CLI
```
$ npm install -g browl
```

```
$ browl --help

Usage: browl <command> [options]

Commands:
  browl list        Display a list of deployed instances.
  browl deploy      Deploy the instance(s).
  browl delete      Delete deployed instance(s).
  browl start       Start a deployed instance(s).
  browl startall    Start all deployed instances.
  browl stop        stop a deployed instance(s).
  browl stopall     Stop all deployed instances.
  browl restart     Restart a deployed instance(s).
  browl restartall  Restart all deployed instances.

Options:
  --help, -h     Show help                                                                             [boolean]
  --version, -v  Show version number                                                                   [boolean]

Examples:
  browl deploy --repo foo --branch bar            Deploy the instance.
  browl deploy --repo foo --branch bar baz quux   Deploy multiple instances.
  browl delete --repo foo --branch bar            Delete deployed instance.
  browl delete --repo foo --branch bar baz quux   Delete multiple instances.
  browl delete --repo foo --all                   Delete all deployed instances for repo.
  browl list                                      Display a list of deployed instances.
  browl start --repo foo --branch bar             Start a deployed instance.
  browl start --repo foo --branch bar baz quux    Start multiple deployed instances.
  browl start --repo foo --all                    Start all deployed instances for repo.
  browl startall                                  Start all deployed instances.
  browl stop --repo foo --branch bar              Stop a deployed instance.
  browl stop --repo foo --branch bar baz quux     Stop multiple deployed instances.
  browl stop --repo foo --all                     Stop all deployed instances for repo.
  browl stopall                                   Stop all deployed instances.
  browl restart --repo foo --branch bar           Restart a deployed instance.
  browl restart --repo foo --branch bar baz quux  Restart multiple deployed instances.
  browl restart --repo foo --all                  Restart all deployed instances for repo.
  browl restartall                                Restart all deployed instances.
```


## API

### deploy(repo, branch, [options])
#### repo
*Required*  
Type: `string`
The repository to deploy.

#### branch
*Required*  
Type: `string`
The branch to deploy.

#### options
##### delete
Type: `boolean`  
Default: `false`
Configures the deploy process to delete the instance.

##### list
Type: `boolean`  
Default: `false`
Output all deployed instances.

##### start
Type: `boolean`  
Default: `false`
Configures the deploy process to start the instance

##### stop
Type: `boolean`  
Default: `false`
Configures the deploy process to stop the instance

##### restart
Type: `boolean`  
Default: `false`
Configures the deploy process to restart the instance

##### startall
Type: `boolean`  
Default: `false`
Configures the deploy process to start all managed instances

##### stopall
Type: `boolean`  
Default: `false`
Configures the deploy process to stop all managed instances

##### restartall
Type: `boolean`  
Default: `false`
Configures the deploy process to restart all managed instances

##### force
Type: `boolean`  
Default: `false`
Configures the deploy process to run some commands in forced mode.

##### all
Type: `boolean`  
Default: `false`
Configures the deploy process to a command for all branches in the repo. `branch` is optional parameter in this mode.


### deployBulk(repo, branches, [options])
#### repo
*Required*  
Type: `string`
The repository to deploy.

#### branches 
Type: `array`
The branches to deploy.

#### options
##### delete
Type: `boolean`  
Default: `false`
Configures the deploy process to delete multiple instances.

##### start
Type: `boolean`  
Default: `false`
Configures the deploy process to start multiple instances

##### stop
Type: `boolean`  
Default: `false`
Configures the deploy process to stop multiple instances

##### restart
Type: `boolean`  
Default: `false`
Configures the deploy process to restart multiple instances

##### force
Type: `boolean`  
Default: `false`
Configures the deploy process to run some commands in forced mode.


## License

    The MIT License (MIT)

    Copyright (c) Alexey Kucherenko

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

