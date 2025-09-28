import { useEffect, useState } from "react";
import { GetUserNameValue } from "../localstorage/StoreUserName";

export const useGetUserName = () => {

  const [userNameValue, setUserName] = useState("");
  async function getUserNameLocalStorage() {
    const name = await GetUserNameValue()
    setUserName(FormatName(name))
  }
  function FormatName(name) {
    const nameArray = name.split(" ")
    name = nameArray[0]
    if (name.length >= 10) {
      return name.slice(0, 9) + ".."
    } else {
      return name
    }
  }


  useEffect(() => {
    getUserNameLocalStorage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return userNameValue;
};
