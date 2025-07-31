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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";

const List = (props) => {
  const queryClient = useQueryClient();
  const newLangInputRef = useRef();
  const newUserNameInputRef = useRef();
  const newUserAgeInputRef = useRef();
  const newUserCountryInputRef = useRef();
  const [editUserNameInput, setEditUserNameInput] = useState("");
  const [editUserAgeInput, setEditUserAgeInput] = useState("");
  const [editUserCountryInput, setEditUserCountryInput] = useState("");
  const [openLangPopover, setOpenLangPopover] = useState(false);
  const [openUserPopover, setOpenUserPopover] = useState(false);
  const [openEditUserPopover, setOpenEditUserPopover] = useState(false);

  const addLang = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(
          import.meta.env.VITE_SERVER + "/lab/languages/",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              language: newLangInputRef.current.value,
            }),
          }
        );
        if (!res.ok) {
          throw new Error("Request error - language not deleted");
        }
        newLangInputRef.current.value = "";
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qLang"] });
      setOpenLangPopover(false);
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
    mutationFn: async () => {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newUserNameInputRef.current.value,
            age: newUserAgeInputRef.current.value,
            country: newUserCountryInputRef.current.value,
          }),
        });
        if (!res.ok) {
          throw new Error("Request error - user not added");
        }
        newUserNameInputRef.current.value = "";
        newUserAgeInputRef.current.value = "";
        newUserCountryInputRef.current.value = "";
        return await res.json();
      } catch (error) {
        console.log(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["qUsers"] });
      setOpenUserPopover(false);
    },
  });

  const editUser = useMutation({
    mutationFn: async (id) => {
      try {
        const res = await fetch(import.meta.env.VITE_SERVER + "/lab/users/", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: parseInt(id),
            name: editUserNameInput,
            age: parseInt(editUserAgeInput),
            country: editUserCountryInput,
          }),
        });
        if (!res.ok) {
          throw new Error("Request error - user information not changed");
        }
        setEditUserNameInput("");
        setEditUserAgeInput("");
        setEditUserCountryInput("");
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
          {props.dataType === "users" &&
            props.data.map((datum) => (
              <TableRow key={datum.id} id={datum.id}>
                <TableCell className="font-medium">{datum.name}</TableCell>
                <TableCell>{datum.age}</TableCell>
                <TableCell>{datum.country}</TableCell>
                <TableCell>
                  {/* User edit button & Popover */}
                  {/*
                    <div className="flex my-3">
                      <Popover
                        open={openEditUserPopover}
                        onOpenChange={setOpenEditUserPopover(
                          (prevState) => !prevState
                        )}
                      >
                        <PopoverTrigger asChild>
                          <Button className="mx-auto" variant="default">
                            Edit user
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                          <div className="grid gap-4">
                            <div className="space-y-2">
                              <h4 className="leading-none">Edit user</h4>
                            </div>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="userName">Name</Label>
                                <Input
                                  id="userName"
                                  className="col-span-2 h-8"
                                  defaultValue={datum.name}
                                  onChange={(event) =>
                                    setEditUserNameInput(event.target.value)
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="userAge">Age</Label>
                                <Input
                                  id="userAge"
                                  className="col-span-2 h-8"
                                  defaultValue={datum.age}
                                  onChange={(event) =>
                                    setEditUserAgeInput(event.target.value)
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-3 items-center gap-4">
                                <Label htmlFor="userCountry">Country</Label>
                                <Input
                                  id="userCountry"
                                  className="col-span-2 h-8"
                                  defaultValue={datum.country}
                                  onChange={(event) =>
                                    setEditUserCountryInput(event.target.value)
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid gap-2">
                              <Button
                                variant="outline"
                                onClick={editUser.mutate}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  */}
                </TableCell>
                <TableCell>
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
      {props.dataType === "lang" && (
        <div className="flex my-3">
          <Popover
            open={openLangPopover}
            onOpenChange={() => setOpenLangPopover((prevState) => !prevState)}
          >
            <PopoverTrigger asChild>
              <Button className="mx-auto" variant="default">
                Add new language
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none">New Language</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="langName">Name</Label>
                    <Input
                      id="langName"
                      className="col-span-2 h-8"
                      ref={newLangInputRef}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button variant="outline" onClick={addLang.mutate}>
                    Add
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
      {props.dataType === "users" && (
        <div className="flex my-3">
          <Popover
            open={openUserPopover}
            onOpenChange={() => setOpenUserPopover((prevState) => !prevState)}
          >
            <PopoverTrigger asChild>
              <Button className="mx-auto" variant="default">
                Add new user
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="leading-none">New User</h4>
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="userName">Name</Label>
                    <Input
                      id="userName"
                      className="col-span-2 h-8"
                      ref={newUserNameInputRef}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="userAge">Age</Label>
                    <Input
                      id="userAge"
                      className="col-span-2 h-8"
                      ref={newUserAgeInputRef}
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="userCountry">Country</Label>
                    <Input
                      id="userCountry"
                      className="col-span-2 h-8"
                      ref={newUserCountryInputRef}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Button variant="outline" onClick={addUser.mutate}>
                    Add
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )}
    </>
  );
};

export default List;
