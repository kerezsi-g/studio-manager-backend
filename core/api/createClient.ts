// import { api } from "encore.dev/api";
// import { database } from "../db";

// // interface Request {
// //   clientName: string;
// //   emailAddress: string;
// // }

// interface Response {
//   data: {
//     projectId: string;
//     projectName: string;
//     lastModified: Date;
//   }[];
// }

// export const createProject = api<{}, Response>(
//   {
//     method: "POST",
//     path: "/projects",
//     expose: true,
//     auth: false,
//   },
//   async () => {
//     return {
//       data: [
//         {
//           projectId: "test-project",
//           projectName: "Test Project",
//           lastModified: new Date(),
//         },
//       ],
//     };
//   }
// );

// const SqlQuery = /*sql*/ `
// 	insert into t_projects(project_name, client_uuid)
// `;
