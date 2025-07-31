import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PopoverComp = (props) => {
  const [openPopover, setOpenPopover] = useState(false);
  const langInputRef = useRef("");
  const nameInputRef = useRef("");
  const ageInputRef = useRef("");
  const countryInputRef = useRef("");

  const handleLangSubmit = () => {
    props.onSubmit(langInputRef.current);
    langInputRef.current = "";
    setOpenPopover(false);
  };

  const handleUserSubmit = () => {
    if (props.editUser) {
      props.onSubmit([
        props.id,
        nameInputRef.current,
        ageInputRef.current,
        countryInputRef.current,
      ]);
    } else {
      props.onSubmit([
        nameInputRef.current,
        ageInputRef.current,
        countryInputRef.current,
      ]);
    }
    nameInputRef.current = "";
    ageInputRef.current = "";
    countryInputRef.current = "";
    setOpenPopover(false);
  };

  const setRefVals = (user) => {
    nameInputRef.current = user[0].name;
    ageInputRef.current = user[0].age;
    countryInputRef.current = user[0].country;
  };

  const changeRefVal = (type, val) => {
    if (type === "name") {
      nameInputRef.current = val;
    } else if (type === "age") {
      ageInputRef.current = val;
    } else if (type === "country") {
      countryInputRef.current = val;
    }
  };

  return (
    <div className="flex my-3">
      <Popover
        open={openPopover}
        onOpenChange={() => setOpenPopover((prevState) => !prevState)}
      >
        <PopoverTrigger asChild>
          <Button className="mx-auto" variant="default">
            {props.openButtonTitle}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none">{props.title}</h4>
            </div>
            <div className="grid gap-2">
              {props.dataType === "lang" && (
                <div className="grid grid-cols-3 items-center gap-4">
                  <Label htmlFor="langName">Name</Label>
                  <Input
                    id="langName"
                    className="col-span-2 h-8"
                    ref={langInputRef}
                  />
                </div>
              )}
              {props.editUser
                ? setRefVals(props.data.filter((user) => user.id == props.id))
                : ""}
              {props.dataType === "users" && (
                <>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="userName">Name</Label>
                    <Input
                      id="userName"
                      className="col-span-2 h-8"
                      defaultValue={nameInputRef.current}
                      onChange={(event) =>
                        changeRefVal("name", event.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="userAge">Age</Label>
                    <Input
                      id="userAge"
                      className="col-span-2 h-8"
                      defaultValue={ageInputRef.current}
                      onChange={(event) =>
                        changeRefVal("age", event.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-3 items-center gap-4">
                    <Label htmlFor="userCountry">Country</Label>
                    <Input
                      id="userCountry"
                      className="col-span-2 h-8"
                      defaultValue={countryInputRef.current}
                      onChange={(event) =>
                        changeRefVal("country", event.target.value)
                      }
                    />
                  </div>
                </>
              )}
            </div>
            <div className="grid gap-2">
              {props.dataType === "lang" && (
                <Button variant="outline" onClick={handleLangSubmit}>
                  Submit
                </Button>
              )}
              {props.dataType === "users" && (
                <Button variant="outline" onClick={handleUserSubmit}>
                  Submit
                </Button>
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PopoverComp;
