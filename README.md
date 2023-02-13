# jest-environment-steps

Jest Environment to run the tests as Steps

[![Publish](https://github.com/sodaru/jest-environment-steps/actions/workflows/publish.to.npm.yml/badge.svg)](https://github.com/sodaru/jest-environment-steps/actions/workflows/publish.to.npm.yml)

> npm i [jest-environment-steps](http://www.npmjs.com/package/jest-environment-steps)

## Overview

In [Jest](https://jestjs.io/), all `test`s within a test file run sequentially in the order of their appearance.
But <u>**if a test fails, the next tests continue to execute**</u>.

For writing tests for a behavior, where each test depends on the success of the previous test, this built-in feature may cause unnecessary tests to run when a test fails.

### Examples of behavior tests

- Testing the CRUD APIs on a database.  
   Writing the tests for Create, Read, Update, and Delete in the same sequence make it sense to test all APIs in the same order. When Create fails, there is no point in running tests for Read, Update, and Delete APIs

This library provides a [jest environment](https://jestjs.io/docs/configuration#testenvironment-string) to add new features to the way the tests are executed.

Inspired by [Mocha Steps](https://github.com/rprieto/mocha-steps)

## Features

- Runs all previous tests, before running the selected test when the [testNamePattern](https://jestjs.io/docs/cli#--testnamepatternregex) argument is provided.
- Skip all next tests, if a test fails

## Install

```SH
npm i jest-environment-steps
```

## Usage

An environment in jest can be applied using either of the below options.

1. Set `testEnvironment` in jest.config.js to enable Steps for all tests

   ```javascript
   // jest.config.js
   {
       "testEnvironment": "steps"
   }
   ```

2. Use the docBlock to enable Steps for a specific file

   ```JS
   /**
   * @jest-environment steps
   */

   describe("Tests in this describe runs as steps", () => {
       ...
   })
   ```

For more configuration on using the environment in jest refer to [Jest Config Doc](https://jestjs.io/docs/configuration#testenvironment-string)

## Assumptions

- This Enables Steps on top of the [node](https://jestjs.io/docs/configuration#testenvironment-string) environment only

## Support

This project is a part of the Open Source Initiative from [Sodaru Technologies](https://sodaru.com)

Write an email to opensource@sodaru.com for queries on this project
