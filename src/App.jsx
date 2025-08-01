import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import List from "./components/List";
import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [lang, setLang] = useState([]);
  const [userLangData, setUserLangData] = useState([]);

  // TODO: Add React Router

  const fetchData = async (url, setStateFn) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Request error");
      }
      const data = await res.json();
      setStateFn(data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = () => {
    fetchData(import.meta.env.VITE_SERVER + "/lab/users", setUsers);
  };

  const fetchLang = () => {
    fetchData(import.meta.env.VITE_SERVER + "/lab/languages", setLang);
  };

  useEffect(() => {
    fetchUsers();
    fetchLang();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="mx-auto my-3 text-center">
        <h1>Language Register</h1>
      </div>
      <div className="mx-auto">
        <div>
          <Tabs defaultValue="navbar" className="w-[640px] mx-auto my-3">
            <TabsList className="mx-auto mt-2 mb-3">
              <TabsTrigger value="langs">Languages</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            <TabsContent value="langs">
              <List dataType="lang" data={lang} refetchFn={fetchLang} />
            </TabsContent>
            <TabsContent value="users">
              <List
                dataType="users"
                data={users}
                langData={lang}
                userLangData={userLangData}
                setUserLangData={setUserLangData}
                refetchFn={fetchUsers}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
