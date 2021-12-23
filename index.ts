import NodeEnvironment from "jest-environment-node";

export default class StepEnvironment extends NodeEnvironment {
  async handleTestEvent(event, state) {
    const skipFutureTests = (testName, describeBlockName, state) => {
      let foundSelectedTest = false;
      state.currentDescribeBlock.children.forEach(describeBlock => {
        if (describeBlock.name == describeBlockName) {
          describeBlock.tests.forEach(test => {
            if (!foundSelectedTest) {
              if (test.name == testName) {
                foundSelectedTest = true;
              }
            } else {
              test.mode = "skip";
            }
          });
        }
      });
    };

    if (
      event.name == "run_describe_start" &&
      event.describeBlock.tests.length > 0
    ) {
      const testNamePattern = state.testNamePattern
        ? state.testNamePattern.toString()
        : "//i";
      const testNamePatternStr = testNamePattern.substring(
        1,
        testNamePattern.length - 2
      );
      const describeBlockName = event.describeBlock.name;
      if (
        testNamePatternStr.startsWith(describeBlockName) &&
        testNamePatternStr.length > describeBlockName.length
      ) {
        // testNamePattern starts with this describe name , and has more to it
        // meaning trying to run a specific test

        // reset the namePattern only to describeBlock name
        state.testNamePattern = new RegExp(describeBlockName, "i");

        // skip all future tests
        const testName = testNamePatternStr
          .substring(describeBlockName.length)
          .trim();

        skipFutureTests(testName, describeBlockName, state);
      }
    }

    //skip future tests if current test failed
    if (event.name == "test_fn_failure") {
      skipFutureTests(event.test.name, event.test.parent.name, state);
    }
  }
}
