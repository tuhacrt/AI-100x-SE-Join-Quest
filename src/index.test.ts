import { loadConfiguration, runCucumber } from "@cucumber/cucumber/api";

const { runConfiguration } = await loadConfiguration();
const { success } = await runCucumber(runConfiguration);

console.log(`Cucumber tests ${success ? "passed" : "failed"}`);


