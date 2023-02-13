import NodeEnvironment from "jest-environment-node";
import { Circus } from "@jest/types";

const getTestAbsoluteName = (test: Circus.TestEntry) => {
  const names: string[] = [];
  let parentBlock: Circus.DescribeBlock | Circus.TestEntry | undefined = test;
  while (parentBlock) {
    names.unshift(parentBlock.name);
    parentBlock = parentBlock.parent;
  }

  return names.join(" ");
};

const getTestEntryMap = (state: Circus.State) => {
  const testEntryMap: Record<string, Circus.TestEntry> = {};
  const updateMap = (
    node: Circus.DescribeBlock | Circus.TestEntry,
    parentName: string
  ) => {
    if (node.type == "test") {
      testEntryMap[[parentName, node.name].join(" ")] = node;
    } else {
      for (const child of node.children) {
        updateMap(child, [parentName, node.name].join(" ").trim());
      }
    }
  };
  updateMap(state.rootDescribeBlock, "");
  return testEntryMap;
};

const resolveTestPattern = (
  pattern: string,
  testEntryMap: Record<string, Circus.TestEntry>
) => {
  const testEntryNames = Object.keys(testEntryMap);
  testEntryNames.reverse();
  let testAbsoluteName: string = "";
  for (const testEntryName of testEntryNames) {
    if (testEntryName.startsWith(`ROOT_DESCRIBE_BLOCK ${pattern}`.trim())) {
      testAbsoluteName = testEntryName;
      break;
    }
  }
  return testAbsoluteName;
};

export default class StepEnvironment extends NodeEnvironment {
  async handleTestEvent(event: Circus.AsyncEvent, state: Circus.State) {
    const skipFutureTests = (
      testOrPattern: string | Circus.TestEntry,
      state: Circus.State
    ) => {
      const testEntryMap = getTestEntryMap(state);

      const absoluteName =
        typeof testOrPattern == "string"
          ? resolveTestPattern(testOrPattern, testEntryMap)
          : getTestAbsoluteName(testOrPattern);

      let i = 0;
      const absoluteNames = Object.keys(testEntryMap);

      for (; i < absoluteNames.length; i++) {
        if (absoluteNames[i] == absoluteName) {
          i++;
          break;
        }
      }
      for (; i < absoluteNames.length; i++) {
        testEntryMap[absoluteNames[i]].mode = "skip";
      }
    };

    if (event.name == "run_start") {
      const testNamePatternStr = state.testNamePattern
        ? state.testNamePattern.toString()
        : "//i";
      const testNamePattern = testNamePatternStr.substring(
        1,
        testNamePatternStr.length - 2
      );
      // reset the testNamePattern, so that all tests are eligible to run
      state.testNamePattern = undefined;

      // skip the tests that appears after the pattern
      skipFutureTests(testNamePattern, state);
    }

    //skip future tests if current test failed
    if (event.name == "test_fn_failure") {
      skipFutureTests(event.test, state);
    }
  }
}
