import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

async function main() {
  try {
    // Add your GitHub app logic here
    console.log("GitHub App started");
  } catch (error) {
    console.error("Error:", error);
  }
}

main();
