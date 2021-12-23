# jest-environment-steps

Jest Environment to run the tests as Steps

[![Publish](https://github.com/sodaru/jest-environment-steps/actions/workflows/publish.to.npm.yml/badge.svg)](https://github.com/sodaru/jest-environment-steps/actions/workflows/publish.to.npm.yml)

> npm i [jest-environment-steps](http://www.npmjs.com/package/jest-environment-steps)

## Overview

In [Jest](https://jestjs.io/), all `test`s with in a `describe` block run sequentially in the order of their appearance.
But <u>**if a tests fails , the next tests continue to execute**</u>.

For writing tests for a behaviour where each test depends on success of previous test, this built-in feature may cause unnecessory tests to run

_Example of behaviour tests._

Testing a CRUD apis on a database. Writing test for Create, Read, Update and Delete in the same sequence makes the it sense to test all apis in same order. and if Create fails , there is no pointing testing if the read , update and delete

This library provides a jest [environment](https://jestjs.io/docs/configuration#testenvironment-string) to add new features to the way the tests are executed

Inspired from [Mocha Steps](https://github.com/rprieto/mocha-steps)

## Features

- Runs all previous tests, before running the current test
- Skip all next tests , if current test fails

## Install

```SH
npm i jest-environment-steps
```

## Usage

1. Set `testEnvironment` in jest.config.js to enable Steps for all tests

   ```JS
   // jest.config.js
   {
       "testEnvironment": "steps"
   }
   ```

2. use docBlock to enable Steps for a specific file

   ```JS
   /**
   * @jest-environment steps
   */

   describe("Tests in this describe runs as steps", () => {
       ...
   })
   ```

For more configuration on using environment in jest refer [Jest Config Doc](https://jestjs.io/docs/configuration#testenvironment-string)

## Assumptions

- This Enables Steps on top of `node` environment only
-

## Support

This project is a part of Open Source Intitiative from [Sodaru Technologies](https://sodaru.com)

Write an email to opensource@sodaru.com for queries on this project
