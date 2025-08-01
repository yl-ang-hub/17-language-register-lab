import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import PopoverComp from "./PopoverComp";
import { useEffect, useState } from "react";

const List = (props) => {
  const [searchInput, setSearchInput] = useState("");

  const changeData = async (url, args, refetchFn) => {
    try {
      const res = await fetch(import.meta.env.VITE_SERVER + url, args);
      if (!res.ok) {
        throw new Error("Request error");
      }
      const data = await res.json();
      refetchFn();
    } catch (error) {
      console.log(error);
    }
  };

  const addLang = (langName) => {
    const url = "/lab/languages/";
    const args = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: langName,
      }),
    };
    changeData(url, args, props.refetchFn);
  };

  const deleteLang = (langName) => {
    const url = "/lab/languages/" + langName;
    const args = {
      method: "DELETE",
    };
    console.log(props.refetchFn);
    changeData(url, args, props.refetchFn);
  };

  const addUser = ([name, age, country]) => {
    const url = "/lab/users/";
    const args = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        age: parseInt(age),
        country: country,
      }),
    };
    changeData(url, args, props.refetchFn);
  };

  const editUser = ([id, name, age, country]) => {
    const url = "/lab/users/";
    const args = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(id),
        name: name,
        age: parseInt(age),
        country: country,
      }),
    };
    changeData(url, args, props.refetchFn);
  };

  const handleEditUser = async ([id, name, age, country, languages]) => {
    // check for the lang differences
    const prevUserLang = props.userLangData.filter((user) => user.id == id);
    console.log(languages, prevUserLang);
    if (languages.length !== 0) {
      languages.forEach((lang) => {
        if (
          prevUserLang[0].language.find((item) => item === lang) === undefined
        ) {
          addUserLang(id, lang);
        } else {
          deleteUserLang(id, lang);
        }
      });
    }
    // edit user
    editUser([id, name, age, country]);
  };

  const addUserLang = (id, lang) => {
    const url = "/lab/users/languages";
    const args = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(id),
        language: lang,
      }),
    };
    changeData(url, args, () => {
      fetchUserLangData();
      props.refetchFn();
    });
  };

  const deleteUserLang = (id, lang) => {
    const url = "/lab/users/languages";
    const args = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(id),
        language: lang,
      }),
    };
    changeData(url, args, () => {
      fetchUserLangData();
      props.refetchFn();
    });
  };

  const deleteUser = (id) => {
    const url = "/lab/users/";
    const args = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(id),
      }),
    };
    console.log(id, url, args, props.refetchFn);
    changeData(url, args, props.refetchFn);
  };

  const returnUserLangString = (id) => {
    const result = props.userLangData.find((user) => user.id == id);
    if (result === undefined || result.length === 0) {
      return "";
    } else {
      return result.language.join(", ");
    }
  };

  const handleSearch = () => {
    const searchResults = props.data.filter((user) => {
      return user.name.toLowerCase().includes(searchInput.toLowerCase());
    });
    console.log(searchResults);
    if (searchResults.length !== 0) {
      return searchResults;
    }
    return null;
  };

  const fetchUserLangData = () => {
    const fetchUserLang = async (id) => {
      try {
        const res = await fetch(
          import.meta.env.VITE_SERVER + "/lab/users/languages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: parseInt(id),
            }),
          }
        );
        if (!res.ok) {
          throw new Error("Request error");
        }
        const data = await res.json();
        props.setUserLangData((prevState) => {
          let foundUser = false;
          const newState = [...prevState];
          prevState.map((item) => {
            const newItem = structuredClone(item);
            if (item.id == id) {
              newItem.language = data;
              foundUser = true;
            }
            return newItem;
          });
          if (!foundUser) {
            const newItem = { id, language: data };
            newState.push(newItem);
          }
          return newState;
        });
        return data;
      } catch (error) {
        console.log(error);
      }
    };

    if (props.dataType === "users") {
      props.data.forEach((user) => {
        fetchUserLang(user.id);
      });
    }
  };

  useEffect(() => {
    fetchUserLangData();
  }, []);

  return (
    <>
      {props.dataType === "users" && (
        <div className="mx-auto my-2">
          <Label className="text-lg my-1" htmlFor="searchUserInput">
            Search for an user
          </Label>
          <Input
            id="searchUserInput"
            className="col-span-2 h-8 my-1"
            value={searchInput}
            onChange={(event) => {
              setSearchInput(event.target.value);
            }}
          />
          <Button className="my-2 rounded" variant="outline">
            Search
          </Button>
        </div>
      )}
      <Table className="my-3">
        {/* <TableCaption>A list of all the languages</TableCaption> */}
        <TableHeader className="text-[18px]">
          <TableRow>
            {/* Display Header Row for Table of Languages */}
            {props.dataType === "lang" && (
              <>
                <TableHead className="w-[200px]">Language</TableHead>
                <TableHead className="text-right">Date of Creation</TableHead>
              </>
            )}
            {/* Display Header Row for Table of Users */}
            {props.dataType === "users" && (
              <>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="w-[60px]">Age</TableHead>
                <TableHead className="w-[100px]">Country</TableHead>
                <TableHead className="text-right">Languages</TableHead>
              </>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/* Display Table of Languages */}
          {props.dataType === "lang" &&
            props.data.map((datum, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium">{datum.language}</TableCell>
                <TableCell>{datum["created_at"]}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    onClick={() => deleteLang(datum.language)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {/* Display Table of Users WITHOUT Search */}
          {props.dataType === "users" &&
            searchInput === "" &&
            props.data.map((datum) => (
              <TableRow key={datum.id} id={datum.id}>
                <TableCell className="font-medium">{datum.name}</TableCell>
                <TableCell>{datum.age}</TableCell>
                <TableCell>{datum.country}</TableCell>
                <TableCell>{returnUserLangString(datum.id)}</TableCell>
                <TableCell>
                  {/* Edit User Button & Popover */}
                  {
                    <PopoverComp
                      data={props.data}
                      id={datum.id}
                      dataType={props.dataType}
                      langData={props.langData}
                      userLang={returnUserLangString(datum.id)}
                      editUser={true}
                      onSubmit={handleEditUser}
                      openButtonTitle="Edit"
                      title="Edit User"
                    />
                  }
                </TableCell>
                <TableCell>
                  {/* Delete User Button & Popover */}
                  <Button
                    variant="destructive"
                    onClick={() => deleteUser(datum.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          {/* Display Table of Users WITH Search */}
          {props.dataType === "users" &&
            searchInput !== "" &&
            handleSearch() !== null &&
            handleSearch().map((datum) => (
              <TableRow key={datum.id} id={datum.id}>
                <TableCell className="font-medium">{datum.name}</TableCell>
                <TableCell>{datum.age}</TableCell>
                <TableCell>{datum.country}</TableCell>
                <TableCell>{returnUserLangString(datum.id)}</TableCell>
                <TableCell>
                  {/* Edit User Button & Popover */}
                  {
                    <PopoverComp
                      data={props.data}
                      id={datum.id}
                      dataType={props.dataType}
                      langData={props.langData}
                      userLang={returnUserLangString(datum.id)}
                      editUser={true}
                      onSubmit={handleEditUser}
                      openButtonTitle="Edit"
                      title="Edit User"
                    />
                  }
                </TableCell>
                <TableCell>
                  {/* Delete User Button & Popover */}
                  <Button
                    variant="destructive"
                    onClick={() => deleteUser(datum.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      {/* Add New Lang Submit Button & Popover */}
      {props.dataType === "lang" && (
        <PopoverComp
          data={props.data}
          dataType={props.dataType}
          editUser={false}
          onSubmit={addLang}
          openButtonTitle="Add New Language"
          title="New Language"
        ></PopoverComp>
      )}
      {/* Add New User Submit Button & Popover */}
      {props.dataType === "users" && (
        <PopoverComp
          data={props.data}
          dataType={props.dataType}
          langData={props.langData}
          editUser={false}
          onSubmit={addUser}
          openButtonTitle="Add New User"
          title="New User"
        ></PopoverComp>
      )}
    </>
  );
};

export default List;
