import type {Metadata} from "next";
import type {ReactNode} from "react";

export const metadata: Metadata = {
  title: "Website setup",
  alternates: {
    canonical: "/setup/",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SetupLayout({children}: {children: ReactNode}) {
  return children;
}
