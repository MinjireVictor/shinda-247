

// for data fetching

export const fetchDummyData=async()=>{

    try{
        const dummyData = await fetch("http://localhost:3005")
        const awaitedData=await dummyData.json()
        console.log("dummy data", awaitedData)
        return dummyData;
    }catch(error){
        console.log("error", error)
    }
  


}

