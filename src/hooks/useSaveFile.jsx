// import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
// import axios from "axios";
// const saveFile = async ({formData}) => {
//   try{
//     const file = formData.get('file')
//     const filepath = file.name
//     const response = await axios.post(`https://localhost:8443/api/saveFile/${filepath}`, formData, {
//       headers: { 'Content-Type': 'multipart/form-data' }
//     });
//     console.log('res : ', response.data);
//     return response.data
//   } catch (error) {
//     console.log('error : ', error);
//   }
  
//   //  await axios.post(`https://localhost:8443/api/saveFile/${filepath}`, {formData})
//     //.then(function (response) {
//       //  console.log('res : ', response);
//       //})
//      // .catch(function (error) {
//      //  console.log('error : ', error);
//       //});
//    // console.log(' data saved', data)
//    // return data
// }

// export const useSaveFile = (selectedFile) => {
//     const queryClient = useQueryClient()
//     console.log("beforeQueryClient: ", selectedFile);
//     const saveFileMutation = useMutation({mutationFn: saveFile,
//    // onMutate: async (response) => {
//     //  await queryClient.cancelQueries({queryKey: [selectedFile]}, {exact: true})
//     //  const previousData = queryClient.getQueryData([selectedFile])
//     //  queryClient.setQueryData([selectedFile], response)
//      // return { response }
//     //},
//     onSuccess: (data) => {
//       console.log("the data ", data)
//           // await refetch()  
//      console.log("useSaveFile: ",selectedFile)
//     // queryClient.setQueryData([selectedFile], data)
//  //    queryClient.invalidateQueries({ queryKey: [selectedFile] })
//           // return queryClient.invalidateQueries({ 
//             //    queryKey: ['file', filepath],
//               // refetchType: 'all', 
//                //refetchInactive: true
//             //}, { throwOnError: true }, { cancelRefetch: true })
//        //     return queryClient.resetQueries(['file', filepath])
//     //   try {
//       //      const data = await queryClient.fetchQuery({
//         ///        queryKey: ['file', filepath],
//            //     queryFn: async () => {
                    
//              //       const { data } = await axios.get(`https://127.0.0.1:8443/api/getFile/${filepath}`);
//                //     return data
//                 //},
//             //});
//             //console.log('dataaa: ', data) 
//     //}
//       //  onSettled: async () => {
//         //    await queryClient.refetchQueries({ queryKey: ['file', filepath] },
//           //  { refetchType: 'all' },
//             //{ throwOnError: true },
//             //{ cancelRefetch: true })
//             //console.log('query data from onSettled: ', queryClient.getQueryData(['file', filepath]))
//         //}
//     //})
//     }
//     ,
//     onError: async (error, variables) => {
//         console.log('error : ', error)
//         return await queryClient.invalidateQueries([selectedFile])
//     },
//    })
    
//     return { saveFileMutation }
// }