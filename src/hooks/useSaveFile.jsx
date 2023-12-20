import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import axios from "axios";
const saveFile = async ({formData}) => {
    const file = formData.get('file')
    const filepath = file.name
    console.log('filepath from saveFile ', filepath)
    console.log('formData from saveFile', formData)
    const { data } = await axios.post(`https://localhost:8443/api/saveFile/${filepath}`, formData)
    return data
}

export const useSaveFile = (filepath, refetch) => {
    const queryClient = useQueryClient()
    const { error, mutate, isSuccess } = useMutation({mutationFn: saveFile,
        onSuccess: () => {
           // await refetch()  
       //    return queryClient.invalidateQueries(['files', projectid])
            return queryClient.invalidateQueries(['file']);
          //  return queryClient.invalidateQueries({ 
            //    queryKey: ['file', filepath],
              // refetchType: 'all', 
               //refetchInactive: true
            //}, { throwOnError: true }, { cancelRefetch: true })
       //     return queryClient.resetQueries(['file', filepath])
    //   try {
      //      const data = await queryClient.fetchQuery({
        ///        queryKey: ['file', filepath],
           //     queryFn: async () => {
                    
             //       const { data } = await axios.get(`https://127.0.0.1:8443/api/getFile/${filepath}`);
               //     return data
                //},
            //});
            //console.log('dataaa: ', data) 
    //}
      //  onSettled: async () => {
        //    await queryClient.refetchQueries({ queryKey: ['file', filepath] },
          //  { refetchType: 'all' },
            //{ throwOnError: true },
            //{ cancelRefetch: true })
            //console.log('query data from onSettled: ', queryClient.getQueryData(['file', filepath]))
        //}
    //})
    ///console.log('data from promise : ', data)
 } })
    if (error)
        console.log(error)
    if (isSuccess){
        console.log('query data from saveFIle: ', queryClient.getQueryData([filepath]))
    }
    return { mutate }
}