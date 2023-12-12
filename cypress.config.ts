// Import required modules and functions
import { defineConfig } from "cypress";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import {
  addCucumberPreprocessorPlugin,
  beforeRunHandler,
  afterRunHandler,
  beforeSpecHandler,
  afterSpecHandler,
} from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import { WebSocketServer } from 'ws';

// Define variables to store port and WebSocket server
let portToClose = undefined;
let websocketServer = undefined;

// Export Cypress configuration using defineConfig
export default defineConfig({
  // Configure the number of retries for test runs
  retries: {
    runMode: 2,
    openMode: 0,
  },
  
  // Configure e2e settings for Cypress
  e2e: {
    // Specify the pattern for feature files
    specPattern: "**/*.feature",
    
    // Define setupNodeEvents to handle various Cypress events
    async setupNodeEvents(on, config) {
      // Add Cucumber preprocessor plugin to handle Cucumber-specific tasks
      await addCucumberPreprocessorPlugin(on, config, {
        omitBeforeRunHandler: true,
        omitAfterRunHandler: true,
        omitBeforeSpecHandler: true,
        omitAfterSpecHandler: true,
        omitAfterScreenshotHandler: true,
      });

      // Handle "before:run" event
      on("before:run", async () => {
        await beforeRunHandler(config);
        // Your own `before:run` code goes here.
      });

      // Handle "after:run" event
      on("after:run", async () => {
        await afterRunHandler(config);
        // Your own `after:run` code goes here.
      });

      // Handle "before:spec" event
      on("before:spec", async (spec) => {
        await beforeSpecHandler(config, spec);
        // Your own `before:spec` code goes here.
      });

      // Handle "after:spec" event
      on("after:spec", async (spec, results) => {
        await afterSpecHandler(config, spec, results);
        // Your own `after:spec` code goes here.
      });

      // Configure file preprocessor using ESBuild
      on(
        "file:preprocessor",
        createBundler({
          plugins: [createEsbuildPlugin(config)],
        })
      );

      // Handle custom tasks using Cypress tasks
      on("task", {
        log(message) {
            console.log(message);
            return null;
        },
        async sendMessage(object: unknown) {
            console.log("object", object)
            // Send a WebSocket message
            websocketServer.send(JSON.stringify(object));
            return true;
        },

        async startSocket() {
            // Generate a random port and create a WebSocket server
            portToClose = Math.round(9999 * Math.random())
            console.log("portToClose", portToClose)
            const wss = new WebSocketServer({ port: portToClose });

            // Log received messages
            wss.on('message', function message(data) {
                console.log('received: %s', data);
            });

            // Handle WebSocket connection
            wss.on('connection', function connection(ws) {
                console.log("connected!")
                websocketServer = ws;
            });

            // Return the WebSocket URL
            return `ws://localhost:${portToClose}`;
        }
    });

      // Make sure to return the config object as it might have been modified by the plugin.
      return config;
    },
  },
});
