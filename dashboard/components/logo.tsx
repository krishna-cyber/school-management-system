import { cn } from "@/lib/utils"

export const Logo = ({ className, ...props }: React.ComponentProps<"img">) => {
  return (
    <img
      alt="logo"
      className={cn("size-7", className)}
      src="https://i.pinimg.com/736x/15/00/69/150069d985bcf709e4c280f3f2bfff25.jpg"
      {...props}
    />
  )
}
