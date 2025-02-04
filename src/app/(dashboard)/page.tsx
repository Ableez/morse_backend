import { Button } from "#/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { api } from "#/trpc/server";

export default async function LearningPathsDashboard() {
  const learningPaths = await api.learning.getAllPaths();

  return (
    <div className="container mx-auto p-2 md:p-8">
      <div className="flex place-items-center justify-between gap-4 align-middle">
        <h1 className="mb-4 hidden text-2xl font-bold md:block">
          Learning Paths Dashboard
        </h1>

        <div className="mb-4 flex">
          <Link href={"/learning-paths/new"}>
            <Button className="border-2 border-b-4 border-green-600 bg-green-500 transition-all duration-200 ease-out hover:translate-y-[1px] hover:border-b-2 hover:bg-green-500 active:scale-[0.98]">
              Create Path
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {learningPaths?.map((path) => (
          <Link key={path.id} href={`/learning-paths/d/${path.id}`}>
            <div className="h-80 min-h-32 pb-6">
              <div className="h-full cursor-pointer overflow-clip rounded-3xl border-2 border-b-8 bg-white transition-all duration-300 ease-out hover:translate-y-1 hover:scale-[0.98] hover:border-b-2 active:translate-y-1 active:scale-[0.98] active:border-b-2">
                <div
                  style={{
                    backgroundColor: `${path.colorScheme?.s900}`,
                  }}
                  className={`flex w-full place-items-center justify-center pt-8 align-middle`}
                >
                  <Image
                    alt={"Path image"}
                    src={path.imageUrl!}
                    width={130}
                    height={130}
                  />
                </div>

                <div className="flex min-h-24 flex-col justify-start px-4 py-4">
                  <span
                    style={
                      {
                        // color: `${path.colorSchemes[0]?.s500}`,
                      }
                    }
                    className="text-xs font-medium"
                  >
                    {path.levels?.length} LEVELS
                  </span>
                  <h4 className={"text-[18px] font-bold text-black"}>
                    {path.title}
                  </h4>
                  <p className={"mt-1 text-[13px] text-black/60"}>
                    {path.description}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
