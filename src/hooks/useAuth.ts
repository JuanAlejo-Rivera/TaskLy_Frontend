import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/AuthAPI";


export const useAuth =  () =>{
    const {data, isError, isLoading} = useQuery({
            queryKey:['user'],
            queryFn: getUser,
            retry: 1,
            refetchOnWindowFocus: false,// no deja que se vuelva a llamar a la api cuando se vuelve a enfocar la ventana
    })

    return{data, isError, isLoading}
}