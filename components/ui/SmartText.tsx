"use client"

import React from 'react';
import HtmlRenderer from "@/components/ui/HtmlRenderer";
import {stripHtmlTags} from "@/lib/html";

type SmartTextProps = Omit<React.ComponentPropsWithoutRef<"span">, "children" | "dangerouslySetInnerHTML"> & {
  children: string;
};

const SmartText = (props: SmartTextProps) => {
  const {children, ...spanProps} = props;

  let replacedText = stripHtmlTags(children);

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  replacedText = replacedText.replace(emailRegex, (match) => {
    return `<a class="external-link" href="mailto:${match}">${match}</a>`;
  });

  const phoneRegex = /(\+?\d{1,4}[\s-])?(?:\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/g;
  replacedText = replacedText.replace(phoneRegex, (match) => {
    const telNumber = match.replace(/[\s-]/g, '');
    return `<a class="external-link" href="tel:${telNumber}">${match}</a>`;
  });

  const urlRegex = /(https?:\/\/\S+)/g;
  replacedText = replacedText.replace(urlRegex, (match) => {
    return `<a href="${match}" target="_blank" rel="noopener noreferrer">
      ${match}
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline" aria-hidden="true">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
      </svg>
    </a>`;
  });

  return <HtmlRenderer as="span" {...spanProps}>{replacedText}</HtmlRenderer>;
};

export default SmartText;
