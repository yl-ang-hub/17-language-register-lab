import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import List from "./List";
import { useQueryClient, useQuery } from "@tanstack/react-query";

const UserSearch = (props) => {
  const queryClient = useQueryClient();
  const [searchInput, setSearchInput] = useState("");
  const [searchUser, setSearchUser] = useState([]);
  const [results, setResults] = useState([]);

  // TODO: Debug
  // const handleSearch = async () => {
  //   const searchResults = props.data.filter((user) => {
  //     return user.name.toLowerCase() === searchInput.toLowerCase();
  //   });
  //   console.log(searchResults);
  //   if (searchResults.length !== 0) {
  //     queryLangForUser.mutate(searchResults[0].id);
  //     console.log(queryLangForUser.data);
  //     if (queryLangForUser.isSuccess) {
  //       setResults({
  //         id: searchResults[0].id,
  //         name: searchResults[0].name,
  //         age: searchResults[0].age,
  //         country: searchResults[0].country,
  //         languages: data,
  //       });
  //     }
  //   }
  //   console.log(results);
  // };

  useEffect(() => {
    props.queryLangForUser.mutate();
  }, [props.triggerUserLangUpdate]);

  return (
    <>
      {/* <p>{JSON.stringify(props.userLangData)}</p> */}
      <div className="mx-auto my-3">
        <Label htmlFor="searchUserInput">Search for an user</Label>
        <Input
          id="searchUserInput"
          className="col-span-2 h-8"
          value={searchInput}
          onChange={(event) => {
            setSearchInput(event.target.value);
          }}
        />
        <Button className="rounded" variant="outline">
          Search
        </Button>
        {results.length !== 0 && <List dataType="lang" data={results} />}
      </div>
      <div className="mx-auto my-3">
        <List
          dataType="userLang"
          data={props.userLangData}
          fetchUserLangData={props.fetchUserLangData}
          setTriggerUserLangUpdate={props.setTriggerUserLangUpdate}
        />
      </div>
    </>
  );
};

export default UserSearch;
