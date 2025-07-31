import { useQueryClient, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import List from "./components/List";

function App() {
  const queryClient = useQueryClient();

  // TODO: Add React Router

  const fetchData = async (url) => {
    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Request error");
      }
      return await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  const queryLang = useQuery({
    queryKey: ["qLang"],
    queryFn: () => fetchData(import.meta.env.VITE_SERVER + "/lab/languages"),
  });

  const queryUsers = useQuery({
    queryKey: ["qUsers"],
    queryFn: () => fetchData(import.meta.env.VITE_SERVER + "/lab/users"),
  });

  return (
    <div className="container mx-auto">
      <div className="mx-auto my-3 text-center">
        <h1>Language Register</h1>
      </div>
      <div className="mx-auto">
        <div>
          <Tabs defaultValue="navbar" className="w-[500px] mx-auto my-3">
            <TabsList className="mx-auto mt-2 mb-3">
              <TabsTrigger value="langs">All Languages</TabsTrigger>
              <TabsTrigger value="users">All Users</TabsTrigger>
              <TabsTrigger value="uSearch">User Search</TabsTrigger>
            </TabsList>
            <TabsContent value="langs">
              {queryLang.isPending && <p>Loading...</p>}
              {queryLang.isError && <p>{queryLang.error.message}</p>}
              {queryLang.isSuccess && (
                <List dataType="lang" data={queryLang.data} />
              )}
            </TabsContent>
            <TabsContent value="users">
              {queryUsers.isSuccess && (
                <List dataType="users" data={queryUsers.data} />
              )}
            </TabsContent>
            <TabsContent value="uSearch">
              Have a search bar, button and table to show language for user.
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default App;
