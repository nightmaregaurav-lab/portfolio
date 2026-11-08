"use client"

import React, {lazy, Suspense} from 'react';

import SmartLink from "@/components/ui/SmartLink";

type SimpleIconName =
  "SiFacebook"
  | "SiInstagram"
  | "SiX"
  | "SiYoutube"
  | "SiTiktok"
  | "SiThreads"
  | "SiBluesky"
  | "SiMastodon"
  | "SiReddit"
  | "SiPinterest"
  | "SiSnapchat"
  | "SiWhatsapp"
  | "SiTelegram"
  | "SiDiscord"
  | "SiMessenger"
  | "SiSignal"
  | "SiLine"
  | "SiWechat"
  | "SiGithub"
  | "SiGitlab"
  | "SiStackoverflow"
  | "SiDevdotto"
  | "SiCodeforces"
  | "SiHackerrank"
  | "SiHashnode"
  | "SiTwitch"
  | "SiKick"
  | "SiSpotify"
  | "SiSoundcloud"
  | "SiVimeo"
  | "SiBilibili"
  | "SiDribbble"
  | "SiBehance"
  | "SiFlickr"
  | "SiTumblr"
  | "SiPatreon"
  | "SiBuymeacoffee"
  | "SiKofi"
  | "SiMedium"
  | "SiQuora"
  | "SiGoodreads"
  | "SiLetterboxd"
  | "SiSteam"
  | "SiProducthunt"
  | "SiVk"
  | "SiDouban"
  | "SiZhihu"
  | "SiOdnoklassniki"
  | "SiGoogle"
  | "SiApple"
  | "SiGmail"
  | "SiRss"
  | "SiPaypal"
  | "SiApplepodcasts"
  | "SiArtstation"
  | "SiDailymotion"
  | "SiEtsy"
  | "SiGitbook"
  | "SiKaggle"
  | "SiLinktree"
  | "SiNotion"
  | "SiNpm"
  | "SiGooglecolab"
  | "SiHackclub"
  | "SiLeetcode"
  | "SiReplit"
  | "SiStackexchange";

const simpleIconLoaders: Record<SimpleIconName, () => Promise<{ default: React.ComponentType<{ size?: number }> }>> = {
  SiFacebook: () => import("@icons-pack/react-simple-icons/icons/SiFacebook"),
  SiInstagram: () => import("@icons-pack/react-simple-icons/icons/SiInstagram"),
  SiX: () => import("@icons-pack/react-simple-icons/icons/SiX"),
  SiYoutube: () => import("@icons-pack/react-simple-icons/icons/SiYoutube"),
  SiTiktok: () => import("@icons-pack/react-simple-icons/icons/SiTiktok"),
  SiThreads: () => import("@icons-pack/react-simple-icons/icons/SiThreads"),
  SiBluesky: () => import("@icons-pack/react-simple-icons/icons/SiBluesky"),
  SiMastodon: () => import("@icons-pack/react-simple-icons/icons/SiMastodon"),
  SiReddit: () => import("@icons-pack/react-simple-icons/icons/SiReddit"),
  SiPinterest: () => import("@icons-pack/react-simple-icons/icons/SiPinterest"),
  SiSnapchat: () => import("@icons-pack/react-simple-icons/icons/SiSnapchat"),
  SiWhatsapp: () => import("@icons-pack/react-simple-icons/icons/SiWhatsapp"),
  SiTelegram: () => import("@icons-pack/react-simple-icons/icons/SiTelegram"),
  SiDiscord: () => import("@icons-pack/react-simple-icons/icons/SiDiscord"),
  SiMessenger: () => import("@icons-pack/react-simple-icons/icons/SiMessenger"),
  SiSignal: () => import("@icons-pack/react-simple-icons/icons/SiSignal"),
  SiLine: () => import("@icons-pack/react-simple-icons/icons/SiLine"),
  SiWechat: () => import("@icons-pack/react-simple-icons/icons/SiWechat"),
  SiGithub: () => import("@icons-pack/react-simple-icons/icons/SiGithub"),
  SiGitlab: () => import("@icons-pack/react-simple-icons/icons/SiGitlab"),
  SiStackoverflow: () => import("@icons-pack/react-simple-icons/icons/SiStackoverflow"),
  SiDevdotto: () => import("@icons-pack/react-simple-icons/icons/SiDevdotto"),
  SiCodeforces: () => import("@icons-pack/react-simple-icons/icons/SiCodeforces"),
  SiHackerrank: () => import("@icons-pack/react-simple-icons/icons/SiHackerrank"),
  SiHashnode: () => import("@icons-pack/react-simple-icons/icons/SiHashnode"),
  SiTwitch: () => import("@icons-pack/react-simple-icons/icons/SiTwitch"),
  SiKick: () => import("@icons-pack/react-simple-icons/icons/SiKick"),
  SiSpotify: () => import("@icons-pack/react-simple-icons/icons/SiSpotify"),
  SiSoundcloud: () => import("@icons-pack/react-simple-icons/icons/SiSoundcloud"),
  SiVimeo: () => import("@icons-pack/react-simple-icons/icons/SiVimeo"),
  SiBilibili: () => import("@icons-pack/react-simple-icons/icons/SiBilibili"),
  SiDribbble: () => import("@icons-pack/react-simple-icons/icons/SiDribbble"),
  SiBehance: () => import("@icons-pack/react-simple-icons/icons/SiBehance"),
  SiFlickr: () => import("@icons-pack/react-simple-icons/icons/SiFlickr"),
  SiTumblr: () => import("@icons-pack/react-simple-icons/icons/SiTumblr"),
  SiPatreon: () => import("@icons-pack/react-simple-icons/icons/SiPatreon"),
  SiBuymeacoffee: () => import("@icons-pack/react-simple-icons/icons/SiBuymeacoffee"),
  SiKofi: () => import("@icons-pack/react-simple-icons/icons/SiKofi"),
  SiMedium: () => import("@icons-pack/react-simple-icons/icons/SiMedium"),
  SiQuora: () => import("@icons-pack/react-simple-icons/icons/SiQuora"),
  SiGoodreads: () => import("@icons-pack/react-simple-icons/icons/SiGoodreads"),
  SiLetterboxd: () => import("@icons-pack/react-simple-icons/icons/SiLetterboxd"),
  SiSteam: () => import("@icons-pack/react-simple-icons/icons/SiSteam"),
  SiProducthunt: () => import("@icons-pack/react-simple-icons/icons/SiProducthunt"),
  SiVk: () => import("@icons-pack/react-simple-icons/icons/SiVk"),
  SiDouban: () => import("@icons-pack/react-simple-icons/icons/SiDouban"),
  SiZhihu: () => import("@icons-pack/react-simple-icons/icons/SiZhihu"),
  SiOdnoklassniki: () => import("@icons-pack/react-simple-icons/icons/SiOdnoklassniki"),
  SiGoogle: () => import("@icons-pack/react-simple-icons/icons/SiGoogle"),
  SiApple: () => import("@icons-pack/react-simple-icons/icons/SiApple"),
  SiGmail: () => import("@icons-pack/react-simple-icons/icons/SiGmail"),
  SiRss: () => import("@icons-pack/react-simple-icons/icons/SiRss"),
  SiPaypal: () => import("@icons-pack/react-simple-icons/icons/SiPaypal"),
  SiApplepodcasts: () => import("@icons-pack/react-simple-icons/icons/SiApplepodcasts"),
  SiArtstation: () => import("@icons-pack/react-simple-icons/icons/SiArtstation"),
  SiDailymotion: () => import("@icons-pack/react-simple-icons/icons/SiDailymotion"),
  SiEtsy: () => import("@icons-pack/react-simple-icons/icons/SiEtsy"),
  SiGitbook: () => import("@icons-pack/react-simple-icons/icons/SiGitbook"),
  SiKaggle: () => import("@icons-pack/react-simple-icons/icons/SiKaggle"),
  SiLinktree: () => import("@icons-pack/react-simple-icons/icons/SiLinktree"),
  SiNotion: () => import("@icons-pack/react-simple-icons/icons/SiNotion"),
  SiNpm: () => import("@icons-pack/react-simple-icons/icons/SiNpm"),
  SiGooglecolab: () => import("@icons-pack/react-simple-icons/icons/SiGooglecolab"),
  SiHackclub: () => import("@icons-pack/react-simple-icons/icons/SiHackclub"),
  SiLeetcode: () => import("@icons-pack/react-simple-icons/icons/SiLeetcode"),
  SiReplit: () => import("@icons-pack/react-simple-icons/icons/SiReplit"),
  SiStackexchange: () => import("@icons-pack/react-simple-icons/icons/SiStackexchange"),
};

const lazySimpleIcons = Object.fromEntries(
  Object.entries(simpleIconLoaders).map(([name, load]) => [name, lazy(load)])
) as Record<SimpleIconName, React.LazyExoticComponent<React.ComponentType<{ size?: number }>>>;

function LazySimpleIcon({name, size}: { name: SimpleIconName; size: number }) {
  const Icon = lazySimpleIcons[name];
  return (
    <Suspense fallback={null}>
      <Icon size={size}/>
    </Suspense>
  );
}

class SocialMediaIconConfig {
  names: string[];
  iconRenderer: (size: number) => React.ReactNode;
}

const socialMediaIconConfig: SocialMediaIconConfig[] = [
  {
    names: ['facebook', 'fb'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#1877F2] transition-all duration-200 ease-out hover:scale-110 hover:text-[#166FE5] active:scale-95">
        <LazySimpleIcon name="SiFacebook" size={size}/>
      </span>
    ),
  },

  {
    names: ['instagram', 'ig'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:scale-110 active:scale-95"
        style={{
          color: '#E4405F',
        }}
      >
        <LazySimpleIcon name="SiInstagram" size={size}/>
      </span>
    ),
  },

  {
    names: ['twitter', 'x', 'x.com'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-black transition-all duration-200 ease-out hover:scale-110 hover:text-neutral-600 active:scale-95">
        <LazySimpleIcon name="SiX" size={size}/>
      </span>
    ),
  },

  {
    names: ['youtube', 'yt'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FF0000] transition-all duration-200 ease-out hover:scale-110 hover:text-[#CC0000] active:scale-95">
        <LazySimpleIcon name="SiYoutube" size={size}/>
      </span>
    ),
  },

  {
    names: ['tiktok', 'tik tok'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#000000] transition-all duration-200 ease-out hover:scale-110 hover:text-[#FE2C55] active:scale-95">
        <LazySimpleIcon name="SiTiktok" size={size}/>
      </span>
    ),
  },

  {
    names: ['threads'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-black transition-all duration-200 ease-out hover:scale-110 hover:text-neutral-600 active:scale-95">
        <LazySimpleIcon name="SiThreads" size={size}/>
      </span>
    ),
  },

  {
    names: ['bluesky', 'bsky'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#1185FE] transition-all duration-200 ease-out hover:scale-110 hover:text-[#0066CC] active:scale-95">
        <LazySimpleIcon name="SiBluesky" size={size}/>
      </span>
    ),
  },

  {
    names: ['mastodon'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#6364FF] transition-all duration-200 ease-out hover:scale-110 hover:text-[#4F50D8] active:scale-95">
        <LazySimpleIcon name="SiMastodon" size={size}/>
      </span>
    ),
  },

  {
    names: ['reddit'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FF4500] transition-all duration-200 ease-out hover:scale-110 hover:text-[#D93F00] active:scale-95">
        <LazySimpleIcon name="SiReddit" size={size}/>
      </span>
    ),
  },

  {
    names: ['pinterest', 'pin'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#E60023] transition-all duration-200 ease-out hover:scale-110 hover:text-[#BD081C] active:scale-95">
        <LazySimpleIcon name="SiPinterest" size={size}/>
      </span>
    ),
  },

  {
    names: ['snapchat', 'snap'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FFFC00] transition-all duration-200 ease-out hover:scale-110 hover:text-[#CCC900] active:scale-95">
        <LazySimpleIcon name="SiSnapchat" size={size}/>
      </span>
    ),
  },

  {
    names: ['whatsapp', 'wa'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#25D366] transition-all duration-200 ease-out hover:scale-110 hover:text-[#1DA851] active:scale-95">
        <LazySimpleIcon name="SiWhatsapp" size={size}/>
      </span>
    ),
  },

  {
    names: ['telegram', 'tg'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#26A5E4] transition-all duration-200 ease-out hover:scale-110 hover:text-[#168AC1] active:scale-95">
        <LazySimpleIcon name="SiTelegram" size={size}/>
      </span>
    ),
  },

  {
    names: ['discord'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#5865F2] transition-all duration-200 ease-out hover:scale-110 hover:text-[#4752C4] active:scale-95">
        <LazySimpleIcon name="SiDiscord" size={size}/>
      </span>
    ),
  },

  {
    names: ['messenger', 'facebook messenger'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:scale-110 active:scale-95"
        style={{
          color: '#0084FF',
        }}
      >
        <LazySimpleIcon name="SiMessenger" size={size}/>
      </span>
    ),
  },

  {
    names: ['signal'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#3A76F0] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiSignal" size={size}/>
      </span>
    ),
  },

  {
    names: ['line'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#00C300] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiLine" size={size}/>
      </span>
    ),
  },

  {
    names: ['wechat'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#07C160] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiWechat" size={size}/>
      </span>
    ),
  },

  {
    names: ['github', 'gh'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#181717] transition-all duration-200 ease-out hover:scale-110 hover:text-[#333333] active:scale-95">
        <LazySimpleIcon name="SiGithub" size={size}/>
      </span>
    ),
  },

  {
    names: ['gitlab'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FC6D26] transition-all duration-200 ease-out hover:scale-110 hover:text-[#E24329] active:scale-95">
        <LazySimpleIcon name="SiGitlab" size={size}/>
      </span>
    ),
  },

  {
    names: ['stackoverflow', 'stack overflow', 'so'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#F48024] transition-all duration-200 ease-out hover:scale-110 hover:text-[#D66F1C] active:scale-95">
        <LazySimpleIcon name="SiStackoverflow" size={size}/>
      </span>
    ),
  },

  {
    names: ['dev.to', 'devto', 'dev'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-black transition-all duration-200 ease-out hover:scale-110 hover:text-neutral-600 active:scale-95">
        <LazySimpleIcon name="SiDevdotto" size={size}/>
      </span>
    ),
  },

  {
    names: ['codeforces'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#1F8ACB] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiCodeforces" size={size}/>
      </span>
    ),
  },

  {
    names: ['hackerrank', 'hacker rank'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#00EA64] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiHackerrank" size={size}/>
      </span>
    ),
  },

  {
    names: ['hashnode'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#2962FF] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiHashnode" size={size}/>
      </span>
    ),
  },

  {
    names: ['twitch'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#9146FF] transition-all duration-200 ease-out hover:scale-110 hover:text-[#772CE8] active:scale-95">
        <LazySimpleIcon name="SiTwitch" size={size}/>
      </span>
    ),
  },

  {
    names: ['kick'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#53FC18] transition-all duration-200 ease-out hover:scale-110 hover:text-[#3DD10D] active:scale-95">
        <LazySimpleIcon name="SiKick" size={size}/>
      </span>
    ),
  },

  {
    names: ['spotify'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#1DB954] transition-all duration-200 ease-out hover:scale-110 hover:text-[#1AA34A] active:scale-95">
        <LazySimpleIcon name="SiSpotify" size={size}/>
      </span>
    ),
  },

  {
    names: ['soundcloud'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FF5500] transition-all duration-200 ease-out hover:scale-110 hover:text-[#CC4400] active:scale-95">
        <LazySimpleIcon name="SiSoundcloud" size={size}/>
      </span>
    ),
  },

  {
    names: ['vimeo'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#1AB7EA] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiVimeo" size={size}/>
      </span>
    ),
  },

  {
    names: ['bilibili'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#00AEEC] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiBilibili" size={size}/>
      </span>
    ),
  },

  {
    names: ['dribbble'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#EA4C89] transition-all duration-200 ease-out hover:scale-110 hover:text-[#C32361] active:scale-95">
        <LazySimpleIcon name="SiDribbble" size={size}/>
      </span>
    ),
  },

  {
    names: ['behance'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#1769FF] transition-all duration-200 ease-out hover:scale-110 hover:text-[#0057FF] active:scale-95">
        <LazySimpleIcon name="SiBehance" size={size}/>
      </span>
    ),
  },

  {
    names: ['flickr'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FF0084] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiFlickr" size={size}/>
      </span>
    ),
  },

  {
    names: ['tumblr'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#36465D] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiTumblr" size={size}/>
      </span>
    ),
  },

  {
    names: ['patreon'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FF424D] transition-all duration-200 ease-out hover:scale-110 hover:text-[#E23A44] active:scale-95">
        <LazySimpleIcon name="SiPatreon" size={size}/>
      </span>
    ),
  },

  {
    names: ['buymeacoffee', 'buy me a coffee', 'bmac'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FFDD00] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiBuymeacoffee" size={size}/>
      </span>
    ),
  },

  {
    names: ['kofi', 'ko-fi'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FF5E5B] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiKofi" size={size}/>
      </span>
    ),
  },

  {
    names: ['medium'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-black transition-all duration-200 ease-out hover:scale-110 hover:text-neutral-600 active:scale-95">
        <LazySimpleIcon name="SiMedium" size={size}/>
      </span>
    ),
  },

  {
    names: ['quora'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#B92B27] transition-all duration-200 ease-out hover:scale-110 hover:text-[#8E211E] active:scale-95">
        <LazySimpleIcon name="SiQuora" size={size}/>
      </span>
    ),
  },

  {
    names: ['goodreads'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#372213] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiGoodreads" size={size}/>
      </span>
    ),
  },

  {
    names: ['letterboxd'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#00E054] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiLetterboxd" size={size}/>
      </span>
    ),
  },

  {
    names: ['steam'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#171A21] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiSteam" size={size}/>
      </span>
    ),
  },

  {
    names: ['producthunt', 'product hunt', 'ph'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#DA552F] transition-all duration-200 ease-out hover:scale-110 hover:text-[#B64225] active:scale-95">
        <LazySimpleIcon name="SiProducthunt" size={size}/>
      </span>
    ),
  },

  {
    names: ['vk', 'vkontakte'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#0077FF] transition-all duration-200 ease-out hover:scale-110 hover:text-[#0066DD] active:scale-95">
        <LazySimpleIcon name="SiVk" size={size}/>
      </span>
    ),
  },

  {
    names: ['douban'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#00B51D] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiDouban" size={size}/>
      </span>
    ),
  },

  {
    names: ['zhihu'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#0084FF] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiZhihu" size={size}/>
      </span>
    ),
  },

  {
    names: ['odnoklassniki', 'ok.ru', 'ok'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#EE8208] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiOdnoklassniki" size={size}/>
      </span>
    ),
  },

  {
    names: ['google'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer transition-all duration-200 ease-out hover:scale-110 active:scale-95"
        style={{
          color: '#4285F4',
        }}
      >
        <LazySimpleIcon name="SiGoogle" size={size}/>
      </span>
    ),
  },

  {
    names: ['apple', 'apple id'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-black transition-all duration-200 ease-out hover:scale-110 hover:text-neutral-600 active:scale-95">
        <LazySimpleIcon name="SiApple" size={size}/>
      </span>
    ),
  },

  {
    names: ['gmail', 'google mail'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#EA4335] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiGmail" size={size}/>
      </span>
    ),
  },

  {
    names: ['rss', 'feed', 'rss feed'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#F26522] transition-all duration-200 ease-out hover:scale-110 hover:text-[#D9541B] active:scale-95">
        <LazySimpleIcon name="SiRss" size={size}/>
      </span>
    ),
  },

  {
    names: ['linkedin', 'linkedin.com', 'in'],
    iconRenderer: (size) => (
      <span
        aria-hidden="true"
        className="inline-flex items-center justify-center rounded-[0.18em] bg-[#0A66C2] px-[0.16em] font-bold leading-none text-white transition-transform duration-200 ease-out hover:scale-110 active:scale-95"
        style={{fontSize: size * 0.72}}
      >
        in
      </span>
    ),
  },

  {
    names: ['paypal', 'paypal.me'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#003087] transition-all duration-200 ease-out hover:scale-110 hover:text-[#002060] active:scale-95">
        <LazySimpleIcon name="SiPaypal" size={size}/>
      </span>
    ),
  },

  {
    names: ['apple podcasts', 'applepodcasts', 'podcasts'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#872EC4] transition-all duration-200 ease-out hover:scale-110 hover:text-[#6F24A4] active:scale-95">
        <LazySimpleIcon name="SiApplepodcasts" size={size}/>
      </span>
    ),
  },

  {
    names: ['artstation'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#13AFF0] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiArtstation" size={size}/>
      </span>
    ),
  },

  {
    names: ['dailymotion', 'daily motion'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#0A0A0A] transition-all duration-200 ease-out hover:scale-110 hover:text-neutral-600 active:scale-95">
        <LazySimpleIcon name="SiDailymotion" size={size}/>
      </span>
    ),
  },

  {
    names: ['etsy'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#F16521] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiEtsy" size={size}/>
      </span>
    ),
  },

  {
    names: ['gitbook'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#346DDB] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiGitbook" size={size}/>
      </span>
    ),
  },

  {
    names: ['kaggle'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#20BEFF] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiKaggle" size={size}/>
      </span>
    ),
  },

  {
    names: ['linktree', 'link tree'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#43E55E] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiLinktree" size={size}/>
      </span>
    ),
  },

  {
    names: ['notion'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-black transition-all duration-200 ease-out hover:scale-110 hover:text-neutral-600 active:scale-95">
        <LazySimpleIcon name="SiNotion" size={size}/>
      </span>
    ),
  },

  {
    names: ['npm'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#CB3837] transition-all duration-200 ease-out hover:scale-110 hover:text-[#A82D2E] active:scale-95">
        <LazySimpleIcon name="SiNpm" size={size}/>
      </span>
    ),
  },

  {
    names: ['google colab', 'googlecolab', 'colab'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#F9AB00] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiGooglecolab" size={size}/>
      </span>
    ),
  },

  {
    names: ['hack club', 'hackclub'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#EC3750] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiHackclub" size={size}/>
      </span>
    ),
  },

  {
    names: ['leetcode', 'leet code'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#FFA116] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiLeetcode" size={size}/>
      </span>
    ),
  },

  {
    names: ['replit'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#F26207] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiReplit" size={size}/>
      </span>
    ),
  },

  {
    names: ['stackexchange', 'stack exchange'],
    iconRenderer: (size) => (
      <span
        className="inline-flex items-center justify-center cursor-pointer text-[#1E5397] transition-all duration-200 ease-out hover:scale-110 active:scale-95">
        <LazySimpleIcon name="SiStackexchange" size={size}/>
      </span>
    ),
  },
];

function SocialLinks(
  {
    links,
    iconSize
  }: {
    links: { name: string, url: string }[],
    iconSize?: number;
  }
) {
  if (!links || links.length === 0) {
    return <></>;
  }

  return (
    <div className="flex flex-row flex-wrap justify-center gap-2.5">
      {
        links.map((link, index) => {
          const normalizedName = link.name.trim().toLowerCase();
          const config = socialMediaIconConfig.find(config => config.names.includes(normalizedName));
          if (!config) {
            return <></>;
          }
          return (
            <SmartLink
              key={`${normalizedName}-${link.url}-${index}`}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${link.name}`}
              title={link.name}
              className="inline-flex rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
            >
              {config.iconRenderer(iconSize || 20)}
            </SmartLink>
          );
        })
      }
    </div>
  );
}

export default SocialLinks;
