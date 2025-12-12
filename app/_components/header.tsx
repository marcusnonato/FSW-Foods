"use client";

import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { pages } from "../_constants/pages";
import { Separator } from "./ui/separator";
import Search from "./search";

interface HeaderProps {
  withSearch?: boolean;
}

const Header = ({ withSearch }: HeaderProps) => {
  const { data } = useSession();

  const handleSignInClick = () => {
    signIn();
  };

  const handleSignOutClick = () => {
    signOut();
  };

  return (
    <div className="mx-auto flex max-w-[1224px] items-center justify-between max-xl:px-5 max-lg:w-full max-lg:pt-6 min-[1024px]:h-20">
      <Link href={"/"} className="relative h-[30px] w-[100px]">
        <Image src="/fsw-logo.png" alt="Fsw Food" fill quality={100} />
      </Link>

      {withSearch && (
        <div className="w-[600px]">
          <Search />
        </div>
      )}

      <Sheet>
        <SheetTrigger>
          <div className="center flex h-6 w-6 items-center border-none bg-transparent">
            <MenuIcon />
          </div>
        </SheetTrigger>
        <SheetContent className="max-lg:w-[80%]">
          <SheetHeader>
            <SheetTitle className="text-left">Menu</SheetTitle>
          </SheetHeader>

          {data?.user ? (
            <>
              <div className="flex items-center gap-3 pt-6">
                <Avatar>
                  <AvatarImage src={data.user.image || undefined} />
                  <AvatarFallback>
                    {data.user.name?.split(" ")[0][0]}
                    {data.user.name?.split(" ")[1][0]}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col">
                  <h3 className="font-semibold">{data.user.name}</h3>
                  <span className="block text-xs text-muted-foreground">
                    {data.user.email}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between pt-10">
                <h2 className="font-semibold">Faça seu login</h2>
                <Button size="icon" onClick={handleSignInClick}>
                  <LogInIcon />
                </Button>
              </div>
            </>
          )}

          <div className="py-6">
            <Separator className="bg-black/10" />
          </div>

          <div>
            {data?.user ? (
              pages.map((page) => (
                <Button
                  key={page.name}
                  variant="ghost"
                  className="w-full justify-start space-x-3 rounded-sm text-sm font-normal"
                  asChild
                >
                  <Link href={page.link}>
                    {page.icon}
                    <span className="block">{page.name}</span>
                  </Link>
                </Button>
              ))
            ) : (
              <Button
                key={pages[0].name}
                variant="ghost"
                className="w-full justify-start space-x-3 rounded-sm text-sm font-normal"
              >
                <Link href={pages[0].link} className="flex space-x-3">
                  {pages[0].icon}
                  <span className="block">{pages[0].name}</span>
                </Link>
              </Button>
            )}
          </div>

          <div className="py-6">
            <Separator className="bg-black/10" />
          </div>

          {data?.user && (
            <Button
              variant="ghost"
              className="w-full justify-start space-x-3 rounded-sm text-sm font-normal"
              onClick={handleSignOutClick}
            >
              <LogOutIcon size={16} />
              <span className="block">Sair da conta</span>
            </Button>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Header;
