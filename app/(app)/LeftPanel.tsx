"use client"

import React, {useMemo} from 'react';
import styles from './LeftPanel.module.css';
import {
  Sidebar,
  SidebarContent, SidebarFooter,
  SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import {AlignJustify, Heart, XIcon} from "lucide-react";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {usePathname} from "next/navigation";
import SocialLinks from "@/components/ui/SocialLinks";
import {cn} from "@/lib/utils";
import SidebarCustomMenuItem from "@/app/(app)/SidebarCustomMenuItem";
import SmartLink from "@/components/ui/SmartLink";
import ImageLightbox from "@/components/ui/ImageLightbox";
import type {TModel as CoreModel} from "@/configuration/core";
import type {TModel as LeftPanelModel} from "@/configuration/leftPanel";
import type {TModel as QuickLinksModel} from "@/configuration/quickLinks";

class LeftPanelItem {
  label: string;
  icon: string;
  url: string;
  show: boolean;
  target?: string
  items?: LeftPanelItem[];
}

const getMenuItems = (
  allowedMenus: string[]
) => [
  {
    label: "Home",
    icon: 'House',
    url: '/',
    show: allowedMenus.includes('home')
  },
  {
    label: "About",
    icon: 'User',
    url: '/about',
    show: allowedMenus.includes('about')
  },
  {
    label: 'My Journey',
    icon: 'Milestone',
    url: '/journey',
    show: allowedMenus.includes('journey')
  },
  {
    label: 'Projects',
    icon: 'FolderOpenDot',
    url: '/projects',
    show: allowedMenus.includes('projects')
  },
  {
    label: 'Skills',
    icon: 'Brain',
    url: '/skills',
    show: allowedMenus.includes('skills')
  },
  {
    label: 'Services',
    icon: 'BriefcaseBusiness',
    url: '/services',
    show: allowedMenus.includes('services')
  },
  {
    label: 'Testimonials',
    icon: 'MessageCircleMore',
    url: '/testimonials',
    show: allowedMenus.includes('testimonials')
  },
  {
    label: 'Gallery',
    icon: 'Images',
    url: '/gallery',
    show: allowedMenus.includes('gallery')
  },
  {
    label: 'Blogs',
    icon: 'NotebookPen',
    url: '/blogs',
    show: allowedMenus.includes('blogs')
  }
] as LeftPanelItem[]

function LeftPanel({
  coreConfig,
  leftPanelConfig,
  quickLinksConfig,
}: {
  coreConfig: CoreModel;
  leftPanelConfig: LeftPanelModel;
  quickLinksConfig: QuickLinksModel;
}) {
  const pathname = usePathname();
  const {open} = useSidebar();

  const menuItems = useMemo(
    () => getMenuItems(leftPanelConfig.enabledMenus),
    [leftPanelConfig.enabledMenus]
  );

  return (<>
    {!open && <SidebarTrigger variant={"outline"} className={styles.openButton} aria-label="Open navigation">
      <AlignJustify aria-hidden="true"/>
    </SidebarTrigger>}

    <Sidebar>
      <SidebarHeader>
        {(leftPanelConfig.profilePicture || coreConfig.fullName) && <div className={styles.avatarBlock}>
          {leftPanelConfig.profilePicture ? (
            <ImageLightbox
              src={leftPanelConfig.profilePicture}
              name={`${coreConfig.fullName}`}
              trigger={
                <div className="flex justify-center">
                  <Avatar className={styles.avatar}>
                    <AvatarImage src={leftPanelConfig.profilePicture} alt={coreConfig.fullName} style={{objectFit: 'cover'}}/>
                  </Avatar>
                </div>
              }
            />
          ) : (
            <Avatar className={styles.avatar}>
              <AvatarFallback>
                {coreConfig
                  .fullName
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')
                }
              </AvatarFallback>
            </Avatar>
          )}
        </div>}

        <SidebarTrigger className={styles.closeButton} variant={"outline"} aria-label="Close navigation">
          <XIcon aria-hidden="true"/>
        </SidebarTrigger>

        <SocialLinks links={leftPanelConfig.socials}/>
      </SidebarHeader>

      <SidebarContent>
        {/* actual nav menus*/}
        {menuItems.filter((item) => item.show).length > 0 &&
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.filter((item) => item.show).map((item, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      render={<SidebarCustomMenuItem
                        label={item.label}
                        link={item.url}
                        icon={item.icon}
                        show={item.show}
                        currentPath={pathname}
                      />}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        }

        {/* quick links */}
        {leftPanelConfig.enabledMenus.includes('quickLinks') &&
          quickLinksConfig?.links?.length &&
          quickLinksConfig?.links?.length > 0 &&
          <SidebarGroup>
            <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {quickLinksConfig.links.map((link, index) => (
                  <SidebarMenuItem key={index}>
                    <SidebarMenuButton
                      render={<SidebarCustomMenuItem
                        label={link.title}
                        link={link.link}
                        icon={link.icon}
                      />}
                    />
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        }
      </SidebarContent>

      <SidebarFooter className={cn(styles.footer, "text-secondary-foreground")}>
        &copy; {(new Date()).getFullYear()} Created using <SmartLink href={"https://github.com/nightmaregaurav/portfolio"} target={"_blank"}>Portfolio</SmartLink>.
        Provided with <Heart className={"inline"} size={14} aria-hidden="true"/> by <SmartLink href={"https://www.gauravnyaupane.com.np/"} target={"_blank"}>Gaurav Nyaupane</SmartLink>.
      </SidebarFooter>
    </Sidebar>
  </>);
}

export default LeftPanel;
