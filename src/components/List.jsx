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
import { useMutation, useQueryClient } from "@tanstack/react-query";

const List = (props) => {
  const queryClient = useQueryClient();

  const addLang = useMutation({
    mutationFn: async (lang) => {
      try {
        const res = await fetch(
          import.meta.env.VITE_SERVER + "/lab/languages/",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              language: lang,
            }),
          }
        );
        if (!res.ok) {
          throw new Error("Request error - language not deleted");
        }
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qLang"] });
    },
  });

  const deleteLang = useMutation({
    mutationFn: async (lang) => {
      try {
        const res = await fetch(
          import.meta.env.VITE_SERVER + "/lab/languages/" + lang,
          {
            method: "DELETE",
          }
        );
        if (!res.ok) {
          throw new Error("Request error - language not deleted");
        }
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qLang"] });
    },
  });

  const addUser = useMutation({
    mutationFn: async ([name, age, country]) => {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name,
            age: parseInt(age),
            country: country,
          }),
        });
        if (!res.ok) {
          throw new Error("Request error - user not added");
        }
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qUsers"] });
    },
  });

  const editUser = useMutation({
    mutationFn: async ([id, name, age, country]) => {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users/", {
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
        });
        if (!res.ok) {
          throw new Error("Request error - user information not changed");
        }
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qUsers"] });
    },
  });

  const deleteUsers = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users/", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(id),
          }),
        });
        if (!res.ok) {
          throw new Error("Request error - user not deleted");
        }
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qUsers"] });
    },
  });

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
                    onClick={() => deleteLang.mutate(datum.language)}
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
                      onSubmit={editUser.mutate}
                      openButtonTitle="Edit"
                      title="Edit Users"
                    />
                  }
                </TableCell>
                <TableCell>
                  {/* Delete User Button & Popover */}
                  <Button
                    variant="destructive"
                    onClick={() => deleteUsers.mutate(datum.id)}
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
          onSubmit={addLang.mutate}
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
          onSubmit={addUser.mutate}
          openButtonTitle="Add New User"
          title="New User"
        ></PopoverComp>
      )}
    </>
  );
};

export default List;
