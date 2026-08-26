import Image from "next/image";
import { UserRound } from "lucide-react";
import type { CastMember } from "@/types/movie";

export default function CastList({ cast }: { cast: CastMember[] }) {
  if (cast.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold text-white">Cast</h2>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-2">
        {cast.map((member) => (
          <div key={member.id} className="w-28 shrink-0">
            <div className="relative aspect-square w-28 overflow-hidden rounded-full bg-neutral-800">
              {member.profileUrl ? (
                <Image
                  src={member.profileUrl}
                  alt={member.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-neutral-500">
                  <UserRound size={32} aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="mt-2 truncate text-center text-xs font-medium text-white">
              {member.name}
            </p>
            <p className="truncate text-center text-xs text-neutral-400">
              {member.character}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
