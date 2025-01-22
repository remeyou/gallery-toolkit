import { clsx, type ClassValue } from "clsx";
import { saveAs } from "file-saver";
import $ from "jquery";
import { twMerge } from "tailwind-merge";
import {
  LoadStatus,
  Origins,
  ResponseCode,
  SIDE_PANEL_CLOSED_ERROR,
  Z_INDEX_MAX,
} from "~constants";
import type { FormattedElement, ReqParams, ReqResponse } from "~typings";

/** Combine Class */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatElement = (el: Element): FormattedElement[] => {
  let list: FormattedElement[] = [];
  const obj: FormattedElement = {
    tagName: el.tagName,
    attributes: Object.fromEntries(
      Array.from(el.attributes).map((attr) => [attr.name, attr.value]),
    ),
  };
  if (el.childNodes) {
    Array.from(el.childNodes).map((node) => {
      if (node.nodeType === Node.TEXT_NODE && node.textContent) {
        obj.textContent
          ? obj.textContent.push(node.textContent)
          : (obj.textContent = [node.textContent]);
      }
    });
  }
  if (el.children) {
    Array.from(el.children).forEach((child) => {
      list = [...list, ...formatElement(child)];
    });
  }
  list.push(obj);
  return list;
};

function toast(content: string) {
  const $toast = $("<div>")
    .css({
      position: "fixed",
      top: "32px",
      right: "32px",
      zIndex: Z_INDEX_MAX,
      border: "1px solid red",
      padding: "16px",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
    })
    .text(content)
    .appendTo(document.body);
  setTimeout(() => {
    $toast.fadeOut("slow", () => {
      $toast.remove();
    });
  }, 3000);
}

export const sendMessage = async <T = unknown, R = unknown>(
  msg: ReqParams<T>,
): Promise<ReqResponse<R> | undefined> => {
  try {
    return await new Promise((resolve, reject) => {
      const timeLimit = setTimeout(() => {
        reject(SIDE_PANEL_CLOSED_ERROR);
      }, 500);
      chrome.runtime.sendMessage(msg, (resp: ReqResponse<R>) => {
        clearTimeout(timeLimit);
        resp?.code === ResponseCode.OK ? resolve(resp) : reject(resp);
      });
    });
  } catch (error) {
    console.error("sendMessage error: ", error);
    let msg: string;
    if (error === undefined) {
      msg = SIDE_PANEL_CLOSED_ERROR;
    } else if (typeof error !== "string") {
      msg = JSON.stringify(error, null, 2);
    } else {
      msg = error;
    }
    toast(msg);
  }
};

export const download = async (url?: string, filename?: string) => {
  try {
    if (!url) {
      throw new Error("The url did not exist.");
    }
    const resp = await fetch(url);
    const blob = await resp.blob();
    saveAs(blob, filename);
    return LoadStatus.Success;
  } catch (r) {
    console.error(`download() failed:
      The params are: ${url}, ${filename}.
      The reason was: ${r}`);
    return LoadStatus.Error;
  }
};

export const includes = <T = unknown>(
  array: T[],
  element: any,
): element is T => {
  return array.includes(element);
};

export function getLocation(tab: chrome.tabs.Tab) {
  if (tab.url) {
    return new URL(tab.url);
  }
  if (process.env.NODE_ENV === "development") {
    return new URL(Origins.Localhost);
  }
  return location;
}

/**
 * @returns Previous box shadow css string
 */
export const modifyBoxShadow = ($el: JQuery<HTMLElement>) => {
  const boxShadow = $el.css("boxShadow");
  $el.css({
    boxShadow: "0px 0px 50px 10px gray",
  });
  return boxShadow;
};

export const scaleLarge = (el: HTMLElement, delay: boolean) => {
  const { width, height, top, left, right, bottom } =
    el.getBoundingClientRect();
  const ratio = document.documentElement.clientHeight / height;
  const scaledTopOffset = (height / 2) * (ratio - 1) - top;
  let scaledXOffset = 0;
  const scaledWidthDiff = (width / 2) * (ratio - 1);
  if (scaledWidthDiff > left) {
    scaledXOffset = scaledWidthDiff - left;
  } else if (
    scaledWidthDiff - (document.documentElement.clientWidth - right) >
    0
  ) {
    scaledXOffset =
      document.documentElement.clientWidth - right - scaledWidthDiff;
  }
  const transitionDelay = delay ? " .5s" : "";
  $(el).css({
    position: "relative",
    "z-index": Z_INDEX_MAX,
    transform: `translate(${scaledXOffset}px, ${scaledTopOffset}px) scale(${ratio})`,
    boxShadow: `0 0 0 ${Math.max(top, right, bottom, left)}px rgba(0,0,0,0.5)`,
    transition: `transform .25s${transitionDelay}, box-shadow .25s${transitionDelay}`,
  });
};

export const scaleRestore = (
  $el: JQuery<HTMLElement>,
  originalCSS: JQuery.PlainObject<string>,
) => {
  $el.css({
    position: originalCSS.position,
    transform: originalCSS.transform,
    boxShadow: originalCSS["box-shadow"],
    transition: "transform .25s, box-shadow .25s",
  });
  setTimeout(() => $el.css({ zIndex: originalCSS["z-index"] }), 250);
};
