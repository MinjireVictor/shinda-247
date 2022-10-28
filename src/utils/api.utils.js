// for data fetching

export const fetchDummyData = async () => {
  try {
    const dummyData = await fetch("http://localhost:3005");
    const awaitedData = await dummyData.json();

    return dummyData;
  } catch (error) {}
};
