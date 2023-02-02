import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/future/functions/custom
 */
export const GreetingFunctionDefinition = DefineFunction({
  callback_id: "greeting_function",
  title: "Generate a greeting",
  description: "Generate a greeting",
  source_file: "functions/greeting_function.ts",
  input_parameters: {
    properties: {
      recipient: {
        type: Schema.slack.types.user_id,
        description: "Greeting recipient",
      },
      message: {
        type: Schema.types.string,
        description: "Message to the recipient",
      },
      /**
       * I have modified this function to accept a param that is type string w/ format constraint.
       * It can be either email or url
       *
       * Test:
       * 1. Change the format below to invalid string "banana". Manifest validation should fail
       * 2. Go to the workflows/greeting_workflow.ts and change the function step input value to "banana".
       *    You should get a parameter_validation error when you run the workflow
       */
      string_with_format: {
        type: Schema.types.string,
        description: "testing out the format property",
        format: "email",
      },
    },
    required: ["message"],
  },
  output_parameters: {
    properties: {
      greeting: {
        type: Schema.types.string,
        description: "Greeting for the recipient",
      },
    },
    required: ["greeting"],
  },
});

export default SlackFunction(
  GreetingFunctionDefinition,
  ({ inputs }) => {
    const { recipient, message, string_with_format } = inputs;
    const salutations = ["Hello", "Hi", "Howdy", "Hola", "Salut"];
    const salutation =
      salutations[Math.floor(Math.random() * salutations.length)];
    const greeting =
      `${salutation}, <@${recipient}>! :wave: Someone sent the following greeting: \n\n>${message} \n\n${string_with_format}`;
    return { outputs: { greeting } };
  },
);
