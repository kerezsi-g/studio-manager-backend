// import { api } from "encore.dev/api";
// import { database } from "../db";

// // interface Request {
// //   clientName: string;
// //   emailAddress: string;
// // }

// interface Response {
//   data: {
//     collectionId: string;
//     collectionName: string;
//     lastModified: Date;
//   }[];
// }

// export const createCollection = api<{}, Response>(
//   {
//     method: "POST",
//     path: "/collections",
//     expose: true,
//     auth: false,
//   },
//   async () => {
//     return {
//       data: [
//         {
//           collectionId: "test-collection",
//           collectionName: "Test Collection",
//           lastModified: new Date(),
//         },
//       ],
//     };
//   }
// );

// const SqlQuery = /*sql*/ `
// 	insert into t_collections(collection_name, client_uuid)
// `;
