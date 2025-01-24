export type TextType = "bold" | "default" | "caption";
export type ElementType =
  | "text"
  | "image"
  | "expression"
  | "options"
  | "carousel";

export type ContentElement =
  | {
      id: string;
      type: "text";
      variant: TextType;
      content: string;
      bottomSpace?: number;
      topSpace?: number;
      width: "fill" | "hug";
      align: "left" | "center" | "right" | "justify";
    }
  | {
      id: string;
      type: "image";
      uri: string;
      size?: "small" | "tall" | "large" | "full";
      height?: number;
      width: "fill" | "hug";
      align: "left" | "center" | "right";
      bottomSpace?: number;
      topSpace?: number;
    }
  | {
      id: string;
      type: "expression";
      latex: string;
      displayMode?: "inline" | "block";
      width: "fill" | "hug";
      align: "left" | "center" | "right";
      bottomSpace?: number;
      topSpace?: number;
    }
  | {
      id: string;
      type: "options";
      choices: string[];
      correctAnswer: number;
      why?: ContentElement[];
      width: "fill" | "hug";
      align: "left" | "center" | "right";
      bottomSpace?: number;
      topSpace?: number;
    }
  | {
      id: string;
      type: "carousel";
      images: string[];
      arr: boolean;
      showDots: boolean;
      width: "fill" | "hug";
      align: "left" | "center" | "right";
      bottomSpace?: number;
      topSpace?: number;
    };

export type CardContentType = {
  id: string;
  elements: ContentElement[] | null;
  title?: string;
  index: number;
  type: "info" | "qa";
};

export type CardContents = CardContentType & { viewed: boolean }[];

// export const cardContent: CardContentType[] = [
//   {
//     id: "lesson-1-card-1",
//     index: 1,
//     type: "info",
//     elements: [
//       {
//         id: "d3a7f08e",
//         type: "text",
//         content: "Seeing Solutions",
//         variant: "bold",
//       },
//       {
//         id: "6ffd9f23",
//         type: "text",
//         content:
//           "Equations are used to relate quantities. Sometimes, there's more than one value that can vary.",
//         variant: "default",
//       },
//       {
//         id: "562bf36e",
//         type: "text",
//         content: "We can visualize the equation",
//         variant: "default",
//         bottomSpace: 0,
//       },
//       {
//         id: "56e60aad",
//         type: "expression",
//         latex: "x = \\frac{1}{2}",
//         displayMode: "block",
//       },
//       {
//         id: "3877a051",
//         type: "text",
//         content:
//           "by drawing two bar models. The equation tells us that the two bars are equal, so they should have the same length.",
//         variant: "default",
//         topSpace: 6,
//       },
//       {
//         id: "d8c26417",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ek0WeNBoq9FwpAxBP1unXgNMcCeLbOSJlVWdo",
//         size: "full",
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-2",
//     index: 2,
//     type: "qa",
//     elements: [
//       {
//         id: "ba44d80d",
//         type: "expression",
//         latex: "\\text{What is x?}",
//         displayMode: "block",
//       },
//       {
//         id: "dbbc1140",
//         type: "expression",
//         latex: "\\text{If }{y = 2}\\text{ in the equation }{2y + 5 = x + 5}",
//         displayMode: "block",
//       },
//       {
//         id: "137ef3d6",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ek0WeNBoq9FwpAxBP1unXgNMcCeLbOSJlVWdo",
//       },
//       {
//         id: "e9f3f029",
//         type: "options",
//         choices: ["x = 1", "x = 2", "x = 3", "x = 4"],
//         correctAnswer: 3,
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-6",
//     index: 3,
//     type: "info",
//     elements: [
//       {
//         id: "36ef7469",
//         type: "text",
//         content:
//           "A solution to a two-variable equation is a pair of values that makes the equation true.",
//         variant: "default",
//       },
//       {
//         id: "c5263140",
//         type: "text",
//         content: "There are multiple solutions to the equation:",
//         variant: "default",
//         bottomSpace: 0,
//       },
//       { id: "f6188291", type: "expression", latex: "{2y + 5 = x + 5}" },
//       {
//         id: "cf4929a1",
//         type: "text",
//         content: "We can find at least three:",
//         variant: "default",
//       },
//       {
//         id: "11b72be8",
//         type: "carousel",
//         arr: true,
//         images: [
//           "https://utfs.io/f/wGHSFKxTYo2epivQPostVq30h8U7Xb6ZPnwMSrkiExoNuRjT",
//           "https://utfs.io/f/wGHSFKxTYo2eVxD21henR487aEVXgQZGtMIvj5oHNueC0scJ",
//           "https://utfs.io/f/wGHSFKxTYo2enyyjiW42Hev178sr9kRZ6205EBnYdpclV3Tq",
//         ],
//         showDots: true,
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 4,
//     type: "qa",
//     elements: [
//       {
//         id: "32cce9b2",
//         type: "text",
//         content:
//           "Multiple solutions can be displayed in a table of values. Each row in a table represents one solution pair of values.",
//         variant: "default",
//       },
//       {
//         id: "143178aa",
//         type: "text",
//         content: "Select the table that represents the solutions we found to",
//         variant: "default",
//       },
//       { id: "4d917b0e", type: "expression", latex: "{2y + 5 = x + 5}" },
//       {
//         id: "30ccc53c",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eeXW5eGUnYoWUbMR0nKjAJOVXtTcsLSDqQCwa",
//       },
//       {
//         id: "714ef7f7",
//         type: "options",
//         choices: ["a", "b"],
//         correctAnswer: 0,
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 5,
//     type: "qa",
//     elements: [
//       {
//         id: "34ca6447",
//         type: "text",
//         content: "Let's find another solution to this equation.",
//         variant: "default",
//       },
//       {
//         id: "946bb7c2",
//         type: "text",
//         content:
//           "Enter the value of x that makes this equation true when y = 4",
//         variant: "default",
//       },
//       { id: "3bf24244", type: "expression", latex: "{2y + 5 = x + 5}" },
//       {
//         id: "07b883c7",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eeXL73bvnYoWUbMR0nKjAJOVXtTcsLSDqQCwa",
//       },
//       {
//         id: "7ef0fb3f",
//         type: "options",
//         choices: ["x = 8", "x = 2", "x = 6"],
//         correctAnswer: 0,
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 6,
//     type: "qa",
//     elements: [
//       {
//         id: "926248c9",
//         type: "text",
//         content:
//           "Now let's find another solution, this time for a specific value of x.",
//         variant: "default",
//       },
//       {
//         id: "def1906c",
//         type: "text",
//         content:
//           "Enter the value of x that makes this equation true when y = 10",
//         variant: "default",
//       },
//       { id: "ba14681d", type: "expression", latex: "{2y + 5 = x + 5}" },
//       {
//         id: "99fee410",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2euM7W5aPChv1zUsDinaPFk7Beml9HfpbGxQXC",
//         size: "tall",
//         width: 100,
//         height: 140,
//       },
//       {
//         id: "f2373a72",
//         type: "options",
//         choices: ["x = 8", "x = 2", "x = 6"],
//         correctAnswer: 0,
//       },
//     ],
//   },
// ];

// const prealgebraFindingUnknownsCards: CardContentType[] = [
//   {
//     id: "lesson-1-card-1",
//     index: 1,
//     type: "info",
//     elements: [
//       {
//         type: "image",
//         id: "d3a7f08e",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eppugknstVq30h8U7Xb6ZPnwMSrkiExoNuRjT",
//       },
//       {
//         type: "text",
//         content: "Finding Unknowns",
//         id: "6ffd9f23",
//         variant: "bold",
//         bottomSpace: 12,
//       },
//       {
//         type: "text",
//         content:
//           "You already know how to find unknown values — let's prove it.",
//         id: "562bf36e",
//         variant: "default",
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-2",
//     index: 2,
//     type: "qa",
//     elements: [
//       {
//         id: "56e60aad",
//         type: "text",
//         content: "The scale shows the weight of the items.",
//         variant: "default",
//       },
//       {
//         id: "3877a051",
//         type: "text",
//         content: "What's the weight of 1 square?",
//         variant: "default",
//       },
//       {
//         id: "d8c26417",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ehSGnL9u9xJvOjY6qRSzuULr1I3ydHKXeiFQN",
//       },
//       {
//         id: "f2373a72",
//         type: "options",
//         choices: ["4", "8", "10", "12"],
//         correctAnswer: 2,
//         why: [
//           {
//             type: "image",
//             id: "f2373a72-why-image",
//             uri: "https://utfs.io/f/wGHSFKxTYo2eyh8oWBPkbinVMBWj4s9dPDNSCcrJoIY0gupm",
//           },
//           {
//             id: "f2373a72-why",
//             type: "text",
//             content:
//               "Because five squares have a weight of 40 , a single square must weigh a fifth of that total weight.",
//             variant: "default",
//           },
//           {
//             id: "f2373a72-why-2",
//             type: "expression",
//             latex: "{40 \\over 5} = 8",
//             displayMode: "inline",
//           },
//           {
//             id: "f2373a72-why-3",
//             type: "text",
//             content: "So the weight of one square is 8.",
//             variant: "default",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-3",
//     index: 3,
//     type: "qa",
//     elements: [
//       {
//         type: "text",
//         id: "ba44d80d",
//         content: "What is weight of 1 triangle?",
//         variant: "default",
//       },
//       {
//         id: "dbbc1140",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eyIzJaKkbinVMBWj4s9dPDNSCcrJoIY0gupmG",
//       },
//       {
//         id: "137ef3d6",
//         type: "options",
//         choices: ["10", "15", "20", "25"],
//         correctAnswer: 3,
//         why: [
//           {
//             id: "137ef3d6-why-image",
//             type: "image",
//             uri: "https://utfs.io/f/wGHSFKxTYo2eENlUtRw8BoOUActDsXiKSzyGW2fe0QawgYLN",
//           },
//           {
//             id: "137ef3d6-why",
//             type: "text",
//             content: `If we subtract the stone's weight 10 from the reading on the scale, we can see that 2 triangles weigh 60 − 10 = 50 together`,
//             variant: "default",
//           },
//           {
//             id: "137ef3d6-why-2",
//             type: "text",
//             content: `So, we can find the weight of one triangle by dividing 50 by 2:`,
//             variant: "default",
//           },
//           {
//             id: "137ef3d6-why-3",
//             type: "expression",
//             latex: "{50 \\over 2} = 25",
//             displayMode: "inline",
//           },
//           {
//             id: "137ef3d6-why-4",
//             type: "text",
//             content: `So the weight of one triangle is 25.`,
//             variant: "default",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-4",
//     index: 4,
//     type: "info",
//     elements: [
//       {
//         id: "e9f3f029",
//         type: "text",
//         content:
//           "You found the weights of the unknown shapes by thinking about their relationship to known weights.",
//         variant: "default",
//       },
//       {
//         id: "e9f3f029",
//         type: "text",
//         content: "Now we'll try finding multiple unknowns at the same time.",
//         variant: "default",
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-5",
//     index: 5,
//     type: "qa",
//     elements: [
//       {
//         id: "e9f3f029",
//         type: "text",
//         content: `First, what's the weight of 1 square?`,
//         variant: "default",
//       },
//       {
//         id: "e9f3f029",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ecS4TN2glzuhpB3OdxIZnkRoLa9QAHy7bSF0J",
//       },
//       {
//         id: "e9f3f029",
//         type: "options",
//         choices: ["3", "5", "5", "9"],
//         correctAnswer: 0,
//         why: [
//           {
//             id: "e9f3f029-why-image",
//             type: "image",
//             uri: "https://utfs.io/f/wGHSFKxTYo2eclm2LpglzuhpB3OdxIZnkRoLa9QAHy7bSF0J",
//           },
//           {
//             id: "e9f3f029-why",
//             type: "text",
//             content: `If we subtract the stone's weight 10 from the reading on the scale, we can see that 2 squares weigh 16 − 10 = 6 together`,
//             variant: "default",
//           },
//           {
//             id: "e9f3f029-why-2",
//             type: "text",
//             content: `
//             So, we can find the weight of one square by dividing 6 by 2:`,
//             variant: "default",
//           },
//           {
//             id: "e9f3f029-why-3",
//             type: "expression",
//             latex: "{6 \\over 2} = 3",
//           },
//           {
//             id: "e9f3f029-why-4",
//             variant: "default",
//             type: "text",
//             content: `and each square weighs 3.`,
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 6,
//     type: "qa",
//     elements: [
//       {
//         id: "32cce9b2",
//         type: "text",
//         content: `Now can you find the weight of 1 circle?`,
//         variant: "default",
//       },
//       {
//         id: "143178aa",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eTKf8psq67DqfRuXFhoLHZPw1piNAxYlrK9Ge",
//       },
//       {
//         id: "143178aa",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ekUawHcoq9FwpAxBP1unXgNMcCeLbOSJlVWdo",
//       },
//       {
//         type: "options",
//         id: "946bb7c2",
//         choices: ["3", "5", "7", "9"],
//         correctAnswer: 0,
//         why: [
//           {
//             id: "946bb7c2-why-image",
//             uri: "https://utfs.io/f/wGHSFKxTYo2erFVRO53WQNCq9K2htlySGifT3MoLaePkYAcB",
//             type: "image",
//           },
//           {
//             id: "946bb7c2-why",
//             type: "text",
//             content: `We already found a square weighs 3 from the left-hand scale.`,
//             variant: "default",
//           },
//           {
//             id: "946bb7c2-why",
//             type: "text",
//             content: `To find the circle, we can subtract the stone's weight 4 and the square's weight from the reading on the right-hand scale:`,
//             variant: "default",
//           },
//           {
//             id: "926248c9-why-2",
//             type: "expression",
//             latex: "{14 - 4 - 3} = {7}",
//           },
//           {
//             id: "ed9f23-why-3",
//             type: "text",
//             content: `So the weight of one circle is 7.`,
//             variant: "default",
//           },
//         ],
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 7,
//     type: "info",
//     elements: [
//       {
//         id: "926248c9",
//         type: "text",
//         content: `When there are multiple unknowns, first pin down one value — in this case, the square — then use it to find the other.`,
//         variant: "default",
//       },
//       {
//         id: "def1906c",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eRR3KevJyuGiFdea2YtlVjTNx7vmUkP80JKbI",
//       },
//       {
//         id: "def1906c",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2efiiU1RjtSG6FYKrCO8gZBAQHcxTvbq15JdM2",
//       },
//       {
//         id: "137ef3d6",
//         type: "text",
//         content: `Later in this course, you'll use equations to quickly figure out tricky situations with many unknowns.`,
//         variant: "default",
//       },
//     ],
//   },
// ];

// const prealgebraPracticeFindingUnknownsCards: CardContentType[] = [
//   {
//     id: "lesson-1-card-1",
//     index: 1,
//     type: "qa",
//     elements: [
//       {
//         id: "d3a7f08e",
//         type: "text",
//         content: `What's the weight of one circle?`,
//         variant: "bold",
//       },
//       {
//         id: "d3a7f08e",
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ewhjCJuxTYo2ezVpkbt37nPSHJ9vDQUrijamM",
//       },
//       {
//         id: "d3a7f08e",
//         type: "options",
//         choices: ["2", "4", "6", "8"],
//         correctAnswer: 1,
//         why: [
//           {
//             id: "d3a7f08e-why-image",
//             type: "image",
//             uri: "https://utfs.io/f/wGHSFKxTYo2elu7j0gbJYmevBPfIdTkZtEisRAxuMSy21n9L",
//           },
//           {
//             id: "d3a7f08e-why",
//             type: "expression",
//             latex: `{28 \\over 7} = 4`,
//           },
//           {
//             id: "d3a7f08e-why",
//             type: "text",
//             content: `Since the total weight of 7 circles is 28, the weight of one circle is 4.`,
//             variant: "default",
//           },
//         ],
//       },
//     ],
//   },
// ];

const generateUID = (): string => {
  //This is a placeholder, for a production environment use a proper UUID library
  return Math.random().toString(16).substring(2, 10);
};

// export const log: CardContentType[] = [
//   {
//     id: "lesson-1-card-1",
//     index: 1,
//     type: "info",
//     elements: [
//       {
//         id: generateUID(),
//         type: "text",
//         content: "Seeing Solutions",
//         variant: "bold",
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content:
//           "Equations are used to relate quantities. Sometimes, there's more than one value that can vary.",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content: "We can visualize the equation",
//         variant: "default",
//         bottomSpace: 0,
//       },
//       {
//         id: generateUID(),
//         type: "expression",
//         latex: "x = \\frac{1}{2}",
//         displayMode: "block",
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content:
//           "by drawing two bar models. The equation tells us that the two bars are equal, so they should have the same length.",
//         variant: "default",
//         topSpace: 6,
//       },
//       {
//         id: generateUID(),
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ek0WeNBoq9FwpAxBP1unXgNMcCeLbOSJlVWdo",
//         size: "full",
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-2",
//     index: 2,
//     type: "qa",
//     elements: [
//       {
//         id: generateUID(),
//         type: "expression",
//         latex: `\\text{What is x?}`,
//         displayMode: "block",
//       },
//       {
//         id: generateUID(),
//         type: "expression",
//         latex: `\\text{If }{y = 2}\\text{ in the equation }{2y + 5 = x + 5}`,
//         displayMode: "block",
//       },
//       {
//         id: generateUID(),
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2ek0WeNBoq9FwpAxBP1unXgNMcCeLbOSJlVWdo",
//       },
//       {
//         id: generateUID(),
//         type: "options",
//         choices: ["x = 1", "x = 2", "x = 3", "x = 4"],
//         correctAnswer: 3,
//       },
//     ],
//   },
//   {
//     id: "lesson-1-card-6",
//     index: 3,
//     type: "info",
//     elements: [
//       {
//         id: generateUID(),
//         type: "text",
//         content:
//           "A solution to a two-variable equation is a pair of values that makes the equation true.",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content: "There are multiple solutions to the equation:",
//         variant: "default",
//         bottomSpace: 0,
//       },
//       {
//         id: generateUID(),
//         type: "expression",
//         latex: `{2y + 5 = x + 5}`,
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content: "We can find at least three:",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "carousel",
//         arr: true,
//         images: [
//           "https://utfs.io/f/wGHSFKxTYo2epivQPostVq30h8U7Xb6ZPnwMSrkiExoNuRjT",
//           "https://utfs.io/f/wGHSFKxTYo2eVxD21henR487aEVXgQZGtMIvj5oHNueC0scJ",
//           "https://utfs.io/f/wGHSFKxTYo2enyyjiW42Hev178sr9kRZ6205EBnYdpclV3Tq",
//         ],
//         showDots: true,
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 4,
//     type: "qa",
//     elements: [
//       {
//         id: generateUID(),
//         type: "text",
//         content:
//           "Multiple solutions can be displayed in a table of values. Each row in a table represents one solution pair of values.",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content: "Select the table that represents the solutions we found to",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "expression",
//         latex: `{2y + 5 = x + 5}`,
//       },
//       {
//         id: generateUID(),
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eeXW5eGUnYoWUbMR0nKjAJOVXtTcsLSDqQCwa",
//       },
//       {
//         id: generateUID(),
//         type: "options",
//         choices: ["a", "b"],
//         correctAnswer: 0,
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 5,
//     type: "qa",
//     elements: [
//       {
//         id: generateUID(),
//         type: "text",
//         content: "Let's find another solution to this equation.",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content:
//           "Enter the value of x that makes this equation true when y = 4",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "expression",
//         latex: `{2y + 5 = x + 5}`,
//       },
//       {
//         id: generateUID(),
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2eeXL73bvnYoWUbMR0nKjAJOVXtTcsLSDqQCwa",
//       },
//       {
//         id: generateUID(),
//         type: "options",
//         choices: ["x = 8", "x = 2", "x = 6"],
//         correctAnswer: 0,
//       },
//     ],
//   },
//   {
//     id: "math-for-fun",
//     index: 6,
//     type: "qa",
//     elements: [
//       {
//         id: generateUID(),
//         type: "text",
//         content:
//           "Now let's find another solution, this time for a specific value of x.",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "text",
//         content:
//           "Enter the value of x that makes this equation true when y = 10",
//         variant: "default",
//       },
//       {
//         id: generateUID(),
//         type: "expression",
//         latex: `{2y + 5 = x + 5}`,
//       },
//       {
//         id: generateUID(),
//         type: "image",
//         uri: "https://utfs.io/f/wGHSFKxTYo2euM7W5aPChv1zUsDinaPFk7Beml9HfpbGxQXC",
//         size: "tall",
//         width: 100,
//         height: 140,
//       },
//       {
//         id: generateUID(),
//         type: "options",
//         choices: ["x = 8", "x = 2", "x = 6"],
//         correctAnswer: 0,
//       },
//     ],
//   },
// ];
