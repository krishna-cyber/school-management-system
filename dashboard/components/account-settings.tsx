import UserGeneral from "@/components/blocks/account-setting/account-setting"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const tabs = [
  { name: "General", value: "general" },
  { name: "Preferences", value: "preferences" },
  { name: "Users", value: "users" },
]

const AccountSettings = () => {
  return (
    <div className="w-full py-8">
      <div className="mx-auto min-h-screen max-w-7xl px-4 sm:px-6 lg:px-8">
        <Tabs defaultValue="general" className="gap-4">
          <TabsList className="h-fit! w-full rounded-none border-b bg-transparent p-0 sm:justify-start">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none! sm:flex-0 dark:data-[state=active]:border-primary dark:data-[state=active]:bg-transparent"
              >
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mt-4">
          <UserGeneral />
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
