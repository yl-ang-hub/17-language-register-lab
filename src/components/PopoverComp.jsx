import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const PopoverComp = (props) => {
  const [openPopover, setOpenPopover] = useState(false);
  const langInputRef = useRef();
  const nameInputRef = useRef();
  const ageInputRef = useRef();
  const countryInputRef = useRef();
  const [langCheckboxes, setLangCheckboxes] = useState({});

  const handleLangSubmit = () => {
    console.log(langInputRef.current.value);
    props.onSubmit(langInputRef.current.value);
    langInputRef.current.value = "";
    setOpenPopover(false);
  };

  const handleUserSubmit = (event) => {
    console.log(langCheckboxes);
    if (props.editUser) {
      props.onSubmit([
        props.id,
        nameInputRef.current,
        ageInputRef.current,
        countryInputRef.current,
        Object.keys(langCheckboxes).filter(
          (key) => langCheckboxes[key] === true
        ),
      ]);
    } else {
      props.onSubmit([
        nameInputRef.current,
        ageInputRef.current,
        countryInputRef.current,
        Object.keys(langCheckboxes).filter(
          (key) => langCheckboxes[key] === true
        ),
      ]);
    }
    nameInputRef.current = "";
    ageInputRef.current = "";
    countryInputRef.current = "";
    setOpenPopover(false);
    setLangCheckRefVal(props.langData, props.userLang);
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

  const setLangCheckRefVal = (langData, userLang) => {
    const langDict = {};
    langData.forEach((lang) => {
      const key = lang.language;
      const val = userLang
        ? userLang.split(", ").some((item) => item === lang)
        : false;
      langDict[key] = val;
    });
    setLangCheckboxes(langDict);
  };

  useEffect(() => {
    if (props.dataType === "users") {
      setLangCheckRefVal(props.langData, props.userLang);
    }
  }, [openPopover]);

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
          <ScrollArea className="h-[280px] w-full">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="leading-none">{props.title}</h4>
              </div>
              <div className="grid gap-2">
                {/* Popover Fields for Language Only */}
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
                {/* Popover Fields for User View */}
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
                    {props.editUser && (
                      <div className="flex flex-col gap-6">
                        <Label>Languages</Label>
                        {props.langData.map((item, idx) => {
                          return (
                            <div className="flex wrap" key={idx}>
                              <div className="flex items-start gap-2">
                                <Checkbox
                                  id={`${item.language}`}
                                  defaultChecked={props.userLang
                                    .split(", ")
                                    .some((str) => str === item.language)}
                                  onCheckedChange={() => {
                                    setLangCheckboxes((prevState) => {
                                      const newState = { ...prevState };
                                      newState[item.language] =
                                        !newState[item.language];
                                      return newState;
                                    });
                                  }}
                                />
                                <div className="grid gap-2">
                                  <Label htmlFor={`${item.language}`}>
                                    {item.language}
                                  </Label>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
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
          </ScrollArea>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default PopoverComp;
