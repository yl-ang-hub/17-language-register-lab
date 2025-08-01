/**
 * WORKING COPY WITHOUT USER-LANG AND TANSTACK
 */

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
import { Button } from "@/components/ui/button";
import PopoverComp from "./PopoverComp";

const List = (props) => {
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

  const deleteUser = (id) => {
    const url = import.meta.env.VITE_SERVER + "/lab/users/";
    const args = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user_id: parseInt(id),
      }),
    };
    changeData(url, args, props.refetchFn);
  };

  return (
    <>
      <Table>
        {/* <TableCaption>A list of all the languages</TableCaption> */}
        <TableHeader>
          <TableRow>
            {props.dataType === "lang" && (
              <>
                <TableHead className="w-[100px]">Language</TableHead>
                <TableHead className="text-right">Date of Creation</TableHead>
              </>
            )}
            {props.dataType === "users" && (
              <>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="w-[60px]">Age</TableHead>
                <TableHead className="text-right">Country</TableHead>
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
          {/* Display Table of Users */}
          {props.dataType === "users" &&
            props.data.map((datum) => (
              <TableRow key={datum.id} id={datum.id}>
                <TableCell className="font-medium">{datum.name}</TableCell>
                <TableCell>{datum.age}</TableCell>
                <TableCell>{datum.country}</TableCell>
                <TableCell>
                  {/* Edit User Button & Popover */}
                  {
                    <PopoverComp
                      data={props.data}
                      id={datum.id}
                      dataType={props.dataType}
                      editUser={true}
                      onSubmit={editUser}
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
